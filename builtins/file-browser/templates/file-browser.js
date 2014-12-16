CWD = 'FileBrowserCurrentDir'

if (Meteor.isClient) {
    Meteor.startup(function() {
        Session.set(CWD, '/home');
    });

    Template.file_browser.helpers({
        currentUserContext : function() {
            var user = UserManager.getUser(Meteor.user());
            return user.fs;
        },

        currentPath : function() {
            return { path : Session.get(CWD) };
        }
    });

    Template.fb_favorite.helpers({
        convertPath : function() {
            return _.extend(this, { text : this.path.substring(this.path.lastIndexOf('/') + 1) })
        }
    });

    Template.fb_favorite.events({
        'dblclick .fb-favorite' : function(event) {
            Session.set(CWD, this.path);
        } 
    });
}
