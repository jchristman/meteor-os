if (Meteor.isClient) {
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
