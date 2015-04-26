if (Meteor.isServer) {
    MeteorOS.onCreateUser(function(options, user) {
        if (user.profile === undefined) user.profile = {};
        if (options.email == undefined) options.email = '';
        _.extend(user.profile, { gravatarUrl : Gravatar.imageUrl(options.email, { size: 22, default: 'identicon' }) });
        return user;
    });

    Meteor.publish("userData", function () {
        return Meteor.users.find({_id: this.userId}, {fields: {_id: 1, emails: 1, username: 1, meteorOS: 1}});
    });

    /*Meteor.users.allow({
        update: function(userId, doc, fields, modifier) {
            if (userId && doc._id === userId) {
                return true;
            }
            return false;
        }
    });*/
}

if (Meteor.isClient) {
    Tracker.autorun(function() {
        Meteor.subscribe("userData");
    });
}
