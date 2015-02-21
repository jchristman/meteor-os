Package.describe({
  name: 'jchristman:meteor-os',
  summary: 'Meteor package to easily allow desktop-like applications in meteor',
  version: '1.1.1_2',
  git: 'https://github.com/jchristman/meteor-os'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.0');

  // Builtin meteor packages
  api.use('underscore@1.0.2');
  api.use('templating', 'client');
  api.use('jquery','client');
  // Server side reactivity
  api.use('lepozepo:reactive-publish');
  // Accounts packages
  api.use('accounts-base');
  api.use('accounts-password');
  api.use('useraccounts:bootstrap@1.4.0');
  // Filesystem packages
  api.use('dbarrett:dropzonejs@3.10.3','client');
  api.use('cfs:standard-packages@0.5.3');
  api.use('cfs:filesystem@0.1.1');
  api.use('cfs:ui@0.1.3');
  // UI Packages
  api.use('mizzao:jquery-ui@1.11.2','client');
  api.use('mizzao:autocomplete@0.4.10');
  api.use('pahans:reactive-modal@1.0.2');
  api.use('mrt:bootstrap-alerts@0.0.5','client');
  // Custom packages
  api.use('jchristman:context-menu@1.1.4','client');
  api.use('jchristman:tagsinput-autocomplete@1.0.1');
  api.imply('jchristman:tagsinput-autocomplete@1.0.1');
  api.use('jchristman:application-manager@1.0.7_2');
  api.imply('jchristman:application-manager@1.0.7_2');

  api.addFiles([
          'lib/meteor-os.js',
          'lib/files/files.js',
          'lib/files/fs-config.js',
          'lib/users/default.js',
          'lib/users/users-collection.js',
          'lib/users/users.js',
          'config/accounts.js',
          'config/router.js'
  ],['client','server']);

  api.addFiles([
          'lib/style.css',
          'lib/components/main/main.html',
          'lib/components/main/main.css',
          'lib/components/main/main.js',
          'lib/components/login-flow/login.html',
          'lib/components/login-flow/login.css',
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
          'lib/helpers/jquery-helpers.js',
          'lib/helpers/alerts.js',
          'img/meteor-os_background.jpg',
          'img/fb-folder-icon-24x24.png',
          'img/fb-folder-icon-16x16.png',
          'img/fb-file-icon-16x16.png',
          'img/favorites-icon-24x24.png',
          'img/fb-success-icon-16x16.png',
  ],['client']);

  api.addFiles([
          // File Browser
          'builtins/file-browser/config.js',
          'builtins/file-browser/context-menus/context-menu-funcs.js',
          'builtins/file-browser/context-menus/fb-file-context-menu.js',
          'builtins/file-browser/templates/file-browser.html',
          'builtins/file-browser/templates/file-browser.js',
          'builtins/file-browser/templates/file-browser.css',
          // Settings Application
          'builtins/settings/config.js',
          'builtins/settings/templates/settings.html',
          'builtins/settings/templates/settings.js',
          'builtins/settings/templates/settings.css',
          'builtins/settings/templates/modals/newTeam.html',
          'builtins/settings/templates/modals/newTeam.js',
          'builtins/settings/templates/modals/newTeam.css',
          'builtins/settings/team-model/team.js',
          'builtins/settings/team-model/team-collection.js',
          'builtins/settings/server/accounts.js',
  ],['client','server']);

  api.export([
          'MeteorOS',
          'UserCollection',
          'UserManager',
          'METEOR_OS_CONTEXT_MENU_FUNCS',
          'ALERTS'
  ], ['client','server']); 
});
