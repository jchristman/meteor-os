var exampleApp1 = {
    appID : 'f0086e46-a38f-42d4-be99-2c5ef6d807d4',
    appName : 'Example App 1',
    appOpen : true,
    layout : {
        windows : [
                {
                    id : 'example1window1',
                    top : '13%',
                    left : '13%',
                    height : '50%',
                    width : '50%',
                    focused : true
                }
            ],
        
        tabs : [
                {
                    id : 'example1tab1',
                    title : 'Example 1 Tab 1',
                    pane_id : 'example1window1_pane',
                    active : true,
                    template : 'example1tab1template'
                },
                {
                    id : 'example1tab2',
                    title : 'Example 1 Tab 2',
                    pane_id : 'example1window1_pane',
                    active : false,
                    template : 'example1tab2template'
                }
            ]
    }
};

MeteorOS.registerApp(exampleApp1);
