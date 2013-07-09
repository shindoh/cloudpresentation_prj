define(
    [
     'jquery',
     'underscore',
     'backbone',

     'collection/ContentsCollection',

     'view/layout/WorkSpace',
     'view/layout/TopToolBar',

     'jquery_knob',
     'jquery_jlayout',
     'jquery_dim',
     'jquery_editable',
     'jquery_lightbox',
     'jquery_scrollbar',
     'jquery_sidr',
     'jquery_jmenu',
     'jquery_nested_accordion',
     'jquery_icheck',
     'jquery_farbtastic',
     'jquery_selectbox',
     'jquery_sidelayer',
     'jquery_sortable',
     'jquery_colorpicker',

      //camera
     'vector3',
     'angle3',
     'quaternion',

     'EditGround',
     'asyncRenderer',
     'ObjectController',
     'Camera',
     'eventRepeater',
        'groundListener',
        'RenderFPS'
    ],
    function($, _, Backbone,
             ContentsCollection,
             WorkSpace,TopToolBar){

    var MainView = Backbone.View.extend({

        contentsCollection : null,
        cameraModule : null,

        initialize : function()
        {
            _.bindAll(this);

            this.setupWork();
        },



        setupWork : function(event)
        {
            this.cameraModule = new CameraModule({viewPort : $('#workSpace')});

            this.initCollections();

            this.initTopToolBar();
            this.initWorkspace();


            this.shortKey();
        },

        initCollections : function()
        {
            this.contentsCollection = new ContentsCollection();

            this.contentsCollection.setCameraModule(this.cameraModule);
        },

        initWorkspace : function()
        {
            var workSpace = new WorkSpace({
                "contentsCollection" : this.contentsCollection,
                'cameraModule' : this.cameraModule
            });

        },

        initTopToolBar : function()
        {
            var topToolBar = new TopToolBar({
                "contentsCollection" : this.contentsCollection
            });
        },

        shortKey : function()
        {
            var this_ = this;
            var ctrlDown = false;
            var shiftDown = false;
            var ctrlKey = 17,shiftKey = 16, zKey = 90;

            $(document).keydown(function(e)
            {

                if (e.keyCode == ctrlKey) ctrlDown = true;
                if (e.keyCode == shiftKey) shiftDown = true;
            }).keyup(function(e)
                {
                    if (e.keyCode == ctrlKey) ctrlDown = false;
                    if (e.keyCode == shiftKey) shiftDown = false;
            });

            $(document).keydown(function(e)
            {
                if (ctrlDown && shiftDown && e.keyCode == zKey){
                    this_.contentsCollection.redo();
                    return false;
                }
                else if (ctrlDown && e.keyCode == zKey){
                    this_.contentsCollection.undo();
                    return false;
                }
            });

        }
    });

    var initialize = function()
    {
        var mainView = new MainView;
    }

    return {
        initialize : initialize
    };
});
