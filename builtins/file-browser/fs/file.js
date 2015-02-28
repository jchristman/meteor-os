FileSystem.File = function(name) {
    if (name == undefined) Meteor.Error('Must specify a name in the File constructor');

    if (name instanceof Object) {
        var file = name;
        this.unserialize(file);
    } else {
        this.name = name;
        this.type = 2;
        this.shared = []; // A list of team IDs its shared with
    }
}

FileSystem.File.prototype.unserialize = function(file) {
    this.name = file.name;
    this.type = file.type;
    this.shared = file.shared;
}

FileSystem.File.prototype.serialize = function() {
    var result = {
        name : this.name,
        type : this.type,
        shared : this.shared,
    }
    return result;
}
