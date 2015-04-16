/*
 */
if (Meteor.isServer) {
    MeteorOS.onCreateUser(function(options, user) {
        _.extend(user.meteorOS, { teams : [], teamsPending : [] });
        return user;
    });
}
