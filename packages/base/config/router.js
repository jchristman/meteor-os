Router.configure({
    notFoundTemplate: 'meteorOSNotFound'
});

Router.route('/', function() {
    this.redirect('/login');
});

Router.map(function() {
    this.route('home', {
        path: '/home',
        template: 'meteorOS',
        onBeforeAction: function(pause) {
            if (!Meteor.userId()) {
                this.redirect('/login');
            }
            this.next();
        }
    });
});

AccountsTemplates.configureRoute('signIn', {
    name: 'login',
    path: '/login',
    template: 'meteorOSLogin',
    redirect: '/home'
});

AccountsTemplates.configureRoute('signUp', {
    path: '/register',
    template: 'meteorOSSignup',
    redirect: '/home'
});
