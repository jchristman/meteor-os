Package.describe({
    name: 'meteoros:app-settings',
    summary: 'MeteorOS settings application which adds team and profile management',
    version: '1.9.7',
    git: 'https://github.com/jchristman/meteor-os/packages/app-settings'
});

Package.onUse(function(api) {
    api.versionsFrom('METEOR@1.0');

    api.use('meteoros:base@1.9.5');
    api.use('meteoros:team@1.9.5');

    api.addFiles([
            'config/app.js'
    ],['client','server']);

    api.addFiles([
            'server/publish.js'
    ],['server']);
    
    api.addFiles([
            // Settings Application
            'templates/pages/accounts/accounts.html',
            'templates/pages/team-management/team_management.html',
            'templates/pages/team-management/team_management.js',
            'templates/pages/team-management/modals/common-modal-templates.html',
            'templates/pages/team-management/modals/common-modal-templates.js',
            'templates/pages/team-management/modals/editTeam/editTeam.html',
            'templates/pages/team-management/modals/editTeam/editTeam.js',
            'templates/pages/team-management/modals/editTeam/editTeam.css',
            'templates/pages/team-management/modals/newTeam/newTeam.html',
            'templates/pages/team-management/modals/newTeam/newTeam.js',
            'templates/pages/team-management/modals/viewInvite/viewInvite.html',
            'templates/pages/team-management/modals/viewInvite/viewInvite.js',
            'templates/pages/interface/interface.html',
            'templates/settings.css',
    ],['client']);
});
