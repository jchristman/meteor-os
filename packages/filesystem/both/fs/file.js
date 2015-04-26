FileSystem.File = function(name, options) {
    FileSystem.Type.call(this, name, options); // Super constructor

    options = options || {};

    this.TYPE = new ReactiveVar(FileSystem.Type.File);
    this.FILE_ID = new ReactiveVar('');
    
    options.cfsFile && this._file(options.cfsFile._id);

    this._reloadTrackers();
}

FileSystem.File.prototype = Object.create(FileSystem.Type.prototype);
FileSystem.File.prototype.constructor = FileSystem.File;

// ------------------ //
// Accessors/Mutators //
// ------------------ //
FileSystem.File.prototype.file = function(cfsFile) {
    if (cfsFile) { // If it exists, we are uploading or setting
        if (cfsFile._id) { // We are just setting the ID. TODO: Maybe we are updating?
            this._file(cfsFile._id);
        } else { // We are uploading the file because there is no ID
            MeteorOS.FS.current().upload(cfsFile, this);
        }
    } else { // We are getting the file. We are just going to return the file object here.
        return MeteorOS.FS.current().getFile(this._file());
    }
}

FileSystem.File.prototype._file = function(fileId) {
    if (fileId) {
        this.FILE_ID.set(fileId);
    } else {
        return this.FILE_ID.get();
    }
}

// -------------- //
// Action methods //
// -------------- //
// Generate the URL, generate a link, click the link, remove the link
FileSystem.File.prototype.download = function() {
    var cfsFile = this.file();
    var url = cfsFile.url({download : true, auth : true, filename : this.name()});
    var link = document.createElement('a');
    link.href = url;
    link.download = this.name();
    link.click();
    link.remove();
}

FileSystem.File.prototype.delete = function() {
    MeteorOS.FS.current().deleteFile(this._file());
    this.parent.removeFile(this);
    delete this;
}

// ------- //
// DB Code //
// ------- //
FileSystem.File.prototype._reloadTrackers = function() {
    FileSystem.Type.prototype._reloadTrackers.call(this);

    this.watch('TYPE'); // Watch type and File ID
    this.watch('FILE_ID');
}

FileSystem.File.prototype.save = function(prop, newval, action, caller, callback) {
    this.parent.save(prop, newval, action, this, callback);
}

FileSystem.File.unserialize = function(file, parent) {
    var newFile = new FileSystem.File(file.NAME, { 'parent': parent, cfsFile: { _id : file.FILE_ID } });
    newFile.OWNER.set(file.OWNER);
    newFile.SHARED = file.SHARED;
    return newFile;
}

FileSystem.File.prototype.serialize = function() {
    var result = {
        NAME : this.name(),
        TYPE : this.type(),
        OWNER : this.owner(),
        FILE_ID : this._file(),
        SHARED : this.SHARED,
    }
    return result;
}
