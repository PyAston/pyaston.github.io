/**
 * @project 社区分享中心
 * @author parkerzhu
 * @date 2011-08-31
 */

//include(["jquery/jquery-1.5.min.js", "comm/imageScroll.js"], function(loaded) {
(function(scope) { 
    var CommShare = function(config) {
        this._init.apply(this, [config]);
    };
    CommShare.prototype = {
        config: null,
        MAX_TIMEOUTS: 5,
        INITIALIZING: false,
        SHARE_TYPES: {
            "MB": {
                "typeid": 0,
                "path": "http://apps.game.qq.com/commShare/php/shareMicroBlog.php",
                "pathurl": "http://apps.game.qq.com/commShare/php/shareMicroBlogMulti.php"
            },
            "QZONE": {
                "typeid": 1,
                "path": "http://apps.game.qq.com/commShare/php/shareQzone.php"
            },
            "QQSIGN": {
                "typeid": 2,
                "path": "http://apps.game.qq.com/commShare/php/shareQQSign.php"
            }
        },
        LISTEN_APP_PATH: "http://apps.game.qq.com/commShare/php/followAllMicroBlog.php",
        STORED_DATA: null,
        BASE_DATA_PATH: "http://gameact.qq.com/commShare/act/",
        DATA_FILE_NAME: "piclist.json",
        editor: null,
        _init: function(config, callback) {
            if(!config || !config.id) {
                alert("活动配置不正确");
                return;
            }
            this.config = config || {};
            if(config.editor)
                this.editor = $(config.editor.tagName ? config.editor : ("#" + config.editor));
        },
        _getServerTime: function() {
            var request = $.ajax({
                type: "HEAD",
                url: "http://" + location.host,
                async: false
            });
            return new Date(request.getResponseHeader("Date"));
        },
        _parseDate: function(date) {
            return new Date(date.replace(/-/g, "/"));
        },
        _getDataPath: function() {
            return this.BASE_DATA_PATH + this.config.id + "/" + this.DATA_FILE_NAME;
        },
        _getData: function(callback) {
            var self = this;
            if(self.STORED_DATA) {
                callback.apply(self, arguments);
            } else {
                $.getScript(this._getDataPath() + "?r=" + new Date().getTime(), function() {
                    if(typeof JSON_data != "undefined" && JSON_data) {
                        self.STORED_DATA = JSON_data;
                    }
                    else {
                        alert("很抱歉，由于参与分享人数太多，网络繁忙，请休息几秒刷新页面再试哦！");
                        return;
                    }
                    callback.apply(self, arguments);
                },
                function() {
                    alert("很抱歉，由于参与分享人数太多，网络繁忙，请休息几秒刷新页面再试哦！");
                });
            }
        },
        _default_share_callback: function(userCallback) {
            if(userCallback) {
                if(userCallback(typeof RES_SEND_JSON == "undefined" ? null : RES_SEND_JSON) === false) {
                    return;
                }
            }
            if(typeof RES_SEND_JSON != "undefined" && RES_SEND_JSON) {
                //alert(RES_SEND_JSON.msg);
                showDialog.show({id:'dia3'});
            } else {
                alert("很抱歉，由于参与分享人数太多，网络繁忙，请休息几秒刷新页面再试哦！");
            }
        },
        _share: function(type, conf) {
            var self = this, cfg = this.config, conf = conf || {};
            switch(type) {
            case this.SHARE_TYPES.MB:
            case this.SHARE_TYPES.QZONE:
                if(this.STORED_DATA.iCntModFlg == 0) {
                    $.getScript(type.path + "?r=" + new Date().getTime()
                            + "&iPId=" + (this.config.id || "")
                            + "&iContentId=" + (conf.contentid || "")
                            + "&iParentId=" + (conf.pid || ""), function() {
                        self._default_share_callback(conf.complete);
                    });
                } else {
                    var userContent = "";
                    if(conf.content) {
                        userContent = conf.content;
                    } else {
                        if(cfg.editor) {
                            userContent = this.editor.val();
                        }
                    }
                    userContent = encodeURIComponent(userContent);
                    if(conf.imgdata) {
                        $.getScript(
                                "http://game.qq.com/comm-htdocs/js/fajax_cdr.js",
                                function() {
                                    FAjax({
                                        url: "http://apps.game.qq.com/commShare/php/shareMicroBlogImg.php",
                                        method: "POST",
                                        data: {
                                            iPId: cfg.id,
                                            iContentId: conf.contentid,
                                            sUserContent: userContent,
                                            sImgData: conf.imgdata
                                        },
                                        complete: function(res) {
                                            eval(res.text);
                                            scope["RES_SEND_JSON"] = RES_SEND_JSON;
                                            self._default_share_callback(conf.complete);
                                        }
                                    });
                                }
                        );
                    } else if(type == this.SHARE_TYPES.MB && (conf.imgurl || conf.videourl || conf.musicurl)){
                        conf.imgurl = conf.imgurl || "";
                        conf.videourl = conf.videourl || "";
                        conf.musicurl = conf.musicurl || "";
                        if(conf.musicurl) {
                            if(!conf.musictitle || !conf.musicauthor) {
                                alert("分享音乐的标题和作者不能为空！");
                                return;
                            }
                        }
                        $.getScript(type.pathurl + "?r=" + new Date().getTime()
                                + "&iPId=" + (cfg.id || "")
                                + "&iContentId=" + (conf.contentid || "")
                                + "&sUserContent=" + userContent
                                + "&imgurl=" + encodeURIComponent(conf.imgurl)
                                + "&videourl=" + encodeURIComponent(conf.videourl)
                                + "&musicurl=" + encodeURIComponent(conf.musicurl)
                                + "&musictitle=" + encodeURIComponent(conf.musictitle)
                                + "&musicauthor=" + encodeURIComponent(conf.musicauthor), function() {
                            self._default_share_callback(conf.complete);
                        });
                    } else {
                        $.getScript(type.path + "?r=" + new Date().getTime()
                                + "&iPId=" + (cfg.id || "")
                                + "&iContentId=" + (conf.contentid || "")
                                + "&iParentId=" + (conf.pid || "")
                                + "&sUserContent=" + userContent, function() {
                            self._default_share_callback(conf.complete);
                        });
                    }
                }
                break;
            case this.SHARE_TYPES.QQSIGN:
                $.getScript(type.path + "?r=" + new Date().getTime()
                        + "&iPId=" + (cfg.id || "")
                        + "&iContentId=" + (conf.contentid || ""), function() {
                    self._default_share_callback(conf.complete);
                });
                break;
            default:
                break;
            }
        },
        _querySign: function(conf) {
            var complete = conf.complete || function() {};
            $.getScript("http://apps.game.qq.com/commShare/php/GetQQSignTime.php?r="
                         + new Date().getTime()
                         + "&iPId=" + this.STORED_DATA.iActivityId, function() {
                var res = (typeof RES_QQSIGN_JSON == "undefined" ? null : RES_QQSIGN_JSON);
                if(complete(res) === false) return;

                if(typeof RES_QQSIGN_JSON != "undefined" && RES_QQSIGN_JSON) {
                    if(RES_QQSIGN_JSON.code == 0) {
                        alert("您目前签名保持时长为" + Math.floor(RES_QQSIGN_JSON.keepTime / 86400) + "天");
                    }
                    else {
                        alert(RES_QQSIGN_JSON.msg);
                    }
                }
                else {
                    alert("很抱歉，由于参与签名人数太多，网络繁忙，请休息几秒刷新页面再试哦！");
                }
            });
        },
        _queryUserTimeline: function(conf) {
            var complete = conf.complete || function() {},
                success = conf.success || function() {},
                name = conf.name,
                openid = conf.openid || "",
                type = conf.type || "",
                ctype = conf.ctype || "",
                num = conf.num || "";
            if(!name && !openid) {
                alert("用户名不能为空");
                return;
            }
            $.getScript("http://apps.game.qq.com/commShare/php/GetUserTimeline.php?r="
                         + new Date().getTime()
                         + "&iPId=" + this.STORED_DATA.iActivityId
                         + "&name=" + name
                         + "&openid=" + openid
                         + "&type=" + type
                         + "&ctype=" + ctype
                         + "&num=" + num, function() {
                var res = (typeof RES_USER_TIMELINE_JSON == "undefined" ? null : RES_USER_TIMELINE_JSON);
                if(complete(res) === false) return;

                if(res) {
                    if(res.code == 0) {
                        success(res.msg);
                    }
                    else {
                        alert(res.msg);
                    }
                }
                else {
                    alert("很抱歉，由于参与人数太多，网络繁忙，请休息几秒刷新页面再试哦！");
                }
            });
        },
        _fillItemTemplate: function(template, item) {
            var prop;
            for(prop in item) {
                template = template.replace(new RegExp('{' + prop + '}', "g"), unescape(item[prop]));
            }
            return template;
        },
        InitDefaultValue: function() {
            this._getData(function() {
                if(this.STORED_DATA.iCntModFlg != 0 && this.config.editor) {
                    var list = this.STORED_DATA.List, len = list.length, i;
                    if(len <= 0) return;
                    switch(parseInt(this.STORED_DATA.iContentType, 10)) {
                        case 1:
                            this.editor.val(unescape(list[0].sUserContent));
                            break;
                        case 2:
                            {
                                var now = this._getServerTime();
                                for(i = 0; i < len; ++i) {
                                    var item = list[i],
                                        start = this._parseDate(item.dtBeginTimeCnt),
                                        end = this._parseDate(item.dtEndTimeCnt);
                                    if(now >= start && now <= end) {
                                        this.editor.val(unescape(item.sUserContent));
                                        break;
                                    }
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }
            });
        },
        ShareMicroblog: function(cfg) {
            this._getData(function() {
                this._share(this.SHARE_TYPES.MB, cfg);
            });
        },
        ShareQzone: function(cfg) {
            this._getData(function() {
                this._share(this.SHARE_TYPES.QZONE, cfg);
            });
        },
        ShareQQSign: function(cfg) {
            this._getData(function() {
                this._share(this.SHARE_TYPES.QQSIGN, cfg);
            });
        },
        Listen: function(cfg) {
            cfg = cfg || {};
            cfg.complete = cfg.complete || function() {};
            if(!cfg.user || !cfg.user.length) {
                alert("收听用户不能为空"); return;
            }
            var user = "";
            if($.isArray(cfg.user)) user = cfg.user.join(",");
            else user = cfg.user + "";
            $.getScript(this.LISTEN_APP_PATH + "?r=" + new Date().getTime()
                    + "&iPId=" + this.config.id
                    + "&name=" + user, function() {
                var res = (typeof RES_FALLOW_JSON == "undefined" ? null : RES_FALLOW_JSON);
                if(cfg.complete(res) === false) return;

                if(typeof RES_FALLOW_JSON != "undefined" && RES_FALLOW_JSON) {
                    if(RES_FALLOW_JSON.code == 0) {
                        alert("收听成功！");
                    }
                    else {
                        alert(RES_FALLOW_JSON.msg);
                    }
                }
                else {
                    alert("很抱歉，由于参与收听人数太多，网络繁忙，请休息几秒刷新页面再试哦！");
                }
            });
        },
        QueryUserTimeline: function(cfg) {
            var cfg = cfg || {};
            this._getData(function() {
                this._queryUserTimeline(cfg);
            });
        },
        QuerySign: function(cfg) {
            var cfg = cfg || {};
            this._getData(function() {
                this._querySign(cfg);
            });
        },
        ListSign: function(cfg) {
            var cfg = cfg || {};
            this._getData(function() {
                var conf = $.extend({}, {
                    container: "comm_share_default_sign_container",
                    sign_template: "",
                    child: "li",
                    events: []
                }, cfg),
                container = conf.container,
                sign_tpl = (conf.sign_template ? $("#" + conf.sign_template) : null),
                events = conf.events,
                list = this.STORED_DATA.SignList, len = list.length, i, item;
                if(cfg.container) {
                    container = $("#" + container);
                } else {
                    container = $('<div class="div_comm_share_sign_container" id="' + container + '"><ul id="ul_comm_share_sign_container"></ul></div>').appendTo(document.body);
                }
                for(i = 0; i < len; ++i) {
                    item = list[i];
                    var li = (sign_tpl ? $(this._fillItemTemplate(sign_tpl.html(), item))
                                       : $('<' + child + ' title="' + item.sUserContent + '" class="li_comm_share_item">'
                                             + '<span id="span_comm_share_sign_no">' + (i + 1) + '</span>'
                                             + '<span>' + item.sUserContent + '</span>'
                                             + '<input type="button" value="使用此签名" onclick="ShareQQSign(' + item.iID + ')" />'
                                             + '</' + child + '>'));
                    container.append(li);
                    for(var j = 0, elen = events.length; j < elen; ++j) {
                        li.bind(events[j].type, { self: this, item: item, eindex: j },  function(event) {
                            var li = $(this), index = event.data.eindex, item = event.data.item, shareobj = event.data.self,
                                e = events[index], handler = e.handler || "";

                                if(handler && !$(event.target).is(handler)) return;
                                e.callback && e.callback.apply(shareobj, [li, item]);
                        });
                    }
                }
                if(cfg.complete) cfg.complete(this.STORED_DATA);
            });
        },
        Carousel: function(cfg) {
            var cfg = cfg || {};
            this._getData(function() {
                    var conf = $.extend({}, {
                        container: "comm_share_default_carousel_container",
                        prev: "comm_share_default_carousel_prev",
                        next: "comm_share_default_carousel_next",
                        frame: "comm_share_default_carousel_frame",
                        child: "li",
                        width: 200,
                        height: 200,
                        auto: false,
                        item_template: "",
                        events: []
                    }, cfg),
                    container = conf.container,
                    prev = conf.prev,
                    next = conf.next,
                    child = conf.child,
                    width = conf.width,
                    height = conf.height,
                    auto = conf.auto,
                    events = conf.events,
                    item_tpl = (conf.item_template ? $("#" + conf.item_template) : null),
                    frame = $('<ul id="' + conf.frame + '" class="ul_comm_share_list"></ul>'),
                    list = this.STORED_DATA.List, len = list.length, i, item;
                if(cfg.container) {
                    container = $("#" + container);
                } else {
                    container = $('<div class="div_comm_share_container" id="' + container + '"></div>').appendTo(document.body);
                }
                if(cfg.prev) {
                    prev = $("#" + prev);
                } else {
                    prev = $('<a href="#" id="' + prev + '">prev</a>').insertBefore(container);
                }
                if(cfg.next) {
                    next = $("#" + next);
                } else {
                    next = $('<a href="#" id="' + next + '">next</a>').insertBefore(container);
                }
                container.append(frame);

                for(i = 0; i < len; ++i) {
                    item = list[i];
                    var li = (item_tpl ? $(this._fillItemTemplate(item_tpl.html(), item))
                                       : $('<' + child + ' title="' + item.sPicName + '" class="li_comm_share_item">'
                                             + '<span id="span_comm_share_picname">' + unescape(item.sPicName || item.sUserContent) + '</span>'
                                             + (item.sPicMiniUrl ? '<img height="' + height + '" width="' + width + '" alt="' + item.sPicName + '" src="' + item.sPicMiniUrl + '" />' : (item.sPicUrl ? '<img height="' + height + '" width="' + width + '" alt="' + item.sPicName + '" src="' + item.sPicUrl + '" />' :''))
                                             + '</' + child + '>'));
                    frame.append(li);
                    for(var j = 0, elen = events.length; j < elen; ++j) {
                        li.bind(events[j].type, { self: this, item: item, eindex: j },  function(event) {
                            var li = $(this), index = event.data.eindex, item = event.data.item, shareobj = event.data.self,
                                e = events[index], handler = e.handler || "";

                                if(handler && !$(event.target).is(handler)) return;
                                e.callback && e.callback.apply(shareobj, [li, item]);
                        });
                    }
                }
                var scroller = container.imageScroller($.extend(conf, {
                    next: next.attr("id"),
                    prev: prev.attr("id"),
                    frame: frame.attr("id"),
                    child: child,
                    width: width,
                    auto: auto
                }));
                if(cfg.complete) cfg.complete(this.STORED_DATA, scroller);
           });
        }
    };
    scope["CommShare"] = CommShare;
})(window);/*  |xGv00|caec09fd68ac220f1b23b650e1af5268 */