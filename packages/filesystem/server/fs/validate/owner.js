// Validate the owner change on the file system
var validate_owner = function(key, val, action) {
    if (key.endsWith('OWNER')) {
        console.log('MeteorOS.FS - Validating Owner:', key, val, action);
        
        check(val, String); // First make sure that the new value is a string

        var user = Meteor.users.findOne(this.userId);
        if (user) {
            var currentOwner = MeteorOS.Helpers.Object.access(user.meteorOS.fs, key);
            if (currentOwner !== user._id) throw new Meteor.Error('Permission Denied', 'That file is not owned by you. You cannot do this.');
            if (Meteor.users.findOne(val) === undefined) throw new Meteor.Error('Invalid User', 'The user you tried to transfer ownership to does not exist');
            if (action !== '$set') throw new Meteor.Error('Invalid action', action);
        } else {
            throw new Meteor.Error('Error', 'Log in again please.');
        }
        return true;
    }
    return false;
}

MeteorOS.FS.validate.addValidation(validate_owner);
