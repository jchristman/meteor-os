FileSystem.Dir = function(name, parent) {
    if (name == undefined) Meteor.Error('Must specify a name in the Dir constructor');
    
    this.parent = parent;
    if (name instanceof Object) {
        var dir = name;
        this.unserialize(dir);
    } else {
        this.NAME = new ReactiveVar(name);
        this.TYPE = new ReactiveVar(FileSystem.Types.Dir);
        this.SHARED = []; // A list of team IDs its shared with
        this.SHARED_DEP = new Tracker.Dependency;
        this.FILES = [];
        this.FILES_DEP = new Tracker.Dependency;
    }

    this.watch();
}

// -----------------------------------------------------------------//
//  Accessors/Mutators                                              //
// -----------------------------------------------------------------//
FileSystem.Dir.prototype.name = function(newVal) {
    if (newVal !== undefined) {
        this.NAME.set(newVal);
    } else {
        return this.NAME.get();
    }
}

FileSystem.Dir.prototype.type = function(newVal) {
    if (newVal !== undefined) {
        this.TYPE.set(newVal);
    } else {
        return this.TYPE.get();
    }
}

FileSystem.Dir.prototype.files = function() {
    this.FILES_DEP.depend();
    return this.FILES;
}

FileSystem.Dir.prototype.shared = function() {
    this.SHARED_DEP.depend();
    return this.SHARED;
}

FileSystem.Dir.prototype.addFile = function(file, save) {
    if (!(file instanceof FileSystem.File)) throw new Meteor.Error('Must only add FileSystem.File objects using .addFile');
    file.parent = this;
    this.FILES.push(file);

    if (save === undefined || save === true)
        this.save('FILES', file.serialize(), '$push');
}

FileSystem.Dir.prototype.addDir = function(dir, save) {
    if (!(dir instanceof FileSystem.Dir)) throw new Meteor.Error('Must only add FileSystem.Dir objects using .addDir');
    dir.parent = this;
    this.FILES.push(dir);
    if (save === undefined || save === true)
        this.save('files', dir.serialize(), '$push');
}

//TODO: Delete dir and file

// -----------------------------------------------------------------//
//   Internals                                                      //
// -----------------------------------------------------------------//
FileSystem.Dir.prototype.internalPath = function(path, caller) {
    if (path === undefined || caller === undefined) {
        return this.parent.internalPath('', this);
    } else {
        var index = this.findIndex(caller);

        if (index != -1) {
            if (path === '')    path = 'FILES.' + index;
            else                path = 'FILES.' + index + '.' + path;
            return this.parent.internalPath(path, this);
        } else {
            throw new Meteor.Error('Unable to find child file');
        }
    }
}

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
        return this.FILES[indexOfDir].internalFollowPath(path);
    }
}

FileSystem.Dir.prototype.path = function(path) {
    if (path === undefined) {
        return this.parent.path(this.name());
    } else {
        if (this.name() === '') return '/' + path;
        else                    return this.parent.path(this.name()) + '/' + path;
    }
}

FileSystem.Dir.prototype.findIndex = function(toFind) {
    // Find the index of the file who called save on us
    var index = -1;
    _.find(this.FILES, function(file) {
        index += 1;
        return file.name() === toFind.name();
    });
    return index;
}

FileSystem.Dir.prototype.find = function(toFind) {
    var index = this.findIndex(toFind);
    return this.files(index);
}

// -----------------------------------------------------------------//
//  Code for synchronizing to db                                    //
// -----------------------------------------------------------------//
FileSystem.Dir.prototype.watch = function() {
    this._watch('NAME', this.name);
    this._watch('TYPE', this.type);
}

FileSystem.Dir.prototype._watch = function(prop, func) {
    var self = this;
    Tracker.autorun(function(comp) {
        var val = func.call(self); // Reactive on the property
        if (!comp.firstRun) {
            console.log('Saving:',prop,val);
            self.save(prop, val, '$set');
        }
    });
}

FileSystem.Dir.prototype.save = function(prop, value, action, caller) {
    // Leaf node
    if (caller == undefined) {
        this.parent.save(prop, value, action, this);
    } else {
        var index = this.findIndex(caller);

        if (index != -1) {
            prop = 'FILES.' + index + '.' + prop;
            this.parent.save(prop, value, action, this);
        } else {
            throw new Meteor.Error('Unable to find child file');
        }
    }
}

// -----------------------------------------------------------------//
//  Serialize/Unserialize Code                                      //
// -----------------------------------------------------------------//
FileSystem.Dir.unserialize = function(dir, parent) {
    var newDir = new FileSystem.Dir(dir.NAME, parent);
    newDir.SHARED = dir.SHARED;
    _.each(dir.FILES, function(file) {
        if (file.TYPE == FileSystem.Types.File) newDir.FILES.push(FileSystem.File.unserialize(file, newDir)); // Unserialize each file in the array
        if (file.TYPE == FileSystem.Types.Dir)  newDir.FILES.push(FileSystem.Dir.unserialize(file, newDir)); // Unserialize each dir in the array
    });
    return newDir;
}

FileSystem.Dir.prototype.serialize = function() {
    var result = {
        NAME : this.name(),
        TYPE : this.type(),
        SHARED : this.SHARED,
        FILES : [

        ]
    }
    _.each(this.FILES, function(file) {
        result.FILES.push(file.serialize());
    });
    return result;
}
