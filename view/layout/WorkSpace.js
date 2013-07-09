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


               this.render();
               this.draw();
           },

            events : {
                "mousedown" : "focusedWorkSpace"
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



               var objectModel2 = new ObjectModel({
                   top : 200,
                   left : 400,

                   width : 400,
                   height : 100,

                   translateX:100,
                   translateY:120,
                   translateZ:30,

                   rotateX:160,
                   rotateY:80,
                   rotateZ:90
               });



               this.contentsCollection.add(objectModel2);



           }
        }) ;



        return workSpace;
    }) ;