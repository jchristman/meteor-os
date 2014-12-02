Template.meteor_os_start_menu.events({
    'click #meteor_os_logout_button' : function(event, template) {
        console.log("logging out");
        Meteor.logout();
    }
});
