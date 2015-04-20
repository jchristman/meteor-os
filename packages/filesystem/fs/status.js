FileSystem.Status = {};
FileSystem.Status.Idle = function() { return 'Idle...'; };

FileSystem.Status.Info = function() {
    var fs = MeteorOS.FS.current();
    return fs.cwd().info();
}
