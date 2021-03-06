FileSystem.Dir = function(name, options) {
    FileSystem.Type.call(this, name, options); // Super constructor

    options = options || {};
    
    this.TYPE = new ReactiveVar(FileSystem.Type.Dir);
    this.FILES = [];
    this.FILES_DEP = new Tracker.Dependency;

    this.UPLOADING = []
    this.UPLOADING_DEP = new Tracker.Dependency;
    this.UPLOADED = [];
    this.UPLOADED_DEP = new Tracker.Dependency;

    this._reloadTrackers();
}

FileSystem.Dir.prototype = Object.create(FileSystem.Type.prototype);
FileSystem.Dir.prototype.constructor = FileSystem.Dir;

// -----------------------------------------------------------------//
//  Accessors/Mutators                                              //
// -----------------------------------------------------------------//
FileSystem.Dir.prototype.files = function() {
    this.FILES_DEP.depend();
    return this.FILES;
}

FileSystem.Dir.prototype.addFile = function(file, save) {
    var self = this;

    if (!(file instanceof FileSystem.File)) throw new Meteor.Error('Must only add FileSystem.File objects using .addFile');
    
    if (self.find(file) !== undefined) { // Return false
        MeteorOS.Alerts.Error(file.name() + ' rejected - file must have unique file name.'); // TODO: automatically create unique file name
        return false;
    }

    file.parent = self;
    self.FILES.push(file);
    self.FILES_DEP.changed();

    if (self.UPLOADED.length === self.UPLOADING.length) {
        self.UPLOADED = [];
        self.UPLOADED_DEP.changed();
        self.UPLOADING = [];
        self.UPLOADING_DEP.changed();
    }

    // These shenanigans were necessary to keep track of how many files are uploading
    Tracker.autorun(function(comp) {
        var f = file.file();
        if (f) {
            if (f.isUploaded()) {
                self.UPLOADED.push(f);
                self.UPLOADED_DEP.changed();
                comp.stop();
            } else {
                var found = _.find(self.UPLOADING, function(upFile) {
                    return upFile._id === f._id;
                });
                if (found === undefined) {
                    self.UPLOADING.push(f);
                    self.UPLOADING_DEP.changed();
                }
            }
        }
    });

    if (save === undefined || save === true)
        this.save('FILES', file.serialize(), '$push');

    return true; // SUCCESS
}

FileSystem.Dir.prototype.removeFile = function(file) {
    var index = this.findIndex(file);
    this.FILES.splice(index, 1);
    this.FILES_DEP.changed();
    this.save('FILES', { NAME : file.name() }, '$pull'); // We are going to remove by name. Need to make sure we can't have duplicate names!!
}

FileSystem.Dir.prototype.addDir = function(dir, save) {
    if (!(dir instanceof FileSystem.Dir)) throw new Meteor.Error('Must only add FileSystem.Dir objects using .addDir');
    
    if (this.find(dir) !== undefined) { // Return false
        MeteorOS.Alerts.Error('File must have unique file name.'); // TODO: automatically create unique file name
        return false;
    }
    
    dir.parent = this;
    this.FILES.push(dir);
    this.FILES_DEP.changed();
    
    if (save === undefined || save === true)
        this.save('FILES', dir.serialize(), '$push');
}

FileSystem.Dir.prototype.removeDir = function(dir) {
    this.removeFile(dir);
}

FileSystem.Dir.prototype.delete = function() {
    var isRoot = this.parent.removeDir(this);
    if (isRoot) {
        MeteorOS.Alerts.Warning('You cannot remove the root directory');
    }
    delete this;
}

// -----------------------------------------------------------------//
//   Extra                                                          //
// -----------------------------------------------------------------//
FileSystem.Dir.prototype.info = function() {
    this.UPLOADING_DEP.depend();
    this.UPLOADED_DEP.depend();
    this.FILES_DEP.depend();

    if (this.UPLOADING.length !== 0) {
        return this.UPLOADED.length + '/' + this.UPLOADING.length + ' uploaded';
    } else {
        return this.FILES.length + ' files';
    }
}

// -----------------------------------------------------------------//
//   Internals                                                      //
// -----------------------------------------------------------------//
FileSystem.Dir.prototype.internalFollowPath = function(path) {
    if (path === '') {
        return this;
    } else {
        if (path.lastIndexOf('FILES.', 0) === 0) path = path.substring('FILES.'.length);
        var indexOfFirstPeriod = path.indexOf('.');
        if (indexOfFirstPeriod === -1) {
           var indexOfDir = parseInt(path);
           path = '';
        } else {
           var indexOfDir = parseInt(path.substring(0, indexOfFirstPeriod));
           path = path.substring(indexOfFirstPeriod + 1);
        }
        if (indexOfDir >= this.FILES.length) return undefined;
        return this.FILES[indexOfDir].internalFollowPath(path);
    }
}

FileSystem.Dir.prototype.followPath = function(path) {
    if (path === '') {
        return this;
    } else {
        var next = path.indexOf('/');
        if (next === -1) next = path.length;
        var fileName = path.substring(0, next);
        var dir = this.find(fileName);
        if (dir !== undefined) {
            return dir.followPath(path.substring(next + 1));
        } else {
            return undefined;
        }
    }
}

FileSystem.Dir.prototype.findIndex = function(toFind) {
    // Find the index of the file who called save on us
    var index = -1;
    if (toFind instanceof FileSystem.Dir || toFind instanceof FileSystem.File) {
        var found = _.find(this.FILES, function(file) {
            index += 1;
            return file.name() === toFind.name();
        });
        if (found === undefined) return undefined;
    } else if (toFind instanceof Object) {
        var found = _.find(this.FILES, function(file) {
            index += 1;
            return file.name() === toFind.name;
        });
        if (found === undefined) return undefined;
    } else {
        var found = _.find(this.FILES, function(file) {
            index += 1;
            return file.name() === toFind;
        });
        if (found === undefined) return undefined;
    }
    return index;
}

FileSystem.Dir.prototype.find = function(toFind) {
    var index = this.findIndex(toFind);
    if (index !== undefined) {
        var files = this.files();
        return files[index];
    } else {
        return undefined;
    }
}

// -----------------------------------------------------------------//
//  Code for synchronizing to db                                    //
// -----------------------------------------------------------------//
FileSystem.Dir.prototype._reloadTrackers = function() {
    FileSystem.Type.prototype._reloadTrackers.call(this);
    this.watch('TYPE');

    _.each(this.FILES, function(file) {
        file._reloadTrackers();
    });
}

FileSystem.Dir.prototype.save = function(prop, value, action, caller, callback) {
    // Leaf node
    if (caller == undefined) {
        this.parent.save(prop, value, action, this, callback);
    } else {
        var index = this.findIndex(caller);

        if (index !== undefined) {
            prop = 'FILES.' + index + '.' + prop;
            this.parent.save(prop, value, action, this, callback);
        } else {
            throw new Meteor.Error('Unable to find child file');
        }
    }
}

// -----------------------------------------------------------------//
//  Serialize/Unserialize Code                                      //
// -----------------------------------------------------------------//
FileSystem.Dir.unserialize = function(dir, parent) {
    var newDir = new FileSystem.Dir(dir.NAME, { 'parent' : parent });
    newDir.SHARED = dir.SHARED;
    newDir.OWNER.set(dir.OWNER);
    _.each(dir.FILES, function(file) {
        if (file.TYPE === FileSystem.Type.File) newDir.FILES.push(FileSystem.File.unserialize(file, newDir)); // Unserialize each file in the array
        if (file.TYPE === FileSystem.Type.Dir)  newDir.FILES.push(FileSystem.Dir.unserialize(file, newDir)); // Unserialize each dir in the array
    });
    return newDir;
}

FileSystem.Dir.prototype.serialize = function() {
    var result = {
        NAME : this.name(),
        TYPE : this.type(),
        OWNER : this.owner(),
        SHARED : this.SHARED,
        FILES : [

        ]
    }
    _.each(this.FILES, function(file) {
        result.FILES.push(file.serialize());
    });
    return result;
}
