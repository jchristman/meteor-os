Package.describe({
  name: 'jchristman:meteor-os',
  summary: 'Meteor package to easily allow desktop-like applications in meteor',
  version: '1.0.1',
  git: 'https://github.com/suntzuII/meteor-os'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.0');

  api.use('underscore',['client','server']);
  api.use('templating', 'client');
  api.use('jquery','client');
  api.use('mizzao:jquery-ui@1.11.2','client')
  api.use('accounts-base',['client','server']);
  api.use('useraccounts:bootstrap@1.4.0',['client','server']);
  api.use('accounts-password',['client','server']);
  api.use('jchristman:context-menu@1.1.3','client');
  api.use('jchristman:application-manager@1.0.1',['client','server']);
  api.imply('jchristman:application-manager@1.0.1',['client','server']);

  api.addFiles([
          'lib/meteor-os.js',
          'lib/files/files.js',
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
          'img/meteor-os_background.jpg',
          'img/fb-folder-icon-24x24.png',
          'img/fb-folder-icon-16x16.png',
          'img/fb-file-icon-16x16.png',
          'img/favorites-icon-24x24.png'
  ],['client']);

  api.addFiles([
          'builtins/file-browser/config.js',
          'builtins/file-browser/templates/file-browser.html',
          'builtins/file-browser/templates/file-browser.js',
          'builtins/file-browser/templates/file-browser.css'
  ],['client','server']);

  api.export([
          'MeteorOS',
          'UserCollection',
          'UserManager',
          'METEOR_OS_CONTEXT_MENU_FUNCS'
  ], ['client','server']); 
});
