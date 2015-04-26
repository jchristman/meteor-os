METEOR_OS_BODY_CONTEXT_MENU = {
    id: 'BODY-METEOR_OS_CONTEXT-MENU',
    data : [
    {
        header: 'Main Actions'
    },
    {
        icon: 'glyphicon-play',
        text: 'Start Application:',
        subMenu : [
                {
                    header: 'Stopped Applications'
                },
                {
                    menu_item_src : 'METEOR_OS_CONTEXT_MENU_FUNCS.startApplication'
                }
            ]
    },
    {
        icon: 'glyphicon-off',
        text: 'Quit Application:',
        subMenu : [
                {
                    header: 'Running Applications'
                },
                {
                    menu_item_src : 'METEOR_OS_CONTEXT_MENU_FUNCS.quitApplication'
                }
            ]
    }
]};
