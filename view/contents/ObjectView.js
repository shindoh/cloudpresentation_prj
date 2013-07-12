define(['jquery','underscore','backbone',
        'ObjectController'],
    function($,_,Backbone){
        var ObjectView = Backbone.View.extend({

            cameraModule : null,

            initialize : function()
            {
                this.model.bind('change',this.updateView,this);
                this.cameraModule = this.options.cameraModule;

                this.eventBind();
            },

            events : {
               "mousedown" : "objectSelect"
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
                    model_.setSelected();
                    moveEnable = true;
                    prevX = e.clientX;
                    prevY = e.clientY;
                })

                 $('#workSpace').bind('mousemove',function(e){

                    if(moveEnable && model_.isSelected())
                    {
                        var currX = e.clientX;
                        var currY = e.clientY;

                        var scalar1 = currX-prevX;
                        var scalar2 = currY-prevY;


                        if(e.ctrlKey  && e.shiftKey)
                        {
                            var rot3d = this_.controller.getRotation(0,0,scalar2+scalar1);

                            model_.set({
                                    'rotateX':rot3d.getX(),
                                    'rotateY':rot3d.getY(),
                                    'rotateZ':rot3d.getZ()}
                            );
                        }
                        else if(e.ctrlKey)
                        {
                            var rot3d = this_.controller.getRotation(scalar1,scalar2);

                            model_.set({
                                    'rotateX':rot3d.getX(),
                                    'rotateY':rot3d.getY(),
                                    'rotateZ':rot3d.getZ()}
                            );
                        }
                        else
                        {
                            var pos3d = this_.controller.getPosition(scalar1,scalar2);

                            model_.set({
                                    'translateX':pos3d.getX(),
                                    'translateY':pos3d.getY(),
                                    'translateZ':pos3d.getZ()}
                            );
                        }


                        prevX = currX;
                        prevY = currY;
                    }
                }).bind('mouseup',function(e){
                     moveEnable = false;

                     if(model_.isSelected())
                     {

                         model_.commitToCollection({
                                 'rotateX': model_.get('rotateX'),
                                 'rotateY': model_.get('rotateY'),
                                 'rotateZ': model_.get('rotateZ'),
                                 'translateX': model_.get('translateX'),
                                 'translateY': model_.get('translateY'),
                                 'translateZ': model_.get('translateZ')
                             });

                     }

                });


                $('#workSpace').bind('mousewheel',function(e){
                    if(model_.isSelected())
                    {
                        var pos3d = this_.controller.getDepth(-e.originalEvent.wheelDelta/10);
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
                this.controller.showFacade();
                var angle = this.controller.getRotation(0,0,0);

                this.model.set('rotateX',angle.getX());
                this.model.set('rotateY',angle.getY());
                this.model.set('rotateZ',angle.getZ());

                console.log(angle.getX(),angle.getY(),angle.getZ());
                this.updateView();

                return this;
            },

            cssRenderer : function()
            {
                var borderWidth = this.model.get('borderWidth');
                var borderColor = this.model.get('borderColor');
                var borderStyle = this.model.get('borderStyle');
                var borderTopLeftRadius = this.model.get('borderTopLeftRadius');
                var borderTopRightRadius = this.model.get('borderTopRightRadius');
                var borderBottomLeftRadius = this.model.get('borderBottomLeftRadius');
                var borderBottomRightRadius = this.model.get('borderBottomRightRadius');
                var borderBottomRightRadius = this.model.get('borderBottomRightRadius');
                var boxShadows = this.model.get('boxShadows');

                var objectWrap = $(this.el)[0];

                objectWrap.style['borderWidth'] = borderWidth+'px';

                objectWrap.style['borderColor'] = borderColor;
                objectWrap.style['borderStyle'] = borderStyle;
                objectWrap.style['borderTopLeftRadius'] = borderTopLeftRadius+'px';
                objectWrap.style['borderTopRightRadius'] = borderTopRightRadius+'px';
                objectWrap.style['borderBottomLeftRadius'] = borderBottomLeftRadius+'px';
                objectWrap.style['borderBottomRightRadius'] = borderBottomRightRadius+'px';

                var boxShadowsCss = '';
                for(i in boxShadows)
                {
                    var boxShadow = boxShadows[i]+',';
                    boxShadowsCss += boxShadow;
                }

                boxShadowsCss = boxShadowsCss.slice(0,boxShadowsCss.length-1);
                objectWrap.style['boxShadow'] = boxShadowsCss;
            },

            updateView : function()
            {
                var top = this.model.get('top');
                var left = this.model.get('left');

                var width = this.model.get('width');
                var height = this.model.get('height');

                this.controller.setRotation(this.model.get('rotateX'),this.model.get('rotateY'),this.model.get('rotateZ'));
                this.controller.setPosition(this.model.get('translateX'),this.model.get('translateY'),this.model.get('translateZ'));

                var matrix3d = this.controller.getMatrixQuery();

                $(this.el).css({

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

                this.cssRenderer();

            }


    });

        return ObjectView;


    });
