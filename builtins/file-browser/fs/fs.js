FileSystem = function(def) {
    if (def === undefined || def === true) this.root = this.defaultFS();
    else this.root = undefined;
    this.cwd = this.root;
}

FileSystem.prototype.defaultFS = function() {
    var root = new FileSystem.Dir('', this); // The root of the file system has no name and has this as a parent
    root.addDir(new FileSystem.Dir('home'), false);
    root.files[0].addDir(new FileSystem.Dir('test'), false);
    return root;
}

FileSystem.prototype.save = function(prop, value, action, caller) {
    MeteorOS.FS.save(prop, value, action);
}

FileSystem.unserialize = function(fs) {
    var newfs = new FileSystem(false);
    newfs.root = FileSystem.Dir.unserialize(fs, newfs);
    newfs.cwd = newfs.root;
    return newfs;
}

FileSystem.prototype.serialize = function() {
    return this.root.serialize();
}

FileSystem.Types = {
    Dir : 1,
    File : 2
}
