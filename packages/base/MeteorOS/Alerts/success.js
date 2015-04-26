MeteorOS.Alerts.Success = function(msg) {
    Alerts.add(msg, 'success', {
        fadeIn : MeteorOS.Alerts.CONST.fadeSpeed,
        fadeOut : MeteorOS.Alerts.CONST.fadeSpeed,
        autoHide : MeteorOS.Alerts.CONST.time
    });
};
