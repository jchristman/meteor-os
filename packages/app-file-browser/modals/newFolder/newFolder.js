MeteorOS.FS.Modals.NewFolder = function() {
    var options = {
        title : 'Create New Folder',
        template : Template._meteor_os_file_browser_new_folder,
        removeOnHide: true,
        buttons: {
            create : {
                label : 'Create',
                class : 'btn-success',
            },
            cancel : {
                label : 'Cancel',
                class : 'btn-default'
            }
        }
    };

    var modal = ReactiveModal.initDialog(options);

    modal.buttons.create.on('click', function(button) {
        var name = $(modal.modalTarget).find('#name').val();
        if (name) {
            MeteorOS.FS.current().cwd().addDir(new FileSystem.Dir(name));
        } else {
            MeteorOS.Alerts.Info('Cannot have a blank file name');
        }
    });

    return modal;
}

Template._meteor_os_file_browser_new_folder.events({
    'keypress #name': function(event) {
        if (event.charCode === 13) {
            event.stopPropagation();
            return false;
        }
    }
});
