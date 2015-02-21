TeamModel = function() {

}

TeamModel.prototype.newTeam = function(team) {
    // TODO: Validate the data
    var id = MeteorOSTeamCollection.insert(team);
    Meteor.users.update({_id : Meteor.user()._id}, {$addToSet : { 'profile.MeteorOSTeams' : id}});
    _.each(team.pending, function(user) {
        Meteor.call('inviteUserToMeteorOSTeam', user, id);
    });
}

if (Meteor.isServer) {
    Meteor.methods({
        inviteUserToMeteorOSTeam : function(user, team_id) {
            Meteor.users.update({_id : user._id}, {$addToSet : { 'profile.MeteorOSTeamsPending' : team_id}});
        },

        acceptInviteToMeteorOSTeam : function(team_id) {
            var user = Meteor.users.findOne(this.userId);
            if (user == undefined) return;
            var index = -1;
            _.find(user.profile.MeteorOSTeamsPending, function(pending_team_id) {
                index += 1;
                return pending_team_id == team_id;
            });
            if (index > -1) {
                // Remove the team from pending
                user.profile.MeteorOSTeamsPending.splice(index,1);
                // Add it to confirmed
                user.profile.MeteorOSTeams.push(team_id);
                Meteor.users.update({_id : user._id}, user);

                // Update the team
                var team = MeteorOSTeamCollection.findOne(team_id);
                index = -1;
                _.find(team.pending, function(pending_user) {
                    index += 1;
                    return pending_user._id == user._id;
                });
                if (index > -1) {
                    // Remove the user from pending
                    var pending_user = team.pending.splice(index,1);
                    // Add the user to members
                    team.members.push(pending_user);
                    MeteorOSTeamCollection.update({_id : team._id}, team);
                }
            }
        },

        declineInviteToMeteorOSTeam : function(team_id) {
            var user = Meteor.users.findOne(this.userId);
            if (user == undefined) return;
            var index = -1;
            _.find(user.profile.MeteorOSTeamsPending, function(pending_team_id) {
                index += 1;
                return pending_team_id == team_id;
            });
            if (index > -1) {
                // Remove the team from pending
                user.profile.MeteorOSTeamsPending.splice(index,1);
                Meteor.users.update({_id : user._id}, user);

                // Update the team
                var team = MeteorOSTeamCollection.findOne(team_id);
                index = -1;
                _.find(team.pending, function(pending_user) {
                    index += 1;
                    return pending_user._id == user._id;
                });
                if (index > -1) {
                    // Remove the user from pending
                    var pending_user = team.pending.splice(index,1);
                    MeteorOSTeamCollection.update({_id : team._id}, team);
                }
            }
        }
    });
}

MeteorOS.Team = new TeamModel();
