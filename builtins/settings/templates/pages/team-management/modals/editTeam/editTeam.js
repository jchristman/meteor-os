if (Meteor.isClient) {
    Template._meteor_os_settings_team_management_edit_team.helpers({
        team : function() {
            console.log(MeteorOSTeamCollection.findOne({_id : this.id}));
            return MeteorOSTeamCollection.findOne({_id : this.id});
        }
    });
        
    EDIT_TEAM_MODAL = {
        title : 'Edit Team',
        template : Template._meteor_os_settings_team_management_edit_team,
        removeOnHide: true,
        buttons: {
            destroy : {
                label : 'Destroy Team',
                class : 'btn-danger'
            },
            update : {
                label : 'Update',
                class : 'btn-primary'
            },
            cancel : {
                label : 'Close',
                class : 'btn-default'
            }
        }
    }
}
