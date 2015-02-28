if (Meteor.isServer) {
    MeteorOS.onCreateUser(function(options, user) {
        if (user.profile == undefined) user.profile = {};
        if (options.email == undefined) options.email = '';
        _.extend(user.profile, { fs : (new FileSystem()).serialize() });
        return user;
    });
}
