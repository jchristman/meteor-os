FileSystem.Status = {};
FileSystem.Status.Idle = function() { return 'Idle...'; };

FileSystem.Status.Upload = {};
FileSystem.Status.Upload.InProgress = function() {
    var fs = MeteorOS.FS.current();
    return 'Upload In Progress: ' + fs.uploaded() + '/' + fs.uploading();
};
FileSystem.Status.Upload.Success = function() { return 'Upload success!'; };
FileSystem.Status.Upload.Failure = function() { return 'Upload failed!'; };

FileSystem.Status.Info = function() {
    var fs = MeteorOS.FS.current();
    return fs.cwd().info();
}
