if (Meteor.isServer) {
    Accounts.onCreateUser(function(options, user) {
        if (user.profile == undefined) user.profile = {};
        if (options.email == undefined) options.email = '';
        _.extend(user.profile, { fs : MeteorOS.FS.defaultFS() });
        return user;
    });
}
