CWD = 'FileBrowserCurrentDir'

if (Meteor.isClient) {
    Meteor.startup(function() {
        Session.set(CWD, '/home');
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
            Session.set(CWD, this.path);
        } 
    });

    Template.fb_pane_main.rendered = function() {
        var dropzone = new Dropzone(this.find('#fb-dropzone'), {
            maxFileSize : 50,
            previewsContainer : '#previews-container',
            url : '/null', // Necessary for the library but not for us
            accept: function(file, done) {
                var fsFile = new FS.File(file);
                MeteorOS_FS.insert(fsFile);
                done();
            }
        });

        dropzone.on('addedfile', function(file) {
            
        });
    }

    Template.fb_pane_main.helpers({
        currentPathFiles : function() {
            var cwd = Session.get(CWD).split('/');
            var file_tree = this.files;
            for (var i = 0; i < cwd.length; i++) {
                for (var j = 0; j < file_tree.length; j++) {

                    if (file_tree[j].name == cwd[i]) {
                        file_tree = file_tree[j].files;
                        break;
                    }

                }
            }
            
            if (Session.get(CWD) != '/')
                file_tree.splice(0,0,{ name : '..', type : FILES.DIR });

            return { files : file_tree };
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
}
