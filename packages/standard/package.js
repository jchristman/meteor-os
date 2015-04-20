Package.describe({
    name: 'meteoros:standard',
    summary: 'Include standard-packages and standard-applications',
    version: '1.9.5',
    git: 'https://github.com/jchristman/meteor-os',
    documentation: null
});

Package.onUse(function(api) {
    api.versionsFrom('METEOR@1.0');

    api.imply('meteoros:standard-packages@1.9.5');
    api.imply('meteoros:standard-applications@1.9.5');
});
