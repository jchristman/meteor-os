if (Meteor.isClient) {
    Meteor.startup(function() {
        Session.set("Mongol", {
            'collections': ['users', 'AppCollection', 'MeteorOSTeamCollection', 'MeteorOS_FS'],
            'display': false,
            'opacity_normal': ".7",
            'opacity_expand': ".9",
        });
    });
}
