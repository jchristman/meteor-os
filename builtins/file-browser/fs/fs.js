FileSystem = function(def) {
    if (def === undefined || def === true) {
        this.root = this.defaultFS();
        this.CWD = this.internalFollowPath('root.FILES.0');
    } else {
        this.root = undefined;
        this.CWD = this.root;
    }
    this.CWD_DEP = new Tracker.Dependency;
}

FileSystem.prototype.defaultFS = function() {
    var root = new FileSystem.Dir('', this); // The root of the file system has no name and has this as a parent
    root.addDir(new FileSystem.Dir('home'), false);
    root.FILES[0].addDir(new FileSystem.Dir('test'), false);
    return root;
}

FileSystem.prototype.internalPath = function(path, caller) {
    if (path === '')    path = 'root';
    else                path = 'root.' + path;
    return path;
}

FileSystem.prototype.internalFollowPath = function(path) {
    if (path.lastIndexOf('root.',0) === 0) path = path.substring('root.'.length);
    else if (path.lastIndexOf('root',0) === 0) path = path.substring('root'.length);
    return this.root.internalFollowPath(path);
}

FileSystem.prototype.path = function(path) {
    if (path === '')    path = '/';
    return path;
}

FileSystem.prototype.save = function(prop, value, action, caller) {
    MeteorOS.FS.save(prop, value, action);
}

FileSystem.prototype.cd = function(path) {
    if (this.CWD.internalPath() !== path) {
        var newCWD = this.internalFollowPath(path);
        if (newCWD) {
            this.CWD = newCWD;
            this.CWD_DEP.changed();
        } else {
            throw new Meteor.Error(502, 'Invalid path');
        }
    }
}

FileSystem.prototype.cwd = function() {
    this.CWD_DEP.depend();
    return this.CWD;
}

FileSystem.unserialize = function(fs) {
    var newfs = new FileSystem(false);
    newfs.root = FileSystem.Dir.unserialize(fs.root, newfs);
    newfs.CWD = newfs.internalFollowPath(fs.cwd);
    return newfs;
}

FileSystem.prototype.serialize = function() {
    return { root : this.root.serialize(), cwd : this.CWD.internalPath() };
}

FileSystem.Types = {
    Dir : 1,
    File : 2
}
