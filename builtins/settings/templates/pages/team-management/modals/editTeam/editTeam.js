if (Meteor.isClient) {
    Template._meteor_os_settings_team_management_edit_team.helpers({
        team : function() {
            return MeteorOSTeamCollection.findOne({_id : this.id});
        }
    });

    Template._meteor_os_settings_team_management_edit_team.events({
        'click .removeMember' : function(event, context) {
            var user_id = $(event.target).data('id');
            MeteorOS.Team.leaveTeam(context.data.id, user_id);
        },

        'click .removePending' : function(event, context) {
            var user_id = $(event.target).data('id');
            MeteorOS.Team.declineInvite(context.data.id, user_id);
        }
    });
        
    EDIT_TEAM_MODAL = {
        title : 'Edit Team',
        template : Template._meteor_os_settings_team_management_edit_team,
        removeOnHide: true,
        buttons: {
            destroy : {
                label : 'Destroy Team',
                class : 'btn-danger',
                closeModalOnClick: false
            },
            update : {
                label : 'Update',
                class : 'btn-primary',
                disabled : true,
                closeModalOnClick: false
            },
            cancel : {
                label : 'Close',
                class : 'btn-default'
            }
        }
    }
}
