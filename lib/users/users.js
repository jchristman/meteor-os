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
