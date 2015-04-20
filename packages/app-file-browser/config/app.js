if (Meteor.isClient) {
    _FB_DIALOG_CALLBACK_FUNC = undefined;
    Meteor.startup(function() {
        Session.set('_fbDialogMode', '');
        Session.set('_fbDialogCallback', '');
    });
}

var file_browser_app_windowed_mode = {
    appID : '323a996f-1d54-46f3-9c2f-89ccbd87dffa',
    appName : 'File Browser',
    type : Application.WINDOWED_APPLICATION,
    appOpen : true,
    layout : {
        windows : [
            {
                id : 'file-browser',
                title : 'File Browser',
                type : Application.NOT_TABBED_WINDOW,
                focused : 'true',
                top : '15%',
                left : '15%',
                width : '50%',
                height : '60%',
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
                title : 'File Dialog',
                type : Application.NOT_TABBED_WINDOW,
                focused : 'true',
                top : '50px',
                left : '50px',
                width : '600px',
                height : '350px',
                template : 'file_browser_dialog'
            }
        ]
    },
    api : {
        openFile : function(callback) {
            setTimeout(function() {MeteorOS.startApplication('File Dialog')});
            MeteorOS.getApp('File Dialog').setTitle('file-browser-dialog', 'Open File...');
            Session.set('_fbDialogMode', 'openFile');
            _FB_DIALOG_CALLBACK_FUNC = callback;
        }
    }
}

MeteorOS.registerApp(file_browser_app_dialog_mode);
MeteorOS.registerApp(file_browser_app_windowed_mode);
