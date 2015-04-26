MeteorOS.Helpers.Object.access = function getDescendantProp(obj, desc) {
    check(desc, String); // Check to make sure the desc is a string
    var arr = desc.split(".");
    while(arr.length && (obj = obj[arr.shift()]));
    return obj;
}
