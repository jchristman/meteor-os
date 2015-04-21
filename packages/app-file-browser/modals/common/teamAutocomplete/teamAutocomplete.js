Template._meteor_os_file_browser_common_teamAutocomplete.helpers({
    settings : function() {
        return {
            position: 'below',
            limit: 10,
            rules: [
                {
                    collection: 'MeteorOS_Team_Collection',
                    subscription: 'teamAutocompleteSubscription',
                    field: 'name',
                    options: '',
                    template: Template._meteor_os_file_browser_common_teamPill,
                    noMatchTemplate: Template._meteor_os_file_browser_common_teamNoMatch,
                }
            ]
        }
    }
});
