if (Meteor.isServer) {
    Accounts.onCreateUser(function(options, user) {
        if (user.profile == undefined) user.profile = {};
        _.extend(user.profile, { MeteorOSTeams : [] });
        return user;
    });
}
