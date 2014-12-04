LAYER_DEPTH = 100;

Application = function(settings) {
    this.configure(settings);
}

Application.prototype.configure = function(settings) {
    if (!settings.hasOwnProperty('name'))       throw new Error('Application name must be specified')
    else                                        this.name = settings.name;
    if (!settings.hasOwnProperty('package'))    this.package = '';
    else                                        this.package = settings.package;
    if (!settings.hasOwnProperty('layout'))     throw new Error('Application config must have layout property');

    this.windowManager = new WM();
    this.windowManager.configure(settings.layout);
    this.windowManager.init({ layerDepth : LAYER_DEPTH });
}
