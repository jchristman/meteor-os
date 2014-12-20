MeteorOSUserManager = function() {
    this.user = undefined;   
}

MeteorOSUserManager.prototype.getUser = function(user) {
    if (user != undefined) {
        this.user = UserCollection.findOne({'_username' : user.username});
        if (Meteor.isServer && this.user == undefined) {
            this.user = this.createUser(user);
        }
    }
    return this.user;
}

MeteorOSUserManager.prototype.createUser = function(user) {
    var default_user = UserCollection.findOne({'default' : 'profile'});
    delete default_user._id;
    delete default_user.default;
    UserCollection.insert(_.extend({'_username' : user.username}, default_user));

    return UserCollection.findOne({'_username' : user.username});
}

MeteorOSUserManager.prototype.traverseFileTree = function(cwd) {
    if (cwd == '/') cwd = '';
    else            cwd = cwd.substring(1).split('/');
    var file_tree = this.user.fs;
    for (var i = 0; i < cwd.length; i++) {
        file_tree = file_tree.files;
        for (var j = 0; j < file_tree.length; j++) {

            if (file_tree[j].name == cwd[i]) {
                file_tree = file_tree[j];
                break;
            }

        }
    }
    return file_tree;
}

MeteorOSUserManager.prototype.getPath = function(cwd, file) {
    var path = '';
    if (cwd == '/') cwd = '';
    else            cwd = cwd.substring(1).split('/');
    if (file != undefined) cwd.push(file.name);
    var file_tree = this.user.fs;
    for (var i = 0; i < cwd.length; i++) {
        file_tree = file_tree.files;
        path += '.files';
        for (var j = 0; j < file_tree.length; j++) {
            if (file_tree[j].name == cwd[i]) {
                file_tree = file_tree[j];
                path += '.' + j
                break;
            }

        }
    }
    return path.substring(1);
}

MeteorOSUserManager.prototype.clearProgressbars = function(cwd) {
    var files = this.traverseFileTree(cwd).files;
    for (var i = 0; i < files.length; i++) {
        if (files[i].uploading != undefined) {
            delete files[i].uploading;
            this.updateFile(cwd, files[i]);
        }
    }
}

MeteorOSUserManager.prototype.addFile = function(cwd, file) {
    var filePath = this.getPath(cwd) + '.files';

    var update = {}
    update['fs.' + filePath] = file;

    UserCollection.update(this.user._id, {
        $push : update
    });
}

MeteorOSUserManager.prototype.updateFile = function(cwd, file) {
    var filePath = this.getPath(cwd, file);

    var update = {}
    update['fs.' + filePath] = file;

    UserCollection.update(this.user._id, {
        $set : update
    });
}

UserManager = new MeteorOSUserManager();

if (Meteor.isServer) {
    Meteor.startup(function() {
        UserCollection.remove({});
        var default_user = UserCollection.findOne({'default' : 'profile'});
        if (default_user == undefined)
            UserCollection.insert(DEFAULT_USER);
    });

    Accounts.validateLoginAttempt(function(attempt) {
        if (attempt.allowed)
            UserManager.getUser(attempt.user);
        return attempt.allowed;
    });
}
