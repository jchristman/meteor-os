if (Meteor.isClient) {
    Template._meteor_os_settings_team_management_page.helpers({
        myteams : function() {
            if (MeteorOSMyTeams.ready() && MeteorOSMyPendingTeams.ready()) {
                return MeteorOSTeamCollection.find({}, { sort : { name : 1 }});
            }
            return undefined;
        },

        isOwner : function() {
            return this.owner == Meteor.user()._id;
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
                    console.log('View invite to',team_id);
                    break;
                default:
                    break;
            }
        }
    });

    var newTeamModal = function() {
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
            var modal = $(new_team_modal.modalTarget);
            var team_name_input = modal.find('#name');
            var team_name = team_name_input.val();
            team_name_input.val('');
            var invited = Session.get('newTeamTagsVar');
            Session.set('newTeamTagsVar',[]);
            
            MeteorOS.Team.newTeam({
                name : team_name,
                owner : Meteor.user()._id,
                members : [],
                pending : invited
            });
        });
        new_team_modal.show();
    }
}
