MeteorOS.FS.ContextMenus.Favorite = {
    id: 'MeteorOS-FS-ContextMenus-Favorite',
    data : [
        {
            header: 'Main Actions'
        },
        {
            icon: 'glyphicon-trash',
            text: 'Remove',
            action: function(event, selector, context) {
                MeteorOS.FS.current().removeFavorite(context);
            }
        },
    ]
};
