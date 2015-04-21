Package.describe({
    name: 'meteoros:filesystem',
    summary: 'Filesystem data structure for MeteorOS',
    version: '1.9.9',
    git: 'https://github.com/jchristman/meteor-os/packages/filesystem'
});

Package.onUse(function(api) {
    api.versionsFrom('METEOR@1.0');

    api.use('cfs:standard-packages@0.5.4');
    api.use('cfs:filesystem@0.1.2');

    api.use('meteoros:base@1.9.5');

    api.addFiles([
            'config/fs.js',
    ],['server']);

    api.addFiles([
            'fs/fs.js',
            'fs/type.js',
            'fs/file.js',
            'fs/dir.js',
            'fs/status.js',
            'fs/fsdb.js',
    ],['client','server']);

    api.export(['FileSystem'],['client','server']);
});
