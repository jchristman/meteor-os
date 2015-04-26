MeteorOS.FS.Modals.DeleteFolder = function(callback) {
    var options = {
        title : 'Delete Folder',
        template : Template._meteor_os_file_browser_delete_folder,
        removeOnHide: true,
        buttons: {
            del : {
                label : 'Delete Folder',
                class : 'btn-danger',
            },
            cancel : {
                label : 'Cancel',
                class : 'btn-default'
            }
        }
    };

    var modal = ReactiveModal.initDialog(options);

    modal.buttons.del.on('click', function(button) {
        callback(true);
    });

    return modal;
}
