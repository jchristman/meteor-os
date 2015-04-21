Template._meteor_os_settings_team_management_page.helpers({
    myteams : function() {
        if (MeteorOS.Team.Subscriptions.ready()) {
            return MeteorOS.Team.Collection.find({}, { sort : { name : 1 }});
        }
        return undefined;
    },

    isOwner : function() {
        return this.owner._id == Meteor.user()._id;
    },

    isPending : function() {
        var pending = _.find(this.pending, function(user) {
            return Meteor.user()._id == user._id;
        });
        return pending != undefined;
    }
});

Template._meteor_os_settings_team_management_page.events({
    'click .btn' : function(event, context) {
        var action = $(event.target).data('action');
        var team_id = $(event.target).closest('.team').data('id');
        switch (action) {
            case 'newTeam':
                newTeamModal();
                break;
            case 'acceptInvite':
                MeteorOS.Team.acceptInvite(team_id);
                break;
            case 'declineInvite':
                MeteorOS.Team.declineInvite(team_id);
                break;
            case 'viewInvite':
                viewTeamModal(team_id);
                break;
            case 'leaveTeam':
                MeteorOS.Team.leaveTeam(team_id);
                break;
            case 'ownerEditTeam':
                editTeamModal(team_id);
                break;
            default:
                break;
        }
    }
});

var newTeamModal = function() {
    var tagsVar = 'inviteUsersTagsVar';
    var new_team_modal = ReactiveModal.initDialog(NEW_TEAM_MODAL);
    new_team_modal.buttons.create.on('click', function(button) {
        var team_name_input = $(new_team_modal.modalTarget).find('#name');
        
        var team_name = team_name_input.val();
        var invited = Session.get(tagsVar);
        
        MeteorOS.Team.newTeam({
            name : team_name,
            owner : { _id : Meteor.user()._id, username : Meteor.user().username, profile : { gravatarUrl : Meteor.user().profile.gravatarUrl } },
            members : [],
            pending : invited
        });
    });
    Session.set(tagsVar,[]);
    new_team_modal.show();
}

var viewTeamModal = function(team_id) {
    VIEW_INVITE_MODAL.doc = { id : team_id };
    var view_invite_modal = ReactiveModal.initDialog(VIEW_INVITE_MODAL);
    view_invite_modal.buttons.accept.on('click', function(button) {
        MeteorOS.Team.acceptInvite(team_id);
    });
    view_invite_modal.buttons.decline.on('click', function(button) {
        MeteorOS.Team.declineInvite(team_id);
    });
    view_invite_modal.show();
}

var editTeamModal = function(team_id) {
    var tagsVar = 'inviteUsersTagsVar';
    EDIT_TEAM_MODAL.doc = { id : team_id };
    var edit_team_modal = ReactiveModal.initDialog(EDIT_TEAM_MODAL);
    
    // Set the session variable to blank
    Session.set(tagsVar,[]);
    // Set up a listener on the variable
    var enableComputation = Tracker.autorun(function() {
        if (Session.get(tagsVar).length > 0) {
            edit_team_modal.buttons.update.enable();
        } else {
            edit_team_modal.buttons.update.disable();
        }
        edit_team_modal.buttons.destroy.noCloseOnClick();
        edit_team_modal.buttons.destroy.setLabel('Destroy Team');
    });
    // Set up button listeners
    edit_team_modal.buttons.destroy.on('click', function(button) {
        if (!edit_team_modal.buttons.destroy.closeModalOnClick.get()) {
            edit_team_modal.buttons.destroy.closeOnClick();
            edit_team_modal.buttons.destroy.setLabel('Are you sure?');
        } else {
            MeteorOS.Team.deleteTeam(team_id);
            enableComputation.stop();
        }
    });
    edit_team_modal.buttons.update.on('click', function(button) {
        var invited = Session.get(tagsVar);
        Session.set(tagsVar,[]);
        MeteorOS.Team.updateTeam({
            _id : team_id,
            pending : invited
        });
    });
    edit_team_modal.buttons.cancel.on('click', function(button) {
        enableComputation.stop();
    });
    // Show the modal
    edit_team_modal.show();
}
