MeteorOS.Team.Publications = {};
MeteorOS.Team.Publications._pubs = [
    Meteor.reactivePublish('MeteorOS_Team_MyTeams', function() {
        var user = Meteor.users.findOne({ _id : this.userId }, { reactive : true });
        if (user == undefined)
            return undefined;
        return MeteorOS.Team.Collection.find( { _id : { $in : user.meteorOS.teams } } , { reactive : true } );
    }),

    Meteor.reactivePublish('MeteorOS_Team_MyPendingTeams', function() {
        var user = Meteor.users.findOne({ _id : this.userId }, { reactive : true });
        if (user == undefined)
            return undefined;
        return MeteorOS.Team.Collection.find( { _id : { $in : user.meteorOS.teamsPending } } , { reactive : true } );
    })
]

/* This is theoretically unneeded with only server methods
MeteorOS.Team.Collection.allow({
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
*/
