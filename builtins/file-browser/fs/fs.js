FileSystem = function() {
    this.root = this.defaultFS();
    this.cwd = this.root;
}

FileSystem.prototype.defaultFS = function() {
    var root = new FileSystem.Dir(''); // The root of the file system has no name
    root.addDir(new FileSystem.Dir('home'));
    return root;
}

FileSystem.prototype.unserialize = function(root) {
    this.root = root.unserialize();
}

FileSystem.prototype.serialize = function() {
    return this.root.serialize();
}

FileSystem.Types = {
    Dir : 1,
    File : 2
}
