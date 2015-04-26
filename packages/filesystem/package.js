Package.describe({
    name: 'meteoros:filesystem',
    summary: 'Filesystem data structure for MeteorOS',
    version: '1.9.10',
    git: 'https://github.com/jchristman/meteor-os/packages/filesystem'
});

Package.onUse(function(api) {
    api.versionsFrom('METEOR@1.0');

    api.use('cfs:standard-packages@0.5.4');
    api.use('cfs:filesystem@0.1.2');

    api.use('meteoros:base@1.9.5');

    api.addFiles([
            'both/fs/fs.js',
            'both/fs/type.js',
            'both/fs/file.js',
            'both/fs/dir.js',
            'both/fs/status.js',
            'both/fs/fsdb.js',
    ],['client','server']);

    api.addFiles([
            'server/config/fs.js',
            'server/config/const.js',
            'server/fs/fsdb.js',
            'server/fs/validate/validate.js',
            'server/fs/validate/owner.js',
            'server/fs/validate/files.js',
            'server/fs/validate/name.js',
    ],['server']);

    api.export('FileSystem', ['client', 'server']);
});
