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
MeteorOS.FS.CHANGED = new Tracker.Dependency;

MeteorOS.FS.save = function(key, val, action) {
    key = 'profile.fs.' + key;

    var update = {};
    update[action] = {}
    update[action][key] = val;

    Meteor.users.update({ _id : Meteor.userId() }, update);
    
    MeteorOS.FS.changed();
}

MeteorOS.FS.load = function() {
    return FileSystem.unserialize(Meteor.user().profile.fs);
}

MeteorOS.FS.changed = function() {
    MeteorOS.FS.CHANGED.changed(); // Fire anything that depends on the FS
}

// This is the function that you can call from blaze to get a reactive object that represents the filesystem.
// TODO: Make this more efficient. Right now it unserializes the profile fs every time.
MeteorOS.FS.current = function() {
    MeteorOS.FS.CHANGED.depend();
    return MeteorOS.FS.load();
}
