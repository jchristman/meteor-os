var FADE_SPEED = 250;
var ALERT_LENGTH = 3000;

ALERTS = {
    NotImplemented : function() {
        Alerts.add('Sorry this function is not yet implemented', 'warning', {
            fadeIn : FADE_SPEED,
            fadeOut : FADE_SPEED,
            autoHide : ALERT_LENGTH
        });
    },

    Error : function(msg) {
        Alerts.add(msg, 'error', {
            fadeIn : FADE_SPEED,
            fadeOut : FADE_SPEED,
            autoHide : ALERT_LENGTH
        });
    }
}
