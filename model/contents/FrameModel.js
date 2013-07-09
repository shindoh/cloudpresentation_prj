define(['jquery','underscore','backbone',
            'model/contents/ObjectModel']
    ,function($,_,Backbone,ObjectModel){

    var frameModel = ObjectModel.extend({
          initialize : function(option)
          {

              ObjectModel.prototype.initialize.call(this);
              this.set('type','frame');

              this.set('width',option.width);
              this.set('height',option.height);

              this.set('contain',[]);
          },

          addContain : function(model)
          {
              var contain = this.get('contain');
              this.removeContain(model);
              contain.push(model);
              $('#mainRightLayout').trigger('refreshContainStyle');
              console.log("length : " + contain.length);
          },

          removeContain : function(model)
          {
              var view = this.collection.views[model.cid];
              view.presentUnFocus();
              var contain = this.get('contain');
              var index = contain.indexOf(model);
              if(index!=-1)
              {
                  contain.splice(index,1);
              }

          },

          //object contain
          containObject : function()
          {
                var models = this.collection.models;

                var startX = this.get('translateX');
                var startY = this.get('translateY');
                var startZ = this.get('translateZ');

                var endX = this.get('width');
                var endY = this.get('height');

                var contain = this.get('contain');

                for(var i = 0 ; i < models.length ; i++)
                {
                    var model = models[i];

                    if(model.cid == this.cid)
                    {
                        continue;
                    }

                    var objStartX = model.get('translateX');
                    var objStartY = model.get('translateY');
                    var objStartZ = model.get('translateZ');

                    if( ((startX < objStartX) && (startY < objStartY)) &&
                        ((endX > objStartX) && (endY > objStartY)) &&
                        (startZ >= objStartZ) )
                    {
                        contain.push(model);
                    }

                }
          }



    });

    return frameModel;
});