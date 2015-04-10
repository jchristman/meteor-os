METEOR_OS_FB_FILE_CONTEXT_MENU = {
    id: 'FB_FILE-METEOR_OS_CONTEXT-MENU',
    data : [
    {
        header: 'Main Actions'
    },
    {
        icon: 'glyphicon-save-file',
        text: 'Download File',
        action: function(event, selector, context) {
            context.download();
        }
    },
    {
        icon: 'glyphicon-edit',
        text: 'Rename File',
        action: function(event, selector, context) {
            var fb_fileNameSpan = selector.find('.fb_fileName');
            fb_fileNameSpan.attr('contentEditable', true);
            fb_fileNameSpan.attr('tabindex','0');
            setTimeout(function() {fb_fileNameSpan.focus();fb_fileNameSpan.selectText();});
            console.log('running');
            $(fb_fileNameSpan).off('keypress');
            $(fb_fileNameSpan).on('keypress', function(event) {
                if (event.which === 13) {
                    console.log(context, fb_fileNameSpan.text());
                    context.name(fb_fileNameSpan.text()); // The context is the FileSystem.File that was clicked
                    fb_fileNameSpan.attr('contentEditable', false);
                    fb_fileNameSpan.removeAttr('tabindex');
                }
            });
        }
    },
    {
        icon: 'glyphicon-share-alt',
        text: 'Move File',
        action: function(event, selector) {
            MeteorOS.Alerts.NotImplemented();
        }
    },
    {
        icon: 'glyphicon-star',
        text: 'Make Favorite',
        action: function(event, selector) {
            MeteorOS.Alerts.NotImplemented();
        }
    },
    { divider : true },
    {
        icon: 'glyphicon-trash',
        text: 'Delete File',
        action: function(event, selector, context) {
            context.delete();
        }
    },
]};
