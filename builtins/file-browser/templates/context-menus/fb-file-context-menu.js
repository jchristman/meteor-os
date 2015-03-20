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
            fb_fileNameSpan.bind('keypress', function(event) {
                if (event.keyCode == 13) {
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
            console.log(context);
            var cwd = selector.closest('.fb-main').find('#fb-current-path').val();
            var fileName = selector.find('.fb_fileName').text();
            var fileId = selector.find('.fb_fileID').data('id');
        }
    },
]};
