/*
 *  The FS for a particular user is accessible at their profile.fs and can be
 *  unserialized into a FileSystem object
 */
MeteorOS.FS = {};

if (Meteor.isServer) {
    MeteorOS.onCreateUser(function(options, user) {
        _.extend(user.meteorOS, { fs : (new FileSystem(undefined, user)).serialize() });
        return user;
    });

    Accounts.onLogin(function(user) {
        if (user.user) user = user.user;
        if (user) {
            MeteorOS.FS.ensureServerFSCollectionExists(user);
        }
    });

    MeteorOS.FS.ensureServerFSCollectionExists = function(user) {
        var unique_name = 'MeteorOS_FS_'+user.username;
        var collection = FS._collections[unique_name];
        if (!collection) {
            var fileStore = new FS.Store.FileSystem(unique_name, {
                //path : process.env.PWD + '/.meteor/local/users/' + user.username + '/files'
                path : '/tmp/users/' + user.username + '/files'
            });
            collection = new FS.Collection(unique_name, {
                stores : [fileStore]
            });
            collection.allow({
                insert : function() { return true; },
                update : function() { return true; },
                remove : function() { return true; },
                download : function() { return true; }
            });
        }
        if (!(unique_name in Meteor.server.publish_handlers)) {
            Meteor.publish(unique_name, function() {
                return collection.find(); // No need to check usernames since they only have access to the collection associated by their user
            });
        }
        return collection;
    }

}

MeteorOS.FS.CURRENT = undefined;
MeteorOS.FS.CURRENT_USER = undefined;

MeteorOS.FS.save = function(key, val, action) {
    key = 'meteorOS.fs.' + key;

    var update = {};
    update[action] = {}
    update[action][key] = val;

    console.log('Saving:',update);

    Meteor.users.update({ _id : Meteor.userId() }, update);
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
