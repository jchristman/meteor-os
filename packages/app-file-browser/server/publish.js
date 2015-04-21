Meteor.publish('teamAutocompleteSubscription', function(selector, options, collName) {
    var user = Meteor.users.findOne(this.userId);
    var _selector = { 
        $and : [
            selector,
            { $or : 
                [ 
                    { _id : { $in : user.meteorOS.teams } }, 
                    { _id : { $in : user.meteorOS.teamsPending } } 
                ] 
            }
        ]
    }
    options.limit = Math.min(50, Math.abs(options.limit || 0));
    _.extend(options, {fields: {'_id':1,'owner':1,'name':1,'members':1,'pending':1}, reactive: true});
    var teams = MeteorOS.Team.Collection.find(_selector, options);
    Autocomplete.publishCursor(teams, this);
    this.ready();
});
