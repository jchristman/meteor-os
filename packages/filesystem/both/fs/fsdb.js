/*
 *  The FS for a particular user is accessible at their profile.fs and can be
 *  unserialized into a FileSystem object
 */
MeteorOS.FS = {};

MeteorOS.FS.CURRENT = undefined;
MeteorOS.FS.CURRENT_USER = undefined;

MeteorOS.FS.save = function(key, val, action, callback) {
    if (callback) Meteor.call('MeteorOS_FS_save', key, val, action, callback);
    else Meteor.call('MeteorOS_FS_save', key, val, action, function(err, result) {
        err && MeteorOS.Alerts.Error(err);   
    });
}

MeteorOS.FS._load = function() {
    if (Meteor.isClient) {
        var user_data = Meteor.user().meteorOS;
        if (user_data) return FileSystem.unserialize(user_data.fs);
        else return undefined;
    }
}

MeteorOS.FS.load = function() {
    MeteorOS.FS.CURRENT = MeteorOS.FS._load();
    MeteorOS.FS.CURRENT_USER = Meteor.user()._id;
}

// This is the function that you can call from blaze to get a reactive object that represents the filesystem.
MeteorOS.FS.current = function(reload) {
    if (MeteorOS.FS.CURRENT === undefined || (Meteor.user() && Meteor.user()._id !== MeteorOS.FS.CURRENT_USER)) {
        MeteorOS.FS.load();
    }
    reload && MeteorOS.FS.CURRENT && MeteorOS.FS.CURRENT._reloadTrackers();
    return MeteorOS.FS.CURRENT;
}
