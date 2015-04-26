MeteorOS.Alerts.Warning = function(msg) {
    Alerts.add(msg, 'warning', {
        fadeIn : MeteorOS.Alerts.CONST.fadeSpeed,
        fadeOut : MeteorOS.Alerts.CONST.fadeSpeed,
        autoHide : MeteorOS.Alerts.CONST.time
    });
};
