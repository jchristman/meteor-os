Package.describe({
    name: 'meteoros:testing',
    summary: 'Package to set up MeteorOS testing environment.',
    version: '1.9.6',
    git: 'https://github.com/jchristman/meteor-os'
});

Package.onUse(function(api) {

    api.use('meteoros:base@1.9.5');

    api.addFiles([
            'testing/users.js'
    ],['server']);
});

