Package.describe({
    name: 'meteoros:app-file-browser',
    summary: 'MeteorOS Application built around the filesystem to enable easy, in-browser file management',
    version: '1.9.6',
    git: 'https://github.com/jchristman/meteor-os/packages/app-file-browser'
});

Package.onUse(function(api) {
    api.versionsFrom('METEOR@1.0');

    api.use('dbarrett:dropzonejs@3.10.3','client');
    api.use('cfs:ui@0.1.3');
    api.use('sacha:spin@0.2.4');

    api.use('meteoros:base@1.9.5');
    api.use('meteoros:filesystem@1.9.5');

    api.addFiles([
            'context-menus/menus.js',
            'context-menus/background.js',
            'context-menus/dir.js',
            'context-menus/file.js',
            'modals/modals.js',
            'modals/newFolder/newFolder.html',
            'modals/newFolder/newFolder.js',
            'templates/file-browser.html',
            'templates/file-browser.js',
            'templates/file-browser.css',
            'img/folder-icon-24x24.png',
            'img/folder-icon-16x16.png',
            'img/file-icon-16x16.png',
            'img/favorites-icon-24x24.png',
            'img/success-icon-16x16.png',
    ],['client']);

    api.addFiles([
            'config/app.js',
    ],['client','server']);

    api.export(['FileSystem'],['client','server']);
});
