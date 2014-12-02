LAYER_DEPTH = 100;

Application = function(settings) {
    this.configure(settings);
}

Application.prototype.configure = function(settings) {
    if (!settings.hasOwnProperty('layout')) console.error('Application config must have layout property');

    this.windowManager = new WM();
    this.windowManager.configure(settings.layout);
    this.windowManager.init({ layerDepth : LAYER_DEPTH });
}
