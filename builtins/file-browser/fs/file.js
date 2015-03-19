FileSystem.File = function(name, parent, fsFile) {
    FileSystem.Type.call(this, name, parent); // Super constructor

    this.TYPE = new ReactiveVar(FileSystem.Type.File);
    this.FILE_ID = new ReactiveVar('');
    if (fsFile)
        this.file(fsFile);

    this.watch('TYPE'); // Watch type and name
    this.watch('FILE_ID');
}

FileSystem.File.prototype = Object.create(FileSystem.Type.prototype);
FileSystem.File.prototype.constructor = FileSystem.File;

FileSystem.File.prototype.file = function(fsFile) {
    if (fsFile) { // If it exists, we are uploading or setting
        if (fsFile._id) { // We are just setting the ID. TODO: Maybe we are updating?
            this.FILE_ID.set(fsFile._id);
        } else { // We are uploading the file because there is no ID
            MeteorOS.FS.current().upload(fsFile, this);
        }
    } else { // We are getting the file. We are just going to return the file object here.
        return MeteorOS.FS.current().getFile(this.FILE_ID.get());
    }
}

// Generate the URL, generate a link, click the link, remove the link
FileSystem.File.prototype.download = function() {
    var fsFile = this.file();
    console.log(fsFile.hasStored());
    var url = fsFile.url({download : true, auth : true, filename : this.name(), brokenIsFine : true});
    console.log(url);
    var link = document.createElement('a');
    link.href = url;
    link.download = this.name();
    link.click();
    link.remove();
}

FileSystem.File.prototype.save = function(prop, newval, action) {
    this.parent.save(prop, newval, action, this);
}

FileSystem.File.unserialize = function(file, parent) {
    var newFile = new FileSystem.File(file.NAME, parent, {_id : file.FILE_ID});
    newFile.SHARED = file.SHARED;
    return newFile;
}

FileSystem.File.prototype.serialize = function() {
    var result = {
        NAME : this.name(),
        TYPE : this.type(),
        FILE_ID : this.FILE_ID.get(),
        SHARED : this.SHARED,
    }
    return result;
}
