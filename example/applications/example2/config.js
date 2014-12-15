var exampleApp2 = {
    appID : '88f7fa88-7c4d-4ecc-ba25-a99a930c6729',
    appName : 'Example App 2',
    package : 'Example.Package.Path',
    layout : {
        windows : [
                {
                    id : 'example2window1',
                    top : '23%',
                    left : '23%',
                    height : '25%',
                    width : '50%',
                    focused : true
                },
                {
                    id : 'example2window2',
                    top : '55%',
                    left : '23%',
                    height : '25%',
                    width : '50%',
                    focused : false
                }
            ],
        
        tabs : [
                {
                    id : 'example2tab1',
                    title : 'Example 2 Tab 1',
                    pane_id : 'example2window1_pane',
                    active : true,
                    template : 'example2tab1template'
                },
                {
                    id : 'example2tab2',
                    title : 'Example 2 Tab 2',
                    pane_id : 'example2window2_pane',
                    active : false,
                    template : 'example2tab2template'
                }
            ]
    }
};

MeteorOS.registerApp(exampleApp2);
