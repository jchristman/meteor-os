Router.route('/', function() {
    this.redirect('/login');
});
   
Router.map(function() {
    this.route('home', {
        path: '/home',
        template: 'meteorOS',
        onBeforeAction: AccountsTemplates.ensureSignedIn
    });
});

AccountsTemplates.configureRoute('ensureSignedIn', {
    template: 'meteorOSLoginError'
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
