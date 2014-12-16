DEFAULT_USER = {
    default : 'profile',
    fs : {
        files : [
            {
                name : 'home',
                type : FILES.DIR,
                files : [
                    {
                        name : 'Shared',
                        type : FILES.DIR,
                        files : [

                        ]
                    },
                    {
                        name : 'Welcome.txt',
                        type : FILES.FILE,
                        // TODO: Figure out CollectionFS
                    }
                ]
            }
        ],

        favorites : [
            { path : '/home' },
            { path : '/home/Shared' }
        ]
    }
}
