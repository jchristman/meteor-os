TeamModel = function() {

}

TeamModel.prototype.newTeam = function(team) {
    // TODO: Validate the data
    var id = MeteorOSTeamCollection.insert(team);
    Meteor.users.update({_id : Meteor.user()._id}, {$addToSet : { 'profile.MeteorOSTeams' : id }});
}

MeteorOS.Team = new TeamModel();
