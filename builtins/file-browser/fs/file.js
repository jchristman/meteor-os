FileSystem.File = function(name, parent) {
    if (name == undefined) Meteor.Error('Must specify a name in the File constructor');

    this.parent = parent;
    this.name = name;
    this.type = FileSystem.Types.File;
    this.shared = []; // A list of team IDs its shared with

    this.watchFile();
}

FileSystem.File.prototype.watchFile = function() {
    this.watch('name', this.watcher);
    this.watch('type', this.watcher);
}

FileSystem.File.prototype.watcher = function(prop, oldval, newval) {
    this.save(prop, newval, '$set');
    return newval;
}

FileSystem.File.prototype.save = function(prop, newval, action) {
    this.parent.save(prop, newval, action, this);
}

FileSystem.File.unserialize = function(file, parent) {
    var newFile = new FileSystem.File(file.name, parent);
    newFile.shared = file.shared;
    return newFile;
}

FileSystem.File.prototype.serialize = function() {
    var result = {
        name : this.name,
        type : this.type,
        shared : this.shared,
    }
    return result;
}
