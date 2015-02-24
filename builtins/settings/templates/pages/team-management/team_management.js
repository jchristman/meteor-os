if (Meteor.isClient) {
    Template._meteor_os_settings_team_management_page.helpers({
        myteams : function() {
            if (MeteorOSMyTeams.ready() && MeteorOSMyPendingTeams.ready()) {
                return MeteorOSTeamCollection.find({}, { sort : { name : 1 }});
            }
            return undefined;
        },

        isOwner : function() {
            return this.owner._id == Meteor.user()._id;
        },

        isPending : function() {
            var pending = _.find(this.pending, function(user) {
                return Meteor.user()._id == user._id;
            });
            return pending != undefined;
        }
    });

    Template._meteor_os_settings_team_management_page.events({
        'click .btn' : function(event, context) {
            var action = $(event.target).data('action');
            switch (action) {
                case 'newTeam':
                    newTeamModal();
                    break;
                case 'acceptInvite':
                    var team_id = $(event.target).closest('.team').data('id');
                    MeteorOS.Team.acceptInvite(team_id);
                    break;
                case 'declineInvite':
                    var team_id = $(event.target).closest('.team').data('id');
                    MeteorOS.Team.declineInvite(team_id);
                    break;
                case 'viewInvite':
                    var team_id = $(event.target).closest('.team').data('id');
                    viewTeamModal(team_id);
                    break;
                case 'ownerEditTeam':
                    var team_id = $(event.target).closest('.team').data('id');
                    editTeamModal(team_id);
                    break;
                default:
                    break;
            }
        }
    });

    var newTeamModal = function() {
        var new_team_modal = ReactiveModal.initDialog(NEW_TEAM_MODAL);
        new_team_modal.buttons.create.on('click', function(button) {
            var team_name_input = $(new_team_modal.modalTarget).find('#name');
            
            var team_name = team_name_input.val();
            var invited = Session.get('inviteUsersTagsVar');
            
            team_name_input.val('');
            Session.set('inviteUsersTagsVar',[]);
            
            MeteorOS.Team.newTeam({
                name : team_name,
                owner : { _id : Meteor.user()._id, username : Meteor.user().username },
                members : [],
                pending : invited
            });
        });
        var team_name_input = $(new_team_modal.modalTarget).find('#name');
        team_name_input.val('');
        Session.set('newTeamTagsVar',[]);
        new_team_modal.show();
    }
    
    var viewTeamModal = function(team_id) {
        VIEW_INVITE_MODAL.doc = { id : team_id };
        var view_invite_modal = ReactiveModal.initDialog(VIEW_INVITE_MODAL);
        view_invite_modal.buttons.accept.on('click', function(button) {
            MeteorOS.Team.acceptInvite(team_id);
        });
        view_invite_modal.buttons.decline.on('click', function(button) {
            MeteorOS.Team.declineInvite(team_id);
        });
        view_invite_modal.show();
    }
    
    var editTeamModal = function(team_id) {
        EDIT_TEAM_MODAL.doc = { id : team_id };
        var edit_team_modal = ReactiveModal.initDialog(EDIT_TEAM_MODAL);
        edit_team_modal.buttons.destroy.on('click', function(button) {
            ALERTS.NotImplemented();
        });
        edit_team_modal.buttons.update.on('click', function(button) {
            var invited = Session.get('inviteUsersTagsVar');
            Session.set('inviteUsersTagsVar',[]);
            MeteorOS.Team.updateTeam({
                _id : team_id,
                pending : invited
            });
        });
        edit_team_modal.show();
    }
}
