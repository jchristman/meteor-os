var exampleApp2 = new Application({
    name : 'Example App 2',
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
                    tempalte : 'example2tab1template'
                },
                {
                    id : 'example2tab2',
                    title : 'Example 2 Tab 2',
                    pane_id : 'example2window2_pane',
                    active : false,
                    tempalte : 'example2tab2template'
                }
            ]
    }
});

MeteorOS.registerApp(exampleApp2);
