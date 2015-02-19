NEW_TEAM_MODAL = undefined;

if (Meteor.isServer) {
    Meteor.startup(function() {
        if (Meteor.users.find().count() < 1000) {
            Meteor.defer(function() {
                function randString(x){
                    var s = "";
                    while(s.length<x&&x>0){
                        var r = Math.random();
                        s+= String.fromCharCode(Math.floor(r*26) + (r>0.5?97:65));
                    }
                    return s;
                }

                for (var i = 0; i < 1000; i++) {
                    Accounts.createUser({
                        username: randString(4),
                        email: '',
                        password: 'bob',
                        profile: {}
                    });
                }
            });
        }
    });    

    Meteor.publish('usernameAutocompleteSubscription', function(selector, options, collName) {
        options.limit = Math.min(50, Math.abs(options.limit || 0));
        _.extend(options, {fields: {'username':1}, reactive: true});
        var users = Meteor.users.find(selector, options);
        Autocomplete.publishCursor(users, this);
        this.ready();
    });
}

if (Meteor.isClient) {
    Meteor.startup(function() {
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
            var team_name = $(NEW_TEAM_MODAL.modalTarget).find('#name').val();
            MeteorOS.Team.newTeam({
                name : team_name,
                owner : Meteor.user()._id,
                members : []
            });
        });
    });

    Template._meteor_os_settings_team_management_new_team.helpers({
        settings : function() {
            return {
                position: 'below',
                limit: 10,
                rules: [
                {
                    collection: 'users',
                    subscription: 'usernameAutocompleteSubscription',
                    field: 'username',
                    template: Template.userPill
                }
                ]
            }
        }
    });
}
