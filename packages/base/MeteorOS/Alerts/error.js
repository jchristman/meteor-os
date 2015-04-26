MeteorOS.Alerts.Error = function(msg) {
    if (typeof msg === 'object' && msg.error && msg.reason) msg = msg.error + ': ' + msg.reason;
    Alerts.add(msg, 'danger', {
        fadeIn : MeteorOS.Alerts.CONST.fadeSpeed,
        fadeOut : MeteorOS.Alerts.CONST.fadeSpeed,
        autoHide : MeteorOS.Alerts.CONST.time
    });
};
