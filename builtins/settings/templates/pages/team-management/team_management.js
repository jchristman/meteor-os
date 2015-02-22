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
                default:
                    break;
            }
        }
    });

    var newTeamModal = function() {
        // TODO: Move this to the modals/newTeam/newTeam.js as a global var once the updates are made that don't disable buttons when recreating
        var NEW_TEAM_MODAL = {
            title : 'Create New Team',
            template : Template._meteor_os_settings_team_management_new_team,
            removeOnHide: true,
            buttons: {
                create : {
                    label : 'Create',
                    class : 'btn-success',
                },
                cancel : {
                    label : 'Cancel',
                    class : 'btn-default'
                }
            }
        };

        var new_team_modal = ReactiveModal.initDialog(NEW_TEAM_MODAL);
        new_team_modal.buttons.create.on('click', function(button) {
            var team_name_input = $(new_team_modal.modalTarget).find('#name');
            
            var team_name = team_name_input.val();
            var invited = Session.get('newTeamTagsVar');
            
            team_name_input.val('');
            Session.set('newTeamTagsVar',[]);
            
            MeteorOS.Team.newTeam({
                name : team_name,
                owner : { _id : Meteor.user()._id, username : Meteor.user().username },
                members : [],
                pending : invited
            });
        });
        new_team_modal.show();
    }
    
    var viewTeamModal = function(team_id) {
        // TODO: Move this to the modals/newTeam/newTeam.js as a global var once the updates are made that don't disable buttons when recreating
        var VIEW_INVITE_MODAL = {
            title : 'View Invite',
            template : Template._meteor_os_settings_team_management_view_invite,
            removeOnHide: true,
            buttons: {
                accept : {
                    label : 'Accept Invite',
                    class : 'btn-success'
                },
                decline : {
                    label : 'Decline Invite',
                    class : 'btn-danger'
                },
                cancel : {
                    label : 'Close',
                    class : 'btn-default'
                }
            },
            doc : {
                id : team_id
            }
        };

        var view_invite_modal = ReactiveModal.initDialog(VIEW_INVITE_MODAL);
        view_invite_modal.buttons.accept.on('click', function(button) {
            MeteorOS.Team.acceptInvite(team_id);
        });
        view_invite_modal.buttons.decline.on('click', function(button) {
            MeteorOS.Team.declineInvite(team_id);
        });
        view_invite_modal.show();
    }
}
