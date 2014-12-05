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
}

OS.prototype.registerApp = function(application) {
    if (application != undefined) {
        var appLoc = this.getAppLocByPackagePath(application.package);

        if (application.package != '') {
            appLoc.push({ name : application.name, 
                path : application.package + "." + application.name });
            this.applications.appPathMap[
                application.package + "." + application.name] = application;
        } else {
            appLoc.push({ name : application.name, 
                path : application.name });
            this.applications.appPathMap[application.name] = application;
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

MeteorOS = new OS();
