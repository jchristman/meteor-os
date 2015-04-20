if (Meteor.isServer) {
    Meteor.startup(function() {
        Meteor.defer(function() {
            var testUsers = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','aa','aaa','aaaa','aaaaa'];
            for (var i = 0; i < testUsers.length; i++) {
                if (Meteor.users.findOne({username : testUsers[i]}) != undefined) continue;
                Accounts.createUser({
                    username: testUsers[i],
                    email: testUsers[i] + '@test.com',
                    password: 'asdf',
                    profile: {}
                });
            }
        });
    });    
}
