define(['jquery','underscore','backbone',
    'text!template/layout/leftMenuBar.html',
    'text!template/layout/StyleTemplate.html'],
    function($,_,Backbone,LeftMenuBar,StyleTemplate){
        var leftMenuBar = Backbone.View.extend({
            el : $('#mainLeftLayout'),

            commonControlView : null,
            mode : null,
            prevModeValue : 'normal',
            template : LeftMenuBar,
            session : null,

            initialize : function()
            {
                _.bindAll(this);
                this.mode = this.options.mode;
                this.session = this.options.session;
                this.render();
            },

            render : function(){
                $(this.el).html(this.template);

                $('#lmSlider').mCustomScrollbar({
                    scrollButtons:{
                        enable:true,
                        scrollAmount: 1000
                    },
                    theme:"light-thin"
                });

                $('#lmSaveButton').click(this.saveCurrentWork);
                $('#lmSaveButton').bind('mousedown',function(e){e.preventDefault();})

                $('#lmStyleButton').click(this.stylePanelToggle);
                $('#lmStyleButton').bind('mousedown',function(e){e.preventDefault();})

                $('#lmSequenceButton').click(this.sequencePanelToggle);
                $('#lmSequenceButton').bind('mousedown',function(e){e.preventDefault();})

                $('#lmShowButton').bind('click',this.presentationShow);

            },

            sequencePanelToggle : function(e)
            {
                if($('#mainRightLayout').css('display')=='none' || this.mode.value != 'sequence')
                {
                    if(this.prevModeValue!='sequence')
                    {
                        this.prevModeValue = this.mode.value;
                    }

                    this.mode.value = 'sequence';
                    $('#mainRightLayout').trigger('sequenceShow');
                    $('#mainRightLayout').css('display','inline-block');
                }
                else
                {
                    $('#mainRightLayout').css('display','none');
                    this.mode.value = this.prevModeValue;
                }
            },

            saveCurrentWork : function(e)
            {

                var saveDatas = this.collection.extractCurrentWorkToJSON();
                this.session.saveToGoogleDrive(saveDatas);
            },

            stylePanelToggle : function(e)
            {

                if(this.mode.value =='normal' || this.mode.value =='contain')
                {
                    if($('#mainRightLayout').css('display')=='none' && this.collection.selected)
                    {
                        $('#mainRightLayout').trigger('show');
                        $('#mainRightLayout').css('display','inline-block');

                    }
                    else
                    {
                        $('#mainRightLayout').css('display','none');
                    }
                }


            },

            presentationShow : function()
            {
                var presentationJson =  [];
                var this_ = this;

                for(var i in this.collection.sequence)
                {
                    var cid = this.collection.sequence[i];

                    var slide = this.collection.getByCid(cid);
                    console.log(cid);
                    var type = slide.get('type');

                    var slideJson = {};
                    slideJson.id = 'slide_'+cid;
                    slideJson.slideStyle = {};
                    slideJson.contain = [];

                    var contents = slide.get('contents');

                    if(type == 'frame')
                    {

                        contents = this.getFrameContents(contents);

                        var contain = slide.get('contain');

                        for(var i = 0 ; i < contain.length ; i++)
                        {
                            slideJson.contain.push("slide_"+contain[i].cid);
                        }
                    }

                    slideJson.contents = contents;

                    $.each(slide.attributes,function(key,value){

                       if(this_.isNotExceptAttribute(key)){
                            slideJson.slideStyle[key] = value;
                       }

                    });

                    presentationJson.push(slideJson);
                }


                var presentationJsonStr = JSON.stringify(presentationJson);

                var account = this.session.userInfo.email;
                var slideId = this.session.currentWorkFile.id;

                var data = {
                    'slideData' : presentationJsonStr,
                    'account' : account,
                    'slideId' :  slideId
                }

                $.ajax({
                    'type' : "POST",
                    'url' : '/onAir',
                    'data' : JSON.stringify(data),
                    'dataType' : "json",
                    'contentType' : "application/json; charset=utf-8",
                    'success' : this.startPresentation,
                    'failure' : function(err){console.log(err)}
                });
            },

            startPresentation : function(data)
            {
                var presentationUrl = data.shortUrl;
                console.log(presentationUrl);

                window.open(presentationUrl);
            },

            isNotExceptAttribute : function(key)
            {
                var exceptKey = ['contain','contents'];
                var res = true;

                for(var i = 0 ; i < exceptKey.length ; i++)
                {
                    if(exceptKey[i] == key)
                    {
                        res = false;
                        break;
                    }
                }

                return res;
            },


            getFrameContents : function(contents)
            {
                var contents = $(contents).find('.frame').removeClass('frame');
                return contents[0].parentNode.outerHTML;
            }
        }) ;



        return leftMenuBar;
    }) ;