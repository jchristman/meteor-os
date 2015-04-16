MeteorOS.FS.ContextMenus.Background = {
    id: 'MeteorOS-FS-ContextMenus-Background',
    data : [
        {
            icon: 'glyphicon-open-file',
            text: 'Upload File',
            action: function(event, selector, context) {
                $('#fb-upload').click();
            }
        },
        {
            icon: 'glyphicon-download-alt',
            text: 'Download All',
            action: function(event, selector, context) {
                MeteorOS.Alerts.NotImplemented();
            }
        },
        { divider: true },
        {
            icon: 'glyphicon-plus',
            text: 'New',
            subMenu : [
                {
                    header: 'Create New...'
                },
                {
                    icon: 'glyphicon-folder-close',
                    text: 'Folder',
                    action: function(e, selector, context) {
                        var modal = MeteorOS.FS.Modals.NewFolder();
                        modal.show();
                    }
                }
            ]
        },
    ]
};
