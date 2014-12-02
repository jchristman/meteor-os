Package.describe({
  name: 'jchristman:meteor-os',
  summary: 'Meteor package to easily allow desktop-like applications in meteor',
  version: '1.0.0',
  git: 'https://github.com/suntzuII/meteor-os'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.0');

  api.use('underscore',['client','server']);
  api.use('templating', 'client');
  api.use('jquery','client');
  api.use('mizzao:jquery-ui','client')
  api.use('accounts-base',['client','server']);
  api.use('useraccounts:bootstrap',['client','server']);
  api.use('accounts-password',['client','server']);
  api.use('jchristman:context-menu@1.1.2_2','client');
  api.use('jchristman:window-manager@1.0.1',['client','server']);

  api.addFiles([
          'lib/meteor-os.js',
          'lib/application.js',
          'lib/accounts-config.js'
  ],['client','server']);

  api.addFiles([
          'lib/templates/main.html',
          'lib/templates/main.css',
          'lib/templates/main.js',
          'img/meteor-os_background.jpg'
  ],['client']);

  api.export([
          'MeteorOS',
          'Application'
  ], ['client','server']); 
});
