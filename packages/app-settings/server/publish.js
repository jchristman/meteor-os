Meteor.publish('usernameAutocompleteSubscription', function(selector, options, collName) {
    options.limit = Math.min(50, Math.abs(options.limit || 0));
    _.extend(options, {fields: {'_id':1,'username':1,'profile.gravatarUrl':1}, reactive: true});
    var users = Meteor.users.find(selector, options);
    Autocomplete.publishCursor(users, this);
    this.ready();
});
