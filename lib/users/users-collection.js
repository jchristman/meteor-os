UserCollection = new Meteor.Collection('UserCollection');

if (Meteor.isClient) {
    UserCollectionSubscription = Meteor.subscribe('UserCollection');
}

if (Meteor.isServer) {
    Meteor.publish('UserCollection', function() {
        var user = Meteor.users.findOne(this.userId);
        if (user == undefined)
            return undefined;
        return UserCollection.find({'_username' : user.username});
    });
}

UserCollection.allow({
    /*insert: function (userId, settings) {
        var user = Meteor.users.findOne(userId);
        if (user == undefined)
            return false;
        return (settings.username == user.username);
    },*/
    update: function (userId, settings) {
        var user = Meteor.users.findOne(userId);
        if (user == undefined)
            return false;
        return (settings._username == user.username);
    }
});
