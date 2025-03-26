/**
 * @author: parkerzhu
 * @project: Õ®”√∑÷œÌ
 */
jQuery.fn.imageScroller = function (a) {
    a = $.extend({}, {
        next: "buttonNext",
        prev: "buttonPrev",
        frame: "viewerFrame",
        width: 100,
        height: 100,
        interval: 3E3,
        child: "a",
        dir: "horizontal",
        auto: true
    }, a);
    var f = $("#" + a.next),
        g = $("#" + a.prev),
        b = $("#" + a.frame),
        k = a.width || 100,
        l = a.height || 100,
        m = a.child,
        d = a.dir || "horizontal",
        c = a.auto,
        h, n = a.interval || 3E3,
        e = function () {
            g.unbind("click", e);
            c && window.clearInterval(h);
            b.animate(d == "horizontal" ? {
                marginLeft: -k
            } : {
                marginTop: -l
            }, "fast", "", function () {
                b.find(m + ":first").appendTo(b);
                d == "horizontal" ? b.css("marginLeft", 0) : b.css("marginTop", 0);
                g.bind("click", e);
                c && i()
            });
            return false;
        },
        j = function () {
            f.unbind("click", j);
            c && window.clearInterval(h);
            d == "horizontal" ? b.css("marginLeft", -k) : b.css("marginTop", -l);
            b.animate(d == "horizontal" ? {
                marginLeft: 0
            } : {
                marginTop: 0
            }, "fast", "", function () {
                b.find(m + ":last").prependTo(b);
                f.bind("click", j);
                c && i()
            });
            return false;
        };
    f.css("cursor", "hand").click(j);
    g.css("cursor", "hand").click(e);
    var i = function () {
            h = window.setInterval(e, n)
        };
    c && i();
    this.Prev = e;
    this.Next = f;
    return this;
} /*  |xGv00|c3b3d410a31b263d1df120d143892703 */