FileSystem.File = function(name, parent, fsFile) {
    if (name == undefined) Meteor.Error('Must specify a name in the File constructor');

    this.parent = parent;
    this.NAME = new ReactiveVar(name);
    this.TYPE = new ReactiveVar(FileSystem.Types.File);
    this.SHARED = []; // A list of team IDs its shared with
    this.SHARED_DEP = new Tracker.Dependency;
    this.FILE = new ReactiveVar('');
    if (fsFile)
        this.file(fsFile);

    this.watch();
}

// Accessors/Mutators
FileSystem.File.prototype.name = function(newVal) {
    if (newVal) {
        this.NAME.set(newVal);
    } else {
        return this.NAME.get();
    }
}

FileSystem.File.prototype.type = function(newVal) {
    if (newVal) {
        this.TYPE.set(newVal);
    } else {
        return this.TYPE.get();
    }
}

FileSystem.File.prototype.shared = function() {
    this.SHARED_DEP.depend();
    return this.SHARED;
}

FileSystem.File.prototype.file = function(fsFile) {
    if (fsFile) { // If it exists, we are uploading or setting
        if (fsFile._id) { // We are just setting the ID. TODO: Maybe we are updating?
            this.FILE.set(fsFile._id);
        } else { // We are uploading the file because there is no ID
            MeteorOS.FS.current().upload(fsFile);
        }
    } else { // We are getting the file. We are just going to return the file object here.
        return MeteorOS.FS.current().getFile(this.FILE.get());
    }
}

// Generate the URL, generate a link, click the link, remove the link
FileSystem.File.prototype.download = function() {
    var fsFile = this.file();
    var url = fsFile.url({download : true, auth : true, filename : downloadName});
    console.log(url);
    var link = document.createElement('a');
    link.href = url;
    link.download = downloadName;
    link.click();
    link.remove();
}

//TODO: share method

FileSystem.File.prototype.watch = function() {
    this._watch('NAME', this.name);
    this._watch('TYPE', this.type);
}

FileSystem.File.prototype._watch = function(prop, func) {
    var self = this;
    Tracker.autorun(function(comp) {
        var val = func.call(self); // Reactive on the property
        if (!comp.firstRun) {
            self.save(prop, val, '$set');
        }
    });
}

FileSystem.File.prototype.watcher = function(prop, oldval, newval) {
    this.save(prop, newval, '$set');
    return newval;
}

FileSystem.File.prototype.save = function(prop, newval, action) {
    this.parent.save(prop, newval, action, this);
}

FileSystem.File.unserialize = function(file, parent) {
    var newFile = new FileSystem.File(file.NAME, parent);
    newFile.SHARED = file.SHARED;
    return newFile;
}

FileSystem.File.prototype.serialize = function() {
    var result = {
        NAME : this.name(),
        TYPE : this.type(),
        SHARED : this.SHARED,
    }
    return result;
}
