MeteorOSTeamCollection = new Meteor.Collection('MeteorOSTeamCollection');

if (Meteor.isClient) {
    MeteorOSMyTeams = Meteor.subscribe('MeteorOSMyTeams');
}

if (Meteor.isServer) {
    Meteor.reactivePublish('MeteorOSMyTeams', function() {
        var user = Meteor.users.findOne({ _id : this.userId }, { reactive : true });
        if (user == undefined)
            return undefined;
        return MeteorOSTeamCollection.find( { _id : { $in : user.profile.MeteorOSTeams } } , { reactive : true } ); // Publish the records about all teams of which the user is a part
    });
}

MeteorOSTeamCollection.allow({
    insert: function (userId, settings) {
        var user = Meteor.users.findOne(userId);
        if (user == undefined)
            return false;
        return true;
    },
    update: function (userId, settings) {
        var user = Meteor.users.findOne(userId);
        if (user == undefined)
            return false;
        return (settings.owner == userId);
    }
});

