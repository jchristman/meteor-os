METEOR_OS_CONTEXT_MENU_FUNCS = {
    startApplication : function(selector) {
        var appMenu = _.map(AppManager.getApps(), function(app) {
            if (!app.getAppData().appOpen) {
                return {
                    text : app.appName,
                    action : function(e, selector) {
                        app.startApp();
                    }
                }
            }
        });
        return appMenu.filter(function(app) {
            return (app != undefined);
        });
    },

    quitApplication : function(selector) {
        var appMenu = _.map(AppManager.getApps(), function(app) {
            if (app.getAppData().appOpen) {
                return {
                    text : app.appName,
                    action : function(e, selector) {
                        app.quitApp();
                    }
                }
            }
        });
        return appMenu.filter(function(app) {
            return (app != undefined);
        });
    }
}
