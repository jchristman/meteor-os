Template.meteorOS.rendered = function() {
    context.init({preventDoubleContext: false});
    context.attach('body', METEOR_OS_BODY_CONTEXT_MENU);
}