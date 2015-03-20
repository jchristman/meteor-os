FileSystem.Dir = function(name, parent) {
    FileSystem.Type.call(this, name, parent); // Super constructor
    
    this.TYPE = new ReactiveVar(FileSystem.Type.Dir);
    this.FILES = [];
    this.FILES_DEP = new Tracker.Dependency;

    this.watch('TYPE');
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
        this.save('FILES', dir.serialize(), '$push');
}

FileSystem.Dir.prototype.delete = function() {
    MeteorOS.Alerts.NotImplemented();
}

//TODO: Delete dir and file

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
FileSystem.Dir.prototype.save = function(prop, value, action, caller) {
    // Leaf node
    if (caller == undefined) {
        this.parent.save(prop, value, action, this);
    } else {
        var index = this.findIndex(caller);

        if (index !== undefined) {
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
        if (file.TYPE === FileSystem.Type.File) newDir.FILES.push(FileSystem.File.unserialize(file, newDir)); // Unserialize each file in the array
        if (file.TYPE === FileSystem.Type.Dir)  newDir.FILES.push(FileSystem.Dir.unserialize(file, newDir)); // Unserialize each dir in the array
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
