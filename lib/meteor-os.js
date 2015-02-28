/**
 *  Applications will be categorized by "packages" similar to eclipse. The
 *  packages will be referenced in a way like: Code.Editors (which would 
 *  add the application to the Editors sub package of the Code package).
 *  This allows applications to be categorized by functionality. These
 *  packages will be used to create a directory structure for the applications,
 *  accessible from the launch menu and from the file explorer.
 */

OS = function() {
    this.applications = {
        packages : {
            __applications__ : []
        },

        appPathMap : {

        }
    };

    this.onCreateUserFuncs = [];
}

OS.prototype.registerApp = function(settings) {
    if (settings != undefined) {
        AppManager.registerApp(settings); // Register in the AppManager
        
        if (!settings.hasOwnProperty('package')) settings.package = '';
        var appLoc = this.getAppLocByPackagePath(settings.package);

        if (settings.package != '') {
            appLoc.push({ name : settings.appName, 
                path : settings.package + "." + settings.appName });
            this.applications.appPathMap[
                settings.package + "." + settings.appName] = settings.appID;
        } else {
            appLoc.push({ name : settings.appName, 
                path : settings.appName });
            this.applications.appPathMap[settings.appName] = settings.appID;
        }
    }
}

OS.prototype.getPackageByPath = function(packagePath) {
    if (packagePath == '')
        return this.applications.packages;
    var package_path = packagePath.split('.');
    var package_tree = this.applications.packages;
    for (var i = 0; i < package_path.length; i++) {
        if (!package_tree.hasOwnProperty(package_path[i])) package_tree[package_path[i]] = {};
        package_tree = package_tree[package_path[i]];
    }

    return package_tree;
}

OS.prototype.getAppLocByPackagePath = function(packagePath) {
    if (packagePath == '')
        return this.applications.packages.__applications__;
    var package_tree = this.getPackageByPath(packagePath);       
    if (!package_tree.hasOwnProperty('__applications__')) package_tree.__applications__ = [];
    return package_tree.__applications__;
}

OS.prototype.getAppID = function(appPath) {
    return this.applications.appPathMap[appPath];
}

OS.prototype.getApp = function(appIdOrPath) {
    return AppManager.getApp(appIdOrPath);
}

OS.prototype.getAppByPath = function(appPath) {
    return AppManager.getApp(this.getAppID(appPath));
}

OS.prototype.startApplication = function(appPath) {
    var appId = this.getAppID(appPath);
    if (appId == undefined) {
        var appName = appPath;
        appId = AppManager.getApp(appName).appID;
    }
    AppManager.start(appId);
}

OS.prototype.quitApplication = function(appId) {
    AppManager.quit(appId);
}

OS.prototype.onCreateUser = function(func) {
    if (func instanceof Function)   this.onCreateUserFuncs.push(func);    
    else                            Meteor.Error('MeteorOS.onCreateUser only accepts functions as arguments');
}

MeteorOS = new OS();

if (Meteor.isServer) {
    Accounts.onCreateUser(function(options, user) {
        _.each(MeteorOS.onCreateUserFuncs, function(onCreateUser) {
            user = onCreateUser(options, user);
        });
        return user;
    });
}
