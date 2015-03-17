/**
 *  TODO: Add a "priority lock" to the status bar through the use of a function and a variable. That way I can deconflict messages.
 *  TODO: Added a "reset" function for each time the user changes CWD.
 */

if (Meteor.isClient) {
    var STATUS = '_fb_status';
    var UPLOADING = false;
    var UPLOADED_COUNT = 0;
    var TO_UPLOAD_COUNT = 0;

    Meteor.startup(function() {
        Session.set(STATUS, '');
    });

    Template.file_browser.helpers({
        fsContext : function() {
            return _.extend(this, { fs : MeteorOS.FS.current() });
        },

        path : function() {
            return this.fs.cwd().path();
        }
    });

    Template.fb_pane_nav.helpers({
        favorites : function() {
            return this.fs.favorites();
        }
    });

    Template.fb_favorite.helpers({
        getPath : function() {
            return this.path();
        }
    });

    Template.fb_favorite.events({
        'dblclick .fb-favorite' : function(event) {
            var fs = MeteorOS.FS.current();
            fs.cd(this); // Change directory to the current context
        } 
    });

    Template.file_browser.rendered = function() {
        var self = this;
        Dropzone.autoDiscover = false;
        var dropzone = new Dropzone(this.find('#fb-dropzone'), {
            maxFileSize : 500,
            previewsContainer : '#previews-container',
            url : '/null', // Necessary for the library but not for us
            clickable : '#fb-upload',
            accept: function(file, done) {
                var fsFile = new FS.File(file);
                fsFile.owner = Meteor.userId();

                UserManager.addFile(cwd, fsFile);

                TO_UPLOAD_COUNT += 1;
                if (!UPLOADING) {
                    UPLOADING = true;
                    Session.set(STATUS, '0 of ' + TO_UPLOAD_COUNT + ' files uploaded');
                }

                done('nope'); // Necessary for the library but not for us
            }
        });
    }

    Template.file_browser.events({
        'click button' : function(event) {
            this.fs.cd(this.fs.cwd().parent);
        },

        'keypress input#fb-current-path' : function(event) {
            if (event.which === 13) {
                this.fs.cd($(event.target).val());
            }
        }
    });

    Template.fb_pane_main.helpers({
        currentPathFiles : function() {
            return { files : this.fs.cwd().files() };
        },

        fileContext : function() {
            var context = {};
            if (this.type() === FileSystem.Types.File)
                context.fileIconURL = '/packages/jchristman_meteor-os/img/fb-file-icon-16x16.png';
            else if (this.type() === FileSystem.Types.Dir)
                context.fileIconURL = '/packages/jchristman_meteor-os/img/fb-folder-icon-16x16.png';
            context.text = this.name;

            return _.extend(this, context);
        }
    });

    Template.fb_file.rendered = function() {
        context.init({preventDoubleContext: false});
        context.attach($(this.find('.fb-file')), METEOR_OS_FB_FILE_CONTEXT_MENU);
    }

    Template.fb_file.events({
        'dblclick .fb-file' : function(event) {
            var fs = MeteorOS.FS.current();
            fs.cd(this); // Change directory to the current context
        },

        'click .fb-file' : function(event) {
            var fb_file = $(event.target);
            if (!fb_file.hasClass('fb-file')) fb_file = fb_file.closest('.fb-file');
            var files = fb_file.closest('.fb-files');
            files.find('.selected').removeClass('selected');
            fb_file.addClass('selected');
        }
    });

    Template.fb_file.helpers({
        isFile : function() {
            return (this.type() == FileSystem.Types.File && this.uploading != undefined);
        },

        fileContext : function() {
            return { collectionName : 'MeteorOS_FS', id : this.id};
        },

        uploading : function() {
            return this.uploading;
        },

        finishedUpload : function(fileObj) {
            //TODO: Fix this
            UserManager.updateFile(Session.get(CWD), {
                name : fileObj.name(),
                type : FILES.FILE,
                uploading : false,
                id : fileObj._id
            });

            UPLOADED_COUNT += 1;
            Session.set(STATUS, UPLOADED_COUNT + ' of ' + TO_UPLOAD_COUNT + ' files uploaded');
            if (UPLOADED_COUNT == TO_UPLOAD_COUNT) {
                UPLOADED_COUNT = 0;
                TO_UPLOAD_COUNT = 0;
            }
        }
    });

    Template.fb_pane_statusbar.helpers({
        currentStatus : function() {
            return Session.get(STATUS);
        },

        statusContext : function() {
            var context = {
                statusButtons : [
                    {
                        buttonID : 'fb-upload',
                        buttonClass : 'btn-default',
                        buttonGlyphicon : 'glyphicon-upload',
                        buttonText : 'Upload Files'
                    }
                ]
            }
            if (this.mode != undefined) {
                context.statusButtons.push({
                    buttonID : 'fb-cancel',
                    buttonClass : 'btn-default',
                    buttonGlyphicon : 'glyphicon-remove',
                    buttonText : 'Cancel'
                });       

                if (this.mode == 'openFile') {
                    context.statusButtons.push({
                        buttonID : 'fb-openFile',
                        buttonClass : 'btn-primary',
                        buttonGlyphicon : 'glyphicon-folder-open',
                        buttonText : 'Open File'
                    });       
                }
            }
            return _.extend(this, context);
        }
    });

    Template.fb_pane_statusbar.events({
        'click #fb-openFile' : function(event) {
            if (_FB_DIALOG_CALLBACK_FUNC != undefined) {
                var selected = $(event.target).closest('.fb-main').find('.fb-files').find('.selected');
                if (selected.length) {
                    var fileId = selected.find('.fb_fileID').data('id');
                    if (fileId == undefined) {
                        ALERTS.Warning('Cannot select directories to open');
                        return;
                    }
                    var fsFile = MeteorOS_FS.findOne(fileId);
                    if (fsFile == undefined) {
                        ALERTS.Error('Uh oh! Could not find the file!');
                        return;
                    }
                    _FB_DIALOG_CALLBACK_FUNC(fsFile);
                } else {
                    ALERTS.Warning('Must select a file to open.');
                    return;
                }
            } else{
                ALERTS.Error('No callback provided for file dialog');
            }
            
            var btn = $(event.target);
            var appId = btn.closest('.window').data('appid');
            MeteorOS.quitApplication(appId);
        },

        'click #fb-cancel' : function(event) {
            var btn = $(event.target);
            var appId = btn.closest('.window').data('appid');
            MeteorOS.quitApplication(appId);
        }
    });


    //---------------------------------------------------------------//
    //                       DIALOG MODE CODE                        //
    //---------------------------------------------------------------//

    Template.file_browser_dialog.helpers({
        dialogMode : function() {
            return _.extend(this, { mode : Session.get('_fbDialogMode') });
        }
    });

}
