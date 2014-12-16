var file_browser_app_windowed_mode = {
    appID : '323a996f-1d54-46f3-9c2f-89ccbd87dffa',
    appName : 'File Browser',
    type : Application.WINDOWED_APPLICATION,
    layout : {
        windows : [
            {
                id : 'file-browser',
                title : 'File Browser',
                type : Application.NOT_TABBED_WINDOW,
                focused : 'true',
                top : '50px',
                left : '50px',
                width : '800px',
                height : '450px',
                template : 'file_browser_windowed'
            }
        ]
    }
}

var file_browser_app_dialog_mode = {
    appID : '2bafc7ce-314b-4fc6-81bc-8656bf0ca424',
    appName : 'File Dialog',
    type : Application.DIALOG_APPLICATION,
    layout : {
        windows : [
            {
                id : 'file-browser-dialog',
                title : 'File Browser',
                type : Application.NOT_TABBED_WINDOW,
                focused : 'true',
                top : '33%',
                left : '33%',
                width : '33%',
                height : '33%',
                template : 'file_browser_dialog'
            }
        ]
    }
}

MeteorOS.registerApp(file_browser_app_dialog_mode);
MeteorOS.registerApp(file_browser_app_windowed_mode);
