if (Meteor.isServer) {
    Meteor.startup(function() {
        if (Meteor.users.find().count() < 1000) {
            Meteor.defer(function() {
                function randString(x){
                    var s = "";
                    while(s.length<x&&x>0){
                        var r = Math.random();
                        s+= String.fromCharCode(Math.floor(r*26) + (r>0.5?97:65));
                    }
                    return s;
                }

                for (var i = 0; i < 1000; i++) {
                    Accounts.createUser({
                        username: randString(4),
                        email: '',
                        password: 'bob',
                        profile: {}
                    });
                }
            });
        }
    });    
}
