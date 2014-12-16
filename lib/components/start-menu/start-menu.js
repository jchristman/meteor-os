Meteor.startup(function() {
    Session.set('meteorOSStartMenuState','');
});

Template.meteorOSStartMenuApplications.helpers({
    currentPackageState : function() {
        var state = Session.get('meteorOSStartMenuState');
        var pkg = MeteorOS.getPackageByPath(state);
        var items = [];
        _.each(pkg, function(value, key) {
            if (key == '__applications__') {
                _.each(value, function(app) {
                    var appData = MeteorOS.getApp(app.path).getAppData();
                    if (appData != undefined && appData.type == Application.WINDOWED_APPLICATION)
                        items.push(app);
                });
            } else {
                items.push({ package : key, path : state, name : key });
            }
        });

        items.sort(function(a, b) {
            if (a.name > b.name)    return 1;
            else                    return -1;
        });

        if (state != '') {
            items.push({ back : true, path : state.substring(0, state.lastIndexOf('.')), name : 'Back' });
        }

        return { menuItems : items };
    }
});

Template.meteorOSStartMenuItem.helpers({
    isPackage : function() {
        return (this.package != undefined && this.back == undefined);
    },

    isBack : function() {
        return (this.back != undefined);
    }
});

Template.meteorOSStartMenuItem.events({
    'click a' : function(event) {
        if (this.package != undefined) {
            var new_path = this.path;
            if (new_path != '') new_path += '.';
            new_path += this.package;
            Session.set('meteorOSStartMenuState',new_path);
            event.stopPropagation();   
        } else if (this.back != undefined) {
            Session.set('meteorOSStartMenuState', this.path);
            event.stopPropagation();   
        } else {
            MeteorOS.startApplication(this.path);
        }
    }
});

Template.meteorOSStartMenu.events({
    'click #meteor_os_logout_button' : function(event, template) {
        Meteor.logout(function() {
            Router.go('/');   
        });
    }
});
