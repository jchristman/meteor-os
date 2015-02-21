if (Meteor.isClient) {
    Template._meteor_os_settings_team_management_page.rendered = function() {
        var newTeamModal = {
            title : 'Create New Team',
            template : Template._meteor_os_settings_team_management_new_team,
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

        NEW_TEAM_MODAL = ReactiveModal.initDialog(newTeamModal);
        NEW_TEAM_MODAL.buttons.create.on('click', function(button) {
            var modal = $(NEW_TEAM_MODAL.modalTarget);
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
    }

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
                    NEW_TEAM_MODAL.show();
                    break;
                case 'acceptInvite':
                    var team_id = $(event.target).closest('.team').data('id');
                    console.log('Accept invite to',team_id);
                    Meteor.call('acceptInviteToMeteorOSTeam',team_id);
                    break;
                case 'declineInvite':
                    var team_id = $(event.target).closest('.team').data('id');
                    console.log('Decline invite to',team_id);
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
}
