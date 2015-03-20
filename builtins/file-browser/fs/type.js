FileSystem.Type = function(name, parent) {
    if (name == undefined) Meteor.Error('Must specify a name in the File constructor');

    this.parent = parent;
    this.NAME = new ReactiveVar(name);
    this.SHARED = []; // A list of team IDs its shared with
    this.SHARED_DEP = new Tracker.Dependency;

    this.watch('NAME');
}

// ------------------------ //
// Accessor/Mutator Methods //
// ------------------------ //
FileSystem.Type.prototype.name = function(newVal) {
    if (newVal) {
        this.NAME.set(newVal);
    } else {
        return this.NAME.get();
    }
}

FileSystem.Type.prototype.type = function(newVal) {
    if (newVal) {
        this.TYPE.set(newVal);
    } else {
        return this.TYPE.get();
    }
}

FileSystem.Type.prototype.shared = function() {
    this.SHARED_DEP.depend();
    return this.SHARED;
}
// ---------------------------- //
// End Accessor/Mutator Methods //
// ---------------------------- //

// -------------- //
// Action Methods //
// -------------- //
FileSystem.Type.prototype.download = function() {
    throw new Error('Must implement download function in subclass');
}

FileSystem.Type.prototype.delete = function() {
    throw new Error('Must implement delete function in subclass');
}
// ------------------ //
// End Action Methods //
// ------------------ //

// --------- //
// Internals //
// --------- //
FileSystem.Type.prototype.internalPath = function(path, caller) {
    if (path === undefined || caller === undefined) {
        return this.parent.internalPath('', this);
    } else {
        var index = this.findIndex(caller);

        if (index != -1) {
            if (path === '')    path = 'FILES.' + index;
            else                path = 'FILES.' + index + '.' + path;
            return this.parent.internalPath(path, this);
        } else {
            throw new Meteor.Error('Unable to find child file');
        }
    }
}

FileSystem.Type.prototype.path = function(path) {
    if (path === undefined) {
        return this.parent.path(this.name());
    } else {
        if (this.name() === '') return '/' + path;
        else                    return this.parent.path(this.name()) + '/' + path;
    }
}
// ------------- //
// End Internals //
// ------------- //

// ---------------------- //
// Autosave to DB Methods //
// ---------------------- //
FileSystem.Type.prototype.watch = function(prop) {
    var self = this;
    Tracker.autorun(function(comp) {
        if (typeof prop === 'string') var val = self[prop].get();
        else                          var val = prop.get();
        if (!comp.firstRun) {
            self.save(prop, val, '$set');
        }
    });
}

FileSystem.Type.prototype.save = function(prop, value, action, caller) {
    throw new Error('Must implement save function in subclass');
}

FileSystem.Type.prototype.serialize = function() {
    throw new Error('Must implement serialize function in subclass');
}
// -------------------- //
// End Autosave Methods //
// -------------------- //

FileSystem.Type.Dir = 1;
FileSystem.Type.File = 2;
