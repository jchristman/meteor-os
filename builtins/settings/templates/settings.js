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
            var team_name = modal.find('#name');
            
            MeteorOS.Team.newTeam({
                name : team_name,
                owner : Meteor.user()._id,
                members : []
            });
        });
        NEW_TEAM_MODAL.show();
    }

    Template._meteor_os_settings_team_management_page.helpers({
        myteams : function() {
            if (MeteorOSMyTeams.ready()) {
                return MeteorOSTeamCollection.find({}, { sort : { name : 1 }});
            }
            return undefined;
        },

        isOwner : function() {
            return this.owner == Meteor.user()._id;
        }
    });

    Template._meteor_os_settings_team_management_page.events({
        'click .btn' : function(event, context) {
            var action = $(event.target).data('action');
            switch (action) {
                case 'newTeam':
                    NEW_TEAM_MODAL.show();
                    break;
                default:
                    break;
            }
        }
    });
}
