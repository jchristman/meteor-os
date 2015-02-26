FileSystem.File = function(name) {
    if (name == undefined) Meteor.Error('Must specify a name in the File constructor');
    this.name = name;
    this.type = 2;
    this.shared = []; // A list of team IDs its shared with
}

FileSystem.File.prototype.serialize = function() {
    var result = {
        name : this.name,
        type : this.type,
        shared : this.shared,
    }
    return result;
}
