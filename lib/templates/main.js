Template.meteorOSStartMenu.events({
    'click #meteor_os_logout_button' : function(event, template) {
        Meteor.logout(function() {
            Router.go('/');   
        });
    }
});
