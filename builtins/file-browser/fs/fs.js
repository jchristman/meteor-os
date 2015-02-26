FileSystem = function() {
    this.root = this.defaultFS();
}

FileSystem.prototype.defaultFS = function() {
    var root = new FileSystem.Dir(''); // The root of the file system has no name
    root.addDir(new FileSystem.Dir('home'));
    return root;
}

MeteorOS.FS = new FileSystem();
