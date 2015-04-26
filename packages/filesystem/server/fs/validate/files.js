// Validate the files array change on the file system
var validate_files = function(key, val, action) {
    if (key.endsWith('FILES')) {
        console.log('MeteorOS.FS - Validating Files:', key, val, action);
        
        if (action === '$push') {
            check(val, {
                NAME: String,
                TYPE: Match.Integer,
                OWNER: String,
                FILE_ID: Match.Optional(String),
                SHARED: [String],
                FILES: Match.Optional([Object])
            }); // First make sure that the new value is a string
        } else if (action === '$pull') {
            check(val, {
                NAME: String
            });

            var user = Meteor.users.findOne(this.userId);
            if (user) {
                var currentOwner = MeteorOS.Helpers.Object.access(user.meteorOS.fs, key.substring(0, key.length - 'FILES'.length) + 'OWNER');
                if (currentOwner !== user._id) throw new Meteor.Error('Permission Denied', 'That file is not owned by you. You cannot do this.');
            } else {
                throw new Meteor.Error('Error', 'Log in again please.');
            }
        } else {
            throw new Meteor.Error('Invalid action', action);
        }

        return true;
    }
    return false;
}

MeteorOS.FS.validate.addValidation(validate_files);
