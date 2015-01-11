if (Meteor.isClient) {
    Template.example1tab1template.events({
        'click #_openFileDialog' : function(event) {
            MeteorOS.getApp('File Dialog').call('openFile', function(fsFile) {
                ALERTS.Info('Received file handle for ' + fsFile.name());
            });
        }
    });
}
