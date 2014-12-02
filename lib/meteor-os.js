OS = function() {

}

OS.prototype.registerApp = function(application) {
    console.log(application, typeof application);
}

MeteorOS = new OS();
