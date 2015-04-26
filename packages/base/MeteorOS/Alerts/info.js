MeteorOS.Alerts.Info = function(msg) {
    Alerts.add(msg, 'info', {
        fadeIn : MeteorOS.Alerts.CONST.fadeSpeed,
        fadeOut : MeteorOS.Alerts.CONST.fadeSpeed,
        autoHide : MeteorOS.Alerts.CONST.time
    });
};
