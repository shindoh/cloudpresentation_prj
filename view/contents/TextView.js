define(['jquery','underscore','backbone',
          'view/contents/ObjectView'],
    function($,_,Backbone,ObjectView){

        var textView = ObjectView.extend({

            initialize : function(){
                ObjectView.prototype.initialize.call(this);
            },

            render : function()
            {
                if(ObjectView.prototype.render.call(this)){
                    var objectWrap = $(this.el).find('.objectWrap');
                    var editbox = $("<div class='textEditBox' >");
                    objectWrap.append(editbox);
                    editbox.html('messagehere');
                }

                $(this.el).find('.objectWrap').find('.textEditBox').enableEdit();


                this.updateView();

                return this;
            },

            updateView : function()
            {
                ObjectView.prototype.updateView.call(this);
                this.refreshSize();
            },

            refreshSize : function()
            {
                var width = $(this.el).find('.textEditBox').css('width');
                var height = $(this.el).find('.textEditBox').css('height');

                this.model.set('width',width);
                this.model.set('height',height);


            }

        });

        return textView;
    });