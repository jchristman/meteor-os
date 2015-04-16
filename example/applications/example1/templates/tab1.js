if (Meteor.isClient) {
    Template.example1tab1template.events({
        'click #_openFileDialog' : function(event) {
            MeteorOS.getApp('File Dialog').call('openFile', function(meteorOSFile) {
                MeteorOS.Alerts.Info('Received handle for ' + meteorOSFile.name());
            });
        }
    });
}
