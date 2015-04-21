Package.describe({
    name: 'meteoros:base',
    summary: 'Meteor package to easily allow desktop-like applications in meteor',
    version: '1.9.10',
    git: 'https://github.com/jchristman/meteor-os'
});

Package.onUse(function(api) {
    api.versionsFrom('METEOR@1.0');
    
    var use = function(pkg, where) {
        if (where) {
            api.use(pkg, where);
            api.imply(pkg, where);
        } else {
            api.use(pkg);
            api.imply(pkg);
        }
    }

    // Builtin meteor packages
    use('jquery');
    use('tracker');
    use('templating');
    use('reactive-var');
    use('underscore@1.0.2');
    // Meteor extension packages
    use('dburles:mongo-collection-instances@0.3.3');
    // Accounts packages
    use('accounts-base');
    use('accounts-password');
    use('useraccounts:bootstrap@1.4.0');
    // UI Packages
    use('mizzao:jquery-ui@1.11.2','client');
    use('mrt:bootstrap-alerts@0.0.5','client');
    use('jparker:gravatar@0.3.1');
    // Custom packages
    use('jchristman:context-menu@1.2.0_1','client');
    use('jchristman:reactive-modal@1.0.3','client');
    use('jchristman:tagsinput-autocomplete@1.0.1');
    use('jchristman:application-manager@1.0.7_2');

    api.addFiles([
            'lib/meteor-os.js',
            'config/accounts.js',
            'config/router.js',
            'config/users.js'
    ],['client','server']);

    api.addFiles([
            'lib/style.css',
            'lib/components/main/main.html',
            'lib/components/main/main.css',
            'lib/components/main/main.js',
            'lib/components/login-flow/login.html',
            'lib/components/login-flow/login.css',
            'lib/components/login-flow/login.js',
            'lib/components/footer/footer.html',
            'lib/components/footer/footer.css',
            'lib/components/start-menu/start-menu.html',
            'lib/components/start-menu/start-menu.js',
            'lib/components/start-menu/start-menu.css',
            'lib/components/context-menus/body-context-menu.js',
            'lib/components/context-menus/context-menu-funcs.js',
            'lib/components/progress-bar/style.css',
            'lib/components/notfound/notfound.html',
            'lib/components/notfound/notfound.js',
            'lib/helpers/alerts.js',
            'lib/helpers/jquery-helpers.js',
            'img/meteor-os_background.jpg',
    ],['client']);

    api.export(['MeteorOS'], ['client','server']); 
});

