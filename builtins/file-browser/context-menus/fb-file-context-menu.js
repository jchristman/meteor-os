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
            var fileId = selector.find('.fb_fileID').data('id');
            var fsFile = MeteorOS_FS.findOne(fileId);
            var downloadName = selector.find('.fb_fileName').text();
            var url = fsFile.url({download : true, auth : true, filename : downloadName});
            console.log(url);
            var link = document.createElement('a');
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
            var cwd = selector.closest('.fb-main').find('#fb-current-path').val();
            var fileId = selector.find('.fb_fileID').data('id');
            var fb_fileNameSpan = selector.find('.fb_fileName');
            fb_fileNameSpan.attr('contentEditable', true);
            fb_fileNameSpan.attr('tabindex','0');
            setTimeout(function() {fb_fileNameSpan.focus();fb_fileNameSpan.selectText();});
            fb_fileNameSpan.bind('keypress', function(event) {
                if (event.keyCode == 13) {
                    UserManager.renameFile(cwd, fileId, fb_fileNameSpan.text());
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
            NotImplementedAlert();
        }
    },
    {
        icon: 'glyphicon-star',
        text: 'Make Favorite',
        action: function(event, selector) {
            NotImplementedAlert();
        }
    },
    { divider : true },
    {
        icon: 'glyphicon-trash',
        text: 'Delete File',
        action: function(event, selector) {
            var cwd = selector.closest('.fb-main').find('#fb-current-path').val();
            var fileName = selector.find('.fb_fileName').text();
            var fileId = selector.find('.fb_fileID').data('id');
            bootbox.dialog({
                message : "Are you sure you want to delete " + fileName + "?",
                title : "Delete File",
                backdrop : false,
                buttons : {
                    cancel : {
                        label : 'Cancel',
                        className : 'btn-default'
                    },
                    trash : {
                        label : 'Delete File',
                        className : 'btn-danger',
                        callback : function() {
                            UserManager.removeFile(cwd, fileId);
                        }
                    }
                }
            }); 
        }
    },
]};
