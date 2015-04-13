Template.meteorOS.rendered = function() {
    context.init({preventDoubleContext: false});
    context.attach('body', METEOR_OS_BODY_CONTEXT_MENU);
}

Template.meteorOS.helpers({
    getBackground : function() {
        var background = "background: url('" + MeteorOS.backgroundURL + "') no-repeat center center fixed;"
        return background;
    }
});
