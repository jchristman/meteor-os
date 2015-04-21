MeteorOS.Team.Subscriptions = {};
MeteorOS.Team.Subscriptions._subs = [
    Meteor.subscribe('MeteorOS_Team_MyTeams'),
    Meteor.subscribe('MeteorOS_Team_MyPendingTeams')
];
MeteorOS.Team.Subscriptions.ready = function() {
    var ready = true;
    _.each(MeteorOS.Team.Subscriptions._subs, function(sub) {
        ready = ready && sub.ready();
    });
    return ready;
}

