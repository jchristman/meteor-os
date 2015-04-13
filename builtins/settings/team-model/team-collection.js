MeteorOSTeamCollection = new Meteor.Collection('MeteorOSTeamCollection');

if (Meteor.isClient) {
    MeteorOSMyTeams = Meteor.subscribe('MeteorOSMyTeams');
    MeteorOSMyPendingTeams = Meteor.subscribe('MeteorOSMyPendingTeams');
}

if (Meteor.isServer) {
    Meteor.reactivePublish('MeteorOSMyTeams', function() {
        var user = Meteor.users.findOne({ _id : this.userId }, { reactive : true });
        if (user == undefined)
            return undefined;
        return MeteorOSTeamCollection.find( { _id : { $in : user.meteorOS.teams } } , { reactive : true } ); // Publish the records about all teams of which the user is a part
    });
    
    Meteor.reactivePublish('MeteorOSMyPendingTeams', function() {
        var user = Meteor.users.findOne({ _id : this.userId }, { reactive : true });
        if (user == undefined)
            return undefined;
        return MeteorOSTeamCollection.find( { _id : { $in : user.meteorOS.teamsPending } } , { reactive : true } ); // Publish the records about all teams of which the user is a part
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
        return (settings.owner._id == user._id);
    }
});

