define(['jquery','underscore','backbone',
          'model/contents/ObjectModel',
            'CameraModule'],
    function($,_,Backbone,

             ObjectModel){
        var workSpace = Backbone.View.extend({
            el : $('#workSpace'),

            contentsCollection : null,
            cameraModule : null,

           initialize : function()
           {
                _.bindAll(this);
               this.contentsCollection = this.options.contentsCollection;
               this.cameraModule = this.options.cameraModule;

               this.eventBind();
               this.render();
               this.draw();
           },

            events : {
                "mousedown" : "focusedWorkSpace"
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

                            var camera = this_.cameraModule.getCamera();
                            camera.rotateX(3);

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


            focusedWorkSpace : function()
            {
                this.contentsCollection.setSelected();
            },

           draw : function()
           {

           },

           render : function()
           {


               for(var i = 0 ; i < 1 ; i++)
               {
                   var rotateX =  Math.floor(Math.random() * 359) + 1;
                   var rotateY =  Math.floor(Math.random() * 359) + 1;
                   var rotateZ =  Math.floor(Math.random() * 359) + 1;

                   var objectModel2 = new ObjectModel({
                       width : 100,
                       height : 100,

                       translateX:i,
                       translateY:i,
                       translateZ:0,

                       rotateX:rotateX,
                       rotateY:rotateY,
                       rotateZ:rotateZ
                   });

                   this.contentsCollection.add(objectModel2);
               }




           }
        }) ;



        return workSpace;
    }) ;