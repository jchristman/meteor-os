FileSystem.Dir = function(name, parent) {
    if (name == undefined) Meteor.Error('Must specify a name in the Dir constructor');
    
    this.parent = parent;
    if (name instanceof Object) {
        var dir = name;
        this.unserialize(dir);
    } else {
        this.name = name;
        this.type = FileSystem.Types.Dir;
        this.shared = []; // A list of team IDs its shared with
        this.files = [];
    }

    this.watchDir();
}

FileSystem.Dir.prototype.addFile = function(file, save) {
    if (!(file instanceof FileSystem.File)) throw new Meteor.Error('Must only add FileSystem.File objects using .addFile');
    file.parent = this;
    this.files.push(file);

    if (save === undefined || save === true)
        this.save('files', file.serialize(), '$push');
}

FileSystem.Dir.prototype.addDir = function(dir, save) {
    if (!(dir instanceof FileSystem.Dir)) throw new Meteor.Error('Must only add FileSystem.Dir objects using .addDir');
    dir.parent = this;
    this.files.push(dir);
    if (save === undefined || save === true)
        this.save('files', dir.serialize(), '$push');
}

FileSystem.Dir.prototype.findIndex = function(toFind) {
    // Find the index of the file who called save on us
    var index = -1;
    _.find(this.files, function(file) {
        index += 1;
        return file.name == toFind.name;
    });
    return index;
}

FileSystem.Dir.prototype.find = function(toFind) {
    var index = this.findIndex(toFind);
    return this.files(index);
}

FileSystem.Dir.prototype.watchDir = function() {
    this.watch('name', this.watcher);
    this.watch('type', this.watcher);
}

FileSystem.Dir.prototype.watcher = function(prop, oldval, newval) {
    this.save(prop, newval, '$set');
    return newval;
}

FileSystem.Dir.prototype.save = function(prop, value, action, caller) {
    // Leaf node
    if (caller == undefined) {
        this.parent.save(prop, value, action, this);
    } else {
        var index = this.findIndex(caller);

        if (index != -1) {
            prop = 'files.' + index + '.' + prop;
            this.parent.save(prop, value, action, this);
        } else {
            throw new Meteor.Error('Unable to find child file');
        }
    }
}

FileSystem.Dir.unserialize = function(dir, parent) {
    var newDir = new FileSystem.Dir(dir.name, parent);
    newDir.shared = dir.shared;
    _.each(dir.files, function(file) {
        if (file.type == FileSystem.Types.File) newDir.files.push(FileSystem.File.unserialize(file, newDir)); // Unserialize each file in the array
        if (file.type == FileSystem.Types.Dir)  newDir.files.push(FileSystem.Dir.unserialize(file, newDir)); // Unserialize each dir in the array
    });
    return newDir;
}

FileSystem.Dir.prototype.serialize = function() {
    var result = {
        name : this.name,
        type : this.type,
        shared : this.shared,
        files : [

        ]
    }
    _.each(this.files, function(file) {
        result.files.push(file.serialize());
    });
    return result;
}
