FileSystem.Dir = function(name) {
    if (name == undefined) Meteor.Error('Must specify a name in the Dir constructor');
    this.name = name;
    this.type = 1;
    this.shared = []; // A list of team IDs its shared with
    this.files = [];
}

FileSystem.Dir.prototype.addFile = function(file) {
    if (!(file instanceof FileSystem.File)) Meteor.Error('Must only add FileSystem.File objects using .addFile');
    this.files.push(file);
}

FileSystem.Dir.prototype.addDir = function(dir) {
    if (!(dir instanceof FileSystem.Dir)) Meteor.Error('Must only add FileSystem.Dir objects using .addDir');
    this.files.push(dir);
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
