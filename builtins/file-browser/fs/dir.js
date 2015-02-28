FileSystem.Dir = function(name) {
    if (name == undefined) Meteor.Error('Must specify a name in the Dir constructor');

    if (name instanceof Object) {
        var dir = name;
        this.unserialize(dir);
    } else {
        this.name = name;
        this.type = FileSystem.Types.Dir;
        this.shared = []; // A list of team IDs its shared with
        this.files = [];
    }
}

FileSystem.Dir.prototype.addFile = function(file) {
    if (!(file instanceof FileSystem.File)) Meteor.Error('Must only add FileSystem.File objects using .addFile');
    this.files.push(file);
}

FileSystem.Dir.prototype.addDir = function(dir) {
    if (!(dir instanceof FileSystem.Dir)) Meteor.Error('Must only add FileSystem.Dir objects using .addDir');
    this.files.push(dir);
}

FileSystem.Dir.prototype.unserialize = function(dir) {
    this.name = dir.name;
    this.type = dir.type;
    this.shared = dir.shared;
    this.files = [];
    _.each(dir.files, function(file) {
        if (file.type == FileSystem.Types.File) this.files.push(new FileSystem.File(file)); // Unserialize each file in the array
        if (file.type == FileSystem.Types.Dir)  this.files.push(new FileSystem.Dir(file)); // Unserialize each file in the array
    });
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
