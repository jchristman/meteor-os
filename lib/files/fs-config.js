MeteorOS_FS = new FS.Collection('MeteorOS_FS', {
    stores : [new FS.Store.FileSystem('MeteorOS_FS')]
});

if (Meteor.isClient) {
    fsSubscription = Meteor.subscribe('MeteorOS_FS');
}

if (Meteor.isServer) {
    Meteor.publish('MeteorOS_FS', function() {
        return MeteorOS_FS.find();
    });
}   

MeteorOS_FS.allow({
    download: function(userId, file) {
        console.log(userId, file.owner);
        return true;
    },

    'insert' : function(userId, doc) {
        return true;
    },

    'update' : function(userId, doc) {
        return true;
    },

    'remove' : function(userId, doc) {
        return true;
    }
});
