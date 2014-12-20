CWD = 'FileBrowserCurrentDir';
STATUS = 'CurrentStatus';

if (Meteor.isClient) {
    Meteor.startup(function() {
        Session.set(CWD, '/home');
        Session.set(STATUS, '');
    });

    Template.file_browser.helpers({
        currentUserContext : function() {
            var user = UserManager.getUser(Meteor.user());
            return user.fs;
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
        } 
    });

    Template.fb_pane_main.rendered = function() {
        var self = this;
        var cwd = Session.get(CWD);
        Dropzone.autoDiscover = false;
        var dropzone = new Dropzone(this.find('#fb-dropzone'), {
            maxFileSize : 50,
            previewsContainer : '#previews-container',
            url : '/null', // Necessary for the library but not for us
            clickable : '#fb-upload',
            accept: function(file, done) {
                var fsFile = new FS.File(file);
                MeteorOS_FS.insert(fsFile, function(err, fileObj) {
                    UserManager.addFile(cwd, {
                        name : fileObj.name(),
                        type : FILES.FILE,
                        uploading : true,
                        id : fileObj._id
                    });
                });
                done('nope'); // Necessary for the library but not for us
            }
        });

        dropzone.on('drop', function(event) {
            console.log('Dropped!');
        });

        dropzone.on('dragover', function(event) {
            console.log('Over!');
        });
    }

    Template.fb_pane_main.helpers({
        currentPathFiles : function() {
            var cwd = Session.get(CWD);
            var files = UserManager.traverseFileTree(cwd).files.slice(0);
            Session.set(STATUS, files.length + ' Files');
            
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

    Template.fb_file.events({
        'dblclick .fb-file' : function(event) {
            if (this.type == FILES.DIR) {
                var cwd = Session.get(CWD);
                UserManager.clearProgressbars(cwd);
                if (this.name == '..') {
                    var new_dir = cwd.substring(0, cwd.lastIndexOf('/'));
                    if (new_dir == '') new_dir = '/';
                    Session.set(CWD, new_dir);
                } else {
                    if (cwd == '/') Session.set(CWD, cwd + this.name);
                    else            Session.set(CWD, cwd + '/' + this.name);
                }
            }
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
        }
    });

    Template.fb_pane_statusbar.helpers({
        currentStatus : function() {
            return Session.get(STATUS);
        },

        statusContext : function() {
            var uploadButton = {
                buttonID : 'fb-upload',
                buttonClass : 'btn-default',
                buttonGlyphicon : 'glyphicon-upload',
                buttonText : 'Upload Files'
            }
            return _.extend(this, { statusButtons : [uploadButton] });
        }
    });

}
