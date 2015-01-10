var FADE_SPEED = 250;
var ALERT_LENGTH = 3000;

ALERTS = {};

ALERTS.Error = function(msg) {
    Alerts.add(msg, 'error', {
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
