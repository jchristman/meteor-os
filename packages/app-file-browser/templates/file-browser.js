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
            var cur = MeteorOS.FS.current(true);
            Template.instance().subscribe(cur.SUB_NAME);
            return _.extend(this, { fs : cur });
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

    Template.fb_favorite.events({
        'dblclick .fb-favorite' : function(event) {
            var fs = MeteorOS.FS.current();
            fs.cd(this); // Change directory to the current context
        } 
    });

    Template.file_browser.onRendered(function() {
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

                var cwd = self.data.fs.cwd();
                var newFile = new FileSystem.File(fsFile.name());
                var success = cwd.addFile(newFile); // For enforcing file names
                if (!success) {
                    delete newFile;
                    return;
                }
                newFile.file(fsFile);

                done('nope'); // Necessary for the library but not for us
            }
        });
    });

    Template.file_browser.events({
        'click .fb-pane-navbar button' : function(event) {
            this.fs.cd(this.fs.cwd().parent);
        },

        'keypress input#fb-current-path' : function(event) {
            if (event.which === 13) {
                this.fs.cd($(event.target).val());
            }
        }
    });

    Template.file_browser.onRendered(function() {
        context.init({preventDoubleContext: false});
        context.attach($(this.find('.fb-pane-main')), MeteorOS.FS.ContextMenus.Background);
    });

    Template.file_browser.onDestroyed(function() {
        context.destroy($(this.find('.fb-pane-main')));
    });

    Template.fb_pane_main.helpers({
        currentPathFiles : function() {
            return this.fs.cwd().files();
        },

        fileContext : function() {
            var context = {};
            if (this.type() === FileSystem.Type.File) {
                context.fileIconURL = '/packages/meteoros_app-file-browser/img/file-icon-16x16.png';
            } else if (this.type() === FileSystem.Type.Dir) {
                context.fileIconURL = '/packages/meteoros_app-file-browser/img/folder-icon-16x16.png';
            }

            return _.extend(this, context);
        }
    });

    Template.fb_file.onRendered(function() {
    });

    Template.fb_file.onDestroyed(function() {
        context.destroy($(this.find('.fb-file')));
    });

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
        isUploaded : function() {
            // If it's a file, check to see if it's uploaded, otherwise, return true
            if (this.type() === FileSystem.Type.File) {
                var file = this.file();
                return file ? file.isUploaded() : true;
            }
            return true;
        },

        attachContext: function() {
            var instance = Template.instance();
            var self = this;
            Meteor.defer(function() {
                context.init({preventDoubleContext: false});

                context.destroy($(instance.find('.fb-file'))); // Destroy any old contexts

                if (self.type() === FileSystem.Type.Dir) { 
                    var menu = MeteorOS.FS.ContextMenus.Dir;
                } else {
                    var menu = MeteorOS.FS.ContextMenus.File;
                }

                context.attach($(instance.find('.fb-file')), menu);
            });
        }
    });

    Template.fb_pane_statusbar.helpers({
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
                var selected = $(event.target).closest('.fb-main').find('.fb-files').find('.selected').first().get()[0];
                var context = Blaze.getData(selected);
                if (context) {
                    if (context.type() !== FileSystem.Type.File) {
                        MeteorOS.Alerts.Warning('Cannot select directories to open');
                        return;
                    }
                    _FB_DIALOG_CALLBACK_FUNC(context);
                } else {
                    MeteorOS.Alerts.Warning('Must select a file to open.');
                    return;
                }
            } else{
                MeteorOS.Alerts.Error('No callback provided for file dialog');
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
