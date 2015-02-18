NEW_TEAM_BOOTBOX = {
    title : 'Create New Team',
    message :   '<div class="row">  ' +
                    '<div class="col-md-12"> ' +
                        '<form class="form-horizontal"> ' +
                            '<div class="form-group"> ' +
                                '<label class="col-md-4 control-label" for="name">Team Name</label> ' +
                                '<div class="col-md-4"> ' +
                                    '<input id="name" name="name" type="text" placeholder="Team name" class="form-control input-md"> ' +
                                    '<span class="help-block">Name your team</span> ' +
                                '</div> ' +
                            '</div> ' +
                        '</form> ' +
                    '</div> ' +
                '</div> ' +
                '<div class="row">  ' +
                    '<div class="col-md-12"> ' +
                        '<form class="form-horizontal"> ' +
                            '<div class="form-group"> ' +
                                '<label class="col-md-4 control-label" for="invite">Invite</label> ' +
                                '<div class="col-md-4"> ' +
                                    '<input id="invite" name="invite" type="text" placeholder="User name" class="form-control input-md"> ' +
                                    '<span class="help-block">Invite Users</span> ' +
                                '</div> ' +
                            '</div> ' +
                        '</form> ' +
                    '</div> ' +
                '</div> ',
    buttons: {
        create : {
            label : 'Create',
            className : 'btn-success',
            callback : function() {
                var team_name = $('#name').val();
                MeteorOS.Team.newTeam({
                    name : team_name,
                    owner : Meteor.user()._id,
                    members : []
                });
            }
        },
        cancel : {
            label : 'Cancel',
            className : 'btn-default'
        }
    }
}
