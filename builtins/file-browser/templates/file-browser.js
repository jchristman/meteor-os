/**
 *  TODO: Add a "priority lock" to the status bar through the use of a function and a variable. That way I can deconflict messages.
 *  TODO: Added a "reset" function for each time the user changes CWD.
 */

if (Meteor.isClient) {
    var CWD = '_fb_cwd';
    var STATUS = '_fb_status';
    var UPLOADING = false;
    var UPLOADED_COUNT = 0;
    var TO_UPLOAD_COUNT = 0;

    Meteor.startup(function() {
        Session.set(CWD, '/home');
        Session.set(STATUS, '');
    });

    Template.file_browser.helpers({
        currentUserContext : function() {
            var user = UserManager.getUser(Meteor.user());
            return _.extend(this, user.fs);
        },

        currentPath : function() {
            return { path : Session.get(CWD) };
        }
    });

    Template.fb_favorite.helpers({
        convertPath : function() {
            return _.extend(this, { text : this.path.substring(this.path.lastIndexOf('/') + 1) })
        }
    });

    Template.fb_favorite.events({
        'dblclick .fb-favorite' : function(event) {
            UserManager.clearProgressbars(Session.get(CWD));
            Session.set(CWD, this.path);
            UPLOADING = false;
        } 
    });

    Template.file_browser.rendered = function() {
        var self = this;
        var cwd = Session.get(CWD);
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

    Template.fb_pane_main.helpers({
        currentPathFiles : function() {
            var cwd = Session.get(CWD);
            var files = UserManager.traverseFileTree(cwd).files.slice(0);
            if (!UPLOADING) Session.set(STATUS, files.length + ' Files');
            
            if (Session.get(CWD) != '/')
                files.splice(0,0,{ name : '..', type : FILES.DIR });

            return { 'files' : files };
        },

        fileContext : function() {
            var context = {};
            var cwd = Session.get(CWD);
            if (this.type == FILES.FILE)
                context.fileIconURL = '/packages/jchristman_meteor-os/img/fb-file-icon-16x16.png';
            else if (this.type == FILES.DIR)
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
            if (this.type == FILES.DIR) {
                var cwd = Session.get(CWD);
                UserManager.clearProgressbars(cwd);
                UPLOADING = false;
                if (this.name == '..') {
                    var new_dir = cwd.substring(0, cwd.lastIndexOf('/'));
                    if (new_dir == '') new_dir = '/';
                    Session.set(CWD, new_dir);
                } else {
                    if (cwd == '/') Session.set(CWD, cwd + this.name);
                    else            Session.set(CWD, cwd + '/' + this.name);
                }
            }
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
            return (this.type == FILES.FILE && this.uploading != undefined);
        },

        fileContext : function() {
            return { collectionName : 'MeteorOS_FS', id : this.id};
        },

        uploading : function() {
            return this.uploading;
        },

        finishedUpload : function(fileObj) {
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
