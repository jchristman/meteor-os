// Includes the server-side code for user management

Meteor.methods({
    MeteorOS_Team_newTeam : function(team) {
        return MeteorOS.Team.Collection.insert(team);
    },

    MeteorOS_Team_updatePending : function(team_id, newPending) {
        MeteorOS.Team.Collection.update({_id : team_id}, { $set : { pending : newPending } });
    },

    inviteUserToMeteorOSTeam : function(user, team_id) {
        var _user = Meteor.users.findOne(user._id);
        if (!_.contains(_user.meteorOS.teamsPending, team_id))
            Meteor.users.update({_id : user._id}, {$addToSet : { 'meteorOS.teamsPending' : team_id}});
    },

    acceptInviteToMeteorOSTeam : function(team_id) {
        var user = Meteor.users.findOne(this.userId);
        if (user == undefined) return;
        var index = -1;
        _.find(user.meteorOS.teamsPending, function(pending_team_id) {
            index += 1;
            return pending_team_id == team_id;
        });
        if (index > -1) {
            // Remove the team from pending
            user.meteorOS.teamsPending.splice(index,1);
            // Add it to confirmed
            user.meteorOS.teams.push(team_id);
            Meteor.users.update({_id : user._id}, user);

            // Update the team
            var team = MeteorOS.Team.Collection.findOne(team_id);
            index = -1;
            _.find(team.pending, function(pending_user) {
                index += 1;
                return pending_user._id == user._id;
            });
            if (index > -1) {
                // Remove the user from pending
                var pending_user = team.pending.splice(index,1)[0];
                // Add the user to members
                team.members.push(pending_user);
                MeteorOS.Team.Collection.update({_id : team._id}, team);
            }
        }
    },

    declineInviteToMeteorOSTeam : function(team_id, user_id) {
        var team = MeteorOS.Team.Collection.findOne(team_id);
        var user = undefined;
        if (user_id != undefined) {
            if (this.userId != team.owner._id) return; // Reject any changes like this if the user is not the team owner
            user = Meteor.users.findOne(user_id);
        } else {
            user = Meteor.users.findOne(this.userId);
        }
        if (user == undefined) return;

        var index = -1;
        _.find(user.meteorOS.teamsPending, function(pending_team_id) {
            index += 1;
            return pending_team_id == team._id;
        });
        if (index > -1) {
            // Remove the team from pending
            user.meteorOS.teamsPending.splice(index,1);
            Meteor.users.update({_id : user._id}, user);

            // Update the team
            index = -1;
            _.find(team.pending, function(pending_user) {
                index += 1;
                return pending_user._id == user._id;
            });
            if (index > -1) {
                // Remove the user from pending
                team.pending.splice(index,1);
                MeteorOS.Team.Collection.update({_id : team._id}, team);
            }
        }
    },

    leaveMeteorOSTeam : function(team_id, user_id) {
        var team = MeteorOS.Team.Collection.findOne(team_id);
        var user = undefined;
        if (user_id != undefined) {
            if (this.userId != team.owner._id) return; // Reject any changes like this if the user is not the team owner
            user = Meteor.users.findOne(user_id);
        } else {
            user = Meteor.users.findOne(this.userId);
        }
        if (user == undefined) return;

        var index = -1;
        _.find(user.meteorOS.teams, function(team_id) {
            index += 1;
            return team._id == team_id;
        });

        if (index > -1) {
            // Remove the team
            user.meteorOS.teams.splice(index,1);
            Meteor.users.update({_id : user._id}, user);

            // Update the team
            index = -1;
            _.find(team.members, function(member) {
                index += 1;
                return member._id == user._id;
            });
            if (index > -1) {
                // Remove the user from members
                var member = team.members.splice(index,1);
                MeteorOS.Team.Collection.update({_id : team._id}, team);
            }
        }
    },

    deleteMeteorOSTeam : function(team_id) {
        var team = MeteorOS.Team.Collection.findOne(team_id);
        if (this.userId == team.owner._id) {
            _.each(team.members, function(member) {
                MeteorOS.Team.leaveTeam(team._id, member._id);
            });
            _.each(team.pending, function(pending_user) {
                MeteorOS.Team.declineInvite(team._id, pending_user._id);
            });
            MeteorOS.Team.leaveTeam(team._id);
            MeteorOS.Team.Collection.remove({_id : team._id});
        }
    }
});
