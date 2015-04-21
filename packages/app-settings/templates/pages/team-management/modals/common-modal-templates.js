Template._meteor_os_settings_team_management_invite_users.helpers({
    settings : function() {
        return {
            position: 'below',
            limit: 10,
            rules: [
                {
                    collection: 'users',
                    subscription: 'usernameAutocompleteSubscription',
                    field: 'username',
                    options: '',
                    template: Template.userPill,
                    noMatchTemplate: Template.userNoMatch,
                }
            ]
        }
    }
});
