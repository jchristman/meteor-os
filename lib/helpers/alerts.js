var FADE_SPEED = 250;
var ALERT_LENGTH = 3000;

MeteorOS.Alerts = {};

var ALERTS = MeteorOS.Alerts; //alias

ALERTS.Error = function(msg) {
    Alerts.add(msg, 'danger', {
        fadeIn : FADE_SPEED,
        fadeOut : FADE_SPEED,
        autoHide : ALERT_LENGTH
    });
};

ALERTS.Warning = function(msg) {
    Alerts.add(msg, 'warning', {
        fadeIn : FADE_SPEED,
        fadeOut : FADE_SPEED,
        autoHide : ALERT_LENGTH
    });
};

ALERTS.Info = function(msg) {
    Alerts.add(msg, 'info', {
        fadeIn : FADE_SPEED,
        fadeOut : FADE_SPEED,
        autoHide : ALERT_LENGTH
    });
};

ALERTS.Success = function(msg) {
    Alerts.add(msg, 'success', {
        fadeIn : FADE_SPEED,
        fadeOut : FADE_SPEED,
        autoHide : ALERT_LENGTH
    });
};

ALERTS.NotImplemented = function() { ALERTS.Warning('Sorry this function is not yet implemented'); };
ALERTS.Unknown = function() { ALERTS.Error('Unknown Error...'); };
