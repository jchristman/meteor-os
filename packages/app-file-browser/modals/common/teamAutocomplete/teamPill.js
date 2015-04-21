Template._meteor_os_file_browser_common_teamPill.helpers({
    isOwner: function() {
        return Meteor.user()._id === this.owner._id;
    },

    isPending: function() {
        var pending = _.find(this.pending, function(user) {
            return user._id === Meteor.user()._id;
        });
        return pending !== undefined;
    }
});
