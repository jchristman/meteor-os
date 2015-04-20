Package.describe({
    name: 'meteoros:standard-applications',
    summary: 'Include the applications that wrap around the standard-packages',
    version: '1.9.5',
    git: 'https://github.com/jchristman/meteor-os/packages',
    documentation: null
});

Package.onUse(function(api) {
    api.versionsFrom('METEOR@1.0');

    api.imply('meteoros:app-settings@1.9.5');
    api.imply('meteoros:app-file-browser@1.9.5');
});
