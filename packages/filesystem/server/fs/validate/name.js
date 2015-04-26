// Validate the file name change on the file system
var validate_name = function(key, val, action) {
    if (key.endsWith('NAME')) {
        console.log('MeteorOS.FS - Validating File Name:', key, val, action);
        
        check(val, String);
        if (val.length > MeteorOS.FS.CONST.MAX_NAME_LENGTH)
            throw new Meteor.Error('Validation Error', 'Maximum file name length is ' + MeteorOS.FS.CONST.MAX_NAME_LENGTH);

        if (action !== '$set') throw new Meteor.Error('Invalid action', action);

        return true;
    }
    return false;
}

MeteorOS.FS.validate.addValidation(validate_name);
