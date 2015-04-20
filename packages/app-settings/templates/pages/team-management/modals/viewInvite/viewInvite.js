if (Meteor.isClient) {
    Template._meteor_os_settings_team_management_view_invite.helpers({
        team : function() {
            return MeteorOS.Team.Collection.findOne({_id : this.id});
        }
    });
    
    VIEW_INVITE_MODAL = {
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
        }
    };
}
