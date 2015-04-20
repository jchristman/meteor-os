Package.describe({
    name: 'meteoros:standard-packages',
    summary: 'Include all packages needed to access the full MeteorOS API',
    version: '1.9.5',
    git: 'https://github.com/jchristman/meteor-os',
    documentation: null
});

Package.onUse(function(api) {
    api.versionsFrom('METEOR@1.0');

    api.imply('meteoros:base@1.9.5');
    api.imply('meteoros:filesystem@1.9.5');
    api.imply('meteoros:team@1.9.5');
});
