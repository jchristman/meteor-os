METEOR_OS_FB_FILE_CONTEXT_MENU = {
    id: 'FB_FILE-METEOR_OS_CONTEXT-MENU',
    data : [
    {
        header: 'Main Actions'
    },
    {
        icon: 'glyphicon-download',
        text: 'Download File',
        action: function(event, selector) {
            var fileID = selector.find('.fb_fileID').data('id');
            var fsFile = MeteorOS_FS.findOne(fileID);
            var url = fsFile.url({download : true, auth : true});
            console.log(url);
            var link = document.createElement('a');
            var downloadName = selector.find('.fb_fileName').text();
            link.href = url;
            link.download = downloadName;
            link.click();
            link.remove();
        }
    },
    {
        icon: 'glyphicon-edit',
        text: 'Rename File',
        action: function(event, selector) {
            console.log(selector);
        }
    },
    {
        icon: 'glyphicon-share-alt',
        text: 'Move File',
        action: function(event, selector) {
            console.log(selector);
        }
    },
    {
        icon: 'glyphicon-star',
        text: 'Make Favorite',
        action: function(event, selector) {
            console.log(selector);
        }
    },
    { divider : true },
    {
        icon: 'glyphicon-trash',
        text: 'Delete File',
        action: function(event, selector) {
            console.log(selector);
        }
    },
]};
