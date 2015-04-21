MeteorOS.Team = {};

MeteorOS.Team.newTeam = function(team) {
    team.pending = _.reject(team.pending, function(user) { return user._id == team.owner._id });

    Meteor.call('MeteorOS_Team_newTeam', team, function(err, result) {
        var id = result;   
        Meteor.users.update({_id : Meteor.user()._id}, {$addToSet : { 'meteorOS.teams' : id}});

        _.each(team.pending, function(user) {
            Meteor.call('inviteUserToMeteorOSTeam', user, id);
        });
    });
}

MeteorOS.Team.updateTeam = function(team) {
    var p_team = MeteorOS.Team.Collection.findOne(team._id);
    if (p_team.owner._id != Meteor.user()._id) return;

    p_team.pending = p_team.pending.concat(team.pending); // Concatenate the pending lists
    p_team.pending = _.uniq(p_team.pending, function(item) { // And eliminate dups
        return item._id;
    });
    
    p_team.pending = _.reject(p_team.pending, function(user) { return user._id == p_team.owner._id });
    p_team.pending = _.reject(p_team.pending, function(user) { return _.findWhere(p_team.members, { _id: user._id }) != undefined });

    Meteor.call('MeteorOS_Team_updatePending', p_team._id, p_team.pending);
    
    _.each(p_team.pending, function(user) {
        Meteor.call('inviteUserToMeteorOSTeam', user, p_team._id);
    });
}

MeteorOS.Team.getTeams = function() {
    if (Meteor.isServer) {
    }
}

MeteorOS.Team.acceptInvite = function(team_id) {
    Meteor.call('acceptInviteToMeteorOSTeam',team_id);
}

MeteorOS.Team.declineInvite = function(team_id, user_id) {
    Meteor.call('declineInviteToMeteorOSTeam',team_id,user_id);
}

MeteorOS.Team.leaveTeam = function(team_id, user_id) {
    Meteor.call('leaveMeteorOSTeam', team_id, user_id);
}

MeteorOS.Team.deleteTeam = function(team_id) {
    Meteor.call('deleteMeteorOSTeam', team_id);
}
