define(['jquery','underscore','backbone',
        'ObjectController'],
    function($,_,Backbone){
        var ObjectView = Backbone.View.extend({

            controller : null,
            cameraModule : null,

            initialize : function()
            {
                this.model.bind('change',this.updateView,this);
                this.cameraModule = this.options.cameraModule;
            },

            events : {
               "mousedown" : "mouseDownObjectContent"
            },

            mouseDownObjectContent : function(e)
            {
                this.model.setSelected();
                e.stopPropagation();
            },

            render : function()
            {
                $('#workSpace').append($(this.el));
                $(this.el).append('<div class=objectWrap></div>');
                this.controller = new ObjectController(this.cameraModule.getCamera(), angle3(0,0,0), vector3(0,0,0));
                this.controller.rotateX( 30 );
                this.controller.rotateY( 110 );
                 console.log(this.cameraModule.getCamera());
                this.updateView();

                return this;
            },

            updateView : function()
            {
                var top = this.model.get('top');
                var left = this.model.get('left');

                var width = this.model.get('width');
                var height = this.model.get('height');

                $(this.el).css({
                    border : '1px solid #000',
                    position: 'absolute',
                    padding : '0px',
                    margin : '0px',
                    width : width,
                    height : height,
                    top : top,
                    left : left,
                    webkitTransformStyle : 'preserve-3d',
                    background: this.model.get('background'),
                    webkitTransform: 'matrix3d('+this.controller.looAtQuery()+')'
                });

                $(this.el).find('.objectWrap').css({
                   "width" : width,
                    "height" : height,
                    "padding" : '0px',
                    "margin" : '0px'
                });

            }


    });

        return ObjectView;


    });
