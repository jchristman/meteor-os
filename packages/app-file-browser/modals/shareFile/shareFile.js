MeteorOS.FS.Modals.ShareFile = function() {
    var options = {
        title : 'Share File',
        template : Template._meteor_os_file_browser_share_file,
        removeOnHide: true,
        buttons: {
            share : {
                label : 'Share',
                class : 'btn-success',
            },
            cancel : {
                label : 'Cancel',
                class : 'btn-default'
            }
        }
    };

    var modal = ReactiveModal.initDialog(options);

    modal.buttons.share.on('click', function(button) {
        MeteorOS.Alerts.NotImplemented();
    });

    return modal;
}
