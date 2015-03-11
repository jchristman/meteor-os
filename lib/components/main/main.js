Template.meteorOS.rendered = function() {
    context.init({preventDoubleContext: false});
    context.attach('body', METEOR_OS_BODY_CONTEXT_MENU);
}

Template.meteorOS.helpers({
    checkUserStatus : function() {
        return UserCollectionSubscription.ready();
    },

    getBackground : function() {
        var background = "background: url('" + MeteorOS.backgroundURL + "') no-repeat center center fixed;"
        return background;
    }
});
