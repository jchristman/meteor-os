var exampleApp1 = new Application({
    name : 'Example App 1',
    package : 'default',
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
                    tempalte : 'example1tab1template'
                },
                {
                    id : 'example1tab2',
                    title : 'Example 1 Tab 2',
                    pane_id : 'example1window1_pane',
                    active : false,
                    tempalte : 'example1tab2template'
                }
            ]
    }
});

MeteorOS.registerApp(exampleApp1);
