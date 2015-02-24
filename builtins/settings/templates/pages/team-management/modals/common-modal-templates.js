if (Meteor.isServer) {
    Meteor.publish('usernameAutocompleteSubscription', function(selector, options, collName) {
        options.limit = Math.min(50, Math.abs(options.limit || 0));
        _.extend(options, {fields: {'_id':1,'username':1}, reactive: true});
        var users = Meteor.users.find(selector, options);
        Autocomplete.publishCursor(users, this);
        this.ready();
    });
}

if (Meteor.isClient) {
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
}
