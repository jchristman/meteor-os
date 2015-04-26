MeteorOS.FS.validate = function(key, val, action) {
    var self = this;
    var validated = false;
    _.each(MeteorOS.FS.validate._funcs, function (func) { validated = validated || func.call(self, key, val, action) });
    return validated;
}

MeteorOS.FS.validate._funcs = [];
MeteorOS.FS.validate.addValidation = function(validation) {
    if (typeof validation === 'function') MeteorOS.FS.validate._funcs.push(validation);
}
