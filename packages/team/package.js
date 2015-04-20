Package.describe({
    name: 'meteoros:team',
    summary: 'Package for MeteorOS Team Model',
    version: '1.9.6',
    git: 'https://github.com/jchristman/meteor-os/packages/team'
});

Package.onUse(function(api) {
    api.versionsFrom('METEOR@1.0');
    
    // Server side reactivity
    api.use('lepozepo:reactive-publish@0.1.7');

    api.use('meteoros:base@1.9.5');

    api.addFiles([
            'team/teamdb.js',
            'team/team.js',
            'team/team-collection.js',
    ],['client','server']);
});
