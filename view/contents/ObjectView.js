define(['jquery','underscore','backbone',
        'ObjectController'],
    function($,_,Backbone){
        var ObjectView = Backbone.View.extend({

            cameraModule : null,

            initialize : function()
            {
                this.model.bind('change',this.updateView,this);
                this.cameraModule = this.options.cameraModule;
                console.log(this.cameraModule);
                this.eventBind();
            },

            events : {
               "click" : "objectSelect"
            },

            eventBind : function()
            {
                var this_ = this;
                var model_ = this.model;
                var prevX = 0 ;
                var prevY = 0 ;
                var moveEnable = false;

                var ctrlKey = 17;
                var ctrlDown = false;

                $(document).keydown(function(e)
                {
                    if (e.keyCode == ctrlKey) ctrlDown = true;

                }).keyup(function(e)
                {
                    if (e.keyCode == ctrlKey) ctrlDown = false;
                });

                $(this.el).bind('mousedown',function(e){
                    moveEnable = true;
                    prevX = e.clientX;
                    prevY = e.clientY;
                })

                 $('#workSpace').bind('mousemove',function(e){
                    if(moveEnable)
                    {
                        var currX = e.clientX;
                        var currY = e.clientY;

                        var scalar1 = currX-prevX;
                        var scalar2 = currY-prevY;

                        if(!ctrlDown)
                        {
                            console.log('pos');
                            var pos3d = this_.controller.getPosition(scalar1,scalar2);

                            model_.set({
                                    'translateX':pos3d.getX(),
                                    'translateY':pos3d.getY(),
                                    'translateZ':pos3d.getZ()}
                            );
                        }
                        else
                        {
                            console.log('rot');
                            var rot3d = this_.controller.getRotation(scalar1,scalar2);

                            model_.set({
                                    'rotateX':rot3d.getX(),
                                    'rotateY':rot3d.getY(),
                                    'rotateZ':rot3d.getZ()}
                            );
                        }

                        prevX = currX;
                        prevY = currY;
                    }
                }).bind('mouseup',function(e){
                    moveEnable = false;
                });


                $('#workSpace').bind('mousewheel',function(e){
                    if(model_.isSelected())
                    {
                        var pos3d = this_.controller.getDepth(e.originalEvent.wheelDelta/10);
                        model_.set({
                                'translateX':pos3d.getX(),
                                'translateY':pos3d.getY(),
                                'translateZ':pos3d.getZ()}
                        );
                    }
                });
            },



            objectSelect : function(e)
            {
                this.model.setSelected();

                e.stopPropagation();
            },

            render : function()
            {
                $('#workSpace').find('#world').append($(this.el));
                $(this.el).append('<div class=objectWrap></div>');
                this.controller = new ObjectController(this.cameraModule.getCamera());
                this.updateView();

                return this;
            },

            updateView : function()
            {
                var top = this.model.get('top');
                var left = this.model.get('left');

                var width = this.model.get('width');
                var height = this.model.get('height');

                this.controller.setRotate(this.model.get('rotateX'),this.model.get('rotateY'),this.model.get('rotateZ'));
                this.controller.setPosition(this.model.get('translateX'),this.model.get('translateY'),this.model.get('translateZ'));

                var matrix3d = this.controller.looAtQuery();

                $(this.el).css({
                    border : '1px solid #000',
                    position: 'absolute',
                    padding : '0px',
                    margin : '0px',
                    width : width,
                    height : height,
                    webkitTransformStyle : 'preserve-3d',
                    background: this.model.get('background'),
                    webkitTransform: 'matrix3d('+matrix3d+')'
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
