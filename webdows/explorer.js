/*!
Project: Webdows
Liscense: MIT
Author: krisdb2009
File: webdows/explorer.js
*/
var explorer = {
    theme : function(themeName, extraCSS) {
        if(typeof themeName == 'undefined') {
            if(localStorage.getItem("theme") == null) {
                var themeName = 'webdows';
            } else {
                var themeName = localStorage.getItem("theme");
            }
        }
        if(typeof extraCSS == 'undefined') {
            if(localStorage.getItem("themeCSS") == null) {
                var extraCSS = '';
            } else {
                var extraCSS = localStorage.getItem("themeCSS");
            }
        }
        localStorage.setItem("theme", themeName);
        localStorage.setItem("themeCSS", extraCSS);
        $('head style').html(extraCSS);
        $('#theme').attr('href','webdows/resources/explorer/'+themeName+'/index.css');
        return themeName;
    },
    initiate : function() {
        $('#bootlog').append('<div>explorer.js . . . GOOD</div>');
        $('.explorer').remove();
        $('noscript').remove();
        $('head').append('<link class="explorer" href="webdows/resources/explorer/explorer.css" rel="stylesheet" type="text/css">');
        $('head').append('<link class="explorer" id="theme" href="" rel="stylesheet" type="text/css"><style></style>');
        $('body').append('<div id="load"></div><div style="visibility:hidden;" id="open"><span class="a"></span><span class="b"></span><span class="c"></span><span class="d"></span><span class="e"></span></div><div style="visibility:hidden;" class="explorer" id="desktop"><div id="taskbar"><span id="leftframe"><div id="start"></div></span><span id="middleframe"></span><span id="rightframe"><span id="time"></span></span></div></div>');
        explorer.start.initiate();
        var open = new Audio('webdows/resources/explorer/1.ogg');
        $("#taskbar #middleframe").sortable({
            revert: true,
            axis: "x",
            items: ".button",
            distance: 5,
            helper : 'clone'
        });
        var timeService = setInterval(function() {
            var date = new Date();
            $('#taskbar #time').html(system.formatAMPM(date));
        }, 1000);
        var theme = explorer.theme();
        var winl = new explorer.window();
        $('#bootlog').append('<div>Initializing Explorer . . . GOOD</div>');
        $('#bootlog').append('<div>Loading Theme "'+theme+'" </div>');
        var timer = setInterval(function() {
            $('#bootlog div').last().append('. . . ');
            if(document.readyState == 'complete') {
                clearInterval(timer);
                function ani() {
                    $('#bootlog div').last().append('GOOD');
                    $('#bootlog').append('Starting Explorer . . .');
                    setTimeout(function(){
                        $('#bootlog').remove();
                        $('body #load').remove();
                        setTimeout(function() {
                            $('body #desktop.explorer').removeAttr('style');
                            var anim = $('body #open').removeAttr('style').clone();
                            $('body #open').remove();
                            $('body').append(anim);
                            open.play();
                            winl.close();
                            explorer.start.toggle();
                            setTimeout(function() {
                                $('body #open').remove();
                            }, 3000);  
                        }, 1000);
                    }, 1000);
                }
                if(system.is.mobile()) {
                    $('body #load').css('background-image','url(\'webdows/resources/explorer/2.gif\')');
                    $('body #load').on('click', function() {
                        open.play();
                        open.pause();
                        ani();
                    });
                } else {
                    ani();
                }
            }
        }, 100);
    },
    start : {
        toggle : function() {
			var start = $('#desktop #startmenu');
			if(start.hasClass('minimized')) {
				start.removeClass('minimized');
                if(!system.is.mobile()) {
                    $('#startmenu .search input').focus();
                }
			} else {
				start.addClass('minimized');
                $('#startmenu .search input').val('');
                explorer.start.allProgramsSearch('');
			}
            if($('#startmenu .lllist').hasClass('all')) {
                explorer.start.allProgramsToggle();
            }
        },
        initiate : function() {
            $('#desktop').append('<div id="startmenu"><div class="lllist"></div><div class="apb"></div><div class="search"><input type="text"/></div><div class="rllist"></div><div class="icon"></div></div>');
            $('#startmenu .apb').click(function() {
                explorer.start.allProgramsToggle(); 
                if($('#startmenu .search input').val() !== '') {
                    $('#startmenu .search input').val('');
                    explorer.start.allProgramsSearch('');
                }
            });
            $('#startmenu .search input').on('input', function() {
                explorer.start.allProgramsSearch($(this).val());
            });
            $('#startmenu .search input').keyup(function(e) {
                if(e.keyCode == 13) {
                    explorer.start.allProgramsSearch($(this).val()).click();
                }
            });
            $('#desktop').on('mousedown', function(e) {
                if(!$(e.target).parents('#desktop #startmenu').length && !$(e.target).is('#desktop #startmenu') && !$(e.target).parents('#taskbar #start').length && !$(e.target).is('#taskbar #start')) {
                    if(!$('#desktop #startmenu').hasClass('minimized')) {
                        explorer.start.toggle();
                    }
                }
            });
            $('#taskbar #start').click(function() {
                explorer.start.toggle();
            });
        },
        append : function(left, right) {
            left = typeof left !== 'undefined' ? left : [];
            right = typeof right !== 'undefined' ? right : [];
            $.each(left, function(i, v){
                explorer.start.addLButton(v.title, v.icon, v.callback);
            });
            $.each(right, function(i, v){
                explorer.start.addRButton(v.title, v.icon, v.callback, v.context);
            });
        },
		addRButton : function(title, icon, callback, context) {
			var callbackID = system.guid();
            var jqid = '#startmenu .rllist .button[callbackID='+callbackID+']';
            $('#startmenu .rllist').append('<div callbackID="'+callbackID+'" icon="'+icon+'" class="button">'+title+'</div>');
            $(jqid).click(callback).click(function() {
                explorer.start.toggle();
            }).hover(function() {
                if(typeof icon !== 'undefined') {
                    $('#startmenu > .icon').css('background-image', 'url(\''+$(this).attr('icon')+'\')');
                }
            }, function() {
                $('#startmenu > .icon').css('background-image', '');
            });
            if(typeof context !== 'undefined') {
                $(jqid).contextmenu(function(e) {
                    new explorer.context().location(e.pageX, e.pageY).append(context);
                    e.preventDefault();
                });
            }
            return $('#startmenu .rllist .button[callbackID='+callbackID+']');
		},
		addLButton : function(title, icon, callback) {
            var callbackID = system.guid();
            $('#startmenu .lllist').append('<div callbackID="'+callbackID+'" class="button"><span class="icon"></span>'+title+'</div>');
            if(typeof icon !== 'undefined') {
                $('#startmenu .lllist .button[callbackID='+callbackID+'] .icon').css("background-image","url('"+icon+"')");
            }
            $('#startmenu .lllist .button[callbackID='+callbackID+']').click(callback).click(function() {
                explorer.start.toggle();
                $(this).prependTo('#startmenu .lllist');
            }).on('contextmenu', function(e) {
                new explorer.context()
                .location(e.pageX, e.pageY)
                .append([
                    {
                        title: '<b>Open<b>',
                        callback: callback
                    }, {}, {
                        title: 'Close All'
                    }
                ]);
            });
            return $('#startmenu .lllist .button[callbackID='+callbackID+']');
		},
        allProgramsToggle : function() {
            var start = $('#startmenu .lllist');
            if(start.hasClass('all')) {
                start.removeClass('all');
            } else {
                start.addClass('all');
            }
            start.scrollTop(0);
        },
        allProgramsSearch : function(searchterm) {
            var searchTerm = searchterm.toLowerCase();
            if(searchTerm !== '') {
                var returned = null;
                $('#startmenu .lllist div').hide();
                if(!$('#startmenu .lllist').hasClass('all')) {
                    explorer.start.allProgramsToggle();
                }
                $.each($('#startmenu .lllist .button'), function() {
                    var str = $(this).text();
                    if(str.toLowerCase().includes(searchTerm)) {
                        if(returned == null) {
                            returned = $(this);
                        }
                        $(this).show();
                    }
                });
                return returned;
            } else {
                $('#startmenu .lllist div').show();
                if($('#startmenu .lllist').hasClass('all')) {
                    explorer.start.allProgramsToggle();
                }
            }
        }
    },
    window : function(winObj) {
        /** init **/
        if(typeof winObj == 'undefined') {
            var windowID = system.guid();
            $('#desktop').append('<div class="window" windowID="'+windowID+'"><span class="ttl"><span class="icon"></span><span class="title"></span></span><span class="minmaxclose"><span class="close"></span></span><div class="body"></div></div>');
            $('#taskbar #middleframe').append('<span class="button" windowID="'+windowID+'"><span class="icon"></span><span class="title"><span></span></span>');
            this.winid = $('.window[windowID='+windowID+']');
        } else {
            this.winid = $(winObj);
        }
        var win = this;
        /** endINIT **/
        this.body = this.winid.find('.body');
        this.callback = function(callback) {
            callback.call(this);
            return this;
        }
		this.center = function(position, offsetX, offsetY) {
            var explorer = $('#desktop.explorer');
			var top = (explorer.height() - this.winid.outerHeight()) / 2;
			var left = (explorer.width() - this.winid.outerWidth()) / 2;
            if(typeof position !== 'undefined') {
                pchar = position.split(' ');
                if($.inArray('top', pchar) !== -1) {
                    top = 0;
                }
                if($.inArray('bottom', pchar) !== -1) {
                    top = explorer.height() - this.winid.outerHeight();
                }
                if($.inArray('left', pchar) !== -1) {
                    left = 0;
                }
                if($.inArray('right', pchar) !== -1) {
                    left = explorer.width() - this.winid.outerWidth();
                }
            }
            if(typeof offsetX !== 'undefined') {
                left = left + offsetX;
            }
            if(typeof offsetY !== 'undefined') {
                top = top + offsetY;
            }
			this.winid.css({'position':'absolute', 'margin':0, 'top': top+'px', 'left': left+'px'});
            return this;
		};
        this.closeWith = function(parent) {
            var child = this;
            parent.close = (function() {
                var cache = parent.close;
                return function() {
                    cache.call(parent);
                    child.close();
                }
            })();
            return this;
        };
        this.menuBar = function(buttArr) {
            var con = null;
            var clicked = false;
            var men = $('<div class="menuBar"></div>').insertAfter(this.winid.find('.body'));
            this.winid.addClass('menuBar');
            $('body').on('mousedown mouseup', function(e) {
                if(!$(e.target).parents('#desktop .context').length && !$(e.target).is('#desktop .context')) {
                    clicked = false;
                }
            });
            function show(button, content) {
                if(con !== null) {
                    con.close();
                }
                con = new explorer.context()
                .append(content.context)
                .location($(button).offset().left, $(button).offset().top + $(button).outerHeight());
            }
            $.each(buttArr, function(k) {
                var content = this;
                $('<span>'+content.title+'</span>').appendTo(men).click(function(e) {
                    clicked = true;
                    show(this, content);
                    e.stopImmediatePropagation();
                }).mouseover(function() {
                    if(clicked) {
                        show(this, content);
                    }
                });
            });
            return this;
        };
        this.close = function() {
            this.winid.css('z-index', '999').addClass('close');
            $('#taskbar #middleframe .button[windowID='+this.winid.attr('windowID')+']').remove();
            var topZ = -1;
            var topID = this.winid;
            $('.window:not(.close)').each(function() {
                if($(this).css('z-index') > topZ && !$(this).hasClass('minimized')) {
                    topZ = $(this).css('z-index');
                    topID = this;
                }
            });
            explorer.window(topID).front();
            var winid = this.winid;
            setTimeout(function() { //Wait for CSS animation.
                winid.remove();
            }, 1000);
            return this;
        };
        this.controlsArr = [];
        this.controls = function(array) {
            this.controlsArr = array;
            $.each(this.winid.find('.minmaxclose span'), function() {
                if(!$(this).hasClass('close')) {
                    $(this).remove();
                }
            });
            if($.inArray('max', array) !== -1) {
                this.winid.find('.minmaxclose').prepend('<span class="max"></span>');
                this.winid.resizable({handles: "n, e, s, w, ne, se, sw, nw"});
                this.winid.resizable('enable');
                this.winid.find('.ui-resizable-handle').show();
                this.winid.find('.ttl, .minmaxclose .max').off();
                $('.window[windowID='+this.winid.attr('windowID')+'] .minmaxclose .max').click({window: this}, function(e) {
                    e.data.window.toggleMax();
                });
                $('.window[windowID='+this.winid.attr('windowID')+'] .ttl').dblclick({window: this}, function(e) {
                    if(!$(e.target).is('.icon')) {
                        e.data.window.toggleMax();
                    }
                });
            } else if(typeof this.winid.resizable('instance') !== 'undefined') {
                this.winid.resizable('disable');
                this.winid.find('.ui-resizable-handle').hide();
                this.winid.find('.ttl').off();
            }
            if($.inArray('min', array) !== -1) {
                this.winid.find('.minmaxclose').prepend('<span class="min"></span>');
                $('.window[windowID='+this.winid.attr('windowID')+'] .minmaxclose .min').click({window: this}, function(e) {
                    e.data.window.toggleMin();
                });
            }
            return this;
        };
        this.toggleMin = function() {
            if(this.winid.hasClass('active') || this.winid.hasClass('minimized')) {
                if(this.winid.hasClass('minimized')) {
                    this.winid.removeClass('minimized');
                } else {
                    this.winid.addClass('minimized');
                }
            }
            this.front();
            var topZ = -1;
            var topID = this.winid;
            $('.window').each(function() {
                if($(this).css('z-index') > topZ && !$(this).hasClass('minimized')) {
                    topZ = $(this).css('z-index');
                    topID = this;
                }
            });
            this.front();
            return this;
        };
        this.toggleMax = function() {
            if(this.winid.hasClass('active') || this.winid.hasClass('maximized')) {
                if(this.winid.hasClass('maximized')) {
                    this.winid.removeClass('maximized');
                } else {
                    this.winid.addClass('maximized');
                }
            }
            return this;
        };
        this.resize = function(width, height) {
            this.winid.css({'width':width+'px','height':height+'px'});
            return this;
        };
        this.icon = function(url) {
            var css = {'background-image':"url('"+url+"')"};
            this.winid.find('.ttl .icon').css(css);
            $('#taskbar #middleframe .button[windowID="'+this.winid.attr('windowID')+'"] .icon').css(css);
            return this;
        };
        this.title = function(title) {
            this.winid.find('.ttl .title').text(title);
            $('#taskbar #middleframe .button[windowID='+this.winid.attr('windowID')+'] .title').text(title);
            return this;
        };
        this.front = function() {
            var count = $('.window').length;
            var fronte = this.winid.css('z-index');
            if(fronte == '0' || fronte == 'auto') {
                var fronte = count;
            }
            this.winid.css('z-index', count);
            var winid = this.winid;
            $(".window").each(function(index) {
                var looped = $(this).css('z-index');
                $(this).removeClass('active');
                $('#taskbar #middleframe .button[windowID="'+$(this).attr('windowID')+'"]').removeClass('active');
                if(looped >= fronte && $(this)[0] !== winid[0]) {
                    var minzin = $(this).css('z-index') - 1;
                    $(this).css('z-index', minzin);
                }
            });
            if(!this.winid.hasClass('minimized')) {
                this.winid.addClass('active');
                $('#taskbar #middleframe .button[windowID="'+this.winid.attr('windowID')+'"]').addClass('active');
            }
            return this;
        };
        if(typeof winObj == 'undefined') {
            $('#taskbar #middleframe').sortable("refresh");
            $(this.winid).mousedown({window: this}, function(e) {
                e.data.window.front();
            });
            $('#desktop').on('mousedown', {winid: this.winid}, function(e) {
                var winid = e.data.winid.attr('windowID');
                if(!$(e.target).parents('.window[windowID='+winid+']').length && !$(e.target).is('.window[windowID='+winid+']') && !$(e.target).is('#taskbar #middleframe .button[windowID='+winid+']') && !$(e.target).parents('#taskbar #middleframe .button[windowID='+winid+']').length) {
                    var elm = $('.window[windowID='+winid+'], #taskbar #middleframe .button[windowID='+winid+']');
                    if(elm.hasClass('active')) {
                        elm.removeClass('active');
                    }
                }
            });
            function menu() {
               var menu = [
                    {
                        title: 'Restore',
                        icon: 'webdows/resources/icons/rest.png'
                    }, {
                        title: 'Minimize',
                        icon: 'webdows/resources/icons/mini.png'
                    }, {
                        title: 'Maximize',
                        icon: 'webdows/resources/icons/maxi.png'
                    }, {}, {
                        title: 'Close',
                        icon: 'webdows/resources/icons/clos.png',
                        callback: function() { win.close(); }
                    }
                ];
                if($.inArray('max', win.controlsArr) !== -1) {
                    if(win.winid.hasClass('maximized')) {
                        menu[0].callback = function() { win.front().toggleMax(); };
                    } else {
                        menu[2].callback = function() { win.front().toggleMax(); };
                    }
                }
                if($.inArray('min', win.controlsArr) !== -1) {
                    if(win.winid.hasClass('minimized')) {
                        menu[0].callback = function() { win.front().toggleMin(); };
                        menu[2].callback = undefined;
                    } else {
                        menu[1].callback = function() { win.front().toggleMin(); };
                    }
                }
                return menu;                
            }
            $('.window[windowID='+windowID+'] .ttl .icon').click({window: this}, function(e) {
                var men = new explorer.context().append(menu());
                men.location($(this).offset().left - men.width() + $(this).width(), $(this).offset().top + $(this).height());
            }).dblclick({window: this}, function(e) {
                e.data.window.winid.trigger('contextclose');
                e.data.window.close();
            });
            $('#taskbar #middleframe .button[windowID='+windowID+']').contextmenu({window: this}, function(e) {
                new explorer.context()
                .location(e.pageX, e.pageY)
                .append(menu());
            });
            $('#taskbar #middleframe .button[windowID='+windowID+']').click({window: this}, function(e) {
                e.data.window.toggleMin();
            });
            $('.window[windowID='+windowID+'] .minmaxclose .close').click({window: this}, function(e) {
                e.data.window.close();
            });
            $(this.winid).draggable({containment: "#desktop.explorer", handle: '.ttl', addClasses: false, iframeFix: true});
            this.controls(['min','max']);
            this.resize(300, 200);
            this.front();
        }
        return this;
    },
    context: function() {
        /** INIT **/
        var dis = this;
        this.id = system.guid();
        $('#desktop').append('<div contextID="'+this.id+'" class="context"></div>');
        this.jqid = $('#desktop div.context[contextID='+this.id+']');
        this.jqid.contextmenu(function(e) {
            e.stopPropagation();
            e.preventDefault();
        });
        $('#desktop').on('mousedown mouseup contextclose', {context: this}, function(e) {
            if(!$(e.target).parents('#desktop .context').length && !$(e.target).is('#desktop .context')) {
				e.data.context.jqid.remove();
			}
        });
        this.hover = false;
        this.jqid.hover(function() {
            dis.hover = true;
        }, function() {
            dis.hover = false;
        });
        /** EndINIT **/
        /** Functions **/
        this.width = function() {
            var cache = this.jqid.attr('style');
            this.jqid.attr('style', '');
            var width = this.jqid.outerWidth();
            this.jqid.attr('style', cache);
            return width;
        };
        this.height = function() {
            var cache = this.jqid.attr('style');
            this.jqid.attr('style', '');
            var height = this.jqid.outerHeight();
            this.jqid.attr('style', cache);
            return height;
        };
        /** EndFunctions **/
        /** ChainFunctions **/
        this.append = function(struc) {
            var jqid = this.jqid;
            $.each(struc, function(k, v) {
                if(typeof v.title !== 'undefined') {
                    var callid = system.guid();
                    var disabled = '';
                    var arrow = '';
                    if(typeof v.callback == 'undefined') {
                        disabled = ' disabled';
                    }
                    if(typeof v.context !== 'undefined') {
                        arrow = ' arrow ';
                        disabled = '';
                    }
                    if(typeof v.icon == 'undefined') {
                        var icon = 'none';
                    } else {
                        var icon = 'url(\''+v.icon+'\')';
                    }
                    jqid.append('<div callbackID="'+callid+'" class="button'+arrow+disabled+'"><span class="icon" style="background-image:'+icon+';"></span><span class="title">'+v.title+'</span></div>');
                    var button = jqid.find('.button[callbackID='+callid+']');
                    if(typeof v.context !== 'undefined') {
                        var sub = null;
                        var timer = null;
                        button.hover(function() {
                            if(sub == null) {
                                timer = setTimeout(function() {
                                    sub = new explorer.context().append(v.context); 
                                    var pos = button.offset(); var bx = pos.left; var by = pos.top; var bw = button.outerWidth(); var bh = button.outerHeight(); var sw = sub.jqid.outerWidth(); var sh = sub.jqid.outerHeight(); var xlim = $('#desktop.explorer').width(); var ylim = $('#desktop.explorer').height();
                                    x = bx + bw;
                                    y = by;
                                    if(xlim < bx + bw + sw) {
                                        x = x - bw - sw;
                                        y = y;
                                    }
                                    if(ylim < by + bh + sh) {
                                        x = x;
                                        y = y + bh - sh;
                                    }
                                    sub.location(x, y);
                                    button.on('unhover', function() {
                                        setTimeout(function() {
                                            if(!button.hasClass('hovered') && sub !== null) {
                                                sub.jqid.remove();
                                                sub = null;
                                                button.unbind('unhover');
                                            }
                                        }, 400);
                                    });
                                    button.parent().on('remove', function() {
                                        sub.jqid.remove();
                                        sub = null;
                                    });
                                    sub.jqid.hover(function() {
                                        button.trigger('mouseover');
                                    });
                                }, 400);
                            }
                        }, function() {
                            clearTimeout(timer);
                        });
                    } else {
                        button.click(v.callback).click(function() { $('#desktop').trigger('contextclose'); });
                    }
                    button.on('mouseover', function() {
                        var button = $(this);
                        $.each(jqid.find('.button'), function() {
                            if($(this)[0] !== button[0]) {
                                $(this).removeClass('hovered');
                                $(this).trigger('unhover');
                            }
                        });
                        if(!button.hasClass('hovered')) {
                            button.addClass('hovered');
                        }
                    });
                } else {
                    jqid.append('<div class="hr"></div>');
                }
            });
            if(typeof this.x !== 'undefined' && typeof this.y !== 'undefined') {
                this.location(this.x, this.y);
            }
            return this;
        };
        this.location = function(x, y) {
            this.x = x;
            this.y = y;
            var xlim = $('#desktop.explorer').width();
            var ylim = $('#desktop.explorer').height();
            if(xlim <= eval(x + this.width())) {
                x = eval(x - this.width());
            } else {
                x = x;
            }
            if(0 >= x) {
                x = 1;
            } else {
                x = x;
            }
            if(ylim <= eval(y + this.height())) {
                y = eval(y - this.height());
            } else {
                y = y;
            }
            if(0 >= y) {
                y = 1;
            } else {
                y = y;
            }
            this.jqid.attr('style', 'left:'+x+'px;top:'+y+'px;');
            return this;
        };
        this.close = function() {
            this.jqid.remove();
            return this;
        };
        /** EndChainFunctions **/
        return this;
    }
};
explorer.initiate();
$(document).ready(function() {
    system.loader('webdows/explorer_ext.js');
    system.loader('startup.js');
});