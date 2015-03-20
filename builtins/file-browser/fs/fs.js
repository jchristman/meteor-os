FileSystem = function(def, user) {
    if (def === undefined || def === true) {
        this.root = this.defaultFS();
        this.CWD = this.internalFollowPath('root.FILES.0');
        this.FAVORITES = [ this.root, this.root.FILES[0] ];
    } else {
        this.root = undefined;
        this.CWD = this.root;
        this.FAVORITES = [];
    }
    this.CWD_DEP = new Tracker.Dependency;
    this.FAVORITES_DEP = new Tracker.Dependency;
    this.STATUS = new ReactiveVar(FileSystem.Status.Idle());
    
    // Create the file collection
    if (user) {
        var username = user.username;
    } else {
        var username = Meteor.user().username;
    }

    if (Meteor.isClient) {
        this.SUB_NAME = 'MeteorOS_FS_'+username;
        this.FS_COLLECTION = FS._collections[this.SUB_NAME];

        if (!this.FS_COLLECTION) {
            this.FS_COLLECTION = new FS.Collection(this.SUB_NAME, {
                stores : [new FS.Store.FileSystem(this.SUB_NAME, {})]   // On the client is just a shell
            });
        }
    } else {
        this.FS_COLLECTION = MeteorOS.FS.ensureServerFSCollectionExists(user);
    }
}

FileSystem.prototype.getFile = function(fileId) {
    var fsFile = this.FS_COLLECTION.findOne(fileId);
    return fsFile;
}

FileSystem.prototype.deleteFile = function(fileId) {
    this.FS_COLLECTION.remove(fileId);
}

FileSystem.prototype.upload = function(fsFile, file) {
    // Check to see if the file already exists
    // TODO: Might be a different file. Should check a hash
    if (fsFile._id) {
        var exists = this.FS_COLLECTION.findOne(fsFile._id);
        if (exists) return exists;
    }

    this.FS_COLLECTION.insert(fsFile, function(err, fileObj) {
        if (err) {
            MeteorOS.Alerts.Error('Error inserting file ' + fsFile.name() + '! \n' + err);
        } else {
            file.file(fileObj);
        }
    });
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

FileSystem.prototype.followPath = function(path) {
    if (path.charAt(path.length - 1) === '/') path = path.substring(0, path.length - 1); // eliminate trailing slash
    if (path.indexOf('/') === 0) path = path.substring(1); // Strip first slash
    return this.root.followPath(path);
}

FileSystem.prototype.save = function(prop, value, action, caller) {
    prop = 'root.' + prop;
    MeteorOS.FS.save(prop, value, action);
}

FileSystem.prototype.cd = function(dir) {
    if (dir instanceof FileSystem.Dir) {
        var internalPath = dir.internalPath();
        if (this.CWD.internalPath() !== internalPath) {
            var newCWD = this.internalFollowPath(internalPath);
            if (newCWD) {
                this.CWD = newCWD;
                this.CWD_DEP.changed();
            } else {
                MeteorOS.Alerts.Error('Invalid path!');
            }
        }
    } else {
        var path = dir;
        if (this.CWD.path() !== path) {
            var newCWD = this.followPath(path);
            if (newCWD) {
                this.CWD = newCWD;
                this.CWD_DEP.changed();
            } else {
                MeteorOS.Alerts.Error('Invalid path!');
            }
        }
    }
}

FileSystem.prototype.cwd = function() {
    this.CWD_DEP.depend();
    return this.CWD;
}

FileSystem.prototype.addFavorite = function(dir) {
    if (dir instanceof FileSystem.Dir || dir instanceof FileSystem.File) {
        this.FAVORITES.push(dir);
        this.FAVORITES_DEP.changed();
    } else {
        throw new Meteor.Error(502, 'Can only add FileSystem.Dir or FileSystem.File to favorites');
    }
}

FileSystem.prototype.favorites = function() {
    this.FAVORITES_DEP.depend();
    return this.FAVORITES;
}

FileSystem.unserialize = function(fs) {
    var newfs = new FileSystem(false);
    newfs.root = FileSystem.Dir.unserialize(fs.root, newfs);
    newfs.CWD = newfs.internalFollowPath(fs.cwd);
    newfs.FAVORITES = _.map(fs.favorites, function(fav) { return newfs.internalFollowPath(fav) });
    return newfs;
}

FileSystem.prototype.serialize = function() {
    return { root : this.root.serialize(), cwd : this.CWD.internalPath(), favorites : _.map(this.FAVORITES, function(fav) { return fav.internalPath(); }) };
}
