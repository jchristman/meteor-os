MeteorOS.FS.ContextMenus.Dir = {
    id: 'MeteorOS-FS-ContextMenus-Dir',
    data : [
        {
            header: 'Main Actions'
        },
        {
            icon: 'glyphicon-save-file',
            text: 'Download Directory (as .zip)',
            action: function(event, selector, context) {
                context.download();
            }
        },
        {
            icon: 'glyphicon-edit',
            text: 'Rename Directory',
            action: function(event, selector, context) {
                var fb_fileNameSpan = selector.find('.fb_fileName');
                fb_fileNameSpan.attr('contentEditable', true);
                fb_fileNameSpan.attr('tabindex','0');
                setTimeout(function() {fb_fileNameSpan.focus();fb_fileNameSpan.selectText();});
                $(fb_fileNameSpan).off('keypress');
                $(fb_fileNameSpan).on('keypress', function(event) {
                    if (event.which === 13) {
                        context.name(fb_fileNameSpan.text()); // The context is the FileSystem.File that was clicked
                        fb_fileNameSpan.attr('contentEditable', false);
                        fb_fileNameSpan.removeAttr('tabindex');
                    }
                });
            }
        },
        {
            icon: 'glyphicon-share-alt',
            text: 'Move Directory',
            action: function(event, selector) {
                MeteorOS.Alerts.NotImplemented();
            }
        },
        {
            icon: 'glyphicon-star',
            text: 'Make Favorite',
            action: function(event, selector, context) {
                MeteorOS.FS.current().addFavorite(context);
            }
        },
        { divider : true },
        {
            icon: 'glyphicon-trash',
            text: 'Delete Directory',
            action: function(event, selector, context) {
                if (context.files().length > 0) {
                    MeteorOS.FS.Modals.DeleteFolder(function(result) {
                        if (result) context.delete();
                    }).show();
                } else {
                    context.delete();
                }
            }
        },
    ]
};

