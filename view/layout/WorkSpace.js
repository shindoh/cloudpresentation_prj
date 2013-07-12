define(['jquery','underscore','backbone',

          'model/contents/ObjectModel',
          'model/contents/TextModel',
            'CameraModule'],
    function($,_,Backbone,
             ObjectModel,
             TextModel){
        var workSpace = Backbone.View.extend({
            el : $('#workSpace'),

            contentsCollection : null,
            cameraModule : null,

           initialize : function()
           {
                _.bindAll(this);
               this.contentsCollection = this.options.contentsCollection;
               this.cameraModule = this.options.cameraModule;
               this.camera = this.cameraModule.getCamera();

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

                var camera_ = this.camera;

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

                    this_.contentsCollection.setSelected();
                })



                $('#workSpace').bind('mousemove',function(e){
                    if(moveEnable)
                    {
                        var currX = e.clientX;
                        var currY = e.clientY;

                        var scalar1 = (currX-prevX)/2;
                        var scalar2 = (currY-prevY)/2;

                        if(e.ctrlKey && e.shiftKey)
                        {
                            camera_.rotateZ(-(scalar2+scalar1));
                        }
                        else if(e.ctrlKey)
                        {
                            camera_.rotateX(scalar2);
                            camera_.rotateY(-scalar1);

                        }
                        else
                        {
                            camera_.setPosition( -scalar1, scalar2, 0);
                        }

                        prevX = currX;
                        prevY = currY;
                    }
                }).bind('mouseup',function(e){
                        moveEnable = false;
                    });


                $('#workSpace').bind('mousewheel',function(e){
                    if(!this_.contentsCollection.getSelected())
                    {
                        var scalar = e.originalEvent.wheelDelta/10;
                        camera_.setPosition(0,0,scalar);
                    }

                });

                $('#workSpace').on('keydown',function(e){

                    switch( e.keyCode ){
                        case 81:    //forward(q)
                            camera_.moveFor();
                            break;
                        case 69:    //backword(e)
                            camera_.moveBack();
                            break;
                        case 87:    //up(w)
                            camera_.moveUp();
                            break;
                        case 83:    //down(s)
                            camera_.moveDown();
                            break;
                        case 65:    //left(a)
                            camera_.moveLeft();
                            break;
                        case 68:    //right(d)
                            camera_.moveRight();
                            break;
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
               for(var i = 0 ; i < 2;  i++)
               {
                   var rotateX =  Math.floor(Math.random() * 359) + 1;
                   var rotateY =  Math.floor(Math.random() * 359) + 1;
                   var rotateZ =  Math.floor(Math.random() * 359) + 1;

                   var textModel1 = new TextModel({
                       width : 100,
                       height : 100,

                       translateX:100 + (500*i),

                       translateY:-100,
                       translateZ:0,

                       rotateX:0,
                       rotateY:0,
                       rotateZ:0
                   });



                   this.contentsCollection.add(textModel1);
               }




           }
        }) ;



        return workSpace;
    }) ;