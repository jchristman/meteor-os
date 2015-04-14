var team_manager_app = {
    appID : '5534de45-3b16-4faf-84be-b02daa5f8c4a',
    appName : 'Settings',
    appOpen : true,
    layout : {
        windows : [
            {
                id : 'meteor-os-settings',
                type : Application.PAGED_WINDOW,
                title : 'Settings',
                top : '10%',
                left : '10%',
                width : '50%',
                height : '60%',
                pages : [
                    {
                        title : 'Account',
                        template : '_meteor_os_settings_accounts_page',
                    },
                    {
                        title : 'Team Management',
                        template : '_meteor_os_settings_team_management_page',
                        selected : true
                    },
                    {
                        title : 'Interface Options',
                        template : '_meteor_os_settings_interface_page'
                    },
                ]
            }
        ]
    }
}

MeteorOS.registerApp(team_manager_app);
