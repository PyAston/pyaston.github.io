location.href && 0 <= location.href.indexOf("qq.com") && (document.domain = "qq.com");
$E = function(b) {
	b = b.replace("#", "");
	return document.getElementById(b)
};
"undefined" == typeof LoginManager && (LoginManager = {});
LoginManager._$E = function(b) {
	b = b.replace("#", "");
	return document.getElementById(b)
};
LoginManager._$extend = function(b, a) {
	if ("object" != typeof a || !a) return b;
	for (var d in a) b[d] = a[d];
	return b
};
LoginManager._randomInt = function(b) {
	return Math.floor(Math.random() * b)
};
LoginManager._extend = function(b, a) {
	var d = LoginManager._clone(a),
		c;
	for (c in b) "undefined" != typeof a[c] && (b[c] = d[c]);
	return b
};
LoginManager._clone = function(b) {
	if ("object" != typeof b) return b;
	if (null == b) return null;
	var a = b.constructor == Array ? [] : {},
		d;
	for (d in b) a[d] = LoginManager._clone(b[d]);
	return a
};
LoginManager._getAllQuery = function(b) {
	b = b || window.location.href;
	var a = {};
	if (0 < b.length)
		for (var d = b.split("&"), c = 0; c < d.length; c++) {
			var e = d[c].split("=");
			2 == e.length && (0 < e[0].length && 0 < e[1].length) && (b == window.location.href && 0 <= e[1].indexOf("#") && (e[1] = e[1].split("#")[0]), 0 < e[1].length && (0 == c && (e[0] = e[0].substr(e[0].indexOf("?") + 1)), e[0] && (a[e[0]] = unescape(e[1]))))
		}
	return a
};
LoginManager._getAllQueryStr = function(b, a) {
	b = b || null;
	a = a || null;
	var d = function(b) {
			if (b) {
				var a = [],
					c;
				for (c in b)
					if ("undefined" != typeof b[c])
						if ("string" == typeof b[c] || "number" == typeof b[c] || "boolean" == typeof b[c]) a.push(c + "=" + escape(b[c].toString()));
						else if (null == b[c]) a.push(c + "=");
				else if (b[c] instanceof Array) {
					for (var d = 0; d < b[c].length; d++) b[c][d] = escape(b[c][d].toString());
					a.push(c + "=" + b[c].join("|"))
				} else try {
					a.push(c + "=" + escape(b[c].toString()))
				} catch (e) {}
				if (0 < a.length) return a.join("&")
			}
			return ""
		},
		c = -1;
	b || a ? b && a ? c = 2 : b && !a ? c = 1 : !b && a && (b = a, c = 1) : c = 0;
	switch (c) {
		case 0:
			return a = LoginManager._getAllQuery(), d(a);
		case 1:
			var e = b;
			return "string" == typeof e ? d(LoginManager._getAllQuery(e)) : "object" == typeof e ? d(e) : "";
		case 2:
			c = {};
			if ("string" == typeof b) c = LoginManager._getAllQuery(b);
			else if ("object" == typeof b)
				for (e in b) try {
					c[e] = unescape(b[e])
				} catch (g) {} else return "";
			for (e in a) try {
				c[e] = unescape(a[e])
			} catch (f) {}
			return d(c);
		default:
			alert("\u53c2\u6570\u9519\u8bef")
	}
};
LoginManager._setCookie = function(b, a, d, c, e, g) {
	var f = new Date;
	d = d || null;
	c = c || "/";
	e = e || null;
	g = g || !1;
	d && f.setMinutes(f.getMinutes() + parseInt(d));
	b = escape(b) + "=" + escape(a) + (d ? "; expires=" + f.toGMTString() : "") + (c ? "; path=" + c : "") + (e ? "; domain=" + e : "") + (g ? "; secure" : "");
	document.cookie = b
};
LoginManager.filterXSS = function(e) {
	if (!e) return e;
	for (var x = ["<", ">", "'", '"', "%3c", "%3e", "%27", "%22", "%253c", "%253e", "%2527", "%2522"], r = ["&#x3c;", "&#x3e;", "&#x27;", "&#x22;", "%26%23x3c%3B", "%26%23x3e%3B", "%26%23x27%3B", "%26%23x22%3B", "%2526%2523x3c%253B", "%2526%2523x3e%253B", "%2526%2523x27%253B", "%2526%2523x22%253B"], B = 0; B < x.length; B++) e = e.replace(new RegExp(x[B], "gi"), r[B]);
	return e
};
LoginManager._getCookie = function(b) {
	var a;
	return LoginManager.filterXSS((a = document.cookie.match(RegExp("(^|;\\s*)" + b + "=([^;]*)(;|$)"))) ? unescape(a[2]) : null)
};
LoginManager._delCookie = function(b, a, d, c) {
	var e = new Date;
	e.setTime(e.getTime() - 1e3);
	e.toGMTString();
	LoginManager._setCookie(b, "", -100, a || "/", d || null, c || !1)
};
LoginManager._DATA = {
	APPID: [{
		qqgame: 21000110
	}, {
		gamevip: 21000110
	}, {
		huanle: 21000121
	}, {
		qqtang: 21000107
	}, {
		fo: 21000106
	}, {
		ffo: 21000106
	}, {
		pet: 21000109
	}, {
		sg: 21000103
	}, {
		r2: 21000105
	}, {
		xx: 21000104
	}, {
		x5: 21000125
	}, {
		speed: 21000118
	}, {
		cf: 21000124
	}, {
		dnf: 21000127
	}, {
		nana: 21000119
	}, {
		ava: 21000128
	}, {
		sl: 21000401
	}, {
		battle: 21000111
	}, {
		kaixuan: 21000112
	}, {
		tgame: 21000113
	}, {
		st: 21000114
	}, {
		game: 21000115
	}, {
		gcs: 21000108
	}, {
		pigpet: 21000117
	}, {
		fcm: 21000116
	}, {
		petbear: 21000101
	}, {
		gamesafe: 21000109
	}, {
		webgame: 21000118
	}, {
		"ied-gameinfo": 21000501
	}, {
		gw: 536013304
	}, {
		poe: 1600000673
	}, {
		omd: 1600000720
	}],
	APPGAMEID: "qqtang qqgame fo ffo pet sg r2 xx x5 speed cf dnf ava sl xj dm bear".split(" ")
};
LoginManager._comm = {
	getGameId: function(b) {
		b = (b || window.location.host).match(/(\w+?)\.qq\.com/gim);
		var a = "";
		b && 0 < b.length && (b = b[0].split(".")[0].toLowerCase(), a = b = b.replace(/^test|test$/gim, ""));
		return a
	},
	getAppId: function(b) {
		b = b || this.getGameId();
		var a = -1;
		if (b) {
			for (var d = 0; d < LoginManager._DATA.APPID.length; d++) {
				var c = LoginManager._DATA.APPID[d],
					e;
				for (e in c)
					if (e == b) {
						a = d;
						break
					}
				if (0 <= 1 * a) break
			}
			0 > 1 * a && (a = LoginManager._randomInt(LoginManager._DATA.APPID.length), 2 >= a && (a += 3))
		} else a = LoginManager._randomInt(LoginManager._DATA.APPID.length), 2 >= a && (a += 3);
		c = LoginManager._DATA.APPID[1 * a];
		for (e in c) return c[e];
		return ""
	},
	getAppGameId: function(b) {
		return b = b || this.getGameId()
	},
	getCheckLoginUrl: function(b) {
		var a = "0";
		var uri = "https://apps.game.qq.com/comm-cgi-bin/login/LoginReturnInfo.cgi";
		if (window.location.host === 'xinyue.qq.com') {
		  uri = location.protocol+"//apps.game.qq.com/php/tgclub/v2/login/login";
		}
		b = {
			0: uri,
			1: "https://commwebgame.game.qq.com/comm-cgi-bin/login/LoginReturnInfo.cgi",
			2: ""
		};
		var d;
		a: {
			var c = document.getElementsByTagName("script");
			for (d = 0; d < c.length; d++) {
				var e = c[d].src;
				if (e && 0 <= e.toLowerCase().indexOf("loginmanager")) {
					d = e;
					break a
				}
			}
			d = ""
		}
		c = !1;
		d && (d = LoginManager._getAllQuery(d), d.loginType && (a = d.loginType, c = !0));
		!c && (c = window.location.href, /.*qq\.com($|\/[^\/]*$)/gim.test(c) && (a = "0"), /http:\/\/game\.[^\.]+\.qq\.com/gim.test(c) && (a = "1"), 0 <= c.indexOf("qq.com/webgame_login/") && (a = "1"), 0 <= c.indexOf("qq.com/server/") || 0 <= c.indexOf("qq.com/qzone/") || 0 <= c.indexOf("qq.com/box/") || 0 <= c.indexOf("qq.com/qqgame/") || 0 <= c.indexOf("qq.com/manyou/") || 0 <= c.indexOf("qq.com/webqq/") || 0 <= c.indexOf("qq.com/qplus/") || 0 <= c.indexOf("qq.com/union/") || 0 <= c.indexOf("qq.com/igame/") || 0 <= c.indexOf("qq.com/3366/") || 0 <= c.indexOf("qq.com/xiaoyou/") || "1.qq.com" == window.location.host || "yy.qq.com" == window.location.host || "web.3366.com" == window.location.host && c.indexOf("/ad/")) && (a = "1");
		(a = b[a]) || (a = b["0"]);
		return a
	},
	checkUserLogined: function() {
		var b = LoginManager._getCookie("IED_LOG_INFO2"),
			a = LoginManager._getCookie("p_skey"),
			d = LoginManager._getCookie("skey");
		if (location.href && 0 <= location.href.indexOf("3366.com") && a || location.href && 0 <= location.href.indexOf("3366.com") && d) return !0;
		if (!b) return !1;
		b = LoginManager._getAllQuery(b);
		if (!b || !b.userUin) return LoginManager._delCookie("IED_LOG_INFO2", "/", "qq.com"), !1;
		a = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest;
		a.open("HEAD", window.location.href, !1);
		a.send();
		a = new Date(a.getResponseHeader("Date"));
		return 120 < Math.floor(a.getTime() / 1e3) - b.userLoginTime ? (LoginManager._delCookie("IED_LOG_INFO2", "/", "qq.com"), !1) : !0
	},
	callbackLoginInfo: function(b, a) {
		"object" != typeof window.loginFunction && (window.loginFunction = {});
		window.loginFunction[b] = window[b] = function(b) {
			if (0 != b.errorCode && -1 != b.errorCode) alert("\u8fd4\u56de\u7ed3\u679c\u51fa\u9519\uff0c\u9519\u8bef\u4fe1\u606f\u4e3a\uff1a" + b.errorStr);
			else {
				if (b.isLogin) {
					var c = LoginManager._getCookie("IED_LOG_INFO2"),
						c = c ? LoginManager._getAllQuery(c) : {};
					c.userUin = b.userUin;
					c.nickName = b.nickName;
					c.userLoginTime = b.userLoginTime;
					c = LoginManager._getAllQueryStr(c);
					LoginManager._setCookie("IED_LOG_INFO2", c, 0, "/", "qq.com")
				} else LoginManager._delCookie("IED_LOG_INFO2", "/", "qq.com");
				"function" == typeof a && a(b)
			}
		}
	}
};
LoginManager._tool = {
	bom: function() {
		var b = {};
		b.isIE = -1 == navigator.userAgent.indexOf("MSIE") ? !1 : !0;
		b.isIE6 = b.isIE && !window.XMLHttpRequest && window.ActiveXObject ? !0 : !1;
		return b
	}(),
	setStyle: function(b, a) {
		for (var d in a) d && (b.style[d] = a[d]);
		return !0
	},
	getStyleStr: function(b) {
		var a = [],
			d;
		for (d in b) d && a.push(d + ":" + b[d] + ";");
		return a.join(" ")
	},
	getMaxWidth: function() {
		var b = function() {
				var b = null;
				return b = window.innerWidth && window.scrollMaxX ? window.innerWidth + window.scrollMaxX : document.body.scrollWidth > document.body.offsetWidth ? document.body.scrollWidth : document.body.offsetWidth
			},
			a = function() {
				return window.innerWidth ? window.innerWidth : document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.offsetWidth
			};
		return b() > a() ? b() : a()
	},
	getMaxHeight: function() {
		var b = function() {
				var b = null;
				return b = window.innerHeight && window.scrollMaxY ? window.innerHeight + window.scrollMaxY : document.body.scrollHeight > document.body.offsetHeight ? document.body.scrollHeight : document.body.offsetHeight
			},
			a = function() {
				return window.innerHeight ? window.innerHeight : document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.offsetHeight
			};
		return b() > a() ? b() : 1 * a() - 4
	},
	setAlignCenter: function(b) {
		b && (b.style.margin = "0px", b.style.left = (window.innerWidth ? window.innerWidth : document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.offsetWidth) / 2 - b.clientWidth / 2 + "px", b.style.top = (window.innerHeight ? window.innerHeight : document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.offsetHeight) / 2 + (document.body.scrollTop || document.documentElement.scrollTop) - b.clientHeight / 2 + "px")
	}
};
LoginManager._tool.option = {
	maxId: 0
};
LoginManager._tool.getId = function() {
	return ++LoginManager._tool.option.maxId
};
LoginManager._tool.createScript = function(b) {
	var a = {
			url: "",
			charset: "gb2312",
			cache: !0,
			dataType: "object",
			dataTypeName: "",
			onLoadStartEvent: null,
			onLoadingEvent: null,
			onLoadSuccessEvent: null,
			onLoadErrorEvent: null,
			onLoadCompleteEvent: null
		},
		d = 3;
	LoginManager._$extend(a, b);
	if (b = function(b) {
			if (!b.url) return "";
			if (!1 === b.cache) {
				var a = +new Date,
					c = b.url.replace(/(\?|&)_=.*?(&|$)/, "$1_=" + a + "$2");
				b.url = c + (c == b.url ? (b.url.match(/\?/) ? "&" : "?") + "_=" + a : "")
			}
			return b.url
		}(a))
		if (a.url = b, "function" != typeof a.onLoadStartEvent || !a.onLoadStartEvent(a)) {
			var c = document.getElementsByTagName("head")[0] || document.documentElement,
				e = document.createElement("script");
			e.setAttribute("src", a.url);
			e.setAttribute("type", "text/javascript");
			a.charset && e.setAttribute("charset", a.charset);
			"function" != typeof a.onLoadSuccessEvent && (a.onLoadSuccessEvent = function(b) {});
			"function" != typeof a.onLoadCompleteEvent && (a.onLoadCompleteEvent = function(b) {});
			"function" != typeof a.onLoadErrorEvent && (a.onLoadErrorEvent = function(b) {});
			var g = !1,
				f = LoginManager._tool.getId();
			e.onload = e.onreadystatechange = function() {
				if (!(g || this.readyState && "loaded" != this.readyState && "complete" != this.readyState)) {
					g = !0;
					var b = window["FILE_LOAD_FLAG_" + f] = !1;
					if ("object" == a.dataType)
						if (a.dataTypeName) {
							if ("object" == typeof window[a.dataTypeName]) {
								a.onLoadSuccessEvent(a);
								a.onLoadCompleteEvent(a);
								window["FILE_LOAD_FLAG_" + f] = !0;
								return
							}
							window["FileLoadFlag_" + f] = window.setInterval(function() {
								"object" == typeof window[a.dataTypeName] ? (a.onLoadSuccessEvent(a), a.onLoadCompleteEvent(a), window["FILE_LOAD_FLAG_" + f] = !0, clearInterval(window["FileLoadFlag_" + f])) : (d--, 0 >= d && (a.onLoadErrorEvent(a), a.onLoadCompleteEvent(a), window["FILE_LOAD_FLAG_" + f] = !0, clearInterval(window["FileLoadFlag_" + f])))
							}, 1e3)
						} else b = !0;
					else if ("function" == a.dataType)
						if (a.dataTypeName) {
							if ("function" == typeof window[a.dataTypeName]) {
								a.onLoadSuccessEvent(a);
								a.onLoadCompleteEvent(a);
								window["FILE_LOAD_FLAG_" + f] = !0;
								return
							}
							window["FileLoadFlag_" + f] = window.setInterval(function() {
								"function" == typeof window[a.dataTypeName] ? (a.onLoadSuccessEvent(a), a.onLoadCompleteEvent(a), window["FILE_LOAD_FLAG_" + f] = !0, clearInterval(window["FileLoadFlag_" + f])) : (d--, 0 >= d && (a.onLoadErrorEvent(a), a.onLoadCompleteEvent(a), window["FILE_LOAD_FLAG_" + f] = !0, clearInterval(window["FileLoadFlag_" + f])))
							}, 1e3)
						} else b = !0;
					if (b) {
						a.onLoadSuccessEvent(a);
						a.onLoadCompleteEvent(a);
						return
					}
				}
				var h = +new Date;
				window["FILE_LOAD_TIMMER_FLAG_" + f] = window.setInterval(function() {
					window["FILE_LOAD_FLAG_" + f] ? clearInterval(window["FILE_LOAD_TIMMER_FLAG_" + f]) : 30 <= (+new Date - h) / 1e3 && (a.onLoadErrorEvent(a), a.onLoadCompleteEvent(a), clearInterval(window["FILE_LOAD_TIMMER_FLAG_" + f]))
				}, 100);
				setTimeout(function() {
					try {
						c.removeChild(e)
					} catch (b) {}
				}, 5e3)
			};
			"function" == typeof a.onLoadingEvent && a.onLoadingEvent(a) || c.appendChild(e)
		}
};
LoginManager._cover = {
	option: {
		alpha: 50,
		overflowX: "",
		allSelectDisplayList: null,
		timeInterval: null
	},
	show: function(b, a) {
		var d = this.createBackground(a);
		if (d) {
			var c = document.body;
			this.option.overflowX = c.style.overflowX;
			LoginManager._tool.setStyle(c, {
				overflowX: "hidden"
			});
			if (LoginManager._tool.bom.isIE6 && (LoginManager._tool.setStyle(document.getElementsByTagName("html")[0], {
					overflowX: "hidden"
				}), c = document.getElementsByTagName("select"), 0 < c.length)) {
				LoginManager._cover.option.allSelectDisplayList = [];
				for (var e = 0; e < c.length; e++) {
					var g = c[e];
					LoginManager._cover.option.allSelectDisplayList.push({
						dom: g,
						display: g.style.display
					});
					g.style.display = "none"
				}
			}
			LoginManager._tool.setStyle(d, {
				display: "block"
			});
			"function" == typeof b && b();
			this.option.timeInterval = setInterval(function() {
				LoginManager._cover.adjust()
			}, 50)
		}
	},
	hide: function(b) {
		var a = document.getElementById("coverbg") || document.getElementById("_overlay_");
		if (a) {
			document.body.style.overflowX = this.option.overflowX;
			LoginManager._tool.setStyle(a, {
				display: "none"
			});
			if (LoginManager._tool.bom.isIE6 && (LoginManager._tool.setStyle(document.getElementsByTagName("html")[0], {
					overflowX: "auto"
				}), LoginManager._cover.option.allSelectDisplayList)) {
				for (a = 0; a < LoginManager._cover.option.allSelectDisplayList.length; a++) {
					var d = LoginManager._cover.option.allSelectDisplayList[a];
					d.dom.style.display = d.display
				}
				LoginManager._cover.option.allSelectDisplayList = null
			}
			"function" == typeof b && b()
		}
		this.option.timeInterval && (clearInterval(this.option.timeInterval), this.option.timeInterval = null)
	},
	adjust: function() {
		var b = document.getElementById("coverbg");
		if (b) {
			var a = LoginManager._tool.getMaxWidth(),
				d = LoginManager._tool.getMaxHeight(),
				a = document.documentElement.clientWidth,
				d = document.documentElement.clientHeight,
				c = document.documentElement.offsetWidth,
				e = document.documentElement.offsetHeight,
				g = document.documentElement.scrollWidth,
				f = document.documentElement.scrollHeight;
			e > d && (d = e);
			c > a && (a = c);
			f > d && (d = f);
			g > a && (a = g);
			a > screen.availWidth && (a = screen.availWidth);
			d > LoginManager._tool.getMaxHeight() && (d = LoginManager._tool.getMaxHeight());
			LoginManager._tool.bom.isFireFox && (5e3 < d && (d = 5e3), 3e3 < a && (a = 3e3));
			LoginManager._tool.setStyle(b, {
				width: a + "px",
				height: d + "px"
			});
			(b = b.children[0]) && LoginManager._tool.setStyle(b, {
				width: a + "px",
				height: d + "px"
			})
		}
	},
	createBackground: function(b) {
		b = b ? b : "#E6F5FF";
		var a = this.option.alpha,
			d = document.body;
		if (d) {
			var c = document.getElementById("coverbg");
			c || (c = document.createElement("div"), c.setAttribute("id", "coverbg"), LoginManager._tool.setStyle(c, {
				position: "absolute",
				display: "none",
				"z-Index": 998,
				left: "0px",
				top: "0px"
			}), function(b, a) {
				LoginManager._tool.bom.isIE ? (b.style.filter = "Alpha(opacity=" + a + ")", b.style.filter || (b.style.opacity = a / 100)) : b.style.opacity = a / 100
			}(c, a), (a = d.children[0]) ? d.insertBefore(c, a) : d.insertBefore(c));
			c.style.zIndex = 998;
			(c = function() {
				var b = c.children[0];
				if (b) return LoginManager._tool.setStyle(b, {
					width: LoginManager._tool.getMaxWidth() + "px",
					height: LoginManager._tool.getMaxHeight() + "px"
				}), c;
				try {
					return b = document.createElement("iframe"), b.setAttribute("src", "about:blank"), b.setAttribute("scrolling", "no"), b.setAttribute("frameborder", "0"), b.setAttribute("allowtransparency", "true"), LoginManager._tool.setStyle(b, {
						position: "absolute",
						border: 0,
						"z-Index": "997",
						top: "0",
						left: "0",
						width: LoginManager._tool.getMaxWidth() + "px",
						height: LoginManager._tool.getMaxHeight() + "px",
						filter: "Alpha(Opacity=0,Style=0)",
						"background-color": "transparent"
					}), b.style.zIndex = 997, LoginManager._tool.bom.isIE6 && (b.style.display = "none"), c.appendChild(b), c
				} catch (a) {}
				return null
			}()) && LoginManager._tool.setStyle(c, {
				backgroundColor: b,
				width: LoginManager._tool.getMaxWidth() + "px",
				height: LoginManager._tool.getMaxHeight() + "px"
			});
			return c
		}
		alert("\u6ca1\u627e\u5230body\u6807\u7b7e\uff0c\u8bf7\u653e\u5230body\u4e4b\u540e\u5f15\u7528");
		return null
	}
};
LoginManager._coverdiv = {
	openPromptDiv: function(b) {
		var a = {
			msg: "",
			width: 250,
			height: 40,
			left: .5,
			top: .5,
			show: !0
		};
		LoginManager._$extend(a, b);
		b = LoginManager._$E("loginPromptDiv");
		b || (b = document.createElement("div"), b.id = "loginPromptDiv", b.style.backgroundColor = "#FFFFCC", b.style.border = "2px solid buttonface", b.style.padding = "0px", b.style.zIndex = "100000", b.style.margin = "0px", b.style.position = "absolute", b.style.textAlign = "center", b.style.top = "30%", b.style.left = "30%", b.style.color = "#000000", b.style.display = "none", b.style.fontSize = "12px", document.body.appendChild(b));
		b.style.width = a.width + "px";
		b.style.height = a.height + "px";
		b.style.lineHeight = a.height + "px";
		b.innerHTML = LoginManager.filterXSS(a.msg);
		a.show && (b.style.display = "block");
		this.setDivPosition(b, {
			left: a.left,
			top: a.top
		});
		return b
	},
	closePromptDiv: function() {
		var b = LoginManager._$E("loginPromptDiv");
		b && (b.innerHTML = "", b.style.display = "none")
	},
	getLoginDiv: function() {
		var b = LoginManager._$E("loginDiv");
		b || (b = this.openLoginDiv());
		LoginManager._$E("loginIframe").getAttribute("src") || (b.style.display = "none");
		return b
	},
	openLoginDiv: function(b) {
		var a = {
			left: .5,
			top: .5,
			src: "",
			show: !0
		};
		LoginManager._$extend(a, b);
		b = LoginManager._$E("loginDiv");
		if (!b) {
			b = document.createElement("div");
			b.id = "loginDiv";
			b.style.height = "368px";
			b.style.width = "622px";
			b.style.border = "0px";
			b.style.padding = "0px";
			b.style.margin = "0px";
			b.style.position = "absolute";
			b.style.zIndex = "100002";
			b.style.top = "20%";
			b.style.left = "30%";
			b.style.display = "none";
			var d = document.createElement("iframe");
			d.id = "loginIframe";
			d.name = "loginIframe";
			d.frameborder = "0";
			d.scrolling = "no";
			d.width = "100%";
			d.height = "100%";
			d.frameBorder = "0";
			b.appendChild(d);
			document.body.appendChild(b)
		}
		LoginManager._$E("loginIframe").setAttribute("src", a.src);
		a.show && (b.style.display = "block");
		this.setDivPosition(b, {
			left: a.left,
			top: a.top
		});
		return b
	},
	closeLoginDiv: function() {
		var b = LoginManager._$E("loginDiv");
		b && (b.style.display = "none")
	},
	setDivPosition: function(b, a) {
		var d, c;
		c = Math.min(document.documentElement.clientHeight, document.body.clientHeight);
		d = Math.min(document.documentElement.clientWidth, document.body.clientWidth);
		0 >= d && (d = document.documentElement.clientWidth + document.body.clientWidth);
		0 >= c && (c = document.documentElement.clientHeight + document.body.clientHeight);
		var e = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
			g = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
			f = {
				top: .5,
				left: .5
			};
		LoginManager._$extend(f, a);
		b.style.top = Math.floor(g + (c - parseInt(b.clientHeight || b.style.height)) * (f.top || .5)) + "px";
		b.style.left = Math.floor(e + (d - parseInt(b.clientWidth || b.style.width)) * (f.left || .5)) + "px";
		0 >= b.style.top && (b.style.top = "30%", b.style.left = "30%")
	}
};
LoginManager.__getUserUin = function() {
	var b = LoginManager._getCookie("IED_LOG_INFO2");
	return b ? (b = LoginManager._getAllQuery(b), (b = b.userUin) && !isNaN(b) ? b : "") : ""
};
LoginManager.isLogin = function() {
	return LoginManager._comm.checkUserLogined()
};
LoginManager.getUserUin = function() {
	var b = LoginManager.__getUserUin();
	if (!b) return "";
	var a = LoginManager._getCookie("show_id");
	if (!a) return b;
	var d = a.length;
	if (0 != d % 2) a = "";
	else {
		for (var c = "", e = 0; e < d; e += 2) c += String.fromCharCode(parseInt(a.substr(e, 2), 16));
		a = c
	}
	return isNaN(a) ? b : a
};
LoginManager.getNickName = function(b) {
	"function" != typeof b && (b = function(b) {});
	var a = LoginManager._getCookie("IED_LOG_INFO2"),
		d = {
			isLogin: !1,
			nickName: ""
		};
	if (a) {
		a = LoginManager._getAllQuery(a);
		if (a.nickName) {
			d = {
				isLogin: !0,
				nickName: decodeURIComponent(a.nickName) || ""
			};
			b(d);
			return
		}
		if (!a.nickName && a.userUin) {
			d = {
				isLogin: !0,
				nickName: a.userUin || "",
				nickIsUin: !0
			};
			b(d);
			return
		}
	}
	b(d)
};
LoginManager.getUserVip = function(b, a) {
	b = b || "";
	b = b.toLowerCase();
	var d = {
		cf: !0,
		xx: !0,
		ava: !0,
		roco: !0,
		qq: !0
	};
	b && d[b] && LoginManager.checkLogin(function() {
		LoginManager.getUserVip["get" + b.toUpperCase() + "Vip"](a)
	}, function() {
		var b = LoginManager.getUserVip.getVIPObj();
		"function" == typeof a && a(b)
	});
	var c = [],
		e;
	for (e in d) c.push(e);
	return c
};
LoginManager.getUserDiamond = function(b, a) {
	b = b || "";
	b = b.toLowerCase();
	var d = {
		qqgame: !0,
		speed: !0,
		qqshow: !0,
		qqzone: !0,
		r2: !0,
		qqtang: !0,
		x5: !0,
		dnf: !0
	};
	"function" != typeof a && (a = function(b) {});
	b && d[b] && LoginManager.checkLogin(function() {
		LoginManager.getUserDiamond["get" + b.toUpperCase() + "Diamond"](function(c) {
			a(c);
			c = b + "_diamond_content";
			var d = LoginManager._$E("#" + c);
			if (d && d.innerHTML)
				for (var d = d.innerHTML, e = document.getElementsByTagName("*"), h = 0; h < e.length; h++) {
					var k = e[h].getAttribute("name");
					k && k == c && (e[h].innerHTML = d)
				}
		})
	}, function() {
		var b = LoginManager.getUserDiamond.getDiamondObj();
		a(b)
	});
	var c = [],
		e;
	for (e in d) c.push(e);
	return c
};
LoginManager.getUserVip.getVIPObj = function() {
	return {
		isLogin: !1,
		isVip: !1
	}
};
LoginManager.getUserVip.getCFVip = function(b) {
	var a = "jsonp" + LoginManager._randomInt(100);
	LoginManager._comm.callbackLoginInfo(a, function(a) {
		var c = LoginManager.getUserVip.getVIPObj();
		a.isLogin && (c.isLogin = !0, 1 == a.isvip && (c.isVip = !0));
		"function" == typeof b && b(c)
	});
	LoginManager._tool.createScript({
		url: LoginManager._comm.getCheckLoginUrl("cf") + "?callback=" + a + "&cmd=1&type=CF",
		charset: "gb2312",
		cache: !1,
		dataType: "function",
		dataTypeName: a,
		onLoadStartEvent: null,
		onLoadingEvent: null,
		onLoadSuccessEvent: function() {},
		onLoadErrorEvent: function() {},
		onLoadCompleteEvent: null
	})
};
LoginManager.getUserVip.getXXVip = function(b) {
	var a = "jsonp" + LoginManager._randomInt(100);
	LoginManager._comm.callbackLoginInfo(a, function(a) {
		var c = LoginManager.getUserVip.getVIPObj();
		a.isLogin && (c.isLogin = !0, 1 == a.isvip && (c.isVip = !0));
		"function" == typeof b && b(c)
	});
	LoginManager._tool.createScript({
		url: LoginManager._comm.getCheckLoginUrl("xx") + "?callback=" + a + "&cmd=1&type=XX",
		charset: "gb2312",
		cache: !1,
		dataType: "function",
		dataTypeName: a,
		onLoadStartEvent: null,
		onLoadingEvent: null,
		onLoadSuccessEvent: function() {},
		onLoadErrorEvent: function() {},
		onLoadCompleteEvent: null
	})
};
LoginManager.getUserVip.getAVAVip = function(b) {
	var a = "jsonp" + LoginManager._randomInt(100);
	LoginManager._comm.callbackLoginInfo(a, function(a) {
		var c = LoginManager.getUserVip.getVIPObj();
		a.isLogin && (c.isLogin = !0, 1 == a.isvip && (c.isVip = !0));
		"function" == typeof b && b(c)
	});
	LoginManager._tool.createScript({
		url: LoginManager._comm.getCheckLoginUrl("ava") + "?callback=" + a + "&cmd=1&type=AVA",
		charset: "gb2312",
		cache: !1,
		dataType: "function",
		dataTypeName: a,
		onLoadStartEvent: null,
		onLoadingEvent: null,
		onLoadSuccessEvent: function() {},
		onLoadErrorEvent: function() {},
		onLoadCompleteEvent: null
	})
};
LoginManager.getUserVip.getROCOVip = function(b) {
	var a = "jsonp" + LoginManager._randomInt(100);
	LoginManager._comm.callbackLoginInfo(a, function(a) {
		var c = LoginManager.getUserVip.getVIPObj();
		a.isLogin && (c.isLogin = !0, 1 == a.isvip && (c.isVip = !0));
		"function" == typeof b && b(c)
	});
	LoginManager._tool.createScript({
		url: LoginManager._comm.getCheckLoginUrl("roco") + "?callback=" + a + "&cmd=1&type=ROCO",
		charset: "gb2312",
		cache: !1,
		dataType: "function",
		dataTypeName: a,
		onLoadStartEvent: null,
		onLoadingEvent: null,
		onLoadSuccessEvent: function() {},
		onLoadErrorEvent: function() {},
		onLoadCompleteEvent: null
	})
};
LoginManager.getUserVip.getQQVip = function(b) {
	var a = "jsonp" + LoginManager._randomInt(100);
	LoginManager._comm.callbackLoginInfo(a, function(a) {
		var c = LoginManager.getUserVip.getVIPObj();
		a.isLogin && (c.isLogin = !0, 1 == a.isvip && (c.isVip = !0));
		"function" == typeof b && b(c)
	});
	LoginManager._tool.createScript({
		url: LoginManager._comm.getCheckLoginUrl("roco") + "?callback=" + a + "&cmd=1&type=QQ",
		charset: "gb2312",
		cache: !1,
		dataType: "function",
		dataTypeName: a,
		onLoadStartEvent: null,
		onLoadingEvent: null,
		onLoadSuccessEvent: function() {},
		onLoadErrorEvent: function() {},
		onLoadCompleteEvent: null
	})
};
LoginManager.getUserDiamond.getDiamondObj = function() {
	return {
		isLogin: !1,
		isVip: !1,
		isSuperVip: !1,
		vipLevel: -1,
		isYearVip: !1,
		errorInfo: ""
	}
};
LoginManager.getUserDiamond.DATA = {};
LoginManager.getUserDiamond.getQQGAMEDiamond = function(b) {
	var a = (new Date).getMinutes();
	LoginManager._tool.createScript({
		url: location.protocol+"//apps.game.qq.com/qqgame/act/PTV5Proxy/GetToken.php?cname=pt4_token&_r=" + a,
		dataType: "object",
		cache: !0,
		dataTypeName: "PT4_TOKEN",
		showLoadingStr: "",
		onLoadSuccessEvent: function() {
			if ("object" != typeof PT4_TOKEN || "" == PT4_TOKEN.data) {
				var a = LoginManager.getUserDiamond.getDiamondObj();
				a.isLogin = !1;
				b(a)
			} else {
				var c = "jsonp" + LoginManager._randomInt(100);
				"function" != typeof b && (b = function(b) {});
				(a = LoginManager.getUserDiamond.DATA["qqgame_" + LoginManager.getUserUin()]) ? b(a): (window[c] = function(a) {
					var c = LoginManager.getUserDiamond.getDiamondObj();
					if ("undefined" != a.result && 0 == a.result && "undefined" != a.baseinfo) {
						c.isLogin = !0;
						1 == 1 * a.baseinfo.issupervip && (c.isSuperVip = !0);
						1 == 1 * a.baseinfo.isvip && (c.isVip = !0);
						1 == 1 * a.baseinfo.isYearvip && (c.isYearVip = !0);
						"undefined" != a.baseinfo.level && (!isNaN(a.baseinfo.level) && 1 <= 1 * a.baseinfo.level && 7 >= 1 * a.baseinfo.level) && (c.vipLevel = a.baseinfo.level);
						if (LoginManager._$E("#qqgame_diamond_content")) {
							var d = "";
							if (c.isSuperVip || c.isVip) c.isSuperVip && 1 <= 1 * c.vipLevel ? (d = '<img src="//ossweb-img.qq.com/images/gamevip/lz_icon/lz_on_' + c.vipLevel + '.png" />', a.blue_src = "//ossweb-img.qq.com/images/gamevip/lz_icon/lz_on_" + c.vipLevel + ".png") : c.isVip && 1 <= 1 * c.vipLevel && (d = '<img src="//ossweb-img.qq.com/images/gamevip/lz_icon/lz_a_on_' + c.vipLevel + '.png" />', a.blue_src = "//ossweb-img.qq.com/images/gamevip/lz_icon/lz_a_on_" + c.vipLevel + ".png"), c.isYearVip ? (d += ' <img src="//ossweb-img.qq.com/images/gamevip/lz_icon/year_icon.png" /> ', a.year_src = "//ossweb-img.qq.com/images/gamevip/lz_icon/year_icon.png") : (d += ' <img src="//ossweb-img.qq.com/images/gamevip/lz_icon/no_year_icon.png" /> ', a.year_src = "//ossweb-img.qq.com/images/gamevip/lz_icon/no_year_icon.png");
							LoginManager._$E("#qqgame_diamond_content").innerHTML = d
						}
						LoginManager._$E("#qqgame_superDiamond_content") && (d = "", a.baseinfo.issupervip && a.ExpandVipInfo && (d = 1 == a.ExpandVipInfo.SUPERHX.Payway ? d + ' <img src="//ossweb-img.qq.com/images/gamevip/lz_icon/super/lz_super_hx.png" /> ' : d + ' <img src="//ossweb-img.qq.com/images/gamevip/lz_icon/super/lz_super_hx_off.png" /> ', d = 1 == a.ExpandVipInfo.SUPERTT.Payway ? d + ' <img src="//ossweb-img.qq.com/images/gamevip/lz_icon/super/lz_super_tt2.png" /> ' : d + ' <img src="//ossweb-img.qq.com/images/gamevip/lz_icon/super/lz_super_tt2_off.png" /> ', d = 1 == a.ExpandVipInfo.SUPERXL.Payway ? d + ' <img src="//ossweb-img.qq.com/images/gamevip/lz_icon/super/lz_super_xl.png" /> ' : d + ' <img src="//ossweb-img.qq.com/images/gamevip/lz_icon/super/lz_super_xl_off.png" /> '), LoginManager._$E("#qqgame_superDiamond_content").innerHTML = d)
					}
					LoginManager.getUserDiamond.DATA || (LoginManager.getUserDiamond.DATA = {});
					LoginManager.getUserDiamond.DATA["qqgame_" + LoginManager.getUserUin()] = c;
					b(c)
				}, a = location.protocol+"//ptlogin2.qq.com/pt4_web_jump?pt4_token=" + PT4_TOKEN.data + "&daid=176&appid=21000110&succ_url=" + encodeURIComponent(location.protocol+"//app.gamevip.qq.com/cgi-bin/gamevip_prepay/gamevip_fetch_vip_info?DomainID=176&callback=" + c), LoginManager._tool.createScript({
					url: a,
					charset: "gb2312",
					cache: !1,
					dataType: "function",
					dataTypeName: c,
					onLoadStartEvent: null,
					onLoadingEvent: null,
					onLoadCompleteEvent: null
				}))
			}
		}
	})
};
LoginManager.getUserDiamond.getQQSHOWDiamond = function(b) {
	var a = "jsonp" + LoginManager._randomInt(100);
	LoginManager._comm.callbackLoginInfo(a, function(a) {
		var c = LoginManager.getUserDiamond.getDiamondObj();
		a.isLogin && (c.isLogin = !0, 1 == a.isvip && (c.isVip = !0), 0 <= a.viplevel && (c.vipLevel = a.viplevel), 1 == a.isYearVip && (c.isYearVip = !0));
		"function" == typeof b && b(c)
	});
	LoginManager._tool.createScript({
		url: LoginManager._comm.getCheckLoginUrl() + "?callback=" + a + "&cmd=1&type=QQSHOW",
		charset: "gb2312",
		cache: !1,
		dataType: "function",
		dataTypeName: a,
		onLoadStartEvent: null,
		onLoadingEvent: null,
		onLoadSuccessEvent: function() {},
		onLoadErrorEvent: function() {},
		onLoadCompleteEvent: null
	})
};
LoginManager.getUserDiamond.getQQZONEDiamond = function(b) {
	var a = "jsonp" + LoginManager._randomInt(100);
	LoginManager._comm.callbackLoginInfo(a, function(a) {
		var c = LoginManager.getUserDiamond.getDiamondObj();
		a.isLogin && (c.isLogin = !0, 1 == a.isvip && (c.isVip = !0), 0 <= a.viplevel && (c.vipLevel = a.viplevel), 1 == a.isYearVip && (c.isYearVip = !0));
		c.isLogin && (c.yellow_src = c.isVip ? location.protocol+"//ctc.qzonestyle.gtimg.cn/ac/qzone_v5/client/icon_lv.gif" : location.protocol+"//ctc.qzonestyle.gtimg.cn/ac/qzone_v5/client/icon_lvn.gif", LoginManager._$E("qqzone_diamond_content") && 0 < c.vipLevel && (LoginManager._$E("qqzone_diamond_content").innerHTML = '<span style="display:inline-block; width:57px; height:18px; background:url(' + c.yellow_src + ') no-repeat scroll left top transparent;"><span style="display:block; font-family:Tahoma, Geneva, sans-serif; font-size:9px; font-weight:bolder; margin:3px 0 0 35px; color:#666666;">' + c.vipLevel + "</span></span>"));
		"function" == typeof b && b(c)
	});
	LoginManager._tool.createScript({
		url: LoginManager._comm.getCheckLoginUrl() + "?callback=" + a + "&cmd=1&type=QZONE",
		charset: "gb2312",
		cache: !1,
		dataType: "function",
		dataTypeName: a,
		onLoadStartEvent: null,
		onLoadingEvent: null,
		onLoadSuccessEvent: function() {},
		onLoadErrorEvent: function() {},
		onLoadCompleteEvent: null
	})
};
LoginManager.getUserDiamond.getR2Diamond = function(b) {
	var a = "jsonp" + LoginManager._randomInt(100);
	LoginManager._comm.callbackLoginInfo(a, function(a) {
		var c = LoginManager.getUserDiamond.getDiamondObj();
		a.isLogin && (c.isLogin = !0, 1 == a.isvip && (c.isVip = !0), 0 <= a.viplevel && (c.vipLevel = a.viplevel), 1 == a.isYearVip && (c.isYearVip = !0));
		"function" == typeof b && b(c)
	});
	LoginManager._tool.createScript({
		url: LoginManager._comm.getCheckLoginUrl("r2") + "?callback=" + a + "&cmd=1&type=QQR2",
		charset: "gb2312",
		cache: !1,
		dataType: "function",
		dataTypeName: a,
		onLoadStartEvent: null,
		onLoadingEvent: null,
		onLoadSuccessEvent: function() {},
		onLoadErrorEvent: function() {},
		onLoadCompleteEvent: null
	})
};
LoginManager.getUserDiamond.getQQTANGDiamond = function(b) {
	var a = "jsonp" + LoginManager._randomInt(100);
	LoginManager._comm.callbackLoginInfo(a, function(a) {
		var c = LoginManager.getUserDiamond.getDiamondObj();
		a.isLogin && (c.isLogin = !0, 1 == a.isvip && (c.isVip = !0), 0 <= a.viplevel && (c.vipLevel = a.viplevel), 1 == a.isYearVip && (c.isYearVip = !0));
		"function" == typeof b && b(c)
	});
	LoginManager._tool.createScript({
		url: LoginManager._comm.getCheckLoginUrl("qqtang") + "?callback=" + a + "&cmd=1&type=QQTANG",
		charset: "gb2312",
		cache: !1,
		dataType: "function",
		dataTypeName: a,
		onLoadStartEvent: null,
		onLoadingEvent: null,
		onLoadSuccessEvent: function() {},
		onLoadErrorEvent: function() {},
		onLoadCompleteEvent: null
	})
};
LoginManager.getUserDiamond.getX5Diamond = function(b) {
	"function" != typeof b && (b = function(b) {});
	var a = LoginManager.getUserDiamond.DATA["x5_" + LoginManager.getUserUin()];
	if (a) b(a);
	else {
		var d = function(a) {
				a.isLogin = !0;
				a.x5_src || (a.x5_src = "");
				a.x5_year_src || (a.x5_year_src = "");
				a.iGender || (a.iGender = 0);
				a.x5_gender_src || (a.x5_gender_src = "");
				a.level = void 0;
				if (LoginManager._$E("#x5_diamond_content")) {
					var c = "";
					a.x5_src && (c += '<img src="' + a.x5_src + '" />');
					a.x5_year_src && (c += '<img src="' + a.x5_year_src + '" />');
					LoginManager._$E("#x5_diamond_content").innerHTML = c
				}
				LoginManager.getUserDiamond.DATA["x5_" + LoginManager.getUserUin()] = a;
				b(a)
			},
			c = LoginManager.getUserDiamond.getDiamondObj();
		LoginManager._tool.createScript({
			url: location.protocol+"//apps.game.qq.com/cgi-bin/x5/x5vip/logined.cgi",
			charset: "gb2312",
			cache: !1,
			dataType: "object",
			dataTypeName: "result",
			onLoadSuccessEvent: function() {
				var b = result;
				c = LoginManager._$extend(c, b);
				if (0 == b.ret) c.isVip = !1, c.vipLevel = -1, c.isYearVip = !1, c.errorInfo = b.msg, d(c);
				else if (1 == b.ret) {
					c.isVip = !1;
					var a = parseInt(b.level);
					0 < a ? (c.vipLevel = a, c.x5_src = "//ossweb-img.qq.com/images/x5/vip201106/lv" + a + "g.png") : (c.x5_src = "//ossweb-img.qq.com/images/x5/vip201106/lv1g.png", c.vipLevel = -1);
					c.isYearVip = !1;
					c.errorInfo = "";
					d(c)
				} else 2 == b.ret && (c.isVip = !0, a = parseInt(b.level), c.vipLevel = a, c.x5_src = "//ossweb-img.qq.com/images/x5/vip201106/lv" + a + ".png", c.isYearVip = !1, c.x5_year_src = "//ossweb-img.qq.com/images/x5/vip201106/nian_1.jpg", 1 == b.iIsNFVip && (c.isYearVip = !0, c.x5_year_src = "//ossweb-img.qq.com/images/x5/vip201106/nian.jpg"), 1 == b.iGender ? (c.iGender = 1, c.x5_gender_src = "//ossweb-img.qq.com/images/x5/vip201106/userface2.jpg") : (c.iGender = 2, c.x5_gender_src = "//ossweb-img.qq.com/images/x5/vip201106/userface.jpg"), c.errorInfo = "", d(c))
			},
			onLoadErrorEvent: function() {
				c.errorInfo = "\u7cfb\u7edf\u6b63\u5fd9\uff0c\u8bf7\u7a0d\u5019\u518d\u8bd5";
				d(c)
			}
		})
	}
};
LoginManager.getUserDiamond.getSPEEDDiamond = function(b) {
	"function" != typeof b && (b = function(b) {});
	var a = LoginManager.getUserDiamond.DATA["speed_" + LoginManager.getUserUin()];
	if (a) b(a);
	else {
		var d = LoginManager.getUserDiamond.getDiamondObj(),
			c = function(a) {
				a.isLogin = !0;
				a.speed_src = "";
				a.speed_year_src = "";
				if (0 == a.retCode && (a.isVip && 0 >= 1 * a.vipLevel && (a.vipLevel = 1), a.vipLevel && (!isNaN(a.vipLevel) && 0 <= 1 * a.vipLevel && 7 >= 1 * a.vipLevel) && (a.speed_src = "//ossweb-img.qq.com/images/speed/vip/lv" + a.vipLevel + ".png"), a.isVip || (a.speed_src = "//ossweb-img.qq.com/images/speed/vip/lv0.png"), a.isYearVip && (a.speed_year_src = "//ossweb-img.qq.com/images/speed/vip/lvn.png"), LoginManager._$E("#speed_diamond_content"))) {
					var c = "";
					a.speed_src && (c += '<img src="' + a.speed_src + '" />');
					a.speed_year_src && (c += '<img src="' + a.speed_year_src + '" />');
					LoginManager._$E("#speed_diamond_content").innerHTML = c
				}
				LoginManager.getUserDiamond.DATA["speed_" + LoginManager.getUserUin()] = a;
				b(a)
			};
		LoginManager._tool.createScript({
			url: location.protocol+"//apps.game.qq.com/speed/purple_vip/speedPurpleLogin.php",
			charset: "gb2312",
			cache: !1,
			dataType: "object",
			dataTypeName: "speed_object",
			onLoadSuccessEvent: function() {
				d = LoginManager._$extend(d, speed_object);
				speed_object.level && (d.vipLevel = speed_object.level);

				1 == speed_object.isnf && (d.isYearVip = !0);
				1 == speed_object.status && (d.isVip = !0);
				c(d)
			},
			onLoadErrorEvent: function() {
				d.errorInfo = "\u7cfb\u7edf\u6b63\u5fd9\uff0c\u8bf7\u7a0d\u5019\u518d\u8bd5";
				c(d)
			}
		})
	}
};
LoginManager.getUserDiamond.getDNFDiamond = function(b) {
	var a = "jsonp" + LoginManager._randomInt(100);
	LoginManager._comm.callbackLoginInfo(a, function(a) {
		var c = LoginManager.getUserDiamond.getDiamondObj();
		a.isLogin && (c.isLogin = !0, 1 == a.isvip && (c.isVip = !0), 0 <= a.viplevel && (c.vipLevel = a.viplevel), 1 == a.isYearVip && (c.isYearVip = !0));
		"function" == typeof b && b(c)
	});
	LoginManager._tool.createScript({
		url: LoginManager._comm.getCheckLoginUrl("dnf") + "?callback=" + a + "&cmd=1&type=DNF",
		charset: "gb2312",
		cache: !1,
		dataType: "function",
		dataTypeName: a,
		onLoadStartEvent: null,
		onLoadingEvent: null,
		onLoadSuccessEvent: function() {},
		onLoadErrorEvent: function() {},
		onLoadCompleteEvent: null
	})
};
LoginManager.login = function(b, a) {
	var d = {
			gameId: "",
			appid: "",
			f_url: "loginerroralert",
			s_url: "",
			no_verifyimg: 1
		},
		c = {
			needMaskDiv: !0,
			needNickName: !0,
			needReloadPage: !0,
			loginDivOffset: {
				left: .5,
				top: .5
			},
			msg: "\u6b63\u5728\u83b7\u53d6\u767b\u5f55\u4fe1\u606f\uff0c\u8bf7\u7a0d\u5019...",
			loginedCallback: null,
			type: "float",
			loginFrame: "loginHTMLFrame"
		},
		e = !0;
	"function" != typeof b && "object" == typeof b && (a = b, b = null);
	LoginManager._$extend(d, LoginManager._option);
	LoginManager._$extend(c, LoginManager._option);
	LoginManager._$extend(d, LoginManager._loginOption);
	LoginManager._$extend(c, LoginManager._loginOption);
	LoginManager._$extend(d, a);
	LoginManager._$extend(c, a);
	d.gameId || (d.gameId = LoginManager._comm.getGameId());
	d.appid || (d.appid = LoginManager._comm.getAppId(d.gameId));
	"function" == typeof b ? (e = !1, c.loginedCallback = function() {
		LoginManager._option.defLoginedCallback();
		b()
	}) : (e = c.needReloadPage, "function" != typeof c.loginedCallback && (c.loginedCallback = function() {
		LoginManager._option.defLoginedCallback()
	}));
	if ("float" == c.type) {
		c.needMaskDiv && LoginManager._cover.show();
		var g = function() {
			var a = LoginManager._coverdiv.getLoginDiv();
			LoginManager._coverdiv.setDivPosition(a, c.loginDivOffset)
		}
	} else if (null == document.getElementById(c.loginFrame)) return;
	if (e)
		if (d.s_url || (d.s_url = top.location.href), d.s_url == top.location.href && (d.s_url = d.s_url.replace(/#+.*$/, "")) && (d.s_url = location.protocol + "//" + location.host + "/comm-htdocs/login/loginSuccess.html?s_url=" + encodeURIComponent(d.s_url)), e = {
				appid: "",
				f_url: "",
				target: "self",
				qtarget: "self",
				s_url: "",
				no_verifyimg: 1,
				qlogin_jumpname: "jump",
				daid: 8,
				qlogin_param: "u1=" + d.s_url
			}, e = LoginManager._extend(e, d), "float" == c.type) {
			var f = {
				top: c.loginDivOffset.top,
				left: c.loginDivOffset.left,
				src: "https://xui.ptlogin2.qq.com/cgi-bin/xlogin?proxy_url="+location.protocol+"//game.qq.com/comm-htdocs/milo/proxy.html&" + LoginManager._getAllQueryStr(e)
			};
			LoginManager._coverdiv.openLoginDiv(f)
		} else e.style = 1, e.hide_title_bar = 1, e.hide_close_icon = 1, document.getElementById(c.loginFrame).src = "https://xui.ptlogin2.qq.com/cgi-bin/xlogin?proxy_url=" + location.protocol +"//game.qq.com/comm-htdocs/milo/proxy.html&" + LoginManager._getAllQueryStr(e);
	else {
		var l = function() {
			c.needMaskDiv && LoginManager._cover.show();
			LoginManager._coverdiv.openPromptDiv({
				top: c.loginDivOffset.top,
				left: c.loginDivOffset.left,
				msg: c.msg
			});
			var a = "jsonp" + LoginManager._randomInt(100);
			LoginManager._comm.callbackLoginInfo(a, function(a) {
				c.needMaskDiv && LoginManager._cover.hide();
				LoginManager._coverdiv.closePromptDiv();
				a.isLogin ? c.loginedCallback() : c.unloginCallback()
			});
			LoginManager._tool.createScript({
				url: LoginManager._comm.getCheckLoginUrl(d.gameId) + "?callback=" + a,
				charset: "gb2312",
				cache: !0,
				dataType: "function",
				dataTypeName: a,
				onLoadStartEvent: null,
				onLoadingEvent: null,
				onLoadSuccessEvent: function() {},
				onLoadErrorEvent: function() {},
				onLoadCompleteEvent: null
			});
			document.removeEventListener ? (window.removeEventListener("scroll", g, !1), window.removeEventListener("resize", g, !1)) : document.detachEvent && (window.detachEvent("onscroll", g), window.detachEvent("onresize", g))
		};
		d.s_url || (e = LoginManager._comm.getAppGameId(d.gameId), d.s_url = location.protocol+"//" + e + ".qq.com/comm-htdocs/login/logincallback.htm");
		e = {
			appid: "",
			f_url: "",
			target: "self",
			qtarget: "self",
			s_url: "",
			no_verifyimg: 1,
			daid: 8,
			qlogin_jumpname: "jump",
			qlogin_param: "u1=" + d.s_url
		};
		e = LoginManager._extend(e, d);
		f = {
			top: c.loginDivOffset.top,
			left: c.loginDivOffset.left,
			src: "https://xui.ptlogin2.qq.com/cgi-bin/xlogin?proxy_url="+location.protocol+"//game.qq.com/comm-htdocs/milo/proxy.html&" + LoginManager._getAllQueryStr(e)
		};
		window.LoginedCallback = function() {
			LoginManager._coverdiv.closeLoginDiv();
			c.needNickName ? l() : (LoginManager._cover.hide(), LoginManager._coverdiv.closePromptDiv(), c.loginedCallback())
		};
		"float" == c.type ? LoginManager._coverdiv.openLoginDiv(f) : (e.style = 1, e.hide_title_bar = 1, e.hide_close_icon = 1, document.getElementById(c.loginFrame).src = "https://xui.ptlogin2.qq.com/cgi-bin/xlogin?proxy_url="+location.protocol+"//game.qq.com/comm-htdocs/milo/proxy.html&" + LoginManager._getAllQueryStr(e))
	}
	"float" == c.type && (g(), document.addEventListener ? (window.addEventListener("scroll", g, !1), window.addEventListener("resize", g, !1)) : document.attachEvent && (window.attachEvent("onscroll", g), window.attachEvent("onresize", g)))
};
LoginManager.checkLogin = function(b, a, d) {
	var c = {
		gameId: "",
		onlyCookie: !1,
		loginedCallback: null,
		unloginCallback: null
	};
	LoginManager._$extend(c, LoginManager._option);
	LoginManager._$extend(c, LoginManager._checkOption);
	LoginManager._$extend(c, d);
	c.gameId || (c.gameId = LoginManager._comm.getGameId());
	"function" == typeof b ? c.loginedCallback = function() {
		LoginManager._option.defLoginedCallback();
		b()
	} : "function" != typeof c.loginedCallback && (c.loginedCallback = function() {
		LoginManager._option.defLoginedCallback()
	});
	"function" == typeof a ? c.unloginCallback = function() {
		LoginManager._option.defUnloginCallback();
		a()
	} : "function" != typeof c.unloginCallback && (c.unloginCallback = function() {
		LoginManager._option.defUnloginCallback()
	});
	LoginManager._comm.checkUserLogined() ? c.loginedCallback() : (d = "jsonp" + LoginManager._randomInt(100), LoginManager._comm.callbackLoginInfo(d, function(a) {
		LoginManager._DATATATATTA = a;
		LoginManager._______isRunFirst = 2;
		LoginManager._comm.checkUserLogined() ? c.loginedCallback() : c.unloginCallback()
	}), LoginManager.___ONLY_FUNCTION_ARRAY || (LoginManager.___ONLY_FUNCTION_ARRAY = []), "undefined" == typeof LoginManager._______isRunFirst && (LoginManager._______isRunFirst = 0), 0 != LoginManager._______isRunFirst ? LoginManager.___ONLY_FUNCTION_ARRAY.push(window[d]) : (LoginManager.___flag____ = setInterval(function() {
		if (2 == LoginManager._______isRunFirst) {
			clearInterval(LoginManager.___flag____);
			for (LoginManager.___flag____ = null; !(0 >= LoginManager.___ONLY_FUNCTION_ARRAY.length);) LoginManager.___ONLY_FUNCTION_ARRAY.shift()(LoginManager._DATATATATTA);
			LoginManager._______isRunFirst = 0
		}
	}, 10), LoginManager._______isRunFirst = 1, LoginManager._tool.createScript({
		url: LoginManager._comm.getCheckLoginUrl(c.gameId) + "?callback=" + d + "&game=" + c.gameId,
		charset: "gb2312",
		cache: !0,
		dataType: "function",
		dataTypeName: d,
		onLoadStartEvent: null,
		onLoadingEvent: null,
		onLoadSuccessEvent: function() {},
		onLoadErrorEvent: function() {},
		onLoadCompleteEvent: null
	})))
};
LoginManager.logout = function(b, a) {
	var d = {
		freshWin: "",
		jumpUrl: "",
		needMaskDiv: !0,
		msg: "\u4eb2\u7231\u7684\u7528\u6237\uff0c\u60a8\u5df2\u7ecf\u6ce8\u9500\u6210\u529f\uff01",
		loginDivOffset: {
			left: .5,
			top: .5
		},
		logoutCallback: null
	};
	LoginManager._$extend(d, LoginManager._option);
	LoginManager._$extend(d, LoginManager._logoutOption);
	LoginManager._$extend(d, a);
	"function" == typeof b ? d.logoutCallback = function() {
		LoginManager._option.defUnloginCallback();
		b()
	} : "function" != typeof d.logoutCallback && (d.logoutCallback = function() {
		LoginManager._option.defUnloginCallback()
	});
	d.needMaskDiv && LoginManager._cover.show();
	LoginManager._coverdiv.openPromptDiv({
		top: d.loginDivOffset.top,
		left: d.loginDivOffset.left,
		msg: d.msg
	});
	LoginManager._delCookie("IED_LOG_INFO2", "/", "qq.com");
	LoginManager._coverdiv.openLoginDiv({
		src: location.protocol+"//game.qq.com/act/logout.html?20121029",
		show: !1
	});
	window.logoutCallback = function() {
		d.logoutCallback();
		d.needMaskDiv && LoginManager._cover.hide();
		LoginManager._coverdiv.closePromptDiv();
		d.freshWin && (d.jumpUrl ? window[d.freshWin].location.href = d.jumpUrl : window[d.freshWin].location.reload())
	}
};
LoginManager.submitLogin = function(b) {
	var a = null,
		a = "function" != typeof b ? function() {
			LoginManager._option.defLoginedCallback()
		} : function() {
			LoginManager._option.defLoginedCallback();
			b()
		};
	LoginManager.checkLogin(function() {
		a()
	}, function() {
		LoginManager.login(function() {
			a()
		})
	})
};
LoginManager.reloadLogin = function(b, a) {
	var d = null,
		d = "function" != typeof b ? function() {
			LoginManager._option.defLoginedCallback()
		} : function() {
			LoginManager._option.defLoginedCallback();
			b()
		},
		c = function() {
			location.reload()
		};
	"function" == typeof a && (c = a);
	LoginManager.checkLogin(function() {
		d()
	}, function() {
		LoginManager.login(function() {
			c()
		})
	})
};
LoginManager.closeLogin = function(b) {
	if ("function" == typeof b) {
		LoginManager._ARRAY_CLOSE_LOGIN || (LoginManager._ARRAY_CLOSE_LOGIN = []);
		for (var a = !1, d = 0; d < LoginManager._ARRAY_CLOSE_LOGIN.length; d++)
			if (LoginManager._ARRAY_CLOSE_LOGIN[d] + "" == b + "") {
				a = !0;
				break
			}
		a || LoginManager._ARRAY_CLOSE_LOGIN.push(b)
	}
};
LoginManager.getUserFace = function(b) {
	if ("function" == typeof b) {
		var a = {
			isLogin: !1,
			userFace: location.protocol+"//imgcache.qq.com/ptlogin/v4/style/0/images/1.gif"
		};
		LoginManager.checkLogin(function() {
			a.isLogin = !0;
			var d = LoginManager._comm.getGameId(),
				d = LoginManager._comm.getAppId(d),
				c = LoginManager.getUserUin();
			window.pt = {};
			pt.setHeader = function(d) {
				d[c] && (a.userFace = d[c]);
				b(a)
			};
			LoginManager._tool.createScript({
				url: location.protocol+"//ptlogin2.qq.com/getface?appid=" + d + "&imgtype=3&encrytype=0&devtype=0&keytpye=0&uin=" + c,
				charset: "gb2312",
				cache: !1,
				dataType: "function",
				onLoadStartEvent: null,
				onLoadingEvent: null,
				onLoadSuccessEvent: function() {},
				onLoadErrorEvent: function() {
					b(a)
				},
				onLoadCompleteEvent: null
			})
		}, function() {
			b(a)
		})
	}
};
LoginManager._option = {
	gameId: "",
	defLoginedCallback: function() {
		try {
			LoginManager._$E("unlogin") && (LoginManager._$E("unlogin").style.display = "none"), LoginManager._$E("logined") && (LoginManager._$E("logined").style.display = "block")
		} catch (b) {}
	},
	defUnloginCallback: function() {
		try {
			LoginManager._$E("logined") && (LoginManager._$E("logined").style.display = "none"), LoginManager._$E("unlogin") && (LoginManager._$E("unlogin").style.display = "block")
		} catch (b) {}
	}
};
LoginManager._loginOption = {
	needMaskDiv: !0,
	needNickName: !0,
	appid: "",
	loginDivOffset: {
		left: .5,
		top: .5
	}
};
LoginManager._checkOption = {
	onlyCookie: !1
};
LoginManager._logoutOption = {
	freshWin: "",
	jumpUrl: "",
	needMaskDiv: !0,
	loginDivOffset: {
		left: .5,
		top: .5
	}
};
LoginManager._setOption = function(b) {
	var a = LoginManager._setOption.caller;
	a == LoginManager.login ? (LoginManager._$extend(LoginManager._option, b), LoginManager._$extend(LoginManager._loginOption, b)) : a == LoginManager.checkLogin ? (LoginManager._$extend(LoginManager._option, b), LoginManager._$extend(LoginManager._checkOption, b)) : LoginManager._$extend(LoginManager._option, b)
};

function ptlogin2_onClose() {
	if (LoginManager._ARRAY_CLOSE_LOGIN) {
		for (var b = !0, a = 0; a < LoginManager._ARRAY_CLOSE_LOGIN.length; a++) b = LoginManager._ARRAY_CLOSE_LOGIN[a]();
		if (!b) return
	}
	LoginManager._coverdiv.closeLoginDiv();
	LoginManager._cover.hide()
}
var ptlogin2_onClose_v3 = ptlogin2_onClose;

function ptlogin2_onResize(b, a) {
	if (login_wnd = document.getElementById("loginDiv")) login_wnd.style.width = b + "px", login_wnd.style.height = a + "px", login_wnd.style.visibility = "hidden", login_wnd.style.visibility = "visible"
}
"undefined" !== typeof window.postMessage && (window.onmessage = function(b) {
	b = b || window.event;
	if ("https://xui.ptlogin2.qq.com" == b.origin) switch (b = "undefined" !== typeof JSON ? JSON.parse(b.data) : str2JSON(b.data), b.action) {
		case "close":
			ptlogin2_onClose();
			break;
		case "resize":
			ptlogin2_onResize(b.width, b.height)
	}
});

function str2JSON(b) {
	eval("var __pt_json=" + b);
	return __pt_json
}
LoginManager._init = function() {
	var b = {
			gameId: "",
			onlyCookie: 0,
			needMaskDiv: 1,
			needReloadPage: 1
		},
		a;
	a: {
		a = document.getElementsByTagName("script");
		for (var d = 0; d < a.length; d++) {
			var c = a[d].src;
			if (c && 0 <= c.toLowerCase().indexOf("loginmanager")) {
				a = c;
				break a
			}
		}
		a = ""
	}
	a && (a = LoginManager._getAllQuery(a), b = LoginManager._extend(b, a), b.gameId && (LoginManager._option.gameId = b.gameId), LoginManager._checkOption.onlyCookie = 0 == b.onlyCookie ? !1 : !0, 0 == b.needMaskDiv ? (LoginManager._loginOption.needMaskDiv = !1, LoginManager._logoutOption.needMaskDiv = !1) : (LoginManager._loginOption.needMaskDiv = !0, LoginManager._logoutOption.needMaskDiv = !0), LoginManager._loginOption.needReloadPage = 0 == b.needReloadPage ? !1 : !0);
	LoginManager._isLoaded = !0
};
LoginManager._isLoaded || LoginManager._init(); 

//for old js offline
!function(adtag){
	function loadJS(url,callback){
		var head=document.head || document.getElementsByTagName('head')[0] || document.documentElement,script,options;
		if(typeof url ==='object'){
			options=url;
			url=undefined;
		}
		var s=options || {};
		url=url || s.url;
		callback =callback || s.success;
		script=document.createElement('script');
		script.async=s.async || false;
		script.type='text/javascript';
		if(s.charset){
			script.charset=s.charset;
		}
		url=url+(/\?/.test(url)?"&":"?")+"_="+(new Date()).getTime();
		script.src=url;
		head.insertBefore(script,head.firstChild);
		if(callback){
	      document.addEventListener?script.addEventListener('load',callback,false):script.onreadystatechange=function(){
				if(/loaded|complete/.test(script.readyState)){
					script.onreadystatechange=null;
	                callback();
				}
			}
		}
	}

	if(typeof EAS != 'undefined' && 'function'== typeof EAS.SendClick){
		EAS.SendClick({'e_c': 'miloold_'+adtag,'c_t':4});
	}else{
		loadJS(location.protocol + '//ossweb-img.qq.com/images/js/eas/eas.js',function(){
			EAS.SendClick({'e_c': 'miloold_'+adtag,'c_t':4});
		});
	}
	//judge whitelist
	if('object' == typeof miloMonitor && 'function' == typeof miloMonitor.judgeWhiteList){
		miloMonitor.judgeWhiteList('miloold_'+adtag);
	}else{
		loadJS({charset:'gbk',url:location.protocol+'//ossweb-img.qq.com/images/js/monitorOld.js'},function(){
			miloMonitor.judgeWhiteList('miloold_'+adtag);
		})
	}
}('loginv3');
/*  |xGv00|34687e8f2f87552335f492567f3022a6 */