Meteor.users.allow({
    update: function(userId, doc, fields, modifier) {
        console.log(userId, doc, fields, modifier);
        if (userId && doc._id === userId) {
            return true;
        }
        return false;
    }
});
