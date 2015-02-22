if (Meteor.isClient) {
    Template._meteor_os_settings_team_management_view_invite.helpers({
        team : function() {
            return MeteorOSTeamCollection.findOne({_id : this.id});
        }
    });
}
