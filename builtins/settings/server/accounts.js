if (Meteor.isServer) {
    Accounts.onCreateUser(function(options, user) {
        if (user.profile == undefined) user.profile = {};
        if (options.email == undefined) options.email = '';
        _.extend(user.profile, { MeteorOSTeams : [], MeteorOSTeamsPending : [] , gravatarUrl : Gravatar.imageUrl(options.email, { size: 22, default: 'identicon' }) });
        return user;
    });
}
