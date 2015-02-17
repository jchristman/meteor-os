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
                focused : true,
                top : '50px',
                left : '50px',
                width : '800px',
                height : '450px',
                pages : [
                    {
                        title : 'Account',
                        template : '_meteor_os_settings_accounts_page',
                        selected : true
                    },
                    {
                        title : 'Team Management',
                        template : '_meteor_os_settings_team_management_page'
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
