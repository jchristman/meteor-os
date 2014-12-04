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
        }
    };
}

OS.prototype.registerApp = function(application) {
    if (application != undefined) {
        if (application.package != '') {
            var package_path = application.package.split('.');
            var package_tree = this.applications.packages;
            for (var i = 0; i < package_path.length; i++) {
                if (!package_tree.hasOwnProperty(package_path[i])) package_tree[package_path[i]] = {};
                package_tree = package_tree[package_path[i]];
            }
            
            if (!package_tree.hasOwnProperty('__applications__')) package_tree.__applications__ = [];
            package_tree.__applications__.push({ name : application.name, app : application });
        } else {
            this.applications.packages.__applications__.push({ name : application.name, app : application });
        }

    }
}

MeteorOS = new OS();
