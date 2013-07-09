(function($){

    $.fn.enableEdit = function(options)
    {
        return this.each(function(){

            var currentCaretPosition;
            var queque = 0;
            var isHankey = false;
            var workEl = this;
            var spliceFunc = null;
            var ctrlDown = false;
            var ctrlKey = 17, vKey = 86, cKey = 67;


            if(options)
            {
                spliceFunc = options.spliceFunc;
            }

            $(document).keydown(function(e)
            {
                if (e.keyCode == ctrlKey) ctrlDown = true;
            }).keyup(function(e)
                {
                    if (e.keyCode == ctrlKey) ctrlDown = false;
                });

            $(this).attr('contenteditable',true);

            $(this).bind('keydown',function(e){
                if(e.keyCode==229)
                {
                    isHankey=true;
                }
                else
                {
                    console.log('not hangul');
                    isHankey=false;
                    queque++;
                }
            });

            $(this).bind('keyup',function(e){
                if(e.keyCode==38) {
                    workEl = $(workEl).prev();
                }else if(e.keyCode==40)
                {
                    workEl = $(workEl).next();
                }

                if(!isHankey)
                {
                    queque--;
                    if(queque==0)
                    {


                        if( (e.keyCode != 38) && (e.keyCode != 37) && (e.keyCode != 39)  && (e.keyCode != 40))
                            allEventRefresh(this);


                    }
                }
                if(e.keyCode == 13)
                {
                    queque=0;

                    allEventRefresh(this,e);
                }
                if(ctrlDown && e.keyCode==86)
                {
                    console.log('paste');

                    $(this).find('.clSentence').each(function(i,sentence){
                        $(sentence).find(':not(.clWord)').each(function(idx,word){
                            console.log(idx);
                            console.log(word);
                        });
                    });


                    allEventRefresh(this);
                }
            });

            $(this).bind('focusout',function(e){

                allEventRefresh(this);
                $(this).attr('contenteditable',false);
            });

            $(this).bind('click',function(e){

                $(this).attr('contenteditable',true);
            });

            function allEventRefresh(el,evt)
            {
                var pureText = $(el).justtext();
                console.log(pureText);


                if(el.previousElementSibling)
                {
                    cssText = el.previousElementSibling.style.cssText;
                }

                var spans = $(el).find('span');
                var insertPosition = getCaretPosition(this)+1;

                var newContentWithSpans='';
                for(var i = 0 ; i < pureText.length ; i++)
                {
                    newContentWithSpans += '<span class=lcWord>'+pureText[i]+'</span>';
                }




                if(spans.length==0)
                {
                    $(el).append("<div class=clSentence>"+newContentWithSpans+"</div>");
                    workEl = $(el).find('div:first-child');
                }
                else
                {

                    spans.eq(insertPosition).after(newContentWithSpans);
                }

                $(el).contents().filter(function(){
                    return this.nodeType === 3;
                }).remove();


                $(el).find('div.clSentence').each(function(idx,sentence){

                    $(sentence).find('span.lcWord').each(function(idx,word){
                        //console.log(word);
                        if($(word).text().length>1)
                        {
                            var newContent = $(word).text().substr(1,$(word).text().length+1);

                            $(word).text($(word).text().replace(newContent,''));


                            var cssText = "style='"+$(word).context.style.cssText+"'";

                            newContentWithSpans = '';
                            for(var i = 0 ; i < newContent.length ; i++)
                            {
                                newContentWithSpans += "<span class=lcWord "+cssText+">"+newContent[i]+"</span>";
                            }

                            console.log(newContentWithSpans);
                            $(word).after(newContentWithSpans);

                            setCaretPosition(workEl,getCaretPosition(workEl)+newContent.length);
                        }
                    });

                });

                if(evt && evt.keyCode==13)
                {
                    var sel = window.getSelection();
                    if (sel.rangeCount) {
                        var range = sel.getRangeAt(0);

                        var container = range.commonAncestorContainer;

                        while(container.nodeType!=1)
                        {
                            container =  container.parentNode;
                        }

                        workEl = $(workEl).next();

                        $(workEl).addClass('clSentence');
                        setCaretPosition(workEl,getCaretPosition(workEl));
                    }
                }
                else
                {
                    setCaretPosition(workEl,getCaretPosition(workEl));
                }

                if(spliceFunc)
                {
                    spliceFunc();
                }

            }

            function setCaretPosition(el,pos)
            {

                if (window.getSelection) {
                    var sel = window.getSelection();
                    var idx = ((pos-1) >= 0 ) ? pos-1 : 0;
                    var targetEl = $(el).children()[idx];

                    sel.collapse(targetEl,1);
                }
            }

            function getCaretPosition(el)
            {

                var caretPos = 0, containerEl = null, sel, range;
                if (window.getSelection) {
                    sel = window.getSelection();
                    if (sel.rangeCount) {
                        range = sel.getRangeAt(0);

                        var container = range.commonAncestorContainer;

                        if(container)
                        {
                            while(container.nodeType!=1)
                            {
                                container =  container.parentNode;
                            }

                            if(container.nodeType==1)
                            {
                                if(container.tagName == 'DIV')
                                {
                                    caretPos = $(container).find('span').length;

                                }
                                else // tagName == 'SPAN'
                                {

                                    while(container.previousElementSibling)
                                    {
                                        container = container.previousElementSibling;

                                        caretPos++;
                                    }

                                    if(caretPos!=0){
                                        caretPos += 1;
                                    }
                                    else if(container.tagName=='SPAN')
                                    {
                                        caretPos=1;
                                    }
                                }
                            }



                        }


                    }


                }
                return caretPos;
            }
        });
    }


    $.fn.justtext = function() {
        return $(this).clone()
            .children()
            .remove()
            .end()
            .text();

    };

}(jQuery));