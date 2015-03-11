/*
 *  The FS for a particular user is accessible at their profile.fs and can be
 *  unserialized into a FileSystem object
 */

if (Meteor.isServer) {
    MeteorOS.onCreateUser(function(options, user) {
        if (user.profile == undefined) user.profile = {};
        if (options.email == undefined) options.email = '';
        _.extend(user.profile, { fs : (new FileSystem()).serialize() });
        return user;
    });
}

MeteorOS.FS = {};
MeteorOS.FS.save = function(key, val, action) {
    key = 'profile.fs.' + key;

    var update = {};
    update[action] = {}
    update[action][key] = val;

    Meteor.users.update({ _id : Meteor.userId() }, update);
}

MeteorOS.FS.load = function() {
    return FileSystem.unserialize(Meteor.user().profile.fs);
}
