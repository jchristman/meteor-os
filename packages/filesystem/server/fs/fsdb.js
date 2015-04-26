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

Meteor.methods({
    MeteorOS_FS_save: function(key, val, action) {
        check(key, String);
        // val is checked by the validation methods
        check(action, String);

        // Check to see if the action was called from the client. If so, we need to do some checks...
        if (this.connection) {
            console.log('Validating',key,val,action);
            try {
                var valid = MeteorOS.FS.validate.call(this, key, val, action);
                if (!valid)
                    throw new Meteor.Error('Validation Error', 'Action: ' + action + ', Key: ' + key + ', Value: ' + val);
            } catch (err) {
                if (err instanceof Match.Error) {
                    throw new Meteor.Error('Validation Error', err.message);
                } else {
                    throw err;
                }
            }
        }

        key = 'meteorOS.fs.' + key;

        var update = {};
        update[action] = {}
        update[action][key] = val;

        console.log('MeteorOS.FS - Saving:', update);

        Meteor.users.update({ _id : this.userId }, update);
        return true;
    },

    MeteorOS_FS_share: function(file) {
        
    }
});
