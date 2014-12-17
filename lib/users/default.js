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
