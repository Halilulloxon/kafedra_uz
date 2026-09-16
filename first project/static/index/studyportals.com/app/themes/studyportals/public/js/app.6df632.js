(self.webpackChunk_roots_bud_sage = self.webpackChunk_roots_bud_sage || []).push([
    [143], {
        "../node_modules/headroom.js/dist/headroom.js": function(t) {
            t.exports = function() {
                "use strict";

                function t() {
                    return "undefined" != typeof window
                }

                function e() {
                    var t = !1;
                    try {
                        var e = {
                            get passive() {
                                t = !0
                            }
                        };
                        window.addEventListener("test", e, e), window.removeEventListener("test", e, e)
                    } catch (e) {
                        t = !1
                    }
                    return t
                }

                function s() {
                    return !!(t() && function() {}.bind && "classList" in document.documentElement && Object.assign && Object.keys && requestAnimationFrame)
                }

                function i(t) {
                    return 9 === t.nodeType
                }

                function n(t) {
                    return t && t.document && i(t.document)
                }

                function r(t) {
                    var e = t.document,
                        s = e.body,
                        i = e.documentElement;
                    return {
                        scrollHeight: function() {
                            return Math.max(s.scrollHeight, i.scrollHeight, s.offsetHeight, i.offsetHeight, s.clientHeight, i.clientHeight)
                        },
                        height: function() {
                            return t.innerHeight || i.clientHeight || s.clientHeight
                        },
                        scrollY: function() {
                            return void 0 !== t.pageYOffset ? t.pageYOffset : (i || s.parentNode || s).scrollTop
                        }
                    }
                }

                function a(t) {
                    return {
                        scrollHeight: function() {
                            return Math.max(t.scrollHeight, t.offsetHeight, t.clientHeight)
                        },
                        height: function() {
                            return Math.max(t.offsetHeight, t.clientHeight)
                        },
                        scrollY: function() {
                            return t.scrollTop
                        }
                    }
                }

                function o(t) {
                    return n(t) ? r(t) : a(t)
                }

                function l(t, s, i) {
                    var n, r = e(),
                        a = !1,
                        l = o(t),
                        c = l.scrollY(),
                        h = {};

                    function u() {
                        var t = Math.round(l.scrollY()),
                            e = l.height(),
                            n = l.scrollHeight();
                        h.scrollY = t, h.lastScrollY = c, h.direction = t > c ? "down" : "up", h.distance = Math.abs(t - c), h.isOutOfBounds = t < 0 || t + e > n, h.top = t <= s.offset[h.direction], h.bottom = t + e >= n, h.toleranceExceeded = h.distance > s.tolerance[h.direction], i(h), c = t, a = !1
                    }

                    function d() {
                        a || (a = !0, n = requestAnimationFrame(u))
                    }
                    var p = !!r && {
                        passive: !0,
                        capture: !1
                    };
                    return t.addEventListener("scroll", d, p), u(), {
                        destroy: function() {
                            cancelAnimationFrame(n), t.removeEventListener("scroll", d, p)
                        }
                    }
                }

                function c(t) {
                    return t === Object(t) ? t : {
                        down: t,
                        up: t
                    }
                }

                function h(t, e) {
                    e = e || {}, Object.assign(this, h.options, e), this.classes = Object.assign({}, h.options.classes, e.classes), this.elem = t, this.tolerance = c(this.tolerance), this.offset = c(this.offset), this.initialised = !1, this.frozen = !1
                }
                return h.prototype = {
                    constructor: h,
                    init: function() {
                        return h.cutsTheMustard && !this.initialised && (this.addClass("initial"), this.initialised = !0, setTimeout((function(t) {
                            t.scrollTracker = l(t.scroller, {
                                offset: t.offset,
                                tolerance: t.tolerance
                            }, t.update.bind(t))
                        }), 100, this)), this
                    },
                    destroy: function() {
                        this.initialised = !1, Object.keys(this.classes).forEach(this.removeClass, this), this.scrollTracker.destroy()
                    },
                    unpin: function() {
                        !this.hasClass("pinned") && this.hasClass("unpinned") || (this.addClass("unpinned"), this.removeClass("pinned"), this.onUnpin && this.onUnpin.call(this))
                    },
                    pin: function() {
                        this.hasClass("unpinned") && (this.addClass("pinned"), this.removeClass("unpinned"), this.onPin && this.onPin.call(this))
                    },
                    freeze: function() {
                        this.frozen = !0, this.addClass("frozen")
                    },
                    unfreeze: function() {
                        this.frozen = !1, this.removeClass("frozen")
                    },
                    top: function() {
                        this.hasClass("top") || (this.addClass("top"), this.removeClass("notTop"), this.onTop && this.onTop.call(this))
                    },
                    notTop: function() {
                        this.hasClass("notTop") || (this.addClass("notTop"), this.removeClass("top"), this.onNotTop && this.onNotTop.call(this))
                    },
                    bottom: function() {
                        this.hasClass("bottom") || (this.addClass("bottom"), this.removeClass("notBottom"), this.onBottom && this.onBottom.call(this))
                    },
                    notBottom: function() {
                        this.hasClass("notBottom") || (this.addClass("notBottom"), this.removeClass("bottom"), this.onNotBottom && this.onNotBottom.call(this))
                    },
                    shouldUnpin: function(t) {
                        return "down" === t.direction && !t.top && t.toleranceExceeded
                    },
                    shouldPin: function(t) {
                        return "up" === t.direction && t.toleranceExceeded || t.top
                    },
                    addClass: function(t) {
                        this.elem.classList.add.apply(this.elem.classList, this.classes[t].split(" "))
                    },
                    removeClass: function(t) {
                        this.elem.classList.remove.apply(this.elem.classList, this.classes[t].split(" "))
                    },
                    hasClass: function(t) {
                        return this.classes[t].split(" ").every((function(t) {
                            return this.classList.contains(t)
                        }), this.elem)
                    },
                    update: function(t) {
                        t.isOutOfBounds || !0 !== this.frozen && (t.top ? this.top() : this.notTop(), t.bottom ? this.bottom() : this.notBottom(), this.shouldUnpin(t) ? this.unpin() : this.shouldPin(t) && this.pin())
                    }
                }, h.options = {
                    tolerance: {
                        up: 0,
                        down: 0
                    },
                    offset: 0,
                    scroller: t() ? window : null,
                    classes: {
                        frozen: "headroom--frozen",
                        pinned: "headroom--pinned",
                        unpinned: "headroom--unpinned",
                        top: "headroom--top",
                        notTop: "headroom--not-top",
                        bottom: "headroom--bottom",
                        notBottom: "headroom--not-bottom",
                        initial: "headroom"
                    }
                }, h.cutsTheMustard = s(), h
            }()
        },
        "../node_modules/lazysizes/lazysizes.js": t => {
            ! function(e, s) {
                var i = function(t, e, s) {
                    "use strict";
                    var i, n;
                    if (function() {
                            var e, s = {
                                lazyClass: "lazyload",
                                loadedClass: "lazyloaded",
                                loadingClass: "lazyloading",
                                preloadClass: "lazypreload",
                                errorClass: "lazyerror",
                                autosizesClass: "lazyautosizes",
                                fastLoadedClass: "ls-is-cached",
                                iframeLoadMode: 0,
                                srcAttr: "data-src",
                                srcsetAttr: "data-srcset",
                                sizesAttr: "data-sizes",
                                minSize: 40,
                                customMedia: {},
                                init: !0,
                                expFactor: 1.5,
                                hFac: .8,
                                loadMode: 2,
                                loadHidden: !0,
                                ricTimeout: 0,
                                throttleDelay: 125
                            };
                            for (e in n = t.lazySizesConfig || t.lazysizesConfig || {}, s) e in n || (n[e] = s[e])
                        }(), !e || !e.getElementsByClassName) return {
                        init: function() {},
                        cfg: n,
                        noSupport: !0
                    };
                    var r = e.documentElement,
                        a = t.HTMLPictureElement,
                        o = "addEventListener",
                        l = "getAttribute",
                        c = t[o].bind(t),
                        h = t.setTimeout,
                        u = t.requestAnimationFrame || h,
                        d = t.requestIdleCallback,
                        p = /^picture$/i,
                        f = ["load", "error", "lazyincluded", "_lazyloaded"],
                        m = {},
                        g = Array.prototype.forEach,
                        v = function(t, e) {
                            return m[e] || (m[e] = new RegExp("(\\s|^)" + e + "(\\s|$)")), m[e].test(t[l]("class") || "") && m[e]
                        },
                        b = function(t, e) {
                            v(t, e) || t.setAttribute("class", (t[l]("class") || "").trim() + " " + e)
                        },
                        y = function(t, e) {
                            var s;
                            (s = v(t, e)) && t.setAttribute("class", (t[l]("class") || "").replace(s, " "))
                        },
                        w = function(t, e, s) {
                            var i = s ? o : "removeEventListener";
                            s && w(t, e), f.forEach((function(s) {
                                t[i](s, e)
                            }))
                        },
                        T = function(t, s, n, r, a) {
                            var o = e.createEvent("Event");
                            return n || (n = {}), n.instance = i, o.initEvent(s, !r, !a), o.detail = n, t.dispatchEvent(o), o
                        },
                        _ = function(e, s) {
                            var i;
                            !a && (i = t.picturefill || n.pf) ? (s && s.src && !e[l]("srcset") && e.setAttribute("srcset", s.src), i({
                                reevaluate: !0,
                                elements: [e]
                            })) : s && s.src && (e.src = s.src)
                        },
                        k = function(t, e) {
                            return (getComputedStyle(t, null) || {})[e]
                        },
                        x = function(t, e, s) {
                            for (s = s || t.offsetWidth; s < n.minSize && e && !t._lazysizesWidth;) s = e.offsetWidth, e = e.parentNode;
                            return s
                        },
                        S = (bt = [], yt = [], wt = bt, Tt = function() {
                            var t = wt;
                            for (wt = bt.length ? yt : bt, gt = !0, vt = !1; t.length;) t.shift()();
                            gt = !1
                        }, _t = function(t, s) {
                            gt && !s ? t.apply(this, arguments) : (wt.push(t), vt || (vt = !0, (e.hidden ? h : u)(Tt)))
                        }, _t._lsFlush = Tt, _t),
                        E = function(t, e) {
                            return e ? function() {
                                S(t)
                            } : function() {
                                var e = this,
                                    s = arguments;
                                S((function() {
                                    t.apply(e, s)
                                }))
                            }
                        },
                        $ = function(t) {
                            var e, i = 0,
                                r = n.throttleDelay,
                                a = n.ricTimeout,
                                o = function() {
                                    e = !1, i = s.now(), t()
                                },
                                l = d && a > 49 ? function() {
                                    d(o, {
                                        timeout: a
                                    }), a !== n.ricTimeout && (a = n.ricTimeout)
                                } : E((function() {
                                    h(o)
                                }), !0);
                            return function(t) {
                                var n;
                                (t = !0 === t) && (a = 33), e || (e = !0, (n = r - (s.now() - i)) < 0 && (n = 0), t || n < 9 ? l() : h(l, n))
                            }
                        },
                        C = function(t) {
                            var e, i, n = 99,
                                r = function() {
                                    e = null, t()
                                },
                                a = function() {
                                    var t = s.now() - i;
                                    t < n ? h(a, n - t) : (d || r)(r)
                                };
                            return function() {
                                i = s.now(), e || (e = h(a, n))
                            }
                        },
                        M = (Y = /^img$/i, X = /^iframe$/i, Q = "onscroll" in t && !/(gle|ing)bot/.test(navigator.userAgent), K = 0, J = 0, Z = 0, tt = -1, et = function(t) {
                            Z--, (!t || Z < 0 || !t.target) && (Z = 0)
                        }, st = function(t) {
                            return null == U && (U = "hidden" == k(e.body, "visibility")), U || !("hidden" == k(t.parentNode, "visibility") && "hidden" == k(t, "visibility"))
                        }, it = function(t, s) {
                            var i, n = t,
                                a = st(t);
                            for (N -= s, W += s, H -= s, G += s; a && (n = n.offsetParent) && n != e.body && n != r;)(a = (k(n, "opacity") || 1) > 0) && "visible" != k(n, "overflow") && (i = n.getBoundingClientRect(), a = G > i.left && H < i.right && W > i.top - 1 && N < i.bottom + 1);
                            return a
                        }, nt = function() {
                            var t, s, a, o, c, h, u, d, p, f, m, g, v = i.elements;
                            if ((j = n.loadMode) && Z < 8 && (t = v.length)) {
                                for (s = 0, tt++; s < t; s++)
                                    if (v[s] && !v[s]._lazyRace)
                                        if (!Q || i.prematureUnveil && i.prematureUnveil(v[s])) dt(v[s]);
                                        else if ((d = v[s][l]("data-expand")) && (h = 1 * d) || (h = J), f || (f = !n.expand || n.expand < 1 ? r.clientHeight > 500 && r.clientWidth > 500 ? 500 : 370 : n.expand, i._defEx = f, m = f * n.expFactor, g = n.hFac, U = null, J < m && Z < 1 && tt > 2 && j > 2 && !e.hidden ? (J = m, tt = 0) : J = j > 1 && tt > 1 && Z < 6 ? f : K), p !== h && (R = innerWidth + h * g, B = innerHeight + h, u = -1 * h, p = h), a = v[s].getBoundingClientRect(), (W = a.bottom) >= u && (N = a.top) <= B && (G = a.right) >= u * g && (H = a.left) <= R && (W || G || H || N) && (n.loadHidden || st(v[s])) && (z && Z < 3 && !d && (j < 3 || tt < 4) || it(v[s], h))) {
                                    if (dt(v[s]), c = !0, Z > 9) break
                                } else !c && z && !o && Z < 4 && tt < 4 && j > 2 && (D[0] || n.preloadAfterLoad) && (D[0] || !d && (W || G || H || N || "auto" != v[s][l](n.sizesAttr))) && (o = D[0] || v[s]);
                                o && !c && dt(o)
                            }
                        }, rt = $(nt), at = function(t) {
                            var e = t.target;
                            e._lazyCache ? delete e._lazyCache : (et(t), b(e, n.loadedClass), y(e, n.loadingClass), w(e, lt), T(e, "lazyloaded"))
                        }, ot = E(at), lt = function(t) {
                            ot({
                                target: t.target
                            })
                        }, ct = function(t, e) {
                            var s = t.getAttribute("data-load-mode") || n.iframeLoadMode;
                            0 == s ? t.contentWindow.location.replace(e) : 1 == s && (t.src = e)
                        }, ht = function(t) {
                            var e, s = t[l](n.srcsetAttr);
                            (e = n.customMedia[t[l]("data-media") || t[l]("media")]) && t.setAttribute("media", e), s && t.setAttribute("srcset", s)
                        }, ut = E((function(t, e, s, i, r) {
                            var a, o, c, u, d, f;
                            (d = T(t, "lazybeforeunveil", e)).defaultPrevented || (i && (s ? b(t, n.autosizesClass) : t.setAttribute("sizes", i)), o = t[l](n.srcsetAttr), a = t[l](n.srcAttr), r && (u = (c = t.parentNode) && p.test(c.nodeName || "")), f = e.firesLoad || "src" in t && (o || a || u), d = {
                                target: t
                            }, b(t, n.loadingClass), f && (clearTimeout(V), V = h(et, 2500), w(t, lt, !0)), u && g.call(c.getElementsByTagName("source"), ht), o ? t.setAttribute("srcset", o) : a && !u && (X.test(t.nodeName) ? ct(t, a) : t.src = a), r && (o || u) && _(t, {
                                src: a
                            })), t._lazyRace && delete t._lazyRace, y(t, n.lazyClass), S((function() {
                                var e = t.complete && t.naturalWidth > 1;
                                f && !e || (e && b(t, n.fastLoadedClass), at(d), t._lazyCache = !0, h((function() {
                                    "_lazyCache" in t && delete t._lazyCache
                                }), 9)), "lazy" == t.loading && Z--
                            }), !0)
                        })), dt = function(t) {
                            if (!t._lazyRace) {
                                var e, s = Y.test(t.nodeName),
                                    i = s && (t[l](n.sizesAttr) || t[l]("sizes")),
                                    r = "auto" == i;
                                (!r && z || !s || !t[l]("src") && !t.srcset || t.complete || v(t, n.errorClass) || !v(t, n.lazyClass)) && (e = T(t, "lazyunveilread").detail, r && P.updateElem(t, !0, t.offsetWidth), t._lazyRace = !0, Z++, ut(t, e, r, i, s))
                            }
                        }, pt = C((function() {
                            n.loadMode = 3, rt()
                        })), ft = function() {
                            3 == n.loadMode && (n.loadMode = 2), pt()
                        }, mt = function() {
                            z || (s.now() - F < 999 ? h(mt, 999) : (z = !0, n.loadMode = 3, rt(), c("scroll", ft, !0)))
                        }, {
                            _: function() {
                                F = s.now(), i.elements = e.getElementsByClassName(n.lazyClass), D = e.getElementsByClassName(n.lazyClass + " " + n.preloadClass), c("scroll", rt, !0), c("resize", rt, !0), c("pageshow", (function(t) {
                                    if (t.persisted) {
                                        var s = e.querySelectorAll("." + n.loadingClass);
                                        s.length && s.forEach && u((function() {
                                            s.forEach((function(t) {
                                                t.complete && dt(t)
                                            }))
                                        }))
                                    }
                                })), t.MutationObserver ? new MutationObserver(rt).observe(r, {
                                    childList: !0,
                                    subtree: !0,
                                    attributes: !0
                                }) : (r[o]("DOMNodeInserted", rt, !0), r[o]("DOMAttrModified", rt, !0), setInterval(rt, 999)), c("hashchange", rt, !0), ["focus", "mouseover", "click", "load", "transitionend", "animationend"].forEach((function(t) {
                                    e[o](t, rt, !0)
                                })), /d$|^c/.test(e.readyState) ? mt() : (c("load", mt), e[o]("DOMContentLoaded", rt), h(mt, 2e4)), i.elements.length ? (nt(), S._lsFlush()) : rt()
                            },
                            checkElems: rt,
                            unveil: dt,
                            _aLSL: ft
                        }),
                        P = (O = E((function(t, e, s, i) {
                            var n, r, a;
                            if (t._lazysizesWidth = i, i += "px", t.setAttribute("sizes", i), p.test(e.nodeName || ""))
                                for (r = 0, a = (n = e.getElementsByTagName("source")).length; r < a; r++) n[r].setAttribute("sizes", i);
                            s.detail.dataAttr || _(t, s.detail)
                        })), I = function(t, e, s) {
                            var i, n = t.parentNode;
                            n && (s = x(t, n, s), (i = T(t, "lazybeforesizes", {
                                width: s,
                                dataAttr: !!e
                            })).defaultPrevented || (s = i.detail.width) && s !== t._lazysizesWidth && O(t, n, i, s))
                        }, q = C((function() {
                            var t, e = L.length;
                            if (e)
                                for (t = 0; t < e; t++) I(L[t])
                        })), {
                            _: function() {
                                L = e.getElementsByClassName(n.autosizesClass), c("resize", q)
                            },
                            checkElems: q,
                            updateElem: I
                        }),
                        A = function() {
                            !A.i && e.getElementsByClassName && (A.i = !0, P._(), M._())
                        };
                    var L, O, I, q;
                    var D, z, V, j, F, R, B, N, H, G, W, U, Y, X, Q, K, J, Z, tt, et, st, it, nt, rt, at, ot, lt, ct, ht, ut, dt, pt, ft, mt;
                    var gt, vt, bt, yt, wt, Tt, _t;
                    return h((function() {
                        n.init && A()
                    })), i = {
                        cfg: n,
                        autoSizer: P,
                        loader: M,
                        init: A,
                        uP: _,
                        aC: b,
                        rC: y,
                        hC: v,
                        fire: T,
                        gW: x,
                        rAF: S
                    }
                }(e, e.document, Date);
                e.lazySizes = i, t.exports && (t.exports = i)
            }("undefined" != typeof window ? window : {})
        },
        "./styles/app.css": () => {},
        "../node_modules/sharer.js/sharer.js": () => {
            ! function(t, e) {
                "use strict";
                var s = function(t) {
                    this.elem = t
                };
                s.init = function() {
                    var t, i = e.querySelectorAll("[data-sharer]"),
                        n = i.length;
                    for (t = 0; t < n; t++) i[t].addEventListener("click", s.add)
                }, s.add = function(t) {
                    var e = t.currentTarget || t.srcElement;
                    new s(e).share()
                }, s.prototype = {
                    constructor: s,
                    getValue: function(t) {
                        var e = this.elem.getAttribute("data-" + t);
                        return e && "hashtag" === t && (e.startsWith("#") || (e = "#" + e)), null === e ? "" : e
                    },
                    share: function() {
                        var t = this.getValue("sharer").toLowerCase(),
                            e = {
                                facebook: {
                                    shareUrl: "https://www.facebook.com/sharer/sharer.php",
                                    params: {
                                        u: this.getValue("url"),
                                        hashtag: this.getValue("hashtag"),
                                        quote: this.getValue("quote")
                                    }
                                },
                                linkedin: {
                                    shareUrl: "https://www.linkedin.com/shareArticle",
                                    params: {
                                        url: this.getValue("url"),
                                        mini: !0
                                    }
                                },
                                twitter: {
                                    shareUrl: "https://twitter.com/intent/tweet",
                                    params: {
                                        text: this.getValue("title"),
                                        url: this.getValue("url"),
                                        hashtags: this.getValue("hashtags"),
                                        via: this.getValue("via"),
                                        related: this.getValue("related"),
                                        in_reply_to: this.getValue("in_reply_to")
                                    }
                                },
                                x: {
                                    shareUrl: "https://x.com/intent/tweet",
                                    params: {
                                        text: this.getValue("title"),
                                        url: this.getValue("url"),
                                        hashtags: this.getValue("hashtags"),
                                        via: this.getValue("via"),
                                        related: this.getValue("related"),
                                        in_reply_to: this.getValue("in_reply_to")
                                    }
                                },
                                threads: {
                                    shareUrl: "https://threads.net/intent/post",
                                    params: {
                                        text: this.getValue("title") + " " + this.getValue("url")
                                    }
                                },
                                email: {
                                    shareUrl: "mailto:" + this.getValue("to"),
                                    params: {
                                        subject: this.getValue("subject"),
                                        body: this.getValue("title") + "\n" + this.getValue("url")
                                    }
                                },
                                whatsapp: {
                                    shareUrl: "true" === this.getValue("web") ? "https://web.whatsapp.com/send" : "https://wa.me/",
                                    params: {
                                        phone: this.getValue("to"),
                                        text: this.getValue("title") + " " + this.getValue("url")
                                    }
                                },
                                telegram: {
                                    shareUrl: "https://t.me/share",
                                    params: {
                                        text: this.getValue("title"),
                                        url: this.getValue("url")
                                    }
                                },
                                viber: {
                                    shareUrl: "viber://forward",
                                    params: {
                                        text: this.getValue("title") + " " + this.getValue("url")
                                    }
                                },
                                line: {
                                    shareUrl: "http://line.me/R/msg/text/?" + encodeURIComponent(this.getValue("title") + " " + this.getValue("url"))
                                },
                                pinterest: {
                                    shareUrl: "https://www.pinterest.com/pin/create/button/",
                                    params: {
                                        url: this.getValue("url"),
                                        media: this.getValue("image"),
                                        description: this.getValue("description")
                                    }
                                },
                                tumblr: {
                                    shareUrl: "http://tumblr.com/widgets/share/tool",
                                    params: {
                                        canonicalUrl: this.getValue("url"),
                                        content: this.getValue("url"),
                                        posttype: "link",
                                        title: this.getValue("title"),
                                        caption: this.getValue("caption"),
                                        tags: this.getValue("tags")
                                    }
                                },
                                hackernews: {
                                    shareUrl: "https://news.ycombinator.com/submitlink",
                                    params: {
                                        u: this.getValue("url"),
                                        t: this.getValue("title")
                                    }
                                },
                                reddit: {
                                    shareUrl: "https://www.reddit.com/submit",
                                    params: {
                                        url: this.getValue("url"),
                                        title: this.getValue("title")
                                    }
                                },
                                vk: {
                                    shareUrl: "http://vk.com/share.php",
                                    params: {
                                        url: this.getValue("url"),
                                        title: this.getValue("title"),
                                        description: this.getValue("caption"),
                                        image: this.getValue("image")
                                    }
                                },
                                xing: {
                                    shareUrl: "https://www.xing.com/social/share/spi",
                                    params: {
                                        url: this.getValue("url")
                                    }
                                },
                                buffer: {
                                    shareUrl: "https://buffer.com/add",
                                    params: {
                                        url: this.getValue("url"),
                                        title: this.getValue("title"),
                                        via: this.getValue("via"),
                                        picture: this.getValue("picture")
                                    }
                                },
                                instapaper: {
                                    shareUrl: "http://www.instapaper.com/edit",
                                    params: {
                                        url: this.getValue("url"),
                                        title: this.getValue("title"),
                                        description: this.getValue("description")
                                    }
                                },
                                pocket: {
                                    shareUrl: "https://getpocket.com/save",
                                    params: {
                                        url: this.getValue("url")
                                    }
                                },
                                mashable: {
                                    shareUrl: "https://mashable.com/submit",
                                    params: {
                                        url: this.getValue("url"),
                                        title: this.getValue("title")
                                    }
                                },
                                mix: {
                                    shareUrl: "https://mix.com/add",
                                    params: {
                                        url: this.getValue("url")
                                    }
                                },
                                flipboard: {
                                    shareUrl: "https://share.flipboard.com/bookmarklet/popout",
                                    params: {
                                        v: 2,
                                        title: this.getValue("title"),
                                        url: this.getValue("url"),
                                        t: Date.now()
                                    }
                                },
                                weibo: {
                                    shareUrl: "http://service.weibo.com/share/share.php",
                                    params: {
                                        url: this.getValue("url"),
                                        title: this.getValue("title"),
                                        pic: this.getValue("image"),
                                        appkey: this.getValue("appkey"),
                                        ralateUid: this.getValue("ralateuid"),
                                        language: "zh_cn"
                                    }
                                },
                                blogger: {
                                    shareUrl: "https://www.blogger.com/blog-this.g",
                                    params: {
                                        u: this.getValue("url"),
                                        n: this.getValue("title"),
                                        t: this.getValue("description")
                                    }
                                },
                                baidu: {
                                    shareUrl: "http://cang.baidu.com/do/add",
                                    params: {
                                        it: this.getValue("title"),
                                        iu: this.getValue("url")
                                    }
                                },
                                douban: {
                                    shareUrl: "https://www.douban.com/share/service",
                                    params: {
                                        name: this.getValue("name"),
                                        href: this.getValue("url"),
                                        image: this.getValue("image"),
                                        comment: this.getValue("description")
                                    }
                                },
                                okru: {
                                    shareUrl: "https://connect.ok.ru/dk",
                                    params: {
                                        "st.cmd": "WidgetSharePreview",
                                        "st.shareUrl": this.getValue("url"),
                                        title: this.getValue("title")
                                    }
                                },
                                mailru: {
                                    shareUrl: "http://connect.mail.ru/share",
                                    params: {
                                        share_url: this.getValue("url"),
                                        linkname: this.getValue("title"),
                                        linknote: this.getValue("description"),
                                        type: "page"
                                    }
                                },
                                evernote: {
                                    shareUrl: "https://www.evernote.com/clip.action",
                                    params: {
                                        url: this.getValue("url"),
                                        title: this.getValue("title")
                                    }
                                },
                                skype: {
                                    shareUrl: "https://web.skype.com/share",
                                    params: {
                                        url: this.getValue("url"),
                                        title: this.getValue("title")
                                    }
                                },
                                delicious: {
                                    shareUrl: "https://del.icio.us/post",
                                    params: {
                                        url: this.getValue("url"),
                                        title: this.getValue("title")
                                    }
                                },
                                sms: {
                                    shareUrl: "sms://",
                                    params: {
                                        body: this.getValue("body")
                                    }
                                },
                                trello: {
                                    shareUrl: "https://trello.com/add-card",
                                    params: {
                                        url: this.getValue("url"),
                                        name: this.getValue("title"),
                                        desc: this.getValue("description"),
                                        mode: "popup"
                                    }
                                },
                                messenger: {
                                    shareUrl: "fb-messenger://share",
                                    params: {
                                        link: this.getValue("url")
                                    }
                                },
                                odnoklassniki: {
                                    shareUrl: "https://connect.ok.ru/dk",
                                    params: {
                                        st: {
                                            cmd: "WidgetSharePreview",
                                            deprecated: 1,
                                            shareUrl: this.getValue("url")
                                        }
                                    }
                                },
                                meneame: {
                                    shareUrl: "https://www.meneame.net/submit",
                                    params: {
                                        url: this.getValue("url")
                                    }
                                },
                                diaspora: {
                                    shareUrl: "https://share.diasporafoundation.org",
                                    params: {
                                        title: this.getValue("title"),
                                        url: this.getValue("url")
                                    }
                                },
                                googlebookmarks: {
                                    shareUrl: "https://www.google.com/bookmarks/mark",
                                    params: {
                                        op: "edit",
                                        bkmk: this.getValue("url"),
                                        title: this.getValue("title")
                                    }
                                },
                                qzone: {
                                    shareUrl: "https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey",
                                    params: {
                                        url: this.getValue("url")
                                    }
                                },
                                refind: {
                                    shareUrl: "https://refind.com",
                                    params: {
                                        url: this.getValue("url")
                                    }
                                },
                                surfingbird: {
                                    shareUrl: "https://surfingbird.ru/share",
                                    params: {
                                        url: this.getValue("url"),
                                        title: this.getValue("title"),
                                        description: this.getValue("description")
                                    }
                                },
                                yahoomail: {
                                    shareUrl: "http://compose.mail.yahoo.com",
                                    params: {
                                        to: this.getValue("to"),
                                        subject: this.getValue("subject"),
                                        body: this.getValue("body")
                                    }
                                },
                                wordpress: {
                                    shareUrl: "https://wordpress.com/wp-admin/press-this.php",
                                    params: {
                                        u: this.getValue("url"),
                                        t: this.getValue("title"),
                                        s: this.getValue("title")
                                    }
                                },
                                amazon: {
                                    shareUrl: "https://www.amazon.com/gp/wishlist/static-add",
                                    params: {
                                        u: this.getValue("url"),
                                        t: this.getValue("title")
                                    }
                                },
                                pinboard: {
                                    shareUrl: "https://pinboard.in/add",
                                    params: {
                                        url: this.getValue("url"),
                                        title: this.getValue("title"),
                                        description: this.getValue("description")
                                    }
                                },
                                threema: {
                                    shareUrl: "threema://compose",
                                    params: {
                                        text: this.getValue("text"),
                                        id: this.getValue("id")
                                    }
                                },
                                kakaostory: {
                                    shareUrl: "https://story.kakao.com/share",
                                    params: {
                                        url: this.getValue("url")
                                    }
                                },
                                yummly: {
                                    shareUrl: "http://www.yummly.com/urb/verify",
                                    params: {
                                        url: this.getValue("url"),
                                        title: this.getValue("title"),
                                        yumtype: "button"
                                    }
                                }
                            }[t];
                        return e && (e.width = this.getValue("width"), e.height = this.getValue("height")), void 0 !== e && this.urlSharer(e)
                    },
                    urlSharer: function(e) {
                        var s, i = e.params || {},
                            n = Object.keys(i),
                            r = n.length > 0 ? "?" : "";
                        for (s = 0; s < n.length; s++) "?" !== r && (r += "&"), i[n[s]] && (r += n[s] + "=" + encodeURIComponent(i[n[s]]));
                        e.shareUrl += r;
                        var a = "true" === this.getValue("link"),
                            o = "true" === this.getValue("blank");
                        if (a) o ? t.open(e.shareUrl, "_blank") : t.location.href = e.shareUrl;
                        else {
                            console.log(e.shareUrl);
                            var l = e.width || 600,
                                c = e.height || 480,
                                h = t.innerWidth / 2 - l / 2 + t.screenX,
                                u = "scrollbars=no, width=" + l + ", height=" + c + ", top=" + (t.innerHeight / 2 - c / 2 + t.screenY) + ", left=" + h,
                                d = t.open(e.shareUrl, "", u);
                            t.focus && d.focus()
                        }
                    }
                }, "complete" === e.readyState || "loading" !== e.readyState ? s.init() : e.addEventListener("DOMContentLoaded", s.init), t.Sharer = s
            }(window, document)
        },
        "../node_modules/vidstack/prod/chunks/vidstack-B11i_cNc.js": (t, e, s) => {
            "use strict";
            s.d(e, {
                $: () => Ut,
                A: () => _,
                B: () => rs,
                C: () => Dt,
                D: () => nt,
                E: () => ls,
                F: () => os,
                G: () => as,
                H: () => $s,
                I: () => bt,
                J: () => Kt,
                K: () => Qt,
                L: () => Ft,
                Q: () => ct,
                R: () => dt,
                S: () => Rt,
                T: () => w,
                U: () => Yt,
                V: () => ot,
                W: () => jt,
                X: () => ae,
                Y: () => T,
                Z: () => kt,
                _: () => xt,
                a: () => vt,
                a0: () => Y,
                a1: () => bs,
                a2: () => zt,
                a3: () => Nt,
                a4: () => G,
                a5: () => Ht,
                a6: () => qt,
                a7: () => Zt,
                a8: () => Vt,
                a9: () => Gt,
                aa: () => Tt,
                ab: () => Et,
                ac: () => fs,
                ad: () => pt,
                ae: () => ut,
                b: () => J,
                c: () => Wt,
                d: () => As,
                e: () => k,
                f: () => yt,
                g: () => _t,
                h: () => U,
                i: () => K,
                j: () => Q,
                k: () => Bt,
                l: () => lt,
                m: () => W,
                n: () => Xt,
                o: () => wt,
                p: () => y,
                q: () => S,
                r: () => q,
                s: () => gt,
                t: () => X,
                u: () => St,
                v: () => tt,
                w: () => mt,
                x: () => Z,
                y: () => ft,
                z: () => ht
            });
            const i = Symbol(0);
            let n = !1,
                r = !1,
                a = null,
                o = null,
                l = null,
                c = 0,
                h = [],
                u = {};
            const d = () => {},
                p = 0,
                f = 1,
                m = 2,
                g = 3;

            function v() {
                if (h.length) {
                    r = !0;
                    for (let t = 0; t < h.length; t++) h[t].$st !== p && b(h[t]);
                    h = [], n = !1, r = !1
                } else n = !1
            }

            function b(t) {
                let e = [t];
                for (; t = t[i];) t.$e && t.$st !== p && e.push(t);
                for (let t = e.length - 1; t >= 0; t--) F(e[t])
            }

            function y(t) {
                return C(a, t, null)
            }

            function w(t) {
                return C(null, t, null)
            }

            function T() {
                r || v()
            }

            function _() {
                return a
            }

            function k(t, e) {
                try {
                    return C(e, t, null)
                } catch (t) {
                    return void M(e, t)
                }
            }

            function x(t) {
                let e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : a;
                return e ? .$cx[t]
            }

            function S(t) {
                if (!t || !a) return t || d;
                const e = a;
                return e.$d ? Array.isArray(e.$d) ? e.$d.push(t) : e.$d = [e.$d, t] : e.$d = t,
                    function() {
                        e.$st !== g && (t.call(null), j(e.$d) ? e.$d = null : Array.isArray(e.$d) && e.$d.splice(e.$d.indexOf(t), 1))
                    }
            }

            function E() {
                let t = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
                if (this.$st !== g) {
                    if (this.$h)
                        if (Array.isArray(this.$h))
                            for (let t = this.$h.length - 1; t >= 0; t--) E.call(this.$h[t]);
                        else E.call(this.$h);
                    if (t) {
                        const t = this[i];
                        t && (Array.isArray(t.$h) ? t.$h.splice(t.$h.indexOf(this), 1) : t.$h = null),
                            function(t) {
                                t.$st = g, t.$d && $(t);
                                t.$s && H(t, 0);
                                t[i] = null, t.$s = null, t.$o = null, t.$h = null, t.$cx = u, t.$eh = null
                            }(this)
                    }
                }
            }

            function $(t) {
                try {
                    if (Array.isArray(t.$d))
                        for (let e = t.$d.length - 1; e >= 0; e--) {
                            const s = t.$d[e];
                            s.call(s)
                        } else t.$d.call(t.$d);
                    t.$d = null
                } catch (e) {
                    M(t, e)
                }
            }

            function C(t, e, s) {
                const i = a,
                    n = o;
                a = t, o = s;
                try {
                    return e.call(t)
                } finally {
                    a = i, o = n
                }
            }

            function M(t, e) {
                if (!t || !t.$eh) throw e;
                let s = 0,
                    i = t.$eh.length,
                    n = P(e);
                for (s = 0; s < i; s++) try {
                    t.$eh[s](n);
                    break
                } catch (t) {
                    n = P(t)
                }
                if (s === i) throw n
            }

            function P(t) {
                return t instanceof Error ? t : Error(JSON.stringify(t))
            }

            function A() {
                return this.$st === g || (o && !this.$e && (!l && o.$s && o.$s[c] == this ? c++ : l ? l.push(this) : l = [this]), this.$c && F(this)), this.$v
            }

            function L(t) {
                const e = j(t) ? t(this.$v) : t;
                if (this.$ch(this.$v, e) && (this.$v = e, this.$o))
                    for (let t = 0; t < this.$o.length; t++) N(this.$o[t], m);
                return this.$v
            }
            const O = function() {
                    this[i] = null, this.$h = null, a && a.append(this)
                },
                I = O.prototype;

            function q() {
                return new O
            }
            I.$cx = u, I.$eh = null, I.$c = null, I.$d = null, I.append = function(t) {
                t[i] = this, this.$h ? Array.isArray(this.$h) ? this.$h.push(t) : this.$h = [this.$h, t] : this.$h = t, t.$cx = t.$cx === u ? this.$cx : { ...this.$cx,
                    ...t.$cx
                }, this.$eh && (t.$eh = t.$eh ? [...t.$eh, ...this.$eh] : this.$eh)
            }, I.dispose = function() {
                E.call(this)
            };
            const D = function(t, e, s) {
                    O.call(this), this.$st = e ? m : p, this.$i = !1, this.$e = !1, this.$s = null, this.$o = null, this.$v = t, e && (this.$c = e), s && s.dirty && (this.$ch = s.dirty)
                },
                z = D.prototype;

            function V(t, e, s) {
                return new D(t, e, s)
            }

            function j(t) {
                return "function" == typeof t
            }

            function F(t) {
                if (t.$st === f)
                    for (let e = 0; e < t.$s.length && (F(t.$s[e]), t.$st !== m); e++);
                t.$st === m ? B(t) : t.$st = p
            }

            function R(t) {
                t.$h && E.call(t, !1), t.$d && $(t), t.$eh = t[i] ? t[i].$eh : null
            }

            function B(t) {
                let e = l,
                    s = c;
                l = null, c = 0;
                try {
                    R(t);
                    const e = C(t, t.$c, t);
                    if (l) {
                        if (t.$s && H(t, c), t.$s && c > 0) {
                            t.$s.length = c + l.length;
                            for (let e = 0; e < l.length; e++) t.$s[c + e] = l[e]
                        } else t.$s = l;
                        let e;
                        for (let s = c; s < t.$s.length; s++) e = t.$s[s], e.$o ? e.$o.push(t) : e.$o = [t]
                    } else t.$s && c < t.$s.length && (H(t, c), t.$s.length = c);
                    !t.$e && t.$i ? L.call(t, e) : (t.$v = e, t.$i = !0)
                } catch (e) {
                    return M(t, e), void(t.$st === m && (R(t), t.$s && H(t, 0)))
                }
                l = e, c = s, t.$st = p
            }

            function N(t, e) {
                if (!(t.$st >= e) && (t.$e && t.$st === p && (h.push(t), n || (n = !0, queueMicrotask(v))), t.$st = e, t.$o))
                    for (let e = 0; e < t.$o.length; e++) N(t.$o[e], f)
            }

            function H(t, e) {
                let s, i;
                for (let n = e; n < t.$s.length; n++) s = t.$s[n], s.$o && (i = s.$o.indexOf(t), s.$o[i] = s.$o[s.$o.length - 1], s.$o.pop())
            }

            function G() {}

            function W(t) {
                return null === t
            }

            function U(t) {
                return void 0 === t
            }

            function Y(t) {
                return W(t) || U(t)
            }

            function X(t) {
                return t ? .constructor === Object
            }

            function Q(t) {
                return "number" == typeof t && !Number.isNaN(t)
            }

            function K(t) {
                return "string" == typeof t
            }

            function J(t) {
                return "boolean" == typeof t
            }

            function Z(t) {
                return "function" == typeof t
            }

            function tt(t) {
                return Array.isArray(t)
            }
            var et;
            Object.setPrototypeOf(z, I), z.$ch = function(t, e) {
                return t !== e
            }, z.call = A;
            const st = Event,
                it = Symbol("DOM_EVENT");
            class nt extends st {
                constructor(t) {
                    super(t, arguments.length <= 1 ? void 0 : arguments[1]), this[et] = !0, this.triggers = new rt, this.detail = (arguments.length <= 1 ? void 0 : arguments[1]) ? .detail;
                    const e = (arguments.length <= 1 ? void 0 : arguments[1]) ? .trigger;
                    e && this.triggers.add(e)
                }
                static# t = et = it;
                get trigger() {
                    return this.triggers.source
                }
                get originEvent() {
                    return this.triggers.origin
                }
                get isOriginTrusted() {
                    return this.triggers.origin ? .isTrusted ? ? !1
                }
            }
            class rt {
                constructor() {
                    this.chain = []
                }
                get source() {
                    return this.chain[0]
                }
                get origin() {
                    return this.chain[this.chain.length - 1]
                }
                add(t) {
                    this.chain.push(t), at(t) && this.chain.push(...t.triggers)
                }
                remove(t) {
                    return this.chain.splice(this.chain.indexOf(t), 1)[0]
                }
                has(t) {
                    return this.chain.some((e => e === t))
                }
                hasType(t) {
                    return !!this.findType(t)
                }
                findType(t) {
                    return this.chain.find((e => e.type === t))
                }
                walk(t) {
                    for (const e of this.chain) {
                        const s = t(e);
                        if (s) return [e, s]
                    }
                }[Symbol.iterator]() {
                    return this.chain.values()
                }
            }

            function at(t) {
                return !!t ? .[it]
            }
            class ot extends EventTarget {
                addEventListener(t, e, s) {
                    return super.addEventListener(t, e, s)
                }
                removeEventListener(t, e, s) {
                    return super.removeEventListener(t, e, s)
                }
            }

            function lt(t, e, s, i) {
                return t.addEventListener(e, s, i), S((() => t.removeEventListener(e, s, i)))
            }

            function ct(t) {
                return !!t ? .type.startsWith("pointer")
            }

            function ht(t) {
                return !!t ? .type.startsWith("touch")
            }

            function ut(t) {
                return /^(click|mouse)/.test(t ? .type ? ? "")
            }

            function dt(t) {
                return !!t ? .type.startsWith("key")
            }

            function pt(t) {
                return dt(t) && "Enter" === t.key
            }

            function ft(t) {
                return dt(t) && ("Enter" === t.key || " " === t.key)
            }

            function mt(t) {
                return t instanceof Node
            }

            function gt(t, e, s) {
                if (t)
                    if (s || "" === s || 0 === s) {
                        const i = !0 === s ? "" : s + "";
                        t.getAttribute(e) !== i && t.setAttribute(e, i)
                    } else t.removeAttribute(e)
            }

            function vt(t, e, s) {
                t && (s || 0 === s ? t.style.setProperty(e, s + "") : t.style.removeProperty(e))
            }

            function bt(t, e, s) {
                t.classList[s ? "add" : "remove"](e)
            }

            function yt(t, e) {
                const s = V(t, null, e),
                    n = A.bind(s);
                return n[i] = !0, n.set = L.bind(s), n
            }

            function wt(t, e) {
                const s = V(e ? .initial, t, e),
                    n = A.bind(s);
                return n[i] = !0, n
            }

            function Tt(t) {
                return function(t) {
                    return j(t) && i in t
                }(t) && "set" in t
            }
            const _t = function(t, e) {
                const s = V(null, (function() {
                    let e = t();
                    return j(e) && S(e), null
                }), void 0);
                return s.$e = !0, B(s), E.bind(s, !0)
            };

            function kt(t) {
                return {
                    id: Symbol(),
                    provide: t
                }
            }

            function xt(t, e) {
                let s = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : _();
                const i = !U(e);
                ! function(t, e) {
                    let s = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : a;
                    s && (s.$cx = { ...s.$cx,
                        [t]: e
                    })
                }(t.id, i ? e : t.provide ? .(), s)
            }

            function St(t) {
                return x(t.id)
            }

            function Et(t) {
                return !U(x(t.id))
            }
            const $t = Symbol(0),
                Ct = Symbol(0),
                Mt = Symbol(0);
            var Pt;
            const At = {};
            class Lt {
                constructor(t, e, s) {
                    this[Pt] = null, this.$el = yt(null), this.a = null, this.d = null, this.f = null, this.g = null, this.e = null, this.o = !1, this.i = At, this.b = null, this.c = null, this.l = [], this.m = [], this.j = [], this.n = [], this.d = e, s ? .scope && s.scope.append(e);
                    let i = t.state,
                        n = t.props;
                    if (i && (this.h = i.create(), this.k = new Proxy(this.h, {
                            get: (t, e) => this.h[e]()
                        }), xt(i, this.h)), n && (this.i = function(t) {
                            const e = {};
                            for (const s of Object.keys(t)) {
                                const i = t[s];
                                e[s] = yt(i, i)
                            }
                            return e
                        }(n), s ? .props))
                        for (const t of Object.keys(s.props)) this.i[t] ? .set(s.props[t]);
                    S(this.p.bind(this))
                }
                static# t = Pt = Mt;
                w() {
                    k((() => {
                        for (const t of this.l) t()
                    }), this.d)
                }
                x(t) {
                    this.a || (this.a = t, this.$el.set(t), k((() => {
                        this.f = q(), k((() => {
                            for (const t of this.m) t(this.a);
                            this.q(), this.r()
                        }), this.f)
                    }), this.d), t.dispatchEvent(new Event("attached")))
                }
                s() {
                    this.f ? .dispose(), this.f = null, this.g = null, this.a = null, this.$el.set(null)
                }
                y() {
                    this.a && this.f && this.j.length && k((() => {
                        this.g = q(), k((() => {
                            for (const t of this.j) t(this.a)
                        }), this.g)
                    }), this.f)
                }
                z() {
                    this.g ? .dispose(), this.g = null
                }
                p() {
                    if (this.o) return;
                    this.o = !0, k((() => {
                        for (const t of this.n) t(this.a)
                    }), this.d);
                    const t = this.a;
                    this.s(), this.d.dispose(), this.l.length = 0, this.m.length = 0, this.j.length = 0, this.n.length = 0, this.e = null, this.b = null, this.c = null, this.i = At, this.d = null, this.k = At, this.h = null, t && delete t.$
                }
                t(t) {
                    t.onSetup && this.l.push(t.onSetup.bind(t)), t.onAttach && this.m.push(t.onAttach.bind(t)), t.onConnect && this.j.push(t.onConnect.bind(t)), t.onDestroy && this.n.push(t.onDestroy.bind(t))
                }
                q() {
                    if (this.b)
                        for (const t of Object.keys(this.b)) Z(this.b[t]) ? _t(this.u.bind(this, t)) : gt(this.a, t, this.b[t])
                }
                r() {
                    if (this.c)
                        for (const t of Object.keys(this.c)) Z(this.c[t]) ? _t(this.v.bind(this, t)) : vt(this.a, t, this.c[t])
                }
                u(t) {
                    gt(this.a, t, this.b[t].call(this.e))
                }
                v(t) {
                    vt(this.a, t, this.c[t].call(this.e))
                }
            }
            let Ot = {
                $$: null
            };

            function It(t, e) {
                return function(t) {
                    const e = q();
                    return C(e, t.length ? t.bind(null, E.bind(e)) : t, null)
                }((() => {
                    Ot.$$ = new Lt(t, _(), e);
                    const s = new t;
                    return Ot.$$.e = s, Ot.$$ = null, s
                }))
            }
            class qt extends EventTarget {
                constructor() {
                    super(), Ot.$$ && this.attach(Ot)
                }
                get el() {
                    return this.$$.a
                }
                get $el() {
                    return this.$$.$el()
                }
                get scope() {
                    return this.$$.d
                }
                get attachScope() {
                    return this.$$.f
                }
                get connectScope() {
                    return this.$$.g
                }
                get $props() {
                    return this.$$.i
                }
                get $state() {
                    return this.$$.h
                }
                get state() {
                    return this.$$.k
                }
                attach(t) {
                    let {
                        $$: e
                    } = t;
                    return this.$$ = e, e.t(this), this
                }
                addEventListener(t, e, s) {
                    this.listen(t, e, s)
                }
                removeEventListener(t, e, s) {
                    this.el ? .removeEventListener(t, e, s)
                }
                setAttributes(t) {
                    this.$$.b || (this.$$.b = {}), Object.assign(this.$$.b, t)
                }
                setStyles(t) {
                    this.$$.c || (this.$$.c = {}), Object.assign(this.$$.c, t)
                }
                setCSSVars(t) {
                    this.setStyles(t)
                }
                createEvent(t) {
                    return new nt(t, arguments.length <= 1 ? void 0 : arguments[1])
                }
                dispatch(t) {
                    if (!this.el) return !1;
                    const e = t instanceof Event ? t : new nt(t, arguments.length <= 1 ? void 0 : arguments[1]);
                    return Object.defineProperty(e, "target", {
                        get: () => this.$$.e
                    }), w((() => (this.$$[Mt] ? .(e), this.el.dispatchEvent(e))))
                }
                dispatchEvent(t) {
                    return this.dispatch(t)
                }
                listen(t, e, s) {
                    return this.el ? lt(this.el, t, e, s) : G
                }
            }
            class Dt extends qt {
                subscribe(t) {
                    return k((() => _t((() => t(this.state)))), this.$$.d)
                }
                destroy() {
                    this.$$.p()
                }
            }

            function zt(t, e, s) {
                t[$t] || (t[$t] = new Set), t[$t].add(e)
            }

            function Vt(t, e, s) {
                t[Ct] || (t[Ct] = new Set), t[Ct].add(e)
            }
            class jt {
                constructor(t) {
                    this.id = Symbol(0), this.record = t, this.A = Object.getOwnPropertyDescriptors(t)
                }
                create() {
                    const t = {},
                        e = new Proxy(t, {
                            get: (e, s) => t[s]()
                        });
                    for (const s of Object.keys(this.record)) {
                        const i = this.A[s].get;
                        t[s] = i ? wt(i.bind(e)) : yt(this.record[s])
                    }
                    return t
                }
                reset(t, e) {
                    for (const s of Object.keys(t)) this.A[s].get || e && !e(s) || t[s].set(this.record[s])
                }
            }

            function Ft(t) {
                return St(t)
            }

            function Rt(t) {
                return t.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
            }

            function Bt(t) {
                return t.replace(/-./g, (t => t[1].toUpperCase()))
            }

            function Nt(t) {
                return t.charAt(0).toUpperCase() + t.slice(1)
            }

            function Ht(t) {
                return Z(t) ? t() : t
            }

            function Gt(t) {
                return t ? "true" : "false"
            }

            function Wt() {
                const t = new Set;
                return {
                    add() {
                        for (var e = arguments.length, s = new Array(e), i = 0; i < e; i++) s[i] = arguments[i];
                        for (const e of s) t.add(e)
                    },
                    empty() {
                        for (const e of t) e();
                        t.clear()
                    }
                }
            }

            function Ut() {
                const t = Wt();
                return S(t.empty), t
            }

            function Yt(t) {
                return Object.keys(t)
            }

            function Xt() {
                let t, e;
                return {
                    promise: new Promise(((s, i) => {
                        t = s, e = i
                    })),
                    resolve: t,
                    reject: e
                }
            }

            function Qt(t) {
                return new Promise((e => setTimeout(e, t)))
            }

            function Kt(t) {
                let e, s = -1;
                return function() {
                    for (var i = arguments.length, n = new Array(i), r = 0; r < i; r++) n[r] = arguments[r];
                    e = n, s >= 0 || (s = window.requestAnimationFrame((() => {
                        t.apply(this, e), s = -1, e = void 0
                    })))
                }
            }
            const Jt = "undefined" != typeof window ? "requestIdleCallback" in window ? window.requestIdleCallback : t => window.setTimeout(t, 1) : G;

            function Zt(t, e) {
                return new Promise((s => {
                    Jt((e => {
                        t ? .(e), s()
                    }), e)
                }))
            }
            var te = {
                    fullscreenEnabled: 0,
                    fullscreenElement: 1,
                    requestFullscreen: 2,
                    exitFullscreen: 3,
                    fullscreenchange: 4,
                    fullscreenerror: 5,
                    fullscreen: 6
                },
                ee = ["webkitFullscreenEnabled", "webkitFullscreenElement", "webkitRequestFullscreen", "webkitExitFullscreen", "webkitfullscreenchange", "webkitfullscreenerror", "-webkit-full-screen"],
                se = ["mozFullScreenEnabled", "mozFullScreenElement", "mozRequestFullScreen", "mozCancelFullScreen", "mozfullscreenchange", "mozfullscreenerror", "-moz-full-screen"],
                ie = ["msFullscreenEnabled", "msFullscreenElement", "msRequestFullscreen", "msExitFullscreen", "MSFullscreenChange", "MSFullscreenError", "-ms-fullscreen"],
                ne = "undefined" != typeof window && void 0 !== window.document ? window.document : {},
                re = "fullscreenEnabled" in ne && Object.keys(te) || ee[0] in ne && ee || se[0] in ne && se || ie[0] in ne && ie || [],
                ae = {
                    requestFullscreen: function(t) {
                        return t[re[te.requestFullscreen]]()
                    },
                    requestFullscreenFunction: function(t) {
                        return t[re[te.requestFullscreen]]
                    },
                    get exitFullscreen() {
                        return ne[re[te.exitFullscreen]].bind(ne)
                    },
                    get fullscreenPseudoClass() {
                        return ":" + re[te.fullscreen]
                    },
                    addEventListener: function(t, e, s) {
                        return ne.addEventListener(re[te[t]], e, s)
                    },
                    removeEventListener: function(t, e, s) {
                        return ne.removeEventListener(re[te[t]], e, s)
                    },
                    get fullscreenEnabled() {
                        return Boolean(ne[re[te.fullscreenEnabled]])
                    },
                    set fullscreenEnabled(t) {},
                    get fullscreenElement() {
                        return ne[re[te.fullscreenElement]]
                    },
                    set fullscreenElement(t) {},
                    get onfullscreenchange() {
                        return ne[("on" + re[te.fullscreenchange]).toLowerCase()]
                    },
                    set onfullscreenchange(t) {
                        return ne[("on" + re[te.fullscreenchange]).toLowerCase()] = t
                    },
                    get onfullscreenerror() {
                        return ne[("on" + re[te.fullscreenerror]).toLowerCase()]
                    },
                    set onfullscreenerror(t) {
                        return ne[("on" + re[te.fullscreenerror]).toLowerCase()] = t
                    }
                };
            const oe = Math.min,
                le = Math.max,
                ce = Math.round,
                he = Math.floor,
                ue = t => ({
                    x: t,
                    y: t
                }),
                de = {
                    left: "right",
                    right: "left",
                    bottom: "top",
                    top: "bottom"
                },
                pe = {
                    start: "end",
                    end: "start"
                };

            function fe(t, e, s) {
                return le(t, oe(e, s))
            }

            function me(t, e) {
                return "function" == typeof t ? t(e) : t
            }

            function ge(t) {
                return t.split("-")[0]
            }

            function ve(t) {
                return t.split("-")[1]
            }

            function be(t) {
                return "x" === t ? "y" : "x"
            }

            function ye(t) {
                return "y" === t ? "height" : "width"
            }

            function we(t) {
                return ["top", "bottom"].includes(ge(t)) ? "y" : "x"
            }

            function Te(t) {
                return be(we(t))
            }

            function _e(t) {
                return t.replace(/start|end/g, (t => pe[t]))
            }

            function ke(t) {
                return t.replace(/left|right|bottom|top/g, (t => de[t]))
            }

            function xe(t) {
                return { ...t,
                    top: t.y,
                    left: t.x,
                    right: t.x + t.width,
                    bottom: t.y + t.height
                }
            }

            function Se(t, e, s) {
                let {
                    reference: i,
                    floating: n
                } = t;
                const r = we(e),
                    a = Te(e),
                    o = ye(a),
                    l = ge(e),
                    c = "y" === r,
                    h = i.x + i.width / 2 - n.width / 2,
                    u = i.y + i.height / 2 - n.height / 2,
                    d = i[o] / 2 - n[o] / 2;
                let p;
                switch (l) {
                    case "top":
                        p = {
                            x: h,
                            y: i.y - n.height
                        };
                        break;
                    case "bottom":
                        p = {
                            x: h,
                            y: i.y + i.height
                        };
                        break;
                    case "right":
                        p = {
                            x: i.x + i.width,
                            y: u
                        };
                        break;
                    case "left":
                        p = {
                            x: i.x - n.width,
                            y: u
                        };
                        break;
                    default:
                        p = {
                            x: i.x,
                            y: i.y
                        }
                }
                switch (ve(e)) {
                    case "start":
                        p[a] -= d * (s && c ? -1 : 1);
                        break;
                    case "end":
                        p[a] += d * (s && c ? -1 : 1)
                }
                return p
            }
            async function Ee(t, e) {
                var s;
                void 0 === e && (e = {});
                const {
                    x: i,
                    y: n,
                    platform: r,
                    rects: a,
                    elements: o,
                    strategy: l
                } = t, {
                    boundary: c = "clippingAncestors",
                    rootBoundary: h = "viewport",
                    elementContext: u = "floating",
                    altBoundary: d = !1,
                    padding: p = 0
                } = me(e, t), f = function(t) {
                    return "number" != typeof t ? function(t) {
                        return {
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            ...t
                        }
                    }(t) : {
                        top: t,
                        right: t,
                        bottom: t,
                        left: t
                    }
                }(p), m = o[d ? "floating" === u ? "reference" : "floating" : u], g = xe(await r.getClippingRect({
                    element: null == (s = await (null == r.isElement ? void 0 : r.isElement(m))) || s ? m : m.contextElement || await (null == r.getDocumentElement ? void 0 : r.getDocumentElement(o.floating)),
                    boundary: c,
                    rootBoundary: h,
                    strategy: l
                })), v = "floating" === u ? { ...a.floating,
                    x: i,
                    y: n
                } : a.reference, b = await (null == r.getOffsetParent ? void 0 : r.getOffsetParent(o.floating)), y = await (null == r.isElement ? void 0 : r.isElement(b)) && await (null == r.getScale ? void 0 : r.getScale(b)) || {
                    x: 1,
                    y: 1
                }, w = xe(r.convertOffsetParentRelativeRectToViewportRelativeRect ? await r.convertOffsetParentRelativeRectToViewportRelativeRect({
                    elements: o,
                    rect: v,
                    offsetParent: b,
                    strategy: l
                }) : v);
                return {
                    top: (g.top - w.top + f.top) / y.y,
                    bottom: (w.bottom - g.bottom + f.bottom) / y.y,
                    left: (g.left - w.left + f.left) / y.x,
                    right: (w.right - g.right + f.right) / y.x
                }
            }

            function $e(t) {
                return Pe(t) ? (t.nodeName || "").toLowerCase() : "#document"
            }

            function Ce(t) {
                var e;
                return (null == t || null == (e = t.ownerDocument) ? void 0 : e.defaultView) || window
            }

            function Me(t) {
                var e;
                return null == (e = (Pe(t) ? t.ownerDocument : t.document) || window.document) ? void 0 : e.documentElement
            }

            function Pe(t) {
                return t instanceof Node || t instanceof Ce(t).Node
            }

            function Ae(t) {
                return t instanceof Element || t instanceof Ce(t).Element
            }

            function Le(t) {
                return t instanceof HTMLElement || t instanceof Ce(t).HTMLElement
            }

            function Oe(t) {
                return "undefined" != typeof ShadowRoot && (t instanceof ShadowRoot || t instanceof Ce(t).ShadowRoot)
            }

            function Ie(t) {
                const {
                    overflow: e,
                    overflowX: s,
                    overflowY: i,
                    display: n
                } = je(t);
                return /auto|scroll|overlay|hidden|clip/.test(e + i + s) && !["inline", "contents"].includes(n)
            }

            function qe(t) {
                return ["table", "td", "th"].includes($e(t))
            }

            function De(t) {
                const e = ze(),
                    s = je(t);
                return "none" !== s.transform || "none" !== s.perspective || !!s.containerType && "normal" !== s.containerType || !e && !!s.backdropFilter && "none" !== s.backdropFilter || !e && !!s.filter && "none" !== s.filter || ["transform", "perspective", "filter"].some((t => (s.willChange || "").includes(t))) || ["paint", "layout", "strict", "content"].some((t => (s.contain || "").includes(t)))
            }

            function ze() {
                return !("undefined" == typeof CSS || !CSS.supports) && CSS.supports("-webkit-backdrop-filter", "none")
            }

            function Ve(t) {
                return ["html", "body", "#document"].includes($e(t))
            }

            function je(t) {
                return Ce(t).getComputedStyle(t)
            }

            function Fe(t) {
                return Ae(t) ? {
                    scrollLeft: t.scrollLeft,
                    scrollTop: t.scrollTop
                } : {
                    scrollLeft: t.pageXOffset,
                    scrollTop: t.pageYOffset
                }
            }

            function Re(t) {
                if ("html" === $e(t)) return t;
                const e = t.assignedSlot || t.parentNode || Oe(t) && t.host || Me(t);
                return Oe(e) ? e.host : e
            }

            function Be(t) {
                const e = Re(t);
                return Ve(e) ? t.ownerDocument ? t.ownerDocument.body : t.body : Le(e) && Ie(e) ? e : Be(e)
            }

            function Ne(t, e, s) {
                var i;
                void 0 === e && (e = []), void 0 === s && (s = !0);
                const n = Be(t),
                    r = n === (null == (i = t.ownerDocument) ? void 0 : i.body),
                    a = Ce(n);
                return r ? e.concat(a, a.visualViewport || [], Ie(n) ? n : [], a.frameElement && s ? Ne(a.frameElement) : []) : e.concat(n, Ne(n, [], s))
            }

            function He(t) {
                const e = je(t);
                let s = parseFloat(e.width) || 0,
                    i = parseFloat(e.height) || 0;
                const n = Le(t),
                    r = n ? t.offsetWidth : s,
                    a = n ? t.offsetHeight : i,
                    o = ce(s) !== r || ce(i) !== a;
                return o && (s = r, i = a), {
                    width: s,
                    height: i,
                    $: o
                }
            }

            function Ge(t) {
                return Ae(t) ? t : t.contextElement
            }

            function We(t) {
                const e = Ge(t);
                if (!Le(e)) return ue(1);
                const s = e.getBoundingClientRect(),
                    {
                        width: i,
                        height: n,
                        $: r
                    } = He(e);
                let a = (r ? ce(s.width) : s.width) / i,
                    o = (r ? ce(s.height) : s.height) / n;
                return a && Number.isFinite(a) || (a = 1), o && Number.isFinite(o) || (o = 1), {
                    x: a,
                    y: o
                }
            }
            const Ue = ue(0);

            function Ye(t) {
                const e = Ce(t);
                return ze() && e.visualViewport ? {
                    x: e.visualViewport.offsetLeft,
                    y: e.visualViewport.offsetTop
                } : Ue
            }

            function Xe(t, e, s, i) {
                void 0 === e && (e = !1), void 0 === s && (s = !1);
                const n = t.getBoundingClientRect(),
                    r = Ge(t);
                let a = ue(1);
                e && (i ? Ae(i) && (a = We(i)) : a = We(t));
                const o = function(t, e, s) {
                    return void 0 === e && (e = !1), !(!s || e && s !== Ce(t)) && e
                }(r, s, i) ? Ye(r) : ue(0);
                let l = (n.left + o.x) / a.x,
                    c = (n.top + o.y) / a.y,
                    h = n.width / a.x,
                    u = n.height / a.y;
                if (r) {
                    const t = Ce(r),
                        e = i && Ae(i) ? Ce(i) : i;
                    let s = t,
                        n = s.frameElement;
                    for (; n && i && e !== s;) {
                        const t = We(n),
                            e = n.getBoundingClientRect(),
                            i = je(n),
                            r = e.left + (n.clientLeft + parseFloat(i.paddingLeft)) * t.x,
                            a = e.top + (n.clientTop + parseFloat(i.paddingTop)) * t.y;
                        l *= t.x, c *= t.y, h *= t.x, u *= t.y, l += r, c += a, s = Ce(n), n = s.frameElement
                    }
                }
                return xe({
                    width: h,
                    height: u,
                    x: l,
                    y: c
                })
            }
            const Qe = [":popover-open", ":modal"];

            function Ke(t) {
                return Qe.some((e => {
                    try {
                        return t.matches(e)
                    } catch (t) {
                        return !1
                    }
                }))
            }

            function Je(t) {
                return Xe(Me(t)).left + Fe(t).scrollLeft
            }

            function Ze(t, e, s) {
                let i;
                if ("viewport" === e) i = function(t, e) {
                    const s = Ce(t),
                        i = Me(t),
                        n = s.visualViewport;
                    let r = i.clientWidth,
                        a = i.clientHeight,
                        o = 0,
                        l = 0;
                    if (n) {
                        r = n.width, a = n.height;
                        const t = ze();
                        (!t || t && "fixed" === e) && (o = n.offsetLeft, l = n.offsetTop)
                    }
                    return {
                        width: r,
                        height: a,
                        x: o,
                        y: l
                    }
                }(t, s);
                else if ("document" === e) i = function(t) {
                    const e = Me(t),
                        s = Fe(t),
                        i = t.ownerDocument.body,
                        n = le(e.scrollWidth, e.clientWidth, i.scrollWidth, i.clientWidth),
                        r = le(e.scrollHeight, e.clientHeight, i.scrollHeight, i.clientHeight);
                    let a = -s.scrollLeft + Je(t);
                    const o = -s.scrollTop;
                    return "rtl" === je(i).direction && (a += le(e.clientWidth, i.clientWidth) - n), {
                        width: n,
                        height: r,
                        x: a,
                        y: o
                    }
                }(Me(t));
                else if (Ae(e)) i = function(t, e) {
                    const s = Xe(t, !0, "fixed" === e),
                        i = s.top + t.clientTop,
                        n = s.left + t.clientLeft,
                        r = Le(t) ? We(t) : ue(1);
                    return {
                        width: t.clientWidth * r.x,
                        height: t.clientHeight * r.y,
                        x: n * r.x,
                        y: i * r.y
                    }
                }(e, s);
                else {
                    const s = Ye(t);
                    i = { ...e,
                        x: e.x - s.x,
                        y: e.y - s.y
                    }
                }
                return xe(i)
            }

            function ts(t, e) {
                const s = Re(t);
                return !(s === e || !Ae(s) || Ve(s)) && ("fixed" === je(s).position || ts(s, e))
            }

            function es(t, e, s) {
                const i = Le(e),
                    n = Me(e),
                    r = "fixed" === s,
                    a = Xe(t, !0, r, e);
                let o = {
                    scrollLeft: 0,
                    scrollTop: 0
                };
                const l = ue(0);
                if (i || !i && !r)
                    if (("body" !== $e(e) || Ie(n)) && (o = Fe(e)), i) {
                        const t = Xe(e, !0, r, e);
                        l.x = t.x + e.clientLeft, l.y = t.y + e.clientTop
                    } else n && (l.x = Je(n));
                return {
                    x: a.left + o.scrollLeft - l.x,
                    y: a.top + o.scrollTop - l.y,
                    width: a.width,
                    height: a.height
                }
            }

            function ss(t, e) {
                return Le(t) && "fixed" !== je(t).position ? e ? e(t) : t.offsetParent : null
            }

            function is(t, e) {
                const s = Ce(t);
                if (!Le(t) || Ke(t)) return s;
                let i = ss(t, e);
                for (; i && qe(i) && "static" === je(i).position;) i = ss(i, e);
                return i && ("html" === $e(i) || "body" === $e(i) && "static" === je(i).position && !De(i)) ? s : i || function(t) {
                    let e = Re(t);
                    for (; Le(e) && !Ve(e);) {
                        if (De(e)) return e;
                        e = Re(e)
                    }
                    return null
                }(t) || s
            }
            const ns = {
                convertOffsetParentRelativeRectToViewportRelativeRect: function(t) {
                    let {
                        elements: e,
                        rect: s,
                        offsetParent: i,
                        strategy: n
                    } = t;
                    const r = "fixed" === n,
                        a = Me(i),
                        o = !!e && Ke(e.floating);
                    if (i === a || o && r) return s;
                    let l = {
                            scrollLeft: 0,
                            scrollTop: 0
                        },
                        c = ue(1);
                    const h = ue(0),
                        u = Le(i);
                    if ((u || !u && !r) && (("body" !== $e(i) || Ie(a)) && (l = Fe(i)), Le(i))) {
                        const t = Xe(i);
                        c = We(i), h.x = t.x + i.clientLeft, h.y = t.y + i.clientTop
                    }
                    return {
                        width: s.width * c.x,
                        height: s.height * c.y,
                        x: s.x * c.x - l.scrollLeft * c.x + h.x,
                        y: s.y * c.y - l.scrollTop * c.y + h.y
                    }
                },
                getDocumentElement: Me,
                getClippingRect: function(t) {
                    let {
                        element: e,
                        boundary: s,
                        rootBoundary: i,
                        strategy: n
                    } = t;
                    const r = [..."clippingAncestors" === s ? function(t, e) {
                            const s = e.get(t);
                            if (s) return s;
                            let i = Ne(t, [], !1).filter((t => Ae(t) && "body" !== $e(t))),
                                n = null;
                            const r = "fixed" === je(t).position;
                            let a = r ? Re(t) : t;
                            for (; Ae(a) && !Ve(a);) {
                                const e = je(a),
                                    s = De(a);
                                s || "fixed" !== e.position || (n = null), (r ? !s && !n : !s && "static" === e.position && n && ["absolute", "fixed"].includes(n.position) || Ie(a) && !s && ts(t, a)) ? i = i.filter((t => t !== a)) : n = e, a = Re(a)
                            }
                            return e.set(t, i), i
                        }(e, this._c) : [].concat(s), i],
                        a = r[0],
                        o = r.reduce(((t, s) => {
                            const i = Ze(e, s, n);
                            return t.top = le(i.top, t.top), t.right = oe(i.right, t.right), t.bottom = oe(i.bottom, t.bottom), t.left = le(i.left, t.left), t
                        }), Ze(e, a, n));
                    return {
                        width: o.right - o.left,
                        height: o.bottom - o.top,
                        x: o.left,
                        y: o.top
                    }
                },
                getOffsetParent: is,
                getElementRects: async function(t) {
                    const e = this.getOffsetParent || is,
                        s = this.getDimensions;
                    return {
                        reference: es(t.reference, await e(t.floating), t.strategy),
                        floating: {
                            x: 0,
                            y: 0,
                            ...await s(t.floating)
                        }
                    }
                },
                getClientRects: function(t) {
                    return Array.from(t.getClientRects())
                },
                getDimensions: function(t) {
                    const {
                        width: e,
                        height: s
                    } = He(t);
                    return {
                        width: e,
                        height: s
                    }
                },
                getScale: We,
                isElement: Ae,
                isRTL: function(t) {
                    return "rtl" === je(t).direction
                }
            };

            function rs(t, e, s, i) {
                void 0 === i && (i = {});
                const {
                    ancestorScroll: n = !0,
                    ancestorResize: r = !0,
                    elementResize: a = "function" == typeof ResizeObserver,
                    layoutShift: o = "function" == typeof IntersectionObserver,
                    animationFrame: l = !1
                } = i, c = Ge(t), h = n || r ? [...c ? Ne(c) : [], ...Ne(e)] : [];
                h.forEach((t => {
                    n && t.addEventListener("scroll", s, {
                        passive: !0
                    }), r && t.addEventListener("resize", s)
                }));
                const u = c && o ? function(t, e) {
                    let s, i = null;
                    const n = Me(t);

                    function r() {
                        var t;
                        clearTimeout(s), null == (t = i) || t.disconnect(), i = null
                    }
                    return function a(o, l) {
                        void 0 === o && (o = !1), void 0 === l && (l = 1), r();
                        const {
                            left: c,
                            top: h,
                            width: u,
                            height: d
                        } = t.getBoundingClientRect();
                        if (o || e(), !u || !d) return;
                        const p = {
                            rootMargin: -he(h) + "px " + -he(n.clientWidth - (c + u)) + "px " + -he(n.clientHeight - (h + d)) + "px " + -he(c) + "px",
                            threshold: le(0, oe(1, l)) || 1
                        };
                        let f = !0;

                        function m(t) {
                            const e = t[0].intersectionRatio;
                            if (e !== l) {
                                if (!f) return a();
                                e ? a(!1, e) : s = setTimeout((() => {
                                    a(!1, 1e-7)
                                }), 100)
                            }
                            f = !1
                        }
                        try {
                            i = new IntersectionObserver(m, { ...p,
                                root: n.ownerDocument
                            })
                        } catch (t) {
                            i = new IntersectionObserver(m, p)
                        }
                        i.observe(t)
                    }(!0), r
                }(c, s) : null;
                let d, p = -1,
                    f = null;
                a && (f = new ResizeObserver((t => {
                    let [i] = t;
                    i && i.target === c && f && (f.unobserve(e), cancelAnimationFrame(p), p = requestAnimationFrame((() => {
                        var t;
                        null == (t = f) || t.observe(e)
                    }))), s()
                })), c && !l && f.observe(c), f.observe(e));
                let m = l ? Xe(t) : null;
                return l && function e() {
                    const i = Xe(t);
                    !m || i.x === m.x && i.y === m.y && i.width === m.width && i.height === m.height || s();
                    m = i, d = requestAnimationFrame(e)
                }(), s(), () => {
                    var t;
                    h.forEach((t => {
                        n && t.removeEventListener("scroll", s), r && t.removeEventListener("resize", s)
                    })), null == u || u(), null == (t = f) || t.disconnect(), f = null, l && cancelAnimationFrame(d)
                }
            }
            const as = function(t) {
                    return void 0 === t && (t = {}), {
                        name: "shift",
                        options: t,
                        async fn(e) {
                            const {
                                x: s,
                                y: i,
                                placement: n
                            } = e, {
                                mainAxis: r = !0,
                                crossAxis: a = !1,
                                limiter: o = {
                                    fn: t => {
                                        let {
                                            x: e,
                                            y: s
                                        } = t;
                                        return {
                                            x: e,
                                            y: s
                                        }
                                    }
                                },
                                ...l
                            } = me(t, e), c = {
                                x: s,
                                y: i
                            }, h = await Ee(e, l), u = we(ge(n)), d = be(u);
                            let p = c[d],
                                f = c[u];
                            if (r) {
                                const t = "y" === d ? "bottom" : "right";
                                p = fe(p + h["y" === d ? "top" : "left"], p, p - h[t])
                            }
                            if (a) {
                                const t = "y" === u ? "bottom" : "right";
                                f = fe(f + h["y" === u ? "top" : "left"], f, f - h[t])
                            }
                            const m = o.fn({ ...e,
                                [d]: p,
                                [u]: f
                            });
                            return { ...m,
                                data: {
                                    x: m.x - s,
                                    y: m.y - i
                                }
                            }
                        }
                    }
                },
                os = function(t) {
                    return void 0 === t && (t = {}), {
                        name: "flip",
                        options: t,
                        async fn(e) {
                            var s, i;
                            const {
                                placement: n,
                                middlewareData: r,
                                rects: a,
                                initialPlacement: o,
                                platform: l,
                                elements: c
                            } = e, {
                                mainAxis: h = !0,
                                crossAxis: u = !0,
                                fallbackPlacements: d,
                                fallbackStrategy: p = "bestFit",
                                fallbackAxisSideDirection: f = "none",
                                flipAlignment: m = !0,
                                ...g
                            } = me(t, e);
                            if (null != (s = r.arrow) && s.alignmentOffset) return {};
                            const v = ge(n),
                                b = ge(o) === o,
                                y = await (null == l.isRTL ? void 0 : l.isRTL(c.floating)),
                                w = d || (b || !m ? [ke(o)] : function(t) {
                                    const e = ke(t);
                                    return [_e(t), e, _e(e)]
                                }(o));
                            d || "none" === f || w.push(... function(t, e, s, i) {
                                const n = ve(t);
                                let r = function(t, e, s) {
                                    const i = ["left", "right"],
                                        n = ["right", "left"],
                                        r = ["top", "bottom"],
                                        a = ["bottom", "top"];
                                    switch (t) {
                                        case "top":
                                        case "bottom":
                                            return s ? e ? n : i : e ? i : n;
                                        case "left":
                                        case "right":
                                            return e ? r : a;
                                        default:
                                            return []
                                    }
                                }(ge(t), "start" === s, i);
                                return n && (r = r.map((t => t + "-" + n)), e && (r = r.concat(r.map(_e)))), r
                            }(o, m, f, y));
                            const T = [o, ...w],
                                _ = await Ee(e, g),
                                k = [];
                            let x = (null == (i = r.flip) ? void 0 : i.overflows) || [];
                            if (h && k.push(_[v]), u) {
                                const t = function(t, e, s) {
                                    void 0 === s && (s = !1);
                                    const i = ve(t),
                                        n = Te(t),
                                        r = ye(n);
                                    let a = "x" === n ? i === (s ? "end" : "start") ? "right" : "left" : "start" === i ? "bottom" : "top";
                                    return e.reference[r] > e.floating[r] && (a = ke(a)), [a, ke(a)]
                                }(n, a, y);
                                k.push(_[t[0]], _[t[1]])
                            }
                            if (x = [...x, {
                                    placement: n,
                                    overflows: k
                                }], !k.every((t => t <= 0))) {
                                var S, E;
                                const t = ((null == (S = r.flip) ? void 0 : S.index) || 0) + 1,
                                    e = T[t];
                                if (e) return {
                                    data: {
                                        index: t,
                                        overflows: x
                                    },
                                    reset: {
                                        placement: e
                                    }
                                };
                                let s = null == (E = x.filter((t => t.overflows[0] <= 0)).sort(((t, e) => t.overflows[1] - e.overflows[1]))[0]) ? void 0 : E.placement;
                                if (!s) switch (p) {
                                    case "bestFit":
                                        {
                                            var $;
                                            const t = null == ($ = x.map((t => [t.placement, t.overflows.filter((t => t > 0)).reduce(((t, e) => t + e), 0)])).sort(((t, e) => t[1] - e[1]))[0]) ? void 0 : $[0];t && (s = t);
                                            break
                                        }
                                    case "initialPlacement":
                                        s = o
                                }
                                if (n !== s) return {
                                    reset: {
                                        placement: s
                                    }
                                }
                            }
                            return {}
                        }
                    }
                },
                ls = (t, e, s) => {
                    const i = new Map,
                        n = {
                            platform: ns,
                            ...s
                        },
                        r = { ...n.platform,
                            _c: i
                        };
                    return (async (t, e, s) => {
                        const {
                            placement: i = "bottom",
                            strategy: n = "absolute",
                            middleware: r = [],
                            platform: a
                        } = s, o = r.filter(Boolean), l = await (null == a.isRTL ? void 0 : a.isRTL(e));
                        let c = await a.getElementRects({
                                reference: t,
                                floating: e,
                                strategy: n
                            }),
                            {
                                x: h,
                                y: u
                            } = Se(c, i, l),
                            d = i,
                            p = {},
                            f = 0;
                        for (let s = 0; s < o.length; s++) {
                            const {
                                name: r,
                                fn: m
                            } = o[s], {
                                x: g,
                                y: v,
                                data: b,
                                reset: y
                            } = await m({
                                x: h,
                                y: u,
                                initialPlacement: i,
                                placement: d,
                                strategy: n,
                                middlewareData: p,
                                rects: c,
                                platform: a,
                                elements: {
                                    reference: t,
                                    floating: e
                                }
                            });
                            h = null != g ? g : h, u = null != v ? v : u, p = { ...p,
                                [r]: { ...p[r],
                                    ...b
                                }
                            }, y && f <= 50 && (f++, "object" == typeof y && (y.placement && (d = y.placement), y.rects && (c = !0 === y.rects ? await a.getElementRects({
                                reference: t,
                                floating: e,
                                strategy: n
                            }) : y.rects), ({
                                x: h,
                                y: u
                            } = Se(c, d, l))), s = -1)
                        }
                        return {
                            x: h,
                            y: u,
                            placement: d,
                            strategy: n,
                            middlewareData: p
                        }
                    })(t, e, { ...n,
                        platform: r
                    })
                },
                cs = t => "object" == typeof t && null != t && 1 === t.nodeType,
                hs = (t, e) => (!e || "hidden" !== t) && "visible" !== t && "clip" !== t,
                us = (t, e) => {
                    if (t.clientHeight < t.scrollHeight || t.clientWidth < t.scrollWidth) {
                        const s = getComputedStyle(t, null);
                        return hs(s.overflowY, e) || hs(s.overflowX, e) || (t => {
                            const e = (t => {
                                if (!t.ownerDocument || !t.ownerDocument.defaultView) return null;
                                try {
                                    return t.ownerDocument.defaultView.frameElement
                                } catch (t) {
                                    return null
                                }
                            })(t);
                            return !!e && (e.clientHeight < t.scrollHeight || e.clientWidth < t.scrollWidth)
                        })(t)
                    }
                    return !1
                },
                ds = (t, e, s, i, n, r, a, o) => r < t && a > e || r > t && a < e ? 0 : r <= t && o <= s || a >= e && o >= s ? r - t - i : a > e && o < s || r < t && o > s ? a - e + n : 0,
                ps = t => {
                    const e = t.parentElement;
                    return e ? ? (t.getRootNode().host || null)
                },
                fs = (t, e) => {
                    var s, i, n, r;
                    if ("undefined" == typeof document) return [];
                    const {
                        scrollMode: a,
                        block: o,
                        inline: l,
                        boundary: c,
                        skipOverflowHiddenElements: h
                    } = e, u = "function" == typeof c ? c : t => t !== c;
                    if (!cs(t)) throw new TypeError("Invalid target");
                    const d = document.scrollingElement || document.documentElement,
                        p = [];
                    let f = t;
                    for (; cs(f) && u(f);) {
                        if (f = ps(f), f === d) {
                            p.push(f);
                            break
                        }
                        null != f && f === document.body && us(f) && !us(document.documentElement) || null != f && us(f, h) && p.push(f)
                    }
                    const m = null != (i = null == (s = window.visualViewport) ? void 0 : s.width) ? i : innerWidth,
                        g = null != (r = null == (n = window.visualViewport) ? void 0 : n.height) ? r : innerHeight,
                        {
                            scrollX: v,
                            scrollY: b
                        } = window,
                        {
                            height: y,
                            width: w,
                            top: T,
                            right: _,
                            bottom: k,
                            left: x
                        } = t.getBoundingClientRect(),
                        {
                            top: S,
                            right: E,
                            bottom: $,
                            left: C
                        } = (t => {
                            const e = window.getComputedStyle(t);
                            return {
                                top: parseFloat(e.scrollMarginTop) || 0,
                                right: parseFloat(e.scrollMarginRight) || 0,
                                bottom: parseFloat(e.scrollMarginBottom) || 0,
                                left: parseFloat(e.scrollMarginLeft) || 0
                            }
                        })(t);
                    let M = "start" === o || "nearest" === o ? T - S : "end" === o ? k + $ : T + y / 2 - S + $,
                        P = "center" === l ? x + w / 2 - C + E : "end" === l ? _ + E : x - C;
                    const A = [];
                    for (let t = 0; t < p.length; t++) {
                        const e = p[t],
                            {
                                height: s,
                                width: i,
                                top: n,
                                right: r,
                                bottom: c,
                                left: h
                            } = e.getBoundingClientRect();
                        if ("if-needed" === a && T >= 0 && x >= 0 && k <= g && _ <= m && T >= n && k <= c && x >= h && _ <= r) return A;
                        const u = getComputedStyle(e),
                            f = parseInt(u.borderLeftWidth, 10),
                            S = parseInt(u.borderTopWidth, 10),
                            E = parseInt(u.borderRightWidth, 10),
                            $ = parseInt(u.borderBottomWidth, 10);
                        let C = 0,
                            L = 0;
                        const O = "offsetWidth" in e ? e.offsetWidth - e.clientWidth - f - E : 0,
                            I = "offsetHeight" in e ? e.offsetHeight - e.clientHeight - S - $ : 0,
                            q = "offsetWidth" in e ? 0 === e.offsetWidth ? 0 : i / e.offsetWidth : 0,
                            D = "offsetHeight" in e ? 0 === e.offsetHeight ? 0 : s / e.offsetHeight : 0;
                        if (d === e) C = "start" === o ? M : "end" === o ? M - g : "nearest" === o ? ds(b, b + g, g, S, $, b + M, b + M + y, y) : M - g / 2, L = "start" === l ? P : "center" === l ? P - m / 2 : "end" === l ? P - m : ds(v, v + m, m, f, E, v + P, v + P + w, w), C = Math.max(0, C + b), L = Math.max(0, L + v);
                        else {
                            C = "start" === o ? M - n - S : "end" === o ? M - c + $ + I : "nearest" === o ? ds(n, c, s, S, $ + I, M, M + y, y) : M - (n + s / 2) + I / 2, L = "start" === l ? P - h - f : "center" === l ? P - (h + i / 2) + O / 2 : "end" === l ? P - r + E + O : ds(h, r, i, f, E + O, P, P + w, w);
                            const {
                                scrollLeft: t,
                                scrollTop: a
                            } = e;
                            C = 0 === D ? 0 : Math.max(0, Math.min(a + C / D, e.scrollHeight - s / D + I)), L = 0 === q ? 0 : Math.max(0, Math.min(t + L / q, e.scrollWidth - i / q + O)), M += a - C, P += t - L
                        }
                        A.push({
                            el: e,
                            top: C,
                            left: L
                        })
                    }
                    return A
                },
                ms = t => null === t ? "" : t + "",
                gs = t => null === t ? null : t + "",
                vs = t => null === t ? 0 : Number(t),
                bs = t => null !== t,
                ys = () => null,
                ws = t => null === t ? [] : JSON.parse(t),
                Ts = t => null === t ? {} : JSON.parse(t);

            function _s(t) {
                if (null === t) return gs;
                switch (typeof t) {
                    case "undefined":
                    case "string":
                    default:
                        return ms;
                    case "boolean":
                        return bs;
                    case "number":
                        return vs;
                    case "function":
                        return ys;
                    case "object":
                        return tt(t) ? ws : Ts
                }
            }
            const ks = Symbol(0),
                xs = Symbol(0),
                Ss = Symbol(0),
                Es = Symbol(0);

            function $s(t, e) {
                var s, i, n;
                class r extends t {
                    constructor() {
                        if (super(...arguments), this[i] = 0, this[n] = null, this.keepAlive = !1, this.forwardKeepAlive = !0, this.$ = k((() => It(e)), null), this.$.$$.t(this), e.props) {
                            const t = this.$props,
                                s = Object.getOwnPropertyDescriptors(this);
                            for (const i of Object.keys(s)) i in e.props && (t[i].set(this[i]), delete this[i])
                        }
                    }
                    static# t = this[s] = null;
                    static get observedAttributes() {
                        if (!this[ks] && e.props) {
                            const t = new Map;
                            for (const s of Object.keys(e.props)) {
                                let i = this.attrs ? .[s],
                                    n = K(i) ? i : i ? i ? .attr : i;
                                !1 !== n && (n || (n = Rt(s)), t.set(n, {
                                    C: s,
                                    B: i && !K(i) && i ? .converter || _s(e.props[s])
                                }))
                            }
                            this[ks] = t
                        }
                        return this[ks] ? Array.from(this[ks].keys()) : []
                    }
                    get scope() {
                        return this.$.$$.d
                    }
                    get attachScope() {
                        return this.$.$$.f
                    }
                    get connectScope() {
                        return this.$.$$.g
                    }
                    get $props() {
                        return this.$.$$.i
                    }
                    get $state() {
                        return this.$.$$.h
                    }
                    get state() {
                        return this.$.state
                    }
                    attributeChangedCallback(t, e, s) {
                        const i = this.constructor;
                        if (!i[ks]) return void super.attributeChangedCallback ? .(t, e, s);
                        const n = i[ks].get(t);
                        n && (this[n.C] = n.B(s))
                    }
                    connectedCallback() {
                        const t = this.$ ? .$$;
                        if (!t || t.o) return;
                        if (2 !== this[Ss]) return void Cs.call(this);
                        if (!this.isConnected) return;
                        this.hasAttribute("keep-alive") && (this.keepAlive = !0), t.y(), tt(this[Es]) && function(t, e) {
                            for (const s of t) s(e)
                        }(this[Es], this), this[Es] = null;
                        const e = super.connectedCallback;
                        e && k((() => e.call(this)), this.connectScope)
                    }
                    disconnectedCallback() {
                        const t = this.$ ? .$$;
                        if (!t || t.o) return;
                        t.z();
                        const e = super.disconnectedCallback;
                        e && e.call(this), this.keepAlive || this.hasAttribute("keep-alive") || setTimeout((() => {
                            requestAnimationFrame((() => {
                                this.isConnected || t.p()
                            }))
                        }), 0)
                    }[(s = ks, i = Ss, n = Es, xs)]() {
                        const t = this.$.$$,
                            e = this.constructor;
                        if (t.o) return;
                        const s = e[ks];
                        if (s)
                            for (const e of this.attributes) {
                                let i = s.get(e.name);
                                i && i.B && t.i[i.C].set(i.B(this.getAttribute(e.name)))
                            }
                        t.w(), t.x(this), this[Ss] = 2, this.connectedCallback()
                    }
                    subscribe(t) {
                        return this.$.subscribe(t)
                    }
                    destroy() {
                        this.disconnectedCallback(), this.$.destroy()
                    }
                }
                return function(t, e) {
                    const s = t.prototype,
                        i = e.prototype;
                    if (e.props)
                        for (const t of Object.keys(e.props)) Object.defineProperty(s, t, {
                            enumerable: !0,
                            configurable: !0,
                            get() {
                                return this.$props[t]()
                            },
                            set(e) {
                                this.$props[t].set(e)
                            }
                        });
                    if (i[$t])
                        for (const t of i[$t]) Object.defineProperty(s, t, {
                            enumerable: !0,
                            configurable: !0,
                            get() {
                                return this.$[t]
                            },
                            set(e) {
                                this.$[t] = e
                            }
                        });
                    if (i[Ct])
                        for (const t of i[Ct]) s[t] = function() {
                            return this.$[t](...arguments)
                        }
                }(r, e), r
            }

            function Cs() {
                if (0 !== this[Ss]) return;
                this[Ss] = 1;
                const t = function(t) {
                        let e = t.parentNode,
                            s = t.localName.split("-", 1)[0] + "-";
                        for (; e;) {
                            if (1 === e.nodeType && e.localName.startsWith(s)) return e;
                            e = e.parentNode
                        }
                        return null
                    }(this),
                    e = t && window.customElements.get(t.localName),
                    s = t && 2 === t[Ss];
                !t || e && s ? Ps.call(this, t) : Ms.call(this, t)
            }
            async function Ms(t) {
                await window.customElements.whenDefined(t.localName), 2 !== t[Ss] && await new Promise((e => (t[Es] ? ? = []).push(e))), Ps.call(this, t)
            }

            function Ps(t) {
                if (this.isConnected) {
                    if (t) {
                        t.keepAlive && t.forwardKeepAlive && (this.keepAlive = !0, this.setAttribute("keep-alive", ""));
                        const e = this.$.$$.d;
                        e && t.$.$$.f.append(e)
                    }
                    this[xs]()
                }
            }

            function As(t) {
                !(arguments.length > 1 && void 0 !== arguments[1] && arguments[1]) && window.customElements.get(t.tagName) || window.customElements.define(t.tagName, t)
            }
        },
        "../node_modules/vidstack/prod/chunks/vidstack-BPJwxG0c.js": (t, e, s) => {
            "use strict";
            s.d(e, {
                $: () => ne,
                F: () => bt,
                J: () => Ft,
                K: () => Rt,
                M: () => Xe,
                N: () => Gt,
                O: () => Wt,
                P: () => zs,
                Q: () => Qt,
                R: () => Jt,
                S: () => ge,
                T: () => we,
                U: () => Zt,
                W: () => te,
                X: () => ee,
                Z: () => se,
                _: () => ie,
                a: () => N,
                a0: () => re,
                a1: () => ae,
                a2: () => oe,
                a4: () => ke,
                a5: () => Ee,
                a6: () => $e,
                a8: () => Ce,
                a9: () => Me,
                aa: () => Pe,
                ab: () => Ae,
                ac: () => Le,
                ad: () => De,
                ae: () => We,
                af: () => Qe,
                ah: () => Je,
                ai: () => ns,
                aj: () => os,
                ak: () => us,
                al: () => ms,
                an: () => ws,
                ao: () => xs,
                aq: () => Ms,
                ar: () => Os,
                as: () => Is,
                at: () => Ds,
                au: () => Vs,
                aw: () => Kt,
                b: () => H,
                c: () => qt,
                d: () => St,
                i: () => B,
                s: () => j,
                t: () => Nt
            });
            var i = s("../node_modules/vidstack/prod/chunks/vidstack-B11i_cNc.js"),
                n = s("../node_modules/vidstack/prod/chunks/vidstack-VrKElWm_.js"),
                r = s("../node_modules/vidstack/prod/chunks/vidstack-BnqIpPdq.js"),
                a = s("../node_modules/vidstack/prod/chunks/vidstack-NiSULkLR.js"),
                o = s("../node_modules/vidstack/prod/chunks/vidstack-CzvK2UwB.js");
            const l = Symbol(0);
            var c;
            class h extends i.V {
                constructor() {
                    super(...arguments), this.A = [], this[c] = !1
                }
                get length() {
                    return this.A.length
                }
                get readonly() {
                    return this[n.L.Yc]
                }
                indexOf(t) {
                    return this.A.indexOf(t)
                }
                getById(t) {
                    return "" === t ? null : this.A.find((e => e.id === t)) ? ? null
                }
                toArray() {
                    return [...this.A]
                }[(c = n.L.Yc, Symbol.iterator)]() {
                    return this.A.values()
                }[n.L.da](t, e) {
                    const s = this.A.length;
                    "" + s in this || Object.defineProperty(this, s, {
                        get() {
                            return this.A[s]
                        }
                    }), this.A.includes(t) || (this.A.push(t), this.dispatchEvent(new i.D("add", {
                        detail: t,
                        trigger: e
                    })))
                }[n.L.cc](t, e) {
                    const s = this.A.indexOf(t);
                    s >= 0 && (this[n.L.Hf] ? .(t, e), this.A.splice(s, 1), this.dispatchEvent(new i.D("remove", {
                        detail: t,
                        trigger: e
                    })))
                }[n.L.z](t) {
                    for (const e of [...this.A]) this[n.L.cc](e, t);
                    this.A = [], this[n.L.Od](!1, t), this[n.L.Gf] ? .()
                }[n.L.Od](t, e) {
                    this[n.L.Yc] !== t && (this[n.L.Yc] = t, this.dispatchEvent(new i.D("readonly-change", {
                        detail: t,
                        trigger: e
                    })))
                }
            }
            const u = new i.W({
                    artist: "",
                    artwork: null,
                    audioTrack: null,
                    audioTracks: [],
                    autoPlay: !1,
                    autoPlayError: null,
                    audioGain: null,
                    buffered: new a.T,
                    canLoad: !1,
                    canLoadPoster: !1,
                    canFullscreen: !1,
                    canOrientScreen: (0, r.f)(),
                    canPictureInPicture: !1,
                    canPlay: !1,
                    clipStartTime: 0,
                    clipEndTime: 0,
                    controls: !1,
                    get iOSControls() {
                        return r.t && "video" === this.mediaType && (!this.playsInline || !i.X.fullscreenEnabled && this.fullscreen)
                    },
                    get nativeControls() {
                        return this.controls || this.iOSControls
                    },
                    controlsVisible: !1,
                    get controlsHidden() {
                        return !this.controlsVisible
                    },
                    crossOrigin: null,
                    ended: !1,
                    error: null,
                    fullscreen: !1,
                    get loop() {
                        return this.providedLoop || this.userPrefersLoop
                    },
                    logLevel: "silent",
                    mediaType: "unknown",
                    muted: !1,
                    paused: !0,
                    played: new a.T,
                    playing: !1,
                    playsInline: !1,
                    pictureInPicture: !1,
                    preload: "metadata",
                    playbackRate: 1,
                    qualities: [],
                    quality: null,
                    autoQuality: !1,
                    canSetQuality: !0,
                    canSetPlaybackRate: !0,
                    canSetVolume: !1,
                    canSetAudioGain: !1,
                    seekable: new a.T,
                    seeking: !1,
                    source: {
                        src: "",
                        type: ""
                    },
                    sources: [],
                    started: !1,
                    textTracks: [],
                    textTrack: null,
                    get hasCaptions() {
                        return this.textTracks.filter(o.i).length > 0
                    },
                    volume: 1,
                    waiting: !1,
                    realCurrentTime: 0,
                    get currentTime() {
                        return this.clipStartTime > 0 ? Math.max(0, Math.min(this.realCurrentTime - this.clipStartTime, this.duration)) : this.realCurrentTime
                    },
                    providedDuration: -1,
                    intrinsicDuration: 0,
                    get realDuration() {
                        return this.providedDuration > 0 ? this.providedDuration : this.intrinsicDuration
                    },
                    get duration() {
                        return this.clipEndTime > 0 ? this.clipEndTime - this.clipStartTime : Math.max(0, this.realDuration - this.clipStartTime)
                    },
                    get title() {
                        return this.providedTitle || this.inferredTitle
                    },
                    get poster() {
                        return this.providedPoster || this.inferredPoster
                    },
                    get viewType() {
                        return "unknown" !== this.providedViewType ? this.providedViewType : this.inferredViewType
                    },
                    get streamType() {
                        return "unknown" !== this.providedStreamType ? this.providedStreamType : this.inferredStreamType
                    },
                    get currentSrc() {
                        return this.source
                    },
                    get bufferedStart() {
                        const t = (0, a.g)(this.buffered) ? ? 0;
                        return Math.max(0, t - this.clipStartTime)
                    },
                    get bufferedEnd() {
                        const t = (0, a.b)(this.buffered) ? ? 0;
                        return Math.min(this.duration, Math.max(0, t - this.clipStartTime))
                    },
                    get seekableStart() {
                        const t = (0, a.g)(this.seekable) ? ? 0;
                        return Math.max(0, t - this.clipStartTime)
                    },
                    get seekableEnd() {
                        const t = this.canPlay ? (0, a.b)(this.seekable) ? ? 1 / 0 : 0;
                        return this.clipEndTime > 0 ? Math.max(this.clipEndTime, Math.max(0, t - this.clipStartTime)) : t
                    },
                    get seekableWindow() {
                        return Math.max(0, this.seekableEnd - this.seekableStart)
                    },
                    canAirPlay: !1,
                    canGoogleCast: !1,
                    remotePlaybackState: "disconnected",
                    remotePlaybackType: "none",
                    remotePlaybackLoader: null,
                    remotePlaybackInfo: null,
                    get isAirPlayConnected() {
                        return "airplay" === this.remotePlaybackType && "connected" === this.remotePlaybackState
                    },
                    get isGoogleCastConnected() {
                        return "google-cast" === this.remotePlaybackType && "connected" === this.remotePlaybackState
                    },
                    pointer: "fine",
                    orientation: "landscape",
                    width: 0,
                    height: 0,
                    mediaWidth: 0,
                    mediaHeight: 0,
                    lastKeyboardAction: null,
                    userBehindLiveEdge: !1,
                    liveEdgeTolerance: 10,
                    minLiveDVRWindow: 60,
                    get canSeek() {
                        return /unknown|on-demand|:dvr/.test(this.streamType) && Number.isFinite(this.seekableWindow) && (!this.live || /:dvr/.test(this.streamType) && this.seekableWindow >= this.minLiveDVRWindow)
                    },
                    get live() {
                        return this.streamType.includes("live") || !Number.isFinite(this.realDuration)
                    },
                    get liveEdgeStart() {
                        return this.live && Number.isFinite(this.seekableEnd) ? Math.max(0, (this.liveSyncPosition ? ? this.seekableEnd) - this.liveEdgeTolerance) : 0
                    },
                    get liveEdge() {
                        return this.live && (!this.canSeek || !this.userBehindLiveEdge && this.currentTime >= this.liveEdgeStart)
                    },
                    get liveEdgeWindow() {
                        return this.live && Number.isFinite(this.seekableEnd) ? this.seekableEnd - this.liveEdgeStart : 0
                    },
                    autoPlaying: !1,
                    providedTitle: "",
                    inferredTitle: "",
                    providedLoop: !1,
                    userPrefersLoop: !1,
                    providedPoster: "",
                    inferredPoster: "",
                    inferredViewType: "unknown",
                    providedViewType: "unknown",
                    providedStreamType: "unknown",
                    inferredStreamType: "unknown",
                    liveSyncPosition: null,
                    savedState: null
                }),
                d = new Set(["autoPlayError", "autoPlaying", "buffered", "canPlay", "error", "paused", "played", "playing", "seekable", "seeking", "waiting"]),
                p = new Set([...d, "ended", "inferredPoster", "inferredStreamType", "inferredTitle", "intrinsicDuration", "liveSyncPosition", "realCurrentTime", "savedState", "started", "userBehindLiveEdge"]);

            function f(t) {
                const e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1] ? d : p;
                u.reset(t, (t => e.has(t))), (0, i.Y)()
            }
            var m = s("../node_modules/vidstack/prod/chunks/vidstack-CUVgUi9M.js"),
                g = s("../node_modules/vidstack/prod/chunks/vidstack-BSXZsAhp.js"),
                v = s("../node_modules/vidstack/prod/chunks/vidstack-DM_McBs5.js"),
                b = s("../node_modules/vidstack/prod/chunks/vidstack-COCzjeeM.js"),
                y = s("../node_modules/vidstack/prod/chunks/vidstack-ksPACRiU.js");
            const w = i.X.fullscreenEnabled;
            class T extends i.a6 {
                constructor() {
                    super(...arguments), this.dc = !1, this.Pd = !1
                }
                get active() {
                    return this.Pd
                }
                get supported() {
                    return w
                }
                onConnect() {
                    (0, i.l)(i.X, "fullscreenchange", this.Qd.bind(this)), (0, i.l)(i.X, "fullscreenerror", this.Zc.bind(this)), (0, i.q)(this.Fa.bind(this))
                }
                async Fa() {
                    w && await this.exit()
                }
                Qd(t) {
                    const e = _(this.el);
                    e !== this.Pd && (e || (this.dc = !1), this.Pd = e, this.dispatch("fullscreen-change", {
                        detail: e,
                        trigger: t
                    }))
                }
                Zc(t) {
                    this.dc && (this.dispatch("fullscreen-error", {
                        detail: null,
                        trigger: t
                    }), this.dc = !1)
                }
                async enter() {
                    try {
                        if (this.dc = !0, !this.el || _(this.el)) return;
                        return k(), i.X.requestFullscreen(this.el)
                    } catch (t) {
                        throw this.dc = !1, t
                    }
                }
                async exit() {
                    if (this.el && _(this.el)) return k(), i.X.exitFullscreen()
                }
            }

            function _(t) {
                if (i.X.fullscreenElement === t) return !0;
                try {
                    return t.matches(i.X.fullscreenPseudoClass)
                } catch (t) {
                    return !1
                }
            }

            function k() {
                if (!w) throw Error("[vidstack] no fullscreen API")
            }
            class x extends i.a6 {
                constructor() {
                    super(...arguments), this.la = (0, i.f)(this.Jf()), this.Cb = (0, i.f)(!1)
                }
                get type() {
                    return this.la()
                }
                get locked() {
                    return this.Cb()
                }
                get portrait() {
                    return this.la().startsWith("portrait")
                }
                get landscape() {
                    return this.la().startsWith("landscape")
                }
                static# t = this.supported = (0, r.f)();
                get supported() {
                    return x.supported
                }
                onConnect() {
                    if (this.supported)(0, i.l)(screen.orientation, "change", this.Kf.bind(this));
                    else {
                        const t = window.matchMedia("(orientation: landscape)");
                        t.onchange = this.Kf.bind(this), (0, i.q)((() => t.onchange = null))
                    }(0, i.q)(this.Fa.bind(this))
                }
                async Fa() {
                    this.supported && this.Cb() && await this.unlock()
                }
                Kf(t) {
                    this.la.set(this.Jf()), this.dispatch("orientation-change", {
                        detail: {
                            orientation: (0, i.p)(this.la),
                            lock: this._c
                        },
                        trigger: t
                    })
                }
                async lock(t) {
                    (0, i.p)(this.Cb) || this._c === t || (this.Lf(), await screen.orientation.lock(t), this.Cb.set(!0), this._c = t)
                }
                async unlock() {
                    (0, i.p)(this.Cb) && (this.Lf(), this._c = void 0, await screen.orientation.unlock(), this.Cb.set(!1))
                }
                Lf() {
                    if (!this.supported) throw Error("[vidstack] no orientation API")
                }
                Jf() {
                    return this.supported ? window.screen.orientation.type : window.innerWidth >= window.innerHeight ? "landscape-primary" : "portrait-primary"
                }
            }

            function S(t) {
                return !(0, i.i)(t) && "width" in t && "height" in t && (0, i.j)(t.width) && (0, i.j)(t.height)
            }
            class E {
                constructor() {
                    let t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : void 0;
                    this.bc = t, this.G = null, this.f = null, this.Rd = -1
                }
                setTarget(t) {
                    this.G = t
                }
                getPlayer(t) {
                    return this.f || (t ? ? this.G) ? .dispatchEvent(new i.D("find-media-player", {
                        detail: t => {
                            this.f = t
                        },
                        bubbles: !0,
                        composed: !0
                    })), this.f
                }
                setPlayer(t) {
                    this.f = t
                }
                startLoading(t) {
                    this.s("media-start-loading", t)
                }
                startLoadingPoster(t) {
                    this.s("media-poster-start-loading", t)
                }
                requestAirPlay(t) {
                    this.s("media-airplay-request", t)
                }
                requestGoogleCast(t) {
                    this.s("media-google-cast-request", t)
                }
                play(t) {
                    this.s("media-play-request", t)
                }
                pause(t) {
                    this.s("media-pause-request", t)
                }
                mute(t) {
                    this.s("media-mute-request", t)
                }
                unmute(t) {
                    this.s("media-unmute-request", t)
                }
                enterFullscreen(t, e) {
                    this.s("media-enter-fullscreen-request", e, t)
                }
                exitFullscreen(t, e) {
                    this.s("media-exit-fullscreen-request", e, t)
                }
                lockScreenOrientation(t, e) {
                    this.s("media-orientation-lock-request", e, t)
                }
                unlockScreenOrientation(t) {
                    this.s("media-orientation-unlock-request", t)
                }
                enterPictureInPicture(t) {
                    this.s("media-enter-pip-request", t)
                }
                exitPictureInPicture(t) {
                    this.s("media-exit-pip-request", t)
                }
                seeking(t, e) {
                    this.s("media-seeking-request", e, t)
                }
                seek(t, e) {
                    this.s("media-seek-request", e, t)
                }
                seekToLiveEdge(t) {
                    this.s("media-live-edge-request", t)
                }
                changeVolume(t, e) {
                    this.s("media-volume-change-request", e, Math.max(0, Math.min(1, t)))
                }
                changeAudioTrack(t, e) {
                    this.s("media-audio-track-change-request", e, t)
                }
                changeQuality(t, e) {
                    this.s("media-quality-change-request", e, t)
                }
                requestAutoQuality(t) {
                    this.changeQuality(-1, t)
                }
                changeTextTrackMode(t, e, s) {
                    this.s("media-text-track-change-request", s, {
                        index: t,
                        mode: e
                    })
                }
                changePlaybackRate(t, e) {
                    this.s("media-rate-change-request", e, t)
                }
                changeAudioGain(t, e) {
                    this.s("media-audio-gain-change-request", e, t)
                }
                resumeControls(t) {
                    this.s("media-resume-controls-request", t)
                }
                pauseControls(t) {
                    this.s("media-pause-controls-request", t)
                }
                togglePaused(t) {
                    const e = this.getPlayer(t ? .target);
                    e && (e.state.paused ? this.play(t) : this.pause(t))
                }
                toggleControls(t) {
                    const e = this.getPlayer(t ? .target);
                    e && (e.controls.showing ? e.controls.hide(0, t) : e.controls.show(0, t))
                }
                toggleMuted(t) {
                    const e = this.getPlayer(t ? .target);
                    e && (e.state.muted ? this.unmute(t) : this.mute(t))
                }
                toggleFullscreen(t, e) {
                    const s = this.getPlayer(e ? .target);
                    s && (s.state.fullscreen ? this.exitFullscreen(t, e) : this.enterFullscreen(t, e))
                }
                togglePictureInPicture(t) {
                    const e = this.getPlayer(t ? .target);
                    e && (e.state.pictureInPicture ? this.exitPictureInPicture(t) : this.enterPictureInPicture(t))
                }
                showCaptions(t) {
                    const e = this.getPlayer(t ? .target);
                    if (!e) return;
                    let s = e.state.textTracks,
                        i = this.Rd;
                    s[i] && (0, o.i)(s[i]) || (i = -1), -1 === i && (i = s.findIndex((t => (0, o.i)(t) && t.default))), -1 === i && (i = s.findIndex((t => (0, o.i)(t)))), i >= 0 && this.changeTextTrackMode(i, "showing", t), this.Rd = -1
                }
                disableCaptions(t) {
                    const e = this.getPlayer(t ? .target);
                    if (!e) return;
                    const s = e.state.textTracks,
                        i = e.state.textTrack;
                    if (i) {
                        const e = s.indexOf(i);
                        this.changeTextTrackMode(e, "disabled", t), this.Rd = e
                    }
                }
                toggleCaptions(t) {
                    const e = this.getPlayer(t ? .target);
                    e && (e.state.textTrack ? this.disableCaptions() : this.showCaptions())
                }
                userPrefersLoopChange(t, e) {
                    this.s("media-user-loop-change-request", e, t)
                }
                s(t, e, s) {
                    const n = new i.D(t, {
                        bubbles: !0,
                        composed: !0,
                        cancelable: !0,
                        detail: s,
                        trigger: e
                    });
                    let r = e ? .target || null;
                    r && r instanceof i.C && (r = r.el);
                    const a = !r || r === document || r === window || r === document.body || this.f ? .el && r instanceof Node && !this.f.el.contains(r);
                    r = a ? this.G ? ? this.getPlayer() ? .el : r ? ? this.G, this.f && ("media-play-request" !== t || this.f.state.canLoad) ? this.f.canPlayQueue.k(t, (() => r ? .dispatchEvent(n))) : r ? .dispatchEvent(n)
                }
                Va(t) {}
            }
            class $ extends i.a6 {}
            class C extends $ {
                constructor() {
                    super(...arguments), this.Sd = -2, this.Gb = !1, this.Sf = (0, i.f)(!1), this.Td = (0, i.f)(!1), this.ec = null, this.Ud = (0, i.f)(!0), this.defaultDelay = 2e3
                }
                get canIdle() {
                    return this.Ud()
                }
                set canIdle(t) {
                    this.Ud.set(t)
                }
                get hideOnMouseLeave() {
                    const {
                        hideControlsOnMouseLeave: t
                    } = this.$props;
                    return this.Sf() || t()
                }
                set hideOnMouseLeave(t) {
                    this.Sf.set(t)
                }
                get showing() {
                    return this.$state.controlsVisible()
                }
                show() {
                    let t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
                        e = arguments.length > 1 ? arguments[1] : void 0;
                    this.Vd(), this.Gb || this.ad(!0, t, e)
                }
                hide() {
                    let t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.defaultDelay,
                        e = arguments.length > 1 ? arguments[1] : void 0;
                    this.Vd(), this.Gb || this.ad(!1, t, e)
                }
                pause(t) {
                    this.Gb = !0, this.Vd(), this.ad(!0, 0, t)
                }
                resume(t) {
                    this.Gb = !1, this.$state.paused() || this.ad(!1, this.defaultDelay, t)
                }
                onConnect() {
                    (0, i.g)(this.Hb.bind(this))
                }
                Hb() {
                    const {
                        viewType: t
                    } = this.$state;
                    if (!this.Ud()) return;
                    if ("audio" === t()) return void this.show();
                    (0, i.g)(this.$h.bind(this)), (0, i.g)(this.fc.bind(this));
                    const e = this.gc.bind(this),
                        s = this.ib.bind(this);
                    this.listen("can-play", (t => this.show(0, t))), this.listen("play", e), this.listen("pause", s), this.listen("auto-play-fail", s)
                }
                $h() {
                    const {
                        started: t,
                        pointer: e,
                        paused: s
                    } = this.$state;
                    if (!t() || "fine" !== e()) return;
                    const n = this.hideOnMouseLeave;
                    n && this.Td() || (0, i.g)((() => {
                        s() || this.listen("pointermove", this.Tf.bind(this))
                    })), n && (this.listen("mouseenter", this.ai.bind(this)), this.listen("mouseleave", this.bi.bind(this)))
                }
                fc() {
                    const {
                        paused: t,
                        started: e,
                        autoPlayError: s
                    } = this.$state;
                    if (t() || s() && !e()) return;
                    const n = this.Tf.bind(this);
                    (0, i.g)((() => {
                        const t = ["coarse" === this.$state.pointer() ? "touchend" : "pointerup", "keydown"];
                        for (const e of t) this.listen(e, n, {
                            passive: !1
                        })
                    }))
                }
                gc(t) {
                    this.show(0, t), this.hide(void 0, t)
                }
                ib(t) {
                    this.show(0, t)
                }
                ai(t) {
                    this.Td.set(!1), this.show(0, t), this.hide(void 0, t)
                }
                bi(t) {
                    this.Td.set(!0), this.hide(0, t)
                }
                Vd() {
                    window.clearTimeout(this.Sd), this.Sd = -1
                }
                Tf(t) {
                    t.MEDIA_GESTURE || this.Gb || (0, a.j)(t) || ((0, i.R)(t) && ("Escape" === t.key ? (this.el ? .focus(), this.ec = null) : this.ec && (t.preventDefault(), requestAnimationFrame((() => {
                        this.ec ? .focus(), this.ec = null
                    })))), this.show(0, t), this.hide(this.defaultDelay, t))
                }
                ad(t, e, s) {
                    0 !== e ? this.Sd = window.setTimeout((() => {
                        this.scope && this.E(t && !this.Gb, s)
                    }), e) : this.E(t, s)
                }
                E(t, e) {
                    this.$state.controlsVisible() !== t && (this.$state.controlsVisible.set(t), !t && document.activeElement && this.el ? .contains(document.activeElement) && (this.ec = document.activeElement, requestAnimationFrame((() => {
                        this.el ? .focus({
                            preventScroll: !0
                        })
                    }))), this.dispatch("controls-change", {
                        detail: t,
                        trigger: e
                    }))
                }
            }
            var M = function(t, e, s) {
                var i = null,
                    n = null,
                    r = s && s.leading,
                    a = s && s.trailing;
                null == r && (r = !0);
                null == a && (a = !r);
                1 == r && (a = !1);
                var o = function() {
                        i && (clearTimeout(i), i = null)
                    },
                    l = function() {
                        var s = r && !i,
                            o = this,
                            l = arguments;
                        if (n = function() {
                                return t.apply(o, l)
                            }, i || (i = setTimeout((function() {
                                if (i = null, a) return n()
                            }), e)), s) return s = !1, n()
                    };
                return l.cancel = o, l.flush = function() {
                    var t = n;
                    o(), t && t()
                }, l
            };
            class P {
                constructor() {
                    this.playerId = "vds-player", this.mediaId = null, this.H = {
                        volume: null,
                        muted: null,
                        audioGain: null,
                        time: null,
                        lang: null,
                        captions: null,
                        rate: null,
                        quality: null
                    }, this.saveTimeThrottled = M(this.saveTime.bind(this), 1e3)
                }
                async getVolume() {
                    return this.H.volume
                }
                async setVolume(t) {
                    this.H.volume = t, this.save()
                }
                async getMuted() {
                    return this.H.muted
                }
                async setMuted(t) {
                    this.H.muted = t, this.save()
                }
                async getTime() {
                    return this.H.time
                }
                async setTime(t, e) {
                    const s = t < 0;
                    this.H.time = s ? null : t, s || e ? this.saveTime() : this.saveTimeThrottled()
                }
                async getLang() {
                    return this.H.lang
                }
                async setLang(t) {
                    this.H.lang = t, this.save()
                }
                async getCaptions() {
                    return this.H.captions
                }
                async setCaptions(t) {
                    this.H.captions = t, this.save()
                }
                async getPlaybackRate() {
                    return this.H.rate
                }
                async setPlaybackRate(t) {
                    this.H.rate = t, this.save()
                }
                async getAudioGain() {
                    return this.H.audioGain
                }
                async setAudioGain(t) {
                    this.H.audioGain = t, this.save()
                }
                async getVideoQuality() {
                    return this.H.quality
                }
                async setVideoQuality(t) {
                    this.H.quality = t, this.save()
                }
                onChange(t, e) {
                    let s = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "vds-player";
                    const i = s ? localStorage.getItem(s) : null,
                        n = e ? localStorage.getItem(e) : null;
                    this.playerId = s, this.mediaId = e, this.H = {
                        volume: null,
                        muted: null,
                        audioGain: null,
                        lang: null,
                        captions: null,
                        rate: null,
                        quality: null,
                        ...i ? JSON.parse(i) : {},
                        time: n ? +n : null
                    }
                }
                save() {
                    if (!this.playerId) return;
                    const t = JSON.stringify({ ...this.H,
                        time: void 0
                    });
                    localStorage.setItem(this.playerId, t)
                }
                saveTime() {
                    if (!this.mediaId) return;
                    const t = (this.H.time ? ? 0).toString();
                    localStorage.setItem(this.mediaId, t)
                }
            }
            class A {
                constructor() {
                    this.priority = 0, this.Uf = !0, this.m = null, this.J = null, this.va = new Set
                }
                canRender(t, e) {
                    return !!e
                }
                attach(t) {
                    this.m = t, t && (t.textTracks.onchange = this.E.bind(this))
                }
                addTrack(t) {
                    this.va.add(t), this.ci(t)
                }
                removeTrack(t) {
                    t[o.a._] ? .remove ? .(), t[o.a._] = null, this.va.delete(t)
                }
                changeTrack(t) {
                    const e = t ? .[o.a._];
                    e && "showing" !== e.track.mode && (e.track.mode = "showing"), this.J = t
                }
                setDisplay(t) {
                    this.Uf = t, this.E()
                }
                detach() {
                    this.m && (this.m.textTracks.onchange = null);
                    for (const t of this.va) this.removeTrack(t);
                    this.va.clear(), this.m = null, this.J = null
                }
                ci(t) {
                    if (!this.m) return;
                    const e = t[o.a._] ? ? = this.di(t);
                    (0, a.i)(e) && (this.m.append(e), e.track.mode = e.default ? "showing" : "disabled")
                }
                di(t) {
                    const e = document.createElement("track"),
                        s = t.default || "showing" === t.mode,
                        i = t.src && "vtt" === t.type;
                    return e.id = t.id, e.src = i ? t.src : "", e.label = t.label, e.kind = t.kind, e.default = s, t.language && (e.srclang = t.language), s && !i && this.Vf(t, e.track), e
                }
                Vf(t, e) {
                    if (!(t.src && "vtt" === t.type || e.cues ? .length))
                        for (const s of t.cues) e.addCue(s)
                }
                E(t) {
                    for (const e of this.va) {
                        const s = e[o.a._];
                        if (!s) continue;
                        if (!this.Uf) {
                            s.track.mode = s.managed ? "hidden" : "disabled";
                            continue
                        }
                        const i = "showing" === s.track.mode;
                        i && this.Vf(e, s.track), e.setMode(i ? "showing" : "disabled", t)
                    }
                }
            }
            class L {
                constructor(t) {
                    this.a = t, this.m = null, this.bd = [], this.Wf = !1, this.wa = null, this.jb = null;
                    const e = t.textTracks;
                    this.Wd = e, (0, i.g)(this.Xd.bind(this)), (0, i.q)(this.ei.bind(this)), (0, i.l)(e, "add", this.Yd.bind(this)), (0, i.l)(e, "remove", this.fi.bind(this)), (0, i.l)(e, "mode-change", this.Ha.bind(this))
                }
                Xd() {
                    const {
                        nativeControls: t
                    } = this.a.$state;
                    this.Wf = t(), this.Ha()
                }
                add(t) {
                    this.bd.push(t), this.Ha()
                }
                remove(t) {
                    t.detach(), this.bd.splice(this.bd.indexOf(t), 1), this.Ha()
                }
                Xf(t) {
                    requestAnimationFrame((() => {
                        if (this.m = t, t) {
                            this.wa = new A, this.wa.attach(t);
                            for (const t of this.Wd) this.Yf(t)
                        }
                        this.Ha()
                    }))
                }
                Yf(t) {
                    (0, o.i)(t) && this.wa ? .addTrack(t)
                }
                gi(t) {
                    (0, o.i)(t) && this.wa ? .removeTrack(t)
                }
                Yd(t) {
                    this.Yf(t.detail)
                }
                fi(t) {
                    this.gi(t.detail)
                }
                Ha() {
                    const t = this.Wd.selected;
                    if (this.m && (this.Wf || t ? .[o.a.Mf])) return this.jb ? .changeTrack(null), this.wa ? .setDisplay(!0), void this.wa ? .changeTrack(t);
                    if (this.wa ? .setDisplay(!1), this.wa ? .changeTrack(null), !t) return void this.jb ? .changeTrack(null);
                    const e = this.bd.sort(((t, e) => t.priority - e.priority)).find((e => e.canRender(t, this.m)));
                    this.jb !== e && (this.jb ? .detach(), e ? .attach(this.m), this.jb = e ? ? null), e ? .changeTrack(t)
                }
                ei() {
                    this.wa ? .detach(), this.wa = null, this.jb ? .detach(), this.jb = null
                }
            }
            var O = function(t, e, s) {
                var i = null,
                    n = null,
                    r = function() {
                        i && (clearTimeout(i), n = null, i = null)
                    },
                    a = function() {
                        if (!e) return t.apply(this, arguments);
                        var a = this,
                            o = arguments,
                            l = s && !i;
                        return r(), n = function() {
                            t.apply(a, o)
                        }, i = setTimeout((function() {
                            if (i = null, !l) {
                                var t = n;
                                return n = null, t()
                            }
                        }), e), l ? n() : void 0
                    };
                return a.cancel = r, a.flush = function() {
                    var t = n;
                    r(), t && t()
                }, a
            };
            class I extends h {
                constructor() {
                    super(), this.Z = !1, this.kb = {}, this.lb = null, this.mb = null, this.bg = O((async () => {
                        if (!this.Z) return;
                        !this.mb && this.lb && (this.mb = await this.lb.getLang());
                        const t = await (this.lb ? .getCaptions()),
                            e = [
                                ["captions", "subtitles"], "chapters", "descriptions", "metadata"
                            ];
                        for (const s of e) {
                            const e = this.getByKind(s);
                            if (e.find((t => "showing" === t.mode))) continue;
                            const n = this.mb ? e.find((t => t.language === this.mb)) : null,
                                r = (0, i.v)(s) ? this.kb[s.find((t => this.kb[t])) || ""] : this.kb[s],
                                a = n ? ? r,
                                l = a && (0, o.i)(a);
                            !a || l && !1 === t || (a.mode = "showing", l && this.cg(a))
                        }
                    }), 300), this.Zd = null, this.ag = this.hi.bind(this)
                }
                get selected() {
                    return this.A.find((t => "showing" === t.mode && (0, o.i)(t))) ? ? null
                }
                get selectedIndex() {
                    const t = this.selected;
                    return t ? this.indexOf(t) : -1
                }
                get preferredLang() {
                    return this.mb
                }
                set preferredLang(t) {
                    this.mb = t, this.$f(t)
                }
                add(t, e) {
                    const s = t instanceof o.T ? t : new o.T(t),
                        i = "captions" === t.kind || "subtitles" === t.kind ? "captions" : t.kind;
                    return this.kb[i] && t.default && delete t.default, s.addEventListener("mode-change", this.ag), this[n.L.da](s, e), s[o.a.Db] = this[o.a.Db], this.Z && s[o.a.Z](), t.default && (this.kb[i] = s), this.bg(), this
                }
                remove(t, e) {
                    if (this.Zd = t, this.A.includes(t)) return t === this.kb[t.kind] && delete this.kb[t.kind], t.mode = "disabled", t[o.a.hb] = null, t.removeEventListener("mode-change", this.ag), this[n.L.cc](t, e), this.Zd = null, this
                }
                clear(t) {
                    for (const e of [...this.A]) this.remove(e, t);
                    return this
                }
                getByKind(t) {
                    const e = Array.isArray(t) ? t : [t];
                    return this.A.filter((t => e.includes(t.kind)))
                }[o.a.Z]() {
                    if (!this.Z) {
                        for (const t of this.A) t[o.a.Z]();
                        this.Z = !0, this.bg()
                    }
                }
                hi(t) {
                    const e = t.detail;
                    if (this.lb && (0, o.i)(e) && e !== this.Zd && this.cg(e), "showing" === e.mode) {
                        const t = (0, o.i)(e) ? ["captions", "subtitles"] : [e.kind];
                        for (const s of this.A) "showing" === s.mode && s != e && t.includes(s.kind) && (s.mode = "disabled")
                    }
                    this.dispatchEvent(new i.D("mode-change", {
                        detail: t.detail,
                        trigger: t
                    }))
                }
                cg(t) {
                    "disabled" !== t.mode && this.$f(t.language), this.lb ? .setCaptions ? .("showing" === t.mode)
                }
                $f(t) {
                    this.lb ? .setLang ? .(this.mb = t)
                }
                setStorage(t) {
                    this.lb = t
                }
            }
            const q = Symbol(0);
            class D extends h {
                get selected() {
                    return this.A.find((t => t.selected)) ? ? null
                }
                get selectedIndex() {
                    return this.A.findIndex((t => t.selected))
                }[n.L.Hf](t, e) {
                    this[n.L.ea](t, !1, e)
                }[n.L.da](t, e) {
                    t[q] = !1, Object.defineProperty(t, "selected", {
                        get() {
                            return this[q]
                        },
                        set: e => {
                            this.readonly || (this[n.L.If] ? .(), this[n.L.ea](t, e))
                        }
                    }), super[n.L.da](t, e)
                }[n.L.ea](t, e, s) {
                    if (e === t ? .[q]) return;
                    const n = this.selected;
                    t && (t[q] = e);
                    (e ? n !== t : n === t) && (n && (n[q] = !1), this.dispatchEvent(new i.D("change", {
                        detail: {
                            prev: n,
                            current: this.selected
                        },
                        trigger: s
                    })))
                }
            }
            class z extends D {}
            class V extends D {
                constructor() {
                    super(...arguments), this.cd = !1, this.switch = "current"
                }
                get auto() {
                    return this.cd || this.readonly
                }[n.L.If]() {
                    this[g.Q.Wa](!1)
                }[n.L.Gf](t) {
                    this[g.Q.Ia] = void 0, this[g.Q.Wa](!1, t)
                }
                autoSelect(t) {
                    this.readonly || this.cd || !this[g.Q.Ia] || (this[g.Q.Ia] ? .(t), this[g.Q.Wa](!0, t))
                }
                getBySrc(t) {
                    return this.A.find((e => e.src === t))
                }[g.Q.Wa](t, e) {
                    this.cd !== t && (this.cd = t, this.dispatchEvent(new i.D("auto-change", {
                        detail: t,
                        trigger: e
                    })))
                }
            }

            function j(t, e) {
                return [...t].sort(e ? R : F)
            }

            function F(t, e) {
                return t.height === e.height ? (t.bitrate ? ? 0) - (e.bitrate ? ? 0) : t.height - e.height
            }

            function R(t, e) {
                return e.height === t.height ? (e.bitrate ? ? 0) - (t.bitrate ? ? 0) : e.height - t.height
            }

            function B(t) {
                return t instanceof HTMLAudioElement
            }

            function N(t) {
                return t instanceof HTMLVideoElement
            }

            function H(t) {
                return t instanceof HTMLIFrameElement
            }
            const G = new Set(["Shift", "Alt", "Meta", "Control"]),
                W = 'input, textarea, select, [contenteditable], [role^="menuitem"], [role="timer"]';
            class U extends $ {
                constructor(t) {
                    super(), this.a = t, this.Ib = null
                }
                onConnect() {
                    (0, i.g)(this.ii.bind(this))
                }
                ii() {
                    const {
                        keyDisabled: t,
                        keyTarget: e
                    } = this.$props;
                    if (t()) return;
                    const s = "player" === e() ? this.el : document,
                        n = (0, i.f)(!1);
                    s === this.el ? (this.listen("focusin", (() => n.set(!0))), this.listen("focusout", (t => {
                        this.el.contains(t.target) || n.set(!1)
                    }))) : ((0, i.p)(n) || n.set(document.querySelector("[data-media-player]") === this.el), (0, i.l)(document, "focusin", (t => {
                        const e = t.composedPath().find((t => t instanceof Element && "media-player" === t.localName));
                        void 0 !== e && n.set(this.el === e)
                    }))), (0, i.g)((() => {
                        n() && ((0, i.l)(s, "keyup", this.hc.bind(this)), (0, i.l)(s, "keydown", this.ic.bind(this)), (0, i.l)(s, "keydown", this.ji.bind(this), {
                            capture: !0
                        }))
                    }))
                }
                hc(t) {
                    const e = document.activeElement;
                    if (!t.key || !this.$state.canSeek() || e ? .matches(W)) return;
                    let {
                        method: s,
                        value: n
                    } = this._d(t);
                    if (!(0, i.i)(n) && !(0, i.v)(n)) return n ? .onKeyUp ? .({
                        event: t,
                        player: this.a.player,
                        remote: this.a.remote
                    }), void n ? .callback ? .(t, this.a.remote);
                    if (s ? .startsWith("seek") && (t.preventDefault(), t.stopPropagation(), this.Ib ? (this.dg(t, "seekForward" === s), this.Ib = null) : (this.a.remote.seek(this.dd, t), this.dd = void 0)), s ? .startsWith("volume")) {
                        const e = this.el.querySelector("[data-media-volume-slider]");
                        e ? .dispatchEvent(new KeyboardEvent("keyup", {
                            key: "volumeUp" === s ? "Up" : "Down",
                            shiftKey: t.shiftKey,
                            trigger: t
                        }))
                    }
                }
                ic(t) {
                    if (!t.key || G.has(t.key)) return;
                    const e = document.activeElement;
                    if (e ? .matches(W) || (0, i.y)(t) && e ? .matches('button, [role="button"]')) return;
                    let {
                        method: s,
                        value: n
                    } = this._d(t), r = !t.metaKey && /^[0-9]$/.test(t.key);
                    if (!(0, i.i)(n) && !(0, i.v)(n) && !r) return n ? .onKeyDown ? .({
                        event: t,
                        player: this.a.player,
                        remote: this.a.remote
                    }), void n ? .callback ? .(t, this.a.remote);
                    if (!s && r) return t.preventDefault(), t.stopPropagation(), void this.a.remote.seek(this.$state.duration() / 10 * Number(t.key), t);
                    if (s) {
                        switch (t.preventDefault(), t.stopPropagation(), s) {
                            case "seekForward":
                            case "seekBackward":
                                this.Ja(t, s, "seekForward" === s);
                                break;
                            case "volumeUp":
                            case "volumeDown":
                                const e = this.el.querySelector("[data-media-volume-slider]");
                                if (e) e.dispatchEvent(new KeyboardEvent("keydown", {
                                    key: "volumeUp" === s ? "Up" : "Down",
                                    shiftKey: t.shiftKey,
                                    trigger: t
                                }));
                                else {
                                    const e = t.shiftKey ? .1 : .05;
                                    this.a.remote.changeVolume(this.$state.volume() + ("volumeUp" === s ? +e : -e), t)
                                }
                                break;
                            case "toggleFullscreen":
                                this.a.remote.toggleFullscreen("prefer-media", t);
                                break;
                            case "speedUp":
                            case "slowDown":
                                const i = this.$state.playbackRate();
                                this.a.remote.changePlaybackRate(Math.max(.25, Math.min(2, i + ("speedUp" === s ? .25 : -.25))), t);
                                break;
                            default:
                                this.a.remote[s] ? .(t)
                        }
                        this.$state.lastKeyboardAction.set({
                            action: s,
                            event: t
                        })
                    }
                }
                ji(t) {
                    var e;
                    (B(e = t.target) || N(e)) && this._d(t).method && t.preventDefault()
                }
                _d(t) {
                    const e = { ...this.$props.keyShortcuts(),
                            ...this.a.ariaKeys
                        },
                        s = Object.keys(e).find((s => {
                            const n = e[s],
                                r = (0, i.v)(n) ? n.join(" ") : (0, i.i)(n) ? n : n ? .keys;
                            return ((0, i.v)(r) ? r : r ? .split(" ")) ? .some((e => {
                                return (s = e, s.replace(/Shift\+(\d)/g, ((t, e) => Y[e - 1]))).replace(/Control/g, "Ctrl").split("+").every((e => G.has(e) ? t[e.toLowerCase() + "Key"] : t.key === e.replace("Space", " ")));
                                var s
                            }))
                        }));
                    return {
                        method: s,
                        value: s ? e[s] : null
                    }
                }
                ki(t, e) {
                    const s = t.shiftKey ? 10 : 5;
                    return this.dd = Math.max(0, Math.min((this.dd ? ? this.$state.currentTime()) + ("seekForward" === e ? +s : -s), this.$state.duration()))
                }
                dg(t, e) {
                    this.Ib ? .dispatchEvent(new KeyboardEvent(t.type, {
                        key: e ? "Right" : "Left",
                        shiftKey: t.shiftKey,
                        trigger: t
                    }))
                }
                Ja(t, e, s) {
                    this.$state.canSeek() && (this.Ib || (this.Ib = this.el.querySelector("[data-media-time-slider]")), this.Ib ? this.dg(t, s) : this.a.remote.seeking(this.ki(t, e), t))
                }
            }
            const Y = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
            class X extends i.a6 {
                constructor(t) {
                    super(), this.$d = t
                }
                onAttach(t) {
                    const {
                        $props: e,
                        ariaKeys: s
                    } = (0, m.u)(), n = t.getAttribute("aria-keyshortcuts");
                    if (n) return s[this.$d] = n, void(0, i.q)((() => {
                        delete s[this.$d]
                    }));
                    const r = e.keyShortcuts()[this.$d];
                    if (r) {
                        const e = (0, i.v)(r) ? r.join(" ") : (0, i.i)(r) ? r : r ? .keys;
                        t.setAttribute("aria-keyshortcuts", (0, i.v)(e) ? e.join(" ") : e)
                    }
                }
            }
            class Q {
                constructor() {
                    this.name = "audio"
                }
                canPlay(t) {
                    return !!(0, r.i)(t) && (!(0, i.i)(t.src) || "?" === t.type || (0, r.u)(this.target, t.type))
                }
                mediaType() {
                    return "audio"
                }
                async load(t) {
                    return new((await s.e(118).then(s.bind(s, "../node_modules/vidstack/prod/providers/vidstack-audio.js"))).AudioProvider)(this.target, t)
                }
            }
            class K {
                constructor() {
                    this.name = "video"
                }
                canPlay(t) {
                    return !!(0, r.a)(t) && (!(0, i.i)(t.src) || "?" === t.type || (0, r.c)(this.target, t.type))
                }
                mediaType() {
                    return "video"
                }
                async load(t) {
                    return new((await s.e(187).then(s.bind(s, "../node_modules/vidstack/prod/providers/vidstack-video.js"))).VideoProvider)(this.target, t)
                }
            }
            class J extends K {
                constructor() {
                    super(...arguments), this.name = "dash"
                }
                static# t = this.supported = (0, r.v)();
                canPlay(t) {
                    return J.supported && (0, r.q)(t)
                }
                async load(t) {
                    return new((await s.e(168).then(s.bind(s, "../node_modules/vidstack/prod/providers/vidstack-dash.js"))).DASHProvider)(this.target, t)
                }
            }
            class Z extends K {
                constructor() {
                    super(...arguments), this.name = "hls"
                }
                static# t = this.supported = (0, r.s)();
                canPlay(t) {
                    return Z.supported && (0, r.p)(t)
                }
                async load(t) {
                    return new((await s.e(219).then(s.bind(s, "../node_modules/vidstack/prod/providers/vidstack-hls.js"))).HLSProvider)(this.target, t)
                }
            }
            class tt {
                constructor() {
                    this.name = "vimeo"
                }
                preconnect() {
                    const t = ["https://i.vimeocdn.com", "https://f.vimeocdn.com", "https://fresnel.vimeocdn.com"];
                    for (const e of t)(0, b.p)(e)
                }
                canPlay(t) {
                    return (0, i.i)(t.src) && "video/vimeo" === t.type
                }
                mediaType() {
                    return "video"
                }
                async load(t) {
                    return new((await s.e(153).then(s.bind(s, "../node_modules/vidstack/prod/providers/vidstack-vimeo.js"))).VimeoProvider)(this.target, t)
                }
                async loadPoster(t, e, n) {
                    const {
                        resolveVimeoVideoId: r,
                        getVimeoVideoInfo: a
                    } = await s.e(591).then(s.bind(s, "../node_modules/vidstack/prod/chunks/vidstack-BTBUzdbF.js"));
                    if (!(0, i.i)(t.src)) return null;
                    const {
                        videoId: o
                    } = r(t.src);
                    return o ? a(o, n).then((t => t ? t.poster : null)) : null
                }
            }
            class et {
                constructor() {
                    this.name = "youtube"
                }
                preconnect() {
                    const t = ["https://www.google.com", "https://i.ytimg.com", "https://googleads.g.doubleclick.net", "https://static.doubleclick.net"];
                    for (const e of t)(0, b.p)(e)
                }
                canPlay(t) {
                    return (0, i.i)(t.src) && "video/youtube" === t.type
                }
                mediaType() {
                    return "video"
                }
                async load(t) {
                    return new((await s.e(637).then(s.bind(s, "../node_modules/vidstack/prod/providers/vidstack-youtube.js"))).YouTubeProvider)(this.target, t)
                }
                async loadPoster(t, e, n) {
                    const {
                        findYouTubePoster: r,
                        resolveYouTubeVideoId: a
                    } = await s.e(916).then(s.bind(s, "../node_modules/vidstack/prod/chunks/vidstack-DscYSLiW.js")), o = (0, i.i)(t.src) && a(t.src);
                    return o ? r(o, n) : null
                }
            }
            const st = Symbol(0),
                it = ["autoPlay", "canAirPlay", "canFullscreen", "canGoogleCast", "canLoad", "canLoadPoster", "canPictureInPicture", "canPlay", "canSeek", "ended", "fullscreen", "isAirPlayConnected", "isGoogleCastConnected", "live", "liveEdge", "loop", "mediaType", "muted", "paused", "pictureInPicture", "playing", "playsInline", "remotePlaybackState", "remotePlaybackType", "seeking", "started", "streamType", "viewType", "waiting"],
                nt = {
                    artist: "",
                    artwork: null,
                    autoplay: !1,
                    autoPlay: !1,
                    clipStartTime: 0,
                    clipEndTime: 0,
                    controls: !1,
                    currentTime: 0,
                    crossorigin: null,
                    crossOrigin: null,
                    duration: -1,
                    fullscreenOrientation: "landscape",
                    googleCast: {},
                    load: "visible",
                    posterLoad: "visible",
                    logLevel: "silent",
                    loop: !1,
                    muted: !1,
                    paused: !0,
                    playsinline: !1,
                    playsInline: !1,
                    playbackRate: 1,
                    poster: "",
                    preload: "metadata",
                    preferNativeHLS: !1,
                    src: "",
                    title: "",
                    controlsDelay: 2e3,
                    hideControlsOnMouseLeave: !1,
                    viewType: "unknown",
                    streamType: "unknown",
                    volume: 1,
                    liveEdgeTolerance: 10,
                    minLiveDVRWindow: 60,
                    keyDisabled: !1,
                    keyTarget: "player",
                    keyShortcuts: {
                        togglePaused: "k Space",
                        toggleMuted: "m",
                        toggleFullscreen: "f",
                        togglePictureInPicture: "i",
                        toggleCaptions: "c",
                        seekBackward: "j J ArrowLeft",
                        seekForward: "l L ArrowRight",
                        volumeUp: "ArrowUp",
                        volumeDown: "ArrowDown",
                        speedUp: ">",
                        slowDown: "<"
                    },
                    storage: null
                };
            class rt extends $ {
                constructor(t, e) {
                    super(), this.la = t, this.La = e
                }
                async onAttach(t) {
                    const e = this.$props[this.la]();
                    if ("eager" === e) requestAnimationFrame(this.La);
                    else if ("idle" === e)(0, i.a7)(this.La);
                    else if ("visible" === e) {
                        let e, s = new IntersectionObserver((t => {
                            this.scope && t[0].isIntersecting && (e ? .(), e = void 0, this.La())
                        }));
                        s.observe(t), e = (0, i.q)((() => s.disconnect()))
                    }
                }
            }
            class at {
                constructor(t, e) {
                    var s = this;
                    this.V = t, this.a = e, this.c = function(t) {
                        for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++) n[r - 1] = arguments[r];
                        s.V(new i.D(t, {
                            detail: n ? .[0],
                            trigger: n ? .[1]
                        }))
                    }
                }
                async Ga(t, e) {
                    return (0, i.T)((async () => {
                        this.a;
                        const {
                            autoPlay: s,
                            canPlay: n,
                            started: r,
                            duration: a,
                            seekable: o,
                            buffered: l,
                            remotePlaybackInfo: c,
                            playsInline: h,
                            savedState: u,
                            source: d
                        } = this.a.$state;
                        if (n()) return;
                        const p = {
                            duration: t ? .duration ? ? a(),
                            seekable: t ? .seekable ? ? o(),
                            buffered: t ? .buffered ? ? l(),
                            provider: this.a.$provider()
                        };
                        this.c("can-play", p, e), (0, i.Y)();
                        let f = this.a.$provider(),
                            {
                                storage: m,
                                qualities: g
                            } = this.a,
                            {
                                muted: v,
                                volume: b,
                                clipStartTime: y,
                                playbackRate: w
                            } = this.a.$props;
                        await (m ? .onLoad ? .(d()));
                        const T = u() ? .currentTime,
                            _ = u() ? .paused,
                            k = await (m ? .getTime()),
                            x = T ? ? k ? ? y(),
                            S = _ || !1 !== _ && !r() && s();
                        if (f) {
                            f.setVolume(await (m ? .getVolume()) ? ? b()), f.setMuted(v() || !!await (m ? .getMuted()));
                            const t = await (m ? .getAudioGain()) ? ? 1;
                            t > 1 && f.audioGain ? .setGain ? .(t), f.setPlaybackRate ? .(await (m ? .getPlaybackRate()) ? ? w()), f.setPlaysInline ? .(h()), x > 0 && f.setCurrentTime(x)
                        }
                        const E = await (m ? .getVideoQuality());
                        if (E && g.length) {
                            let t = null,
                                e = 1 / 0;
                            for (const s of g) {
                                const i = Math.abs(E.width - s.width) + Math.abs(E.height - s.height) + (E.bitrate ? Math.abs(E.bitrate - (s.bitrate ? ? 0)) : 0);
                                i < e && (t = s, e = i)
                            }
                            t && (t.selected = !0)
                        }
                        n() && S ? await this.kj(e) : k && k > 0 && this.c("started", void 0, e), c.set(null)
                    }))
                }
                async kj(t) {
                    const {
                        player: e,
                        $state: {
                            autoPlaying: s,
                            muted: n
                        }
                    } = this.a;
                    s.set(!0);
                    const r = new i.D("auto-play-attempt", {
                        trigger: t
                    });
                    try {
                        await e.play(r)
                    } catch (t) {}
                }
            }
            class ot {
                constructor() {
                    this.i = new Map
                }
                k(t, e) {
                    this.i.set(t, e)
                }
                xe(t) {
                    const e = this.rg(t);
                    return this.i.delete(t), e
                }
                rg(t) {
                    return this.i.get(t)
                }
                ub(t) {
                    this.i.delete(t)
                }
                Pm() {
                    this.i.clear()
                }
            }
            class lt {
                constructor() {
                    this.wc = !1, this.ye = (0, i.n)(), this.i = new Map
                }
                get Qm() {
                    return this.i.size
                }
                get Rm() {
                    return this.wc
                }
                async Sm() {
                    this.wc || await this.ye.promise
                }
                k(t, e) {
                    this.wc ? e() : (this.i.delete(t), this.i.set(t, e))
                }
                xe(t) {
                    this.i.get(t) ? .(), this.i.delete(t)
                }
                Xa() {
                    this.sg(), this.wc = !0, this.i.size > 0 && this.sg()
                }
                $() {
                    this.wc = !1
                }
                z() {
                    this.$(), this.i.clear(), this.tg()
                }
                sg() {
                    for (const t of this.i.keys()) this.xe(t);
                    this.tg()
                }
                tg() {
                    this.ye.resolve(), this.ye = (0, i.n)()
                }
            }
            class ct extends $ {
                constructor(t, e, s) {
                    super(), this.Ba = t, this.g = e, this.a = s, this.zc = new lt, this.Fe = !1, this.C = s.$provider, this.yc = new C, this.pd = new T, this.bb = new x
                }
                onAttach() {
                    this.listen("fullscreen-change", this.Qd.bind(this))
                }
                onConnect() {
                    const t = Object.getOwnPropertyNames(Object.getPrototypeOf(this)),
                        e = this.Hj.bind(this);
                    for (const s of t) s.startsWith("media-") && this.listen(s, e);
                    this.Ij(), (0, i.g)(this.Jj.bind(this)), (0, i.g)(this.Kj.bind(this)), (0, i.g)(this.Lj.bind(this)), (0, i.g)(this.Mj.bind(this)), (0, i.g)(this.Nj.bind(this)), (0, i.g)(this.Oj.bind(this)), (0, i.g)(this.Pj.bind(this))
                }
                onDestroy() {
                    try {
                        const t = this.createEvent("destroy"),
                            {
                                pictureInPicture: e,
                                fullscreen: s
                            } = this.$state;
                        s() && this.Lg("prefer-media", t), e() && this.Ge(t)
                    } catch (t) {}
                    this.zc.z()
                }
                Ij() {
                    const {
                        load: t
                    } = this.$props, {
                        canLoad: e
                    } = this.$state;
                    if ("play" !== t() || e()) return;
                    const s = this.listen("media-play-request", (t => {
                        this.Gg(t), s()
                    }))
                }
                Jj() {
                    const t = this.C(),
                        e = this.$state.canPlay();
                    return t && e && this.zc.Xa(), () => {
                        this.zc.$()
                    }
                }
                Hj(t) {
                    t.stopPropagation(), t.defaultPrevented || this[t.type] && ((0, i.p)(this.C) ? this[t.type](t) : this.zc.k(t.type, (() => {
                        (0, i.p)(this.C) && this[t.type](t)
                    })))
                }
                async Ac(t) {
                    const {
                        canPlay: e,
                        paused: s,
                        autoPlaying: n
                    } = this.$state;
                    if (!this.Gg(t) && (0, i.p)(s)) {
                        t && this.g.i.k("media-play-request", t);
                        try {
                            const t = (0, i.p)(this.C);
                            return ht(t, (0, i.p)(e)), await t.play()
                        } catch (e) {
                            const s = this.createEvent("play-fail", {
                                detail: (0, v.c)(e),
                                trigger: t
                            });
                            throw s.autoPlay = n(), this.Ba.V(s), e
                        }
                    }
                }
                Gg(t) {
                    const {
                        load: e
                    } = this.$props, {
                        canLoad: s
                    } = this.$state;
                    if ("play" === e() && !s()) {
                        const e = this.createEvent("media-start-loading", {
                            trigger: t
                        });
                        return this.dispatchEvent(e), this.zc.k("media-play-request", (async () => {
                            try {
                                await this.Ac(e)
                            } catch (t) {}
                        })), !0
                    }
                    return !1
                }
                async Ee(t) {
                    const {
                        canPlay: e,
                        paused: s
                    } = this.$state;
                    if (!(0, i.p)(s)) {
                        t && this.g.i.k("media-pause-request", t);
                        try {
                            const t = (0, i.p)(this.C);
                            return ht(t, (0, i.p)(e)), await t.pause()
                        } catch (t) {
                            throw this.g.i.ub("media-pause-request"), t
                        }
                    }
                }
                Hg(t, e) {
                    const {
                        audioGain: s,
                        canSetAudioGain: i
                    } = this.$state;
                    if (s() === t) return;
                    const n = this.C();
                    if (!n ? .audioGain || !i()) throw Error("[vidstack] audio gain api not available");
                    e && this.g.i.k("media-audio-gain-change-request", e), n.audioGain.setGain(t)
                }
                Ig(t) {
                    const {
                        canPlay: e,
                        live: s,
                        liveEdge: n,
                        canSeek: r,
                        liveSyncPosition: a,
                        seekableEnd: o,
                        userBehindLiveEdge: l
                    } = this.$state;
                    if (l.set(!1), (0, i.p)((() => !s() || n() || !r()))) return;
                    const c = (0, i.p)(this.C);
                    ht(c, (0, i.p)(e)), t && this.g.i.k("media-seek-request", t);
                    const h = o() - 2;
                    c.setCurrentTime(Math.min(h, a() ? ? h))
                }
                async Jg() {
                    let t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "prefer-media",
                        e = arguments.length > 1 ? arguments[1] : void 0;
                    const s = this.Kg(t);
                    if (ut(t, s), !s.active) return (0, i.p)(this.$state.pictureInPicture) && (this.Fe = !0, await this.Ge(e)), e && this.g.i.k("media-enter-fullscreen-request", e), s.enter()
                }
                async Lg() {
                    let t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "prefer-media",
                        e = arguments.length > 1 ? arguments[1] : void 0;
                    const s = this.Kg(t);
                    if (ut(t, s), s.active) {
                        e && this.g.i.k("media-exit-fullscreen-request", e);
                        try {
                            const t = await s.exit();
                            return this.Fe && (0, i.p)(this.$state.canPictureInPicture) && await this.He(), t
                        } finally {
                            this.Fe = !1
                        }
                    }
                }
                Kg(t) {
                    const e = (0, i.p)(this.C);
                    return "prefer-media" === t && this.pd.supported || "media" === t ? this.pd : e ? .fullscreen
                }
                async He(t) {
                    if (this.Mg(), !this.$state.pictureInPicture()) return t && this.g.i.k("media-enter-pip-request", t), await this.C().pictureInPicture.enter()
                }
                async Ge(t) {
                    if (this.Mg(), this.$state.pictureInPicture()) return t && this.g.i.k("media-exit-pip-request", t), await this.C().pictureInPicture.exit()
                }
                Mg() {
                    if (!this.$state.canPictureInPicture()) throw Error("[vidstack] no pip support")
                }
                Kj() {
                    this.yc.defaultDelay = this.$props.controlsDelay()
                }
                Lj() {
                    const {
                        canSetAudioGain: t
                    } = this.$state, e = !!this.C() ? .audioGain ? .supported;
                    t.set(e)
                }
                Mj() {
                    const {
                        canAirPlay: t
                    } = this.$state, e = !!this.C() ? .airPlay ? .supported;
                    t.set(e)
                }
                Nj() {
                    const {
                        canGoogleCast: t,
                        source: e
                    } = this.$state, s = r.I && !r.b && (0, r.d)(e());
                    t.set(s)
                }
                Oj() {
                    const {
                        canFullscreen: t
                    } = this.$state, e = this.pd.supported || !!this.C() ? .fullscreen ? .supported;
                    t.set(e)
                }
                Pj() {
                    const {
                        canPictureInPicture: t
                    } = this.$state, e = !!this.C() ? .pictureInPicture ? .supported;
                    t.set(e)
                }
                async "media-airplay-request" (t) {
                    try {
                        await this.Ng(t)
                    } catch (t) {}
                }
                async Ng(t) {
                    try {
                        const e = this.C() ? .airPlay;
                        if (!e ? .supported) throw Error("No AirPlay adapter.");
                        return t && this.g.i.k("media-airplay-request", t), await e.prompt()
                    } catch (t) {
                        throw this.g.i.ub("media-airplay-request"), t
                    }
                }
                async "media-google-cast-request" (t) {
                    try {
                        await this.Og(t)
                    } catch (t) {}
                }
                async Og(t) {
                    try {
                        const {
                            canGoogleCast: e
                        } = this.$state;
                        if (!(0, i.p)(e)) {
                            const t = Error("Cast not available.");
                            throw t.code = "CAST_NOT_AVAILABLE", t
                        }
                        if ((0, b.p)("https://www.gstatic.com"), !this.qd) {
                            const t = await s.e(905).then(s.bind(s, "../node_modules/vidstack/prod/chunks/vidstack-54Jpr2Lq.js"));
                            this.qd = new t.GoogleCastLoader
                        }
                        await this.qd.prompt(this.a), t && this.g.i.k("media-google-cast-request", t);
                        const n = "disconnected" !== (0, i.p)(this.$state.remotePlaybackState);
                        n && this.$state.savedState.set({
                            paused: (0, i.p)(this.$state.paused),
                            currentTime: (0, i.p)(this.$state.currentTime)
                        }), this.$state.remotePlaybackLoader.set(n ? this.qd : null)
                    } catch (t) {
                        throw this.g.i.ub("media-google-cast-request"), t
                    }
                }
                "media-audio-track-change-request" (t) {
                    const {
                        logger: e,
                        audioTracks: s
                    } = this.a;
                    if (s.readonly) return;
                    const i = s[t.detail];
                    if (i) {
                        const e = t.type;
                        this.g.i.k(e, t), i.selected = !0
                    }
                }
                async "media-enter-fullscreen-request" (t) {
                    try {
                        await this.Jg(t.detail, t)
                    } catch (e) {
                        this.Zc(e, t)
                    }
                }
                async "media-exit-fullscreen-request" (t) {
                    try {
                        await this.Lg(t.detail, t)
                    } catch (e) {
                        this.Zc(e, t)
                    }
                }
                async Qd(t) {
                    const e = (0, i.p)(this.$props.fullscreenOrientation),
                        s = t.detail;
                    if (!(0, i.h)(e) && "none" !== e && this.bb.supported)
                        if (s) {
                            if (this.bb.locked) return;
                            this.dispatch("media-orientation-lock-request", {
                                detail: e,
                                trigger: t
                            })
                        } else this.bb.locked && this.dispatch("media-orientation-unlock-request", {
                            trigger: t
                        })
                }
                Zc(t, e) {
                    this.Ba.V(this.createEvent("fullscreen-error", {
                        detail: (0, v.c)(t)
                    }))
                }
                async "media-orientation-lock-request" (t) {
                    const e = t.type;
                    try {
                        this.g.i.k(e, t), await this.bb.lock(t.detail)
                    } catch (t) {
                        this.g.i.ub(e)
                    }
                }
                async "media-orientation-unlock-request" (t) {
                    const e = t.type;
                    try {
                        this.g.i.k(e, t), await this.bb.unlock()
                    } catch (t) {
                        this.g.i.ub(e)
                    }
                }
                async "media-enter-pip-request" (t) {
                    try {
                        await this.He(t)
                    } catch (e) {
                        this.Pg(e, t)
                    }
                }
                async "media-exit-pip-request" (t) {
                    try {
                        await this.Ge(t)
                    } catch (e) {
                        this.Pg(e, t)
                    }
                }
                Pg(t, e) {
                    this.Ba.V(this.createEvent("picture-in-picture-error", {
                        detail: (0, v.c)(t)
                    }))
                }
                "media-live-edge-request" (t) {
                    const {
                        live: e,
                        liveEdge: s,
                        canSeek: i
                    } = this.$state;
                    if (e() && !s() && i()) {
                        this.g.i.k("media-seek-request", t);
                        try {
                            this.Ig()
                        } catch (t) {
                            this.g.i.ub("media-seek-request")
                        }
                    }
                }
                async "media-loop-request" (t) {
                    try {
                        this.g.Ob = !0, this.g.Bc = !0, await this.Ac(t)
                    } catch (t) {
                        this.g.Ob = !1
                    }
                }
                "media-user-loop-change-request" (t) {
                    this.$state.userPrefersLoop.set(t.detail)
                }
                async "media-pause-request" (t) {
                    if (!this.$state.paused()) try {
                        await this.Ee(t)
                    } catch (t) {}
                }
                async "media-play-request" (t) {
                    if (this.$state.paused()) try {
                        await this.Ac(t)
                    } catch (t) {}
                }
                "media-rate-change-request" (t) {
                    const {
                        playbackRate: e,
                        canSetPlaybackRate: s
                    } = this.$state;
                    if (e() === t.detail || !s()) return;
                    const i = this.C();
                    i ? .setPlaybackRate && (this.g.i.k("media-rate-change-request", t), i.setPlaybackRate(t.detail))
                }
                "media-audio-gain-change-request" (t) {
                    try {
                        this.Hg(t.detail, t)
                    } catch (t) {}
                }
                "media-quality-change-request" (t) {
                    const {
                        qualities: e,
                        storage: s,
                        logger: i
                    } = this.a;
                    if (e.readonly) return;
                    this.g.i.k("media-quality-change-request", t);
                    const n = t.detail;
                    if (n < 0) e.autoSelect(t), t.isOriginTrusted && s ? .setVideoQuality ? .(null);
                    else {
                        const i = e[n];
                        i && (i.selected = !0, t.isOriginTrusted && s ? .setVideoQuality ? .({
                            id: i.id,
                            width: i.width,
                            height: i.height,
                            bitrate: i.bitrate
                        }))
                    }
                }
                "media-pause-controls-request" (t) {
                    const e = t.type;
                    this.g.i.k(e, t), this.yc.pause(t)
                }
                "media-resume-controls-request" (t) {
                    const e = t.type;
                    this.g.i.k(e, t), this.yc.resume(t)
                }
                "media-seek-request" (t) {
                    const {
                        seekableStart: e,
                        seekableEnd: s,
                        ended: i,
                        canSeek: n,
                        live: r,
                        userBehindLiveEdge: a,
                        clipStartTime: o
                    } = this.$state, l = t.detail;
                    i() && (this.g.Bc = !0);
                    const c = t.type;
                    this.g.Ja = !1, this.g.i.ub(c);
                    const h = l + o(),
                        u = Math.floor(h) === Math.floor(s()) ? s() : Math.min(Math.max(e() + .1, h), s() - .1);
                    Number.isFinite(u) && n() && (this.g.i.k(c, t), this.C().setCurrentTime(u), r() && t.isOriginTrusted && Math.abs(s() - u) >= 2 && a.set(!0))
                }
                "media-seeking-request" (t) {
                    const e = t.type;
                    this.g.i.k(e, t), this.$state.seeking.set(!0), this.g.Ja = !0
                }
                "media-start-loading" (t) {
                    if (this.$state.canLoad()) return;
                    const e = t.type;
                    this.g.i.k(e, t), this.Ba.V(this.createEvent("can-load"))
                }
                "media-poster-start-loading" (t) {
                    if (this.$state.canLoadPoster()) return;
                    const e = t.type;
                    this.g.i.k(e, t), this.Ba.V(this.createEvent("can-load-poster"))
                }
                "media-text-track-change-request" (t) {
                    const {
                        index: e,
                        mode: s
                    } = t.detail, i = this.a.textTracks[e];
                    if (i) {
                        const e = t.type;
                        this.g.i.k(e, t), i.setMode(s, t)
                    }
                }
                "media-mute-request" (t) {
                    if (this.$state.muted()) return;
                    const e = t.type;
                    this.g.i.k(e, t), this.C().setMuted(!0)
                }
                "media-unmute-request" (t) {
                    const {
                        muted: e,
                        volume: s
                    } = this.$state;
                    if (!e()) return;
                    const i = t.type;
                    this.g.i.k(i, t), this.a.$provider().setMuted(!1), 0 === s() && (this.g.i.k(i, t), this.C().setVolume(.25))
                }
                "media-volume-change-request" (t) {
                    const {
                        muted: e,
                        volume: s
                    } = this.$state, i = t.detail;
                    if (s() === i) return;
                    const n = t.type;
                    this.g.i.k(n, t), this.C().setVolume(i), i > 0 && e() && (this.g.i.k(n, t), this.C().setMuted(!1))
                }
                Qa(t, e, s) {}
            }

            function ht(t, e) {
                if (!t || !e) throw Error("[vidstack] media not ready")
            }

            function ut(t, e) {
                if (!e ? .supported) throw Error("[vidstack] no fullscreen support")
            }
            class dt {
                constructor() {
                    this.Ja = !1, this.Ob = !1, this.Bc = !1, this.i = new ot
                }
            }
            const pt = new Set(["auto-play", "auto-play-fail", "can-load", "sources-change", "source-change", "load-start", "abort", "error", "loaded-metadata", "loaded-data", "can-play", "play", "play-fail", "pause", "playing", "seeking", "seeked", "waiting"]);
            class ft extends $ {
                constructor(t, e) {
                    super(), this.g = t, this.a = e, this.u = new Map, this.rd = !1, this.sd = !1, this.Cc = !1, this.Ke = null, this.seeking = M((t => {
                        const {
                            seeking: e,
                            realCurrentTime: s,
                            paused: i
                        } = this.$state;
                        e.set(!0), s.set(t.detail), this.D("media-seeking-request", t), i() && (this.Pb = t, this.Le())
                    }), 150, {
                        leading: !0
                    }), this.Le = O((() => {
                        if (!this.Pb) return;
                        this.sd = !0;
                        const {
                            waiting: t,
                            playing: e
                        } = this.$state;
                        t.set(!0), e.set(!1);
                        const s = this.createEvent("waiting", {
                            trigger: this.Pb
                        });
                        this.u.set("waiting", s), this.dispatch(s), this.Pb = void 0, this.sd = !1
                    }), 300)
                }
                onAttach(t) {
                    t.setAttribute("aria-busy", "true"), this.listen("fullscreen-change", this["fullscreen-change"].bind(this)), this.listen("fullscreen-error", this["fullscreen-error"].bind(this)), this.listen("orientation-change", this["orientation-change"].bind(this))
                }
                onConnect(t) {
                    (0, i.g)(this.Qj.bind(this)), this.Rj(), this.Sj(), this.Tj(), this.Uj(), (0, i.q)(this.Vj.bind(this))
                }
                onDestroy() {
                    const {
                        audioTracks: t,
                        qualities: e,
                        textTracks: s
                    } = this.a;
                    t[n.L.z](), e[n.L.z](), s[n.L.z](), this.Ie()
                }
                V(t) {
                    if (!this.scope) return;
                    const e = t.type;
                    (0, i.T)((() => this[t.type] ? .(t))), pt.has(e) && this.u.set(e, t), this.dispatch(t)
                }
                Uj() {
                    this.Cc && (requestAnimationFrame((() => {
                        this.scope && this.a.remote.play(new i.D("dom-connect"))
                    })), this.Cc = !1)
                }
                Vj() {
                    this.Cc || (this.Cc = !this.$state.paused(), this.a.$provider() ? .pause())
                }
                vb() {
                    this.Qg(), this.rd = !1, this.g.Bc = !1, this.g.Ob = !1, this.sd = !1, this.Pb = void 0, this.u.clear()
                }
                D(t, e) {
                    const s = this.g.i.xe(t);
                    s && (e.request = s, e.triggers.add(s))
                }
                Rj() {
                    this.Je(), this.Rg();
                    const t = this.a.textTracks;
                    (0, i.l)(t, "add", this.Je.bind(this)), (0, i.l)(t, "remove", this.Je.bind(this)), (0, i.l)(t, "mode-change", this.Rg.bind(this))
                }
                Sj() {
                    const t = this.a.qualities;
                    (0, i.l)(t, "add", this.ld.bind(this)), (0, i.l)(t, "remove", this.ld.bind(this)), (0, i.l)(t, "change", this.Za.bind(this)), (0, i.l)(t, "auto-change", this.Wj.bind(this)), (0, i.l)(t, "readonly-change", this.Xj.bind(this))
                }
                Tj() {
                    const t = this.a.audioTracks;
                    (0, i.l)(t, "add", this.Sg.bind(this)), (0, i.l)(t, "remove", this.Sg.bind(this)), (0, i.l)(t, "change", this.Yj.bind(this))
                }
                Je(t) {
                    const {
                        textTracks: e
                    } = this.$state;
                    e.set(this.a.textTracks.toArray()), this.dispatch("text-tracks-change", {
                        detail: e(),
                        trigger: t
                    })
                }
                Rg(t) {
                    t && this.D("media-text-track-change-request", t);
                    const e = this.a.textTracks.selected,
                        {
                            textTrack: s
                        } = this.$state;
                    s() !== e && (s.set(e), this.dispatch("text-track-change", {
                        detail: e,
                        trigger: t
                    }))
                }
                Sg(t) {
                    const {
                        audioTracks: e
                    } = this.$state;
                    e.set(this.a.audioTracks.toArray()), this.dispatch("audio-tracks-change", {
                        detail: e(),
                        trigger: t
                    })
                }
                Yj(t) {
                    const {
                        audioTrack: e
                    } = this.$state;
                    e.set(this.a.audioTracks.selected), t && this.D("media-audio-track-change-request", t), this.dispatch("audio-track-change", {
                        detail: e(),
                        trigger: t
                    })
                }
                ld(t) {
                    const {
                        qualities: e
                    } = this.$state;
                    e.set(this.a.qualities.toArray()), this.dispatch("qualities-change", {
                        detail: e(),
                        trigger: t
                    })
                }
                Za(t) {
                    const {
                        quality: e
                    } = this.$state;
                    e.set(this.a.qualities.selected), t && this.D("media-quality-change-request", t), this.dispatch("quality-change", {
                        detail: e(),
                        trigger: t
                    })
                }
                Wj() {
                    const {
                        qualities: t
                    } = this.a, e = t.auto;
                    this.$state.autoQuality.set(e), e || this.Ie()
                }
                Tg() {
                    this.Ie(), this.Ke = (0, i.g)((() => {
                        const {
                            qualities: t
                        } = this.a, {
                            mediaWidth: e,
                            mediaHeight: s
                        } = this.$state, r = e(), a = s();
                        if (0 === r || 0 === a) return;
                        let o = null,
                            l = 1 / 0;
                        for (const e of t) {
                            const t = Math.abs(e.width - r) + Math.abs(e.height - a);
                            t < l && (l = t, o = e)
                        }
                        o && t[n.L.ea](o, !0, new i.D("resize", {
                            detail: {
                                width: r,
                                height: a
                            }
                        }))
                    }))
                }
                Ie() {
                    this.Ke ? .(), this.Ke = null
                }
                Xj() {
                    this.$state.canSetQuality.set(!this.a.qualities.readonly)
                }
                Qj() {
                    const {
                        canSetVolume: t,
                        isGoogleCastConnected: e
                    } = this.$state;
                    e() ? t.set(!1) : (0, r.e)().then(t.set)
                }
                "provider-change" (t) {
                    const e = this.a.$provider(),
                        s = t.detail;
                    e ? .type !== s ? .type && (e ? .destroy ? .(), e ? .scope ? .dispose(), this.a.$provider.set(t.detail), e && null === t.detail && this.Ug(t))
                }
                "provider-loader-change" (t) {}
                "auto-play" (t) {
                    this.$state.autoPlayError.set(null)
                }
                "auto-play-fail" (t) {
                    this.$state.autoPlayError.set(t.detail), this.vb()
                }
                "can-load" (t) {
                    this.$state.canLoad.set(!0), this.u.set("can-load", t), this.a.textTracks[o.a.Z](), this.D("media-start-loading", t)
                }
                "can-load-poster" (t) {
                    this.$state.canLoadPoster.set(!0), this.u.set("can-load-poster", t), this.D("media-poster-start-loading", t)
                }
                "media-type-change" (t) {
                    const e = this.u.get("source-change");
                    e && t.triggers.add(e);
                    const s = this.$state.viewType();
                    this.$state.mediaType.set(t.detail);
                    const i = this.$state.providedViewType(),
                        n = "unknown" === i ? t.detail : i;
                    s !== n && setTimeout((() => {
                        requestAnimationFrame((() => {
                            this.scope && (this.$state.inferredViewType.set(t.detail), this.dispatch("view-type-change", {
                                detail: n,
                                trigger: t
                            }))
                        }))
                    }), 0)
                }
                "stream-type-change" (t) {
                    const e = this.u.get("source-change");
                    e && t.triggers.add(e);
                    const {
                        streamType: s,
                        inferredStreamType: i
                    } = this.$state;
                    i.set(t.detail), t.detail = s()
                }
                "rate-change" (t) {
                    const {
                        storage: e
                    } = this.a, {
                        canPlay: s
                    } = this.$state;
                    this.$state.playbackRate.set(t.detail), this.D("media-rate-change-request", t), s() && e ? .setPlaybackRate ? .(t.detail)
                }
                "remote-playback-change" (t) {
                    const {
                        remotePlaybackState: e,
                        remotePlaybackType: s
                    } = this.$state, {
                        type: i,
                        state: n
                    } = t.detail, r = "connected" === n;
                    s.set(i), e.set(n);
                    const a = "airplay" === i ? "media-airplay-request" : "media-google-cast-request";
                    if (r) this.D(a, t);
                    else {
                        const e = this.g.i.rg(a);
                        e && (t.request = e, t.triggers.add(e))
                    }
                }
                "sources-change" (t) {
                    const e = this.$state.sources(),
                        s = t.detail;
                    this.$state.sources.set(s), this.Zj(e, s, t)
                }
                Zj(t, e, s) {
                    let {
                        qualities: i
                    } = this.a, r = !1, a = !1;
                    for (const r of t) {
                        if (!S(r)) continue;
                        if (!e.some((t => t.src === r.src))) {
                            const t = i.getBySrc(r.src);
                            t && (i[n.L.cc](t, s), a = !0)
                        }
                    }
                    a && !i.length && (this.$state.savedState.set(null), i[n.L.z](s));
                    for (const t of e) {
                        if (!S(t) || i.getBySrc(t.src)) continue;
                        const e = {
                            id: t.id ? ? t.height + "p",
                            bitrate: null,
                            codec: null,
                            ...t,
                            selected: !1
                        };
                        i[n.L.da](e, s), r = !0
                    }
                    r && !i[g.Q.Ia] && (this.Tg(), i[g.Q.Ia] = this.Tg.bind(this), i[g.Q.Wa](!0, s))
                }
                "source-change" (t) {
                    t.isQualityChange = "quality-change" === t.originEvent ? .type;
                    const e = t.detail;
                    this.Ug(t, t.isQualityChange), this.u.set(t.type, t), this.$state.source.set(e), this.el ? .setAttribute("aria-busy", "true")
                }
                Ug(t) {
                    let e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                    const {
                        audioTracks: s,
                        qualities: i
                    } = this.a;
                    if (!e) return s[n.L.z](t), i[n.L.z](t), f(this.$state, e), void this.vb();
                    f(this.$state, e), this.vb()
                }
                abort(t) {
                    const e = this.u.get("source-change");
                    e && t.triggers.add(e);
                    const s = this.u.get("can-load");
                    s && !t.triggers.hasType("can-load") && t.triggers.add(s)
                }
                "load-start" (t) {
                    const e = this.u.get("source-change");
                    e && t.triggers.add(e)
                }
                error(t) {
                    this.$state.error.set(t.detail);
                    const e = this.u.get("abort");
                    e && t.triggers.add(e)
                }
                "loaded-metadata" (t) {
                    const e = this.u.get("load-start");
                    e && t.triggers.add(e)
                }
                "loaded-data" (t) {
                    const e = this.u.get("load-start");
                    e && t.triggers.add(e)
                }
                "can-play" (t) {
                    const e = this.u.get("loaded-metadata");
                    e && t.triggers.add(e), this.Vg(t.detail), this.el ? .setAttribute("aria-busy", "false")
                }
                "can-play-through" (t) {
                    this.Vg(t.detail);
                    const e = this.u.get("can-play");
                    e && t.triggers.add(e)
                }
                Vg(t) {
                    const {
                        seekable: e,
                        buffered: s,
                        intrinsicDuration: i,
                        canPlay: n
                    } = this.$state;
                    n.set(!0), s.set(t.buffered), e.set(t.seekable);
                    const r = (0, a.b)(t.seekable) ? ? 1 / 0;
                    i.set(r)
                }
                "duration-change" (t) {
                    const {
                        live: e,
                        intrinsicDuration: s,
                        ended: i
                    } = this.$state, n = t.detail;
                    if (!e()) {
                        const e = Number.isNaN(n) ? 0 : n;
                        s.set(e), i() && this.Wg(t)
                    }
                }
                progress(t) {
                    const {
                        buffered: e,
                        bufferedEnd: s,
                        seekable: i,
                        seekableEnd: n,
                        live: r,
                        intrinsicDuration: o
                    } = this.$state, {
                        buffered: l,
                        seekable: c
                    } = t.detail, h = (0, a.b)(l) ? ? 1 / 0, u = l.length !== e().length, d = h > s(), p = (0, a.b)(c) ? ? 1 / 0, f = c.length !== i().length, m = p > n();
                    (u || d) && e.set(l), (f || m) && i.set(c), r() && (o.set(p), this.dispatch("duration-change", {
                        detail: p,
                        trigger: t
                    }))
                }
                play(t) {
                    const {
                        paused: e,
                        autoPlayError: s,
                        ended: i,
                        autoPlaying: n,
                        playsInline: r,
                        pointer: a,
                        muted: o,
                        viewType: l,
                        live: c,
                        userBehindLiveEdge: h
                    } = this.$state;
                    if (this._j(), !e()) return void t.stopImmediatePropagation();
                    t.autoPlay = n();
                    const u = this.u.get("waiting");
                    u && t.triggers.add(u), this.D("media-play-request", t), this.u.set("play", t), e.set(!1), s.set(null), t.autoPlay && (this.V(this.createEvent("auto-play", {
                        detail: {
                            muted: o()
                        },
                        trigger: t
                    })), n.set(!1)), (i() || this.g.Bc) && (this.g.Bc = !1, i.set(!1), this.V(this.createEvent("replay", {
                        trigger: t
                    }))), r() || "video" !== l() || "coarse" !== a() || this.a.remote.enterFullscreen("prefer-media", t), c() && !h() && this.a.remote.seekToLiveEdge(t)
                }
                _j(t) {
                    if (!(0, i.p)(this.a.$provider)) return;
                    const {
                        ended: e,
                        seekableStart: s,
                        clipStartTime: n,
                        clipEndTime: r,
                        realCurrentTime: a,
                        duration: o
                    } = this.$state, l = a() < n() || r() > 0 && a() >= r() || Math.abs(a() - o()) < .1 || e();
                    return l && this.dispatch("media-seek-request", {
                        detail: (n() > 0 ? 0 : s()) + .1,
                        trigger: t
                    }), l
                }
                "play-fail" (t) {
                    const {
                        muted: e,
                        autoPlaying: s
                    } = this.$state, i = this.u.get("play");
                    i && t.triggers.add(i), this.D("media-play-request", t);
                    const {
                        paused: n,
                        playing: r
                    } = this.$state;
                    n.set(!0), r.set(!1), this.vb(), this.u.set("play-fail", t), t.autoPlay && (this.V(this.createEvent("auto-play-fail", {
                        detail: {
                            muted: e(),
                            error: t.detail
                        },
                        trigger: t
                    })), s.set(!1))
                }
                playing(t) {
                    const e = this.u.get("play"),
                        s = this.u.get("seeked");
                    e ? t.triggers.add(e) : s && t.triggers.add(s), setTimeout((() => this.vb()), 0);
                    const {
                        paused: i,
                        playing: n,
                        live: r,
                        liveSyncPosition: a,
                        seekableEnd: o,
                        started: l,
                        currentTime: c,
                        seeking: h,
                        ended: u
                    } = this.$state;
                    if (i.set(!1), n.set(!0), h.set(!1), u.set(!1), this.g.Ob) this.g.Ob = !1;
                    else {
                        if (r() && !l() && 0 === c()) {
                            const t = a() ? ? o() - 2;
                            Number.isFinite(t) && this.a.$provider().setCurrentTime(t)
                        }
                        this.started(t)
                    }
                }
                started(t) {
                    const {
                        started: e
                    } = this.$state;
                    e() || (e.set(!0), this.V(this.createEvent("started", {
                        trigger: t
                    })))
                }
                pause(t) {
                    this.el ? .isConnected || (this.Cc = !0), this.D("media-pause-request", t);
                    const e = this.u.get("seeked");
                    e && t.triggers.add(e);
                    const {
                        paused: s,
                        playing: i
                    } = this.$state;
                    s.set(!0), i.set(!1), this.rd && setTimeout((() => {
                        this.V(this.createEvent("end", {
                            trigger: t
                        })), this.rd = !1
                    }), 0), this.vb()
                }
                "time-update" (t) {
                    if (this.g.Ob) return void t.stopImmediatePropagation();
                    const {
                        realCurrentTime: e,
                        played: s,
                        waiting: i,
                        clipEndTime: n
                    } = this.$state, r = n(), a = t.detail;
                    e.set(a.currentTime), s.set(a.played), i.set(!1);
                    for (const e of this.a.textTracks) e[o.a.Eb](a.currentTime, t);
                    r > 0 && a.currentTime >= r && (this.rd = !0, this.dispatch("media-pause-request", {
                        trigger: t
                    })), this.$j()
                }
                Wg(t) {
                    const {
                        duration: e,
                        played: s
                    } = this.$state, i = (0, a.g)(s()) ? ? 0;
                    this.V(this.createEvent("time-update", {
                        detail: {
                            currentTime: e(),
                            played: new a.T(i, e())
                        },
                        trigger: t
                    }))
                }
                $j() {
                    const {
                        storage: t
                    } = this.a, {
                        canPlay: e,
                        realCurrentTime: s
                    } = this.$state;
                    e() && t ? .setTime ? .(s())
                }
                "audio-gain-change" (t) {
                    const {
                        storage: e
                    } = this.a, {
                        canPlay: s,
                        audioGain: i
                    } = this.$state;
                    i.set(t.detail), this.D("media-audio-gain-change-request", t), s() && e ? .setAudioGain ? .(i())
                }
                "volume-change" (t) {
                    const {
                        storage: e
                    } = this.a, {
                        volume: s,
                        muted: i,
                        canPlay: n
                    } = this.$state, r = t.detail;
                    s.set(r.volume), i.set(r.muted || 0 === r.volume), this.D("media-volume-change-request", t), this.D(r.muted ? "media-mute-request" : "media-unmute-request", t), n() && (e ? .setVolume ? .(s()), e ? .setMuted ? .(i()))
                }
                seeked(t) {
                    const {
                        seeking: e,
                        currentTime: s,
                        realCurrentTime: i,
                        paused: n,
                        seekableEnd: r,
                        ended: a
                    } = this.$state;
                    if (this.g.Ja) e.set(!0), t.stopImmediatePropagation();
                    else if (e()) {
                        const s = this.u.get("waiting");
                        s && t.triggers.add(s);
                        const r = this.u.get("seeking");
                        r && !t.triggers.has(r) && t.triggers.add(r), n() && this.Qg(), e.set(!1), i.set(t.detail), this.D("media-seek-request", t);
                        const a = t ? .originEvent;
                        a ? .isTrusted && !/seek/.test(a.type) && this.started(t)
                    }
                    Math.floor(s()) !== Math.floor(r()) ? a.set(!1) : this.end(t)
                }
                waiting(t) {
                    this.sd || this.g.Ja || (t.stopImmediatePropagation(), this.Pb = t, this.Le())
                }
                end(t) {
                    const {
                        loop: e,
                        ended: s
                    } = this.$state;
                    !e() && s() || (e() ? setTimeout((() => {
                        requestAnimationFrame((() => {
                            this.dispatch("media-loop-request", {
                                trigger: t
                            })
                        }))
                    }), 10) : setTimeout((() => this.lc(t)), 0))
                }
                lc(t) {
                    const {
                        storage: e
                    } = this.a, {
                        paused: s,
                        seeking: i,
                        ended: n,
                        duration: r
                    } = this.$state;
                    this.Wg(t), s() || this.dispatch("pause", {
                        trigger: t
                    }), i() && this.dispatch("seeked", {
                        detail: r(),
                        trigger: t
                    }), n.set(!0), this.vb(), e ? .setTime ? .(r(), !0), this.dispatch("ended", {
                        trigger: t
                    })
                }
                Qg() {
                    this.Le.cancel(), this.$state.waiting.set(!1)
                }
                "fullscreen-change" (t) {
                    const e = t.detail;
                    this.$state.fullscreen.set(e), this.D(e ? "media-enter-fullscreen-request" : "media-exit-fullscreen-request", t)
                }
                "fullscreen-error" (t) {
                    this.D("media-enter-fullscreen-request", t), this.D("media-exit-fullscreen-request", t)
                }
                "orientation-change" (t) {
                    const e = t.detail.lock;
                    this.D(e ? "media-orientation-lock-request" : "media-orientation-unlock-request", t)
                }
                "picture-in-picture-change" (t) {
                    const e = t.detail;
                    this.$state.pictureInPicture.set(e), this.D(e ? "media-enter-pip-request" : "media-exit-pip-request", t)
                }
                "picture-in-picture-error" (t) {
                    this.D("media-enter-pip-request", t), this.D("media-exit-pip-request", t)
                }
                "title-change" (t) {
                    t.trigger && (t.stopImmediatePropagation(), this.$state.inferredTitle.set(t.detail))
                }
                "poster-change" (t) {
                    t.trigger && (t.stopImmediatePropagation(), this.$state.inferredPoster.set(t.detail))
                }
            }
            class mt extends $ {
                onSetup() {
                    this.Hb(), (0, i.g)(this.bk.bind(this)), (0, i.g)(this.ck.bind(this)), (0, i.g)(this.dk.bind(this)), (0, i.g)(this.Xd.bind(this)), (0, i.g)(this.Ca.bind(this)), (0, i.g)(this.ek.bind(this)), (0, i.g)(this.fk.bind(this)), (0, i.g)(this.gk.bind(this)), (0, i.g)(this.hk.bind(this)), (0, i.g)(this.ik.bind(this)), (0, i.g)(this.Me.bind(this)), (0, i.g)(this.jk.bind(this)), (0, i.g)(this.kk.bind(this)), (0, i.g)(this.td.bind(this))
                }
                Hb() {
                    const t = {
                            duration: "providedDuration",
                            loop: "providedLoop",
                            poster: "providedPoster",
                            streamType: "providedStreamType",
                            title: "providedTitle",
                            viewType: "providedViewType"
                        },
                        e = new Set(["currentTime", "paused", "playbackRate", "volume"]);
                    for (const s of Object.keys(this.$props)) e.has(s) || this.$state[t[s] ? ? s] ? .set(this.$props[s]());
                    this.$state.muted.set(this.$props.muted() || 0 === this.$props.volume())
                }
                kk() {
                    const {
                        viewType: t,
                        streamType: e,
                        title: s,
                        poster: i,
                        loop: n
                    } = this.$props, r = this.$state;
                    r.providedPoster.set(i()), r.providedStreamType.set(e()), r.providedViewType.set(t()), r.providedTitle.set(s()), r.providedLoop.set(n())
                }
                ak() {}
                bk() {
                    const {
                        artist: t,
                        artwork: e
                    } = this.$props;
                    this.$state.artist.set(t()), this.$state.artwork.set(e())
                }
                td() {
                    const {
                        title: t
                    } = this.$state;
                    this.dispatch("title-change", {
                        detail: t()
                    })
                }
                ck() {
                    const t = this.$props.autoPlay() || this.$props.autoplay();
                    this.$state.autoPlay.set(t), this.dispatch("auto-play-change", {
                        detail: t
                    })
                }
                ik() {
                    const t = this.$state.loop();
                    this.dispatch("loop-change", {
                        detail: t
                    })
                }
                Xd() {
                    const t = this.$props.controls();
                    this.$state.controls.set(t)
                }
                jk() {
                    const {
                        poster: t
                    } = this.$state;
                    this.dispatch("poster-change", {
                        detail: t()
                    })
                }
                Ca() {
                    const t = this.$props.crossOrigin() ? ? this.$props.crossorigin(),
                        e = !0 === t ? "" : t;
                    this.$state.crossOrigin.set(e)
                }
                ek() {
                    const {
                        providedDuration: t
                    } = this.$state;
                    t.set(this.$props.duration())
                }
                Me() {
                    const t = this.$props.playsInline() || this.$props.playsinline();
                    this.$state.playsInline.set(t), this.dispatch("plays-inline-change", {
                        detail: t
                    })
                }
                dk() {
                    const {
                        clipStartTime: t,
                        clipEndTime: e
                    } = this.$props;
                    this.$state.clipStartTime.set(t()), this.$state.clipEndTime.set(e())
                }
                fk() {
                    this.dispatch("live-change", {
                        detail: this.$state.live()
                    })
                }
                hk() {
                    this.$state.liveEdgeTolerance.set(this.$props.liveEdgeTolerance()), this.$state.minLiveDVRWindow.set(this.$props.minLiveDVRWindow())
                }
                gk() {
                    this.dispatch("live-edge-change", {
                        detail: this.$state.liveEdge()
                    })
                }
            }
            class gt extends $ {
                static# t = this.Xg = ["play", "pause", "seekforward", "seekbackward", "seekto"];
                constructor() {
                    super()
                }
                onConnect() {
                    (0, i.g)(this.lk.bind(this)), (0, i.g)(this.mk.bind(this));
                    const t = this.nk.bind(this);
                    for (const e of gt.Xg) navigator.mediaSession.setActionHandler(e, t);
                    (0, i.q)(this.Fa.bind(this))
                }
                Fa() {
                    for (const t of gt.Xg) navigator.mediaSession.setActionHandler(t, null)
                }
                lk() {
                    const {
                        title: t,
                        artist: e,
                        artwork: s,
                        poster: i
                    } = this.$state;
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: t(),
                        artist: e(),
                        artwork: s() ? ? [{
                            src: i()
                        }]
                    })
                }
                mk() {
                    const {
                        canPlay: t,
                        paused: e
                    } = this.$state;
                    navigator.mediaSession.playbackState = t() ? e() ? "paused" : "playing" : "none"
                }
                nk(t) {
                    const e = new i.D("media-session-action", {
                        detail: t
                    });
                    switch (t.action) {
                        case "play":
                            this.dispatch("media-play-request", {
                                trigger: e
                            });
                            break;
                        case "pause":
                            this.dispatch("media-pause-request", {
                                trigger: e
                            });
                            break;
                        case "seekto":
                        case "seekforward":
                        case "seekbackward":
                            this.dispatch("media-seek-request", {
                                detail: (0, i.j)(t.seekTime) ? t.seekTime : this.$state.currentTime() + (t.seekOffset ? ? 10),
                                trigger: e
                            })
                    }
                }
            }
            let vt = (0, i.f)(!1);
            (0, i.l)(document, "pointerdown", (() => {
                vt.set(!1)
            })), (0, i.l)(document, "keydown", (t => {
                t.metaKey || t.altKey || t.ctrlKey || vt.set(!0)
            }));
            class bt extends i.a6 {
                constructor() {
                    super(...arguments), this.Dc = (0, i.f)(!1)
                }
                onConnect(t) {
                    (0, i.g)((() => {
                        if (!vt()) return this.Dc.set(!1), yt(t, !1), this.listen("pointerenter", this.Oe.bind(this)), void this.listen("pointerleave", this.Pe.bind(this));
                        const e = document.activeElement === t;
                        this.Dc.set(e), yt(t, e), this.listen("focus", this.Ec.bind(this)), this.listen("blur", this.qk.bind(this))
                    }))
                }
                focused() {
                    return this.Dc()
                }
                Ec() {
                    this.Dc.set(!0), yt(this.el, !0)
                }
                qk() {
                    this.Dc.set(!1), yt(this.el, !1)
                }
                Oe() {
                    wt(this.el, !0)
                }
                Pe() {
                    wt(this.el, !1)
                }
            }

            function yt(t, e) {
                (0, i.s)(t, "data-focus", e), (0, i.s)(t, "data-hocus", e)
            }

            function wt(t, e) {
                (0, i.s)(t, "data-hocus", e), (0, i.s)(t, "data-hover", e)
            }
            var Tt = Object.defineProperty,
                _t = Object.getOwnPropertyDescriptor,
                kt = (t, e, s, i) => {
                    for (var n, r = i > 1 ? void 0 : i ? _t(e, s) : e, a = t.length - 1; a >= 0; a--)(n = t[a]) && (r = (i ? n(e, s, r) : n(r)) || r);
                    return i && r && Tt(e, s, r), r
                };
            const xt = class t extends i.C {
                constructor() {
                    super(), this.canPlayQueue = new lt, this.Re = !1, new mt;
                    const t = {
                        player: this,
                        qualities: new V,
                        audioTracks: new z,
                        storage: null,
                        $provider: (0, i.f)(null),
                        $providerSetup: (0, i.f)(!1),
                        $props: this.$props,
                        $state: this.$state
                    };
                    t.remote = this.remoteControl = new E(void 0), t.remote.setPlayer(this), t.textTracks = new I, t.textTracks[o.a.Db] = this.$state.crossOrigin, t.textRenderers = new L(t), t.ariaKeys = {}, this.a = t, (0, i._)(m.m, t), this.orientation = new x, new bt, new U(t);
                    const e = new dt;
                    this.Ba = new ft(e, t), this.W = new ct(this.Ba, e, t), t.delegate = new at(this.Ba.V.bind(this.Ba), t), "undefined" != typeof navigator && "mediaSession" in navigator && new gt, new rt("load", this.startLoading.bind(this)), new rt("posterLoad", this.startLoadingPoster.bind(this))
                }
                static# t = this.props = nt;
                static# e = this.state = u;
                get p() {
                    return this.a.$provider()
                }
                get vd() {
                    return this.$props
                }
                onSetup() {
                    this.rk(), (0, i.g)(this.sk.bind(this)), (0, i.g)(this.tk.bind(this)), (0, i.g)(this.fc.bind(this)), (0, i.g)(this.Fc.bind(this)), (0, i.g)(this.Qb.bind(this)), (0, i.g)(this.Me.bind(this)), (0, i.g)(this.Qe.bind(this))
                }
                onAttach(t) {
                    t.setAttribute("data-media-player", ""), (0, a.s)(t, "tabindex", "0"), (0, a.s)(t, "role", "region"), (0, i.g)(this.uk.bind(this)), (0, i.g)(this.td.bind(this)), (0, i.g)(this.Yg.bind(this)), (0, i.l)(t, "find-media-player", this.vk.bind(this))
                }
                onConnect(t) {
                    r.t && (0, i.s)(t, "data-iphone", "");
                    const e = window.matchMedia("(pointer: coarse)");
                    this.Zg(e), e.onchange = this.Zg.bind(this);
                    const s = new ResizeObserver((0, i.J)(this.pa.bind(this)));
                    s.observe(t), (0, i.g)(this.pa.bind(this)), this.dispatch("media-player-connect", {
                        detail: this,
                        bubbles: !0,
                        composed: !0
                    }), (0, i.q)((() => {
                        s.disconnect(), e.onchange = null
                    }))
                }
                onDestroy() {
                    this.a.player = null, this.canPlayQueue.z()
                }
                td() {
                    const t = this.$el,
                        {
                            title: e,
                            live: s,
                            viewType: n,
                            providedTitle: r
                        } = this.$state,
                        a = s(),
                        o = (0, i.a3)(n()),
                        l = "Unknown" !== o ? `${a?"Live ":""}${o}` : a ? "Live" : "Media",
                        c = e();
                    (0, i.s)(this.el, "aria-label", `${l} Player` + (c ? ` - ${c}` : "")), t ? .hasAttribute("title") && (this.Re = !0, t ? .removeAttribute("title"))
                }
                Yg() {
                    const t = this.orientation.landscape ? "landscape" : "portrait";
                    this.$state.orientation.set(t), (0, i.s)(this.el, "data-orientation", t), this.pa()
                }
                sk() {
                    this.$state.canPlay() && this.p ? this.canPlayQueue.Xa() : this.canPlayQueue.$()
                }
                rk() {
                    if (t[st]) return void this.setAttributes(t[st]);
                    const e = {
                            "data-load": function() {
                                return this.$props.load()
                            },
                            "data-captions": function() {
                                const t = this.$state.textTrack();
                                return !!t && (0, o.i)(t)
                            },
                            "data-ios-controls": function() {
                                return this.$state.iOSControls()
                            },
                            "data-controls": function() {
                                return this.controls.showing
                            },
                            "data-buffering": function() {
                                const {
                                    canLoad: t,
                                    canPlay: e,
                                    waiting: s
                                } = this.$state;
                                return t() && (!e() || s())
                            },
                            "data-error": function() {
                                const {
                                    error: t
                                } = this.$state;
                                return !!t()
                            },
                            "data-autoplay-error": function() {
                                const {
                                    autoPlayError: t
                                } = this.$state;
                                return !!t()
                            }
                        },
                        s = {
                            autoPlay: "autoplay",
                            canAirPlay: "can-airplay",
                            canPictureInPicture: "can-pip",
                            pictureInPicture: "pip",
                            playsInline: "playsinline",
                            remotePlaybackState: "remote-state",
                            remotePlaybackType: "remote-type",
                            isAirPlayConnected: "airplay",
                            isGoogleCastConnected: "google-cast"
                        };
                    for (const t of it) {
                        e["data-" + (s[t] ? ? (0, i.S)(t))] = function() {
                            return this.$state[t]()
                        }
                    }
                    delete e.title, t[st] = e, this.setAttributes(e)
                }
                vk(t) {
                    t.detail(this)
                }
                pa() {
                    if (!this.el) return;
                    const t = this.el.clientWidth,
                        e = this.el.clientHeight;
                    this.$state.width.set(t), this.$state.height.set(e), (0, i.a)(this.el, "--player-width", t + "px"), (0, i.a)(this.el, "--player-height", e + "px")
                }
                Zg(t) {
                    const e = t.matches ? "coarse" : "fine";
                    (0, i.s)(this.el, "data-pointer", e), this.$state.pointer.set(e), this.pa()
                }
                get provider() {
                    return this.p
                }
                get controls() {
                    return this.W.yc
                }
                set controls(t) {
                    this.vd.controls.set(t)
                }
                get title() {
                    return (0, i.p)(this.$state.providedTitle)
                }
                set title(t) {
                    this.Re ? this.Re = !1 : this.$state.providedTitle.set(t)
                }
                get qualities() {
                    return this.a.qualities
                }
                get audioTracks() {
                    return this.a.audioTracks
                }
                get textTracks() {
                    return this.a.textTracks
                }
                get textRenderers() {
                    return this.a.textRenderers
                }
                get duration() {
                    return this.$state.duration()
                }
                set duration(t) {
                    this.vd.duration.set(t)
                }
                get paused() {
                    return (0, i.p)(this.$state.paused)
                }
                set paused(t) {
                    this._g(t)
                }
                fc() {
                    this._g(this.$props.paused())
                }
                _g(t) {
                    t ? this.canPlayQueue.k("paused", (() => this.W.Ee())) : this.canPlayQueue.k("paused", (() => this.W.Ac()))
                }
                get muted() {
                    return (0, i.p)(this.$state.muted)
                }
                set muted(t) {
                    this.vd.muted.set(t)
                }
                tk() {
                    this.wk(this.$props.muted())
                }
                wk(t) {
                    this.canPlayQueue.k("muted", (() => {
                        this.p && this.p.setMuted(t)
                    }))
                }
                get currentTime() {
                    return (0, i.p)(this.$state.currentTime)
                }
                set currentTime(t) {
                    this.$g(t)
                }
                Qb() {
                    this.$g(this.$props.currentTime())
                }
                $g(t) {
                    this.canPlayQueue.k("currentTime", (() => {
                        const {
                            currentTime: e,
                            clipStartTime: s,
                            seekableStart: n,
                            seekableEnd: r
                        } = this.$state;
                        t !== (0, i.p)(e) && (0, i.p)((() => {
                            if (!this.p) return;
                            const e = t + s(),
                                i = Math.floor(e) === Math.floor(r()) ? r() : Math.min(Math.max(n() + .1, e), r() - .1);
                            Number.isFinite(i) && this.p.setCurrentTime(i)
                        }))
                    }))
                }
                get volume() {
                    return (0, i.p)(this.$state.volume)
                }
                set volume(t) {
                    this.vd.volume.set(t)
                }
                Fc() {
                    this.xk(this.$props.volume())
                }
                xk(t) {
                    const e = (0, y.c)(0, t, 1);
                    this.canPlayQueue.k("volume", (() => {
                        this.p && this.p.setVolume(e)
                    }))
                }
                get playbackRate() {
                    return (0, i.p)(this.$state.playbackRate)
                }
                set playbackRate(t) {
                    this.ah(t)
                }
                Qe() {
                    this.ah(this.$props.playbackRate())
                }
                ah(t) {
                    this.canPlayQueue.k("rate", (() => {
                        this.p && this.p.setPlaybackRate ? .(t)
                    }))
                }
                Me() {
                    this.yk(this.$props.playsInline())
                }
                yk(t) {
                    this.canPlayQueue.k("playsinline", (() => {
                        this.p && this.p.setPlaysInline ? .(t)
                    }))
                }
                uk() {
                    let t = this.$props.storage(),
                        e = (0, i.i)(t) ? new P : t;
                    if (e ? .onChange) {
                        const {
                            source: s
                        } = this.$state, n = (0, i.i)(t) ? t : this.el ? .id, r = (0, i.o)(this.zk.bind(this));
                        (0, i.g)((() => e.onChange(s(), r(), n || void 0)))
                    }
                    this.a.storage = e, this.a.textTracks.setStorage(e), (0, i.q)((() => {
                        e ? .onDestroy ? .(), this.a.storage = null, this.a.textTracks.setStorage(null)
                    }))
                }
                zk() {
                    const {
                        clipStartTime: t,
                        clipEndTime: e
                    } = this.$props, {
                        source: s
                    } = this.$state, i = s();
                    return i.src ? `${i.src}:${t()}:${e()}` : null
                }
                async play(t) {
                    return this.W.Ac(t)
                }
                async pause(t) {
                    return this.W.Ee(t)
                }
                async enterFullscreen(t, e) {
                    return this.W.Jg(t, e)
                }
                async exitFullscreen(t, e) {
                    return this.W.Lg(t, e)
                }
                enterPictureInPicture(t) {
                    return this.W.He(t)
                }
                exitPictureInPicture(t) {
                    return this.W.Ge(t)
                }
                seekToLiveEdge(t) {
                    this.W.Ig(t)
                }
                startLoading(t) {
                    this.a.delegate.c("can-load", void 0, t)
                }
                startLoadingPoster(t) {
                    this.a.delegate.c("can-load-poster", void 0, t)
                }
                requestAirPlay(t) {
                    return this.W.Ng(t)
                }
                requestGoogleCast(t) {
                    return this.W.Og(t)
                }
                setAudioGain(t, e) {
                    return this.W.Hg(t, e)
                }
                destroy() {
                    super.destroy(), this.a.remote.setPlayer(null), this.dispatch("destroy")
                }
            };
            kt([i.a2], xt.prototype, "canPlayQueue", 2), kt([i.a2], xt.prototype, "remoteControl", 2), kt([i.a2], xt.prototype, "provider", 1), kt([i.a2], xt.prototype, "controls", 1), kt([i.a2], xt.prototype, "orientation", 2), kt([i.a2], xt.prototype, "title", 1), kt([i.a2], xt.prototype, "qualities", 1), kt([i.a2], xt.prototype, "audioTracks", 1), kt([i.a2], xt.prototype, "textTracks", 1), kt([i.a2], xt.prototype, "textRenderers", 1), kt([i.a2], xt.prototype, "duration", 1), kt([i.a2], xt.prototype, "paused", 1), kt([i.a2], xt.prototype, "muted", 1), kt([i.a2], xt.prototype, "currentTime", 1), kt([i.a2], xt.prototype, "volume", 1), kt([i.a2], xt.prototype, "playbackRate", 1), kt([i.a8], xt.prototype, "play", 1), kt([i.a8], xt.prototype, "pause", 1), kt([i.a8], xt.prototype, "enterFullscreen", 1), kt([i.a8], xt.prototype, "exitFullscreen", 1), kt([i.a8], xt.prototype, "enterPictureInPicture", 1), kt([i.a8], xt.prototype, "exitPictureInPicture", 1), kt([i.a8], xt.prototype, "seekToLiveEdge", 1), kt([i.a8], xt.prototype, "startLoading", 1), kt([i.a8], xt.prototype, "startLoadingPoster", 1), kt([i.a8], xt.prototype, "requestAirPlay", 1), kt([i.a8], xt.prototype, "requestGoogleCast", 1), kt([i.a8], xt.prototype, "setAudioGain", 1);
            let St = xt;

            function Et(t, e) {
                return fetch(t, e).then((t => t.text())).then((s => {
                    const i = function(t) {
                        const e = t.match(/#EXT-X-STREAM-INF:[^\n]+(\n[^\n]+)*/g);
                        return e ? e[0].split("\n")[1].trim() : null
                    }(s);
                    if (i) return Et(/^https?:/.test(i) ? i : new URL(i, t).href, e);
                    const n = /EXT-X-PLAYLIST-TYPE:\s*VOD/.test(s) ? "on-demand" : "live";
                    return "live" === n && function(t) {
                        const e = t.split("\n");
                        for (const t of e)
                            if (t.startsWith("#EXT-X-TARGETDURATION")) {
                                const e = parseFloat(t.split(":")[1]);
                                if (!isNaN(e)) return e
                            }
                        return -1
                    }(s) >= 10 && (/#EXT-X-DVR-ENABLED:\s*true/.test(s) || s.includes("#EXT-X-DISCONTINUITY")) ? "live:dvr" : n
                }))
            }
            const $t = new Map;
            class Ct {
                constructor(t, e, s) {
                    let n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : [];
                    this.wd = t, this.a = e, this.X = s, this.Se = !1;
                    const r = new J,
                        a = new Z,
                        o = new K,
                        l = new Q,
                        c = [new et, new tt];
                    this.Te = (0, i.o)((() => {
                        const t = e.$state.remotePlaybackLoader(),
                            s = e.$props.preferNativeHLS() ? [o, l, r, a, ...c, ...n] : [a, o, l, r, ...c, ...n];
                        return t ? [t, ...s] : s
                    }));
                    const {
                        $state: h
                    } = e;
                    h.sources.set(Mt(e.$props.src()));
                    for (const t of h.sources()) {
                        const e = this.Te().find((e => e.canPlay(t)));
                        if (!e) continue;
                        const s = e.mediaType(t);
                        this.a.$state.source.set(t), this.a.$state.mediaType.set(s), this.a.$state.inferredViewType.set(s), this.X.set(e), this.Se = !0
                    }
                }
                get c() {
                    return this.a.delegate.c
                }
                connect() {
                    const t = this.X();
                    this.Se && (this.bh(this.a.$state.source(), t), this.ch(t), this.Se = !1), (0, i.g)(this.Ak.bind(this)), (0, i.g)(this.Bk.bind(this)), (0, i.g)(this.Ck.bind(this)), (0, i.g)(this.Dk.bind(this)), (0, i.g)(this.Ek.bind(this))
                }
                Ak() {
                    this.c("sources-change", [...Mt(this.a.$props.src()), ...this.wd()])
                }
                Bk() {
                    const {
                        $state: t
                    } = this.a, e = t.sources(), s = (0, i.p)(t.source), n = this.dh(s, e);
                    if (e[0] ? .src && !n.src && !n.type) {
                        const {
                            crossOrigin: s
                        } = t, n = (0, b.b)(s()), r = new AbortController;
                        return Promise.all(e.map((t => (0, i.i)(t.src) && "?" === t.type ? fetch(t.src, {
                            method: "HEAD",
                            credentials: n,
                            signal: r.signal
                        }).then((e => (t.type = e.headers.get("content-type") || "??", $t.set(t.src, t.type), t))).catch((() => t)) : t))).then((e => {
                            r.signal.aborted || (this.dh((0, i.p)(t.source), e), (0, i.Y)())
                        })), () => r.abort()
                    }(0, i.Y)()
                }
                dh(t, e) {
                    let s = {
                            src: "",
                            type: ""
                        },
                        n = null,
                        r = new i.D("sources-change", {
                            detail: {
                                sources: e
                            }
                        }),
                        a = this.Te(),
                        {
                            started: o,
                            paused: l,
                            currentTime: c,
                            quality: h,
                            savedState: u
                        } = this.a.$state;
                    for (const t of e) {
                        const e = a.find((e => e.canPlay(t)));
                        if (e) {
                            s = t, n = e;
                            break
                        }
                    }
                    if (S(s)) {
                        const t = h(),
                            n = e.find((e => e.src === t ? .src));
                        (0, i.p)(o) ? u.set({
                            paused: (0, i.p)(l),
                            currentTime: (0, i.p)(c)
                        }): u.set(null), n && (s = n, r = new i.D("quality-change", {
                            detail: {
                                quality: t
                            }
                        }))
                    }
                    return At(t, s) || this.bh(s, n, r), n !== (0, i.p)(this.X) && this.ch(n, r), s
                }
                bh(t, e, s) {
                    this.c("source-change", t, s), this.c("media-type-change", e ? .mediaType(t) || "unknown", s)
                }
                ch(t, e) {
                    this.a.$providerSetup.set(!1), this.c("provider-change", null, e), t && (0, i.p)((() => t.preconnect ? .(this.a))), this.X.set(t), this.c("provider-loader-change", t, e)
                }
                Ck() {
                    const t = this.a.$provider();
                    if (t && !(0, i.p)(this.a.$providerSetup)) return this.a.$state.canLoad() ? ((0, i.e)((() => t.setup()), t.scope), void this.a.$providerSetup.set(!0)) : void(0, i.p)((() => t.preconnect ? .()))
                }
                Dk() {
                    if (!this.a.$providerSetup()) return;
                    const t = this.a.$provider(),
                        e = this.a.$state.source(),
                        s = (0, i.p)(this.a.$state.crossOrigin),
                        n = (0, i.p)(this.a.$props.preferNativeHLS);
                    if (!At(t ? .currentSrc, e)) {
                        if (this.a.$state.canLoad()) {
                            const l = new AbortController;
                            return (0, r.p)(e) ? !n && (0, r.s)() || Et(e.src, {
                                credentials: (0, b.b)(s),
                                signal: l.signal
                            }).then((t => {
                                this.c("stream-type-change", t)
                            })).catch(i.a4) : (0, r.q)(e) ? (a = e.src, o = {
                                credentials: (0, b.b)(s),
                                signal: l.signal
                            }, fetch(a, o).then((t => t.text())).then((t => /type="static"/.test(t) ? "on-demand" : "live"))).then((t => {
                                this.c("stream-type-change", t)
                            })).catch(i.a4) : this.c("stream-type-change", "on-demand"), (0, i.p)((() => {
                                const s = (0, i.p)(this.a.$state.preload);
                                return t ? .loadSource(e, s).catch((t => {}))
                            })), () => l.abort()
                        }
                        var a, o;
                        try {
                            (0, i.i)(e.src) && (0, b.p)(new URL(e.src).origin)
                        } catch (t) {}
                    }
                }
                Ek() {
                    const t = this.X(),
                        {
                            providedPoster: e,
                            source: s,
                            canLoadPoster: n
                        } = this.a.$state;
                    if (!t || !t.loadPoster || !s() || !n() || e()) return;
                    const r = new AbortController,
                        a = new i.D("source-change", {
                            detail: s
                        });
                    return t.loadPoster(s(), this.a, r).then((t => {
                        this.c("poster-change", t || "", a)
                    })).catch((() => {
                        this.c("poster-change", "", a)
                    })), () => {
                        r.abort()
                    }
                }
            }

            function Mt(t) {
                return ((0, i.v)(t) ? t : [t]).map((t => (0, i.i)(t) ? {
                    src: t,
                    type: Pt(t)
                } : { ...t,
                    type: Pt(t.src, t.type)
                })).sort((t => "?" === t.type ? 1 : -1))
            }

            function Pt(t, e) {
                return (0, i.i)(e) && e.length ? e : (0, i.i)(t) && $t.has(t) ? $t.get(t) : !e && (0, r.p)({
                    src: t,
                    type: ""
                }) ? "application/x-mpegurl" : !e && (0, r.q)({
                    src: t,
                    type: ""
                }) ? "application/dash+xml" : !(0, i.i)(t) || t.startsWith("blob:") ? "video/object" : t.includes("youtube") || t.includes("youtu.be") ? "video/youtube" : !t.includes("vimeo") || t.includes("progressive_redirect") || t.includes(".m3u8") ? "?" : "video/vimeo"
            }

            function At(t, e) {
                return t ? .src === e ? .src && t ? .type === e ? .type
            }
            class Lt {
                constructor(t, e) {
                    this.xd = t, this.a = e, this.eh = [], (0, i.g)(this.Fk.bind(this))
                }
                Fk() {
                    const t = this.xd();
                    for (const e of this.eh)
                        if (!t.some((t => t.id === e.id))) {
                            const t = e.id && this.a.textTracks.getById(e.id);
                            t && this.a.textTracks.remove(t)
                        }
                    for (const e of t) {
                        const t = e.id || o.T.createId(e);
                        this.a.textTracks.getById(t) || (e.id = t, this.a.textTracks.add(e))
                    }
                    this.eh = t
                }
            }
            var Ot = Object.defineProperty,
                It = Object.getOwnPropertyDescriptor;
            class qt extends i.C {
                constructor() {
                    super(...arguments), this.wd = (0, i.f)([]), this.xd = (0, i.f)([]), this.X = null, this.Ue = -1
                }
                static# t = this.props = {
                    loaders: []
                };
                static# e = this.state = new i.W({
                    loader: null
                });
                onSetup() {
                    this.a = (0, m.u)(), this.fh = new Ct(this.wd, this.a, this.$state.loader, this.$props.loaders())
                }
                onAttach(t) {
                    t.setAttribute("data-media-provider", "")
                }
                onConnect(t) {
                    this.fh.connect(), new Lt(this.xd, this.a);
                    const e = new ResizeObserver((0, i.J)(this.pa.bind(this)));
                    e.observe(t);
                    const s = new MutationObserver(this.Gc.bind(this));
                    s.observe(t, {
                        attributes: !0,
                        childList: !0
                    }), this.pa(), this.Gc(), (0, i.q)((() => {
                        e.disconnect(), s.disconnect()
                    }))
                }
                load(t) {
                    window.cancelAnimationFrame(this.Ue), this.Ue = requestAnimationFrame((() => this.Gk(t))), (0, i.q)((() => {
                        window.cancelAnimationFrame(this.Ue)
                    }))
                }
                Gk(t) {
                    if (!this.scope) return;
                    const e = this.$state.loader(),
                        {
                            $provider: s
                        } = this.a;
                    this.X === e && e ? .target === t && (0, i.p)(s) || (this.gh(), this.X = e, e && (e.target = t || null), e && t && e.load(this.a).then((t => {
                        this.scope && (0, i.p)(this.$state.loader) === e && this.a.delegate.c("provider-change", t)
                    })))
                }
                onDestroy() {
                    this.X = null, this.gh()
                }
                gh() {
                    this.a.delegate.c("provider-change", null)
                }
                pa() {
                    if (!this.el) return;
                    const {
                        player: t,
                        $state: e
                    } = this.a, s = this.el.offsetWidth, n = this.el.offsetHeight;
                    t && (e.mediaWidth.set(s), e.mediaHeight.set(n), t.el && ((0, i.a)(t.el, "--media-width", s + "px"), (0, i.a)(t.el, "--media-height", n + "px")))
                }
                Gc() {
                    const t = [],
                        e = [],
                        s = this.el.children;
                    for (const n of s)
                        if (!n.hasAttribute("data-vds"))
                            if (n instanceof HTMLSourceElement) {
                                const e = {
                                    id: n.id,
                                    src: n.src,
                                    type: n.type
                                };
                                for (const t of ["id", "src", "width", "height", "bitrate", "codec"]) {
                                    const s = n.getAttribute(`data-${t}`);
                                    (0, i.i)(s) && (e[t] = /id|src|codec/.test(t) ? s : Number(s))
                                }
                                t.push(e)
                            } else if (n instanceof HTMLTrackElement) {
                        const t = {
                            src: n.src,
                            kind: n.track.kind,
                            language: n.srclang,
                            label: n.label,
                            default: n.default,
                            type: n.getAttribute("data-type")
                        };
                        e.push({
                            id: n.id || o.T.createId(t),
                            ...t
                        })
                    }
                    this.wd.set(t), this.xd.set(e), (0, i.Y)()
                }
            }

            function Dt(t, e) {
                const s = String(t),
                    i = s.length;
                if (i < e) {
                    return `${"0".repeat(e-i)}${t}`
                }
                return s
            }

            function zt(t) {
                return {
                    hours: Math.trunc(t / 3600),
                    minutes: Math.trunc(t % 3600 / 60),
                    seconds: Math.trunc(t % 60),
                    fraction: Number((t - Math.trunc(t)).toPrecision(3))
                }
            }

            function Vt(t) {
                let {
                    padHrs: e = null,
                    padMins: s = null,
                    showHrs: n = !1,
                    showMs: r = !1
                } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                const {
                    hours: a,
                    minutes: o,
                    seconds: l,
                    fraction: c
                } = zt(t), h = e ? Dt(a, 2) : a, u = `${s||(0,i.m)(s)&&t>=3600?Dt(o,2):o}:${Dt(l,2)}${r&&c>0?`.${String(c).replace(/^0?\./,"")}`:""}`;
                return a > 0 || n ? `${h}:${u}` : u
            }

            function jt(t) {
                const e = [],
                    {
                        hours: s,
                        minutes: i,
                        seconds: n
                    } = zt(t);
                return s > 0 && e.push(`${s} hour`), i > 0 && e.push(`${i} min`), (n > 0 || 0 === e.length) && e.push(`${n} sec`), e.join(" ")
            }((t, e, s, i) => {
                for (var n, r = i > 1 ? void 0 : i ? It(e, s) : e, a = t.length - 1; a >= 0; a--)(n = t[a]) && (r = (i ? n(e, s, r) : n(r)) || r);
                i && r && Ot(e, s, r)
            })([i.a8], qt.prototype, "load", 1);
            class Ft extends i.C {
                constructor() {
                    super(...arguments), this.Ve = !1, this.Hc = -1, this.Xe = -1
                }
                static# t = this.props = {
                    translations: null
                };
                static# e = this.state = new i.W({
                    label: null,
                    busy: !1
                });
                onSetup() {
                    this.a = (0, m.u)()
                }
                onAttach(t) {
                    t.style.display = "contents"
                }
                onConnect(t) {
                    t.setAttribute("data-media-announcer", ""), (0, a.s)(t, "role", "status"), (0, a.s)(t, "aria-live", "polite");
                    const {
                        busy: e
                    } = this.$state;
                    this.setAttributes({
                        "aria-busy": () => e() ? "true" : null
                    }), this.Ve = !0, (0, i.g)(this.fc.bind(this)), (0, i.g)(this.Fc.bind(this)), (0, i.g)(this.Hk.bind(this)), (0, i.g)(this.Ik.bind(this)), (0, i.g)(this.Jk.bind(this)), (0, i.g)(this.Kk.bind(this)), (0, i.g)(this.Lk.bind(this)), (0, i.Y)(), this.Ve = !1
                }
                fc() {
                    const {
                        paused: t
                    } = this.a.$state;
                    this.Rb(t() ? "Pause" : "Play")
                }
                Ik() {
                    const {
                        fullscreen: t
                    } = this.a.$state;
                    this.Rb(t() ? "Enter Fullscreen" : "Exit Fullscreen")
                }
                Jk() {
                    const {
                        pictureInPicture: t
                    } = this.a.$state;
                    this.Rb(t() ? "Enter PiP" : "Exit PiP")
                }
                Hk() {
                    const {
                        textTrack: t
                    } = this.a.$state;
                    this.Rb(t() ? "Closed-Captions On" : "Closed-Captions Off")
                }
                Fc() {
                    const {
                        muted: t,
                        volume: e,
                        audioGain: s
                    } = this.a.$state;
                    this.Rb(t() || 0 === e() ? "Mute" : `${Math.round(e()*(s()??1)*100)}% ${this.We("Volume")}`)
                }
                Kk() {
                    const {
                        seeking: t,
                        currentTime: e
                    } = this.a.$state, s = t();
                    this.Hc > 0 ? (window.clearTimeout(this.Xe), this.Xe = window.setTimeout((() => {
                        const t = (0, i.p)(e),
                            s = Math.abs(t - this.Hc);
                        if (s >= 1) {
                            const e = t >= this.Hc,
                                i = jt(s);
                            this.Rb(`${this.We(e?"Seek Forward":"Seek Backward")} ${i}`)
                        }
                        this.Hc = -1, this.Xe = -1
                    }), 300)) : s && (this.Hc = (0, i.p)(e))
                }
                We(t) {
                    const {
                        translations: e
                    } = this.$props;
                    return e ? .() ? .[t || ""] ? ? t
                }
                Lk() {
                    const {
                        label: t,
                        busy: e
                    } = this.$state, s = this.We(t());
                    if (this.Ve) return;
                    e.set(!0);
                    const n = window.setTimeout((() => {
                        e.set(!1)
                    }), 150);
                    return this.el && (0, i.s)(this.el, "aria-label", s), (0, i.i)(s) && this.dispatch("change", {
                        detail: s
                    }), () => window.clearTimeout(n)
                }
                Rb(t) {
                    const {
                        label: e
                    } = this.$state;
                    e.set(t)
                }
            }
            class Rt extends i.C {
                static# t = this.props = {
                    hideDelay: 2e3,
                    hideOnMouseLeave: !1
                };
                onSetup() {
                    this.a = (0, m.u)(), (0, i.g)(this.Mk.bind(this))
                }
                onAttach(t) {
                    const {
                        pictureInPicture: e,
                        fullscreen: s
                    } = this.a.$state;
                    (0, i.a)(t, "pointer-events", "none"), (0, a.s)(t, "role", "group"), this.setAttributes({
                        "data-visible": this.hh.bind(this),
                        "data-fullscreen": s,
                        "data-pip": e
                    }), (0, i.g)((() => {
                        this.dispatch("change", {
                            detail: this.hh()
                        })
                    })), (0, i.g)(this.Nk.bind(this)), (0, i.g)((() => {
                        const e = s();
                        for (const s of ["top", "right", "bottom", "left"])(0, i.a)(t, `padding-${s}`, e && `env(safe-area-inset-${s})`)
                    }))
                }
                Nk() {
                    if (!this.el) return;
                    const {
                        nativeControls: t
                    } = this.a.$state, e = t();
                    (0, i.s)(this.el, "aria-hidden", e ? "true" : null), (0, i.a)(this.el, "display", e ? "none" : null)
                }
                Mk() {
                    const {
                        controls: t
                    } = this.a.player, {
                        hideDelay: e,
                        hideOnMouseLeave: s
                    } = this.$props;
                    t.defaultDelay = 2e3 === e() ? this.a.$props.controlsDelay() : e(), t.hideOnMouseLeave = s()
                }
                hh() {
                    const {
                        controlsVisible: t
                    } = this.a.$state;
                    return t()
                }
            }
            class Bt extends i.a6 {
                constructor(t) {
                    super(), this.j = t, this.zd = -1, this.Ad = -1, this.wb = null, (0, i.g)(this.Ok.bind(this))
                }
                onDestroy() {
                    this.wb ? .(), this.wb = null
                }
                Ok() {
                    const t = this.j.M();
                    if (!t) return void this.hide();
                    const e = this.show.bind(this),
                        s = this.hide.bind(this);
                    this.j.yd(t, e, s)
                }
                show(t) {
                    this.Ye(), window.cancelAnimationFrame(this.Ad), this.Ad = -1, this.wb ? .(), this.wb = null, this.zd = window.setTimeout((() => {
                        this.zd = -1;
                        const e = this.j.q();
                        e && e.style.removeProperty("display"), (0, i.p)((() => this.j.E(!0, t)))
                    }), this.j.ih ? .() ? ? 0)
                }
                hide(t) {
                    this.Ye(), (0, i.p)((() => this.j.E(!1, t))), this.Ad = requestAnimationFrame((() => {
                        this.Ye(), this.Ad = -1;
                        const t = this.j.q();
                        if (t) {
                            const e = () => {
                                t.style.display = "none", this.wb = null
                            };
                            if ((0, a.k)(t)) {
                                this.wb ? .();
                                const s = (0, i.l)(t, "animationend", e, {
                                    once: !0
                                });
                                this.wb = s
                            } else e()
                        }
                    }))
                }
                Ye() {
                    window.clearTimeout(this.zd), this.zd = -1
                }
            }
            const Nt = (0, i.Z)();
            let Ht = 0;
            class Gt extends i.C {
                constructor() {
                    super(), this.ya = "media-tooltip-" + ++Ht, this.M = (0, i.f)(null), this.q = (0, i.f)(null), new bt;
                    const {
                        showDelay: t
                    } = this.$props;
                    new Bt({
                        M: this.M,
                        q: this.q,
                        ih: t,
                        yd(t, e, s) {
                            (0, i.l)(t, "touchstart", (t => t.preventDefault()), {
                                passive: !1
                            }), (0, i.g)((() => {
                                vt() && (0, i.l)(t, "focus", e), (0, i.l)(t, "blur", s)
                            })), (0, i.l)(t, "mouseenter", e), (0, i.l)(t, "mouseleave", s)
                        },
                        E: this.Pk.bind(this)
                    })
                }
                static# t = this.props = {
                    showDelay: 700
                };
                onAttach(t) {
                    t.style.setProperty("display", "contents")
                }
                onSetup() {
                    (0, i._)(Nt, {
                        M: this.M,
                        q: this.q,
                        Ze: this.Ze.bind(this),
                        _e: this._e.bind(this),
                        $e: this.$e.bind(this),
                        af: this.af.bind(this)
                    })
                }
                Ze(t) {
                    this.M.set(t);
                    let e = t.getAttribute("data-media-tooltip");
                    e && this.el ? .setAttribute(`data-media-${e}-tooltip`, ""), (0, i.s)(t, "data-describedby", this.ya)
                }
                _e(t) {
                    t.removeAttribute("data-describedby"), t.removeAttribute("aria-describedby"), this.M.set(null)
                }
                $e(t) {
                    t.setAttribute("id", this.ya), t.style.display = "none", (0, a.s)(t, "role", "tooltip"), this.q.set(t)
                }
                af(t) {
                    t.removeAttribute("id"), t.removeAttribute("role"), this.q.set(null)
                }
                Pk(t) {
                    const e = this.M(),
                        s = this.q();
                    e && (0, i.s)(e, "aria-describedby", t ? this.ya : null);
                    for (const n of [this.el, e, s]) n && (0, i.s)(n, "data-visible", t)
                }
            }
            class Wt extends i.C {
                static# t = this.props = {
                    placement: "top center",
                    offset: 0,
                    alignOffset: 0
                };
                constructor() {
                    super(), new bt;
                    const {
                        placement: t
                    } = this.$props;
                    this.setAttributes({
                        "data-placement": t
                    })
                }
                onAttach(t) {
                    this.xb(t), Object.assign(t.style, {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "max-content"
                    })
                }
                onConnect(t) {
                    this.xb(t);
                    const e = (0, i.u)(Nt);
                    (0, i.q)((() => e.af(t))), (0, i.q)((0, a.r)((() => {
                        this.connectScope && (0, i.g)(this.bf.bind(this))
                    })))
                }
                xb(t) {
                    (0, i.u)(Nt).$e(t)
                }
                bf() {
                    const {
                        placement: t,
                        offset: e,
                        alignOffset: s
                    } = this.$props;
                    return (0, a.m)(this.el, this.Qk(), t(), {
                        offsetVarName: "media-tooltip",
                        xOffset: s(),
                        yOffset: e()
                    })
                }
                Qk() {
                    return (0, i.u)(Nt).M()
                }
            }
            class Ut extends i.a6 {
                constructor(t) {
                    super(), this.j = t, new bt, t.Sb && new X(t.Sb)
                }
                static# t = this.props = {
                    disabled: !1
                };
                onSetup() {
                    const {
                        disabled: t
                    } = this.$props;
                    this.setAttributes({
                        "data-pressed": this.j.o,
                        "aria-pressed": this.Rk.bind(this),
                        "aria-disabled": () => t() ? "true" : null
                    })
                }
                onAttach(t) {
                    (0, a.s)(t, "tabindex", "0"), (0, a.s)(t, "role", "button"), (0, a.s)(t, "type", "button")
                }
                onConnect(t) {
                    (0, a.o)(t, this.Sk.bind(this));
                    for (const t of ["click", "touchstart"]) this.listen(t, this.Tk.bind(this))
                }
                Rk() {
                    return (0, i.a9)(this.j.o())
                }
                Uk(t) {
                    (0, i.aa)(this.j.o) && this.j.o.set((t => !t))
                }
                Sk(t) {
                    if (this.$props.disabled() || this.el.hasAttribute("data-disabled")) return t.preventDefault(), void t.stopImmediatePropagation();
                    t.preventDefault(), (this.j.r ? ? this.Uk).call(this, t)
                }
                Tk(t) {
                    this.$props.disabled() && (t.preventDefault(), t.stopImmediatePropagation())
                }
            }
            var Yt = Object.defineProperty,
                Xt = Object.getOwnPropertyDescriptor;
            class Qt extends i.C {
                constructor() {
                    super(), this.jh = (0, i.f)(!1), new Ut({
                        o: this.jh
                    })
                }
                static# t = this.props = {
                    disabled: !1,
                    defaultPressed: !1
                };
                get pressed() {
                    return this.jh()
                }
            }

            function Kt(t) {
                return () => t() ? "true" : "false"
            }((t, e, s, i) => {
                for (var n, r = i > 1 ? void 0 : i ? Xt(e, s) : e, a = t.length - 1; a >= 0; a--)(n = t[a]) && (r = (i ? n(e, s, r) : n(r)) || r);
                i && r && Yt(e, s, r)
            })([i.a2], Qt.prototype, "pressed", 1);
            class Jt extends i.C {
                static# t = this.props = Ut.props;
                constructor() {
                    super(), new Ut({
                        o: this.o.bind(this),
                        r: this.r.bind(this)
                    })
                }
                onSetup() {
                    this.a = (0, m.u)();
                    const {
                        canAirPlay: t,
                        isAirPlayConnected: e
                    } = this.a.$state;
                    this.setAttributes({
                        "data-active": e,
                        "data-supported": t,
                        "data-state": this.Ic.bind(this),
                        "aria-hidden": Kt((() => !t()))
                    })
                }
                onAttach(t) {
                    t.setAttribute("data-media-tooltip", "airplay"), (0, a.n)(t, this.Jc.bind(this))
                }
                r(t) {
                    this.a.remote.requestAirPlay(t)
                }
                o() {
                    const {
                        remotePlaybackType: t,
                        remotePlaybackState: e
                    } = this.a.$state;
                    return "airplay" === t() && "disconnected" !== e()
                }
                Ic() {
                    const {
                        remotePlaybackType: t,
                        remotePlaybackState: e
                    } = this.a.$state;
                    return "airplay" === t() && e()
                }
                Jc() {
                    const {
                        remotePlaybackState: t
                    } = this.a.$state;
                    return `AirPlay ${t()}`
                }
            }
            class Zt extends i.C {
                static# t = this.props = Ut.props;
                constructor() {
                    super(), new Ut({
                        o: this.o.bind(this),
                        r: this.r.bind(this)
                    })
                }
                onSetup() {
                    this.a = (0, m.u)();
                    const {
                        canGoogleCast: t,
                        isGoogleCastConnected: e
                    } = this.a.$state;
                    this.setAttributes({
                        "data-active": e,
                        "data-supported": t,
                        "data-state": this.Ic.bind(this),
                        "aria-hidden": Kt((() => !t()))
                    })
                }
                onAttach(t) {
                    t.setAttribute("data-media-tooltip", "google-cast"), (0, a.n)(t, this.Jc.bind(this))
                }
                r(t) {
                    this.a.remote.requestGoogleCast(t)
                }
                o() {
                    const {
                        remotePlaybackType: t,
                        remotePlaybackState: e
                    } = this.a.$state;
                    return "google-cast" === t() && "disconnected" !== e()
                }
                Ic() {
                    const {
                        remotePlaybackType: t,
                        remotePlaybackState: e
                    } = this.a.$state;
                    return "google-cast" === t() && e()
                }
                Jc() {
                    const {
                        remotePlaybackState: t
                    } = this.a.$state;
                    return `Google Cast ${t()}`
                }
            }
            class te extends i.C {
                static# t = this.props = Ut.props;
                constructor() {
                    super(), new Ut({
                        o: this.o.bind(this),
                        Sb: "togglePaused",
                        r: this.r.bind(this)
                    })
                }
                onSetup() {
                    this.a = (0, m.u)();
                    const {
                        paused: t,
                        ended: e
                    } = this.a.$state;
                    this.setAttributes({
                        "data-paused": t,
                        "data-ended": e
                    })
                }
                onAttach(t) {
                    t.setAttribute("data-media-tooltip", "play"), (0, a.n)(t, "Play")
                }
                r(t) {
                    const e = this.a.remote;
                    this.o() ? e.pause(t) : e.play(t)
                }
                o() {
                    const {
                        paused: t
                    } = this.a.$state;
                    return !t()
                }
            }
            class ee extends i.C {
                static# t = this.props = Ut.props;
                constructor() {
                    super(), new Ut({
                        o: this.o.bind(this),
                        Sb: "toggleCaptions",
                        r: this.r.bind(this)
                    })
                }
                onSetup() {
                    this.a = (0, m.u)(), this.setAttributes({
                        "data-active": this.o.bind(this),
                        "data-supported": () => !this.Tb(),
                        "aria-hidden": Kt(this.Tb.bind(this))
                    })
                }
                onAttach(t) {
                    t.setAttribute("data-media-tooltip", "caption"), (0, a.n)(t, "Captions")
                }
                r(t) {
                    this.a.remote.toggleCaptions(t)
                }
                o() {
                    const {
                        textTrack: t
                    } = this.a.$state, e = t();
                    return !!e && (0, o.i)(e)
                }
                Tb() {
                    const {
                        hasCaptions: t
                    } = this.a.$state;
                    return !t()
                }
            }
            class se extends i.C {
                static# t = this.props = { ...Ut.props,
                    target: "prefer-media"
                };
                constructor() {
                    super(), new Ut({
                        o: this.o.bind(this),
                        Sb: "toggleFullscreen",
                        r: this.r.bind(this)
                    })
                }
                onSetup() {
                    this.a = (0, m.u)();
                    const {
                        fullscreen: t
                    } = this.a.$state, e = this.Kc.bind(this);
                    this.setAttributes({
                        "data-active": t,
                        "data-supported": e,
                        "aria-hidden": Kt((() => !e()))
                    })
                }
                onAttach(t) {
                    t.setAttribute("data-media-tooltip", "fullscreen"), (0, a.n)(t, "Fullscreen")
                }
                r(t) {
                    const e = this.a.remote,
                        s = this.$props.target();
                    this.o() ? e.exitFullscreen(s, t) : e.enterFullscreen(s, t)
                }
                o() {
                    const {
                        fullscreen: t
                    } = this.a.$state;
                    return t()
                }
                Kc() {
                    const {
                        canFullscreen: t
                    } = this.a.$state;
                    return t()
                }
            }
            class ie extends i.C {
                static# t = this.props = Ut.props;
                constructor() {
                    super(), new Ut({
                        o: this.o.bind(this),
                        Sb: "toggleMuted",
                        r: this.r.bind(this)
                    })
                }
                onSetup() {
                    this.a = (0, m.u)(), this.setAttributes({
                        "data-muted": this.o.bind(this),
                        "data-state": this.Ic.bind(this)
                    })
                }
                onAttach(t) {
                    t.setAttribute("data-media-mute-button", ""), t.setAttribute("data-media-tooltip", "mute"), (0, a.n)(t, "Mute")
                }
                r(t) {
                    const e = this.a.remote;
                    this.o() ? e.unmute(t) : e.mute(t)
                }
                o() {
                    const {
                        muted: t,
                        volume: e
                    } = this.a.$state;
                    return t() || 0 === e()
                }
                Ic() {
                    const {
                        muted: t,
                        volume: e
                    } = this.a.$state, s = e();
                    return t() || 0 === s ? "muted" : s >= .5 ? "high" : s < .5 ? "low" : void 0
                }
            }
            class ne extends i.C {
                static# t = this.props = Ut.props;
                constructor() {
                    super(), new Ut({
                        o: this.o.bind(this),
                        Sb: "togglePictureInPicture",
                        r: this.r.bind(this)
                    })
                }
                onSetup() {
                    this.a = (0, m.u)();
                    const {
                        pictureInPicture: t
                    } = this.a.$state, e = this.Kc.bind(this);
                    this.setAttributes({
                        "data-active": t,
                        "data-supported": e,
                        "aria-hidden": Kt((() => !e()))
                    })
                }
                onAttach(t) {
                    t.setAttribute("data-media-tooltip", "pip"), (0, a.n)(t, "PiP")
                }
                r(t) {
                    const e = this.a.remote;
                    this.o() ? e.exitPictureInPicture(t) : e.enterPictureInPicture(t)
                }
                o() {
                    const {
                        pictureInPicture: t
                    } = this.a.$state;
                    return t()
                }
                Kc() {
                    const {
                        canPictureInPicture: t
                    } = this.a.$state;
                    return t()
                }
            }
            class re extends i.C {
                static# t = this.props = {
                    disabled: !1,
                    seconds: 30
                };
                constructor() {
                    super(), new bt
                }
                onSetup() {
                    this.a = (0, m.u)();
                    const {
                        seeking: t
                    } = this.a.$state, {
                        seconds: e
                    } = this.$props, s = this.Kc.bind(this);
                    this.setAttributes({
                        seconds: e,
                        "data-seeking": t,
                        "data-supported": s,
                        "aria-hidden": Kt((() => !s()))
                    })
                }
                onAttach(t) {
                    (0, a.s)(t, "tabindex", "0"), (0, a.s)(t, "role", "button"), (0, a.s)(t, "type", "button"), t.setAttribute("data-media-tooltip", "seek"), (0, a.n)(t, this.Jc.bind(this))
                }
                onConnect(t) {
                    (0, a.o)(t, this.r.bind(this))
                }
                Kc() {
                    const {
                        canSeek: t
                    } = this.a.$state;
                    return t()
                }
                Jc() {
                    const {
                        seconds: t
                    } = this.$props;
                    return `Seek ${t()>0?"forward":"backward"} ${t()} seconds`
                }
                r(t) {
                    const {
                        seconds: e,
                        disabled: s
                    } = this.$props;
                    if (s()) return;
                    const {
                        currentTime: i
                    } = this.a.$state, n = i() + e();
                    this.a.remote.seek(n, t)
                }
            }
            class ae extends i.C {
                static# t = this.props = {
                    disabled: !1
                };
                constructor() {
                    super(), new bt
                }
                onSetup() {
                    this.a = (0, m.u)();
                    const {
                        disabled: t
                    } = this.$props, {
                        live: e,
                        liveEdge: s
                    } = this.a.$state, i = () => !e();
                    this.setAttributes({
                        "data-edge": s,
                        "data-hidden": i,
                        "aria-disabled": Kt((() => t() || s())),
                        "aria-hidden": Kt(i)
                    })
                }
                onAttach(t) {
                    (0, a.s)(t, "tabindex", "0"), (0, a.s)(t, "role", "button"), (0, a.s)(t, "type", "button"), t.setAttribute("data-media-tooltip", "live")
                }
                onConnect(t) {
                    (0, a.o)(t, this.r.bind(this))
                }
                r(t) {
                    const {
                        disabled: e
                    } = this.$props, {
                        liveEdge: s
                    } = this.a.$state;
                    e() || s() || this.a.remote.seekToLiveEdge(t)
                }
            }
            const oe = new i.W({
                min: 0,
                max: 100,
                value: 0,
                step: 1,
                pointerValue: 0,
                focused: !1,
                dragging: !1,
                pointing: !1,
                hidden: !1,
                get active() {
                    return this.dragging || this.focused || this.pointing
                },
                get fillRate() {
                    return le(this.min, this.max, this.value)
                },
                get fillPercent() {
                    return 100 * this.fillRate
                },
                get pointerRate() {
                    return le(this.min, this.max, this.pointerValue)
                },
                get pointerPercent() {
                    return 100 * this.pointerRate
                }
            });

            function le(t, e, s) {
                const i = e - t;
                return i > 0 ? (s - t) / i : 0
            }
            class ce extends i.a6 {
                constructor(t) {
                    super(), this.Hb = t
                }
                onConnect(t) {
                    this.Ra = new IntersectionObserver((t => {
                        this.Hb.callback ? .(t, this.Ra)
                    }), this.Hb), this.Ra.observe(t), (0, i.q)(this.Vk.bind(this))
                }
                Vk() {
                    this.Ra ? .disconnect(), this.Ra = void 0
                }
            }
            const he = (0, i.Z)(),
                ue = (0, i.Z)();
            const de = {
                Left: -1,
                ArrowLeft: -1,
                Up: 1,
                ArrowUp: 1,
                Right: 1,
                ArrowRight: 1,
                Down: -1,
                ArrowDown: -1
            };
            class pe extends i.a6 {
                constructor(t, e) {
                    super(), this.j = t, this.a = e, this.p = null, this.cb = null, this.Ub = null, this.Bn = !1, this.cl = M((t => {
                        this.db(this.Cd(t), t)
                    }), 20, {
                        leading: !0
                    })
                }
                onSetup() {
                    (0, i.ab)(ue) && (this.Ra = (0, i.u)(ue))
                }
                onConnect() {
                    (0, i.g)(this.Wk.bind(this)), (0, i.g)(this.Xk.bind(this)), this.j.kh && (0, i.g)(this.Yk.bind(this))
                }
                Yk() {
                    const {
                        pointer: t
                    } = this.a.$state;
                    "coarse" === t() && this.j.kh() ? (this.p = this.a.player.el ? .querySelector("media-provider,[data-media-provider]"), this.p && ((0, i.l)(this.p, "touchstart", this.Zk.bind(this), {
                        passive: !0
                    }), (0, i.l)(this.p, "touchmove", this._k.bind(this), {
                        passive: !1
                    }))) : this.p = null
                }
                Zk(t) {
                    this.cb = t.touches[0]
                }
                _k(t) {
                    if ((0, i.m)(this.cb) || (0, a.j)(t)) return;
                    const e = t.touches[0],
                        s = e.clientX - this.cb.clientX,
                        n = e.clientY - this.cb.clientY,
                        r = this.$state.dragging();
                    !r && Math.abs(n) > 5 || r || (t.preventDefault(), Math.abs(s) > 20 && (this.cb = e, this.Ub = this.$state.value(), this.cf(this.Ub, t)))
                }
                Wk() {
                    const {
                        hidden: t
                    } = this.$props;
                    this.listen("focus", this.Ec.bind(this)), this.listen("keydown", this.ic.bind(this)), this.listen("keyup", this.hc.bind(this)), t() || this.j.v() || (this.listen("pointerenter", this.Oe.bind(this)), this.listen("pointermove", this.$k.bind(this)), this.listen("pointerleave", this.Pe.bind(this)), this.listen("pointerdown", this.al.bind(this)))
                }
                Xk() {
                    !this.j.v() && this.$state.dragging() && ((0, i.l)(document, "pointerup", this.bl.bind(this), {
                        capture: !0
                    }), (0, i.l)(document, "pointermove", this.cl.bind(this)), (0, i.l)(document, "touchmove", this.dl.bind(this), {
                        passive: !1
                    }))
                }
                Ec() {
                    this.db(this.$state.value())
                }
                df(t, e) {
                    const {
                        value: s,
                        min: i,
                        max: n,
                        dragging: r
                    } = this.$state, a = Math.max(i(), Math.min(t, n()));
                    s.set(a);
                    const o = this.createEvent("value-change", {
                        detail: a,
                        trigger: e
                    });
                    if (this.dispatch(o), this.j.l ? .(o), r()) {
                        const t = this.createEvent("drag-value-change", {
                            detail: a,
                            trigger: e
                        });
                        this.dispatch(t), this.j.S ? .(t)
                    }
                }
                db(t, e) {
                    const {
                        pointerValue: s,
                        dragging: i
                    } = this.$state;
                    s.set(t), this.dispatch("pointer-value-change", {
                        detail: t,
                        trigger: e
                    }), i() && this.df(t, e)
                }
                Cd(t) {
                    let e, s = this.el.getBoundingClientRect(),
                        {
                            min: n,
                            max: r
                        } = this.$state;
                    if ("vertical" === this.$props.orientation()) {
                        const {
                            bottom: i,
                            height: n
                        } = s;
                        e = (i - t.clientY) / n
                    } else if (this.cb && (0, i.j)(this.Ub)) {
                        const {
                            width: s
                        } = this.p.getBoundingClientRect(), i = (t.clientX - this.cb.clientX) / s, a = r() - n(), o = a * Math.abs(i);
                        e = (i < 0 ? this.Ub - o : this.Ub + o) / a
                    } else {
                        const {
                            left: i,
                            width: n
                        } = s;
                        e = (t.clientX - i) / n
                    }
                    return Math.max(n(), Math.min(r(), this.j.Da(function(t, e, s, i) {
                        const n = (e - t) * (0, y.c)(0, s, 1) / i;
                        return t + i * Math.round(n)
                    }(n(), r(), e, this.j.qa()))))
                }
                Oe(t) {
                    this.$state.pointing.set(!0)
                }
                $k(t) {
                    const {
                        dragging: e
                    } = this.$state;
                    e() || this.db(this.Cd(t), t)
                }
                Pe(t) {
                    this.$state.pointing.set(!1)
                }
                al(t) {
                    if (0 !== t.button) return;
                    const e = this.Cd(t);
                    this.cf(e, t), this.db(e, t)
                }
                cf(t, e) {
                    const {
                        dragging: s
                    } = this.$state;
                    if (s()) return;
                    s.set(!0), this.a.remote.pauseControls(e);
                    const i = this.createEvent("drag-start", {
                        detail: t,
                        trigger: e
                    });
                    this.dispatch(i), this.j.ef ? .(i), this.Ra ? .onDragStart ? .()
                }
                lh(t, e) {
                    const {
                        dragging: s
                    } = this.$state;
                    if (!s()) return;
                    s.set(!1), this.a.remote.resumeControls(e);
                    const i = this.createEvent("drag-end", {
                        detail: t,
                        trigger: e
                    });
                    this.dispatch(i), this.j.Dd ? .(i), this.cb = null, this.Ub = null, this.Ra ? .onDragEnd ? .()
                }
                ic(t) {
                    if (!Object.keys(de).includes(t.key)) return;
                    const {
                        key: e
                    } = t, s = this.Cn(t);
                    if (!(0, i.m)(s)) return this.db(s, t), void this.df(s, t);
                    const n = this.Dn(t);
                    this.Bn || (this.Bn = e === this.ff, !this.$state.dragging() && this.Bn && this.cf(n, t)), this.db(n, t), this.ff = e
                }
                hc(t) {
                    if (!Object.keys(de).includes(t.key) || !(0, i.m)(this.Cn(t))) return;
                    const e = this.Bn ? this.$state.pointerValue() : this.Dn(t);
                    this.df(e, t), this.lh(e, t), this.ff = "", this.Bn = !1
                }
                Cn(t) {
                    let e = t.key,
                        {
                            min: s,
                            max: i
                        } = this.$state;
                    return "Home" === e || "PageUp" === e ? s() : "End" === e || "PageDown" === e ? i() : !t.metaKey && /^[0-9]$/.test(e) ? (i() - s()) / 10 * Number(e) : null
                }
                Dn(t) {
                    const {
                        key: e,
                        shiftKey: s
                    } = t;
                    t.preventDefault(), t.stopPropagation();
                    const {
                        shiftKeyMultiplier: i
                    } = this.$props, {
                        min: n,
                        max: r,
                        value: a,
                        pointerValue: o
                    } = this.$state, l = this.j.qa(), c = this.j.eb(), h = (s ? c * i() : c) * Number(de[e]), u = ((this.Bn ? o() : this.j.Y ? .() ? ? a()) + h) / l;
                    return Math.max(n(), Math.min(r(), Number((l * u).toFixed(3))))
                }
                bl(t) {
                    if (0 !== t.button) return;
                    t.preventDefault(), t.stopImmediatePropagation();
                    const e = this.Cd(t);
                    this.db(e, t), this.lh(e, t)
                }
                dl(t) {
                    t.preventDefault()
                }
            }
            const fe = (0, i.Z)((() => ({})));
            class me extends i.a6 {
                constructor(t) {
                    super(), this.j = t, this.Lc = (0, i.f)(!0), this.Mc = (0, i.f)(!0), this.jl = (0, i.J)(((t, e) => {
                        this.el ? .style.setProperty("--slider-fill", t + "%"), this.el ? .style.setProperty("--slider-pointer", e + "%")
                    }))
                }
                static# t = this.props = {
                    hidden: !1,
                    disabled: !1,
                    step: 1,
                    keyStep: 1,
                    orientation: "horizontal",
                    shiftKeyMultiplier: 5
                };
                onSetup() {
                    this.a = (0, m.u)();
                    const t = new bt;
                    t.attach(this), this.$state.focused = t.focused.bind(t), (0, i.ab)(fe) || (0, i._)(fe, {
                        default: "value"
                    }), (0, i._)(he, {
                        bb: this.$props.orientation,
                        Ed: this.j.v,
                        nh: (0, i.f)(null)
                    }), (0, i.g)(this.N.bind(this)), (0, i.g)(this.fl.bind(this)), (0, i.g)(this.Nc.bind(this)), this.gl(), new pe(this.j, this.a).attach(this), new ce({
                        callback: this.gf.bind(this)
                    }).attach(this)
                }
                onAttach(t) {
                    (0, a.s)(t, "role", "slider"), (0, a.s)(t, "tabindex", "0"), (0, a.s)(t, "autocomplete", "off"), (0, i.g)(this.oh.bind(this))
                }
                onConnect(t) {
                    (0, i.q)((0, a.p)(t, this.Lc.set)), (0, i.g)(this.Ea.bind(this))
                }
                gf(t) {
                    this.Mc.set(t[0].isIntersecting)
                }
                Ea() {
                    const {
                        hidden: t
                    } = this.$props;
                    this.$state.hidden.set(t() || !this.Lc() || !this.Mc.bind(this))
                }
                N() {
                    const {
                        dragging: t,
                        value: e,
                        min: s,
                        max: n
                    } = this.$state;
                    (0, i.p)(t) || e.set(function(t, e, s, i) {
                        return (0, y.c)(t, (0, y.r)(s, (0, y.g)(i)), e)
                    }(s(), n(), e(), this.j.qa()))
                }
                fl() {
                    this.$state.step.set(this.j.qa())
                }
                Nc() {
                    if (!this.j.v()) return;
                    const {
                        dragging: t,
                        pointing: e
                    } = this.$state;
                    t.set(!1), e.set(!1)
                }
                il() {
                    return (0, i.a9)(this.j.v())
                }
                gl() {
                    const {
                        orientation: t
                    } = this.$props, {
                        dragging: e,
                        active: s,
                        pointing: i
                    } = this.$state;
                    this.setAttributes({
                        "data-dragging": e,
                        "data-pointing": i,
                        "data-active": s,
                        "aria-disabled": this.il.bind(this),
                        "aria-valuemin": this.j.Tm ? ? this.$state.min,
                        "aria-valuemax": this.j.hf ? ? this.$state.max,
                        "aria-valuenow": this.j.O,
                        "aria-valuetext": this.j.P,
                        "aria-orientation": t
                    })
                }
                oh() {
                    const {
                        fillPercent: t,
                        pointerPercent: e
                    } = this.$state;
                    this.jl((0, y.r)(t(), 3), (0, y.r)(e(), 3))
                }
            }
            class ge extends i.C {
                static# t = this.props = { ...me.props,
                    min: 0,
                    max: 100,
                    value: 0
                };
                static# e = this.state = oe;
                constructor() {
                    super(), new me({
                        qa: this.$props.step,
                        eb: this.$props.keyStep,
                        Da: Math.round,
                        v: this.$props.disabled,
                        O: this.O.bind(this),
                        P: this.P.bind(this)
                    })
                }
                onSetup() {
                    (0, i.g)(this.N.bind(this)), (0, i.g)(this.Oc.bind(this))
                }
                O() {
                    const {
                        value: t
                    } = this.$state;
                    return Math.round(t())
                }
                P() {
                    const {
                        value: t,
                        max: e
                    } = this.$state;
                    return (0, y.r)(t() / e() * 100, 2) + "%"
                }
                N() {
                    const {
                        value: t
                    } = this.$props;
                    this.$state.value.set(t())
                }
                Oc() {
                    const {
                        min: t,
                        max: e
                    } = this.$props;
                    this.$state.min.set(t()), this.$state.max.set(e())
                }
            }
            const ve = new Map,
                be = new Map;
            class ye {
                constructor(t, e, s) {
                    this.$src = t, this.$crossOrigin = e, this.a = s, this.$images = (0, i.f)([]), (0, i.g)(this.kl.bind(this))
                }
                static create(t, e) {
                    const s = (0, m.u)();
                    return new ye(t, e, s)
                }
                kl() {
                    const {
                        canLoad: t
                    } = this.a.$state;
                    if (!t()) return;
                    const e = this.$src(),
                        n = new AbortController;
                    if (e) {
                        if ((0, i.i)(e) && ve.has(e)) {
                            const t = ve.get(e);
                            if (ve.delete(e), ve.set(e, t), ve.size > 30) {
                                const t = ve.keys().next().value;
                                ve.delete(t)
                            }
                            this.$images.set(ve.get(e))
                        } else if ((0, i.i)(e)) {
                            const t = this.$crossOrigin(),
                                r = e + "::" + t;
                            if (!be.has(r)) {
                                const a = new Promise((async (r, a) => {
                                    try {
                                        const o = await fetch(e, {
                                            signal: n.signal,
                                            credentials: (0, b.b)(t)
                                        });
                                        if ("application/json" === o.headers.get("content-type")) {
                                            const t = await o.json();
                                            if ((0, i.v)(t))
                                                if (t[0] && "text" in t[0]) r(this.ph(t));
                                                else {
                                                    for (let e = 0; e < t.length; e++) {
                                                        const s = t[e];
                                                        (0, v.a)((0, i.t)(s), !1), (0, v.a)("url" in s && (0, i.i)(s.url), !1), (0, v.a)("startTime" in s && (0, i.j)(s.startTime), !1)
                                                    }
                                                    r(t)
                                                }
                                            else r(this.qh(t));
                                            return
                                        }
                                        s.e(944).then(s.bind(s, "../node_modules/media-captions/dist/prod.js")).then((async t => {
                                            let {
                                                parseResponse: e
                                            } = t;
                                            try {
                                                const {
                                                    cues: t
                                                } = await e(o);
                                                r(this.ph(t))
                                            } catch (t) {
                                                a(t)
                                            }
                                        }))
                                    } catch (t) {
                                        a(t)
                                    }
                                })).then((t => (n.signal.aborted || ve.set(r, t), t))).catch((t => {
                                    n.signal.aborted || this.Q(e, t)
                                })).finally((() => {
                                    (0, i.i)(r) && be.delete(r)
                                }));
                                be.set(r, a)
                            }
                            be.get(r) ? .then((t => {
                                n.signal.aborted || this.$images.set(t || [])
                            }))
                        } else if ((0, i.v)(e)) try {
                            this.$images.set(this.ll(e))
                        } catch (t) {
                            this.Q(e, t)
                        } else try {
                            this.$images.set(this.qh(e))
                        } catch (t) {
                            this.Q(e, t)
                        }
                        return () => {
                            n.abort(), this.$images.set([])
                        }
                    }
                }
                ll(t) {
                    const e = this.rh();
                    return t.map(((t, s) => ((0, v.a)(t.url && (0, i.i)(t.url), !1), (0, v.a)("startTime" in t && (0, i.j)(t.startTime), !1), { ...t,
                        url: (0, i.i)(t.url) ? this.sh(t.url, e) : t.url
                    })))
                }
                qh(t) {
                    (0, v.a)((0, i.i)(t.url), !1), (0, v.a)((0, i.v)(t.tiles) && t.tiles ? .length, !1);
                    const e = new URL(t.url),
                        s = [],
                        n = "tile_width" in t ? t.tile_width : t.tileWidth,
                        r = "tile_height" in t ? t.tile_height : t.tileHeight;
                    for (const i of t.tiles) s.push({
                        url: e,
                        startTime: "start" in i ? i.start : i.startTime,
                        width: n,
                        height: r,
                        coords: {
                            x: i.x,
                            y: i.y
                        }
                    });
                    return s
                }
                ph(t) {
                    for (let e = 0; e < t.length; e++) {
                        const s = t[e];
                        (0, v.a)("startTime" in s && (0, i.j)(s.startTime), !1), (0, v.a)("text" in s && (0, i.i)(s.text), !1)
                    }
                    const e = [],
                        s = this.rh();
                    for (const n of t) {
                        const [t, r] = n.text.split("#"), a = this.ml(r);
                        e.push({
                            url: this.sh(t, s),
                            startTime: n.startTime,
                            endTime: n.endTime,
                            width: a ? .w,
                            height: a ? .h,
                            coords: a && (0, i.j)(a.x) && (0, i.j)(a.y) ? {
                                x: a.x,
                                y: a.y
                            } : void 0
                        })
                    }
                    return e
                }
                rh() {
                    let t = (0, i.p)(this.$src);
                    return (0, i.i)(t) && /^https?:/.test(t) ? t : location.href
                }
                sh(t, e) {
                    return /^https?:/.test(t) ? new URL(t) : new URL(t, e)
                }
                ml(t) {
                    if (!t) return {};
                    const [e, s] = t.split("="), i = s ? .split(","), n = {};
                    if (!e || !i) return null;
                    for (let t = 0; t < e.length; t++) {
                        const s = +i[t];
                        isNaN(s) || (n[e[t]] = s)
                    }
                    return n
                }
                Q(t, e) {}
            }
            class we extends i.C {
                constructor() {
                    super(...arguments), this.jf = []
                }
                static# t = this.props = {
                    src: null,
                    time: 0,
                    crossOrigin: null
                };
                static# e = this.state = new i.W({
                    src: "",
                    img: null,
                    thumbnails: [],
                    activeThumbnail: null,
                    crossOrigin: null,
                    loading: !1,
                    error: null,
                    hidden: !1
                });
                onSetup() {
                    this.a = (0, m.u)(), this.X = ye.create(this.$props.src, this.$state.crossOrigin), this.Ca(), this.setAttributes({
                        "data-loading": this.Pc.bind(this),
                        "data-error": this.fb.bind(this),
                        "data-hidden": this.$state.hidden,
                        "aria-hidden": Kt(this.$state.hidden)
                    })
                }
                onConnect(t) {
                    (0, i.g)(this.kf.bind(this)), (0, i.g)(this.Ea.bind(this)), (0, i.g)(this.Ca.bind(this)), (0, i.g)(this.Ma.bind(this)), (0, i.g)(this.nl.bind(this)), (0, i.g)(this.th.bind(this))
                }
                kf() {
                    const t = this.$state.img();
                    t && ((0, i.l)(t, "load", this.tb.bind(this)), (0, i.l)(t, "error", this.Q.bind(this)))
                }
                Ca() {
                    const {
                        crossOrigin: t
                    } = this.$props, {
                        crossOrigin: e
                    } = this.$state, {
                        crossOrigin: s
                    } = this.a.$state, i = null !== t() ? t() : s();
                    e.set(!0 === i ? "anonymous" : i)
                }
                Ma() {
                    const {
                        src: t,
                        loading: e,
                        error: s
                    } = this.$state;
                    return t() && (e.set(!0), s.set(null)), () => {
                        this.ol(), e.set(!1), s.set(null)
                    }
                }
                tb() {
                    const {
                        loading: t,
                        error: e
                    } = this.$state;
                    this.th(), t.set(!1), e.set(null)
                }
                Q(t) {
                    const {
                        loading: e,
                        error: s
                    } = this.$state;
                    e.set(!1), s.set(t)
                }
                Pc() {
                    const {
                        loading: t,
                        hidden: e
                    } = this.$state;
                    return !e() && t()
                }
                fb() {
                    const {
                        error: t
                    } = this.$state;
                    return !(0, i.m)(t())
                }
                Ea() {
                    const {
                        hidden: t
                    } = this.$state, {
                        duration: e
                    } = this.a.$state, s = this.X.$images();
                    t.set(this.fb() || !Number.isFinite(e()) || 0 === s.length)
                }
                uh() {
                    return this.$props.time()
                }
                nl() {
                    let t = this.X.$images();
                    if (!t.length) return;
                    let e = this.uh(),
                        {
                            src: s,
                            activeThumbnail: i
                        } = this.$state,
                        n = -1,
                        r = null;
                    for (let s = t.length - 1; s >= 0; s--) {
                        const i = t[s];
                        if (e >= i.startTime && (!i.endTime || e < i.endTime)) {
                            n = s;
                            break
                        }
                    }
                    t[n] && (r = t[n]), i.set(r), s.set(r ? .url.href || "")
                }
                th() {
                    if (!this.scope || this.$state.hidden()) return;
                    const t = this.el,
                        e = this.$state.img(),
                        s = this.$state.activeThumbnail();
                    if (!e || !s || !t) return;
                    let i = s.width ? ? e.naturalWidth,
                        n = s ? .height ? ? e.naturalHeight,
                        {
                            maxWidth: r,
                            maxHeight: a,
                            minWidth: o,
                            minHeight: l,
                            width: c,
                            height: h
                        } = getComputedStyle(this.el);
                    "100%" === o && (o = parseFloat(c) + ""), "100%" === l && (l = parseFloat(h) + "");
                    let u = Math.max(parseInt(o) / i, parseInt(l) / n),
                        d = Math.min(Math.max(parseInt(o), parseInt(r)) / i, Math.max(parseInt(l), parseInt(a)) / n),
                        p = !isNaN(d) && d < 1 ? d : u > 1 ? u : 1;
                    this.Vb(t, "--thumbnail-width", i * p + "px"), this.Vb(t, "--thumbnail-height", n * p + "px"), this.Vb(e, "width", e.naturalWidth * p + "px"), this.Vb(e, "height", e.naturalHeight * p + "px"), this.Vb(e, "transform", s.coords ? `translate(-${s.coords.x*p}px, -${s.coords.y*p}px)` : ""), this.Vb(e, "max-width", "none")
                }
                Vb(t, e, s) {
                    t.style.setProperty(e, s), this.jf.push((() => t.style.removeProperty(e)))
                }
                ol() {
                    for (const t of this.jf) t();
                    this.jf = []
                }
            }
            var Te = Object.defineProperty,
                _e = Object.getOwnPropertyDescriptor;
            class ke extends i.C {
                static# t = this.props = {
                    src: null,
                    crossOrigin: null
                };
                static# e = this.state = new i.W({
                    video: null,
                    src: null,
                    crossOrigin: null,
                    canPlay: !1,
                    error: null,
                    hidden: !1
                });
                get video() {
                    return this.$state.video()
                }
                onSetup() {
                    this.a = (0, m.u)(), this.ia = (0, i.L)(ge.state), this.Ca(), this.setAttributes({
                        "data-loading": this.Pc.bind(this),
                        "data-hidden": this.$state.hidden,
                        "data-error": this.fb.bind(this),
                        "aria-hidden": Kt(this.$state.hidden)
                    })
                }
                onAttach(t) {
                    (0, i.g)(this.pl.bind(this)), (0, i.g)(this.Mb.bind(this)), (0, i.g)(this.Ca.bind(this)), (0, i.g)(this.Ea.bind(this)), (0, i.g)(this.ql.bind(this)), (0, i.g)(this.rl.bind(this))
                }
                pl() {
                    const t = this.$state.video();
                    t && (t.readyState >= 2 && this.ed(), (0, i.l)(t, "canplay", this.ed.bind(this)), (0, i.l)(t, "error", this.Q.bind(this)))
                }
                Mb() {
                    const {
                        src: t
                    } = this.$state, {
                        canLoad: e
                    } = this.a.$state;
                    t.set(e() ? this.$props.src() : null)
                }
                Ca() {
                    const {
                        crossOrigin: t
                    } = this.$props, {
                        crossOrigin: e
                    } = this.$state, {
                        crossOrigin: s
                    } = this.a.$state, i = null !== t() ? t() : s();
                    e.set(!0 === i ? "anonymous" : i)
                }
                Pc() {
                    const {
                        canPlay: t,
                        hidden: e
                    } = this.$state;
                    return !t() && !e()
                }
                fb() {
                    const {
                        error: t
                    } = this.$state;
                    return !(0, i.m)(t)
                }
                Ea() {
                    const {
                        src: t,
                        hidden: e
                    } = this.$state, {
                        canLoad: s,
                        duration: i
                    } = this.a.$state;
                    e.set(s() && (!t() || this.fb() || !Number.isFinite(i())))
                }
                ql() {
                    const {
                        src: t,
                        canPlay: e,
                        error: s
                    } = this.$state;
                    t(), e.set(!1), s.set(null)
                }
                ed(t) {
                    const {
                        canPlay: e,
                        error: s
                    } = this.$state;
                    e.set(!0), s.set(null), this.dispatch("can-play", {
                        trigger: t
                    })
                }
                Q(t) {
                    const {
                        canPlay: e,
                        error: s
                    } = this.$state;
                    e.set(!1), s.set(t), this.dispatch("error", {
                        trigger: t
                    })
                }
                rl() {
                    const {
                        video: t,
                        canPlay: e
                    } = this.$state, {
                        duration: s
                    } = this.a.$state, {
                        pointerRate: i
                    } = this.ia, n = t();
                    e() && n && Number.isFinite(s()) && Number.isFinite(i()) && (n.currentTime = i() * s())
                }
            }((t, e, s, i) => {
                for (var n, r = i > 1 ? void 0 : i ? _e(e, s) : e, a = t.length - 1; a >= 0; a--)(n = t[a]) && (r = (i ? n(e, s, r) : n(r)) || r);
                i && r && Te(e, s, r)
            })([i.a2], ke.prototype, "video", 1);
            var xe = Object.defineProperty,
                Se = Object.getOwnPropertyDescriptor;
            class Ee extends i.C {
                static# t = this.props = {
                    type: "pointer",
                    format: null,
                    showHours: !1,
                    showMs: !1,
                    padHours: null,
                    padMinutes: null,
                    decimalPlaces: 2
                };
                onSetup() {
                    this.ia = (0, i.L)(ge.state), this.Qc = (0, i.u)(fe), this.sl = (0, i.o)(this.getValueText.bind(this))
                }
                getValueText() {
                    const {
                        type: t,
                        format: e,
                        decimalPlaces: s,
                        padHours: i,
                        padMinutes: n,
                        showHours: r,
                        showMs: a
                    } = this.$props, {
                        value: o,
                        pointerValue: l,
                        min: c,
                        max: h
                    } = this.ia, u = e() ? ? this.Qc.default, d = "current" === t() ? o() : l();
                    if ("percent" === u) {
                        const t = d / (h() - c()) * 100;
                        return (this.Qc.percent ? ? y.r)(t, s()) + "%"
                    }
                    return "time" === u ? (this.Qc.time ? ? Vt)(d, {
                        padHrs: i(),
                        padMins: n(),
                        showHrs: r(),
                        showMs: a()
                    }) : (this.Qc.value ? .(d) ? ? d.toFixed(2)) + ""
                }
            }((t, e, s, i) => {
                for (var n, r = i > 1 ? void 0 : i ? Se(e, s) : e, a = t.length - 1; a >= 0; a--)(n = t[a]) && (r = (i ? n(e, s, r) : n(r)) || r);
                i && r && xe(e, s, r)
            })([i.a8], Ee.prototype, "getValueText", 1);
            class $e extends i.C {
                constructor() {
                    super(...arguments), this.vh = (0, i.J)((() => {
                        const {
                            Ed: t,
                            bb: e
                        } = this.ia;
                        if (t()) return;
                        const s = this.el,
                            {
                                offset: i,
                                noClamp: n
                            } = this.$props;
                        s && function(t, e) {
                            let {
                                clamp: s,
                                offset: i,
                                orientation: n
                            } = e;
                            const r = getComputedStyle(t),
                                a = parseFloat(r.width),
                                o = parseFloat(r.height),
                                l = {
                                    top: null,
                                    right: null,
                                    bottom: null,
                                    left: null
                                };
                            if (l["horizontal" === n ? "bottom" : "left"] = `calc(100% + var(--media-slider-preview-offset, ${i}px))`, "horizontal" === n) {
                                const t = a / 2;
                                if (s) {
                                    const e = `max(0px, calc(var(--slider-pointer) - ${t}px))`,
                                        s = `calc(100% - ${a}px)`;
                                    l.left = `min(${e}, ${s})`
                                } else l.left = `calc(var(--slider-pointer) - ${t}px)`
                            } else {
                                const t = o / 2;
                                if (s) {
                                    const e = `max(${t}px, calc(var(--slider-pointer) - ${t}px))`,
                                        s = `calc(100% - ${o}px)`;
                                    l.bottom = `min(${e}, ${s})`
                                } else l.bottom = `calc(var(--slider-pointer) - ${t}px)`
                            }
                            Object.assign(t.style, l)
                        }(s, {
                            clamp: !n(),
                            offset: i(),
                            orientation: e()
                        })
                    }))
                }
                static# t = this.props = {
                    offset: 0,
                    noClamp: !1
                };
                onSetup() {
                    this.ia = (0, i.u)(he);
                    const {
                        active: t
                    } = (0, i.L)(ge.state);
                    this.setAttributes({
                        "data-visible": t
                    })
                }
                onAttach(t) {
                    Object.assign(t.style, {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "max-content"
                    })
                }
                onConnect(t) {
                    const {
                        nh: e
                    } = this.ia;
                    e.set(t), (0, i.q)((() => e.set(null))), (0, i.g)(this.vh.bind(this));
                    const s = new ResizeObserver(this.vh.bind(this));
                    s.observe(t), (0, i.q)((() => s.disconnect()))
                }
            }
            class Ce extends i.C {
                constructor() {
                    super(...arguments), this.wh = M(this.Na.bind(this), 25)
                }
                static# t = this.props = { ...me.props,
                    keyStep: 5,
                    shiftKeyMultiplier: 2
                };
                static# e = this.state = oe;
                onSetup() {
                    this.a = (0, m.u)();
                    const {
                        audioGain: t
                    } = this.a.$state;
                    (0, i._)(fe, {
                        default: "percent",
                        value: e => (e * (t() ? ? 1)).toFixed(2),
                        percent: e => Math.round(e * (t() ? ? 1))
                    }), new me({
                        qa: this.$props.step,
                        eb: this.$props.keyStep,
                        Da: Math.round,
                        v: this.v.bind(this),
                        hf: this.hf.bind(this),
                        O: this.O.bind(this),
                        P: this.P.bind(this),
                        S: this.S.bind(this),
                        l: this.l.bind(this)
                    }).attach(this), (0, i.g)(this.Fc.bind(this))
                }
                onAttach(t) {
                    t.setAttribute("data-media-volume-slider", ""), (0, a.s)(t, "aria-label", "Volume");
                    const {
                        canSetVolume: e
                    } = this.a.$state;
                    this.setAttributes({
                        "data-supported": e,
                        "aria-hidden": Kt((() => !e()))
                    })
                }
                O() {
                    const {
                        value: t
                    } = this.$state, {
                        audioGain: e
                    } = this.a.$state;
                    return Math.round(t() * (e() ? ? 1))
                }
                P() {
                    const {
                        value: t,
                        max: e
                    } = this.$state, {
                        audioGain: s
                    } = this.a.$state;
                    return (0, y.r)(t() / e() * (s() ? ? 1) * 100, 2) + "%"
                }
                hf() {
                    const {
                        audioGain: t
                    } = this.a.$state;
                    return this.$state.max() * (t() ? ? 1)
                }
                v() {
                    const {
                        disabled: t
                    } = this.$props, {
                        canSetVolume: e
                    } = this.a.$state;
                    return t() || !e()
                }
                Fc() {
                    const {
                        muted: t,
                        volume: e
                    } = this.a.$state, s = t() ? 0 : 100 * e();
                    this.$state.value.set(s), this.dispatch("value-change", {
                        detail: s
                    })
                }
                Na(t) {
                    if (!t.trigger) return;
                    const e = (0, y.r)(t.detail / 100, 3);
                    this.a.remote.changeVolume(e, t)
                }
                l(t) {
                    this.wh(t)
                }
                S(t) {
                    this.wh(t)
                }
            }
            class Me extends i.C {
                static# t = this.props = { ...me.props,
                    step: 25,
                    keyStep: 25,
                    shiftKeyMultiplier: 2,
                    min: 0,
                    max: 300
                };
                static# e = this.state = oe;
                onSetup() {
                    this.a = (0, m.u)(), (0, i._)(fe, {
                        default: "percent",
                        percent: (t, e) => (0, y.r)(this.$state.value(), e) + "%"
                    }), new me({
                        qa: this.$props.step,
                        eb: this.$props.keyStep,
                        Da: Math.round,
                        v: this.v.bind(this),
                        O: this.O.bind(this),
                        P: this.P.bind(this),
                        S: this.S.bind(this),
                        l: this.l.bind(this)
                    }).attach(this), (0, i.g)(this.Oc.bind(this)), (0, i.g)(this.tl.bind(this))
                }
                onAttach(t) {
                    t.setAttribute("data-media-audio-gain-slider", ""), (0, a.s)(t, "aria-label", "Audio Boost");
                    const {
                        canSetAudioGain: e
                    } = this.a.$state;
                    this.setAttributes({
                        "data-supported": e,
                        "aria-hidden": Kt((() => !e()))
                    })
                }
                O() {
                    const {
                        value: t
                    } = this.$state;
                    return Math.round(t())
                }
                P() {
                    const {
                        value: t
                    } = this.$state;
                    return t() + "%"
                }
                Oc() {
                    const {
                        min: t,
                        max: e
                    } = this.$props;
                    this.$state.min.set(t()), this.$state.max.set(e())
                }
                tl() {
                    const {
                        audioGain: t
                    } = this.a.$state, e = 100 * ((t() ? ? 1) - 1);
                    this.$state.value.set(e), this.dispatch("value-change", {
                        detail: e
                    })
                }
                v() {
                    const {
                        disabled: t
                    } = this.$props, {
                        canSetAudioGain: e
                    } = this.a.$state;
                    return t() || !e()
                }
                xh(t) {
                    if (!t.trigger) return;
                    const e = (0, y.r)(1 + t.detail / 100, 2);
                    this.a.remote.changeAudioGain(e, t)
                }
                l(t) {
                    this.xh(t)
                }
                S(t) {
                    this.xh(t)
                }
            }
            class Pe extends i.C {
                constructor() {
                    super(...arguments), this.yh = M(this.ul.bind(this), 25)
                }
                static# t = this.props = { ...me.props,
                    step: .25,
                    keyStep: .25,
                    shiftKeyMultiplier: 2,
                    min: 0,
                    max: 2
                };
                static# e = this.state = oe;
                onSetup() {
                    this.a = (0, m.u)(), new me({
                        qa: this.$props.step,
                        eb: this.$props.keyStep,
                        Da: this.Da,
                        v: this.v.bind(this),
                        O: this.O.bind(this),
                        P: this.P.bind(this),
                        S: this.S.bind(this),
                        l: this.l.bind(this)
                    }).attach(this), (0, i.g)(this.Oc.bind(this)), (0, i.g)(this.Qe.bind(this))
                }
                onAttach(t) {
                    t.setAttribute("data-media-speed-slider", ""), (0, a.s)(t, "aria-label", "Speed");
                    const {
                        canSetPlaybackRate: e
                    } = this.a.$state;
                    this.setAttributes({
                        "data-supported": e,
                        "aria-hidden": Kt((() => !e()))
                    })
                }
                O() {
                    const {
                        value: t
                    } = this.$state;
                    return t()
                }
                P() {
                    const {
                        value: t
                    } = this.$state;
                    return t() + "x"
                }
                Oc() {
                    const {
                        min: t,
                        max: e
                    } = this.$props;
                    this.$state.min.set(t()), this.$state.max.set(e())
                }
                Qe() {
                    const {
                        playbackRate: t
                    } = this.a.$state, e = t();
                    this.$state.value.set(e), this.dispatch("value-change", {
                        detail: e
                    })
                }
                Da(t) {
                    return (0, y.r)(t, 2)
                }
                v() {
                    const {
                        disabled: t
                    } = this.$props, {
                        canSetPlaybackRate: e
                    } = this.a.$state;
                    return t() || !e()
                }
                ul(t) {
                    if (!t.trigger) return;
                    const e = t.detail;
                    this.a.remote.changePlaybackRate(e, t)
                }
                l(t) {
                    this.yh(t)
                }
                S(t) {
                    this.yh(t)
                }
            }
            class Ae extends i.C {
                constructor() {
                    super(...arguments), this.Rc = (0, i.o)((() => {
                        const {
                            qualities: t
                        } = this.a.$state;
                        return j(t())
                    })), this.zh = M(this.Za.bind(this), 25)
                }
                static# t = this.props = { ...me.props,
                    step: 1,
                    keyStep: 1,
                    shiftKeyMultiplier: 1
                };
                static# e = this.state = oe;
                onSetup() {
                    this.a = (0, m.u)(), new me({
                        qa: this.$props.step,
                        eb: this.$props.keyStep,
                        Da: Math.round,
                        v: this.v.bind(this),
                        O: this.O.bind(this),
                        P: this.P.bind(this),
                        S: this.S.bind(this),
                        l: this.l.bind(this)
                    }).attach(this), (0, i.g)(this.vl.bind(this)), (0, i.g)(this.wl.bind(this))
                }
                onAttach(t) {
                    t.setAttribute("data-media-quality-slider", ""), (0, a.s)(t, "aria-label", "Video Quality");
                    const {
                        qualities: e,
                        canSetQuality: s
                    } = this.a.$state, n = (0, i.o)((() => s() && e().length > 0));
                    this.setAttributes({
                        "data-supported": n,
                        "aria-hidden": Kt((() => !n()))
                    })
                }
                O() {
                    const {
                        value: t
                    } = this.$state;
                    return t()
                }
                P() {
                    const {
                        quality: t
                    } = this.a.$state;
                    if (!t()) return "";
                    const {
                        height: e,
                        bitrate: s
                    } = t(), i = s && s > 0 ? `${(s/1e6).toFixed(2)} Mbps` : null;
                    return e ? `${e}p${i?` (${i})`:""}` : "Auto"
                }
                vl() {
                    const t = this.Rc();
                    this.$state.max.set(Math.max(0, t.length - 1))
                }
                wl() {
                    let {
                        quality: t
                    } = this.a.$state, e = this.Rc(), s = Math.max(0, e.indexOf(t()));
                    this.$state.value.set(s), this.dispatch("value-change", {
                        detail: s
                    })
                }
                v() {
                    const {
                        disabled: t
                    } = this.$props, {
                        canSetQuality: e,
                        qualities: s
                    } = this.a.$state;
                    return t() || s().length <= 1 || !e()
                }
                Za(t) {
                    if (!t.trigger) return;
                    const {
                        qualities: e
                    } = this.a, s = (0, i.p)(this.Rc)[t.detail];
                    this.a.remote.changeQuality(e.indexOf(s), t)
                }
                l(t) {
                    this.zh(t)
                }
                S(t) {
                    this.zh(t)
                }
            }
            class Le extends i.C {
                constructor() {
                    super(), this.Ah = (0, i.f)(null), this.mf = !1;
                    const {
                        noSwipeGesture: t
                    } = this.$props;
                    new me({
                        kh: () => !t(),
                        Y: this.Y.bind(this),
                        qa: this.qa.bind(this),
                        eb: this.eb.bind(this),
                        Da: this.Da,
                        v: this.v.bind(this),
                        O: this.O.bind(this),
                        P: this.P.bind(this),
                        ef: this.ef.bind(this),
                        S: this.S.bind(this),
                        Dd: this.Dd.bind(this),
                        l: this.l.bind(this)
                    })
                }
                static# t = this.props = { ...me.props,
                    step: .1,
                    keyStep: 5,
                    shiftKeyMultiplier: 2,
                    pauseWhileDragging: !1,
                    noSwipeGesture: !1,
                    seekingRequestThrottle: 100
                };
                static# e = this.state = oe;
                onSetup() {
                    this.a = (0, m.u)(), (0, i._)(fe, {
                        default: "time",
                        value: this.xl.bind(this),
                        time: this.yl.bind(this)
                    }), this.setAttributes({
                        "data-chapters": this.zl.bind(this)
                    }), this.setStyles({
                        "--slider-progress": this.Al.bind(this)
                    }), (0, i.g)(this.Qb.bind(this)), (0, i.g)(this.Bl.bind(this))
                }
                onAttach(t) {
                    t.setAttribute("data-media-time-slider", ""), (0, a.s)(t, "aria-label", "Seek")
                }
                onConnect(t) {
                    (0, i.g)(this.Cl.bind(this)), (0, o.w)(this.a.textTracks, "chapters", this.Ah.set)
                }
                Al() {
                    const {
                        bufferedEnd: t,
                        duration: e
                    } = this.a.$state;
                    return (0, y.r)(100 * Math.min(t() / Math.max(e(), 1), 1), 3) + "%"
                }
                zl() {
                    const {
                        duration: t
                    } = this.a.$state;
                    return this.Ah() ? .cues.length && Number.isFinite(t()) && t() > 0
                }
                Bl() {
                    this.lf = M(this.Ja.bind(this), this.$props.seekingRequestThrottle())
                }
                Qb() {
                    if (this.$state.hidden()) return;
                    const {
                        value: t,
                        dragging: e
                    } = this.$state, s = this.Y();
                    (0, i.p)(e) || (t.set(s), this.dispatch("value-change", {
                        detail: s
                    }))
                }
                Cl() {
                    const t = this.a.player.el,
                        {
                            nh: e
                        } = (0, i.u)(he);
                    t && e() && (0, i.s)(t, "data-preview", this.$state.active())
                }
                Ja(t, e) {
                    this.a.remote.seeking(t, e)
                }
                Dl(t, e, s) {
                    this.lf.cancel();
                    const {
                        live: i
                    } = this.a.$state;
                    i() && e >= 99 ? this.a.remote.seekToLiveEdge(s) : this.a.remote.seek(t, s)
                }
                ef(t) {
                    const {
                        pauseWhileDragging: e
                    } = this.$props;
                    if (e()) {
                        const {
                            paused: e
                        } = this.a.$state;
                        this.mf = !e(), this.a.remote.pause(t)
                    }
                }
                S(t) {
                    this.lf(this.Wb(t.detail), t)
                }
                Dd(t) {
                    const {
                        seeking: e
                    } = this.a.$state;
                    (0, i.p)(e) || this.Ja(this.Wb(t.detail), t);
                    const s = t.detail;
                    this.Dl(this.Wb(s), s, t);
                    const {
                        pauseWhileDragging: n
                    } = this.$props;
                    n() && this.mf && (this.a.remote.play(t), this.mf = !1)
                }
                l(t) {
                    const {
                        dragging: e
                    } = this.$state;
                    !e() && t.trigger && this.Dd(t)
                }
                Y() {
                    const {
                        currentTime: t
                    } = this.a.$state;
                    return this.El(t())
                }
                qa() {
                    const t = this.$props.step() / this.a.$state.duration() * 100;
                    return Number.isFinite(t) ? t : 1
                }
                eb() {
                    const t = this.$props.keyStep() / this.a.$state.duration() * 100;
                    return Number.isFinite(t) ? t : 1
                }
                Da(t) {
                    return (0, y.r)(t, 3)
                }
                v() {
                    const {
                        disabled: t
                    } = this.$props, {
                        canSeek: e
                    } = this.a.$state;
                    return t() || !e()
                }
                O() {
                    const {
                        value: t
                    } = this.$state;
                    return Math.round(t())
                }
                P() {
                    const t = this.Wb(this.$state.value()),
                        {
                            duration: e
                        } = this.a.$state;
                    return Number.isFinite(t) ? `${jt(t)} out of ${jt(e())}` : "live"
                }
                Wb(t) {
                    const {
                        duration: e
                    } = this.a.$state;
                    return (0, y.r)(t / 100 * e(), 5)
                }
                El(t) {
                    const {
                        liveEdge: e,
                        duration: s
                    } = this.a.$state, i = Math.max(0, Math.min(1, e() ? 1 : Math.min(t, s()) / s()));
                    return Number.isNaN(i) ? 0 : Number.isFinite(i) ? 100 * i : 100
                }
                xl(t) {
                    const e = this.Wb(t),
                        {
                            live: s,
                            duration: i
                        } = this.a.$state;
                    return Number.isFinite(e) ? (s() ? e - i() : e).toFixed(0) : "LIVE"
                }
                yl(t, e) {
                    const s = this.Wb(t),
                        {
                            live: i,
                            duration: n
                        } = this.a.$state,
                        r = i() ? s - n() : s;
                    return Number.isFinite(s) ? `${r<0?"-":""}${Vt(Math.abs(r),e)}` : "LIVE"
                }
            }
            var Oe = Object.defineProperty,
                Ie = Object.getOwnPropertyDescriptor,
                qe = (t, e, s, i) => {
                    for (var n, r = i > 1 ? void 0 : i ? Ie(e, s) : e, a = t.length - 1; a >= 0; a--)(n = t[a]) && (r = (i ? n(e, s, r) : n(r)) || r);
                    return i && r && Oe(e, s, r), r
                };
            class De extends i.C {
                constructor() {
                    super(...arguments), this.yb = null, this.ja = [], this.Gd = (0, i.f)(null), this.ka = (0, i.f)([]), this.Xb = (0, i.f)(-1), this.Hd = (0, i.f)(-1), this.Sc = 0, this.Ml = (0, i.J)((t => {
                        let e, s = this.ka(),
                            {
                                clipStartTime: i
                            } = this.a.$state,
                            n = i(),
                            r = this.qf(s);
                        for (let i = this.Sc; i < this.ja.length; i++)
                            if (e = this.pf(s[i], t, n, r), this.ja[i] ? .style.setProperty("--chapter-progress", e + "%"), e < 100) {
                                this.Sc = i;
                                break
                            }
                    })), this.Nl = (0, i.o)(this.Ol.bind(this)), this.Id = O((() => {
                        const t = (0, i.p)(this.Gd);
                        this.scope && t && t.cues.length && (this.ka.set(this.Pl(t.cues)), this.Xb.set(0), this.Sc = 0)
                    }), 150, !0)
                }
                static# t = this.props = {
                    disabled: !1
                };
                get cues() {
                    return this.ka()
                }
                get activeCue() {
                    return this.ka()[this.Xb()] || null
                }
                get activePointerCue() {
                    return this.ka()[this.Hd()] || null
                }
                onSetup() {
                    this.a = (0, m.u)(), this.Fd = (0, i.L)(Le.state)
                }
                onAttach(t) {
                    (0, o.w)(this.a.textTracks, "chapters", this.Bh.bind(this)), (0, i.g)(this.Fl.bind(this))
                }
                onConnect() {
                    (0, i.q)((() => this.z.bind(this)))
                }
                onDestroy() {
                    this.Bh(null)
                }
                setRefs(t) {
                    if (this.ja = t, this.nf ? .dispose(), 1 === this.ja.length) {
                        const t = this.ja[0];
                        t.style.width = "100%", t.style.setProperty("--chapter-fill", "var(--slider-fill)"), t.style.setProperty("--chapter-progress", "var(--slider-progress)")
                    } else this.ja.length > 0 && (0, i.e)((() => this.Gl()), this.nf = (0, i.r)())
                }
                Bh(t) {
                    (0, i.p)(this.Gd) !== t && (this.z(), this.Gd.set(t))
                }
                z() {
                    this.ja = [], this.ka.set([]), this.Xb.set(-1), this.Hd.set(-1), this.Sc = 0, this.nf ? .dispose()
                }
                Gl() {
                    this.ja.length && (0, i.g)(this.Hl.bind(this))
                }
                Hl() {
                    const {
                        hidden: t
                    } = this.Fd;
                    t() || ((0, i.g)(this.Il.bind(this)), (0, i.g)(this.Jl.bind(this)), (0, i.g)(this.Kl.bind(this)), (0, i.g)(this.Ll.bind(this)))
                }
                Il() {
                    const t = this.ka();
                    if (!t.length) return;
                    let e, {
                            clipStartTime: s,
                            clipEndTime: i
                        } = this.a.$state,
                        n = s(),
                        r = (i() || t[t.length - 1].endTime) - n,
                        a = 100;
                    for (let s = 0; s < t.length; s++)
                        if (e = t[s], this.ja[s]) {
                            const i = s === t.length - 1 ? a : (0, y.r)((e.endTime - Math.max(n, e.startTime)) / r * 100, 3);
                            this.ja[s].style.width = i + "%", a -= i
                        }
                }
                Jl() {
                    let {
                        liveEdge: t,
                        clipStartTime: e,
                        duration: s
                    } = this.a.$state, {
                        fillPercent: n,
                        value: r
                    } = this.Fd, a = this.ka(), o = t(), l = (0, i.p)(this.Xb), c = a[l], h = o ? this.ka.length - 1 : this.Ch(c && c.startTime / s() * 100 <= (0, i.p)(r) ? l : 0, n());
                    o || !c ? this.of(0, a.length, 100) : h > l ? this.of(l, h, 100) : h < l && this.of(h + 1, l + 1, 0);
                    const u = o ? 100 : this.pf(a[h], n(), e(), this.qf(a));
                    this.Dh(this.ja[h], u), this.Xb.set(h)
                }
                Kl() {
                    let {
                        pointing: t,
                        pointerPercent: e
                    } = this.Fd;
                    if (!t()) return void this.Hd.set(-1);
                    const s = this.Ch(0, e());
                    this.Hd.set(s)
                } of (t, e, s) {
                    for (let i = t; i < e; i++) this.Dh(this.ja[i], s)
                }
                Dh(t, e) {
                    t && (t.style.setProperty("--chapter-fill", e + "%"), (0, i.s)(t, "data-active", e > 0 && e < 100), (0, i.s)(t, "data-ended", 100 === e))
                }
                Ch(t, e) {
                    let s = 0,
                        i = this.ka();
                    if (0 === e) return 0;
                    if (100 === e) return i.length - 1;
                    let {
                        clipStartTime: n
                    } = this.a.$state, r = n(), a = this.qf(i);
                    for (let n = t; n < i.length; n++)
                        if (s = this.pf(i[n], e, r, a), s >= 0 && s < 100) return n;
                    return 0
                }
                Ll() {
                    this.Ml(this.Nl())
                }
                Ol() {
                    const {
                        bufferedEnd: t,
                        duration: e
                    } = this.a.$state;
                    return 100 * (0, y.r)(Math.min(t() / Math.max(e(), 1), 1), 3)
                }
                qf(t) {
                    const {
                        clipEndTime: e
                    } = this.a.$state, s = e();
                    return s > 0 ? s : t[t.length - 1] ? .endTime || 0
                }
                pf(t, e, s, i) {
                    if (0 === this.ka().length) return 0;
                    const n = i - s,
                        r = Math.max(0, t.startTime - s),
                        a = Math.min(i, t.endTime) - s,
                        o = r / n,
                        l = 100 * o,
                        c = 100 * Math.min(1, o + (a - r) / n);
                    return Math.max(0, (0, y.r)(e >= c ? 100 : (e - l) / (c - l) * 100, 3))
                }
                Pl(t) {
                    let e = [],
                        {
                            clipStartTime: s,
                            clipEndTime: i,
                            duration: n
                        } = this.a.$state,
                        r = s(),
                        a = i() || 1 / 0;
                    const o = (t = t.filter((t => t.startTime <= a && t.endTime >= r)))[0];
                    o && o.startTime > r && e.push(new window.VTTCue(r, o.startTime, ""));
                    for (let s = 0; s < t.length - 1; s++) {
                        const i = t[s],
                            n = t[s + 1];
                        if (e.push(i), n) {
                            const t = n.startTime - i.endTime;
                            t > 0 && e.push(new window.VTTCue(i.endTime, i.endTime + t, ""))
                        }
                    }
                    const l = t[t.length - 1];
                    if (l) {
                        e.push(l);
                        const t = n();
                        t >= 0 && t - l.endTime > 1 && e.push(new window.VTTCue(l.endTime, n(), ""))
                    }
                    return e
                }
                Fl() {
                    const {
                        source: t
                    } = this.a.$state;
                    t(), this.pc()
                }
                pc() {
                    if (!this.scope) return;
                    const {
                        disabled: t
                    } = this.$props;
                    if (t()) return this.ka.set([]), this.Xb.set(0), void(this.Sc = 0);
                    const e = this.Gd();
                    if (e) {
                        const t = this.Id.bind(this);
                        t(), (0, i.q)((0, i.l)(e, "add-cue", t)), (0, i.q)((0, i.l)(e, "remove-cue", t)), (0, i.g)(this.Ql.bind(this))
                    }
                    return this.yb = this.Rl(), this.yb && (0, i.g)(this.Sl.bind(this)), () => {
                        this.yb && (this.yb.textContent = "", this.yb = null)
                    }
                }
                Ql() {
                    this.a.$state.duration(), this.Id()
                }
                Sl() {
                    const t = this.activePointerCue || this.activeCue;
                    this.yb && (this.yb.textContent = t ? .text || "")
                }
                Tl() {
                    let t = this.el;
                    for (; t && "slider" !== t.getAttribute("role");) t = t.parentElement;
                    return t
                }
                Rl() {
                    const t = this.Tl();
                    return t ? t.querySelector('[data-part="chapter-title"]') : null
                }
            }
            qe([i.a2], De.prototype, "cues", 1), qe([i.a2], De.prototype, "activeCue", 1), qe([i.a2], De.prototype, "activePointerCue", 1), qe([i.a8], De.prototype, "setRefs", 1);
            const ze = (0, i.Z)();

            function Ve(t) {
                ! function(t, e) {
                    const s = (0, i.ac)(t, e);
                    for (const {
                            el: t,
                            top: i,
                            left: n
                        } of s) t.scroll({
                        top: i,
                        left: n,
                        behavior: e.behavior
                    })
                }(t, {
                    scrollMode: "if-needed",
                    block: "center",
                    inline: "center",
                    ...arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
                })
            }
            const je = ["a[href]", "[tabindex]", "input", "select", "button"].map((t => `${t}:not([aria-hidden='true'])`)).join(","),
                Fe = new Set(["Escape", "Tab", "ArrowUp", "ArrowDown", "Home", "PageUp", "End", "PageDown", "Enter", " "]);
            class Re {
                constructor(t) {
                    this.j = t, this.Tc = -1, this.Sa = null, this.ra = []
                }
                get A() {
                    return this.ra
                }
                Ul(t) {
                    (0, i.l)(t, "focus", this.Ec.bind(this)), this.Sa = t, (0, i.q)((() => {
                        this.Sa = null
                    }))
                }
                yd() {
                    this.Sa && (this.Ha(), (0, i.l)(this.Sa, "keyup", this.hc.bind(this)), (0, i.l)(this.Sa, "keydown", this.ic.bind(this)), (0, i.q)((() => {
                        this.Tc = -1, this.ra = []
                    })))
                }
                Ha() {
                    this.Tc = 0, this.ra = this.Vl()
                }
                Eh() {
                    let t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.Fh();
                    const e = this.ra[t];
                    e && requestAnimationFrame((() => {
                        requestAnimationFrame((() => {
                            Ve(e, {
                                behavior: "smooth",
                                boundary: t => !t.hasAttribute("data-root")
                            })
                        }))
                    }))
                }
                Gh() {
                    let t = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
                    const e = this.Fh();
                    this.Yb(e >= 0 ? e : 0, t)
                }
                Yb(t) {
                    let e = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
                    this.Tc = t, this.ra[t] ? (this.ra[t].focus({
                        preventScroll: !0
                    }), e && this.Eh(t)) : this.Sa ? .focus({
                        preventScroll: !0
                    })
                }
                Fh() {
                    return this.ra.findIndex((t => document.activeElement === t || "menuitemradio" === t.getAttribute("role") && "true" === t.getAttribute("aria-checked")))
                }
                Ec() {
                    this.Tc >= 0 || (this.Ha(), this.Gh())
                }
                Hh(t) {
                    const e = t.target;
                    if ((0, i.ad)(t) && e instanceof Element) {
                        const t = e.getAttribute("role");
                        return !/a|input|select|button/.test(e.localName) && !t
                    }
                    return Fe.has(t.key)
                }
                hc(t) {
                    this.Hh(t) && (t.stopPropagation(), t.preventDefault())
                }
                ic(t) {
                    if (this.Hh(t)) switch (t.stopPropagation(), t.preventDefault(), t.key) {
                        case "Escape":
                            this.j.Wl(t);
                            break;
                        case "Tab":
                            this.Yb(this.rf(t.shiftKey ? -1 : 1));
                            break;
                        case "ArrowUp":
                            this.Yb(this.rf(-1));
                            break;
                        case "ArrowDown":
                            this.Yb(this.rf(1));
                            break;
                        case "Home":
                        case "PageUp":
                            this.Yb(0);
                            break;
                        case "End":
                        case "PageDown":
                            this.Yb(this.ra.length - 1)
                    }
                }
                rf(t) {
                    let e = this.Tc;
                    do {
                        e = (e + t + this.ra.length) % this.ra.length
                    } while (null === this.ra[e] ? .offsetParent);
                    return e
                }
                Vl() {
                    if (!this.Sa) return [];
                    const t = this.Sa.querySelectorAll(je),
                        e = [],
                        s = t => "menu" === t.getAttribute("role");
                    for (const i of t)(0, a.i)(i) && null !== i.offsetParent && (0, a.q)(this.Sa, i, s) && e.push(i);
                    return e
                }
            }
            var Be = Object.defineProperty,
                Ne = Object.getOwnPropertyDescriptor,
                He = (t, e, s, i) => {
                    for (var n, r = i > 1 ? void 0 : i ? Ne(e, s) : e, a = t.length - 1; a >= 0; a--)(n = t[a]) && (r = (i ? n(e, s, r) : n(r)) || r);
                    return i && r && Be(e, s, r), r
                };
            let Ge = 0;
            class We extends i.C {
                constructor() {
                    super(), this.T = (0, i.f)(!1), this.Ed = (0, i.f)(!1), this.M = (0, i.f)(null), this.q = (0, i.f)(null), this.Vc = new Set, this.Jd = null, this.Ld = !1, this.Ih = (0, i.f)(!1), this.Md = new Set, this.zf = !1, this.im = this.jm.bind(this), this.Cf = !1, this.gm = this.km.bind(this), this.hm = this.lm.bind(this), this.pa = (0, i.J)((() => {
                        const t = (0, i.p)(this.q);
                        if (!t) return;
                        let e = 0,
                            s = getComputedStyle(t),
                            n = [...t.children];
                        for (const t of ["paddingTop", "paddingBottom", "borderTopWidth", "borderBottomWidth"]) e += parseFloat(s[t]) || 0;
                        for (const t of n)
                            if ((0, a.i)(t) && "contents" === t.style.display) n.push(...t.children);
                            else if (3 === t.nodeType) e += parseFloat(getComputedStyle(t).fontSize);
                        else if ((0, a.i)(t)) {
                            if (!(0, a.v)(t)) continue;
                            const s = getComputedStyle(t);
                            e += t.offsetHeight + (parseFloat(s.marginTop) || 0) + (parseFloat(s.marginBottom) || 0)
                        }(0, i.a)(t, "--menu-height", e + "px")
                    })), this.Bf = !1;
                    const {
                        showDelay: t
                    } = this.$props;
                    this.Kd = new Bt({
                        M: this.M,
                        q: this.q,
                        ih: t,
                        yd: (t, e, s) => {
                            (0, a.o)(t, (t => {
                                this.T() ? s(t) : e(t)
                            }));
                            const i = this.Xl();
                            i && (0, a.o)(i, (t => {
                                t.stopPropagation(), s(t)
                            }))
                        },
                        E: this.Yl.bind(this)
                    })
                }
                static# t = this.props = {
                    showDelay: 0
                };
                get triggerElement() {
                    return this.M()
                }
                get contentElement() {
                    return this.q()
                }
                get isSubmenu() {
                    return !!this.Uc
                }
                onSetup() {
                    this.a = (0, m.u)();
                    const t = ++Ge;
                    this.sf = `media-menu-${t}`, this.tf = `media-menu-button-${t}`, this.Zb = new Re({
                        Wl: this.close.bind(this)
                    }), (0, i.ab)(ze) && (this.Uc = (0, i.u)(ze)), this.Zl(), this.setAttributes({
                        "data-open": this.T,
                        "data-root": !this.isSubmenu,
                        "data-submenu": this.isSubmenu,
                        "data-disabled": this.v.bind(this)
                    }), (0, i._)(ze, {
                        _l: this.M,
                        q: this.q,
                        T: this.T,
                        _b: (0, i.f)(""),
                        Um: !!this.Uc,
                        gb: this.gb.bind(this),
                        uf: this.uf.bind(this),
                        vf: this.vf.bind(this),
                        wf: this.wf.bind(this),
                        xf: this.xf.bind(this),
                        yf: this.yf.bind(this),
                        $l: t => {
                            this.Md.add(t), (0, i.q)((() => {
                                this.Md.delete(t)
                            }))
                        }
                    })
                }
                onAttach(t) {
                    t.style.setProperty("display", "contents")
                }
                onConnect(t) {
                    (0, i.g)(this.am.bind(this)), this.isSubmenu && this.Uc ? .yf(this)
                }
                onDestroy() {
                    this.M.set(null), this.q.set(null), this.Jd = null, this.Md.clear()
                }
                Zl() {
                    let t = -1,
                        e = (0, i.ab)(ue) ? (0, i.u)(ue) : null;
                    (0, i._)(ue, {
                        onDragStart: () => {
                            e ? .onDragStart ? .(), window.clearTimeout(t), t = -1, this.Ld = !0
                        },
                        onDragEnd: () => {
                            e ? .onDragEnd ? .(), t = window.setTimeout((() => {
                                this.Ld = !1, t = -1
                            }), 300)
                        }
                    })
                }
                am() {
                    const t = this.bm();
                    this.isSubmenu || this.pa(), this.Jh(t), t && ((0, i.g)((() => {
                        const {
                            height: t
                        } = this.a.$state, e = this.q();
                        e && (0, i.a)(e, "--player-height", t() + "px")
                    })), this.Zb.yd(), this.listen("pointerup", this.cm.bind(this)), (0, i.l)(window, "pointerup", this.dm.bind(this)))
                }
                uf(t) {
                    const e = t.el,
                        s = this.isSubmenu,
                        n = Kt(this.v.bind(this));
                    (0, a.s)(e, "tabindex", s ? "-1" : "0"), (0, a.s)(e, "role", s ? "menuitem" : "button"), (0, i.s)(e, "id", this.tf), (0, i.s)(e, "aria-haspopup", "menu"), (0, i.s)(e, "aria-expanded", "false"), (0, i.s)(e, "data-root", !this.isSubmenu), (0, i.s)(e, "data-submenu", this.isSubmenu);
                    (0, i.g)((() => {
                        (0, i.s)(e, "data-open", this.T()), (0, i.s)(e, "aria-disabled", n())
                    })), this.M.set(e), (0, i.q)((() => {
                        this.M.set(null)
                    }))
                }
                vf(t) {
                    const e = t.el;
                    e.style.setProperty("display", "none"), (0, i.s)(e, "id", this.sf), (0, a.s)(e, "role", "menu"), (0, a.s)(e, "tabindex", "-1"), (0, i.s)(e, "data-root", !this.isSubmenu), (0, i.s)(e, "data-submenu", this.isSubmenu), this.q.set(e), (0, i.q)((() => this.q.set(null)));
                    (0, i.g)((() => (0, i.s)(e, "data-open", this.T()))), this.Zb.Ul(e), this.Jh(!1);
                    const s = this.em.bind(this);
                    this.isSubmenu ? this.Uc ? .$l(s) : (t.listen("transitionstart", s), t.listen("transitionend", s), t.listen("animationend", this.pa), t.listen("vds-menu-resize", this.pa))
                }
                wf(t) {
                    this.Jd = t
                }
                Jh(t) {
                    const e = (0, i.p)(this.q);
                    e && (0, i.s)(e, "aria-hidden", (0, i.a9)(!t))
                }
                xf(t) {
                    this.Ih.set(t)
                }
                Yl(t, e) {
                    if (this.zf = (0, i.R)(e), e ? .stopPropagation(), this.T() === t) return;
                    if (this.v()) return void(t && this.Kd.hide(e));
                    this.el ? .dispatchEvent(new Event("vds-menu-resize", {
                        bubbles: !0,
                        composed: !0
                    }));
                    const s = this.M(),
                        n = this.q();
                    if (s && ((0, i.s)(s, "aria-controls", t && this.sf), (0, i.s)(s, "aria-expanded", (0, i.a9)(t))), n && (0, i.s)(n, "aria-labelledby", t && this.tf), this.T.set(t), this.fm(e), (0, i.Y)(), this.zf) {
                        t ? n ? .focus() : s ? .focus();
                        for (const t of [this.el, n]) t && t.setAttribute("data-keyboard", "")
                    } else
                        for (const t of [this.el, n]) t && t.removeAttribute("data-keyboard");
                    if (this.dispatch(t ? "open" : "close", {
                            trigger: e
                        }), t) this.isSubmenu || this.a.activeMenu === this || (this.a.activeMenu ? .close(e), this.a.activeMenu = this), this.Jd ? .Af ? .(e);
                    else {
                        if (this.isSubmenu)
                            for (const t of this.Vc) t.close(e);
                        else this.a.activeMenu = null;
                        this.Jd ? .Vm ? .(e)
                    }
                    t && requestAnimationFrame(this.Kh.bind(this))
                }
                Kh() {
                    this.Bf || this.Cf || (this.Zb.Ha(), requestAnimationFrame((() => {
                        this.zf ? this.Zb.Gh() : this.Zb.Eh()
                    })))
                }
                bm() {
                    return !this.v() && this.T()
                }
                v() {
                    return this.Ed() || this.Ih()
                }
                gb(t) {
                    this.Ed.set(t)
                }
                cm(t) {
                    const e = this.q();
                    this.Ld || e && (0, a.t)(e, t) || t.stopPropagation()
                }
                dm(t) {
                    const e = this.q();
                    this.Ld || e && (0, a.t)(e, t) || this.close(t)
                }
                Xl() {
                    const t = this.el ? .querySelector('[data-part="close-target"]');
                    return this.el && t && (0, a.q)(this.el, t, (t => "menu" === t.getAttribute("role"))) ? t : null
                }
                fm(t) {
                    this.isSubmenu || (this.T() ? this.a.remote.pauseControls(t) : this.a.remote.resumeControls(t))
                }
                yf(t) {
                    this.Vc.add(t), (0, i.l)(t, "open", this.gm), (0, i.l)(t, "close", this.hm), (0, i.q)(this.im)
                }
                jm(t) {
                    this.Vc.delete(t)
                }
                km(t) {
                    this.Cf = !0;
                    const e = this.q();
                    this.isSubmenu && this.triggerElement ? .setAttribute("aria-hidden", "true");
                    for (const e of this.Vc)
                        if (e !== t.target)
                            for (const t of [e.el, e.triggerElement]) t ? .setAttribute("aria-hidden", "true");
                    if (e) {
                        const s = t.target.el;
                        for (const t of e.children) t.contains(s) ? t.setAttribute("data-open", "") : t !== s && t.setAttribute("data-hidden", "")
                    }
                }
                lm(t) {
                    this.Cf = !1;
                    const e = this.q();
                    this.isSubmenu && this.triggerElement ? .setAttribute("aria-hidden", "false");
                    for (const t of this.Vc)
                        for (const e of [t.el, t.triggerElement]) e ? .setAttribute("aria-hidden", "false");
                    if (e)
                        for (const t of e.children) t.removeAttribute("data-open"), t.removeAttribute("data-hidden")
                }
                em(t) {
                    const e = this.q();
                    e && "height" === t.propertyName && (this.Bf = "transitionstart" === t.type, (0, i.s)(e, "data-transition", this.Bf ? "height" : null), this.T() && this.Kh());
                    for (const e of this.Md) e(t)
                }
                open(t) {
                    (0, i.p)(this.T) || (this.Kd.show(t), (0, i.Y)())
                }
                close(t) {
                    (0, i.p)(this.T) && (this.Kd.hide(t), (0, i.Y)())
                }
            }
            He([i.a2], We.prototype, "triggerElement", 1), He([i.a2], We.prototype, "contentElement", 1), He([i.a2], We.prototype, "isSubmenu", 1), He([i.a8], We.prototype, "open", 1), He([i.a8], We.prototype, "close", 1);
            var Ue = Object.defineProperty,
                Ye = Object.getOwnPropertyDescriptor;
            class Xe extends i.C {
                constructor() {
                    super(), this.Lh = (0, i.f)(null), new bt
                }
                static# t = this.props = {
                    disabled: !1
                };
                get expanded() {
                    return this.n ? .T() ? ? !1
                }
                onSetup() {
                    this.n = (0, i.u)(ze)
                }
                onAttach(t) {
                    this.n.uf(this), (0, i.g)(this.Nc.bind(this)), (0, a.s)(t, "type", "button")
                }
                onConnect(t) {
                    (0, i.g)(this.mm.bind(this)), this.Gc();
                    const e = new MutationObserver(this.Gc.bind(this));
                    e.observe(t, {
                        attributeFilter: ["data-part"],
                        childList: !0,
                        subtree: !0
                    }), (0, i.q)((() => e.disconnect())), (0, a.o)(t, (t => {
                        this.dispatch("select", {
                            trigger: t
                        })
                    }))
                }
                Nc() {
                    this.n.xf(this.$props.disabled())
                }
                mm() {
                    const t = this.Lh();
                    t && (0, i.g)((() => {
                        const e = this.n._b();
                        e && (t.textContent = e)
                    }))
                }
                Gc() {
                    const t = this.el ? .querySelector('[data-part="hint"]');
                    this.Lh.set(t ? ? null)
                }
            }((t, e, s, i) => {
                for (var n, r = i > 1 ? void 0 : i ? Ye(e, s) : e, a = t.length - 1; a >= 0; a--)(n = t[a]) && (r = (i ? n(e, s, r) : n(r)) || r);
                i && r && Ue(e, s, r)
            })([i.a2], Xe.prototype, "expanded", 1);
            class Qe extends i.C {
                constructor() {
                    super(...arguments), this.G = null
                }
                static# t = this.props = {
                    container: null,
                    disabled: !1
                };
                onSetup() {
                    this.a = (0, m.u)(), (0, i._)(Ke, {
                        xb: this.nm.bind(this)
                    })
                }
                onAttach(t) {
                    t.style.setProperty("display", "contents")
                }
                onConnect(t) {}
                onDestroy() {
                    this.G ? .remove(), this.G = null
                }
                nm(t) {
                    this.Mh(!1), this.G = t, (0, a.r)((() => {
                        (0, a.r)((() => {
                            this.connectScope && (0, i.g)(this.Nc.bind(this))
                        }))
                    }))
                }
                Nc() {
                    const {
                        fullscreen: t
                    } = this.a.$state, {
                        disabled: e
                    } = this.$props, s = e();
                    this.Mh("fullscreen" === s ? !t() : !s)
                }
                Mh(t) {
                    if (!this.G) return;
                    let e = this.om(this.$props.container());
                    if (!e) return;
                    const s = this.G.parentElement === e;
                    (0, i.s)(this.G, "data-portal", t), t ? s || (this.G.remove(), e.append(this.G)) : s && this.G.parentElement === e && (this.G.remove(), this.el ? .append(this.G))
                }
                om(t) {
                    return (0, a.i)(t) ? t : t ? document.querySelector(t) : document.body
                }
            }
            const Ke = (0, i.Z)();
            class Je extends i.C {
                static# t = this.props = {
                    placement: null,
                    offset: 0,
                    alignOffset: 0
                };
                constructor() {
                    super(), new bt;
                    const {
                        placement: t
                    } = this.$props;
                    this.setAttributes({
                        "data-placement": t
                    })
                }
                onAttach(t) {
                    if (this.n = (0, i.u)(ze), this.n.vf(this), (0, i.ab)(Ke)) {
                        const e = (0, i.u)(Ke);
                        e && ((0, i._)(Ke, null), e.xb(t), (0, i.q)((() => e.xb(null))))
                    }
                }
                onConnect(t) {
                    (0, i.g)(this.bf.bind(this))
                }
                bf() {
                    if (!this.el) return;
                    const t = this.$props.placement();
                    if (t) {
                        Object.assign(this.el.style, {
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "max-content"
                        });
                        const {
                            offset: e,
                            alignOffset: s
                        } = this.$props;
                        return (0, a.m)(this.el, this.Bd(), t, {
                            offsetVarName: "media-menu",
                            xOffset: s(),
                            yOffset: e()
                        })
                    }
                    this.el.removeAttribute("style"), this.el.style.display = "none"
                }
                Bd() {
                    return this.n._l()
                }
            }
            const Ze = (0, i.Z)();
            class ts extends i.a6 {
                constructor() {
                    super(...arguments), this.$b = new Set, this.Ta = (0, i.f)(""), this.e = null, this.sm = this.E.bind(this)
                }
                get pm() {
                    return Array.from(this.$b).map((t => t.Ta()))
                }
                get value() {
                    return this.Ta()
                }
                set value(t) {
                    this.E(t)
                }
                onSetup() {
                    (0, i._)(Ze, {
                        add: this.qm.bind(this),
                        remove: this.rm.bind(this)
                    })
                }
                onAttach(t) {
                    (0, i.ab)(ze) || (0, a.s)(t, "role", "radiogroup"), this.setAttributes({
                        value: this.Ta
                    })
                }
                onDestroy() {
                    this.$b.clear()
                }
                qm(t) {
                    this.$b.has(t) || (this.$b.add(t), t.Nd = this.sm, t.Wc(t.Ta() === this.Ta()))
                }
                rm(t) {
                    t.Nd = null, this.$b.delete(t)
                }
                E(t, e) {
                    const s = (0, i.p)(this.Ta);
                    if (!t || t === s) return;
                    const n = this.Nh(s),
                        r = this.Nh(t);
                    n ? .Wc(!1, e), r ? .Wc(!0, e), this.Ta.set(t), this.l ? .(t, e)
                }
                Nh(t) {
                    for (const e of this.$b)
                        if (t === (0, i.p)(e.Ta)) return e;
                    return null
                }
            }
            var es = Object.defineProperty,
                ss = Object.getOwnPropertyDescriptor,
                is = (t, e, s, i) => {
                    for (var n, r = i > 1 ? void 0 : i ? ss(e, s) : e, a = t.length - 1; a >= 0; a--)(n = t[a]) && (r = (i ? n(e, s, r) : n(r)) || r);
                    return i && r && es(e, s, r), r
                };
            class ns extends i.C {
                static# t = this.props = {
                    value: ""
                };
                get values() {
                    return this.e.pm
                }
                get value() {
                    return this.e.value
                }
                set value(t) {
                    this.e.value = t
                }
                constructor() {
                    super(), this.e = new ts, this.e.l = this.l.bind(this)
                }
                onSetup() {
                    (0, i.g)(this.N.bind(this))
                }
                N() {
                    this.e.value = this.$props.value()
                }
                l(t, e) {
                    const s = this.createEvent("change", {
                        detail: t,
                        trigger: e
                    });
                    this.dispatch(s)
                }
            }
            is([i.a2], ns.prototype, "values", 1), is([i.a2], ns.prototype, "value", 1);
            var rs = Object.defineProperty,
                as = Object.getOwnPropertyDescriptor;
            class os extends i.C {
                constructor() {
                    super(), this.zb = (0, i.f)(!1), this.e = {
                        Ta: this.$props.value,
                        Wc: this.Wc.bind(this),
                        Nd: null
                    }, new bt
                }
                static# t = this.props = {
                    value: ""
                };
                get checked() {
                    return this.zb()
                }
                onSetup() {
                    this.setAttributes({
                        value: this.$props.value,
                        "data-checked": this.zb,
                        "aria-checked": Kt(this.zb)
                    })
                }
                onAttach(t) {
                    const e = (0, i.ab)(ze);
                    (0, a.s)(t, "tabindex", e ? "-1" : "0"), (0, a.s)(t, "role", e ? "menuitemradio" : "radio"), (0, i.g)(this.N.bind(this))
                }
                onConnect(t) {
                    this.tm(), (0, a.o)(t, this.r.bind(this)), (0, i.q)(this.Fa.bind(this))
                }
                Fa() {
                    (0, i.e)((() => {
                        (0, i.u)(Ze).remove(this.e)
                    }), this.connectScope)
                }
                tm() {
                    (0, i.u)(Ze).add(this.e)
                }
                N() {
                    const {
                        value: t
                    } = this.$props, e = t();
                    (0, i.p)(this.zb) && this.e.Nd ? .(e)
                }
                r(t) {
                    (0, i.p)(this.zb) || (this.E(!0, t), this.um(t), this.e.Nd ? .((0, i.p)(this.$props.value), t))
                }
                Wc(t, e) {
                    (0, i.p)(this.zb) !== t && this.E(t, e)
                }
                E(t, e) {
                    this.zb.set(t), this.dispatch("change", {
                        detail: t,
                        trigger: e
                    })
                }
                um(t) {
                    this.dispatch("select", {
                        trigger: t
                    })
                }
            }((t, e, s, i) => {
                for (var n, r = i > 1 ? void 0 : i ? as(e, s) : e, a = t.length - 1; a >= 0; a--)(n = t[a]) && (r = (i ? n(e, s, r) : n(r)) || r);
                i && r && rs(e, s, r)
            })([i.a2], os.prototype, "checked", 1);
            var ls = Object.defineProperty,
                cs = Object.getOwnPropertyDescriptor,
                hs = (t, e, s, i) => {
                    for (var n, r = i > 1 ? void 0 : i ? cs(e, s) : e, a = t.length - 1; a >= 0; a--)(n = t[a]) && (r = (i ? n(e, s, r) : n(r)) || r);
                    return i && r && ls(e, s, r), r
                };
            class us extends i.C {
                constructor() {
                    super(), this.J = (0, i.f)(null), this.B = (0, i.f)([]), this.e = new ts, this.e.l = this.l.bind(this)
                }
                static# t = this.props = {
                    thumbnails: null
                };
                get value() {
                    return this.e.value
                }
                get disabled() {
                    return !this.B() ? .length
                }
                onSetup() {
                    this.a = (0, m.u)(), (0, i.ab)(ze) && (this.n = (0, i.u)(ze));
                    const {
                        thumbnails: t
                    } = this.$props;
                    this.setAttributes({
                        "data-thumbnails": () => !!t()
                    })
                }
                onAttach(t) {
                    this.n ? .wf({
                        Af: this.Af.bind(this)
                    })
                }
                getOptions() {
                    const {
                        clipStartTime: t,
                        clipEndTime: e
                    } = this.a.$state, s = t(), i = e() || 1 / 0;
                    return this.B().map(((t, e) => ({
                        cue: t,
                        value: e.toString(),
                        label: t.text,
                        startTime: Vt(Math.max(0, t.startTime - s)),
                        duration: jt(Math.min(i, t.endTime) - Math.max(s, t.startTime))
                    })))
                }
                Af() {
                    (0, i.p)((() => this.Qb()))
                }
                onConnect(t) {
                    (0, i.g)(this.Qb.bind(this)), (0, i.g)(this.sa.bind(this)), (0, i.g)(this.vm.bind(this)), (0, o.w)(this.a.textTracks, "chapters", this.J.set)
                }
                vm() {
                    const t = this.J();
                    if (!t) return;
                    const e = this.Id.bind(this, t);
                    return e(), (0, i.l)(t, "add-cue", e), (0, i.l)(t, "remove-cue", e), () => {
                        this.B.set([])
                    }
                }
                Id(t) {
                    const {
                        clipStartTime: e,
                        clipEndTime: s
                    } = this.a.$state, i = e(), n = s() || 1 / 0;
                    this.B.set([...t.cues].filter((t => t.startTime <= n && t.endTime >= i)))
                }
                Qb() {
                    if (!this.n ? .T()) return;
                    if (!this.J()) return void(this.e.value = "-1");
                    const {
                        realCurrentTime: t,
                        clipStartTime: e,
                        clipEndTime: s
                    } = this.a.$state, n = e(), r = s() || 1 / 0, l = t(), c = this.B().findIndex((t => (0, o.b)(t, l)));
                    this.e.value = c.toString(), c >= 0 && (0, a.r)((() => {
                        if (!this.connectScope) return;
                        const t = this.B()[c],
                            e = this.el.querySelector("[aria-checked='true']"),
                            s = Math.max(n, t.startTime),
                            a = Math.min(r, t.endTime) - s,
                            o = Math.max(0, l - s) / a * 100;
                        e && (0, i.a)(e, "--progress", (0, y.r)(o, 3) + "%")
                    }))
                }
                sa() {
                    this.n ? .gb(this.disabled)
                }
                l(t, e) {
                    if (this.disabled || !e) return;
                    const s = +t,
                        n = this.B(),
                        {
                            clipStartTime: r
                        } = this.a.$state;
                    (0, i.j)(s) && n ? .[s] && (this.e.value = s.toString(), this.a.remote.seek(n[s].startTime - r(), e), this.dispatch("change", {
                        detail: n[s],
                        trigger: e
                    }))
                }
            }
            hs([i.a2], us.prototype, "value", 1), hs([i.a2], us.prototype, "disabled", 1), hs([i.a8], us.prototype, "getOptions", 1);
            var ds = Object.defineProperty,
                ps = Object.getOwnPropertyDescriptor,
                fs = (t, e, s, i) => {
                    for (var n, r = i > 1 ? void 0 : i ? ps(e, s) : e, a = t.length - 1; a >= 0; a--)(n = t[a]) && (r = (i ? n(e, s, r) : n(r)) || r);
                    return i && r && ds(e, s, r), r
                };
            class ms extends i.C {
                static# t = this.props = {
                    emptyLabel: "Default"
                };
                get value() {
                    return this.e.value
                }
                get disabled() {
                    const {
                        audioTracks: t
                    } = this.a.$state;
                    return t().length <= 1
                }
                constructor() {
                    super(), this.e = new ts, this.e.l = this.l.bind(this)
                }
                onSetup() {
                    this.a = (0, m.u)(), (0, i.ab)(ze) && (this.n = (0, i.u)(ze))
                }
                onConnect(t) {
                    (0, i.g)(this.N.bind(this)), (0, i.g)(this.sa.bind(this)), (0, i.g)(this.Ua.bind(this))
                }
                getOptions() {
                    const {
                        audioTracks: t
                    } = this.a.$state;
                    return t().map((t => ({
                        track: t,
                        label: t.label,
                        value: t.label.toLowerCase()
                    })))
                }
                N() {
                    this.e.value = this.Y()
                }
                Ua() {
                    const {
                        emptyLabel: t
                    } = this.$props, {
                        audioTrack: e
                    } = this.a.$state, s = e();
                    this.n ? ._b.set(s ? .label ? ? t())
                }
                sa() {
                    this.n ? .gb(this.disabled)
                }
                Y() {
                    const {
                        audioTrack: t
                    } = this.a.$state, e = t();
                    return e ? e.label.toLowerCase() : ""
                }
                l(t, e) {
                    if (this.disabled) return;
                    const s = this.a.audioTracks.toArray().findIndex((e => e.label.toLowerCase() === t));
                    if (s >= 0) {
                        const t = this.a.audioTracks[s];
                        this.a.remote.changeAudioTrack(s, e), this.dispatch("change", {
                            detail: t,
                            trigger: e
                        })
                    }
                }
            }
            fs([i.a2], ms.prototype, "value", 1), fs([i.a2], ms.prototype, "disabled", 1), fs([i.a8], ms.prototype, "getOptions", 1);
            var gs = Object.defineProperty,
                vs = Object.getOwnPropertyDescriptor,
                bs = (t, e, s, i) => {
                    for (var n, r = i > 1 ? void 0 : i ? vs(e, s) : e, a = t.length - 1; a >= 0; a--)(n = t[a]) && (r = (i ? n(e, s, r) : n(r)) || r);
                    return i && r && gs(e, s, r), r
                };
            const ys = [1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4];
            class ws extends i.C {
                static# t = this.props = {
                    normalLabel: "Disabled",
                    gains: ys
                };
                get value() {
                    return this.e.value
                }
                get disabled() {
                    const {
                        gains: t
                    } = this.$props, {
                        canSetAudioGain: e
                    } = this.a.$state;
                    return !e() || 0 === t().length
                }
                constructor() {
                    super(), this.e = new ts, this.e.l = this.l.bind(this)
                }
                onSetup() {
                    this.a = (0, m.u)(), (0, i.ab)(ze) && (this.n = (0, i.u)(ze))
                }
                onConnect(t) {
                    (0, i.g)(this.N.bind(this)), (0, i.g)(this.Ua.bind(this)), (0, i.g)(this.sa.bind(this))
                }
                getOptions() {
                    const {
                        gains: t,
                        normalLabel: e
                    } = this.$props;
                    return t().map((t => ({
                        label: 1 === t || null === t ? e : String(100 * t) + "%",
                        value: t.toString()
                    })))
                }
                N() {
                    this.e.value = this.Y()
                }
                Ua() {
                    const {
                        normalLabel: t
                    } = this.$props, {
                        audioGain: e
                    } = this.a.$state, s = e();
                    this.n ? ._b.set(1 === s || null == s ? t() : String(100 * s) + "%")
                }
                sa() {
                    this.n ? .gb(this.disabled)
                }
                Y() {
                    const {
                        audioGain: t
                    } = this.a.$state;
                    return t() ? .toString() ? ? "1"
                }
                l(t, e) {
                    if (this.disabled) return;
                    const s = +t;
                    this.a.remote.changeAudioGain(s, e), this.dispatch("change", {
                        detail: s,
                        trigger: e
                    })
                }
            }
            bs([i.a2], ws.prototype, "value", 1), bs([i.a2], ws.prototype, "disabled", 1), bs([i.a8], ws.prototype, "getOptions", 1);
            var Ts = Object.defineProperty,
                _s = Object.getOwnPropertyDescriptor,
                ks = (t, e, s, i) => {
                    for (var n, r = i > 1 ? void 0 : i ? _s(e, s) : e, a = t.length - 1; a >= 0; a--)(n = t[a]) && (r = (i ? n(e, s, r) : n(r)) || r);
                    return i && r && Ts(e, s, r), r
                };
            class xs extends i.C {
                static# t = this.props = {
                    offLabel: "Off"
                };
                get value() {
                    return this.e.value
                }
                get disabled() {
                    const {
                        hasCaptions: t
                    } = this.a.$state;
                    return !t()
                }
                constructor() {
                    super(), this.e = new ts, this.e.l = this.l.bind(this)
                }
                onSetup() {
                    this.a = (0, m.u)(), (0, i.ab)(ze) && (this.n = (0, i.u)(ze))
                }
                onConnect(t) {
                    super.onConnect ? .(t), (0, i.g)(this.N.bind(this)), (0, i.g)(this.sa.bind(this)), (0, i.g)(this.Ua.bind(this))
                }
                getOptions() {
                    const {
                        offLabel: t
                    } = this.$props, {
                        textTracks: e
                    } = this.a.$state;
                    return [{
                        value: "off",
                        label: t
                    }, ...e().filter(o.i).map((t => ({
                        track: t,
                        label: t.label,
                        value: this.Df(t)
                    })))]
                }
                N() {
                    this.e.value = this.Y()
                }
                Ua() {
                    const {
                        offLabel: t
                    } = this.$props, {
                        textTrack: e
                    } = this.a.$state, s = e();
                    this.n ? ._b.set(s && (0, o.i)(s) && "showing" === s.mode ? s.label : t())
                }
                sa() {
                    this.n ? .gb(this.disabled)
                }
                Y() {
                    const {
                        textTrack: t
                    } = this.a.$state, e = t();
                    return e && (0, o.i)(e) && "showing" === e.mode ? this.Df(e) : "off"
                }
                l(t, e) {
                    if (this.disabled) return;
                    if ("off" === t) {
                        const t = this.a.textTracks.selected;
                        if (t) {
                            const s = this.a.textTracks.indexOf(t);
                            this.a.remote.changeTextTrackMode(s, "disabled", e), this.dispatch("change", {
                                detail: null,
                                trigger: e
                            })
                        }
                        return
                    }
                    const s = this.a.textTracks.toArray().findIndex((e => this.Df(e) === t));
                    if (s >= 0) {
                        const t = this.a.textTracks[s];
                        this.a.remote.changeTextTrackMode(s, "showing", e), this.dispatch("change", {
                            detail: t,
                            trigger: e
                        })
                    }
                }
                Df(t) {
                    return t.id + ":" + t.kind + "-" + t.label.toLowerCase()
                }
            }
            ks([i.a2], xs.prototype, "value", 1), ks([i.a2], xs.prototype, "disabled", 1), ks([i.a8], xs.prototype, "getOptions", 1);
            var Ss = Object.defineProperty,
                Es = Object.getOwnPropertyDescriptor,
                $s = (t, e, s, i) => {
                    for (var n, r = i > 1 ? void 0 : i ? Es(e, s) : e, a = t.length - 1; a >= 0; a--)(n = t[a]) && (r = (i ? n(e, s, r) : n(r)) || r);
                    return i && r && Ss(e, s, r), r
                };
            const Cs = [.25, .5, .75, 1, 1.25, 1.5, 1.75, 2];
            class Ms extends i.C {
                static# t = this.props = {
                    normalLabel: "Normal",
                    rates: Cs
                };
                get value() {
                    return this.e.value
                }
                get disabled() {
                    const {
                        rates: t
                    } = this.$props, {
                        canSetPlaybackRate: e
                    } = this.a.$state;
                    return !e() || 0 === t().length
                }
                constructor() {
                    super(), this.e = new ts, this.e.l = this.l.bind(this)
                }
                onSetup() {
                    this.a = (0, m.u)(), (0, i.ab)(ze) && (this.n = (0, i.u)(ze))
                }
                onConnect(t) {
                    (0, i.g)(this.N.bind(this)), (0, i.g)(this.Ua.bind(this)), (0, i.g)(this.sa.bind(this))
                }
                getOptions() {
                    const {
                        rates: t,
                        normalLabel: e
                    } = this.$props;
                    return t().map((t => ({
                        label: 1 === t ? e : t + "\xd7",
                        value: t.toString()
                    })))
                }
                N() {
                    this.e.value = this.Y()
                }
                Ua() {
                    const {
                        normalLabel: t
                    } = this.$props, {
                        playbackRate: e
                    } = this.a.$state, s = e();
                    this.n ? ._b.set(1 === s ? t() : s + "\xd7")
                }
                sa() {
                    this.n ? .gb(this.disabled)
                }
                Y() {
                    const {
                        playbackRate: t
                    } = this.a.$state;
                    return t().toString()
                }
                l(t, e) {
                    if (this.disabled) return;
                    const s = +t;
                    this.a.remote.changePlaybackRate(s, e), this.dispatch("change", {
                        detail: s,
                        trigger: e
                    })
                }
            }
            $s([i.a2], Ms.prototype, "value", 1), $s([i.a2], Ms.prototype, "disabled", 1), $s([i.a8], Ms.prototype, "getOptions", 1);
            var Ps = Object.defineProperty,
                As = Object.getOwnPropertyDescriptor,
                Ls = (t, e, s, i) => {
                    for (var n, r = i > 1 ? void 0 : i ? As(e, s) : e, a = t.length - 1; a >= 0; a--)(n = t[a]) && (r = (i ? n(e, s, r) : n(r)) || r);
                    return i && r && Ps(e, s, r), r
                };
            class Os extends i.C {
                constructor() {
                    super(), this.Rc = (0, i.o)((() => {
                        const {
                            sort: t
                        } = this.$props, {
                            qualities: e
                        } = this.a.$state;
                        return j(e(), "descending" === t())
                    })), this.e = new ts, this.e.l = this.l.bind(this)
                }
                static# t = this.props = {
                    autoLabel: "Auto",
                    hideBitrate: !1,
                    sort: "descending"
                };
                get value() {
                    return this.e.value
                }
                get disabled() {
                    const {
                        canSetQuality: t,
                        qualities: e
                    } = this.a.$state;
                    return !t() || e().length <= 1
                }
                onSetup() {
                    this.a = (0, m.u)(), (0, i.ab)(ze) && (this.n = (0, i.u)(ze))
                }
                onConnect(t) {
                    (0, i.g)(this.N.bind(this)), (0, i.g)(this.sa.bind(this)), (0, i.g)(this.Ua.bind(this))
                }
                getOptions() {
                    const {
                        autoLabel: t,
                        hideBitrate: e
                    } = this.$props;
                    return [{
                        value: "auto",
                        label: t
                    }, ...this.Rc().map((t => {
                        const s = t.bitrate && t.bitrate >= 0 ? `${(0,y.r)(t.bitrate/1e6,2)} Mbps` : null;
                        return {
                            quality: t,
                            label: t.height + "p",
                            value: this.Ef(t),
                            bitrate: () => e() ? null : s
                        }
                    }))]
                }
                N() {
                    this.e.value = this.Y()
                }
                Ua() {
                    const {
                        autoLabel: t
                    } = this.$props, {
                        autoQuality: e,
                        quality: s
                    } = this.a.$state, i = s() ? s().height + "p" : "";
                    this.n ? ._b.set(e() ? t() + (i ? ` (${i})` : "") : i)
                }
                sa() {
                    this.n ? .gb(this.disabled)
                }
                l(t, e) {
                    if (this.disabled) return;
                    if ("auto" === t) return this.a.remote.changeQuality(-1, e), void this.dispatch("change", {
                        detail: "auto",
                        trigger: e
                    });
                    const {
                        qualities: s
                    } = this.a.$state, n = (0, i.p)(s).findIndex((e => this.Ef(e) === t));
                    if (n >= 0) {
                        const t = (0, i.p)(s)[n];
                        this.a.remote.changeQuality(n, e), this.dispatch("change", {
                            detail: t,
                            trigger: e
                        })
                    }
                }
                Y() {
                    const {
                        quality: t,
                        autoQuality: e
                    } = this.a.$state;
                    if (e()) return "auto";
                    const s = t();
                    return s ? this.Ef(s) : "auto"
                }
                Ef(t) {
                    return t.height + "_" + t.bitrate
                }
            }
            Ls([i.a2], Os.prototype, "value", 1), Ls([i.a2], Os.prototype, "disabled", 1), Ls([i.a8], Os.prototype, "getOptions", 1);
            class Is extends i.C {
                constructor() {
                    super(...arguments), this.p = null, this.Ab = 0, this.Oh = -1
                }
                static# t = this.props = {
                    disabled: !1,
                    event: void 0,
                    action: void 0
                };
                onSetup() {
                    this.a = (0, m.u)();
                    const {
                        event: t,
                        action: e
                    } = this.$props;
                    this.setAttributes({
                        event: t,
                        action: e
                    })
                }
                onAttach(t) {
                    t.setAttribute("data-media-gesture", ""), t.style.setProperty("pointer-events", "none")
                }
                onConnect(t) {
                    this.p = this.a.player.el ? .querySelector("[data-media-provider]"), (0, i.g)(this.wm.bind(this))
                }
                wm() {
                    let t = this.$props.event(),
                        e = this.$props.disabled();
                    if (this.p && t && !e) {
                        if (/^dbl/.test(t) && (t = t.split(/^dbl/)[1]), "pointerup" === t || "pointerdown" === t) {
                            "coarse" === this.a.$state.pointer() && (t = "pointerup" === t ? "touchend" : "touchstart")
                        }(0, i.l)(this.p, t, this.xm.bind(this), {
                            passive: !1
                        })
                    }
                }
                xm(t) {
                    if (this.$props.disabled() || (0, i.Q)(t) && (0 !== t.button || this.a.activeMenu) || (0, i.z)(t) && this.a.activeMenu || (0, a.j)(t) || !this.ym(t)) return;
                    t.MEDIA_GESTURE = !0, t.preventDefault();
                    const e = (0, i.p)(this.$props.event),
                        s = e ? .startsWith("dbl");
                    if (s) {
                        if (1 === this.Ab) return queueMicrotask((() => this.Ph(t))), clearTimeout(this.Oh), void(this.Ab = 0)
                    } else 0 === this.Ab && setTimeout((() => {
                        1 === this.Ab && this.Ph(t)
                    }), 250);
                    0 === this.Ab && (this.Oh = window.setTimeout((() => {
                        this.Ab = 0
                    }), 275)), this.Ab++
                }
                Ph(t) {
                    this.el.setAttribute("data-triggered", ""), requestAnimationFrame((() => {
                        this.zm() && this.Am((0, i.p)(this.$props.action), t), requestAnimationFrame((() => {
                            this.el.removeAttribute("data-triggered")
                        }))
                    }))
                }
                ym(t) {
                    if (!this.el) return !1;
                    if ((0, i.Q)(t) || (0, i.ae)(t) || (0, i.z)(t)) {
                        const e = (0, i.z)(t) ? t.changedTouches[0] ? ? t.touches[0] : void 0,
                            s = e ? .clientX ? ? t.clientX,
                            n = e ? .clientY ? ? t.clientY,
                            r = this.el.getBoundingClientRect(),
                            a = n >= r.top && n <= r.bottom && s >= r.left && s <= r.right;
                        return t.type.includes("leave") ? !a : a
                    }
                    return !0
                }
                zm() {
                    const t = this.a.player.el.querySelectorAll("[data-media-gesture][data-triggered]");
                    return Array.from(t).sort(((t, e) => +getComputedStyle(e).zIndex - +getComputedStyle(t).zIndex))[0] === this.el
                }
                Am(t, e) {
                    if (!t) return;
                    const s = new i.D("will-trigger", {
                        detail: t,
                        cancelable: !0,
                        trigger: e
                    });
                    if (this.dispatchEvent(s), s.defaultPrevented) return;
                    const [n, r] = t.replace(/:([a-z])/, "-$1").split(":");
                    t.includes(":fullscreen") ? this.a.remote.toggleFullscreen("prefer-media", e) : t.includes("seek:") ? this.a.remote.seek((0, i.p)(this.a.$state.currentTime) + (+r || 0), e) : this.a.remote[(0, i.k)(n)](e), this.dispatch("trigger", {
                        detail: t,
                        trigger: e
                    })
                }
            }
            class qs {
                constructor(t) {
                    this.ca = t, this.priority = 10, this.J = null, this.Ya = (0, i.c)()
                }
                attach() {}
                canRender() {
                    return !0
                }
                detach() {
                    this.Ya.empty(), this.ca.reset(), this.J = null
                }
                changeTrack(t) {
                    t && this.J !== t && (this.Ya.empty(), t.readyState < 2 ? (this.ca.reset(), this.Ya.add((0, i.l)(t, "load", (() => this.Qh(t)), {
                        once: !0
                    }))) : this.Qh(t), this.Ya.add((0, i.l)(t, "add-cue", (t => {
                        this.ca.addCue(t.detail)
                    })), (0, i.l)(t, "remove-cue", (t => {
                        this.ca.removeCue(t.detail)
                    }))), this.J = t)
                }
                Qh(t) {
                    this.ca.changeTrack({
                        cues: [...t.cues],
                        regions: [...t.regions]
                    })
                }
            }
            class Ds extends i.C {
                constructor() {
                    super(...arguments), this.ac = -1
                }
                static# t = this.props = {
                    textDir: "ltr",
                    exampleText: "Captions look like this."
                };
                onSetup() {
                    this.a = (0, m.u)(), this.setAttributes({
                        "aria-hidden": Kt(this.Tb.bind(this))
                    })
                }
                onAttach(t) {
                    t.style.setProperty("pointer-events", "none")
                }
                onConnect(t) {
                    const e = this.a.player;
                    e && (0, i.l)(e, "vds-font-change", this.Bm.bind(this)), this.ca ? (0, i.g)(this.Rh.bind(this)) : s.e(944).then(s.bind(s, "../node_modules/media-captions/dist/prod.js")).then((e => {
                        this.connectScope && (0, i.e)((() => {
                            this.L = e;
                            const {
                                CaptionsRenderer: s
                            } = this.L;
                            this.ca = new s(t), this.Bb = new qs(this.ca), (0, i.g)(this.Rh.bind(this))
                        }), this.connectScope)
                    }))
                }
                onDestroy() {
                    this.Bb && (this.Bb.detach(), this.a.textRenderers.remove(this.Bb)), this.ca ? .destroy()
                }
                Tb() {
                    const {
                        textTrack: t,
                        remotePlaybackState: e,
                        iOSControls: s
                    } = this.a.$state, i = t();
                    return s() || "connected" === e() || !i || !(0, o.i)(i)
                }
                Rh() {
                    const {
                        viewType: t
                    } = this.a.$state;
                    return "audio" === t() ? this.Cm() : this.Dm()
                }
                Cm() {
                    return (0, i.g)(this.pc.bind(this)), () => {
                        this.el.textContent = ""
                    }
                }
                pc() {
                    if (this.Tb()) return;
                    const {
                        textTrack: t
                    } = this.a.$state;
                    this.Sh(), (0, i.l)(t(), "cue-change", this.Sh.bind(this)), (0, i.g)(this.Em.bind(this))
                }
                Sh() {
                    this.el.textContent = "", this.ac >= 0 && this.Ff();
                    const {
                        realCurrentTime: t,
                        textTrack: e
                    } = this.a.$state, {
                        renderVTTCueString: s
                    } = this.L, n = (0, i.p)(t), r = (0, i.p)(e).activeCues;
                    for (const t of r) {
                        const e = this.Th(),
                            i = this.Uh();
                        i.innerHTML = s(t, n), e.append(i), this.el.append(i)
                    }
                }
                Em() {
                    const {
                        realCurrentTime: t
                    } = this.a.$state, {
                        updateTimedVTTCueNodes: e
                    } = this.L;
                    e(this.el, t())
                }
                Dm() {
                    return (0, i.g)(this.Fm.bind(this)), (0, i.g)(this.Gm.bind(this)), this.a.textRenderers.add(this.Bb), () => {
                        this.el.textContent = "", this.Bb.detach(), this.a.textRenderers.remove(this.Bb)
                    }
                }
                Fm() {
                    this.ca.dir = this.$props.textDir()
                }
                Gm() {
                    if (this.Tb()) return;
                    const {
                        realCurrentTime: t,
                        textTrack: e
                    } = this.a.$state;
                    this.ca.currentTime = t(), this.ac >= 0 && e() ? .activeCues[0] && this.Ff()
                }
                Bm() {
                    if (this.ac >= 0) return void this.Vh();
                    const {
                        textTrack: t
                    } = this.a.$state;
                    t() ? .activeCues[0] ? this.ca ? .update(!0) : this.Hm()
                }
                Hm() {
                    const t = this.Th();
                    (0, i.s)(t, "data-example", "");
                    const e = this.Uh();
                    (0, i.s)(e, "data-example", ""), e.textContent = this.$props.exampleText(), t ? .append(e), this.el ? .append(t), this.el ? .setAttribute("data-example", ""), this.Vh()
                }
                Vh() {
                    window.clearTimeout(this.ac), this.ac = window.setTimeout(this.Ff.bind(this), 2500)
                }
                Ff() {
                    this.el ? .removeAttribute("data-example"), this.el ? .querySelector("[data-example]") && (this.el.textContent = ""), this.ac = -1
                }
                Th() {
                    const t = document.createElement("div");
                    return (0, i.s)(t, "data-part", "cue-display"), t
                }
                Uh() {
                    const t = document.createElement("div");
                    return (0, i.s)(t, "data-part", "cue"), t
                }
            }
            class zs extends i.C {
                constructor() {
                    super(...arguments), this.Xh = ""
                }
                static# t = this.props = {
                    src: null,
                    alt: null,
                    crossOrigin: null
                };
                static# e = this.state = new i.W({
                    img: null,
                    src: null,
                    alt: null,
                    crossOrigin: null,
                    loading: !0,
                    error: null,
                    hidden: !1
                });
                onSetup() {
                    this.a = (0, m.u)(), this.Mb(), this.Wh(), this.Ca(), this.Ea()
                }
                onAttach(t) {
                    t.style.setProperty("pointer-events", "none"), (0, i.g)(this.kf.bind(this)), (0, i.g)(this.Mb.bind(this)), (0, i.g)(this.Wh.bind(this)), (0, i.g)(this.Ca.bind(this)), (0, i.g)(this.Ea.bind(this));
                    const {
                        started: e
                    } = this.a.$state;
                    this.setAttributes({
                        "data-visible": () => !e() && !this.$state.hidden(),
                        "data-loading": this.Pc.bind(this),
                        "data-error": this.fb.bind(this),
                        "data-hidden": this.$state.hidden
                    })
                }
                onConnect(t) {
                    (0, i.g)(this.Im.bind(this)), (0, i.g)(this.Ma.bind(this))
                }
                fb() {
                    const {
                        error: t
                    } = this.$state;
                    return !(0, i.m)(t())
                }
                Im() {
                    const {
                        canLoadPoster: t,
                        poster: e
                    } = this.a.$state;
                    !t() && e() && (0, b.p)(e(), "preconnect")
                }
                Ea() {
                    const {
                        src: t
                    } = this.$props, {
                        poster: e,
                        nativeControls: s
                    } = this.a.$state;
                    this.el && (0, i.s)(this.el, "display", s() ? "none" : null), this.$state.hidden.set(this.fb() || !(t() || e()) || s())
                }
                Pc() {
                    const {
                        loading: t,
                        hidden: e
                    } = this.$state;
                    return !e() && t()
                }
                kf() {
                    const t = this.$state.img();
                    t && ((0, i.l)(t, "load", this.gd.bind(this)), (0, i.l)(t, "error", this.Q.bind(this)))
                }
                Mb() {
                    const {
                        poster: t
                    } = this.a.$props, {
                        canLoadPoster: e,
                        providedPoster: s,
                        inferredPoster: i
                    } = this.a.$state, n = this.$props.src() || "", r = n || t() || i();
                    this.Xh === s() && s.set(n), this.$state.src.set(e() && r.length ? r : null), this.Xh = n
                }
                Wh() {
                    const {
                        src: t
                    } = this.$props, {
                        alt: e
                    } = this.$state, {
                        poster: s
                    } = this.a.$state;
                    e.set(t() || s() ? this.$props.alt() : null)
                }
                Ca() {
                    const {
                        crossOrigin: t
                    } = this.$props, {
                        crossOrigin: e
                    } = this.$state, {
                        crossOrigin: s,
                        poster: i
                    } = this.a.$state, n = null !== t() ? t() : s();
                    e.set(/ytimg\.com|vimeo/.test(i() || "") ? null : !0 === n ? "anonymous" : n)
                }
                Ma() {
                    const {
                        loading: t,
                        error: e
                    } = this.$state, {
                        canLoadPoster: s,
                        poster: i
                    } = this.a.$state;
                    t.set(s() && !!i()), e.set(null)
                }
                gd() {
                    const {
                        loading: t,
                        error: e
                    } = this.$state;
                    t.set(!1), e.set(null)
                }
                Q(t) {
                    const {
                        loading: e,
                        error: s
                    } = this.$state;
                    e.set(!1), s.set(t)
                }
            }
            class Vs extends i.C {
                constructor() {
                    super(...arguments), this.Xc = (0, i.f)(null), this.Lc = (0, i.f)(!0), this.Mc = (0, i.f)(!0)
                }
                static# t = this.props = {
                    type: "current",
                    showHours: !1,
                    padHours: null,
                    padMinutes: null,
                    remainder: !1,
                    toggle: !1,
                    hidden: !1
                };
                static# e = this.state = new i.W({
                    timeText: "",
                    hidden: !1
                });
                onSetup() {
                    this.a = (0, m.u)(), this.Yh();
                    const {
                        type: t
                    } = this.$props;
                    this.setAttributes({
                        "data-type": t,
                        "data-remainder": this.Zh.bind(this)
                    }), new ce({
                        callback: this.gf.bind(this)
                    }).attach(this)
                }
                onAttach(t) {
                    t.hasAttribute("role") || (0, i.g)(this.Jm.bind(this)), (0, i.g)(this.Yh.bind(this))
                }
                onConnect(t) {
                    (0, i.q)((0, a.p)(t, this.Lc.set)), (0, i.g)(this.Ea.bind(this)), (0, i.g)(this.Km.bind(this))
                }
                gf(t) {
                    this.Mc.set(t[0].isIntersecting)
                }
                Ea() {
                    const {
                        hidden: t
                    } = this.$props;
                    this.$state.hidden.set(t() || !this.Lc() || !this.Mc())
                }
                Km() {
                    this.$props.toggle() ? this.el && (0, a.o)(this.el, this.Lm.bind(this)) : this.Xc.set(null)
                }
                Yh() {
                    const {
                        hidden: t,
                        timeText: e
                    } = this.$state, {
                        duration: s
                    } = this.a.$state;
                    if (t()) return;
                    const {
                        type: i,
                        padHours: n,
                        padMinutes: r,
                        showHours: a
                    } = this.$props, o = this.Mm(i()), l = s(), c = this.Zh();
                    if (!Number.isFinite(o + l)) return void e.set("LIVE");
                    const h = Vt(c ? Math.max(0, l - o) : o, {
                        padHrs: n(),
                        padMins: r(),
                        showHrs: a()
                    });
                    e.set((c ? "-" : "") + h)
                }
                Jm() {
                    if (!this.el) return;
                    const {
                        toggle: t
                    } = this.$props;
                    (0, i.s)(this.el, "role", t() ? "timer" : null), (0, i.s)(this.el, "tabindex", t() ? 0 : null)
                }
                Mm(t) {
                    const {
                        bufferedEnd: e,
                        duration: s,
                        currentTime: i
                    } = this.a.$state;
                    switch (t) {
                        case "buffered":
                            return e();
                        case "duration":
                            return s();
                        default:
                            return i()
                    }
                }
                Zh() {
                    return this.$props.remainder() && !1 !== this.Xc()
                }
                Lm(t) {
                    t.preventDefault(), null !== this.Xc() ? this.Xc.set((t => !t)) : this.Xc.set(!this.$props.remainder())
                }
            }
        },
        "../node_modules/vidstack/prod/chunks/vidstack-BSXZsAhp.js": (t, e, s) => {
            "use strict";
            s.d(e, {
                Q: () => i
            });
            const i = {
                Wa: Symbol(0),
                Ia: Symbol(0)
            }
        },
        "../node_modules/vidstack/prod/chunks/vidstack-BnqIpPdq.js": (t, e, s) => {
            "use strict";
            s.d(e, {
                I: () => o,
                a: () => $,
                b: () => r,
                c: () => u,
                d: () => P,
                e: () => m,
                f: () => c,
                g: () => d,
                h: () => p,
                i: () => E,
                j: () => f,
                p: () => C,
                q: () => M,
                r: () => A,
                s: () => g,
                t: () => a,
                u: () => h,
                v: () => v,
                w: () => l
            });
            var i = s("../node_modules/vidstack/prod/chunks/vidstack-B11i_cNc.js");
            const n = navigator ? .userAgent.toLowerCase() || "",
                r = /iphone|ipad|ipod|ios|crios|fxios/i.test(n),
                a = /(iphone|ipod)/gi.test(navigator ? .platform || ""),
                o = !!window.chrome,
                l = !!window.safari || r;

            function c() {
                return !(0, i.h)(window.screen.orientation) && !(0, i.h)(window.screen.orientation.lock) && (0, i.x)(screen.orientation.unlock)
            }

            function h(t, e) {
                return t || (t = document.createElement("audio")), t.canPlayType(e).length > 0
            }

            function u(t, e) {
                return t || (t = document.createElement("video")), t.canPlayType(e).length > 0
            }

            function d(t) {
                return t || (t = document.createElement("video")), t.canPlayType("application/vnd.apple.mpegurl").length > 0
            }

            function p(t) {
                return !!document.pictureInPictureEnabled && !t ? .disablePictureInPicture
            }

            function f(t) {
                return (0, i.x)(t ? .webkitSupportsPresentationMode) && (0, i.x)(t ? .webkitSetPresentationMode)
            }
            async function m() {
                const t = document.createElement("video");
                return t.volume = .5, await (0, i.K)(0), .5 === t.volume
            }

            function g() {
                const t = window ? .ManagedMediaSource ? ? window ? .MediaSource ? ? window ? .WebKitMediaSource;
                if ((0, i.h)(t)) return !1;
                const e = t && (0, i.x)(t.isTypeSupported) && t.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"'),
                    s = window ? .SourceBuffer ? ? window ? .WebKitSourceBuffer,
                    n = (0, i.h)(s) || !(0, i.h)(s.prototype) && (0, i.x)(s.prototype.appendBuffer) && (0, i.x)(s.prototype.remove);
                return !!e && !!n
            }

            function v() {
                return g()
            }
            const b = /\.(m4a|m4b|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i,
                y = new Set(["audio/mpeg", "audio/ogg", "audio/3gp", "audio/mp4", "audio/webm", "audio/flac"]),
                w = /\.(mp4|og[gv]|webm|mov|m4v)(#t=[,\d+]+)?($|\?)/i,
                T = new Set(["video/mp4", "video/webm", "video/3gp", "video/ogg", "video/avi", "video/mpeg"]),
                _ = /\.(m3u8)($|\?)/i,
                k = /\.(mpd)($|\?)/i,
                x = new Set(["application/vnd.apple.mpegurl", "audio/mpegurl", "audio/x-mpegurl", "application/x-mpegurl", "video/x-mpegurl", "video/mpegurl", "application/mpegurl"]),
                S = new Set(["application/dash+xml"]);

            function E(t) {
                let {
                    src: e,
                    type: s
                } = t;
                return (0, i.i)(e) ? b.test(e) || y.has(s) || e.startsWith("blob:") && "audio/object" === s : "audio/object" === s
            }

            function $(t) {
                return (0, i.i)(t.src) ? w.test(t.src) || T.has(t.type) || t.src.startsWith("blob:") && "video/object" === t.type || C(t) && d() : "video/object" === t.type
            }

            function C(t) {
                let {
                    src: e,
                    type: s
                } = t;
                return (0, i.i)(e) && _.test(e) || x.has(s)
            }

            function M(t) {
                let {
                    src: e,
                    type: s
                } = t;
                return (0, i.i)(e) && k.test(e) || S.has(s)
            }

            function P(t) {
                return (0, i.i)(t.src) && (E(t) || $(t) || C(t))
            }

            function A(t) {
                return void 0 !== window.MediaStream && t instanceof window.MediaStream
            }
        },
        "../node_modules/vidstack/prod/chunks/vidstack-COCzjeeM.js": (t, e, s) => {
            "use strict";
            s.d(e, {
                a: () => r,
                b: () => c,
                g: () => h,
                l: () => l,
                p: () => a
            });
            var i = s("../node_modules/vidstack/prod/chunks/vidstack-B11i_cNc.js"),
                n = s("../node_modules/vidstack/prod/chunks/vidstack-BnqIpPdq.js");

            function r(t, e) {
                const s = new URLSearchParams;
                for (const t of Object.keys(e)) s.set(t, e[t] + "");
                return t + "?" + s.toString()
            }

            function a(t) {
                let e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "preconnect";
                const s = document.querySelector(`link[href="${t}"]`);
                if (!(0, i.m)(s)) return !0;
                const n = document.createElement("link");
                return n.rel = e, n.href = t, n.crossOrigin = "true", document.head.append(n), !0
            }
            const o = {};

            function l(t) {
                if (o[t]) return o[t].promise;
                const e = (0, i.n)(),
                    s = document.querySelector(`script[src="${t}"]`);
                if (!(0, i.m)(s)) return e.resolve(), e.promise;
                const n = document.createElement("script");
                return n.src = t, n.onload = () => {
                    e.resolve(), delete o[t]
                }, n.onerror = () => {
                    e.reject(), delete o[t]
                }, setTimeout((() => document.head.append(n)), 0), e.promise
            }

            function c(t) {
                return "use-credentials" === t ? "include" : (0, i.i)(t) ? "same-origin" : void 0
            }

            function h(t) {
                let {
                    title: e,
                    src: s,
                    download: r
                } = t;
                const a = (0, i.b)(r) || "" === r ? s.src : (0, i.i)(r) ? r : r ? .url;
                return function(t) {
                    let {
                        url: e,
                        src: s,
                        download: r
                    } = t;
                    return (0, i.i)(e) && (r && !0 !== r || (0, n.i)(s) || (0, n.a)(s))
                }({
                    url: a,
                    src: s,
                    download: r
                }) ? {
                    url: a,
                    name: !(0, i.b)(r) && !(0, i.i)(r) && r ? .filename || e.toLowerCase() || "media"
                } : null
            }
        },
        "../node_modules/vidstack/prod/chunks/vidstack-CUVgUi9M.js": (t, e, s) => {
            "use strict";
            s.d(e, {
                P: () => h,
                a: () => u,
                b: () => a,
                c: () => l,
                m: () => n,
                u: () => r
            });
            var i = s("../node_modules/vidstack/prod/chunks/vidstack-B11i_cNc.js");
            const n = (0, i.Z)();

            function r() {
                return (0, i.u)(n)
            }

            function a() {
                return r().$state
            }
            const o = (0, i.Z)();

            function l() {
                return (0, i.u)(o)
            }
            const c = {
                clickToPlay: !0,
                clickToFullscreen: !0,
                controls: ["play-large", "play", "progress", "current-time", "mute+volume", "captions", "settings", "pip", "airplay", "fullscreen"],
                customIcons: !1,
                displayDuration: !1,
                download: null,
                markers: null,
                invertTime: !0,
                thumbnails: null,
                toggleTime: !0,
                translations: null,
                seekTime: 10,
                speed: [.5, .75, 1, 1.25, 1.5, 1.75, 2, 4]
            };
            class h extends i.C {
                static# t = this.props = c;
                onSetup() {
                    this.a = r(), (0, i._)(o, { ...this.$props,
                        previewTime: (0, i.f)(0)
                    })
                }
            }

            function u(t, e) {
                const {
                    canAirPlay: s,
                    canFullscreen: n,
                    canPictureInPicture: r,
                    controlsHidden: a,
                    currentTime: o,
                    fullscreen: l,
                    hasCaptions: c,
                    isAirPlayConnected: h,
                    paused: u,
                    pictureInPicture: d,
                    playing: p,
                    pointer: f,
                    poster: m,
                    textTrack: g,
                    viewType: v,
                    waiting: b
                } = e.$state;
                t.classList.add("plyr"), t.classList.add("plyr--full-ui");
                const y = {
                        "plyr--airplay-active": h,
                        "plyr--airplay-supported": s,
                        "plyr--fullscreen-active": l,
                        "plyr--fullscreen-enabled": n,
                        "plyr--hide-controls": a,
                        "plyr--is-touch": () => "coarse" === f(),
                        "plyr--loading": b,
                        "plyr--paused": u,
                        "plyr--pip-active": d,
                        "plyr--pip-enabled": r,
                        "plyr--playing": p,
                        "plyr__poster-enabled": m,
                        "plyr--stopped": () => u() && 0 === o(),
                        "plyr--captions-active": g,
                        "plyr--captions-enabled": c
                    },
                    w = (0, i.c)();
                for (const e of Object.keys(y)) w.add((0, i.g)((() => {
                    t.classList.toggle(e, !!y[e]())
                })));
                return w.add((0, i.g)((() => {
                    const e = `plyr--${v()}`;
                    return t.classList.add(e), () => t.classList.remove(e)
                })), (0, i.g)((() => {
                    const {
                        $provider: s
                    } = e, i = s() ? .type, n = `plyr--${function(t){return"audio"===t||"video"===t}(i)?"html5":i}`;
                    return t.classList.toggle(n, !!i), () => t.classList.remove(n)
                }))), () => w.empty()
            }
        },
        "../node_modules/vidstack/prod/chunks/vidstack-CzvK2UwB.js": (t, e, s) => {
            "use strict";
            s.d(e, {
                T: () => d,
                a: () => r,
                b: () => a,
                c: () => l,
                i: () => f,
                w: () => o
            });
            var i = s("../node_modules/vidstack/prod/chunks/vidstack-B11i_cNc.js"),
                n = s("../node_modules/vidstack/prod/chunks/vidstack-COCzjeeM.js");
            const r = {
                Db: Symbol(0),
                ma: Symbol(0),
                Eb: Symbol(0),
                Z: Symbol(0),
                hb: Symbol(0),
                _: Symbol(0),
                Mf: Symbol(0)
            };

            function a(t, e) {
                return e >= t.startTime && e < t.endTime
            }

            function o(t, e, s) {
                let n = null,
                    r = (0, i.A)();

                function a() {
                    const a = (0, i.i)(e) ? [e] : e,
                        o = t.toArray().find((t => a.includes(t.kind) && "showing" === t.mode));
                    if (o !== n) {
                        if (!o) return s(null), void(n = null);
                        2 == o.readyState ? s(o) : (s(null), (0, i.e)((() => {
                            const t = (0, i.l)(o, "load", (() => {
                                s(o), t()
                            }), {
                                once: !0
                            })
                        }), r)), n = o
                    }
                }
                return a(), (0, i.l)(t, "mode-change", a)
            }

            function l(t, e, s) {
                o(t, e, (t => {
                    if (!t) return void s("");
                    const e = () => {
                        const e = t ? .activeCues[0];
                        s(e ? .text || "")
                    };
                    e(), (0, i.l)(t, "cue-change", e)
                }))
            }
            var c, h, u;
            class d extends i.V {
                constructor(t) {
                    super(), this.id = "", this.label = "", this.language = "", this.default = !1, this.Z = !1, this.ua = 0, this.U = "disabled", this.Nf = {}, this.$c = [], this.B = [], this.Fb = [], this[c] = 0, this[h] = null, this[u] = null;
                    for (const e of Object.keys(t)) this[e] = t[e];
                    this.type || (this.type = "vtt"), t.content ? this._h(t) : t.src || (this[r.ma] = 2)
                }
                static createId(t) {
                    return `vds-${t.type}-${t.kind}-${t.src??t.label??"?"}`
                }
                get metadata() {
                    return this.Nf
                }
                get regions() {
                    return this.$c
                }
                get cues() {
                    return this.B
                }
                get activeCues() {
                    return this.Fb
                }
                get readyState() {
                    return this[r.ma]
                }
                get mode() {
                    return this.U
                }
                set mode(t) {
                    this.setMode(t)
                }
                addCue(t, e) {
                    let s = 0,
                        n = this.B.length;
                    for (s = 0; s < n && !(t.endTime <= this.B[s].startTime); s++);
                    s === n ? this.B.push(t) : this.B.splice(s, 0, t), t instanceof TextTrackCue || this[r._] ? .track.addCue(t), this.dispatchEvent(new i.D("add-cue", {
                        detail: t,
                        trigger: e
                    })), a(t, this.ua) && this[r.Eb](this.ua, e)
                }
                removeCue(t, e) {
                    const s = this.B.indexOf(t);
                    if (s >= 0) {
                        const n = this.Fb.includes(t);
                        this.B.splice(s, 1), this[r._] ? .track.removeCue(t), this.dispatchEvent(new i.D("remove-cue", {
                            detail: t,
                            trigger: e
                        })), n && this[r.Eb](this.ua, e)
                    }
                }
                setMode(t, e) {
                    this.U !== t && (this.U = t, "disabled" === t ? (this.Fb = [], this.Of()) : 2 === this.readyState ? this[r.Eb](this.ua, e) : this.Pf(), this.dispatchEvent(new i.D("mode-change", {
                        detail: this,
                        trigger: e
                    })), this[r.hb] ? .())
                }[(c = r.ma, h = r.hb, u = r._, r.Eb)](t, e) {
                    if (this.ua = t, "disabled" === this.mode || !this.B.length) return;
                    const s = [];
                    for (let e = 0, i = this.B.length; e < i; e++) {
                        const i = this.B[e];
                        a(i, t) && s.push(i)
                    }
                    let i = s.length !== this.Fb.length;
                    if (!i)
                        for (let t = 0; t < s.length; t++)
                            if (!this.Fb.includes(s[t])) {
                                i = !0;
                                break
                            }
                    this.Fb = s, i && this.Of(e)
                }[r.Z]() {
                    this.Z = !0, "disabled" !== this.U && this.Pf()
                }
                _h(t) {
                    s.e(944).then(s.bind(s, "../node_modules/media-captions/dist/prod.js")).then((e => {
                        let {
                            parseText: s,
                            VTTCue: n,
                            VTTRegion: r
                        } = e;
                        (0, i.i)(t.content) && "json" !== t.type ? s(t.content, {
                            type: t.type
                        }).then((t => {
                            let {
                                cues: e,
                                regions: s
                            } = t;
                            this.B = e, this.$c = s, this.Ga()
                        })) : (this.Qf(t.content, n, r), 3 !== this.readyState && this.Ga())
                    }))
                }
                async Pf() {
                    if (this.Z && !(this[r.ma] > 0))
                        if (this[r.ma] = 1, this.dispatchEvent(new i.D("load-start")), this.src) try {
                            const {
                                parseResponse: t,
                                VTTCue: e,
                                VTTRegion: i
                            } = await s.e(944).then(s.bind(s, "../node_modules/media-captions/dist/prod.js")), a = this[r.Db] ? .(), o = fetch(this.src, {
                                headers: "json" === this.type ? {
                                    "Content-Type": "application/json"
                                } : void 0,
                                credentials: (0, n.b)(a)
                            });
                            if ("json" === this.type) this.Qf(await (await o).text(), e, i);
                            else {
                                const {
                                    errors: e,
                                    metadata: s,
                                    regions: i,
                                    cues: n
                                } = await t(o, {
                                    type: this.type,
                                    encoding: this.encoding
                                });
                                if (0 === e[0] ? .code) throw e[0];
                                this.Nf = s, this.$c = i, this.B = n
                            }
                            this.Ga()
                        } catch (t) {
                            this.Rf(t)
                        } else this.Ga()
                }
                Ga() {
                    if (this[r.ma] = 2, !this.src || "vtt" !== this.type) {
                        const t = this[r._];
                        if (t && !t.managed)
                            for (const e of this.B) t.track.addCue(e)
                    }
                    const t = new i.D("load");
                    this[r.Eb](this.ua, t), this.dispatchEvent(t)
                }
                Rf(t) {
                    this[r.ma] = 3, this.dispatchEvent(new i.D("error", {
                        detail: t
                    }))
                }
                Qf(t, e, s) {
                    try {
                        const {
                            regions: n,
                            cues: r
                        } = function(t, e, s) {
                            const n = (0, i.i)(t) ? JSON.parse(t) : t;
                            let r = [],
                                a = [];
                            n.regions && s && (r = n.regions.map((t => Object.assign(new s, t))));
                            (n.cues || (0, i.v)(n)) && (a = ((0, i.v)(n) ? n : n.cues).filter((t => (0, i.j)(t.startTime) && (0, i.j)(t.endTime))).map((t => Object.assign(new e(0, 0, ""), t))));
                            return {
                                regions: r,
                                cues: a
                            }
                        }(t, e, s);
                        this.$c = n, this.B = r
                    } catch (t) {
                        this.Rf(t)
                    }
                }
                Of(t) {
                    this.dispatchEvent(new i.D("cue-change", {
                        trigger: t
                    }))
                }
            }
            const p = /captions|subtitles/;

            function f(t) {
                return p.test(t.kind)
            }
        },
        "../node_modules/vidstack/prod/chunks/vidstack-DM_McBs5.js": (t, e, s) => {
            "use strict";

            function i(t) {
                return t instanceof Error ? t : Error("string" == typeof t ? t : JSON.stringify(t))
            }

            function n(t, e) {
                if (!t) throw Error(e || "Assertion failed.")
            }
            s.d(e, {
                a: () => n,
                c: () => i
            })
        },
        "../node_modules/vidstack/prod/chunks/vidstack-NiSULkLR.js": (t, e, s) => {
            "use strict";
            s.d(e, {
                T: () => n,
                a: () => y,
                b: () => a,
                c: () => w,
                d: () => S,
                e: () => k,
                f: () => b,
                g: () => r,
                h: () => E,
                i: () => $,
                j: () => g,
                k: () => _,
                l: () => o,
                m: () => T,
                n: () => u,
                o: () => m,
                p: () => p,
                q: () => f,
                r: () => v,
                s: () => h,
                t: () => l,
                u: () => x,
                v: () => d,
                w: () => C
            });
            var i = s("../node_modules/vidstack/prod/chunks/vidstack-B11i_cNc.js");
            class n {
                get length() {
                    return this.ta.length
                }
                constructor(t, e) {
                    (0, i.v)(t) ? this.ta = t: (0, i.h)(t) || (0, i.h)(e) ? this.ta = [] : this.ta = [
                        [t, e]
                    ]
                }
                start(t) {
                    return this.ta[t][0] ? ? 1 / 0
                }
                end(t) {
                    return this.ta[t][1] ? ? 1 / 0
                }
            }

            function r(t) {
                if (!t.length) return null;
                let e = t.start(0);
                for (let s = 1; s < t.length; s++) {
                    const i = t.start(s);
                    i < e && (e = i)
                }
                return e
            }

            function a(t) {
                if (!t.length) return null;
                let e = t.end(0);
                for (let s = 1; s < t.length; s++) {
                    const i = t.end(s);
                    i > e && (e = i)
                }
                return e
            }

            function o(t, e, s) {
                if (t) return (0, i.l)(t, e, s)
            }

            function l(t, e) {
                return (0, i.w)(e.target) && t.contains(e.target)
            }
            const c = new Set; {
                let t = function() {
                    for (const t of c) try {
                        t()
                    } catch (t) {}
                    window.requestAnimationFrame(t)
                };
                t()
            }

            function h(t, e, s) {
                t.hasAttribute(e) || t.setAttribute(e, s)
            }

            function u(t, e) {
                t.hasAttribute("aria-label") || t.hasAttribute("data-no-label") || ((0, i.x)(e) ? (0, i.g)((function() {
                    (0, i.s)(t, "aria-label", e())
                })) : (0, i.s)(t, "aria-label", e))
            }

            function d(t) {
                const e = getComputedStyle(t);
                return "none" !== e.display && parseInt(e.opacity) > 0
            }

            function p(t, e) {
                return s = () => e(function(t) {
                    return !!t && ("checkVisibility" in t ? t.checkVisibility({
                        checkOpacity: !0,
                        checkVisibilityCSS: !0
                    }) : d(t))
                }(t)), c.add(s), () => c.delete(s);
                var s
            }

            function f(t, e, s) {
                for (; e;) {
                    if (e === t) return !0;
                    if (s ? .(e)) break;
                    e = e.parentElement
                }
                return !1
            }

            function m(t, e) {
                (0, i.l)(t, "pointerup", (t => {
                    0 !== t.button || t.defaultPrevented || e(t)
                })), (0, i.l)(t, "keydown", (t => {
                    (0, i.y)(t) && e(t)
                }))
            }

            function g(t) {
                return (0, i.z)(t) && (t.touches.length > 1 || t.changedTouches.length > 1)
            }

            function v(t) {
                let e = (0, i.A)(),
                    s = window.requestAnimationFrame((() => {
                        (0, i.e)(t, e), s = -1
                    }));
                return () => {
                    window.cancelAnimationFrame(s)
                }
            }

            function b(t, e, s) {
                let n, r = t,
                    a = t.parentElement,
                    o = t.content.firstElementChild,
                    l = [];
                !o && t.firstElementChild && (t.innerHTML = t.firstElementChild.outerHTML, t.firstElementChild.remove(), o = t.content.firstElementChild);
                for (let t = 0; t < e; t++) n = document.importNode(o, !0), s ? .(n, t), a.insertBefore(n, r.nextSibling), l.push(n), r = n;
                return (0, i.q)((() => {
                    for (let t = 0; t < l.length; t++) l[t].remove()
                })), l
            }

            function y(t) {
                const e = document.createElement("template");
                return e.innerHTML = t, e.content
            }

            function w(t) {
                return t.cloneNode(!0).firstElementChild
            }

            function T(t, e, s, n) {
                let {
                    offsetVarName: r,
                    xOffset: a,
                    yOffset: o,
                    ...l
                } = n;
                if (!t) return;
                const c = s.replace(" ", "-").replace("-center", "");
                if ((0, i.a)(t, "visibility", e ? null : "hidden"), !e) return;
                let h = s.includes("top");
                const u = t => s.includes("left") ? `calc(-1 * ${t})` : t,
                    d = t => h ? `calc(-1 * ${t})` : t;
                return (0, i.B)(e, t, (() => {
                    (0, i.E)(e, t, {
                        placement: c,
                        middleware: [...l.middleware ? ? [], (0, i.F)({
                            fallbackAxisSideDirection: "start",
                            crossAxis: !1
                        }), (0, i.G)()],
                        ...l
                    }).then((e => {
                        let {
                            x: i,
                            y: n,
                            middlewareData: l
                        } = e;
                        const c = !!l.flip ? .index;
                        h = s.includes(c ? "bottom" : "top"), t.setAttribute("data-placement", c ? s.startsWith("top") ? s.replace("top", "bottom") : s.replace("bottom", "top") : s), Object.assign(t.style, {
                            top: `calc(${n+"px"} + ${d(o?o+"px":`var(--${r}-y-offset, 0px)`)})`,
                            left: `calc(${i+"px"} + ${u(a?a+"px":`var(--${r}-x-offset, 0px)`)})`
                        })
                    }))
                }))
            }

            function _(t) {
                return "none" !== getComputedStyle(t).animationName
            }

            function k(t) {
                const e = document.createElement("slot");
                return e.name = t, e
            }

            function x(t) {
                const e = (0, i.f)(!1);
                return (0, i.g)((() => {
                    const s = t();
                    s && ((0, i.l)(s, "transitionstart", (() => e.set(!0))), (0, i.l)(s, "transitionend", (() => e.set(!1))))
                })), e
            }

            function S(t, e) {
                (0, i.g)((function() {
                    const s = t();
                    if (!s) return;
                    e();
                    const n = new ResizeObserver((0, i.J)(e));
                    return n.observe(s), () => n.disconnect()
                }))
            }

            function E(t) {
                const e = function(t) {
                        const e = (0, i.f)(!1);
                        return (0, i.g)((() => {
                            const s = t();
                            s ? ((0, i.l)(s, "mouseenter", (() => e.set(!0))), (0, i.l)(s, "mouseleave", (() => e.set(!1)))) : e.set(!1)
                        })), e
                    }(t),
                    s = function(t) {
                        const e = (0, i.f)(!1);
                        return (0, i.g)((() => {
                            const s = t();
                            s ? ((0, i.l)(s, "focusin", (() => e.set(!0))), (0, i.l)(s, "focusout", (() => e.set(!1)))) : e.set(!1)
                        })), e
                    }(t);
                let n = !1;
                return (0, i.o)((() => {
                    const t = e();
                    return !(n && !t) && (n = t, t || s())
                }))
            }

            function $(t) {
                return t instanceof HTMLElement
            }

            function C(t, e) {
                function s(e) {
                    (0, i.I)(t, "light", "light" === e), (0, i.I)(t, "dark", "dark" === e)
                }(0, i.g)((() => {
                    const t = e();
                    if ("system" !== t) s(t);
                    else {
                        const t = function() {
                            const t = (0, i.f)("dark"),
                                e = window.matchMedia("(prefers-color-scheme: light)");

                            function s() {
                                t.set(e.matches ? "light" : "dark")
                            }
                            return s(), (0, i.l)(e, "change", s), t
                        }();
                        (0, i.g)((() => s(t())))
                    }
                }))
            }
        },
        "../node_modules/vidstack/prod/chunks/vidstack-VrKElWm_.js": (t, e, s) => {
            "use strict";
            s.d(e, {
                L: () => i
            });
            const i = {
                da: Symbol(0),
                cc: Symbol(0),
                z: Symbol(0),
                ea: Symbol(0),
                Yc: Symbol(0),
                Od: Symbol(0),
                Gf: Symbol(0),
                Hf: Symbol(0),
                If: Symbol(0)
            }
        },
        "../node_modules/vidstack/prod/chunks/vidstack-ksPACRiU.js": (t, e, s) => {
            "use strict";

            function i(t) {
                let e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2;
                return Number(t.toFixed(e))
            }

            function n(t) {
                return String(t).split(".")[1] ? .length ? ? 0
            }

            function r(t, e, s) {
                return Math.max(t, Math.min(s, e))
            }
            s.d(e, {
                c: () => r,
                g: () => n,
                r: () => i
            })
        },
        "./scripts/app.js": (t, e, s) => {
            "use strict";
            const i = t => {
                window.requestAnimationFrame((async function e() {
                    document.body ? await t() : window.requestAnimationFrame(e)
                }))
            };
            s("../node_modules/lazysizes/lazysizes.js"), s("../node_modules/sharer.js/sharer.js");

            function n(t, e) {
                try {
                    if ("object" != typeof e) {
                        throw new TypeError(`AccessibleMenu: Elements given to isValidInstance() must be inside of an object. ${typeof e} given.`)
                    }
                    for (const s in e)
                        if (!(e[s] instanceof t)) {
                            const i = typeof e[s];
                            throw new TypeError(`AccessibleMenu: ${s} must be an instance of ${t.name}. ${i} given.`)
                        }
                    return !0
                } catch (t) {
                    return console.error(t), !1
                }
            }

            function r(t, e) {
                try {
                    if ("object" != typeof e) {
                        throw new TypeError(`AccessibleMenu: Values given to isValidType() must be inside of an object. ${typeof e} given.`)
                    }
                    for (const s in e) {
                        const i = typeof e[s];
                        if (i !== t) throw new TypeError(`AccessibleMenu: ${s} must be a ${t}. ${i} given.`)
                    }
                    return !0
                } catch (t) {
                    return console.error(t), !1
                }
            }

            function a(t) {
                try {
                    if ("object" != typeof t) {
                        throw new TypeError(`AccessibleMenu: Values given to isCSSSelector() must be inside of an object. ${typeof t} given.`)
                    }
                    for (const e in t) try {
                        if (null === t[e]) throw new Error;
                        document.querySelector(t[e])
                    } catch (s) {
                        throw new TypeError(`AccessibleMenu: ${e} must be a valid CSS selector. "${t[e]}" given.`)
                    }
                    return !0
                } catch (t) {
                    return console.error(t), !1
                }
            }

            function o(t) {
                try {
                    if ("object" != typeof t || Array.isArray(t)) {
                        throw new TypeError(`AccessibleMenu: Values given to isValidClassList() must be inside of an object. ${typeof t} given.`)
                    }
                    for (const e in t) {
                        const s = typeof t[e];
                        if ("string" !== s) {
                            if (!Array.isArray(t[e])) throw new TypeError(`AccessibleMenu: ${e} must be a string or an array of strings. ${s} given.`);
                            t[e].forEach((t => {
                                if ("string" != typeof t) throw new TypeError(`AccessibleMenu: ${e} must be a string or an array of strings. An array containing non-strings given.`)
                            }))
                        } else {
                            const s = {};
                            s[e] = t[e], a(s)
                        }
                    }
                    return !0
                } catch (t) {
                    return console.error(t), !1
                }
            }

            function l(t) {
                try {
                    if ("object" != typeof t) {
                        throw new TypeError(`AccessibleMenu: Values given to isValidHoverType() must be inside of an object. ${typeof t} given.`)
                    }
                    const e = ["off", "on", "dynamic"];
                    for (const s in t)
                        if (!e.includes(t[s])) throw new TypeError(`AccessibleMenu: ${s} must be one of the following values: ${e.join(", ")}. "${t[s]}" given.`);
                    return !0
                } catch (t) {
                    return console.error(t), !1
                }
            }
            const c = class {
                _dom = {
                    toggle: null,
                    parent: null
                };
                _elements = {
                    controlledMenu: null,
                    parentMenu: null
                };
                _open = !1;
                _expandEvent = new CustomEvent("accessibleMenuExpand", {
                    bubbles: !0,
                    detail: {
                        toggle: this
                    }
                });
                _collapseEvent = new CustomEvent("accessibleMenuCollapse", {
                    bubbles: !0,
                    detail: {
                        toggle: this
                    }
                });
                constructor({
                    menuToggleElement: t,
                    parentElement: e,
                    controlledMenu: s,
                    parentMenu: i = null
                }) {
                    this._dom.toggle = t, this._dom.parent = e, this._elements.controlledMenu = s, this._elements.parentMenu = i
                }
                initialize() {
                    if (this.dom.toggle.setAttribute("aria-haspopup", "true"), this.dom.toggle.setAttribute("aria-expanded", "false"), function(t, e) {
                            if (r("string", {
                                    tagName: t
                                }) && n(HTMLElement, e)) {
                                const s = t.toLowerCase();
                                let i = !0;
                                for (const t in e) e[t].tagName.toLowerCase() !== s && (i = !1);
                                return i
                            }
                            return !1
                        }("button", {
                            toggle: this.dom.toggle
                        }) || this.dom.toggle.setAttribute("role", "button"), "" === this.dom.toggle.id || "" === this.elements.controlledMenu.dom.menu.id) {
                        const t = Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 10);
                        let e = this.dom.toggle.innerText.replace(/[^a-zA-Z0-9\s]/g, ""),
                            s = t;
                        !e.replace(/\s/g, "").length && this.dom.toggle.getAttribute("aria-label") && (e = this.dom.toggle.getAttribute("aria-label").replace(/[^a-zA-Z0-9\s]/g, "")), e.replace(/\s/g, "").length > 0 && (e = e.toLowerCase().replace(/\s+/g, "-"), e.startsWith("-") && (e = e.substring(1)), e.endsWith("-") && (e = e.slice(0, -1)), s = `${e}-${s}`), this.dom.toggle.id = this.dom.toggle.id || `${s}-menu-button`, this.elements.controlledMenu.dom.menu.id = this.elements.controlledMenu.dom.menu.id || `${s}-menu`
                    }
                    this.elements.controlledMenu.dom.menu.setAttribute("aria-labelledby", this.dom.toggle.id), this.dom.toggle.setAttribute("aria-controls", this.elements.controlledMenu.dom.menu.id), this._collapse(!1)
                }
                get dom() {
                    return this._dom
                }
                get elements() {
                    return this._elements
                }
                get isOpen() {
                    return this._open
                }
                set isOpen(t) {
                    r("boolean", {
                        value: t
                    }), this._open = t
                }
                _expand(t = !0) {
                    const {
                        closeClass: e,
                        openClass: s
                    } = this.elements.controlledMenu;
                    this.dom.toggle.setAttribute("aria-expanded", "true"), "" !== s && ("string" == typeof s ? this.elements.controlledMenu.dom.menu.classList.add(s) : this.elements.controlledMenu.dom.menu.classList.add(...s)), "" !== e && ("string" == typeof e ? this.elements.controlledMenu.dom.menu.classList.remove(e) : this.elements.controlledMenu.dom.menu.classList.remove(...e)), t && this.dom.toggle.dispatchEvent(this._expandEvent)
                }
                _collapse(t = !0) {
                    const {
                        closeClass: e,
                        openClass: s
                    } = this.elements.controlledMenu;
                    this.dom.toggle.setAttribute("aria-expanded", "false"), "" !== e && ("string" == typeof e ? this.elements.controlledMenu.dom.menu.classList.add(e) : this.elements.controlledMenu.dom.menu.classList.add(...e)), "" !== s && ("string" == typeof s ? this.elements.controlledMenu.dom.menu.classList.remove(s) : this.elements.controlledMenu.dom.menu.classList.remove(...s)), t && this.dom.toggle.dispatchEvent(this._collapseEvent)
                }
                open() {
                    this.elements.controlledMenu.focusState = "self", this._expand(), this.isOpen = !0
                }
                preview() {
                    this.elements.parentMenu && (this.elements.parentMenu.focusState = "self"), this._expand(), this.isOpen = !0
                }
                close() {
                    this.isOpen && (this.elements.controlledMenu.currentChild = 0, this.elements.controlledMenu.blur(), this.elements.parentMenu && (this.elements.parentMenu.focusState = "self"), this._collapse(), this.isOpen = !1)
                }
                toggle() {
                    this.isOpen ? this.close() : this.open()
                }
                closeSiblings() {
                    this.elements.parentMenu && this.elements.parentMenu.elements.submenuToggles.forEach((t => {
                        t !== this && t.close()
                    }))
                }
                closeChildren() {
                    this.elements.controlledMenu.elements.submenuToggles.forEach((t => t.close()))
                }
            };
            const h = class {
                _dom = {
                    item: null,
                    link: null
                };
                _elements = {
                    parentMenu: null,
                    childMenu: null,
                    toggle: null
                };
                _submenu = !1;
                constructor({
                    menuItemElement: t,
                    menuLinkElement: e,
                    parentMenu: s,
                    isSubmenuItem: i = !1,
                    childMenu: n = null,
                    toggle: r = null
                }) {
                    this._dom.item = t, this._dom.link = e, this._elements.parentMenu = s, this._elements.childMenu = n, this._elements.toggle = r, this._submenu = i
                }
                initialize() {}
                get dom() {
                    return this._dom
                }
                get elements() {
                    return this._elements
                }
                get isSubmenuItem() {
                    return this._submenu
                }
                focus() {
                    this.elements.parentMenu.shouldFocus && this.dom.link.focus()
                }
                blur() {
                    this.elements.parentMenu.shouldFocus && this.dom.link.blur()
                }
            };

            function u(t) {
                try {
                    const e = t.key || t.keyCode,
                        s = {
                            Enter: "Enter" === e || 13 === e,
                            Space: " " === e || "Spacebar" === e || 32 === e,
                            Escape: "Escape" === e || "Esc" === e || 27 === e,
                            ArrowUp: "ArrowUp" === e || "Up" === e || 38 === e,
                            ArrowRight: "ArrowRight" === e || "Right" === e || 39 === e,
                            ArrowDown: "ArrowDown" === e || "Down" === e || 40 === e,
                            ArrowLeft: "ArrowLeft" === e || "Left" === e || 37 === e,
                            Home: "Home" === e || 36 === e,
                            End: "End" === e || 35 === e,
                            Character: isNaN(e) && !!e.match(/^[a-zA-Z]{1}$/),
                            Tab: "Tab" === e || 9 === e,
                            Asterisk: "*" === e || 56 === e
                        };
                    return Object.keys(s).find((t => !0 === s[t])) || ""
                } catch (t) {
                    return ""
                }
            }

            function d(t) {
                t.preventDefault(), t.stopPropagation()
            }
            class p {
                _MenuType = p;
                _MenuItemType = h;
                _MenuToggleType = c;
                _dom = {
                    menu: null,
                    menuItems: [],
                    submenuItems: [],
                    submenuToggles: [],
                    submenus: [],
                    controller: null,
                    container: null
                };
                _selectors = {
                    menuItems: "",
                    menuLinks: "",
                    submenuItems: "",
                    submenuToggles: "",
                    submenus: ""
                };
                _elements = {
                    menuItems: [],
                    submenuToggles: [],
                    controller: null,
                    parentMenu: null,
                    rootMenu: null
                };
                _openClass = "show";
                _closeClass = "hide";
                _root = !0;
                _currentChild = 0;
                _focusState = "none";
                _currentEvent = "none";
                _hoverType = "off";
                _hoverDelay = 250;
                constructor({
                    menuElement: t,
                    menuItemSelector: e = "li",
                    menuLinkSelector: s = "a",
                    submenuItemSelector: i = "",
                    submenuToggleSelector: n = "a",
                    submenuSelector: r = "ul",
                    controllerElement: a = null,
                    containerElement: o = null,
                    openClass: l = "show",
                    closeClass: c = "hide",
                    isTopLevel: h = !0,
                    parentMenu: u = null,
                    hoverType: d = "off",
                    hoverDelay: p = 250
                }) {
                    this._dom.menu = t, this._dom.controller = a, this._dom.container = o, this._selectors.menuItems = e, this._selectors.menuLinks = s, this._selectors.submenuItems = i, this._selectors.submenuToggles = n, this._selectors.submenus = r, this._elements.menuItems = [], this._elements.submenuToggles = [], this._elements.controller = null, this._elements.parentMenu = u, this._elements.rootMenu = h ? this : null, this._openClass = l || "", this._closeClass = c || "", this._root = h, this._hoverType = d, this._hoverDelay = p
                }
                initialize() {
                    if (!this._validate()) throw new Error("AccesibleMenu: cannot initialize menu. See other error messages for more information.");
                    if (null === this.elements.rootMenu && this._findRootMenu(this), this._setDOMElements(), this.isTopLevel && this.dom.controller && this.dom.container) {
                        const t = new this._MenuToggleType({
                            menuToggleElement: this.dom.controller,
                            parentElement: this.dom.container,
                            controlledMenu: this
                        });
                        this._elements.controller = t
                    }
                    this._createChildElements()
                }
                get dom() {
                    return this._dom
                }
                get selectors() {
                    return this._selectors
                }
                get elements() {
                    return this._elements
                }
                get isTopLevel() {
                    return this._root
                }
                get openClass() {
                    return this.isTopLevel ? this._openClass : this.elements.rootMenu.openClass
                }
                get closeClass() {
                    return this.isTopLevel ? this._closeClass : this.elements.rootMenu.closeClass
                }
                get currentChild() {
                    return this._currentChild
                }
                get focusState() {
                    return this._focusState
                }
                get currentEvent() {
                    return this._currentEvent
                }
                get currentMenuItem() {
                    return this.elements.menuItems[this.currentChild]
                }
                get hoverType() {
                    return this._root ? this._hoverType : this.elements.rootMenu.hoverType
                }
                get hoverDelay() {
                    return this._root ? this._hoverDelay : this.elements.rootMenu.hoverDelay
                }
                get shouldFocus() {
                    let t = !1;
                    return "keyboard" !== this.currentEvent && "character" !== this.currentEvent || (t = !0), "mouse" === this.currentEvent && "dynamic" === this.hoverType && (t = !0), t
                }
                set openClass(t) {
                    o({
                        openClass: t
                    }), this._openClass !== t && (this._openClass = t)
                }
                set closeClass(t) {
                    o({
                        closeClass: t
                    }), this._closeClass !== t && (this._closeClass = t)
                }
                set currentChild(t) {
                    function e(t) {
                        if (["mouse", "character"].includes(t.currentEvent) && t.elements.parentMenu) {
                            let e = 0,
                                s = !1;
                            for (; !s && e < t.elements.parentMenu.elements.menuItems.length;) {
                                const i = t.elements.parentMenu.elements.menuItems[e];
                                i.isSubmenuItem && i.elements.toggle.elements.controlledMenu === t && (s = !0, t.elements.parentMenu.currentEvent = t.currentEvent, t.elements.parentMenu.currentChild = e), e++
                            }
                        }
                    }
                    r("number", {
                        value: t
                    }), t < -1 ? (this._currentChild = -1, e(this)) : t >= this.elements.menuItems.length ? (this._currentChild = this.elements.menuItems.length - 1, e(this)) : this.focusChild !== t && (this._currentChild = t, e(this))
                }
                set focusState(t) {
                    ! function(t) {
                        try {
                            if ("object" != typeof t) throw new TypeError(`AccessibleMenu: Values given to isValidState() must be inside of an object. ${typeof t} given.`);
                            const e = ["none", "self", "child"];
                            for (const s in t)
                                if (!e.includes(t[s])) throw new TypeError(`AccessibleMenu: ${s} must be one of the following values: ${e.join(", ")}. "${t[s]}" given.`);
                            return !0
                        } catch (t) {
                            return console.error(t), !1
                        }
                    }({
                        value: t
                    }), this._focusState !== t && (this._focusState = t), this.elements.submenuToggles.length > 0 && ("self" === t || "none" === t) && this.elements.submenuToggles.forEach((t => {
                        t.elements.controlledMenu.focusState = "none"
                    })), !this.elements.parentMenu || "self" !== t && "child" !== t || (this.elements.parentMenu.focusState = "child")
                }
                set currentEvent(t) {
                    ! function(t) {
                        try {
                            if ("object" != typeof t) throw new TypeError(`AccessibleMenu: Values given to isValidEvent() must be inside of an object. ${typeof t} given.`);
                            const e = ["none", "mouse", "keyboard", "character"];
                            for (const s in t)
                                if (!e.includes(t[s])) throw new TypeError(`AccessibleMenu: ${s} must be one of the following values: ${e.join(", ")}. "${t[s]}" given.`);
                            return !0
                        } catch (t) {
                            return console.error(t), !1
                        }
                    }({
                        value: t
                    }), this._currentEvent !== t && (this._currentEvent = t, this.elements.submenuToggles.length > 0 && this.elements.submenuToggles.forEach((e => {
                        e.elements.controlledMenu.currentEvent = t
                    })))
                }
                set hoverType(t) {
                    l({
                        value: t
                    }), this._hoverType !== t && (this._hoverType = t)
                }
                set hoverDelay(t) {
                    r("number", {
                        value: t
                    }), this._hoverDelay !== t && (this._hoverDelay = t)
                }
                _validate() {
                    let t = !0;
                    return null !== this._dom.container || null !== this._dom.controller ? n(HTMLElement, {
                        menuElement: this._dom.menu,
                        controllerElement: this._dom.controller,
                        containerElement: this._dom.container
                    }) || (t = !1) : n(HTMLElement, {
                        menuElement: this._dom.menu
                    }) || (t = !1), "" !== this._selectors.submenuItems ? a({
                        menuItemSelector: this._selectors.menuItems,
                        menuLinkSelector: this._selectors.menuLinks,
                        submenuItemSelector: this._selectors.submenuItems,
                        submenuToggleSelector: this._selectors.submenuToggles,
                        submenuSelector: this._selectors.submenus
                    }) || (t = !1) : a({
                        menuItemSelector: this._selectors.menuItems,
                        menuLinkSelector: this._selectors.menuLinks
                    }) || (t = !1), "" === this._openClass || o({
                        openClass: this._openClass
                    }) || (t = !1), "" === this._closeClass || o({
                        closeClass: this._closeClass
                    }) || (t = !1), r("boolean", {
                        isTopLevel: this._root
                    }) || (t = !1), null === this._elements.parentMenu || n(p, {
                        parentMenu: this._elements.parentMenu
                    }) || (t = !1), l({
                        hoverType: this._hoverType
                    }) || (t = !1), r("number", {
                        hoverDelay: this._hoverDelay
                    }) || (t = !1), t
                }
                _setDOMElementType(t, e = this.dom.menu, s = !0) {
                    if ("string" != typeof this.selectors[t]) throw new Error(`AccessibleMenu: "${t}" is not a valid element type within the menu.`); {
                        if (!Array.isArray(this.dom[t])) throw new Error(`AccessibleMenu: The "${t}" element cannot be set through _setDOMElementType.`);
                        e !== this.dom.menu && n(HTMLElement, {
                            base: e
                        });
                        const i = Array.from(e.querySelectorAll(this.selectors[t])).filter((t => t.parentElement === e));
                        this._dom[t] = s ? i : [...this._dom[t], ...i]
                    }
                }
                _resetDOMElementType(t) {
                    if (void 0 === this.dom[t]) throw new Error(`AccessibleMenu: "${t}" is not a valid element type within the menu.`);
                    if (!Array.isArray(this.dom[t])) throw new Error(`AccessibleMenu: The "${t}" element cannot be reset through _resetDOMElementType.`);
                    this._dom[t] = []
                }
                _setDOMElements() {
                    this._setDOMElementType("menuItems"), "" !== this.selectors.submenuItems && (this._setDOMElementType("submenuItems"), this._resetDOMElementType("submenuToggles"), this._resetDOMElementType("submenus"), this.dom.submenuItems.forEach((t => {
                        this._setDOMElementType("submenuToggles", t, !1), this._setDOMElementType("submenus", t, !1)
                    })))
                }
                _findRootMenu(t) {
                    if (t.isTopLevel) this._elements.rootMenu = t;
                    else {
                        if (null === t.elements.parentMenu) throw new Error("Cannot find root menu.");
                        this._findRootMenu(t.elements.parentMenu)
                    }
                }
                _createChildElements() {
                    this.dom.menuItems.forEach((t => {
                        let e;
                        if (this.dom.submenuItems.includes(t)) {
                            const s = t.querySelector(this.selectors.submenuToggles),
                                i = t.querySelector(this.selectors.submenus),
                                n = new this._MenuType({
                                    menuElement: i,
                                    menuItemSelector: this.selectors.menuItems,
                                    menuLinkSelector: this.selectors.menuLinks,
                                    submenuItemSelector: this.selectors.submenuItems,
                                    submenuToggleSelector: this.selectors.submenuToggles,
                                    submenuSelector: this.selectors.submenus,
                                    openClass: this.openClass,
                                    closeClass: this.closeClass,
                                    isTopLevel: !1,
                                    parentMenu: this,
                                    hoverType: this.hoverType,
                                    hoverDelay: this.hoverDelay
                                }),
                                r = new this._MenuToggleType({
                                    menuToggleElement: s,
                                    parentElement: t,
                                    controlledMenu: n,
                                    parentMenu: this
                                });
                            this._elements.submenuToggles.push(r), e = new this._MenuItemType({
                                menuItemElement: t,
                                menuLinkElement: s,
                                parentMenu: this,
                                isSubmenuItem: !0,
                                childMenu: n,
                                toggle: r
                            })
                        } else {
                            const s = t.querySelector(this.selectors.menuLinks);
                            e = new this._MenuItemType({
                                menuItemElement: t,
                                menuLinkElement: s,
                                parentMenu: this
                            })
                        }
                        this._elements.menuItems.push(e)
                    }))
                }
                _handleFocus() {
                    this.elements.menuItems.forEach(((t, e) => {
                        t.dom.link.addEventListener("focus", (() => {
                            this.focusState = "self", this.currentChild = e
                        }))
                    }))
                }
                _handleClick() {
                    function t(t, e, s) {
                        d(s), e.toggle(), e.isOpen && (t.focusState = "self", e.elements.controlledMenu.focusState = "none")
                    }
                    this.elements.menuItems.forEach(((e, s) => {
                        e.dom.link.addEventListener("pointerdown", (() => {
                            this.currentEvent = "mouse", this.elements.rootMenu.blurChildren(), this.focusChild(s)
                        }), {
                            passive: !0
                        }), e.isSubmenuItem && e.elements.toggle.dom.toggle.addEventListener("pointerup", (s => {
                            this.currentEvent = "mouse", t(this, e.elements.toggle, s)
                        }))
                    })), this.isTopLevel && this.elements.controller && this.elements.controller.dom.toggle.addEventListener("pointerup", (e => {
                        this.currentEvent = "mouse", t(this, this.elements.controller, e)
                    }))
                }
                _handleHover() {
                    this.elements.menuItems.forEach(((t, e) => {
                        t.dom.link.addEventListener("pointerenter", (s => {
                            if ("pen" !== s.pointerType && "touch" !== s.pointerType)
                                if ("on" === this.hoverType) this.currentEvent = "mouse", this.currentChild = e, t.isSubmenuItem && t.elements.toggle.preview();
                                else if ("dynamic" === this.hoverType) {
                                const s = this.elements.submenuToggles.some((t => t.isOpen));
                                this.currentChild = e, this.isTopLevel && "none" === this.focusState || (this.currentEvent = "mouse", this.focusCurrentChild()), !t.isSubmenuItem || this.isTopLevel && !s || (this.currentEvent = "mouse", t.elements.toggle.preview())
                            }
                        })), t.isSubmenuItem && t.dom.item.addEventListener("pointerleave", (e => {
                            "pen" !== e.pointerType && "touch" !== e.pointerType && ("on" === this.hoverType ? this.hoverDelay > 0 ? setTimeout((() => {
                                this.currentEvent = "mouse", t.elements.toggle.close()
                            }), this.hoverDelay) : (this.currentEvent = "mouse", t.elements.toggle.close()) : "dynamic" === this.hoverType && (this.isTopLevel || (this.hoverDelay > 0 ? setTimeout((() => {
                                this.currentEvent = "mouse", t.elements.toggle.close(), this.focusCurrentChild()
                            }), this.hoverDelay) : (this.currentEvent = "mouse", t.elements.toggle.close(), this.focusCurrentChild()))))
                        }))
                    }))
                }
                _handleKeydown() {
                    this.isTopLevel && this.elements.controller && this.elements.controller.dom.toggle.addEventListener("keydown", (t => {
                        this.currentEvent = "keyboard";
                        const e = u(t);
                        "Space" !== e && "Enter" !== e || d(t)
                    }))
                }
                _handleKeyup() {
                    this.isTopLevel && this.elements.controller && this.elements.controller.dom.toggle.addEventListener("keyup", (t => {
                        this.currentEvent = "keyboard";
                        const e = u(t);
                        "Space" !== e && "Enter" !== e || (d(t), this.elements.controller.toggle(), this.elements.controller.isOpen && this.focusFirstChild())
                    }))
                }
                focus() {
                    this.focusState = "self", this.shouldFocus && this.dom.menu.focus()
                }
                blur() {
                    this.focusState = "none", this.shouldFocus && this.dom.menu.blur()
                }
                focusCurrentChild() {
                    this.focusState = "self", -1 !== this.currentChild && this.currentMenuItem.focus()
                }
                focusChild(t) {
                    this.blurCurrentChild(), this.currentChild = t, this.focusCurrentChild()
                }
                focusFirstChild() {
                    this.focusChild(0)
                }
                focusLastChild() {
                    this.focusChild(this.elements.menuItems.length - 1)
                }
                focusNextChild() {
                    this.currentChild < this.elements.menuItems.length - 1 ? this.focusChild(this.currentChild + 1) : this.focusCurrentChild()
                }
                focusPreviousChild() {
                    this.currentChild > 0 ? this.focusChild(this.currentChild - 1) : this.focusCurrentChild()
                }
                blurCurrentChild() {
                    this.focusState = "none", -1 !== this.currentChild && this.currentMenuItem.blur()
                }
                focusController() {
                    this.dom.controller && (this.shouldFocus && this.dom.controller.focus(), this.focusState = "none")
                }
                focusContainer() {
                    this.dom.container && (this.shouldFocus && this.dom.container.focus(), this.focusState = "none")
                }
                closeChildren() {
                    this.elements.submenuToggles.forEach((t => t.close()))
                }
                blurChildren() {
                    this.elements.menuItems.forEach((t => {
                        t.blur(), t.isSubmenuItem && t.elements.childMenu.blurChildren()
                    }))
                }
            }
            const f = p;
            const m = class extends h {
                constructor({
                    menuItemElement: t,
                    menuLinkElement: e,
                    parentMenu: s,
                    isSubmenuItem: i = !1,
                    childMenu: n = null,
                    toggle: r = null,
                    initialize: a = !0
                }) {
                    super({
                        menuItemElement: t,
                        menuLinkElement: e,
                        parentMenu: s,
                        isSubmenuItem: i,
                        childMenu: n,
                        toggle: r
                    }), a && this.initialize()
                }
            };
            const g = class extends c {
                constructor({
                    menuToggleElement: t,
                    parentElement: e,
                    controlledMenu: s,
                    parentMenu: i = null,
                    initialize: n = !0
                }) {
                    super({
                        menuToggleElement: t,
                        parentElement: e,
                        controlledMenu: s,
                        parentMenu: i
                    }), n && this.initialize()
                }
                open() {
                    this.closeSiblings(), super.open()
                }
                preview() {
                    this.closeSiblings(), super.preview()
                }
                close() {
                    this.isOpen && this.closeChildren(), super.close()
                }
            };
            class v extends f {
                _MenuType = v;
                _MenuItemType = m;
                _MenuToggleType = g;
                _currentChild = -1;
                _optionalSupport = !1;
                constructor({
                    menuElement: t,
                    menuItemSelector: e = "li",
                    menuLinkSelector: s = "a",
                    submenuItemSelector: i = "",
                    submenuToggleSelector: n = "a",
                    submenuSelector: r = "ul",
                    controllerElement: a = null,
                    containerElement: o = null,
                    openClass: l = "show",
                    closeClass: c = "hide",
                    isTopLevel: h = !0,
                    parentMenu: u = null,
                    hoverType: d = "off",
                    hoverDelay: p = 250,
                    optionalKeySupport: f = !1,
                    initialize: m = !0
                }) {
                    super({
                        menuElement: t,
                        menuItemSelector: e,
                        menuLinkSelector: s,
                        submenuItemSelector: i,
                        submenuToggleSelector: n,
                        submenuSelector: r,
                        controllerElement: a,
                        containerElement: o,
                        openClass: l,
                        closeClass: c,
                        isTopLevel: h,
                        parentMenu: u,
                        hoverType: d,
                        hoverDelay: p
                    }), this._optionalSupport = f, m && this.initialize()
                }
                initialize() {
                    try {
                        super.initialize(), this._handleFocus(), this._handleClick(), this._handleHover(), this._handleKeydown(), this._handleKeyup()
                    } catch (t) {
                        console.error(t)
                    }
                }
                get optionalKeySupport() {
                    return this.isTopLevel ? this._optionalSupport : this.elements.rootMenu.optionalKeySupport
                }
                set optionalKeySupport(t) {
                    r("boolean", {
                        optionalKeySupport: t
                    }), this._optionalSupport = t
                }
                _validate() {
                    let t = super._validate();
                    return r("boolean", {
                        optionalKeySupport: this._optionalSupport
                    }) || (t = !1), t
                }
                _handleClick() {
                    super._handleClick(), document.addEventListener("pointerup", (t => {
                        "none" !== this.focusState && (this.currentEvent = "mouse", this.dom.menu.contains(t.target) || !this.dom.menu === t.target || (this.closeChildren(), this.blur(), this.elements.controller && this.elements.controller.close()))
                    }))
                }
                _handleKeydown() {
                    super._handleKeydown(), this.dom.menu.addEventListener("keydown", (t => {
                        this.currentEvent = "keyboard";
                        const e = u(t);
                        if ("self" === this.focusState) {
                            const s = ["Space", "Enter"],
                                i = ["Escape"],
                                n = ["Escape"];
                            if (this.optionalKeySupport) {
                                ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft", "Home", "End"].includes(e) && d(t)
                            } else(this.currentMenuItem.isSubmenuItem && s.includes(e) || this.elements.controller && i.includes(e) || this.elements.parentMenu && n.includes(e)) && d(t)
                        }
                    }))
                }
                _handleKeyup() {
                    super._handleKeyup(), this.dom.menu.addEventListener("keyup", (t => {
                        this.currentEvent = "keyboard";
                        const e = u(t);
                        if ("self" === this.focusState)
                            if ("Space" === e || "Enter" === e) this.currentMenuItem.isSubmenuItem ? (d(t), this.currentMenuItem.elements.toggle.isOpen ? this.currentMenuItem.elements.toggle.close() : this.currentMenuItem.elements.toggle.preview()) : this.currentMenuItem.dom.link.click();
                            else if ("Escape" === e) {
                            this.elements.submenuToggles.some((t => t.isOpen)) ? (d(t), this.closeChildren()) : this.elements.parentMenu ? (d(t), this.elements.parentMenu.currentEvent = this.currentEvent, this.elements.parentMenu.closeChildren(), this.elements.parentMenu.focusCurrentChild()) : this.isTopLevel && this.elements.controller && this.elements.controller.isOpen && (this.elements.controller.close(), this.focusController())
                        } else this.optionalKeySupport && ("ArrowDown" === e || "ArrowRight" === e ? (d(t), this.currentMenuItem.isSubmenuItem && this.currentMenuItem.elements.toggle.isOpen ? (this.currentMenuItem.elements.childMenu.currentEvent = "keyboard", this.currentMenuItem.elements.childMenu.focusFirstChild()) : this.focusNextChild()) : "ArrowUp" === e || "ArrowLeft" === e ? (d(t), this.focusPreviousChild()) : "Home" === e ? (d(t), this.focusFirstChild()) : "End" === e && (d(t), this.focusLastChild()))
                    }))
                }
            }
            const b = v;
            const y = b,
                w = "1440px",
                T = {
                    screens: {
                        xs: "414px",
                        mobile: {
                            max: "639px"
                        },
                        sm: "640px",
                        md: "768px",
                        lg: "1024px",
                        "nav-drawer": {
                            max: "1319px"
                        },
                        "nav-bar": "1320px",
                        xl: "1280px",
                        "2xl": "1440px",
                        mg: w,
                        lgvideo: "1441px",
                        cxl: {
                            max: "1919px",
                            min: "1440px"
                        },
                        "3xl": "1920px"
                    },
                    container: {
                        center: !0,
                        maxWidth: w,
                        padding: {
                            DEFAULT: "20px",
                            md: "32px",
                            lg: "48px",
                            xl: "64px"
                        }
                    }
                };
            class _ {
                static breakpoints = this.breakpointsFromScreens();
                constructor(t) {
                    if (this.currentSize = "default", this.queries = t, this.breakpoints = _.breakpoints, !t.hasOwnProperty("default")) throw "Queries object given to watch method must have a property called 'default'";
                    this.watch()
                }
                watch() {
                    this.currentSize = this.getSize(), this.runCallback(this.queries), window.addEventListener("resize", (() => {
                        let t = this.getSize();
                        t != this.currentSize && (this.currentSize = t, this.runCallback(this.queries))
                    }))
                }
                getSize() {
                    let t = "default";
                    for (const e in this.queries) window.matchMedia(this.breakpoints[e]).matches && (t = e);
                    return t
                }
                runCallback() {
                    if ("function" != typeof this.queries[this.currentSize]) throw `The property ${this.currentSize} must be of type function`;
                    this.queries[this.currentSize].call()
                }
                static isBreakpoint(t) {
                    return window.matchMedia(this.breakpoints[t]).matches
                }
                static breakpointsFromScreens() {
                    let t = {};
                    for (const [e, s] of Object.entries(T.screens)) {
                        let i = [];
                        if ("object" == typeof s)
                            for (const [t, e] of Object.entries(s)) i.push(`(${t}-width: ${e})`);
                        "string" == typeof s && i.push(`(min-width: ${s})`), t[e] = `screen and ${i.join(" and ")}`
                    }
                    return t
                }
            }
            const k = _;
            let x, S, E, $;
            const C = {
                    init() {
                        x = document.querySelector("header"), S = x.querySelector("nav ul.nav"), E = x.querySelector('[data-action="toggle-navigation"]'), $ = x.querySelectorAll(".menu-item"), E.addEventListener("click", P), M(S), new k({
                            default: () => {
                                S.menu.hoverType = "off"
                            },
                            "nav-bar": () => {
                                S.menu.hoverType = "on"
                            }
                        })
                    }
                },
                M = t => {
                    t.menu = new y({
                        menuElement: t,
                        menuItemSelector: ".menu-item",
                        menuLinkSelector: ".menu-item > a",
                        submenuItemSelector: ".menu-item-has-dropdown",
                        submenuToggleSelector: "[data-submenu-toggle]",
                        submenuSelector: "[data-submenu]",
                        openClass: "open",
                        hoverType: "on"
                    }), window.addEventListener("resize", (() => {
                        t.menu.elements.menuItems.forEach((t => {
                            null != t.dom.link && A(t)
                        }))
                    })), t.menu.elements.menuItems.forEach((t => {
                        null != t.dom.link && (A(t), t.dom.link.addEventListener("accessibleMenuExpand", (() => {
                            A(t), L(t), t.dom.item.querySelector(".mega-menu") && (document.body.classList.add("overlay-active", "alter-link-transition"), x.classList.add("white-fill"))
                        })), t.dom.link.addEventListener("accessibleMenuCollapse", (() => {
                            t.dom.item.querySelector(".mega-menu") && (document.body.classList.remove("overlay-active", "alter-link-transition"), x.classList.remove("white-fill"))
                        })))
                    }))
                },
                P = t => {
                    t = "boolean" == typeof t ? t : !x.classList.contains("nav-open"), x.classList.toggle("nav-open", t), document.querySelector("body").classList.toggle("no-scroll", t);
                    const e = E.querySelector(".toggle-label");
                    E.setAttribute("aria-label", t ? E.dataset.labelClose : E.dataset.labelOpen), E.setAttribute("aria-expanded", t), e.innerHTML = t ? e.dataset.labelClose : e.dataset.labelOpen
                },
                A = t => {
                    if (t.isSubmenuItem) {
                        const e = t.elements.childMenu.dom.menu;
                        e.style.removeProperty("--element-height"), e.style.setProperty("--element-height", `${e.scrollHeight}px`)
                    }
                },
                L = t => {
                    if (t._submenu && null != t.dom.item.children) {
                        if (t.dom.item.children[1].classList.contains("mega-menu")) return; {
                            const e = t._dom.item.children[1];
                            e.style.left = "50%";
                            const s = e.getBoundingClientRect(),
                                i = 24;
                            let n = 0;
                            const r = parseInt(window.innerWidth - s.right);
                            n = r - 2 * r - i, n = n > 0 ? "-" + n + "px" : i + "px", parseInt(n) > "-" + s.width / 2 ? r > parseInt(n) ? r > s.width / 2 ? e.style.left = "50%" : e.style.left = r - i > 0 ? 3 * i + "px" : "50%" : e.style.left = r < i && r > 0 ? r + i + "px" : n : e.style.left = "50%"
                        }
                    }
                };
            const O = class {
                constructor(t) {
                    this.accordion = t, this.initPanels()
                }
                initPanels() {
                    this.accordion.querySelectorAll("[aria-controls]").forEach((t => {
                        const e = this.findPanel(t);
                        t.addEventListener("click", (() => this.handlePanelToggle(t, e))), this.setPanelHeight(e)
                    })), window.addEventListener("resize", (() => {
                        this.accordion.querySelectorAll("[aria-controls][aria-expanded=true]").forEach((t => {
                            this.resizePanelHeight(this.findPanel(t))
                        }))
                    }))
                }
                findPanel(t) {
                    return this.accordion.querySelector("#" + t.getAttribute("aria-controls"))
                }
                handlePanelToggle(t, e) {
                    let s = "true" != t.getAttribute("aria-expanded");
                    t.setAttribute("aria-expanded", s), e.setAttribute("aria-hidden", !s), this.setPanelHeight(e)
                }
                setPanelHeight(t) {
                    let e = t.scrollHeight;
                    t.setAttribute("style", `--panel-height:${e}px`)
                }
                resizePanelHeight(t) {
                    t.removeAttribute("style"), this.setPanelHeight(t)
                }
            };
            const I = class {
                constructor(t) {
                    let e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "modal";
                    this.modalContainer = document.querySelector(`#${e}`), this.dataSlot = this.modalContainer.querySelector("[data-slot]"), this.toggle = t, this.detail = {
                        id: t.dataset.contentId,
                        state: ""
                    }, this.onOpenCallback = () => {}, this.onCloseCallback = () => {}, this.initModal()
                }
                initModal = () => {
                    this.toggle.addEventListener("click", this.openModal), this.modalContainer.addEventListener("click", this.handleModalClick)
                };
                handleModalClick = t => {
                    t.target.closest("[data-slot]") || this.closeModal()
                };
                openModal = () => {
                    if (this.modalContainer.dataset.contentFrom != this.detail.id) {
                        const t = document.getElementById(this.detail.id).innerHTML;
                        this.dataSlot.innerHTML = t, console.log(t), this.modalContainer.dataset.contentFrom = this.detail.id, this.detail.state = "replaced"
                    } else this.detail.state = "keep";
                    this.modalContainer.classList.add("is-open"), document.body.classList.add("no-scroll");
                    const t = new CustomEvent("modalopen", {
                        detail: this.detail
                    });
                    this.modalContainer.dispatchEvent(t), this.onOpenCallback()
                };
                closeModal = () => {
                    this.modalContainer.classList.remove("is-open"), document.body.classList.remove("no-scroll");
                    const t = new Event("modalclose", {
                        detail: this.detail
                    });
                    this.modalContainer.dispatchEvent(t), this.onCloseCallback()
                }
            };
            const q = class extends I {
                constructor(t) {
                    super(t), this.onOpenCallback = () => {
                        console.log("default modal opened, do something")
                    }
                }
            };
            var D = s("../node_modules/vidstack/prod/chunks/vidstack-B11i_cNc.js"),
                z = s("../node_modules/vidstack/prod/chunks/vidstack-BPJwxG0c.js"),
                V = s("../node_modules/vidstack/prod/chunks/vidstack-CUVgUi9M.js");
            class j extends((0, D.H)(HTMLElement, z.c)) {
                constructor() {
                    super(...arguments), this.G = null, this.Xm = null
                }
                static# t = this.tagName = "media-provider";
                onSetup() {
                    this.a = (0, V.u)(), this.setAttribute("keep-alive", "")
                }
                onDestroy() {
                    this.Xm ? .remove(), this.Xm = null, this.G ? .remove(), this.G = null
                }
                onConnect() {
                    (0, D.g)((() => {
                        const t = this.$state.loader(),
                            e = "youtube" === t ? .name,
                            s = "vimeo" === t ? .name,
                            i = e || s,
                            n = t ? "google-cast" === t ? .name ? this.kn() : i ? this.ln() : "audio" === t.mediaType() ? this.mn() : this.an() : null;
                        if (this.G !== n) {
                            const t = this.G ? .parentElement ? ? this;
                            this.G ? .remove(), this.G = n, n && t.prepend(n), i && n && (0, D.g)((() => {
                                const {
                                    nativeControls: t
                                } = this.a.$state, e = t();
                                e ? (this.Xm ? .remove(), this.Xm = null) : (this.Xm = this.querySelector(".vds-blocker") ? ? document.createElement("div"), this.Xm.classList.add("vds-blocker"), n.after(this.Xm)), (0, D.s)(n, "data-no-controls", !e)
                            }))
                        }
                        e ? n ? .classList.add("vds-youtube") : s && n ? .classList.add("vds-vimeo"), i || (this.Xm ? .remove(), this.Xm = null), this.load(n)
                    }))
                }
                mn() {
                    const t = this.G instanceof HTMLAudioElement ? this.G : document.createElement("audio");
                    (0, D.s)(t, "preload", "none"), (0, D.s)(t, "aria-hidden", "true");
                    const {
                        controls: e,
                        crossOrigin: s
                    } = this.a.$state;
                    return (0, D.g)((() => {
                        (0, D.s)(t, "controls", e()), (0, D.s)(t, "crossorigin", s())
                    })), t
                }
                an() {
                    const t = this.G instanceof HTMLVideoElement ? this.G : document.createElement("video"),
                        {
                            crossOrigin: e,
                            poster: s,
                            nativeControls: i
                        } = this.a.$state,
                        n = (0, D.o)((() => i() ? "true" : null)),
                        r = (0, D.o)((() => s() && i() ? s() : null));
                    return (0, D.g)((() => {
                        (0, D.s)(t, "controls", n()), (0, D.s)(t, "crossorigin", e()), (0, D.s)(t, "poster", r())
                    })), t
                }
                ln() {
                    const t = this.G instanceof HTMLIFrameElement ? this.G : document.createElement("iframe"),
                        {
                            nativeControls: e
                        } = this.a.$state;
                    return (0, D.g)((() => (0, D.s)(t, "tabindex", e() ? null : -1))), t
                }
                kn() {
                    if (this.G ? .classList.contains("vds-google-cast")) return this.G;
                    const t = document.createElement("div");
                    return t.classList.add("vds-google-cast"), s.e(336).then(s.bind(s, "../node_modules/vidstack/prod/chunks/vidstack-BP-l85ST.js")).then((e => {
                        let {
                            insertContent: s
                        } = e;
                        s(t, this.a.$state)
                    })), t
                }
            }
            class F extends((0, D.H)(HTMLElement, z.d)) {
                static# t = this.tagName = "media-player";
                static# e = this.attrs = {
                    autoPlay: "autoplay",
                    crossOrigin: "crossorigin",
                    playsInline: "playsinline",
                    preferNativeHLS: "prefer-native-hls",
                    minLiveDVRWindow: "min-live-dvr-window"
                }
            }(0, D.d)(F), (0, D.d)(j);
            var R = s("../node_modules/vidstack/prod/chunks/vidstack-NiSULkLR.js");
            class B {
                constructor(t) {
                    this.props = t, this.name = "plyr"
                }
                async load() {
                    await s.e(437).then(s.bind(s, "../node_modules/vidstack/prod/define/plyr-layout.js"))
                }
                create() {
                    const t = document.createElement("media-plyr-layout");
                    if (this.props)
                        for (const [e, s] of Object.entries(this.props)) t[e] = s;
                    return [t]
                }
            }
            const N = Symbol();
            class H {
                static async create(t) {
                    let {
                        target: e,
                        layout: i,
                        tracks: n,
                        ...r
                    } = t;
                    if ((0, D.i)(e) && (e = document.querySelector(e)), !(0, R.i)(e)) throw Error(`[vidstack] target must be of type \`HTMLElement\`, found \`${typeof e}\``);
                    let a, o = document.createElement("media-player"),
                        l = document.createElement("media-provider"),
                        c = !(0, z.i)(e) && !(0, z.a)(e) && !(0, z.b)(e);
                    if (o.setAttribute("keep-alive", ""), r.poster && "plyr" !== i ? .name) {
                        if (!customElements.get("media-poster")) {
                            const {
                                MediaPosterElement: t
                            } = await s.e(32).then(s.bind(s, "../node_modules/vidstack/prod/chunks/vidstack-CyVF_YzU.js"));
                            (0, D.d)(t)
                        }
                        const t = document.createElement("media-poster");
                        "vidstack" === i ? .name && t.classList.add("vds-poster"), l.append(t)
                    }
                    i && (e.removeAttribute("controls"), i[N] || (await i.load(), i[N] = !0), a = await i.create());
                    const h = e.getAttribute("title");
                    h && o.setAttribute("title", h);
                    const u = e.getAttribute("width"),
                        d = e.getAttribute("height");
                    (u || d) && (u && (o.style.width = u), d && (o.style.height = d), o.style.aspectRatio = "unset");
                    for (const t of e.attributes) {
                        const e = t.name.replace("data-", ""),
                            s = (0, D.k)(e);
                        if (s in o) o.setAttribute(e, t.value);
                        else if (a ? .length)
                            for (const i of a) s in i && i.setAttribute(e, t.value)
                    }
                    for (const [t, e] of Object.entries(r)) o[t] = e;
                    if (n)
                        for (const t of n) o.textTracks.add(t);
                    if (o.append(l), a)
                        for (const t of a) o.append(t);
                    if (c) e.append(o);
                    else {
                        for (const t of [...e.children]) l.append(t);
                        e.replaceWith(o)
                    }
                    return o
                }
            }
            const G = class {
                constructor(t) {
                    this.player = H.create({
                        target: t,
                        layout: new B({})
                    })
                }
                get = () => this.player
            };
            const W = class extends I {
                constructor(t) {
                    super(t), this.player, this.onOpenCallback = this.playVideo, this.onCloseCallback = this.pauseVideo
                }
                playVideo = async () => {
                    "replaced" == this.detail.state ? (this.player = await new G(this.dataSlot.querySelector(".embed-video")).get(), this.player.addEventListener("can-play", (() => {
                        this.player.play()
                    }))) : this.player.play()
                };
                pauseVideo = () => {
                    this.player.pause()
                }
            };
            const U = class {
                constructor(t) {
                    this.swiper = t, this.initLightBox(), t.swiper = this
                }
                initLightBox() {}
            };
            const Y = class {
                constructor(t) {
                    this.toggle = t, this.videoElement = document.getElementById(t.dataset.videoId), this.player, this.init()
                }
                init = () => {
                    this.toggle.addEventListener("click", this.playVideo)
                };
                playVideo = async () => {
                    this.videoElement && (this.toggle.closest(".video").querySelectorAll(".hide-on-play").forEach((t => t.classList.add("hidden"))), this.player = await new G(this.videoElement).get(), this.player.addEventListener("can-play", (() => {
                        this.player.play()
                    })))
                }
            };

            function X(t) {
                return null !== t && "object" == typeof t && "constructor" in t && t.constructor === Object
            }

            function Q(t, e) {
                void 0 === t && (t = {}), void 0 === e && (e = {}), Object.keys(e).forEach((s => {
                    void 0 === t[s] ? t[s] = e[s] : X(e[s]) && X(t[s]) && Object.keys(e[s]).length > 0 && Q(t[s], e[s])
                }))
            }
            const K = {
                body: {},
                addEventListener() {},
                removeEventListener() {},
                activeElement: {
                    blur() {},
                    nodeName: ""
                },
                querySelector: () => null,
                querySelectorAll: () => [],
                getElementById: () => null,
                createEvent: () => ({
                    initEvent() {}
                }),
                createElement: () => ({
                    children: [],
                    childNodes: [],
                    style: {},
                    setAttribute() {},
                    getElementsByTagName: () => []
                }),
                createElementNS: () => ({}),
                importNode: () => null,
                location: {
                    hash: "",
                    host: "",
                    hostname: "",
                    href: "",
                    origin: "",
                    pathname: "",
                    protocol: "",
                    search: ""
                }
            };

            function J() {
                const t = "undefined" != typeof document ? document : {};
                return Q(t, K), t
            }
            const Z = {
                document: K,
                navigator: {
                    userAgent: ""
                },
                location: {
                    hash: "",
                    host: "",
                    hostname: "",
                    href: "",
                    origin: "",
                    pathname: "",
                    protocol: "",
                    search: ""
                },
                history: {
                    replaceState() {},
                    pushState() {},
                    go() {},
                    back() {}
                },
                CustomEvent: function() {
                    return this
                },
                addEventListener() {},
                removeEventListener() {},
                getComputedStyle: () => ({
                    getPropertyValue: () => ""
                }),
                Image() {},
                Date() {},
                screen: {},
                setTimeout() {},
                clearTimeout() {},
                matchMedia: () => ({}),
                requestAnimationFrame: t => "undefined" == typeof setTimeout ? (t(), null) : setTimeout(t, 0),
                cancelAnimationFrame(t) {
                    "undefined" != typeof setTimeout && clearTimeout(t)
                }
            };

            function tt() {
                const t = "undefined" != typeof window ? window : {};
                return Q(t, Z), t
            }

            function et(t, e) {
                return void 0 === e && (e = 0), setTimeout(t, e)
            }

            function st() {
                return Date.now()
            }

            function it(t, e) {
                void 0 === e && (e = "x");
                const s = tt();
                let i, n, r;
                const a = function(t) {
                    const e = tt();
                    let s;
                    return e.getComputedStyle && (s = e.getComputedStyle(t, null)), !s && t.currentStyle && (s = t.currentStyle), s || (s = t.style), s
                }(t);
                return s.WebKitCSSMatrix ? (n = a.transform || a.webkitTransform, n.split(",").length > 6 && (n = n.split(", ").map((t => t.replace(",", "."))).join(", ")), r = new s.WebKitCSSMatrix("none" === n ? "" : n)) : (r = a.MozTransform || a.OTransform || a.MsTransform || a.msTransform || a.transform || a.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,"), i = r.toString().split(",")), "x" === e && (n = s.WebKitCSSMatrix ? r.m41 : 16 === i.length ? parseFloat(i[12]) : parseFloat(i[4])), "y" === e && (n = s.WebKitCSSMatrix ? r.m42 : 16 === i.length ? parseFloat(i[13]) : parseFloat(i[5])), n || 0
            }

            function nt(t) {
                return "object" == typeof t && null !== t && t.constructor && "Object" === Object.prototype.toString.call(t).slice(8, -1)
            }

            function rt() {
                const t = Object(arguments.length <= 0 ? void 0 : arguments[0]),
                    e = ["__proto__", "constructor", "prototype"];
                for (let i = 1; i < arguments.length; i += 1) {
                    const n = i < 0 || arguments.length <= i ? void 0 : arguments[i];
                    if (null != n && (s = n, !("undefined" != typeof window && void 0 !== window.HTMLElement ? s instanceof HTMLElement : s && (1 === s.nodeType || 11 === s.nodeType)))) {
                        const s = Object.keys(Object(n)).filter((t => e.indexOf(t) < 0));
                        for (let e = 0, i = s.length; e < i; e += 1) {
                            const i = s[e],
                                r = Object.getOwnPropertyDescriptor(n, i);
                            void 0 !== r && r.enumerable && (nt(t[i]) && nt(n[i]) ? n[i].__swiper__ ? t[i] = n[i] : rt(t[i], n[i]) : !nt(t[i]) && nt(n[i]) ? (t[i] = {}, n[i].__swiper__ ? t[i] = n[i] : rt(t[i], n[i])) : t[i] = n[i])
                        }
                    }
                }
                var s;
                return t
            }

            function at(t, e, s) {
                t.style.setProperty(e, s)
            }

            function ot(t) {
                let {
                    swiper: e,
                    targetPosition: s,
                    side: i
                } = t;
                const n = tt(),
                    r = -e.translate;
                let a, o = null;
                const l = e.params.speed;
                e.wrapperEl.style.scrollSnapType = "none", n.cancelAnimationFrame(e.cssModeFrameID);
                const c = s > r ? "next" : "prev",
                    h = (t, e) => "next" === c && t >= e || "prev" === c && t <= e,
                    u = () => {
                        a = (new Date).getTime(), null === o && (o = a);
                        const t = Math.max(Math.min((a - o) / l, 1), 0),
                            c = .5 - Math.cos(t * Math.PI) / 2;
                        let d = r + c * (s - r);
                        if (h(d, s) && (d = s), e.wrapperEl.scrollTo({
                                [i]: d
                            }), h(d, s)) return e.wrapperEl.style.overflow = "hidden", e.wrapperEl.style.scrollSnapType = "", setTimeout((() => {
                            e.wrapperEl.style.overflow = "", e.wrapperEl.scrollTo({
                                [i]: d
                            })
                        })), void n.cancelAnimationFrame(e.cssModeFrameID);
                        e.cssModeFrameID = n.requestAnimationFrame(u)
                    };
                u()
            }

            function lt(t, e) {
                void 0 === e && (e = "");
                const s = [...t.children];
                return t instanceof HTMLSlotElement && s.push(...t.assignedElements()), e ? s.filter((t => t.matches(e))) : s
            }

            function ct(t) {
                try {
                    return void console.warn(t)
                } catch (t) {}
            }

            function ht(t, e) {
                void 0 === e && (e = []);
                const s = document.createElement(t);
                return s.classList.add(...Array.isArray(e) ? e : function(t) {
                    return void 0 === t && (t = ""), t.trim().split(" ").filter((t => !!t.trim()))
                }(e)), s
            }

            function ut(t, e) {
                return tt().getComputedStyle(t, null).getPropertyValue(e)
            }

            function dt(t) {
                let e, s = t;
                if (s) {
                    for (e = 0; null !== (s = s.previousSibling);) 1 === s.nodeType && (e += 1);
                    return e
                }
            }

            function pt(t, e) {
                const s = [];
                let i = t.parentElement;
                for (; i;) e ? i.matches(e) && s.push(i) : s.push(i), i = i.parentElement;
                return s
            }

            function ft(t, e, s) {
                const i = tt();
                return s ? t["width" === e ? "offsetWidth" : "offsetHeight"] + parseFloat(i.getComputedStyle(t, null).getPropertyValue("width" === e ? "margin-right" : "margin-top")) + parseFloat(i.getComputedStyle(t, null).getPropertyValue("width" === e ? "margin-left" : "margin-bottom")) : t.offsetWidth
            }

            function mt(t) {
                return (Array.isArray(t) ? t : [t]).filter((t => !!t))
            }

            function gt(t, e, s, i) {
                return t.params.createElements && Object.keys(i).forEach((n => {
                    if (!s[n] && !0 === s.auto) {
                        let r = lt(t.el, `.${i[n]}`)[0];
                        r || (r = ht("div", i[n]), r.className = i[n], t.el.append(r)), s[n] = r, e[n] = r
                    }
                })), s
            }

            function vt(t) {
                let {
                    swiper: e,
                    extendParams: s,
                    on: i,
                    emit: n
                } = t;

                function r(t) {
                    let s;
                    return t && "string" == typeof t && e.isElement && (s = e.el.querySelector(t) || e.hostEl.querySelector(t), s) ? s : (t && ("string" == typeof t && (s = [...document.querySelectorAll(t)]), e.params.uniqueNavElements && "string" == typeof t && s && s.length > 1 && 1 === e.el.querySelectorAll(t).length ? s = e.el.querySelector(t) : s && 1 === s.length && (s = s[0])), t && !s ? t : s)
                }

                function a(t, s) {
                    const i = e.params.navigation;
                    (t = mt(t)).forEach((t => {
                        t && (t.classList[s ? "add" : "remove"](...i.disabledClass.split(" ")), "BUTTON" === t.tagName && (t.disabled = s), e.params.watchOverflow && e.enabled && t.classList[e.isLocked ? "add" : "remove"](i.lockClass))
                    }))
                }

                function o() {
                    const {
                        nextEl: t,
                        prevEl: s
                    } = e.navigation;
                    if (e.params.loop) return a(s, !1), void a(t, !1);
                    a(s, e.isBeginning && !e.params.rewind), a(t, e.isEnd && !e.params.rewind)
                }

                function l(t) {
                    t.preventDefault(), (!e.isBeginning || e.params.loop || e.params.rewind) && (e.slidePrev(), n("navigationPrev"))
                }

                function c(t) {
                    t.preventDefault(), (!e.isEnd || e.params.loop || e.params.rewind) && (e.slideNext(), n("navigationNext"))
                }

                function h() {
                    const t = e.params.navigation;
                    if (e.params.navigation = gt(e, e.originalParams.navigation, e.params.navigation, {
                            nextEl: "swiper-button-next",
                            prevEl: "swiper-button-prev"
                        }), !t.nextEl && !t.prevEl) return;
                    let s = r(t.nextEl),
                        i = r(t.prevEl);
                    Object.assign(e.navigation, {
                        nextEl: s,
                        prevEl: i
                    }), s = mt(s), i = mt(i);
                    const n = (s, i) => {
                        s && s.addEventListener("click", "next" === i ? c : l), !e.enabled && s && s.classList.add(...t.lockClass.split(" "))
                    };
                    s.forEach((t => n(t, "next"))), i.forEach((t => n(t, "prev")))
                }

                function u() {
                    let {
                        nextEl: t,
                        prevEl: s
                    } = e.navigation;
                    t = mt(t), s = mt(s);
                    const i = (t, s) => {
                        t.removeEventListener("click", "next" === s ? c : l), t.classList.remove(...e.params.navigation.disabledClass.split(" "))
                    };
                    t.forEach((t => i(t, "next"))), s.forEach((t => i(t, "prev")))
                }
                s({
                    navigation: {
                        nextEl: null,
                        prevEl: null,
                        hideOnClick: !1,
                        disabledClass: "swiper-button-disabled",
                        hiddenClass: "swiper-button-hidden",
                        lockClass: "swiper-button-lock",
                        navigationDisabledClass: "swiper-navigation-disabled"
                    }
                }), e.navigation = {
                    nextEl: null,
                    prevEl: null
                }, i("init", (() => {
                    !1 === e.params.navigation.enabled ? d() : (h(), o())
                })), i("toEdge fromEdge lock unlock", (() => {
                    o()
                })), i("destroy", (() => {
                    u()
                })), i("enable disable", (() => {
                    let {
                        nextEl: t,
                        prevEl: s
                    } = e.navigation;
                    t = mt(t), s = mt(s), e.enabled ? o() : [...t, ...s].filter((t => !!t)).forEach((t => t.classList.add(e.params.navigation.lockClass)))
                })), i("click", ((t, s) => {
                    let {
                        nextEl: i,
                        prevEl: r
                    } = e.navigation;
                    i = mt(i), r = mt(r);
                    const a = s.target;
                    let o = r.includes(a) || i.includes(a);
                    if (e.isElement && !o) {
                        const t = s.path || s.composedPath && s.composedPath();
                        t && (o = t.find((t => i.includes(t) || r.includes(t))))
                    }
                    if (e.params.navigation.hideOnClick && !o) {
                        if (e.pagination && e.params.pagination && e.params.pagination.clickable && (e.pagination.el === a || e.pagination.el.contains(a))) return;
                        let t;
                        i.length ? t = i[0].classList.contains(e.params.navigation.hiddenClass) : r.length && (t = r[0].classList.contains(e.params.navigation.hiddenClass)), n(!0 === t ? "navigationShow" : "navigationHide"), [...i, ...r].filter((t => !!t)).forEach((t => t.classList.toggle(e.params.navigation.hiddenClass)))
                    }
                }));
                const d = () => {
                    e.el.classList.add(...e.params.navigation.navigationDisabledClass.split(" ")), u()
                };
                Object.assign(e.navigation, {
                    enable: () => {
                        e.el.classList.remove(...e.params.navigation.navigationDisabledClass.split(" ")), h(), o()
                    },
                    disable: d,
                    update: o,
                    init: h,
                    destroy: u
                })
            }

            function bt(t) {
                return void 0 === t && (t = ""), `.${t.trim().replace(/([\.:!+\/])/g,"\\$1").replace(/ /g,".")}`
            }

            function yt(t) {
                let {
                    swiper: e,
                    extendParams: s,
                    on: i,
                    emit: n
                } = t;
                const r = "swiper-pagination";
                let a;
                s({
                    pagination: {
                        el: null,
                        bulletElement: "span",
                        clickable: !1,
                        hideOnClick: !1,
                        renderBullet: null,
                        renderProgressbar: null,
                        renderFraction: null,
                        renderCustom: null,
                        progressbarOpposite: !1,
                        type: "bullets",
                        dynamicBullets: !1,
                        dynamicMainBullets: 1,
                        formatFractionCurrent: t => t,
                        formatFractionTotal: t => t,
                        bulletClass: `${r}-bullet`,
                        bulletActiveClass: `${r}-bullet-active`,
                        modifierClass: `${r}-`,
                        currentClass: `${r}-current`,
                        totalClass: `${r}-total`,
                        hiddenClass: `${r}-hidden`,
                        progressbarFillClass: `${r}-progressbar-fill`,
                        progressbarOppositeClass: `${r}-progressbar-opposite`,
                        clickableClass: `${r}-clickable`,
                        lockClass: `${r}-lock`,
                        horizontalClass: `${r}-horizontal`,
                        verticalClass: `${r}-vertical`,
                        paginationDisabledClass: `${r}-disabled`
                    }
                }), e.pagination = {
                    el: null,
                    bullets: []
                };
                let o = 0;

                function l() {
                    return !e.params.pagination.el || !e.pagination.el || Array.isArray(e.pagination.el) && 0 === e.pagination.el.length
                }

                function c(t, s) {
                    const {
                        bulletActiveClass: i
                    } = e.params.pagination;
                    t && (t = t[("prev" === s ? "previous" : "next") + "ElementSibling"]) && (t.classList.add(`${i}-${s}`), (t = t[("prev" === s ? "previous" : "next") + "ElementSibling"]) && t.classList.add(`${i}-${s}-${s}`))
                }

                function h(t) {
                    const s = t.target.closest(bt(e.params.pagination.bulletClass));
                    if (!s) return;
                    t.preventDefault();
                    const i = dt(s) * e.params.slidesPerGroup;
                    if (e.params.loop) {
                        if (e.realIndex === i) return;
                        const t = (n = e.realIndex, r = i, a = e.slides.length, (r %= a) == 1 + (n %= a) ? "next" : r === n - 1 ? "previous" : void 0);
                        "next" === t ? e.slideNext() : "previous" === t ? e.slidePrev() : e.slideToLoop(i)
                    } else e.slideTo(i);
                    var n, r, a
                }

                function u() {
                    const t = e.rtl,
                        s = e.params.pagination;
                    if (l()) return;
                    let i, r, h = e.pagination.el;
                    h = mt(h);
                    const u = e.virtual && e.params.virtual.enabled ? e.virtual.slides.length : e.slides.length,
                        d = e.params.loop ? Math.ceil(u / e.params.slidesPerGroup) : e.snapGrid.length;
                    if (e.params.loop ? (r = e.previousRealIndex || 0, i = e.params.slidesPerGroup > 1 ? Math.floor(e.realIndex / e.params.slidesPerGroup) : e.realIndex) : void 0 !== e.snapIndex ? (i = e.snapIndex, r = e.previousSnapIndex) : (r = e.previousIndex || 0, i = e.activeIndex || 0), "bullets" === s.type && e.pagination.bullets && e.pagination.bullets.length > 0) {
                        const n = e.pagination.bullets;
                        let l, u, d;
                        if (s.dynamicBullets && (a = ft(n[0], e.isHorizontal() ? "width" : "height", !0), h.forEach((t => {
                                t.style[e.isHorizontal() ? "width" : "height"] = a * (s.dynamicMainBullets + 4) + "px"
                            })), s.dynamicMainBullets > 1 && void 0 !== r && (o += i - (r || 0), o > s.dynamicMainBullets - 1 ? o = s.dynamicMainBullets - 1 : o < 0 && (o = 0)), l = Math.max(i - o, 0), u = l + (Math.min(n.length, s.dynamicMainBullets) - 1), d = (u + l) / 2), n.forEach((t => {
                                const e = [...["", "-next", "-next-next", "-prev", "-prev-prev", "-main"].map((t => `${s.bulletActiveClass}${t}`))].map((t => "string" == typeof t && t.includes(" ") ? t.split(" ") : t)).flat();
                                t.classList.remove(...e)
                            })), h.length > 1) n.forEach((t => {
                            const n = dt(t);
                            n === i ? t.classList.add(...s.bulletActiveClass.split(" ")) : e.isElement && t.setAttribute("part", "bullet"), s.dynamicBullets && (n >= l && n <= u && t.classList.add(...`${s.bulletActiveClass}-main`.split(" ")), n === l && c(t, "prev"), n === u && c(t, "next"))
                        }));
                        else {
                            const t = n[i];
                            if (t && t.classList.add(...s.bulletActiveClass.split(" ")), e.isElement && n.forEach(((t, e) => {
                                    t.setAttribute("part", e === i ? "bullet-active" : "bullet")
                                })), s.dynamicBullets) {
                                const t = n[l],
                                    e = n[u];
                                for (let t = l; t <= u; t += 1) n[t] && n[t].classList.add(...`${s.bulletActiveClass}-main`.split(" "));
                                c(t, "prev"), c(e, "next")
                            }
                        }
                        if (s.dynamicBullets) {
                            const i = Math.min(n.length, s.dynamicMainBullets + 4),
                                r = (a * i - a) / 2 - d * a,
                                o = t ? "right" : "left";
                            n.forEach((t => {
                                t.style[e.isHorizontal() ? o : "top"] = `${r}px`
                            }))
                        }
                    }
                    h.forEach(((t, r) => {
                        if ("fraction" === s.type && (t.querySelectorAll(bt(s.currentClass)).forEach((t => {
                                t.textContent = s.formatFractionCurrent(i + 1)
                            })), t.querySelectorAll(bt(s.totalClass)).forEach((t => {
                                t.textContent = s.formatFractionTotal(d)
                            }))), "progressbar" === s.type) {
                            let n;
                            n = s.progressbarOpposite ? e.isHorizontal() ? "vertical" : "horizontal" : e.isHorizontal() ? "horizontal" : "vertical";
                            const r = (i + 1) / d;
                            let a = 1,
                                o = 1;
                            "horizontal" === n ? a = r : o = r, t.querySelectorAll(bt(s.progressbarFillClass)).forEach((t => {
                                t.style.transform = `translate3d(0,0,0) scaleX(${a}) scaleY(${o})`, t.style.transitionDuration = `${e.params.speed}ms`
                            }))
                        }
                        "custom" === s.type && s.renderCustom ? (t.innerHTML = s.renderCustom(e, i + 1, d), 0 === r && n("paginationRender", t)) : (0 === r && n("paginationRender", t), n("paginationUpdate", t)), e.params.watchOverflow && e.enabled && t.classList[e.isLocked ? "add" : "remove"](s.lockClass)
                    }))
                }

                function d() {
                    const t = e.params.pagination;
                    if (l()) return;
                    const s = e.virtual && e.params.virtual.enabled ? e.virtual.slides.length : e.grid && e.params.grid.rows > 1 ? e.slides.length / Math.ceil(e.params.grid.rows) : e.slides.length;
                    let i = e.pagination.el;
                    i = mt(i);
                    let r = "";
                    if ("bullets" === t.type) {
                        let i = e.params.loop ? Math.ceil(s / e.params.slidesPerGroup) : e.snapGrid.length;
                        e.params.freeMode && e.params.freeMode.enabled && i > s && (i = s);
                        for (let s = 0; s < i; s += 1) t.renderBullet ? r += t.renderBullet.call(e, s, t.bulletClass) : r += `<${t.bulletElement} ${e.isElement?'part="bullet"':""} class="${t.bulletClass}"></${t.bulletElement}>`
                    }
                    "fraction" === t.type && (r = t.renderFraction ? t.renderFraction.call(e, t.currentClass, t.totalClass) : `<span class="${t.currentClass}"></span> / <span class="${t.totalClass}"></span>`), "progressbar" === t.type && (r = t.renderProgressbar ? t.renderProgressbar.call(e, t.progressbarFillClass) : `<span class="${t.progressbarFillClass}"></span>`), e.pagination.bullets = [], i.forEach((s => {
                        "custom" !== t.type && (s.innerHTML = r || ""), "bullets" === t.type && e.pagination.bullets.push(...s.querySelectorAll(bt(t.bulletClass)))
                    })), "custom" !== t.type && n("paginationRender", i[0])
                }

                function p() {
                    e.params.pagination = gt(e, e.originalParams.pagination, e.params.pagination, {
                        el: "swiper-pagination"
                    });
                    const t = e.params.pagination;
                    if (!t.el) return;
                    let s;
                    "string" == typeof t.el && e.isElement && (s = e.el.querySelector(t.el)), s || "string" != typeof t.el || (s = [...document.querySelectorAll(t.el)]), s || (s = t.el), s && 0 !== s.length && (e.params.uniqueNavElements && "string" == typeof t.el && Array.isArray(s) && s.length > 1 && (s = [...e.el.querySelectorAll(t.el)], s.length > 1 && (s = s.filter((t => pt(t, ".swiper")[0] === e.el))[0])), Array.isArray(s) && 1 === s.length && (s = s[0]), Object.assign(e.pagination, {
                        el: s
                    }), s = mt(s), s.forEach((s => {
                        "bullets" === t.type && t.clickable && s.classList.add(...(t.clickableClass || "").split(" ")), s.classList.add(t.modifierClass + t.type), s.classList.add(e.isHorizontal() ? t.horizontalClass : t.verticalClass), "bullets" === t.type && t.dynamicBullets && (s.classList.add(`${t.modifierClass}${t.type}-dynamic`), o = 0, t.dynamicMainBullets < 1 && (t.dynamicMainBullets = 1)), "progressbar" === t.type && t.progressbarOpposite && s.classList.add(t.progressbarOppositeClass), t.clickable && s.addEventListener("click", h), e.enabled || s.classList.add(t.lockClass)
                    })))
                }

                function f() {
                    const t = e.params.pagination;
                    if (l()) return;
                    let s = e.pagination.el;
                    s && (s = mt(s), s.forEach((s => {
                        s.classList.remove(t.hiddenClass), s.classList.remove(t.modifierClass + t.type), s.classList.remove(e.isHorizontal() ? t.horizontalClass : t.verticalClass), t.clickable && (s.classList.remove(...(t.clickableClass || "").split(" ")), s.removeEventListener("click", h))
                    }))), e.pagination.bullets && e.pagination.bullets.forEach((e => e.classList.remove(...t.bulletActiveClass.split(" "))))
                }
                i("changeDirection", (() => {
                    if (!e.pagination || !e.pagination.el) return;
                    const t = e.params.pagination;
                    let {
                        el: s
                    } = e.pagination;
                    s = mt(s), s.forEach((s => {
                        s.classList.remove(t.horizontalClass, t.verticalClass), s.classList.add(e.isHorizontal() ? t.horizontalClass : t.verticalClass)
                    }))
                })), i("init", (() => {
                    !1 === e.params.pagination.enabled ? m() : (p(), d(), u())
                })), i("activeIndexChange", (() => {
                    void 0 === e.snapIndex && u()
                })), i("snapIndexChange", (() => {
                    u()
                })), i("snapGridLengthChange", (() => {
                    d(), u()
                })), i("destroy", (() => {
                    f()
                })), i("enable disable", (() => {
                    let {
                        el: t
                    } = e.pagination;
                    t && (t = mt(t), t.forEach((t => t.classList[e.enabled ? "remove" : "add"](e.params.pagination.lockClass))))
                })), i("lock unlock", (() => {
                    u()
                })), i("click", ((t, s) => {
                    const i = s.target,
                        r = mt(e.pagination.el);
                    if (e.params.pagination.el && e.params.pagination.hideOnClick && r && r.length > 0 && !i.classList.contains(e.params.pagination.bulletClass)) {
                        if (e.navigation && (e.navigation.nextEl && i === e.navigation.nextEl || e.navigation.prevEl && i === e.navigation.prevEl)) return;
                        const t = r[0].classList.contains(e.params.pagination.hiddenClass);
                        n(!0 === t ? "paginationShow" : "paginationHide"), r.forEach((t => t.classList.toggle(e.params.pagination.hiddenClass)))
                    }
                }));
                const m = () => {
                    e.el.classList.add(e.params.pagination.paginationDisabledClass);
                    let {
                        el: t
                    } = e.pagination;
                    t && (t = mt(t), t.forEach((t => t.classList.add(e.params.pagination.paginationDisabledClass)))), f()
                };
                Object.assign(e.pagination, {
                    enable: () => {
                        e.el.classList.remove(e.params.pagination.paginationDisabledClass);
                        let {
                            el: t
                        } = e.pagination;
                        t && (t = mt(t), t.forEach((t => t.classList.remove(e.params.pagination.paginationDisabledClass)))), p(), d(), u()
                    },
                    disable: m,
                    render: d,
                    update: u,
                    init: p,
                    destroy: f
                })
            }

            function wt(t) {
                let e, s, {
                    swiper: i,
                    extendParams: n,
                    on: r,
                    emit: a,
                    params: o
                } = t;
                i.autoplay = {
                    running: !1,
                    paused: !1,
                    timeLeft: 0
                }, n({
                    autoplay: {
                        enabled: !1,
                        delay: 3e3,
                        waitForTransition: !0,
                        disableOnInteraction: !1,
                        stopOnLastSlide: !1,
                        reverseDirection: !1,
                        pauseOnMouseEnter: !1
                    }
                });
                let l, c, h, u, d, p, f, m, g = o && o.autoplay ? o.autoplay.delay : 3e3,
                    v = o && o.autoplay ? o.autoplay.delay : 3e3,
                    b = (new Date).getTime();

                function y(t) {
                    i && !i.destroyed && i.wrapperEl && t.target === i.wrapperEl && (i.wrapperEl.removeEventListener("transitionend", y), m || t.detail && t.detail.bySwiperTouchMove || S())
                }
                const w = () => {
                        if (i.destroyed || !i.autoplay.running) return;
                        i.autoplay.paused ? c = !0 : c && (v = l, c = !1);
                        const t = i.autoplay.paused ? l : b + v - (new Date).getTime();
                        i.autoplay.timeLeft = t, a("autoplayTimeLeft", t, t / g), s = requestAnimationFrame((() => {
                            w()
                        }))
                    },
                    T = t => {
                        if (i.destroyed || !i.autoplay.running) return;
                        cancelAnimationFrame(s), w();
                        let n = void 0 === t ? i.params.autoplay.delay : t;
                        g = i.params.autoplay.delay, v = i.params.autoplay.delay;
                        const r = (() => {
                            let t;
                            if (t = i.virtual && i.params.virtual.enabled ? i.slides.filter((t => t.classList.contains("swiper-slide-active")))[0] : i.slides[i.activeIndex], !t) return;
                            return parseInt(t.getAttribute("data-swiper-autoplay"), 10)
                        })();
                        !Number.isNaN(r) && r > 0 && void 0 === t && (n = r, g = r, v = r), l = n;
                        const o = i.params.speed,
                            c = () => {
                                i && !i.destroyed && (i.params.autoplay.reverseDirection ? !i.isBeginning || i.params.loop || i.params.rewind ? (i.slidePrev(o, !0, !0), a("autoplay")) : i.params.autoplay.stopOnLastSlide || (i.slideTo(i.slides.length - 1, o, !0, !0), a("autoplay")) : !i.isEnd || i.params.loop || i.params.rewind ? (i.slideNext(o, !0, !0), a("autoplay")) : i.params.autoplay.stopOnLastSlide || (i.slideTo(0, o, !0, !0), a("autoplay")), i.params.cssMode && (b = (new Date).getTime(), requestAnimationFrame((() => {
                                    T()
                                }))))
                            };
                        return n > 0 ? (clearTimeout(e), e = setTimeout((() => {
                            c()
                        }), n)) : requestAnimationFrame((() => {
                            c()
                        })), n
                    },
                    _ = () => {
                        b = (new Date).getTime(), i.autoplay.running = !0, T(), a("autoplayStart")
                    },
                    k = () => {
                        i.autoplay.running = !1, clearTimeout(e), cancelAnimationFrame(s), a("autoplayStop")
                    },
                    x = (t, s) => {
                        if (i.destroyed || !i.autoplay.running) return;
                        clearTimeout(e), t || (f = !0);
                        const n = () => {
                            a("autoplayPause"), i.params.autoplay.waitForTransition ? i.wrapperEl.addEventListener("transitionend", y) : S()
                        };
                        if (i.autoplay.paused = !0, s) return p && (l = i.params.autoplay.delay), p = !1, void n();
                        const r = l || i.params.autoplay.delay;
                        l = r - ((new Date).getTime() - b), i.isEnd && l < 0 && !i.params.loop || (l < 0 && (l = 0), n())
                    },
                    S = () => {
                        i.isEnd && l < 0 && !i.params.loop || i.destroyed || !i.autoplay.running || (b = (new Date).getTime(), f ? (f = !1, T(l)) : T(), i.autoplay.paused = !1, a("autoplayResume"))
                    },
                    E = () => {
                        if (i.destroyed || !i.autoplay.running) return;
                        const t = J();
                        "hidden" === t.visibilityState && (f = !0, x(!0)), "visible" === t.visibilityState && S()
                    },
                    $ = t => {
                        "mouse" === t.pointerType && (f = !0, m = !0, i.animating || i.autoplay.paused || x(!0))
                    },
                    C = t => {
                        "mouse" === t.pointerType && (m = !1, i.autoplay.paused && S())
                    };
                r("init", (() => {
                    i.params.autoplay.enabled && (i.params.autoplay.pauseOnMouseEnter && (i.el.addEventListener("pointerenter", $), i.el.addEventListener("pointerleave", C)), J().addEventListener("visibilitychange", E), _())
                })), r("destroy", (() => {
                    i.el && "string" != typeof i.el && (i.el.removeEventListener("pointerenter", $), i.el.removeEventListener("pointerleave", C)), J().removeEventListener("visibilitychange", E), i.autoplay.running && k()
                })), r("_freeModeStaticRelease", (() => {
                    (u || f) && S()
                })), r("_freeModeNoMomentumRelease", (() => {
                    i.params.autoplay.disableOnInteraction ? k() : x(!0, !0)
                })), r("beforeTransitionStart", ((t, e, s) => {
                    !i.destroyed && i.autoplay.running && (s || !i.params.autoplay.disableOnInteraction ? x(!0, !0) : k())
                })), r("sliderFirstMove", (() => {
                    !i.destroyed && i.autoplay.running && (i.params.autoplay.disableOnInteraction ? k() : (h = !0, u = !1, f = !1, d = setTimeout((() => {
                        f = !0, u = !0, x(!0)
                    }), 200)))
                })), r("touchEnd", (() => {
                    if (!i.destroyed && i.autoplay.running && h) {
                        if (clearTimeout(d), clearTimeout(e), i.params.autoplay.disableOnInteraction) return u = !1, void(h = !1);
                        u && i.params.cssMode && S(), u = !1, h = !1
                    }
                })), r("slideChange", (() => {
                    !i.destroyed && i.autoplay.running && (p = !0)
                })), Object.assign(i.autoplay, {
                    start: _,
                    stop: k,
                    pause: x,
                    resume: S
                })
            }
            let Tt, _t, kt;

            function xt() {
                return Tt || (Tt = function() {
                    const t = tt(),
                        e = J();
                    return {
                        smoothScroll: e.documentElement && e.documentElement.style && "scrollBehavior" in e.documentElement.style,
                        touch: !!("ontouchstart" in t || t.DocumentTouch && e instanceof t.DocumentTouch)
                    }
                }()), Tt
            }

            function St(t) {
                return void 0 === t && (t = {}), _t || (_t = function(t) {
                    let {
                        userAgent: e
                    } = void 0 === t ? {} : t;
                    const s = xt(),
                        i = tt(),
                        n = i.navigator.platform,
                        r = e || i.navigator.userAgent,
                        a = {
                            ios: !1,
                            android: !1
                        },
                        o = i.screen.width,
                        l = i.screen.height,
                        c = r.match(/(Android);?[\s\/]+([\d.]+)?/);
                    let h = r.match(/(iPad).*OS\s([\d_]+)/);
                    const u = r.match(/(iPod)(.*OS\s([\d_]+))?/),
                        d = !h && r.match(/(iPhone\sOS|iOS)\s([\d_]+)/),
                        p = "Win32" === n;
                    let f = "MacIntel" === n;
                    return !h && f && s.touch && ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"].indexOf(`${o}x${l}`) >= 0 && (h = r.match(/(Version)\/([\d.]+)/), h || (h = [0, 1, "13_0_0"]), f = !1), c && !p && (a.os = "android", a.android = !0), (h || d || u) && (a.os = "ios", a.ios = !0), a
                }(t)), _t
            }

            function Et() {
                return kt || (kt = function() {
                    const t = tt(),
                        e = St();
                    let s = !1;

                    function i() {
                        const e = t.navigator.userAgent.toLowerCase();
                        return e.indexOf("safari") >= 0 && e.indexOf("chrome") < 0 && e.indexOf("android") < 0
                    }
                    if (i()) {
                        const e = String(t.navigator.userAgent);
                        if (e.includes("Version/")) {
                            const [t, i] = e.split("Version/")[1].split(" ")[0].split(".").map((t => Number(t)));
                            s = t < 16 || 16 === t && i < 2
                        }
                    }
                    const n = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(t.navigator.userAgent),
                        r = i();
                    return {
                        isSafari: s || r,
                        needPerspectiveFix: s,
                        need3dFix: r || n && e.ios,
                        isWebView: n
                    }
                }()), kt
            }
            var $t = {
                on(t, e, s) {
                    const i = this;
                    if (!i.eventsListeners || i.destroyed) return i;
                    if ("function" != typeof e) return i;
                    const n = s ? "unshift" : "push";
                    return t.split(" ").forEach((t => {
                        i.eventsListeners[t] || (i.eventsListeners[t] = []), i.eventsListeners[t][n](e)
                    })), i
                },
                once(t, e, s) {
                    const i = this;
                    if (!i.eventsListeners || i.destroyed) return i;
                    if ("function" != typeof e) return i;

                    function n() {
                        i.off(t, n), n.__emitterProxy && delete n.__emitterProxy;
                        for (var s = arguments.length, r = new Array(s), a = 0; a < s; a++) r[a] = arguments[a];
                        e.apply(i, r)
                    }
                    return n.__emitterProxy = e, i.on(t, n, s)
                },
                onAny(t, e) {
                    const s = this;
                    if (!s.eventsListeners || s.destroyed) return s;
                    if ("function" != typeof t) return s;
                    const i = e ? "unshift" : "push";
                    return s.eventsAnyListeners.indexOf(t) < 0 && s.eventsAnyListeners[i](t), s
                },
                offAny(t) {
                    const e = this;
                    if (!e.eventsListeners || e.destroyed) return e;
                    if (!e.eventsAnyListeners) return e;
                    const s = e.eventsAnyListeners.indexOf(t);
                    return s >= 0 && e.eventsAnyListeners.splice(s, 1), e
                },
                off(t, e) {
                    const s = this;
                    return !s.eventsListeners || s.destroyed ? s : s.eventsListeners ? (t.split(" ").forEach((t => {
                        void 0 === e ? s.eventsListeners[t] = [] : s.eventsListeners[t] && s.eventsListeners[t].forEach(((i, n) => {
                            (i === e || i.__emitterProxy && i.__emitterProxy === e) && s.eventsListeners[t].splice(n, 1)
                        }))
                    })), s) : s
                },
                emit() {
                    const t = this;
                    if (!t.eventsListeners || t.destroyed) return t;
                    if (!t.eventsListeners) return t;
                    let e, s, i;
                    for (var n = arguments.length, r = new Array(n), a = 0; a < n; a++) r[a] = arguments[a];
                    "string" == typeof r[0] || Array.isArray(r[0]) ? (e = r[0], s = r.slice(1, r.length), i = t) : (e = r[0].events, s = r[0].data, i = r[0].context || t), s.unshift(i);
                    return (Array.isArray(e) ? e : e.split(" ")).forEach((e => {
                        t.eventsAnyListeners && t.eventsAnyListeners.length && t.eventsAnyListeners.forEach((t => {
                            t.apply(i, [e, ...s])
                        })), t.eventsListeners && t.eventsListeners[e] && t.eventsListeners[e].forEach((t => {
                            t.apply(i, s)
                        }))
                    })), t
                }
            };
            const Ct = (t, e, s) => {
                e && !t.classList.contains(s) ? t.classList.add(s) : !e && t.classList.contains(s) && t.classList.remove(s)
            };
            const Mt = (t, e, s) => {
                e && !t.classList.contains(s) ? t.classList.add(s) : !e && t.classList.contains(s) && t.classList.remove(s)
            };
            const Pt = (t, e) => {
                    if (!t || t.destroyed || !t.params) return;
                    const s = e.closest(t.isElement ? "swiper-slide" : `.${t.params.slideClass}`);
                    if (s) {
                        let e = s.querySelector(`.${t.params.lazyPreloaderClass}`);
                        !e && t.isElement && (s.shadowRoot ? e = s.shadowRoot.querySelector(`.${t.params.lazyPreloaderClass}`) : requestAnimationFrame((() => {
                            s.shadowRoot && (e = s.shadowRoot.querySelector(`.${t.params.lazyPreloaderClass}`), e && e.remove())
                        }))), e && e.remove()
                    }
                },
                At = (t, e) => {
                    if (!t.slides[e]) return;
                    const s = t.slides[e].querySelector('[loading="lazy"]');
                    s && s.removeAttribute("loading")
                },
                Lt = t => {
                    if (!t || t.destroyed || !t.params) return;
                    let e = t.params.lazyPreloadPrevNext;
                    const s = t.slides.length;
                    if (!s || !e || e < 0) return;
                    e = Math.min(e, s);
                    const i = "auto" === t.params.slidesPerView ? t.slidesPerViewDynamic() : Math.ceil(t.params.slidesPerView),
                        n = t.activeIndex;
                    if (t.params.grid && t.params.grid.rows > 1) {
                        const s = n,
                            r = [s - e];
                        return r.push(...Array.from({
                            length: e
                        }).map(((t, e) => s + i + e))), void t.slides.forEach(((e, s) => {
                            r.includes(e.column) && At(t, s)
                        }))
                    }
                    const r = n + i - 1;
                    if (t.params.rewind || t.params.loop)
                        for (let i = n - e; i <= r + e; i += 1) {
                            const e = (i % s + s) % s;
                            (e < n || e > r) && At(t, e)
                        } else
                            for (let i = Math.max(n - e, 0); i <= Math.min(r + e, s - 1); i += 1) i !== n && (i > r || i < n) && At(t, i)
                };
            var Ot = {
                updateSize: function() {
                    const t = this;
                    let e, s;
                    const i = t.el;
                    e = void 0 !== t.params.width && null !== t.params.width ? t.params.width : i.clientWidth, s = void 0 !== t.params.height && null !== t.params.height ? t.params.height : i.clientHeight, 0 === e && t.isHorizontal() || 0 === s && t.isVertical() || (e = e - parseInt(ut(i, "padding-left") || 0, 10) - parseInt(ut(i, "padding-right") || 0, 10), s = s - parseInt(ut(i, "padding-top") || 0, 10) - parseInt(ut(i, "padding-bottom") || 0, 10), Number.isNaN(e) && (e = 0), Number.isNaN(s) && (s = 0), Object.assign(t, {
                        width: e,
                        height: s,
                        size: t.isHorizontal() ? e : s
                    }))
                },
                updateSlides: function() {
                    const t = this;

                    function e(e, s) {
                        return parseFloat(e.getPropertyValue(t.getDirectionLabel(s)) || 0)
                    }
                    const s = t.params,
                        {
                            wrapperEl: i,
                            slidesEl: n,
                            size: r,
                            rtlTranslate: a,
                            wrongRTL: o
                        } = t,
                        l = t.virtual && s.virtual.enabled,
                        c = l ? t.virtual.slides.length : t.slides.length,
                        h = lt(n, `.${t.params.slideClass}, swiper-slide`),
                        u = l ? t.virtual.slides.length : h.length;
                    let d = [];
                    const p = [],
                        f = [];
                    let m = s.slidesOffsetBefore;
                    "function" == typeof m && (m = s.slidesOffsetBefore.call(t));
                    let g = s.slidesOffsetAfter;
                    "function" == typeof g && (g = s.slidesOffsetAfter.call(t));
                    const v = t.snapGrid.length,
                        b = t.slidesGrid.length;
                    let y = s.spaceBetween,
                        w = -m,
                        T = 0,
                        _ = 0;
                    if (void 0 === r) return;
                    "string" == typeof y && y.indexOf("%") >= 0 ? y = parseFloat(y.replace("%", "")) / 100 * r : "string" == typeof y && (y = parseFloat(y)), t.virtualSize = -y, h.forEach((t => {
                        a ? t.style.marginLeft = "" : t.style.marginRight = "", t.style.marginBottom = "", t.style.marginTop = ""
                    })), s.centeredSlides && s.cssMode && (at(i, "--swiper-centered-offset-before", ""), at(i, "--swiper-centered-offset-after", ""));
                    const k = s.grid && s.grid.rows > 1 && t.grid;
                    let x;
                    k ? t.grid.initSlides(h) : t.grid && t.grid.unsetSlides();
                    const S = "auto" === s.slidesPerView && s.breakpoints && Object.keys(s.breakpoints).filter((t => void 0 !== s.breakpoints[t].slidesPerView)).length > 0;
                    for (let i = 0; i < u; i += 1) {
                        let n;
                        if (x = 0, h[i] && (n = h[i]), k && t.grid.updateSlide(i, n, h), !h[i] || "none" !== ut(n, "display")) {
                            if ("auto" === s.slidesPerView) {
                                S && (h[i].style[t.getDirectionLabel("width")] = "");
                                const r = getComputedStyle(n),
                                    a = n.style.transform,
                                    o = n.style.webkitTransform;
                                if (a && (n.style.transform = "none"), o && (n.style.webkitTransform = "none"), s.roundLengths) x = t.isHorizontal() ? ft(n, "width", !0) : ft(n, "height", !0);
                                else {
                                    const t = e(r, "width"),
                                        s = e(r, "padding-left"),
                                        i = e(r, "padding-right"),
                                        a = e(r, "margin-left"),
                                        o = e(r, "margin-right"),
                                        l = r.getPropertyValue("box-sizing");
                                    if (l && "border-box" === l) x = t + a + o;
                                    else {
                                        const {
                                            clientWidth: e,
                                            offsetWidth: r
                                        } = n;
                                        x = t + s + i + a + o + (r - e)
                                    }
                                }
                                a && (n.style.transform = a), o && (n.style.webkitTransform = o), s.roundLengths && (x = Math.floor(x))
                            } else x = (r - (s.slidesPerView - 1) * y) / s.slidesPerView, s.roundLengths && (x = Math.floor(x)), h[i] && (h[i].style[t.getDirectionLabel("width")] = `${x}px`);
                            h[i] && (h[i].swiperSlideSize = x), f.push(x), s.centeredSlides ? (w = w + x / 2 + T / 2 + y, 0 === T && 0 !== i && (w = w - r / 2 - y), 0 === i && (w = w - r / 2 - y), Math.abs(w) < .001 && (w = 0), s.roundLengths && (w = Math.floor(w)), _ % s.slidesPerGroup == 0 && d.push(w), p.push(w)) : (s.roundLengths && (w = Math.floor(w)), (_ - Math.min(t.params.slidesPerGroupSkip, _)) % t.params.slidesPerGroup == 0 && d.push(w), p.push(w), w = w + x + y), t.virtualSize += x + y, T = x, _ += 1
                        }
                    }
                    if (t.virtualSize = Math.max(t.virtualSize, r) + g, a && o && ("slide" === s.effect || "coverflow" === s.effect) && (i.style.width = `${t.virtualSize+y}px`), s.setWrapperSize && (i.style[t.getDirectionLabel("width")] = `${t.virtualSize+y}px`), k && t.grid.updateWrapperSize(x, d), !s.centeredSlides) {
                        const e = [];
                        for (let i = 0; i < d.length; i += 1) {
                            let n = d[i];
                            s.roundLengths && (n = Math.floor(n)), d[i] <= t.virtualSize - r && e.push(n)
                        }
                        d = e, Math.floor(t.virtualSize - r) - Math.floor(d[d.length - 1]) > 1 && d.push(t.virtualSize - r)
                    }
                    if (l && s.loop) {
                        const e = f[0] + y;
                        if (s.slidesPerGroup > 1) {
                            const i = Math.ceil((t.virtual.slidesBefore + t.virtual.slidesAfter) / s.slidesPerGroup),
                                n = e * s.slidesPerGroup;
                            for (let t = 0; t < i; t += 1) d.push(d[d.length - 1] + n)
                        }
                        for (let i = 0; i < t.virtual.slidesBefore + t.virtual.slidesAfter; i += 1) 1 === s.slidesPerGroup && d.push(d[d.length - 1] + e), p.push(p[p.length - 1] + e), t.virtualSize += e
                    }
                    if (0 === d.length && (d = [0]), 0 !== y) {
                        const e = t.isHorizontal() && a ? "marginLeft" : t.getDirectionLabel("marginRight");
                        h.filter(((t, e) => !(s.cssMode && !s.loop) || e !== h.length - 1)).forEach((t => {
                            t.style[e] = `${y}px`
                        }))
                    }
                    if (s.centeredSlides && s.centeredSlidesBounds) {
                        let t = 0;
                        f.forEach((e => {
                            t += e + (y || 0)
                        })), t -= y;
                        const e = t > r ? t - r : 0;
                        d = d.map((t => t <= 0 ? -m : t > e ? e + g : t))
                    }
                    if (s.centerInsufficientSlides) {
                        let t = 0;
                        f.forEach((e => {
                            t += e + (y || 0)
                        })), t -= y;
                        const e = (s.slidesOffsetBefore || 0) + (s.slidesOffsetAfter || 0);
                        if (t + e < r) {
                            const s = (r - t - e) / 2;
                            d.forEach(((t, e) => {
                                d[e] = t - s
                            })), p.forEach(((t, e) => {
                                p[e] = t + s
                            }))
                        }
                    }
                    if (Object.assign(t, {
                            slides: h,
                            snapGrid: d,
                            slidesGrid: p,
                            slidesSizesGrid: f
                        }), s.centeredSlides && s.cssMode && !s.centeredSlidesBounds) {
                        at(i, "--swiper-centered-offset-before", -d[0] + "px"), at(i, "--swiper-centered-offset-after", t.size / 2 - f[f.length - 1] / 2 + "px");
                        const e = -t.snapGrid[0],
                            s = -t.slidesGrid[0];
                        t.snapGrid = t.snapGrid.map((t => t + e)), t.slidesGrid = t.slidesGrid.map((t => t + s))
                    }
                    if (u !== c && t.emit("slidesLengthChange"), d.length !== v && (t.params.watchOverflow && t.checkOverflow(), t.emit("snapGridLengthChange")), p.length !== b && t.emit("slidesGridLengthChange"), s.watchSlidesProgress && t.updateSlidesOffset(), t.emit("slidesUpdated"), !(l || s.cssMode || "slide" !== s.effect && "fade" !== s.effect)) {
                        const e = `${s.containerModifierClass}backface-hidden`,
                            i = t.el.classList.contains(e);
                        u <= s.maxBackfaceHiddenSlides ? i || t.el.classList.add(e) : i && t.el.classList.remove(e)
                    }
                },
                updateAutoHeight: function(t) {
                    const e = this,
                        s = [],
                        i = e.virtual && e.params.virtual.enabled;
                    let n, r = 0;
                    "number" == typeof t ? e.setTransition(t) : !0 === t && e.setTransition(e.params.speed);
                    const a = t => i ? e.slides[e.getSlideIndexByData(t)] : e.slides[t];
                    if ("auto" !== e.params.slidesPerView && e.params.slidesPerView > 1)
                        if (e.params.centeredSlides)(e.visibleSlides || []).forEach((t => {
                            s.push(t)
                        }));
                        else
                            for (n = 0; n < Math.ceil(e.params.slidesPerView); n += 1) {
                                const t = e.activeIndex + n;
                                if (t > e.slides.length && !i) break;
                                s.push(a(t))
                            } else s.push(a(e.activeIndex));
                    for (n = 0; n < s.length; n += 1)
                        if (void 0 !== s[n]) {
                            const t = s[n].offsetHeight;
                            r = t > r ? t : r
                        }(r || 0 === r) && (e.wrapperEl.style.height = `${r}px`)
                },
                updateSlidesOffset: function() {
                    const t = this,
                        e = t.slides,
                        s = t.isElement ? t.isHorizontal() ? t.wrapperEl.offsetLeft : t.wrapperEl.offsetTop : 0;
                    for (let i = 0; i < e.length; i += 1) e[i].swiperSlideOffset = (t.isHorizontal() ? e[i].offsetLeft : e[i].offsetTop) - s - t.cssOverflowAdjustment()
                },
                updateSlidesProgress: function(t) {
                    void 0 === t && (t = this && this.translate || 0);
                    const e = this,
                        s = e.params,
                        {
                            slides: i,
                            rtlTranslate: n,
                            snapGrid: r
                        } = e;
                    if (0 === i.length) return;
                    void 0 === i[0].swiperSlideOffset && e.updateSlidesOffset();
                    let a = -t;
                    n && (a = t), e.visibleSlidesIndexes = [], e.visibleSlides = [];
                    let o = s.spaceBetween;
                    "string" == typeof o && o.indexOf("%") >= 0 ? o = parseFloat(o.replace("%", "")) / 100 * e.size : "string" == typeof o && (o = parseFloat(o));
                    for (let t = 0; t < i.length; t += 1) {
                        const l = i[t];
                        let c = l.swiperSlideOffset;
                        s.cssMode && s.centeredSlides && (c -= i[0].swiperSlideOffset);
                        const h = (a + (s.centeredSlides ? e.minTranslate() : 0) - c) / (l.swiperSlideSize + o),
                            u = (a - r[0] + (s.centeredSlides ? e.minTranslate() : 0) - c) / (l.swiperSlideSize + o),
                            d = -(a - c),
                            p = d + e.slidesSizesGrid[t],
                            f = d >= 0 && d <= e.size - e.slidesSizesGrid[t],
                            m = d >= 0 && d < e.size - 1 || p > 1 && p <= e.size || d <= 0 && p >= e.size;
                        m && (e.visibleSlides.push(l), e.visibleSlidesIndexes.push(t)), Ct(l, m, s.slideVisibleClass), Ct(l, f, s.slideFullyVisibleClass), l.progress = n ? -h : h, l.originalProgress = n ? -u : u
                    }
                },
                updateProgress: function(t) {
                    const e = this;
                    if (void 0 === t) {
                        const s = e.rtlTranslate ? -1 : 1;
                        t = e && e.translate && e.translate * s || 0
                    }
                    const s = e.params,
                        i = e.maxTranslate() - e.minTranslate();
                    let {
                        progress: n,
                        isBeginning: r,
                        isEnd: a,
                        progressLoop: o
                    } = e;
                    const l = r,
                        c = a;
                    if (0 === i) n = 0, r = !0, a = !0;
                    else {
                        n = (t - e.minTranslate()) / i;
                        const s = Math.abs(t - e.minTranslate()) < 1,
                            o = Math.abs(t - e.maxTranslate()) < 1;
                        r = s || n <= 0, a = o || n >= 1, s && (n = 0), o && (n = 1)
                    }
                    if (s.loop) {
                        const s = e.getSlideIndexByData(0),
                            i = e.getSlideIndexByData(e.slides.length - 1),
                            n = e.slidesGrid[s],
                            r = e.slidesGrid[i],
                            a = e.slidesGrid[e.slidesGrid.length - 1],
                            l = Math.abs(t);
                        o = l >= n ? (l - n) / a : (l + a - r) / a, o > 1 && (o -= 1)
                    }
                    Object.assign(e, {
                        progress: n,
                        progressLoop: o,
                        isBeginning: r,
                        isEnd: a
                    }), (s.watchSlidesProgress || s.centeredSlides && s.autoHeight) && e.updateSlidesProgress(t), r && !l && e.emit("reachBeginning toEdge"), a && !c && e.emit("reachEnd toEdge"), (l && !r || c && !a) && e.emit("fromEdge"), e.emit("progress", n)
                },
                updateSlidesClasses: function() {
                    const t = this,
                        {
                            slides: e,
                            params: s,
                            slidesEl: i,
                            activeIndex: n
                        } = t,
                        r = t.virtual && s.virtual.enabled,
                        a = t.grid && s.grid && s.grid.rows > 1,
                        o = t => lt(i, `.${s.slideClass}${t}, swiper-slide${t}`)[0];
                    let l, c, h;
                    if (r)
                        if (s.loop) {
                            let e = n - t.virtual.slidesBefore;
                            e < 0 && (e = t.virtual.slides.length + e), e >= t.virtual.slides.length && (e -= t.virtual.slides.length), l = o(`[data-swiper-slide-index="${e}"]`)
                        } else l = o(`[data-swiper-slide-index="${n}"]`);
                    else a ? (l = e.filter((t => t.column === n))[0], h = e.filter((t => t.column === n + 1))[0], c = e.filter((t => t.column === n - 1))[0]) : l = e[n];
                    l && (a || (h = function(t, e) {
                        const s = [];
                        for (; t.nextElementSibling;) {
                            const i = t.nextElementSibling;
                            e ? i.matches(e) && s.push(i) : s.push(i), t = i
                        }
                        return s
                    }(l, `.${s.slideClass}, swiper-slide`)[0], s.loop && !h && (h = e[0]), c = function(t, e) {
                        const s = [];
                        for (; t.previousElementSibling;) {
                            const i = t.previousElementSibling;
                            e ? i.matches(e) && s.push(i) : s.push(i), t = i
                        }
                        return s
                    }(l, `.${s.slideClass}, swiper-slide`)[0], s.loop && 0 === !c && (c = e[e.length - 1]))), e.forEach((t => {
                        Mt(t, t === l, s.slideActiveClass), Mt(t, t === h, s.slideNextClass), Mt(t, t === c, s.slidePrevClass)
                    })), t.emitSlidesClasses()
                },
                updateActiveIndex: function(t) {
                    const e = this,
                        s = e.rtlTranslate ? e.translate : -e.translate,
                        {
                            snapGrid: i,
                            params: n,
                            activeIndex: r,
                            realIndex: a,
                            snapIndex: o
                        } = e;
                    let l, c = t;
                    const h = t => {
                        let s = t - e.virtual.slidesBefore;
                        return s < 0 && (s = e.virtual.slides.length + s), s >= e.virtual.slides.length && (s -= e.virtual.slides.length), s
                    };
                    if (void 0 === c && (c = function(t) {
                            const {
                                slidesGrid: e,
                                params: s
                            } = t, i = t.rtlTranslate ? t.translate : -t.translate;
                            let n;
                            for (let t = 0; t < e.length; t += 1) void 0 !== e[t + 1] ? i >= e[t] && i < e[t + 1] - (e[t + 1] - e[t]) / 2 ? n = t : i >= e[t] && i < e[t + 1] && (n = t + 1) : i >= e[t] && (n = t);
                            return s.normalizeSlideIndex && (n < 0 || void 0 === n) && (n = 0), n
                        }(e)), i.indexOf(s) >= 0) l = i.indexOf(s);
                    else {
                        const t = Math.min(n.slidesPerGroupSkip, c);
                        l = t + Math.floor((c - t) / n.slidesPerGroup)
                    }
                    if (l >= i.length && (l = i.length - 1), c === r && !e.params.loop) return void(l !== o && (e.snapIndex = l, e.emit("snapIndexChange")));
                    if (c === r && e.params.loop && e.virtual && e.params.virtual.enabled) return void(e.realIndex = h(c));
                    const u = e.grid && n.grid && n.grid.rows > 1;
                    let d;
                    if (e.virtual && n.virtual.enabled && n.loop) d = h(c);
                    else if (u) {
                        const t = e.slides.filter((t => t.column === c))[0];
                        let s = parseInt(t.getAttribute("data-swiper-slide-index"), 10);
                        Number.isNaN(s) && (s = Math.max(e.slides.indexOf(t), 0)), d = Math.floor(s / n.grid.rows)
                    } else if (e.slides[c]) {
                        const t = e.slides[c].getAttribute("data-swiper-slide-index");
                        d = t ? parseInt(t, 10) : c
                    } else d = c;
                    Object.assign(e, {
                        previousSnapIndex: o,
                        snapIndex: l,
                        previousRealIndex: a,
                        realIndex: d,
                        previousIndex: r,
                        activeIndex: c
                    }), e.initialized && Lt(e), e.emit("activeIndexChange"), e.emit("snapIndexChange"), (e.initialized || e.params.runCallbacksOnInit) && (a !== d && e.emit("realIndexChange"), e.emit("slideChange"))
                },
                updateClickedSlide: function(t, e) {
                    const s = this,
                        i = s.params;
                    let n = t.closest(`.${i.slideClass}, swiper-slide`);
                    !n && s.isElement && e && e.length > 1 && e.includes(t) && [...e.slice(e.indexOf(t) + 1, e.length)].forEach((t => {
                        !n && t.matches && t.matches(`.${i.slideClass}, swiper-slide`) && (n = t)
                    }));
                    let r, a = !1;
                    if (n)
                        for (let t = 0; t < s.slides.length; t += 1)
                            if (s.slides[t] === n) {
                                a = !0, r = t;
                                break
                            }
                    if (!n || !a) return s.clickedSlide = void 0, void(s.clickedIndex = void 0);
                    s.clickedSlide = n, s.virtual && s.params.virtual.enabled ? s.clickedIndex = parseInt(n.getAttribute("data-swiper-slide-index"), 10) : s.clickedIndex = r, i.slideToClickedSlide && void 0 !== s.clickedIndex && s.clickedIndex !== s.activeIndex && s.slideToClickedSlide()
                }
            };
            var It = {
                getTranslate: function(t) {
                    void 0 === t && (t = this.isHorizontal() ? "x" : "y");
                    const {
                        params: e,
                        rtlTranslate: s,
                        translate: i,
                        wrapperEl: n
                    } = this;
                    if (e.virtualTranslate) return s ? -i : i;
                    if (e.cssMode) return i;
                    let r = it(n, t);
                    return r += this.cssOverflowAdjustment(), s && (r = -r), r || 0
                },
                setTranslate: function(t, e) {
                    const s = this,
                        {
                            rtlTranslate: i,
                            params: n,
                            wrapperEl: r,
                            progress: a
                        } = s;
                    let o, l = 0,
                        c = 0;
                    s.isHorizontal() ? l = i ? -t : t : c = t, n.roundLengths && (l = Math.floor(l), c = Math.floor(c)), s.previousTranslate = s.translate, s.translate = s.isHorizontal() ? l : c, n.cssMode ? r[s.isHorizontal() ? "scrollLeft" : "scrollTop"] = s.isHorizontal() ? -l : -c : n.virtualTranslate || (s.isHorizontal() ? l -= s.cssOverflowAdjustment() : c -= s.cssOverflowAdjustment(), r.style.transform = `translate3d(${l}px, ${c}px, 0px)`);
                    const h = s.maxTranslate() - s.minTranslate();
                    o = 0 === h ? 0 : (t - s.minTranslate()) / h, o !== a && s.updateProgress(t), s.emit("setTranslate", s.translate, e)
                },
                minTranslate: function() {
                    return -this.snapGrid[0]
                },
                maxTranslate: function() {
                    return -this.snapGrid[this.snapGrid.length - 1]
                },
                translateTo: function(t, e, s, i, n) {
                    void 0 === t && (t = 0), void 0 === e && (e = this.params.speed), void 0 === s && (s = !0), void 0 === i && (i = !0);
                    const r = this,
                        {
                            params: a,
                            wrapperEl: o
                        } = r;
                    if (r.animating && a.preventInteractionOnTransition) return !1;
                    const l = r.minTranslate(),
                        c = r.maxTranslate();
                    let h;
                    if (h = i && t > l ? l : i && t < c ? c : t, r.updateProgress(h), a.cssMode) {
                        const t = r.isHorizontal();
                        if (0 === e) o[t ? "scrollLeft" : "scrollTop"] = -h;
                        else {
                            if (!r.support.smoothScroll) return ot({
                                swiper: r,
                                targetPosition: -h,
                                side: t ? "left" : "top"
                            }), !0;
                            o.scrollTo({
                                [t ? "left" : "top"]: -h,
                                behavior: "smooth"
                            })
                        }
                        return !0
                    }
                    return 0 === e ? (r.setTransition(0), r.setTranslate(h), s && (r.emit("beforeTransitionStart", e, n), r.emit("transitionEnd"))) : (r.setTransition(e), r.setTranslate(h), s && (r.emit("beforeTransitionStart", e, n), r.emit("transitionStart")), r.animating || (r.animating = !0, r.onTranslateToWrapperTransitionEnd || (r.onTranslateToWrapperTransitionEnd = function(t) {
                        r && !r.destroyed && t.target === this && (r.wrapperEl.removeEventListener("transitionend", r.onTranslateToWrapperTransitionEnd), r.onTranslateToWrapperTransitionEnd = null, delete r.onTranslateToWrapperTransitionEnd, r.animating = !1, s && r.emit("transitionEnd"))
                    }), r.wrapperEl.addEventListener("transitionend", r.onTranslateToWrapperTransitionEnd))), !0
                }
            };

            function qt(t) {
                let {
                    swiper: e,
                    runCallbacks: s,
                    direction: i,
                    step: n
                } = t;
                const {
                    activeIndex: r,
                    previousIndex: a
                } = e;
                let o = i;
                if (o || (o = r > a ? "next" : r < a ? "prev" : "reset"), e.emit(`transition${n}`), s && r !== a) {
                    if ("reset" === o) return void e.emit(`slideResetTransition${n}`);
                    e.emit(`slideChangeTransition${n}`), "next" === o ? e.emit(`slideNextTransition${n}`) : e.emit(`slidePrevTransition${n}`)
                }
            }
            var Dt = {
                slideTo: function(t, e, s, i, n) {
                    void 0 === t && (t = 0), void 0 === s && (s = !0), "string" == typeof t && (t = parseInt(t, 10));
                    const r = this;
                    let a = t;
                    a < 0 && (a = 0);
                    const {
                        params: o,
                        snapGrid: l,
                        slidesGrid: c,
                        previousIndex: h,
                        activeIndex: u,
                        rtlTranslate: d,
                        wrapperEl: p,
                        enabled: f
                    } = r;
                    if (!f && !i && !n || r.destroyed || r.animating && o.preventInteractionOnTransition) return !1;
                    void 0 === e && (e = r.params.speed);
                    const m = Math.min(r.params.slidesPerGroupSkip, a);
                    let g = m + Math.floor((a - m) / r.params.slidesPerGroup);
                    g >= l.length && (g = l.length - 1);
                    const v = -l[g];
                    if (o.normalizeSlideIndex)
                        for (let t = 0; t < c.length; t += 1) {
                            const e = -Math.floor(100 * v),
                                s = Math.floor(100 * c[t]),
                                i = Math.floor(100 * c[t + 1]);
                            void 0 !== c[t + 1] ? e >= s && e < i - (i - s) / 2 ? a = t : e >= s && e < i && (a = t + 1) : e >= s && (a = t)
                        }
                    if (r.initialized && a !== u) {
                        if (!r.allowSlideNext && (d ? v > r.translate && v > r.minTranslate() : v < r.translate && v < r.minTranslate())) return !1;
                        if (!r.allowSlidePrev && v > r.translate && v > r.maxTranslate() && (u || 0) !== a) return !1
                    }
                    let b;
                    a !== (h || 0) && s && r.emit("beforeSlideChangeStart"), r.updateProgress(v), b = a > u ? "next" : a < u ? "prev" : "reset";
                    const y = r.virtual && r.params.virtual.enabled;
                    if (!(y && n) && (d && -v === r.translate || !d && v === r.translate)) return r.updateActiveIndex(a), o.autoHeight && r.updateAutoHeight(), r.updateSlidesClasses(), "slide" !== o.effect && r.setTranslate(v), "reset" !== b && (r.transitionStart(s, b), r.transitionEnd(s, b)), !1;
                    if (o.cssMode) {
                        const t = r.isHorizontal(),
                            s = d ? v : -v;
                        if (0 === e) y && (r.wrapperEl.style.scrollSnapType = "none", r._immediateVirtual = !0), y && !r._cssModeVirtualInitialSet && r.params.initialSlide > 0 ? (r._cssModeVirtualInitialSet = !0, requestAnimationFrame((() => {
                            p[t ? "scrollLeft" : "scrollTop"] = s
                        }))) : p[t ? "scrollLeft" : "scrollTop"] = s, y && requestAnimationFrame((() => {
                            r.wrapperEl.style.scrollSnapType = "", r._immediateVirtual = !1
                        }));
                        else {
                            if (!r.support.smoothScroll) return ot({
                                swiper: r,
                                targetPosition: s,
                                side: t ? "left" : "top"
                            }), !0;
                            p.scrollTo({
                                [t ? "left" : "top"]: s,
                                behavior: "smooth"
                            })
                        }
                        return !0
                    }
                    return r.setTransition(e), r.setTranslate(v), r.updateActiveIndex(a), r.updateSlidesClasses(), r.emit("beforeTransitionStart", e, i), r.transitionStart(s, b), 0 === e ? r.transitionEnd(s, b) : r.animating || (r.animating = !0, r.onSlideToWrapperTransitionEnd || (r.onSlideToWrapperTransitionEnd = function(t) {
                        r && !r.destroyed && t.target === this && (r.wrapperEl.removeEventListener("transitionend", r.onSlideToWrapperTransitionEnd), r.onSlideToWrapperTransitionEnd = null, delete r.onSlideToWrapperTransitionEnd, r.transitionEnd(s, b))
                    }), r.wrapperEl.addEventListener("transitionend", r.onSlideToWrapperTransitionEnd)), !0
                },
                slideToLoop: function(t, e, s, i) {
                    if (void 0 === t && (t = 0), void 0 === s && (s = !0), "string" == typeof t) {
                        t = parseInt(t, 10)
                    }
                    const n = this;
                    if (n.destroyed) return;
                    void 0 === e && (e = n.params.speed);
                    const r = n.grid && n.params.grid && n.params.grid.rows > 1;
                    let a = t;
                    if (n.params.loop)
                        if (n.virtual && n.params.virtual.enabled) a += n.virtual.slidesBefore;
                        else {
                            let t;
                            if (r) {
                                const e = a * n.params.grid.rows;
                                t = n.slides.filter((t => 1 * t.getAttribute("data-swiper-slide-index") === e))[0].column
                            } else t = n.getSlideIndexByData(a);
                            const e = r ? Math.ceil(n.slides.length / n.params.grid.rows) : n.slides.length,
                                {
                                    centeredSlides: s
                                } = n.params;
                            let o = n.params.slidesPerView;
                            "auto" === o ? o = n.slidesPerViewDynamic() : (o = Math.ceil(parseFloat(n.params.slidesPerView, 10)), s && o % 2 == 0 && (o += 1));
                            let l = e - t < o;
                            if (s && (l = l || t < Math.ceil(o / 2)), i && s && "auto" !== n.params.slidesPerView && !r && (l = !1), l) {
                                const i = s ? t < n.activeIndex ? "prev" : "next" : t - n.activeIndex - 1 < n.params.slidesPerView ? "next" : "prev";
                                n.loopFix({
                                    direction: i,
                                    slideTo: !0,
                                    activeSlideIndex: "next" === i ? t + 1 : t - e + 1,
                                    slideRealIndex: "next" === i ? n.realIndex : void 0
                                })
                            }
                            if (r) {
                                const t = a * n.params.grid.rows;
                                a = n.slides.filter((e => 1 * e.getAttribute("data-swiper-slide-index") === t))[0].column
                            } else a = n.getSlideIndexByData(a)
                        }
                    return requestAnimationFrame((() => {
                        n.slideTo(a, e, s, i)
                    })), n
                },
                slideNext: function(t, e, s) {
                    void 0 === e && (e = !0);
                    const i = this,
                        {
                            enabled: n,
                            params: r,
                            animating: a
                        } = i;
                    if (!n || i.destroyed) return i;
                    void 0 === t && (t = i.params.speed);
                    let o = r.slidesPerGroup;
                    "auto" === r.slidesPerView && 1 === r.slidesPerGroup && r.slidesPerGroupAuto && (o = Math.max(i.slidesPerViewDynamic("current", !0), 1));
                    const l = i.activeIndex < r.slidesPerGroupSkip ? 1 : o,
                        c = i.virtual && r.virtual.enabled;
                    if (r.loop) {
                        if (a && !c && r.loopPreventsSliding) return !1;
                        if (i.loopFix({
                                direction: "next"
                            }), i._clientLeft = i.wrapperEl.clientLeft, i.activeIndex === i.slides.length - 1 && r.cssMode) return requestAnimationFrame((() => {
                            i.slideTo(i.activeIndex + l, t, e, s)
                        })), !0
                    }
                    return r.rewind && i.isEnd ? i.slideTo(0, t, e, s) : i.slideTo(i.activeIndex + l, t, e, s)
                },
                slidePrev: function(t, e, s) {
                    void 0 === e && (e = !0);
                    const i = this,
                        {
                            params: n,
                            snapGrid: r,
                            slidesGrid: a,
                            rtlTranslate: o,
                            enabled: l,
                            animating: c
                        } = i;
                    if (!l || i.destroyed) return i;
                    void 0 === t && (t = i.params.speed);
                    const h = i.virtual && n.virtual.enabled;
                    if (n.loop) {
                        if (c && !h && n.loopPreventsSliding) return !1;
                        i.loopFix({
                            direction: "prev"
                        }), i._clientLeft = i.wrapperEl.clientLeft
                    }

                    function u(t) {
                        return t < 0 ? -Math.floor(Math.abs(t)) : Math.floor(t)
                    }
                    const d = u(o ? i.translate : -i.translate),
                        p = r.map((t => u(t)));
                    let f = r[p.indexOf(d) - 1];
                    if (void 0 === f && n.cssMode) {
                        let t;
                        r.forEach(((e, s) => {
                            d >= e && (t = s)
                        })), void 0 !== t && (f = r[t > 0 ? t - 1 : t])
                    }
                    let m = 0;
                    if (void 0 !== f && (m = a.indexOf(f), m < 0 && (m = i.activeIndex - 1), "auto" === n.slidesPerView && 1 === n.slidesPerGroup && n.slidesPerGroupAuto && (m = m - i.slidesPerViewDynamic("previous", !0) + 1, m = Math.max(m, 0))), n.rewind && i.isBeginning) {
                        const n = i.params.virtual && i.params.virtual.enabled && i.virtual ? i.virtual.slides.length - 1 : i.slides.length - 1;
                        return i.slideTo(n, t, e, s)
                    }
                    return n.loop && 0 === i.activeIndex && n.cssMode ? (requestAnimationFrame((() => {
                        i.slideTo(m, t, e, s)
                    })), !0) : i.slideTo(m, t, e, s)
                },
                slideReset: function(t, e, s) {
                    void 0 === e && (e = !0);
                    const i = this;
                    if (!i.destroyed) return void 0 === t && (t = i.params.speed), i.slideTo(i.activeIndex, t, e, s)
                },
                slideToClosest: function(t, e, s, i) {
                    void 0 === e && (e = !0), void 0 === i && (i = .5);
                    const n = this;
                    if (n.destroyed) return;
                    void 0 === t && (t = n.params.speed);
                    let r = n.activeIndex;
                    const a = Math.min(n.params.slidesPerGroupSkip, r),
                        o = a + Math.floor((r - a) / n.params.slidesPerGroup),
                        l = n.rtlTranslate ? n.translate : -n.translate;
                    if (l >= n.snapGrid[o]) {
                        const t = n.snapGrid[o];
                        l - t > (n.snapGrid[o + 1] - t) * i && (r += n.params.slidesPerGroup)
                    } else {
                        const t = n.snapGrid[o - 1];
                        l - t <= (n.snapGrid[o] - t) * i && (r -= n.params.slidesPerGroup)
                    }
                    return r = Math.max(r, 0), r = Math.min(r, n.slidesGrid.length - 1), n.slideTo(r, t, e, s)
                },
                slideToClickedSlide: function() {
                    const t = this;
                    if (t.destroyed) return;
                    const {
                        params: e,
                        slidesEl: s
                    } = t, i = "auto" === e.slidesPerView ? t.slidesPerViewDynamic() : e.slidesPerView;
                    let n, r = t.clickedIndex;
                    const a = t.isElement ? "swiper-slide" : `.${e.slideClass}`;
                    if (e.loop) {
                        if (t.animating) return;
                        n = parseInt(t.clickedSlide.getAttribute("data-swiper-slide-index"), 10), e.centeredSlides ? r < t.loopedSlides - i / 2 || r > t.slides.length - t.loopedSlides + i / 2 ? (t.loopFix(), r = t.getSlideIndex(lt(s, `${a}[data-swiper-slide-index="${n}"]`)[0]), et((() => {
                            t.slideTo(r)
                        }))) : t.slideTo(r) : r > t.slides.length - i ? (t.loopFix(), r = t.getSlideIndex(lt(s, `${a}[data-swiper-slide-index="${n}"]`)[0]), et((() => {
                            t.slideTo(r)
                        }))) : t.slideTo(r)
                    } else t.slideTo(r)
                }
            };
            var zt = {
                loopCreate: function(t) {
                    const e = this,
                        {
                            params: s,
                            slidesEl: i
                        } = e;
                    if (!s.loop || e.virtual && e.params.virtual.enabled) return;
                    const n = () => {
                            lt(i, `.${s.slideClass}, swiper-slide`).forEach(((t, e) => {
                                t.setAttribute("data-swiper-slide-index", e)
                            }))
                        },
                        r = e.grid && s.grid && s.grid.rows > 1,
                        a = s.slidesPerGroup * (r ? s.grid.rows : 1),
                        o = e.slides.length % a != 0,
                        l = r && e.slides.length % s.grid.rows != 0,
                        c = t => {
                            for (let i = 0; i < t; i += 1) {
                                const t = e.isElement ? ht("swiper-slide", [s.slideBlankClass]) : ht("div", [s.slideClass, s.slideBlankClass]);
                                e.slidesEl.append(t)
                            }
                        };
                    if (o) {
                        if (s.loopAddBlankSlides) {
                            c(a - e.slides.length % a), e.recalcSlides(), e.updateSlides()
                        } else ct("Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
                        n()
                    } else if (l) {
                        if (s.loopAddBlankSlides) {
                            c(s.grid.rows - e.slides.length % s.grid.rows), e.recalcSlides(), e.updateSlides()
                        } else ct("Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
                        n()
                    } else n();
                    e.loopFix({
                        slideRealIndex: t,
                        direction: s.centeredSlides ? void 0 : "next"
                    })
                },
                loopFix: function(t) {
                    let {
                        slideRealIndex: e,
                        slideTo: s = !0,
                        direction: i,
                        setTranslate: n,
                        activeSlideIndex: r,
                        byController: a,
                        byMousewheel: o
                    } = void 0 === t ? {} : t;
                    const l = this;
                    if (!l.params.loop) return;
                    l.emit("beforeLoopFix");
                    const {
                        slides: c,
                        allowSlidePrev: h,
                        allowSlideNext: u,
                        slidesEl: d,
                        params: p
                    } = l, {
                        centeredSlides: f
                    } = p;
                    if (l.allowSlidePrev = !0, l.allowSlideNext = !0, l.virtual && p.virtual.enabled) return s && (p.centeredSlides || 0 !== l.snapIndex ? p.centeredSlides && l.snapIndex < p.slidesPerView ? l.slideTo(l.virtual.slides.length + l.snapIndex, 0, !1, !0) : l.snapIndex === l.snapGrid.length - 1 && l.slideTo(l.virtual.slidesBefore, 0, !1, !0) : l.slideTo(l.virtual.slides.length, 0, !1, !0)), l.allowSlidePrev = h, l.allowSlideNext = u, void l.emit("loopFix");
                    let m = p.slidesPerView;
                    "auto" === m ? m = l.slidesPerViewDynamic() : (m = Math.ceil(parseFloat(p.slidesPerView, 10)), f && m % 2 == 0 && (m += 1));
                    const g = p.slidesPerGroupAuto ? m : p.slidesPerGroup;
                    let v = g;
                    v % g != 0 && (v += g - v % g), v += p.loopAdditionalSlides, l.loopedSlides = v;
                    const b = l.grid && p.grid && p.grid.rows > 1;
                    c.length < m + v ? ct("Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled and not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters") : b && "row" === p.grid.fill && ct("Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`");
                    const y = [],
                        w = [];
                    let T = l.activeIndex;
                    void 0 === r ? r = l.getSlideIndex(c.filter((t => t.classList.contains(p.slideActiveClass)))[0]) : T = r;
                    const _ = "next" === i || !i,
                        k = "prev" === i || !i;
                    let x = 0,
                        S = 0;
                    const E = b ? Math.ceil(c.length / p.grid.rows) : c.length,
                        $ = (b ? c[r].column : r) + (f && void 0 === n ? -m / 2 + .5 : 0);
                    if ($ < v) {
                        x = Math.max(v - $, g);
                        for (let t = 0; t < v - $; t += 1) {
                            const e = t - Math.floor(t / E) * E;
                            if (b) {
                                const t = E - e - 1;
                                for (let e = c.length - 1; e >= 0; e -= 1) c[e].column === t && y.push(e)
                            } else y.push(E - e - 1)
                        }
                    } else if ($ + m > E - v) {
                        S = Math.max($ - (E - 2 * v), g);
                        for (let t = 0; t < S; t += 1) {
                            const e = t - Math.floor(t / E) * E;
                            b ? c.forEach(((t, s) => {
                                t.column === e && w.push(s)
                            })) : w.push(e)
                        }
                    }
                    if (l.__preventObserver__ = !0, requestAnimationFrame((() => {
                            l.__preventObserver__ = !1
                        })), k && y.forEach((t => {
                            c[t].swiperLoopMoveDOM = !0, d.prepend(c[t]), c[t].swiperLoopMoveDOM = !1
                        })), _ && w.forEach((t => {
                            c[t].swiperLoopMoveDOM = !0, d.append(c[t]), c[t].swiperLoopMoveDOM = !1
                        })), l.recalcSlides(), "auto" === p.slidesPerView ? l.updateSlides() : b && (y.length > 0 && k || w.length > 0 && _) && l.slides.forEach(((t, e) => {
                            l.grid.updateSlide(e, t, l.slides)
                        })), p.watchSlidesProgress && l.updateSlidesOffset(), s)
                        if (y.length > 0 && k) {
                            if (void 0 === e) {
                                const t = l.slidesGrid[T],
                                    e = l.slidesGrid[T + x] - t;
                                o ? l.setTranslate(l.translate - e) : (l.slideTo(T + Math.ceil(x), 0, !1, !0), n && (l.touchEventsData.startTranslate = l.touchEventsData.startTranslate - e, l.touchEventsData.currentTranslate = l.touchEventsData.currentTranslate - e))
                            } else if (n) {
                                const t = b ? y.length / p.grid.rows : y.length;
                                l.slideTo(l.activeIndex + t, 0, !1, !0), l.touchEventsData.currentTranslate = l.translate
                            }
                        } else if (w.length > 0 && _)
                        if (void 0 === e) {
                            const t = l.slidesGrid[T],
                                e = l.slidesGrid[T - S] - t;
                            o ? l.setTranslate(l.translate - e) : (l.slideTo(T - S, 0, !1, !0), n && (l.touchEventsData.startTranslate = l.touchEventsData.startTranslate - e, l.touchEventsData.currentTranslate = l.touchEventsData.currentTranslate - e))
                        } else {
                            const t = b ? w.length / p.grid.rows : w.length;
                            l.slideTo(l.activeIndex - t, 0, !1, !0)
                        }
                    if (l.allowSlidePrev = h, l.allowSlideNext = u, l.controller && l.controller.control && !a) {
                        const t = {
                            slideRealIndex: e,
                            direction: i,
                            setTranslate: n,
                            activeSlideIndex: r,
                            byController: !0
                        };
                        Array.isArray(l.controller.control) ? l.controller.control.forEach((e => {
                            !e.destroyed && e.params.loop && e.loopFix({ ...t,
                                slideTo: e.params.slidesPerView === p.slidesPerView && s
                            })
                        })) : l.controller.control instanceof l.constructor && l.controller.control.params.loop && l.controller.control.loopFix({ ...t,
                            slideTo: l.controller.control.params.slidesPerView === p.slidesPerView && s
                        })
                    }
                    l.emit("loopFix")
                },
                loopDestroy: function() {
                    const t = this,
                        {
                            params: e,
                            slidesEl: s
                        } = t;
                    if (!e.loop || t.virtual && t.params.virtual.enabled) return;
                    t.recalcSlides();
                    const i = [];
                    t.slides.forEach((t => {
                        const e = void 0 === t.swiperSlideIndex ? 1 * t.getAttribute("data-swiper-slide-index") : t.swiperSlideIndex;
                        i[e] = t
                    })), t.slides.forEach((t => {
                        t.removeAttribute("data-swiper-slide-index")
                    })), i.forEach((t => {
                        s.append(t)
                    })), t.recalcSlides(), t.slideTo(t.realIndex, 0)
                }
            };

            function Vt(t, e, s) {
                const i = tt(),
                    {
                        params: n
                    } = t,
                    r = n.edgeSwipeDetection,
                    a = n.edgeSwipeThreshold;
                return !r || !(s <= a || s >= i.innerWidth - a) || "prevent" === r && (e.preventDefault(), !0)
            }

            function jt(t) {
                const e = this,
                    s = J();
                let i = t;
                i.originalEvent && (i = i.originalEvent);
                const n = e.touchEventsData;
                if ("pointerdown" === i.type) {
                    if (null !== n.pointerId && n.pointerId !== i.pointerId) return;
                    n.pointerId = i.pointerId
                } else "touchstart" === i.type && 1 === i.targetTouches.length && (n.touchId = i.targetTouches[0].identifier);
                if ("touchstart" === i.type) return void Vt(e, i, i.targetTouches[0].pageX);
                const {
                    params: r,
                    touches: a,
                    enabled: o
                } = e;
                if (!o) return;
                if (!r.simulateTouch && "mouse" === i.pointerType) return;
                if (e.animating && r.preventInteractionOnTransition) return;
                !e.animating && r.cssMode && r.loop && e.loopFix();
                let l = i.target;
                if ("wrapper" === r.touchEventsTarget && ! function(t, e) {
                        const s = e.contains(t);
                        if (!s && e instanceof HTMLSlotElement) return [...e.assignedElements()].includes(t);
                        return s
                    }(l, e.wrapperEl)) return;
                if ("which" in i && 3 === i.which) return;
                if ("button" in i && i.button > 0) return;
                if (n.isTouched && n.isMoved) return;
                const c = !!r.noSwipingClass && "" !== r.noSwipingClass,
                    h = i.composedPath ? i.composedPath() : i.path;
                c && i.target && i.target.shadowRoot && h && (l = h[0]);
                const u = r.noSwipingSelector ? r.noSwipingSelector : `.${r.noSwipingClass}`,
                    d = !(!i.target || !i.target.shadowRoot);
                if (r.noSwiping && (d ? function(t, e) {
                        return void 0 === e && (e = this),
                            function e(s) {
                                if (!s || s === J() || s === tt()) return null;
                                s.assignedSlot && (s = s.assignedSlot);
                                const i = s.closest(t);
                                return i || s.getRootNode ? i || e(s.getRootNode().host) : null
                            }(e)
                    }(u, l) : l.closest(u))) return void(e.allowClick = !0);
                if (r.swipeHandler && !l.closest(r.swipeHandler)) return;
                a.currentX = i.pageX, a.currentY = i.pageY;
                const p = a.currentX,
                    f = a.currentY;
                if (!Vt(e, i, p)) return;
                Object.assign(n, {
                    isTouched: !0,
                    isMoved: !1,
                    allowTouchCallbacks: !0,
                    isScrolling: void 0,
                    startMoving: void 0
                }), a.startX = p, a.startY = f, n.touchStartTime = st(), e.allowClick = !0, e.updateSize(), e.swipeDirection = void 0, r.threshold > 0 && (n.allowThresholdMove = !1);
                let m = !0;
                l.matches(n.focusableElements) && (m = !1, "SELECT" === l.nodeName && (n.isTouched = !1)), s.activeElement && s.activeElement.matches(n.focusableElements) && s.activeElement !== l && ("mouse" === i.pointerType || "mouse" !== i.pointerType && !l.matches(n.focusableElements)) && s.activeElement.blur();
                const g = m && e.allowTouchMove && r.touchStartPreventDefault;
                !r.touchStartForcePreventDefault && !g || l.isContentEditable || i.preventDefault(), r.freeMode && r.freeMode.enabled && e.freeMode && e.animating && !r.cssMode && e.freeMode.onTouchStart(), e.emit("touchStart", i)
            }

            function Ft(t) {
                const e = J(),
                    s = this,
                    i = s.touchEventsData,
                    {
                        params: n,
                        touches: r,
                        rtlTranslate: a,
                        enabled: o
                    } = s;
                if (!o) return;
                if (!n.simulateTouch && "mouse" === t.pointerType) return;
                let l, c = t;
                if (c.originalEvent && (c = c.originalEvent), "pointermove" === c.type) {
                    if (null !== i.touchId) return;
                    if (c.pointerId !== i.pointerId) return
                }
                if ("touchmove" === c.type) {
                    if (l = [...c.changedTouches].filter((t => t.identifier === i.touchId))[0], !l || l.identifier !== i.touchId) return
                } else l = c;
                if (!i.isTouched) return void(i.startMoving && i.isScrolling && s.emit("touchMoveOpposite", c));
                const h = l.pageX,
                    u = l.pageY;
                if (c.preventedByNestedSwiper) return r.startX = h, void(r.startY = u);
                if (!s.allowTouchMove) return c.target.matches(i.focusableElements) || (s.allowClick = !1), void(i.isTouched && (Object.assign(r, {
                    startX: h,
                    startY: u,
                    currentX: h,
                    currentY: u
                }), i.touchStartTime = st()));
                if (n.touchReleaseOnEdges && !n.loop)
                    if (s.isVertical()) {
                        if (u < r.startY && s.translate <= s.maxTranslate() || u > r.startY && s.translate >= s.minTranslate()) return i.isTouched = !1, void(i.isMoved = !1)
                    } else if (h < r.startX && s.translate <= s.maxTranslate() || h > r.startX && s.translate >= s.minTranslate()) return;
                if (e.activeElement && e.activeElement.matches(i.focusableElements) && e.activeElement !== c.target && "mouse" !== c.pointerType && e.activeElement.blur(), e.activeElement && c.target === e.activeElement && c.target.matches(i.focusableElements)) return i.isMoved = !0, void(s.allowClick = !1);
                i.allowTouchCallbacks && s.emit("touchMove", c), r.previousX = r.currentX, r.previousY = r.currentY, r.currentX = h, r.currentY = u;
                const d = r.currentX - r.startX,
                    p = r.currentY - r.startY;
                if (s.params.threshold && Math.sqrt(d ** 2 + p ** 2) < s.params.threshold) return;
                if (void 0 === i.isScrolling) {
                    let t;
                    s.isHorizontal() && r.currentY === r.startY || s.isVertical() && r.currentX === r.startX ? i.isScrolling = !1 : d * d + p * p >= 25 && (t = 180 * Math.atan2(Math.abs(p), Math.abs(d)) / Math.PI, i.isScrolling = s.isHorizontal() ? t > n.touchAngle : 90 - t > n.touchAngle)
                }
                if (i.isScrolling && s.emit("touchMoveOpposite", c), void 0 === i.startMoving && (r.currentX === r.startX && r.currentY === r.startY || (i.startMoving = !0)), i.isScrolling || "touchmove" === c.type && i.preventTouchMoveFromPointerMove) return void(i.isTouched = !1);
                if (!i.startMoving) return;
                s.allowClick = !1, !n.cssMode && c.cancelable && c.preventDefault(), n.touchMoveStopPropagation && !n.nested && c.stopPropagation();
                let f = s.isHorizontal() ? d : p,
                    m = s.isHorizontal() ? r.currentX - r.previousX : r.currentY - r.previousY;
                n.oneWayMovement && (f = Math.abs(f) * (a ? 1 : -1), m = Math.abs(m) * (a ? 1 : -1)), r.diff = f, f *= n.touchRatio, a && (f = -f, m = -m);
                const g = s.touchesDirection;
                s.swipeDirection = f > 0 ? "prev" : "next", s.touchesDirection = m > 0 ? "prev" : "next";
                const v = s.params.loop && !n.cssMode,
                    b = "next" === s.touchesDirection && s.allowSlideNext || "prev" === s.touchesDirection && s.allowSlidePrev;
                if (!i.isMoved) {
                    if (v && b && s.loopFix({
                            direction: s.swipeDirection
                        }), i.startTranslate = s.getTranslate(), s.setTransition(0), s.animating) {
                        const t = new window.CustomEvent("transitionend", {
                            bubbles: !0,
                            cancelable: !0,
                            detail: {
                                bySwiperTouchMove: !0
                            }
                        });
                        s.wrapperEl.dispatchEvent(t)
                    }
                    i.allowMomentumBounce = !1, !n.grabCursor || !0 !== s.allowSlideNext && !0 !== s.allowSlidePrev || s.setGrabCursor(!0), s.emit("sliderFirstMove", c)
                }
                if ((new Date).getTime(), i.isMoved && i.allowThresholdMove && g !== s.touchesDirection && v && b && Math.abs(f) >= 1) return Object.assign(r, {
                    startX: h,
                    startY: u,
                    currentX: h,
                    currentY: u,
                    startTranslate: i.currentTranslate
                }), i.loopSwapReset = !0, void(i.startTranslate = i.currentTranslate);
                s.emit("sliderMove", c), i.isMoved = !0, i.currentTranslate = f + i.startTranslate;
                let y = !0,
                    w = n.resistanceRatio;
                if (n.touchReleaseOnEdges && (w = 0), f > 0 ? (v && b && i.allowThresholdMove && i.currentTranslate > (n.centeredSlides ? s.minTranslate() - s.slidesSizesGrid[s.activeIndex + 1] - ("auto" !== n.slidesPerView && s.slides.length - n.slidesPerView >= 2 ? s.slidesSizesGrid[s.activeIndex + 1] + s.params.spaceBetween : 0) - s.params.spaceBetween : s.minTranslate()) && s.loopFix({
                        direction: "prev",
                        setTranslate: !0,
                        activeSlideIndex: 0
                    }), i.currentTranslate > s.minTranslate() && (y = !1, n.resistance && (i.currentTranslate = s.minTranslate() - 1 + (-s.minTranslate() + i.startTranslate + f) ** w))) : f < 0 && (v && b && i.allowThresholdMove && i.currentTranslate < (n.centeredSlides ? s.maxTranslate() + s.slidesSizesGrid[s.slidesSizesGrid.length - 1] + s.params.spaceBetween + ("auto" !== n.slidesPerView && s.slides.length - n.slidesPerView >= 2 ? s.slidesSizesGrid[s.slidesSizesGrid.length - 1] + s.params.spaceBetween : 0) : s.maxTranslate()) && s.loopFix({
                        direction: "next",
                        setTranslate: !0,
                        activeSlideIndex: s.slides.length - ("auto" === n.slidesPerView ? s.slidesPerViewDynamic() : Math.ceil(parseFloat(n.slidesPerView, 10)))
                    }), i.currentTranslate < s.maxTranslate() && (y = !1, n.resistance && (i.currentTranslate = s.maxTranslate() + 1 - (s.maxTranslate() - i.startTranslate - f) ** w))), y && (c.preventedByNestedSwiper = !0), !s.allowSlideNext && "next" === s.swipeDirection && i.currentTranslate < i.startTranslate && (i.currentTranslate = i.startTranslate), !s.allowSlidePrev && "prev" === s.swipeDirection && i.currentTranslate > i.startTranslate && (i.currentTranslate = i.startTranslate), s.allowSlidePrev || s.allowSlideNext || (i.currentTranslate = i.startTranslate), n.threshold > 0) {
                    if (!(Math.abs(f) > n.threshold || i.allowThresholdMove)) return void(i.currentTranslate = i.startTranslate);
                    if (!i.allowThresholdMove) return i.allowThresholdMove = !0, r.startX = r.currentX, r.startY = r.currentY, i.currentTranslate = i.startTranslate, void(r.diff = s.isHorizontal() ? r.currentX - r.startX : r.currentY - r.startY)
                }
                n.followFinger && !n.cssMode && ((n.freeMode && n.freeMode.enabled && s.freeMode || n.watchSlidesProgress) && (s.updateActiveIndex(), s.updateSlidesClasses()), n.freeMode && n.freeMode.enabled && s.freeMode && s.freeMode.onTouchMove(), s.updateProgress(i.currentTranslate), s.setTranslate(i.currentTranslate))
            }

            function Rt(t) {
                const e = this,
                    s = e.touchEventsData;
                let i, n = t;
                n.originalEvent && (n = n.originalEvent);
                if ("touchend" === n.type || "touchcancel" === n.type) {
                    if (i = [...n.changedTouches].filter((t => t.identifier === s.touchId))[0], !i || i.identifier !== s.touchId) return
                } else {
                    if (null !== s.touchId) return;
                    if (n.pointerId !== s.pointerId) return;
                    i = n
                }
                if (["pointercancel", "pointerout", "pointerleave", "contextmenu"].includes(n.type)) {
                    if (!(["pointercancel", "contextmenu"].includes(n.type) && (e.browser.isSafari || e.browser.isWebView))) return
                }
                s.pointerId = null, s.touchId = null;
                const {
                    params: r,
                    touches: a,
                    rtlTranslate: o,
                    slidesGrid: l,
                    enabled: c
                } = e;
                if (!c) return;
                if (!r.simulateTouch && "mouse" === n.pointerType) return;
                if (s.allowTouchCallbacks && e.emit("touchEnd", n), s.allowTouchCallbacks = !1, !s.isTouched) return s.isMoved && r.grabCursor && e.setGrabCursor(!1), s.isMoved = !1, void(s.startMoving = !1);
                r.grabCursor && s.isMoved && s.isTouched && (!0 === e.allowSlideNext || !0 === e.allowSlidePrev) && e.setGrabCursor(!1);
                const h = st(),
                    u = h - s.touchStartTime;
                if (e.allowClick) {
                    const t = n.path || n.composedPath && n.composedPath();
                    e.updateClickedSlide(t && t[0] || n.target, t), e.emit("tap click", n), u < 300 && h - s.lastClickTime < 300 && e.emit("doubleTap doubleClick", n)
                }
                if (s.lastClickTime = st(), et((() => {
                        e.destroyed || (e.allowClick = !0)
                    })), !s.isTouched || !s.isMoved || !e.swipeDirection || 0 === a.diff && !s.loopSwapReset || s.currentTranslate === s.startTranslate && !s.loopSwapReset) return s.isTouched = !1, s.isMoved = !1, void(s.startMoving = !1);
                let d;
                if (s.isTouched = !1, s.isMoved = !1, s.startMoving = !1, d = r.followFinger ? o ? e.translate : -e.translate : -s.currentTranslate, r.cssMode) return;
                if (r.freeMode && r.freeMode.enabled) return void e.freeMode.onTouchEnd({
                    currentPos: d
                });
                const p = d >= -e.maxTranslate() && !e.params.loop;
                let f = 0,
                    m = e.slidesSizesGrid[0];
                for (let t = 0; t < l.length; t += t < r.slidesPerGroupSkip ? 1 : r.slidesPerGroup) {
                    const e = t < r.slidesPerGroupSkip - 1 ? 1 : r.slidesPerGroup;
                    void 0 !== l[t + e] ? (p || d >= l[t] && d < l[t + e]) && (f = t, m = l[t + e] - l[t]) : (p || d >= l[t]) && (f = t, m = l[l.length - 1] - l[l.length - 2])
                }
                let g = null,
                    v = null;
                r.rewind && (e.isBeginning ? v = r.virtual && r.virtual.enabled && e.virtual ? e.virtual.slides.length - 1 : e.slides.length - 1 : e.isEnd && (g = 0));
                const b = (d - l[f]) / m,
                    y = f < r.slidesPerGroupSkip - 1 ? 1 : r.slidesPerGroup;
                if (u > r.longSwipesMs) {
                    if (!r.longSwipes) return void e.slideTo(e.activeIndex);
                    "next" === e.swipeDirection && (b >= r.longSwipesRatio ? e.slideTo(r.rewind && e.isEnd ? g : f + y) : e.slideTo(f)), "prev" === e.swipeDirection && (b > 1 - r.longSwipesRatio ? e.slideTo(f + y) : null !== v && b < 0 && Math.abs(b) > r.longSwipesRatio ? e.slideTo(v) : e.slideTo(f))
                } else {
                    if (!r.shortSwipes) return void e.slideTo(e.activeIndex);
                    e.navigation && (n.target === e.navigation.nextEl || n.target === e.navigation.prevEl) ? n.target === e.navigation.nextEl ? e.slideTo(f + y) : e.slideTo(f) : ("next" === e.swipeDirection && e.slideTo(null !== g ? g : f + y), "prev" === e.swipeDirection && e.slideTo(null !== v ? v : f))
                }
            }

            function Bt() {
                const t = this,
                    {
                        params: e,
                        el: s
                    } = t;
                if (s && 0 === s.offsetWidth) return;
                e.breakpoints && t.setBreakpoint();
                const {
                    allowSlideNext: i,
                    allowSlidePrev: n,
                    snapGrid: r
                } = t, a = t.virtual && t.params.virtual.enabled;
                t.allowSlideNext = !0, t.allowSlidePrev = !0, t.updateSize(), t.updateSlides(), t.updateSlidesClasses();
                const o = a && e.loop;
                !("auto" === e.slidesPerView || e.slidesPerView > 1) || !t.isEnd || t.isBeginning || t.params.centeredSlides || o ? t.params.loop && !a ? t.slideToLoop(t.realIndex, 0, !1, !0) : t.slideTo(t.activeIndex, 0, !1, !0) : t.slideTo(t.slides.length - 1, 0, !1, !0), t.autoplay && t.autoplay.running && t.autoplay.paused && (clearTimeout(t.autoplay.resizeTimeout), t.autoplay.resizeTimeout = setTimeout((() => {
                    t.autoplay && t.autoplay.running && t.autoplay.paused && t.autoplay.resume()
                }), 500)), t.allowSlidePrev = n, t.allowSlideNext = i, t.params.watchOverflow && r !== t.snapGrid && t.checkOverflow()
            }

            function Nt(t) {
                const e = this;
                e.enabled && (e.allowClick || (e.params.preventClicks && t.preventDefault(), e.params.preventClicksPropagation && e.animating && (t.stopPropagation(), t.stopImmediatePropagation())))
            }

            function Ht() {
                const t = this,
                    {
                        wrapperEl: e,
                        rtlTranslate: s,
                        enabled: i
                    } = t;
                if (!i) return;
                let n;
                t.previousTranslate = t.translate, t.isHorizontal() ? t.translate = -e.scrollLeft : t.translate = -e.scrollTop, 0 === t.translate && (t.translate = 0), t.updateActiveIndex(), t.updateSlidesClasses();
                const r = t.maxTranslate() - t.minTranslate();
                n = 0 === r ? 0 : (t.translate - t.minTranslate()) / r, n !== t.progress && t.updateProgress(s ? -t.translate : t.translate), t.emit("setTranslate", t.translate, !1)
            }

            function Gt(t) {
                const e = this;
                Pt(e, t.target), e.params.cssMode || "auto" !== e.params.slidesPerView && !e.params.autoHeight || e.update()
            }

            function Wt() {
                const t = this;
                t.documentTouchHandlerProceeded || (t.documentTouchHandlerProceeded = !0, t.params.touchReleaseOnEdges && (t.el.style.touchAction = "auto"))
            }
            const Ut = (t, e) => {
                const s = J(),
                    {
                        params: i,
                        el: n,
                        wrapperEl: r,
                        device: a
                    } = t,
                    o = !!i.nested,
                    l = "on" === e ? "addEventListener" : "removeEventListener",
                    c = e;
                n && "string" != typeof n && (s[l]("touchstart", t.onDocumentTouchStart, {
                    passive: !1,
                    capture: o
                }), n[l]("touchstart", t.onTouchStart, {
                    passive: !1
                }), n[l]("pointerdown", t.onTouchStart, {
                    passive: !1
                }), s[l]("touchmove", t.onTouchMove, {
                    passive: !1,
                    capture: o
                }), s[l]("pointermove", t.onTouchMove, {
                    passive: !1,
                    capture: o
                }), s[l]("touchend", t.onTouchEnd, {
                    passive: !0
                }), s[l]("pointerup", t.onTouchEnd, {
                    passive: !0
                }), s[l]("pointercancel", t.onTouchEnd, {
                    passive: !0
                }), s[l]("touchcancel", t.onTouchEnd, {
                    passive: !0
                }), s[l]("pointerout", t.onTouchEnd, {
                    passive: !0
                }), s[l]("pointerleave", t.onTouchEnd, {
                    passive: !0
                }), s[l]("contextmenu", t.onTouchEnd, {
                    passive: !0
                }), (i.preventClicks || i.preventClicksPropagation) && n[l]("click", t.onClick, !0), i.cssMode && r[l]("scroll", t.onScroll), i.updateOnWindowResize ? t[c](a.ios || a.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", Bt, !0) : t[c]("observerUpdate", Bt, !0), n[l]("load", t.onLoad, {
                    capture: !0
                }))
            };
            const Yt = (t, e) => t.grid && e.grid && e.grid.rows > 1;
            var Xt = {
                init: !0,
                direction: "horizontal",
                oneWayMovement: !1,
                swiperElementNodeName: "SWIPER-CONTAINER",
                touchEventsTarget: "wrapper",
                initialSlide: 0,
                speed: 300,
                cssMode: !1,
                updateOnWindowResize: !0,
                resizeObserver: !0,
                nested: !1,
                createElements: !1,
                eventsPrefix: "swiper",
                enabled: !0,
                focusableElements: "input, select, option, textarea, button, video, label",
                width: null,
                height: null,
                preventInteractionOnTransition: !1,
                userAgent: null,
                url: null,
                edgeSwipeDetection: !1,
                edgeSwipeThreshold: 20,
                autoHeight: !1,
                setWrapperSize: !1,
                virtualTranslate: !1,
                effect: "slide",
                breakpoints: void 0,
                breakpointsBase: "window",
                spaceBetween: 0,
                slidesPerView: 1,
                slidesPerGroup: 1,
                slidesPerGroupSkip: 0,
                slidesPerGroupAuto: !1,
                centeredSlides: !1,
                centeredSlidesBounds: !1,
                slidesOffsetBefore: 0,
                slidesOffsetAfter: 0,
                normalizeSlideIndex: !0,
                centerInsufficientSlides: !1,
                watchOverflow: !0,
                roundLengths: !1,
                touchRatio: 1,
                touchAngle: 45,
                simulateTouch: !0,
                shortSwipes: !0,
                longSwipes: !0,
                longSwipesRatio: .5,
                longSwipesMs: 300,
                followFinger: !0,
                allowTouchMove: !0,
                threshold: 5,
                touchMoveStopPropagation: !1,
                touchStartPreventDefault: !0,
                touchStartForcePreventDefault: !1,
                touchReleaseOnEdges: !1,
                uniqueNavElements: !0,
                resistance: !0,
                resistanceRatio: .85,
                watchSlidesProgress: !1,
                grabCursor: !1,
                preventClicks: !0,
                preventClicksPropagation: !0,
                slideToClickedSlide: !1,
                loop: !1,
                loopAddBlankSlides: !0,
                loopAdditionalSlides: 0,
                loopPreventsSliding: !0,
                rewind: !1,
                allowSlidePrev: !0,
                allowSlideNext: !0,
                swipeHandler: null,
                noSwiping: !0,
                noSwipingClass: "swiper-no-swiping",
                noSwipingSelector: null,
                passiveListeners: !0,
                maxBackfaceHiddenSlides: 10,
                containerModifierClass: "swiper-",
                slideClass: "swiper-slide",
                slideBlankClass: "swiper-slide-blank",
                slideActiveClass: "swiper-slide-active",
                slideVisibleClass: "swiper-slide-visible",
                slideFullyVisibleClass: "swiper-slide-fully-visible",
                slideNextClass: "swiper-slide-next",
                slidePrevClass: "swiper-slide-prev",
                wrapperClass: "swiper-wrapper",
                lazyPreloaderClass: "swiper-lazy-preloader",
                lazyPreloadPrevNext: 0,
                runCallbacksOnInit: !0,
                _emitClasses: !1
            };

            function Qt(t, e) {
                return function(s) {
                    void 0 === s && (s = {});
                    const i = Object.keys(s)[0],
                        n = s[i];
                    "object" == typeof n && null !== n ? (!0 === t[i] && (t[i] = {
                        enabled: !0
                    }), "navigation" === i && t[i] && t[i].enabled && !t[i].prevEl && !t[i].nextEl && (t[i].auto = !0), ["pagination", "scrollbar"].indexOf(i) >= 0 && t[i] && t[i].enabled && !t[i].el && (t[i].auto = !0), i in t && "enabled" in n ? ("object" != typeof t[i] || "enabled" in t[i] || (t[i].enabled = !0), t[i] || (t[i] = {
                        enabled: !1
                    }), rt(e, s)) : rt(e, s)) : rt(e, s)
                }
            }
            const Kt = {
                    eventsEmitter: $t,
                    update: Ot,
                    translate: It,
                    transition: {
                        setTransition: function(t, e) {
                            const s = this;
                            s.params.cssMode || (s.wrapperEl.style.transitionDuration = `${t}ms`, s.wrapperEl.style.transitionDelay = 0 === t ? "0ms" : ""), s.emit("setTransition", t, e)
                        },
                        transitionStart: function(t, e) {
                            void 0 === t && (t = !0);
                            const s = this,
                                {
                                    params: i
                                } = s;
                            i.cssMode || (i.autoHeight && s.updateAutoHeight(), qt({
                                swiper: s,
                                runCallbacks: t,
                                direction: e,
                                step: "Start"
                            }))
                        },
                        transitionEnd: function(t, e) {
                            void 0 === t && (t = !0);
                            const s = this,
                                {
                                    params: i
                                } = s;
                            s.animating = !1, i.cssMode || (s.setTransition(0), qt({
                                swiper: s,
                                runCallbacks: t,
                                direction: e,
                                step: "End"
                            }))
                        }
                    },
                    slide: Dt,
                    loop: zt,
                    grabCursor: {
                        setGrabCursor: function(t) {
                            const e = this;
                            if (!e.params.simulateTouch || e.params.watchOverflow && e.isLocked || e.params.cssMode) return;
                            const s = "container" === e.params.touchEventsTarget ? e.el : e.wrapperEl;
                            e.isElement && (e.__preventObserver__ = !0), s.style.cursor = "move", s.style.cursor = t ? "grabbing" : "grab", e.isElement && requestAnimationFrame((() => {
                                e.__preventObserver__ = !1
                            }))
                        },
                        unsetGrabCursor: function() {
                            const t = this;
                            t.params.watchOverflow && t.isLocked || t.params.cssMode || (t.isElement && (t.__preventObserver__ = !0), t["container" === t.params.touchEventsTarget ? "el" : "wrapperEl"].style.cursor = "", t.isElement && requestAnimationFrame((() => {
                                t.__preventObserver__ = !1
                            })))
                        }
                    },
                    events: {
                        attachEvents: function() {
                            const t = this,
                                {
                                    params: e
                                } = t;
                            t.onTouchStart = jt.bind(t), t.onTouchMove = Ft.bind(t), t.onTouchEnd = Rt.bind(t), t.onDocumentTouchStart = Wt.bind(t), e.cssMode && (t.onScroll = Ht.bind(t)), t.onClick = Nt.bind(t), t.onLoad = Gt.bind(t), Ut(t, "on")
                        },
                        detachEvents: function() {
                            Ut(this, "off")
                        }
                    },
                    breakpoints: {
                        setBreakpoint: function() {
                            const t = this,
                                {
                                    realIndex: e,
                                    initialized: s,
                                    params: i,
                                    el: n
                                } = t,
                                r = i.breakpoints;
                            if (!r || r && 0 === Object.keys(r).length) return;
                            const a = t.getBreakpoint(r, t.params.breakpointsBase, t.el);
                            if (!a || t.currentBreakpoint === a) return;
                            const o = (a in r ? r[a] : void 0) || t.originalParams,
                                l = Yt(t, i),
                                c = Yt(t, o),
                                h = t.params.grabCursor,
                                u = o.grabCursor,
                                d = i.enabled;
                            l && !c ? (n.classList.remove(`${i.containerModifierClass}grid`, `${i.containerModifierClass}grid-column`), t.emitContainerClasses()) : !l && c && (n.classList.add(`${i.containerModifierClass}grid`), (o.grid.fill && "column" === o.grid.fill || !o.grid.fill && "column" === i.grid.fill) && n.classList.add(`${i.containerModifierClass}grid-column`), t.emitContainerClasses()), h && !u ? t.unsetGrabCursor() : !h && u && t.setGrabCursor(), ["navigation", "pagination", "scrollbar"].forEach((e => {
                                if (void 0 === o[e]) return;
                                const s = i[e] && i[e].enabled,
                                    n = o[e] && o[e].enabled;
                                s && !n && t[e].disable(), !s && n && t[e].enable()
                            }));
                            const p = o.direction && o.direction !== i.direction,
                                f = i.loop && (o.slidesPerView !== i.slidesPerView || p),
                                m = i.loop;
                            p && s && t.changeDirection(), rt(t.params, o);
                            const g = t.params.enabled,
                                v = t.params.loop;
                            Object.assign(t, {
                                allowTouchMove: t.params.allowTouchMove,
                                allowSlideNext: t.params.allowSlideNext,
                                allowSlidePrev: t.params.allowSlidePrev
                            }), d && !g ? t.disable() : !d && g && t.enable(), t.currentBreakpoint = a, t.emit("_beforeBreakpoint", o), s && (f ? (t.loopDestroy(), t.loopCreate(e), t.updateSlides()) : !m && v ? (t.loopCreate(e), t.updateSlides()) : m && !v && t.loopDestroy()), t.emit("breakpoint", o)
                        },
                        getBreakpoint: function(t, e, s) {
                            if (void 0 === e && (e = "window"), !t || "container" === e && !s) return;
                            let i = !1;
                            const n = tt(),
                                r = "window" === e ? n.innerHeight : s.clientHeight,
                                a = Object.keys(t).map((t => {
                                    if ("string" == typeof t && 0 === t.indexOf("@")) {
                                        const e = parseFloat(t.substr(1));
                                        return {
                                            value: r * e,
                                            point: t
                                        }
                                    }
                                    return {
                                        value: t,
                                        point: t
                                    }
                                }));
                            a.sort(((t, e) => parseInt(t.value, 10) - parseInt(e.value, 10)));
                            for (let t = 0; t < a.length; t += 1) {
                                const {
                                    point: r,
                                    value: o
                                } = a[t];
                                "window" === e ? n.matchMedia(`(min-width: ${o}px)`).matches && (i = r) : o <= s.clientWidth && (i = r)
                            }
                            return i || "max"
                        }
                    },
                    checkOverflow: {
                        checkOverflow: function() {
                            const t = this,
                                {
                                    isLocked: e,
                                    params: s
                                } = t,
                                {
                                    slidesOffsetBefore: i
                                } = s;
                            if (i) {
                                const e = t.slides.length - 1,
                                    s = t.slidesGrid[e] + t.slidesSizesGrid[e] + 2 * i;
                                t.isLocked = t.size > s
                            } else t.isLocked = 1 === t.snapGrid.length;
                            !0 === s.allowSlideNext && (t.allowSlideNext = !t.isLocked), !0 === s.allowSlidePrev && (t.allowSlidePrev = !t.isLocked), e && e !== t.isLocked && (t.isEnd = !1), e !== t.isLocked && t.emit(t.isLocked ? "lock" : "unlock")
                        }
                    },
                    classes: {
                        addClasses: function() {
                            const t = this,
                                {
                                    classNames: e,
                                    params: s,
                                    rtl: i,
                                    el: n,
                                    device: r
                                } = t,
                                a = function(t, e) {
                                    const s = [];
                                    return t.forEach((t => {
                                        "object" == typeof t ? Object.keys(t).forEach((i => {
                                            t[i] && s.push(e + i)
                                        })) : "string" == typeof t && s.push(e + t)
                                    })), s
                                }(["initialized", s.direction, {
                                    "free-mode": t.params.freeMode && s.freeMode.enabled
                                }, {
                                    autoheight: s.autoHeight
                                }, {
                                    rtl: i
                                }, {
                                    grid: s.grid && s.grid.rows > 1
                                }, {
                                    "grid-column": s.grid && s.grid.rows > 1 && "column" === s.grid.fill
                                }, {
                                    android: r.android
                                }, {
                                    ios: r.ios
                                }, {
                                    "css-mode": s.cssMode
                                }, {
                                    centered: s.cssMode && s.centeredSlides
                                }, {
                                    "watch-progress": s.watchSlidesProgress
                                }], s.containerModifierClass);
                            e.push(...a), n.classList.add(...e), t.emitContainerClasses()
                        },
                        removeClasses: function() {
                            const {
                                el: t,
                                classNames: e
                            } = this;
                            t && "string" != typeof t && (t.classList.remove(...e), this.emitContainerClasses())
                        }
                    }
                },
                Jt = {};
            class Zt {
                constructor() {
                    let t, e;
                    for (var s = arguments.length, i = new Array(s), n = 0; n < s; n++) i[n] = arguments[n];
                    1 === i.length && i[0].constructor && "Object" === Object.prototype.toString.call(i[0]).slice(8, -1) ? e = i[0] : [t, e] = i, e || (e = {}), e = rt({}, e), t && !e.el && (e.el = t);
                    const r = J();
                    if (e.el && "string" == typeof e.el && r.querySelectorAll(e.el).length > 1) {
                        const t = [];
                        return r.querySelectorAll(e.el).forEach((s => {
                            const i = rt({}, e, {
                                el: s
                            });
                            t.push(new Zt(i))
                        })), t
                    }
                    const a = this;
                    a.__swiper__ = !0, a.support = xt(), a.device = St({
                        userAgent: e.userAgent
                    }), a.browser = Et(), a.eventsListeners = {}, a.eventsAnyListeners = [], a.modules = [...a.__modules__], e.modules && Array.isArray(e.modules) && a.modules.push(...e.modules);
                    const o = {};
                    a.modules.forEach((t => {
                        t({
                            params: e,
                            swiper: a,
                            extendParams: Qt(e, o),
                            on: a.on.bind(a),
                            once: a.once.bind(a),
                            off: a.off.bind(a),
                            emit: a.emit.bind(a)
                        })
                    }));
                    const l = rt({}, Xt, o);
                    return a.params = rt({}, l, Jt, e), a.originalParams = rt({}, a.params), a.passedParams = rt({}, e), a.params && a.params.on && Object.keys(a.params.on).forEach((t => {
                        a.on(t, a.params.on[t])
                    })), a.params && a.params.onAny && a.onAny(a.params.onAny), Object.assign(a, {
                        enabled: a.params.enabled,
                        el: t,
                        classNames: [],
                        slides: [],
                        slidesGrid: [],
                        snapGrid: [],
                        slidesSizesGrid: [],
                        isHorizontal: () => "horizontal" === a.params.direction,
                        isVertical: () => "vertical" === a.params.direction,
                        activeIndex: 0,
                        realIndex: 0,
                        isBeginning: !0,
                        isEnd: !1,
                        translate: 0,
                        previousTranslate: 0,
                        progress: 0,
                        velocity: 0,
                        animating: !1,
                        cssOverflowAdjustment() {
                            return Math.trunc(this.translate / 2 ** 23) * 2 ** 23
                        },
                        allowSlideNext: a.params.allowSlideNext,
                        allowSlidePrev: a.params.allowSlidePrev,
                        touchEventsData: {
                            isTouched: void 0,
                            isMoved: void 0,
                            allowTouchCallbacks: void 0,
                            touchStartTime: void 0,
                            isScrolling: void 0,
                            currentTranslate: void 0,
                            startTranslate: void 0,
                            allowThresholdMove: void 0,
                            focusableElements: a.params.focusableElements,
                            lastClickTime: 0,
                            clickTimeout: void 0,
                            velocities: [],
                            allowMomentumBounce: void 0,
                            startMoving: void 0,
                            pointerId: null,
                            touchId: null
                        },
                        allowClick: !0,
                        allowTouchMove: a.params.allowTouchMove,
                        touches: {
                            startX: 0,
                            startY: 0,
                            currentX: 0,
                            currentY: 0,
                            diff: 0
                        },
                        imagesToLoad: [],
                        imagesLoaded: 0
                    }), a.emit("_swiper"), a.params.init && a.init(), a
                }
                getDirectionLabel(t) {
                    return this.isHorizontal() ? t : {
                        width: "height",
                        "margin-top": "margin-left",
                        "margin-bottom ": "margin-right",
                        "margin-left": "margin-top",
                        "margin-right": "margin-bottom",
                        "padding-left": "padding-top",
                        "padding-right": "padding-bottom",
                        marginRight: "marginBottom"
                    }[t]
                }
                getSlideIndex(t) {
                    const {
                        slidesEl: e,
                        params: s
                    } = this, i = dt(lt(e, `.${s.slideClass}, swiper-slide`)[0]);
                    return dt(t) - i
                }
                getSlideIndexByData(t) {
                    return this.getSlideIndex(this.slides.filter((e => 1 * e.getAttribute("data-swiper-slide-index") === t))[0])
                }
                recalcSlides() {
                    const {
                        slidesEl: t,
                        params: e
                    } = this;
                    this.slides = lt(t, `.${e.slideClass}, swiper-slide`)
                }
                enable() {
                    const t = this;
                    t.enabled || (t.enabled = !0, t.params.grabCursor && t.setGrabCursor(), t.emit("enable"))
                }
                disable() {
                    const t = this;
                    t.enabled && (t.enabled = !1, t.params.grabCursor && t.unsetGrabCursor(), t.emit("disable"))
                }
                setProgress(t, e) {
                    const s = this;
                    t = Math.min(Math.max(t, 0), 1);
                    const i = s.minTranslate(),
                        n = (s.maxTranslate() - i) * t + i;
                    s.translateTo(n, void 0 === e ? 0 : e), s.updateActiveIndex(), s.updateSlidesClasses()
                }
                emitContainerClasses() {
                    const t = this;
                    if (!t.params._emitClasses || !t.el) return;
                    const e = t.el.className.split(" ").filter((e => 0 === e.indexOf("swiper") || 0 === e.indexOf(t.params.containerModifierClass)));
                    t.emit("_containerClasses", e.join(" "))
                }
                getSlideClasses(t) {
                    const e = this;
                    return e.destroyed ? "" : t.className.split(" ").filter((t => 0 === t.indexOf("swiper-slide") || 0 === t.indexOf(e.params.slideClass))).join(" ")
                }
                emitSlidesClasses() {
                    const t = this;
                    if (!t.params._emitClasses || !t.el) return;
                    const e = [];
                    t.slides.forEach((s => {
                        const i = t.getSlideClasses(s);
                        e.push({
                            slideEl: s,
                            classNames: i
                        }), t.emit("_slideClass", s, i)
                    })), t.emit("_slideClasses", e)
                }
                slidesPerViewDynamic(t, e) {
                    void 0 === t && (t = "current"), void 0 === e && (e = !1);
                    const {
                        params: s,
                        slides: i,
                        slidesGrid: n,
                        slidesSizesGrid: r,
                        size: a,
                        activeIndex: o
                    } = this;
                    let l = 1;
                    if ("number" == typeof s.slidesPerView) return s.slidesPerView;
                    if (s.centeredSlides) {
                        let t, e = i[o] ? Math.ceil(i[o].swiperSlideSize) : 0;
                        for (let s = o + 1; s < i.length; s += 1) i[s] && !t && (e += Math.ceil(i[s].swiperSlideSize), l += 1, e > a && (t = !0));
                        for (let s = o - 1; s >= 0; s -= 1) i[s] && !t && (e += i[s].swiperSlideSize, l += 1, e > a && (t = !0))
                    } else if ("current" === t)
                        for (let t = o + 1; t < i.length; t += 1) {
                            (e ? n[t] + r[t] - n[o] < a : n[t] - n[o] < a) && (l += 1)
                        } else
                            for (let t = o - 1; t >= 0; t -= 1) {
                                n[o] - n[t] < a && (l += 1)
                            }
                    return l
                }
                update() {
                    const t = this;
                    if (!t || t.destroyed) return;
                    const {
                        snapGrid: e,
                        params: s
                    } = t;

                    function i() {
                        const e = t.rtlTranslate ? -1 * t.translate : t.translate,
                            s = Math.min(Math.max(e, t.maxTranslate()), t.minTranslate());
                        t.setTranslate(s), t.updateActiveIndex(), t.updateSlidesClasses()
                    }
                    let n;
                    if (s.breakpoints && t.setBreakpoint(), [...t.el.querySelectorAll('[loading="lazy"]')].forEach((e => {
                            e.complete && Pt(t, e)
                        })), t.updateSize(), t.updateSlides(), t.updateProgress(), t.updateSlidesClasses(), s.freeMode && s.freeMode.enabled && !s.cssMode) i(), s.autoHeight && t.updateAutoHeight();
                    else {
                        if (("auto" === s.slidesPerView || s.slidesPerView > 1) && t.isEnd && !s.centeredSlides) {
                            const e = t.virtual && s.virtual.enabled ? t.virtual.slides : t.slides;
                            n = t.slideTo(e.length - 1, 0, !1, !0)
                        } else n = t.slideTo(t.activeIndex, 0, !1, !0);
                        n || i()
                    }
                    s.watchOverflow && e !== t.snapGrid && t.checkOverflow(), t.emit("update")
                }
                changeDirection(t, e) {
                    void 0 === e && (e = !0);
                    const s = this,
                        i = s.params.direction;
                    return t || (t = "horizontal" === i ? "vertical" : "horizontal"), t === i || "horizontal" !== t && "vertical" !== t || (s.el.classList.remove(`${s.params.containerModifierClass}${i}`), s.el.classList.add(`${s.params.containerModifierClass}${t}`), s.emitContainerClasses(), s.params.direction = t, s.slides.forEach((e => {
                        "vertical" === t ? e.style.width = "" : e.style.height = ""
                    })), s.emit("changeDirection"), e && s.update()), s
                }
                changeLanguageDirection(t) {
                    const e = this;
                    e.rtl && "rtl" === t || !e.rtl && "ltr" === t || (e.rtl = "rtl" === t, e.rtlTranslate = "horizontal" === e.params.direction && e.rtl, e.rtl ? (e.el.classList.add(`${e.params.containerModifierClass}rtl`), e.el.dir = "rtl") : (e.el.classList.remove(`${e.params.containerModifierClass}rtl`), e.el.dir = "ltr"), e.update())
                }
                mount(t) {
                    const e = this;
                    if (e.mounted) return !0;
                    let s = t || e.params.el;
                    if ("string" == typeof s && (s = document.querySelector(s)), !s) return !1;
                    s.swiper = e, s.parentNode && s.parentNode.host && s.parentNode.host.nodeName === e.params.swiperElementNodeName.toUpperCase() && (e.isElement = !0);
                    const i = () => `.${(e.params.wrapperClass||"").trim().split(" ").join(".")}`;
                    let n = (() => {
                        if (s && s.shadowRoot && s.shadowRoot.querySelector) {
                            return s.shadowRoot.querySelector(i())
                        }
                        return lt(s, i())[0]
                    })();
                    return !n && e.params.createElements && (n = ht("div", e.params.wrapperClass), s.append(n), lt(s, `.${e.params.slideClass}`).forEach((t => {
                        n.append(t)
                    }))), Object.assign(e, {
                        el: s,
                        wrapperEl: n,
                        slidesEl: e.isElement && !s.parentNode.host.slideSlots ? s.parentNode.host : n,
                        hostEl: e.isElement ? s.parentNode.host : s,
                        mounted: !0,
                        rtl: "rtl" === s.dir.toLowerCase() || "rtl" === ut(s, "direction"),
                        rtlTranslate: "horizontal" === e.params.direction && ("rtl" === s.dir.toLowerCase() || "rtl" === ut(s, "direction")),
                        wrongRTL: "-webkit-box" === ut(n, "display")
                    }), !0
                }
                init(t) {
                    const e = this;
                    if (e.initialized) return e;
                    if (!1 === e.mount(t)) return e;
                    e.emit("beforeInit"), e.params.breakpoints && e.setBreakpoint(), e.addClasses(), e.updateSize(), e.updateSlides(), e.params.watchOverflow && e.checkOverflow(), e.params.grabCursor && e.enabled && e.setGrabCursor(), e.params.loop && e.virtual && e.params.virtual.enabled ? e.slideTo(e.params.initialSlide + e.virtual.slidesBefore, 0, e.params.runCallbacksOnInit, !1, !0) : e.slideTo(e.params.initialSlide, 0, e.params.runCallbacksOnInit, !1, !0), e.params.loop && e.loopCreate(), e.attachEvents();
                    const s = [...e.el.querySelectorAll('[loading="lazy"]')];
                    return e.isElement && s.push(...e.hostEl.querySelectorAll('[loading="lazy"]')), s.forEach((t => {
                        t.complete ? Pt(e, t) : t.addEventListener("load", (t => {
                            Pt(e, t.target)
                        }))
                    })), Lt(e), e.initialized = !0, Lt(e), e.emit("init"), e.emit("afterInit"), e
                }
                destroy(t, e) {
                    void 0 === t && (t = !0), void 0 === e && (e = !0);
                    const s = this,
                        {
                            params: i,
                            el: n,
                            wrapperEl: r,
                            slides: a
                        } = s;
                    return void 0 === s.params || s.destroyed || (s.emit("beforeDestroy"), s.initialized = !1, s.detachEvents(), i.loop && s.loopDestroy(), e && (s.removeClasses(), n && "string" != typeof n && n.removeAttribute("style"), r && r.removeAttribute("style"), a && a.length && a.forEach((t => {
                        t.classList.remove(i.slideVisibleClass, i.slideFullyVisibleClass, i.slideActiveClass, i.slideNextClass, i.slidePrevClass), t.removeAttribute("style"), t.removeAttribute("data-swiper-slide-index")
                    }))), s.emit("destroy"), Object.keys(s.eventsListeners).forEach((t => {
                        s.off(t)
                    })), !1 !== t && (s.el && "string" != typeof s.el && (s.el.swiper = null), function(t) {
                        const e = t;
                        Object.keys(e).forEach((t => {
                            try {
                                e[t] = null
                            } catch (t) {}
                            try {
                                delete e[t]
                            } catch (t) {}
                        }))
                    }(s)), s.destroyed = !0), null
                }
                static extendDefaults(t) {
                    rt(Jt, t)
                }
                static get extendedDefaults() {
                    return Jt
                }
                static get defaults() {
                    return Xt
                }
                static installModule(t) {
                    Zt.prototype.__modules__ || (Zt.prototype.__modules__ = []);
                    const e = Zt.prototype.__modules__;
                    "function" == typeof t && e.indexOf(t) < 0 && e.push(t)
                }
                static use(t) {
                    return Array.isArray(t) ? (t.forEach((t => Zt.installModule(t))), Zt) : (Zt.installModule(t), Zt)
                }
            }
            Object.keys(Kt).forEach((t => {
                Object.keys(Kt[t]).forEach((e => {
                    Zt.prototype[e] = Kt[t][e]
                }))
            })), Zt.use([function(t) {
                let {
                    swiper: e,
                    on: s,
                    emit: i
                } = t;
                const n = tt();
                let r = null,
                    a = null;
                const o = () => {
                        e && !e.destroyed && e.initialized && (i("beforeResize"), i("resize"))
                    },
                    l = () => {
                        e && !e.destroyed && e.initialized && i("orientationchange")
                    };
                s("init", (() => {
                    e.params.resizeObserver && void 0 !== n.ResizeObserver ? e && !e.destroyed && e.initialized && (r = new ResizeObserver((t => {
                        a = n.requestAnimationFrame((() => {
                            const {
                                width: s,
                                height: i
                            } = e;
                            let n = s,
                                r = i;
                            t.forEach((t => {
                                let {
                                    contentBoxSize: s,
                                    contentRect: i,
                                    target: a
                                } = t;
                                a && a !== e.el || (n = i ? i.width : (s[0] || s).inlineSize, r = i ? i.height : (s[0] || s).blockSize)
                            })), n === s && r === i || o()
                        }))
                    })), r.observe(e.el)) : (n.addEventListener("resize", o), n.addEventListener("orientationchange", l))
                })), s("destroy", (() => {
                    a && n.cancelAnimationFrame(a), r && r.unobserve && e.el && (r.unobserve(e.el), r = null), n.removeEventListener("resize", o), n.removeEventListener("orientationchange", l)
                }))
            }, function(t) {
                let {
                    swiper: e,
                    extendParams: s,
                    on: i,
                    emit: n
                } = t;
                const r = [],
                    a = tt(),
                    o = function(t, s) {
                        void 0 === s && (s = {});
                        const i = new(a.MutationObserver || a.WebkitMutationObserver)((t => {
                            if (e.__preventObserver__) return;
                            if (1 === t.length) return void n("observerUpdate", t[0]);
                            const s = function() {
                                n("observerUpdate", t[0])
                            };
                            a.requestAnimationFrame ? a.requestAnimationFrame(s) : a.setTimeout(s, 0)
                        }));
                        i.observe(t, {
                            attributes: void 0 === s.attributes || s.attributes,
                            childList: e.isElement || (void 0 === s.childList || s).childList,
                            characterData: void 0 === s.characterData || s.characterData
                        }), r.push(i)
                    };
                s({
                    observer: !1,
                    observeParents: !1,
                    observeSlideChildren: !1
                }), i("init", (() => {
                    if (e.params.observer) {
                        if (e.params.observeParents) {
                            const t = pt(e.hostEl);
                            for (let e = 0; e < t.length; e += 1) o(t[e])
                        }
                        o(e.hostEl, {
                            childList: e.params.observeSlideChildren
                        }), o(e.wrapperEl, {
                            attributes: !1
                        })
                    }
                })), i("destroy", (() => {
                    r.forEach((t => {
                        t.disconnect()
                    })), r.splice(0, r.length)
                }))
            }]);
            const te = class {
                constructor(t) {
                    this.swiper = t, this.initSwiper()
                }
                initSwiper() {
                    new Zt(this.swiper, {
                        modules: [wt, vt],
                        slidesPerView: 3,
                        spaceBetween: 24,
                        loop: !0,
                        speed: 3700,
                        waitForTransition: !1,
                        loopAdditionalSlides: 6,
                        autoplay: {
                            delay: 0,
                            disableOnInteraction: !0
                        },
                        allowTouchMove: !1,
                        breakpoints: {
                            500: {
                                slidesPerView: 4
                            },
                            600: {
                                slidesPerView: 5
                            },
                            768: {
                                slidesPerView: 6,
                                spaceBetween: 48
                            }
                        }
                    })
                }
            };
            const ee = class {
                constructor(t) {
                    this.swiper = t, this.initSwiper(), t.swiper = this
                }
                initSwiper() {
                    new Zt(this.swiper, {
                        modules: [vt],
                        slidesPerView: 1.5,
                        spaceBetween: 24,
                        navigation: {
                            nextEl: this.swiper.querySelector(".swiper-button-next"),
                            prevEl: this.swiper.querySelector(".swiper-button-prev")
                        },
                        breakpoints: {
                            768: {
                                slidesPerView: 2.5
                            },
                            1280: {
                                slidesPerView: 3
                            }
                        }
                    })
                }
            };
            const se = class {
                constructor(t) {
                    this.swiper = t, this.initSwiper(), t.swiper = this, window.addEventListener("resize", this.handleResize.bind(this))
                }
                initSwiper() {
                    if (window.innerWidth < 640) {
                        new Zt(this.swiper, {
                            modules: [vt],
                            slidesPerView: 1.1,
                            spaceBetween: 24,
                            navigation: {
                                nextEl: this.swiper.querySelector(".swiper-button-next"),
                                prevEl: this.swiper.querySelector(".swiper-button-prev")
                            },
                            breakpoints: {
                                639: {
                                    spaceBetween: 24,
                                    slidesPerView: 2
                                },
                                1024: {
                                    spaceBetween: 32,
                                    slidesPerView: 3
                                }
                            }
                        })
                    }
                }
                handleResize() {
                    const t = window.innerWidth;
                    t >= 640 && this.swiperInstance && (this.swiperInstance.destroy(!0, !0), this.swiperInstance = null), t < 640 && !this.swiperInstance && this.initSwiper()
                }
            };
            const ie = class {
                constructor(t) {
                    this.swiper = t, this.initSwiper(), t.swiper = this, window.addEventListener("resize", this.handleResize.bind(this))
                }
                initSwiper() {
                    window.innerWidth < 640 && (this.swiperInstance = new Zt(this.swiper, {
                        modules: [vt],
                        slidesPerView: 1.1,
                        spaceBetween: 24,
                        navigation: {
                            nextEl: this.swiper.querySelector(".swiper-button-next"),
                            prevEl: this.swiper.querySelector(".swiper-button-prev")
                        },
                        breakpoints: {
                            639: {
                                spaceBetween: 24,
                                slidesPerView: 2
                            },
                            1024: {
                                spaceBetween: 32,
                                slidesPerView: 3
                            }
                        }
                    }))
                }
                handleResize() {
                    const t = window.innerWidth;
                    t >= 640 && this.swiperInstance && (this.swiperInstance.destroy(!0, !0), this.swiperInstance = null), t < 640 && !this.swiperInstance && this.initSwiper()
                }
            };
            const ne = class {
                constructor(t) {
                    this.swiper = t, this.parent = t.closest(".swiper-parent"), this.initSwiper(), t.swiper = this
                }
                initSwiper() {
                    this.swiperInstance = new Zt(this.swiper, {
                        modules: [vt],
                        slidesPerView: 1.1,
                        spaceBetween: 24,
                        navigation: {
                            nextEl: this.parent.closest(".swiper-parent").querySelector(".swiper-button-next"),
                            prevEl: this.parent.closest(".swiper-parent").querySelector(".swiper-button-prev")
                        },
                        breakpoints: {
                            639: {
                                spaceBetween: 24,
                                slidesPerView: 2
                            },
                            1024: {
                                spaceBetween: 32,
                                slidesPerView: "auto"
                            }
                        }
                    })
                }
            };
            const re = class {
                constructor(t) {
                    this.swiper = t, this.initSwiper(), t.swiper = this
                }
                initSwiper() {
                    new Zt(this.swiper, {
                        modules: [vt],
                        slidesPerView: 1,
                        spaceBetween: 24,
                        navigation: {
                            nextEl: this.swiper.querySelector(".swiper-button-next"),
                            prevEl: this.swiper.querySelector(".swiper-button-prev")
                        },
                        breakpoints: {
                            768: {
                                spaceBetween: 24,
                                slidesPerView: 2
                            },
                            1024: {
                                spaceBetween: 32,
                                slidesPerView: 2
                            }
                        }
                    })
                }
            };

            function ae(t) {
                if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return t
            }

            function oe(t, e) {
                t.prototype = Object.create(e.prototype), t.prototype.constructor = t, t.__proto__ = e
            }
            var le, ce, he, ue, de, pe, fe, me, ge, ve, be, ye, we, Te, _e, ke, xe, Se = {
                    autoSleep: 120,
                    force3D: "auto",
                    nullTargetWarn: 1,
                    units: {
                        lineHeight: ""
                    }
                },
                Ee = {
                    duration: .5,
                    overwrite: !1,
                    delay: 0
                },
                $e = 1e8,
                Ce = 1e-8,
                Me = 2 * Math.PI,
                Pe = Me / 4,
                Ae = 0,
                Le = Math.sqrt,
                Oe = Math.cos,
                Ie = Math.sin,
                qe = function(t) {
                    return "string" == typeof t
                },
                De = function(t) {
                    return "function" == typeof t
                },
                ze = function(t) {
                    return "number" == typeof t
                },
                Ve = function(t) {
                    return void 0 === t
                },
                je = function(t) {
                    return "object" == typeof t
                },
                Fe = function(t) {
                    return !1 !== t
                },
                Re = function() {
                    return "undefined" != typeof window
                },
                Be = function(t) {
                    return De(t) || qe(t)
                },
                Ne = "function" == typeof ArrayBuffer && ArrayBuffer.isView || function() {},
                He = Array.isArray,
                Ge = /(?:-?\.?\d|\.)+/gi,
                We = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,
                Ue = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g,
                Ye = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,
                Xe = /[+-]=-?[.\d]+/,
                Qe = /[^,'"\[\]\s]+/gi,
                Ke = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,
                Je = {},
                Ze = {},
                ts = function(t) {
                    return (Ze = Ms(t, Je)) && An
                },
                es = function(t, e) {
                    return console.warn("Invalid property", t, "set to", e, "Missing plugin? gsap.registerPlugin()")
                },
                ss = function(t, e) {
                    return !e && console.warn(t)
                },
                is = function(t, e) {
                    return t && (Je[t] = e) && Ze && (Ze[t] = e) || Je
                },
                ns = function() {
                    return 0
                },
                rs = {
                    suppressEvents: !0,
                    isStart: !0,
                    kill: !1
                },
                as = {
                    suppressEvents: !0,
                    kill: !1
                },
                os = {
                    suppressEvents: !0
                },
                ls = {},
                cs = [],
                hs = {},
                us = {},
                ds = {},
                ps = 30,
                fs = [],
                ms = "",
                gs = function(t) {
                    var e, s, i = t[0];
                    if (je(i) || De(i) || (t = [t]), !(e = (i._gsap || {}).harness)) {
                        for (s = fs.length; s-- && !fs[s].targetTest(i););
                        e = fs[s]
                    }
                    for (s = t.length; s--;) t[s] && (t[s]._gsap || (t[s]._gsap = new Hi(t[s], e))) || t.splice(s, 1);
                    return t
                },
                vs = function(t) {
                    return t._gsap || gs(oi(t))[0]._gsap
                },
                bs = function(t, e, s) {
                    return (s = t[e]) && De(s) ? t[e]() : Ve(s) && t.getAttribute && t.getAttribute(e) || s
                },
                ys = function(t, e) {
                    return (t = t.split(",")).forEach(e) || t
                },
                ws = function(t) {
                    return Math.round(1e5 * t) / 1e5 || 0
                },
                Ts = function(t) {
                    return Math.round(1e7 * t) / 1e7 || 0
                },
                _s = function(t, e) {
                    var s = e.charAt(0),
                        i = parseFloat(e.substr(2));
                    return t = parseFloat(t), "+" === s ? t + i : "-" === s ? t - i : "*" === s ? t * i : t / i
                },
                ks = function(t, e) {
                    for (var s = e.length, i = 0; t.indexOf(e[i]) < 0 && ++i < s;);
                    return i < s
                },
                xs = function() {
                    var t, e, s = cs.length,
                        i = cs.slice(0);
                    for (hs = {}, cs.length = 0, t = 0; t < s; t++)(e = i[t]) && e._lazy && (e.render(e._lazy[0], e._lazy[1], !0)._lazy = 0)
                },
                Ss = function(t, e, s, i) {
                    cs.length && !ce && xs(), t.render(e, s, i || ce && e < 0 && (t._initted || t._startAt)), cs.length && !ce && xs()
                },
                Es = function(t) {
                    var e = parseFloat(t);
                    return (e || 0 === e) && (t + "").match(Qe).length < 2 ? e : qe(t) ? t.trim() : t
                },
                $s = function(t) {
                    return t
                },
                Cs = function(t, e) {
                    for (var s in e) s in t || (t[s] = e[s]);
                    return t
                },
                Ms = function(t, e) {
                    for (var s in e) t[s] = e[s];
                    return t
                },
                Ps = function t(e, s) {
                    for (var i in s) "__proto__" !== i && "constructor" !== i && "prototype" !== i && (e[i] = je(s[i]) ? t(e[i] || (e[i] = {}), s[i]) : s[i]);
                    return e
                },
                As = function(t, e) {
                    var s, i = {};
                    for (s in t) s in e || (i[s] = t[s]);
                    return i
                },
                Ls = function(t) {
                    var e, s = t.parent || ue,
                        i = t.keyframes ? (e = He(t.keyframes), function(t, s) {
                            for (var i in s) i in t || "duration" === i && e || "ease" === i || (t[i] = s[i])
                        }) : Cs;
                    if (Fe(t.inherit))
                        for (; s;) i(t, s.vars.defaults), s = s.parent || s._dp;
                    return t
                },
                Os = function(t, e, s, i, n) {
                    void 0 === s && (s = "_first"), void 0 === i && (i = "_last");
                    var r, a = t[i];
                    if (n)
                        for (r = e[n]; a && a[n] > r;) a = a._prev;
                    return a ? (e._next = a._next, a._next = e) : (e._next = t[s], t[s] = e), e._next ? e._next._prev = e : t[i] = e, e._prev = a, e.parent = e._dp = t, e
                },
                Is = function(t, e, s, i) {
                    void 0 === s && (s = "_first"), void 0 === i && (i = "_last");
                    var n = e._prev,
                        r = e._next;
                    n ? n._next = r : t[s] === e && (t[s] = r), r ? r._prev = n : t[i] === e && (t[i] = n), e._next = e._prev = e.parent = null
                },
                qs = function(t, e) {
                    t.parent && (!e || t.parent.autoRemoveChildren) && t.parent.remove && t.parent.remove(t), t._act = 0
                },
                Ds = function(t, e) {
                    if (t && (!e || e._end > t._dur || e._start < 0))
                        for (var s = t; s;) s._dirty = 1, s = s.parent;
                    return t
                },
                zs = function(t, e, s, i) {
                    return t._startAt && (ce ? t._startAt.revert(as) : t.vars.immediateRender && !t.vars.autoRevert || t._startAt.render(e, !0, i))
                },
                Vs = function t(e) {
                    return !e || e._ts && t(e.parent)
                },
                js = function(t) {
                    return t._repeat ? Fs(t._tTime, t = t.duration() + t._rDelay) * t : 0
                },
                Fs = function(t, e) {
                    var s = Math.floor(t /= e);
                    return t && s === t ? s - 1 : s
                },
                Rs = function(t, e) {
                    return (t - e._start) * e._ts + (e._ts >= 0 ? 0 : e._dirty ? e.totalDuration() : e._tDur)
                },
                Bs = function(t) {
                    return t._end = Ts(t._start + (t._tDur / Math.abs(t._ts || t._rts || Ce) || 0))
                },
                Ns = function(t, e) {
                    var s = t._dp;
                    return s && s.smoothChildTiming && t._ts && (t._start = Ts(s._time - (t._ts > 0 ? e / t._ts : ((t._dirty ? t.totalDuration() : t._tDur) - e) / -t._ts)), Bs(t), s._dirty || Ds(s, t)), t
                },
                Hs = function(t, e) {
                    var s;
                    if ((e._time || !e._dur && e._initted || e._start < t._time && (e._dur || !e.add)) && (s = Rs(t.rawTime(), e), (!e._dur || si(0, e.totalDuration(), s) - e._tTime > Ce) && e.render(s, !0)), Ds(t, e)._dp && t._initted && t._time >= t._dur && t._ts) {
                        if (t._dur < t.duration())
                            for (s = t; s._dp;) s.rawTime() >= 0 && s.totalTime(s._tTime), s = s._dp;
                        t._zTime = -1e-8
                    }
                },
                Gs = function(t, e, s, i) {
                    return e.parent && qs(e), e._start = Ts((ze(s) ? s : s || t !== ue ? Zs(t, s, e) : t._time) + e._delay), e._end = Ts(e._start + (e.totalDuration() / Math.abs(e.timeScale()) || 0)), Os(t, e, "_first", "_last", t._sort ? "_start" : 0), Xs(e) || (t._recent = e), i || Hs(t, e), t._ts < 0 && Ns(t, t._tTime), t
                },
                Ws = function(t, e) {
                    return (Je.ScrollTrigger || es("scrollTrigger", e)) && Je.ScrollTrigger.create(e, t)
                },
                Us = function(t, e, s, i, n) {
                    return Ji(t, e, n), t._initted ? !s && t._pt && !ce && (t._dur && !1 !== t.vars.lazy || !t._dur && t.vars.lazy) && ge !== Ai.frame ? (cs.push(t), t._lazy = [n, i], 1) : void 0 : 1
                },
                Ys = function t(e) {
                    var s = e.parent;
                    return s && s._ts && s._initted && !s._lock && (s.rawTime() < 0 || t(s))
                },
                Xs = function(t) {
                    var e = t.data;
                    return "isFromStart" === e || "isStart" === e
                },
                Qs = function(t, e, s, i) {
                    var n = t._repeat,
                        r = Ts(e) || 0,
                        a = t._tTime / t._tDur;
                    return a && !i && (t._time *= r / t._dur), t._dur = r, t._tDur = n ? n < 0 ? 1e10 : Ts(r * (n + 1) + t._rDelay * n) : r, a > 0 && !i && Ns(t, t._tTime = t._tDur * a), t.parent && Bs(t), s || Ds(t.parent, t), t
                },
                Ks = function(t) {
                    return t instanceof Wi ? Ds(t) : Qs(t, t._dur)
                },
                Js = {
                    _start: 0,
                    endTime: ns,
                    totalDuration: ns
                },
                Zs = function t(e, s, i) {
                    var n, r, a, o = e.labels,
                        l = e._recent || Js,
                        c = e.duration() >= $e ? l.endTime(!1) : e._dur;
                    return qe(s) && (isNaN(s) || s in o) ? (r = s.charAt(0), a = "%" === s.substr(-1), n = s.indexOf("="), "<" === r || ">" === r ? (n >= 0 && (s = s.replace(/=/, "")), ("<" === r ? l._start : l.endTime(l._repeat >= 0)) + (parseFloat(s.substr(1)) || 0) * (a ? (n < 0 ? l : i).totalDuration() / 100 : 1)) : n < 0 ? (s in o || (o[s] = c), o[s]) : (r = parseFloat(s.charAt(n - 1) + s.substr(n + 1)), a && i && (r = r / 100 * (He(i) ? i[0] : i).totalDuration()), n > 1 ? t(e, s.substr(0, n - 1), i) + r : c + r)) : null == s ? c : +s
                },
                ti = function(t, e, s) {
                    var i, n, r = ze(e[1]),
                        a = (r ? 2 : 1) + (t < 2 ? 0 : 1),
                        o = e[a];
                    if (r && (o.duration = e[1]), o.parent = s, t) {
                        for (i = o, n = s; n && !("immediateRender" in i);) i = n.vars.defaults || {}, n = Fe(n.vars.inherit) && n.parent;
                        o.immediateRender = Fe(i.immediateRender), t < 2 ? o.runBackwards = 1 : o.startAt = e[a - 1]
                    }
                    return new nn(e[0], o, e[a + 1])
                },
                ei = function(t, e) {
                    return t || 0 === t ? e(t) : e
                },
                si = function(t, e, s) {
                    return s < t ? t : s > e ? e : s
                },
                ii = function(t, e) {
                    return qe(t) && (e = Ke.exec(t)) ? e[1] : ""
                },
                ni = [].slice,
                ri = function(t, e) {
                    return t && je(t) && "length" in t && (!e && !t.length || t.length - 1 in t && je(t[0])) && !t.nodeType && t !== de
                },
                ai = function(t, e, s) {
                    return void 0 === s && (s = []), t.forEach((function(t) {
                        var i;
                        return qe(t) && !e || ri(t, 1) ? (i = s).push.apply(i, oi(t)) : s.push(t)
                    })) || s
                },
                oi = function(t, e, s) {
                    return he && !e && he.selector ? he.selector(t) : !qe(t) || s || !pe && Li() ? He(t) ? ai(t, s) : ri(t) ? ni.call(t, 0) : t ? [t] : [] : ni.call((e || fe).querySelectorAll(t), 0)
                },
                li = function(t) {
                    return t = oi(t)[0] || ss("Invalid scope") || {},
                        function(e) {
                            var s = t.current || t.nativeElement || t;
                            return oi(e, s.querySelectorAll ? s : s === t ? ss("Invalid scope") || fe.createElement("div") : t)
                        }
                },
                ci = function(t) {
                    return t.sort((function() {
                        return .5 - Math.random()
                    }))
                },
                hi = function(t) {
                    if (De(t)) return t;
                    var e = je(t) ? t : {
                            each: t
                        },
                        s = ji(e.ease),
                        i = e.from || 0,
                        n = parseFloat(e.base) || 0,
                        r = {},
                        a = i > 0 && i < 1,
                        o = isNaN(i) || a,
                        l = e.axis,
                        c = i,
                        h = i;
                    return qe(i) ? c = h = {
                            center: .5,
                            edges: .5,
                            end: 1
                        }[i] || 0 : !a && o && (c = i[0], h = i[1]),
                        function(t, a, u) {
                            var d, p, f, m, g, v, b, y, w, T = (u || e).length,
                                _ = r[T];
                            if (!_) {
                                if (!(w = "auto" === e.grid ? 0 : (e.grid || [1, $e])[1])) {
                                    for (b = -$e; b < (b = u[w++].getBoundingClientRect().left) && w < T;);
                                    w < T && w--
                                }
                                for (_ = r[T] = [], d = o ? Math.min(w, T) * c - .5 : i % w, p = w === $e ? 0 : o ? T * h / w - .5 : i / w | 0, b = 0, y = $e, v = 0; v < T; v++) f = v % w - d, m = p - (v / w | 0), _[v] = g = l ? Math.abs("y" === l ? m : f) : Le(f * f + m * m), g > b && (b = g), g < y && (y = g);
                                "random" === i && ci(_), _.max = b - y, _.min = y, _.v = T = (parseFloat(e.amount) || parseFloat(e.each) * (w > T ? T - 1 : l ? "y" === l ? T / w : w : Math.max(w, T / w)) || 0) * ("edges" === i ? -1 : 1), _.b = T < 0 ? n - T : n, _.u = ii(e.amount || e.each) || 0, s = s && T < 0 ? zi(s) : s
                            }
                            return T = (_[t] - _.min) / _.max || 0, Ts(_.b + (s ? s(T) : T) * _.v) + _.u
                        }
                },
                ui = function(t) {
                    var e = Math.pow(10, ((t + "").split(".")[1] || "").length);
                    return function(s) {
                        var i = Ts(Math.round(parseFloat(s) / t) * t * e);
                        return (i - i % 1) / e + (ze(s) ? 0 : ii(s))
                    }
                },
                di = function(t, e) {
                    var s, i, n = He(t);
                    return !n && je(t) && (s = n = t.radius || $e, t.values ? (t = oi(t.values), (i = !ze(t[0])) && (s *= s)) : t = ui(t.increment)), ei(e, n ? De(t) ? function(e) {
                        return i = t(e), Math.abs(i - e) <= s ? i : e
                    } : function(e) {
                        for (var n, r, a = parseFloat(i ? e.x : e), o = parseFloat(i ? e.y : 0), l = $e, c = 0, h = t.length; h--;)(n = i ? (n = t[h].x - a) * n + (r = t[h].y - o) * r : Math.abs(t[h] - a)) < l && (l = n, c = h);
                        return c = !s || l <= s ? t[c] : e, i || c === e || ze(e) ? c : c + ii(e)
                    } : ui(t))
                },
                pi = function(t, e, s, i) {
                    return ei(He(t) ? !e : !0 === s ? !!(s = 0) : !i, (function() {
                        return He(t) ? t[~~(Math.random() * t.length)] : (s = s || 1e-5) && (i = s < 1 ? Math.pow(10, (s + "").length - 2) : 1) && Math.floor(Math.round((t - s / 2 + Math.random() * (e - t + .99 * s)) / s) * s * i) / i
                    }))
                },
                fi = function(t, e, s) {
                    return ei(s, (function(s) {
                        return t[~~e(s)]
                    }))
                },
                mi = function(t) {
                    for (var e, s, i, n, r = 0, a = ""; ~(e = t.indexOf("random(", r));) i = t.indexOf(")", e), n = "[" === t.charAt(e + 7), s = t.substr(e + 7, i - e - 7).match(n ? Qe : Ge), a += t.substr(r, e - r) + pi(n ? s : +s[0], n ? 0 : +s[1], +s[2] || 1e-5), r = i + 1;
                    return a + t.substr(r, t.length - r)
                },
                gi = function(t, e, s, i, n) {
                    var r = e - t,
                        a = i - s;
                    return ei(n, (function(e) {
                        return s + ((e - t) / r * a || 0)
                    }))
                },
                vi = function(t, e, s) {
                    var i, n, r, a = t.labels,
                        o = $e;
                    for (i in a)(n = a[i] - e) < 0 == !!s && n && o > (n = Math.abs(n)) && (r = i, o = n);
                    return r
                },
                bi = function(t, e, s) {
                    var i, n, r, a = t.vars,
                        o = a[e],
                        l = he,
                        c = t._ctx;
                    if (o) return i = a[e + "Params"], n = a.callbackScope || t, s && cs.length && xs(), c && (he = c), r = i ? o.apply(n, i) : o.call(n), he = l, r
                },
                yi = function(t) {
                    return qs(t), t.scrollTrigger && t.scrollTrigger.kill(!!ce), t.progress() < 1 && bi(t, "onInterrupt"), t
                },
                wi = [],
                Ti = function(t) {
                    if (t)
                        if (t = !t.name && t.default || t, Re() || t.headless) {
                            var e = t.name,
                                s = De(t),
                                i = e && !s && t.init ? function() {
                                    this._props = []
                                } : t,
                                n = {
                                    init: ns,
                                    render: pn,
                                    add: Qi,
                                    kill: mn,
                                    modifier: fn,
                                    rawVars: 0
                                },
                                r = {
                                    targetTest: 0,
                                    get: 0,
                                    getSetter: cn,
                                    aliases: {},
                                    register: 0
                                };
                            if (Li(), t !== i) {
                                if (us[e]) return;
                                Cs(i, Cs(As(t, n), r)), Ms(i.prototype, Ms(n, As(t, r))), us[i.prop = e] = i, t.targetTest && (fs.push(i), ls[e] = 1), e = ("css" === e ? "CSS" : e.charAt(0).toUpperCase() + e.substr(1)) + "Plugin"
                            }
                            is(e, i), t.register && t.register(An, i, bn)
                        } else wi.push(t)
                },
                _i = 255,
                ki = {
                    aqua: [0, _i, _i],
                    lime: [0, _i, 0],
                    silver: [192, 192, 192],
                    black: [0, 0, 0],
                    maroon: [128, 0, 0],
                    teal: [0, 128, 128],
                    blue: [0, 0, _i],
                    navy: [0, 0, 128],
                    white: [_i, _i, _i],
                    olive: [128, 128, 0],
                    yellow: [_i, _i, 0],
                    orange: [_i, 165, 0],
                    gray: [128, 128, 128],
                    purple: [128, 0, 128],
                    green: [0, 128, 0],
                    red: [_i, 0, 0],
                    pink: [_i, 192, 203],
                    cyan: [0, _i, _i],
                    transparent: [_i, _i, _i, 0]
                },
                xi = function(t, e, s) {
                    return (6 * (t += t < 0 ? 1 : t > 1 ? -1 : 0) < 1 ? e + (s - e) * t * 6 : t < .5 ? s : 3 * t < 2 ? e + (s - e) * (2 / 3 - t) * 6 : e) * _i + .5 | 0
                },
                Si = function(t, e, s) {
                    var i, n, r, a, o, l, c, h, u, d, p = t ? ze(t) ? [t >> 16, t >> 8 & _i, t & _i] : 0 : ki.black;
                    if (!p) {
                        if ("," === t.substr(-1) && (t = t.substr(0, t.length - 1)), ki[t]) p = ki[t];
                        else if ("#" === t.charAt(0)) {
                            if (t.length < 6 && (i = t.charAt(1), n = t.charAt(2), r = t.charAt(3), t = "#" + i + i + n + n + r + r + (5 === t.length ? t.charAt(4) + t.charAt(4) : "")), 9 === t.length) return [(p = parseInt(t.substr(1, 6), 16)) >> 16, p >> 8 & _i, p & _i, parseInt(t.substr(7), 16) / 255];
                            p = [(t = parseInt(t.substr(1), 16)) >> 16, t >> 8 & _i, t & _i]
                        } else if ("hsl" === t.substr(0, 3))
                            if (p = d = t.match(Ge), e) {
                                if (~t.indexOf("=")) return p = t.match(We), s && p.length < 4 && (p[3] = 1), p
                            } else a = +p[0] % 360 / 360, o = +p[1] / 100, i = 2 * (l = +p[2] / 100) - (n = l <= .5 ? l * (o + 1) : l + o - l * o), p.length > 3 && (p[3] *= 1), p[0] = xi(a + 1 / 3, i, n), p[1] = xi(a, i, n), p[2] = xi(a - 1 / 3, i, n);
                        else p = t.match(Ge) || ki.transparent;
                        p = p.map(Number)
                    }
                    return e && !d && (i = p[0] / _i, n = p[1] / _i, r = p[2] / _i, l = ((c = Math.max(i, n, r)) + (h = Math.min(i, n, r))) / 2, c === h ? a = o = 0 : (u = c - h, o = l > .5 ? u / (2 - c - h) : u / (c + h), a = c === i ? (n - r) / u + (n < r ? 6 : 0) : c === n ? (r - i) / u + 2 : (i - n) / u + 4, a *= 60), p[0] = ~~(a + .5), p[1] = ~~(100 * o + .5), p[2] = ~~(100 * l + .5)), s && p.length < 4 && (p[3] = 1), p
                },
                Ei = function(t) {
                    var e = [],
                        s = [],
                        i = -1;
                    return t.split(Ci).forEach((function(t) {
                        var n = t.match(Ue) || [];
                        e.push.apply(e, n), s.push(i += n.length + 1)
                    })), e.c = s, e
                },
                $i = function(t, e, s) {
                    var i, n, r, a, o = "",
                        l = (t + o).match(Ci),
                        c = e ? "hsla(" : "rgba(",
                        h = 0;
                    if (!l) return t;
                    if (l = l.map((function(t) {
                            return (t = Si(t, e, 1)) && c + (e ? t[0] + "," + t[1] + "%," + t[2] + "%," + t[3] : t.join(",")) + ")"
                        })), s && (r = Ei(t), (i = s.c).join(o) !== r.c.join(o)))
                        for (a = (n = t.replace(Ci, "1").split(Ue)).length - 1; h < a; h++) o += n[h] + (~i.indexOf(h) ? l.shift() || c + "0,0,0,0)" : (r.length ? r : l.length ? l : s).shift());
                    if (!n)
                        for (a = (n = t.split(Ci)).length - 1; h < a; h++) o += n[h] + l[h];
                    return o + n[a]
                },
                Ci = function() {
                    var t, e = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b";
                    for (t in ki) e += "|" + t + "\\b";
                    return new RegExp(e + ")", "gi")
                }(),
                Mi = /hsl[a]?\(/,
                Pi = function(t) {
                    var e, s = t.join(" ");
                    if (Ci.lastIndex = 0, Ci.test(s)) return e = Mi.test(s), t[1] = $i(t[1], e), t[0] = $i(t[0], e, Ei(t[1])), !0
                },
                Ai = function() {
                    var t, e, s, i, n, r, a = Date.now,
                        o = 500,
                        l = 33,
                        c = a(),
                        h = c,
                        u = 1e3 / 240,
                        d = u,
                        p = [],
                        f = function s(f) {
                            var m, g, v, b, y = a() - h,
                                w = !0 === f;
                            if ((y > o || y < 0) && (c += y - l), ((m = (v = (h += y) - c) - d) > 0 || w) && (b = ++i.frame, n = v - 1e3 * i.time, i.time = v /= 1e3, d += m + (m >= u ? 4 : u - m), g = 1), w || (t = e(s)), g)
                                for (r = 0; r < p.length; r++) p[r](v, n, b, f)
                        };
                    return i = {
                        time: 0,
                        frame: 0,
                        tick: function() {
                            f(!0)
                        },
                        deltaRatio: function(t) {
                            return n / (1e3 / (t || 60))
                        },
                        wake: function() {
                            me && (!pe && Re() && (de = pe = window, fe = de.document || {}, Je.gsap = An, (de.gsapVersions || (de.gsapVersions = [])).push(An.version), ts(Ze || de.GreenSockGlobals || !de.gsap && de || {}), wi.forEach(Ti)), s = "undefined" != typeof requestAnimationFrame && requestAnimationFrame, t && i.sleep(), e = s || function(t) {
                                return setTimeout(t, d - 1e3 * i.time + 1 | 0)
                            }, be = 1, f(2))
                        },
                        sleep: function() {
                            (s ? cancelAnimationFrame : clearTimeout)(t), be = 0, e = ns
                        },
                        lagSmoothing: function(t, e) {
                            o = t || 1 / 0, l = Math.min(e || 33, o)
                        },
                        fps: function(t) {
                            u = 1e3 / (t || 240), d = 1e3 * i.time + u
                        },
                        add: function(t, e, s) {
                            var n = e ? function(e, s, r, a) {
                                t(e, s, r, a), i.remove(n)
                            } : t;
                            return i.remove(t), p[s ? "unshift" : "push"](n), Li(), n
                        },
                        remove: function(t, e) {
                            ~(e = p.indexOf(t)) && p.splice(e, 1) && r >= e && r--
                        },
                        _listeners: p
                    }
                }(),
                Li = function() {
                    return !be && Ai.wake()
                },
                Oi = {},
                Ii = /^[\d.\-M][\d.\-,\s]/,
                qi = /["']/g,
                Di = function(t) {
                    for (var e, s, i, n = {}, r = t.substr(1, t.length - 3).split(":"), a = r[0], o = 1, l = r.length; o < l; o++) s = r[o], e = o !== l - 1 ? s.lastIndexOf(",") : s.length, i = s.substr(0, e), n[a] = isNaN(i) ? i.replace(qi, "").trim() : +i, a = s.substr(e + 1).trim();
                    return n
                },
                zi = function(t) {
                    return function(e) {
                        return 1 - t(1 - e)
                    }
                },
                Vi = function t(e, s) {
                    for (var i, n = e._first; n;) n instanceof Wi ? t(n, s) : !n.vars.yoyoEase || n._yoyo && n._repeat || n._yoyo === s || (n.timeline ? t(n.timeline, s) : (i = n._ease, n._ease = n._yEase, n._yEase = i, n._yoyo = s)), n = n._next
                },
                ji = function(t, e) {
                    return t && (De(t) ? t : Oi[t] || function(t) {
                        var e, s, i, n, r = (t + "").split("("),
                            a = Oi[r[0]];
                        return a && r.length > 1 && a.config ? a.config.apply(null, ~t.indexOf("{") ? [Di(r[1])] : (e = t, s = e.indexOf("(") + 1, i = e.indexOf(")"), n = e.indexOf("(", s), e.substring(s, ~n && n < i ? e.indexOf(")", i + 1) : i)).split(",").map(Es)) : Oi._CE && Ii.test(t) ? Oi._CE("", t) : a
                    }(t)) || e
                },
                Fi = function(t, e, s, i) {
                    void 0 === s && (s = function(t) {
                        return 1 - e(1 - t)
                    }), void 0 === i && (i = function(t) {
                        return t < .5 ? e(2 * t) / 2 : 1 - e(2 * (1 - t)) / 2
                    });
                    var n, r = {
                        easeIn: e,
                        easeOut: s,
                        easeInOut: i
                    };
                    return ys(t, (function(t) {
                        for (var e in Oi[t] = Je[t] = r, Oi[n = t.toLowerCase()] = s, r) Oi[n + ("easeIn" === e ? ".in" : "easeOut" === e ? ".out" : ".inOut")] = Oi[t + "." + e] = r[e]
                    })), r
                },
                Ri = function(t) {
                    return function(e) {
                        return e < .5 ? (1 - t(1 - 2 * e)) / 2 : .5 + t(2 * (e - .5)) / 2
                    }
                },
                Bi = function t(e, s, i) {
                    var n = s >= 1 ? s : 1,
                        r = (i || (e ? .3 : .45)) / (s < 1 ? s : 1),
                        a = r / Me * (Math.asin(1 / n) || 0),
                        o = function(t) {
                            return 1 === t ? 1 : n * Math.pow(2, -10 * t) * Ie((t - a) * r) + 1
                        },
                        l = "out" === e ? o : "in" === e ? function(t) {
                            return 1 - o(1 - t)
                        } : Ri(o);
                    return r = Me / r, l.config = function(s, i) {
                        return t(e, s, i)
                    }, l
                },
                Ni = function t(e, s) {
                    void 0 === s && (s = 1.70158);
                    var i = function(t) {
                            return t ? --t * t * ((s + 1) * t + s) + 1 : 0
                        },
                        n = "out" === e ? i : "in" === e ? function(t) {
                            return 1 - i(1 - t)
                        } : Ri(i);
                    return n.config = function(s) {
                        return t(e, s)
                    }, n
                };
            ys("Linear,Quad,Cubic,Quart,Quint,Strong", (function(t, e) {
                var s = e < 5 ? e + 1 : e;
                Fi(t + ",Power" + (s - 1), e ? function(t) {
                    return Math.pow(t, s)
                } : function(t) {
                    return t
                }, (function(t) {
                    return 1 - Math.pow(1 - t, s)
                }), (function(t) {
                    return t < .5 ? Math.pow(2 * t, s) / 2 : 1 - Math.pow(2 * (1 - t), s) / 2
                }))
            })), Oi.Linear.easeNone = Oi.none = Oi.Linear.easeIn, Fi("Elastic", Bi("in"), Bi("out"), Bi()), ye = 7.5625, _e = 2 * (Te = 1 / (we = 2.75)), ke = 2.5 * Te, Fi("Bounce", (function(t) {
                return 1 - xe(1 - t)
            }), xe = function(t) {
                return t < Te ? ye * t * t : t < _e ? ye * Math.pow(t - 1.5 / we, 2) + .75 : t < ke ? ye * (t -= 2.25 / we) * t + .9375 : ye * Math.pow(t - 2.625 / we, 2) + .984375
            }), Fi("Expo", (function(t) {
                return t ? Math.pow(2, 10 * (t - 1)) : 0
            })), Fi("Circ", (function(t) {
                return -(Le(1 - t * t) - 1)
            })), Fi("Sine", (function(t) {
                return 1 === t ? 1 : 1 - Oe(t * Pe)
            })), Fi("Back", Ni("in"), Ni("out"), Ni()), Oi.SteppedEase = Oi.steps = Je.SteppedEase = {
                config: function(t, e) {
                    void 0 === t && (t = 1);
                    var s = 1 / t,
                        i = t + (e ? 0 : 1),
                        n = e ? 1 : 0;
                    return function(t) {
                        return ((i * si(0, .99999999, t) | 0) + n) * s
                    }
                }
            }, Ee.ease = Oi["quad.out"], ys("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", (function(t) {
                return ms += t + "," + t + "Params,"
            }));
            var Hi = function(t, e) {
                    this.id = Ae++, t._gsap = this, this.target = t, this.harness = e, this.get = e ? e.get : bs, this.set = e ? e.getSetter : cn
                },
                Gi = function() {
                    function t(t) {
                        this.vars = t, this._delay = +t.delay || 0, (this._repeat = t.repeat === 1 / 0 ? -2 : t.repeat || 0) && (this._rDelay = t.repeatDelay || 0, this._yoyo = !!t.yoyo || !!t.yoyoEase), this._ts = 1, Qs(this, +t.duration, 1, 1), this.data = t.data, he && (this._ctx = he, he.data.push(this)), be || Ai.wake()
                    }
                    var e = t.prototype;
                    return e.delay = function(t) {
                        return t || 0 === t ? (this.parent && this.parent.smoothChildTiming && this.startTime(this._start + t - this._delay), this._delay = t, this) : this._delay
                    }, e.duration = function(t) {
                        return arguments.length ? this.totalDuration(this._repeat > 0 ? t + (t + this._rDelay) * this._repeat : t) : this.totalDuration() && this._dur
                    }, e.totalDuration = function(t) {
                        return arguments.length ? (this._dirty = 0, Qs(this, this._repeat < 0 ? t : (t - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur
                    }, e.totalTime = function(t, e) {
                        if (Li(), !arguments.length) return this._tTime;
                        var s = this._dp;
                        if (s && s.smoothChildTiming && this._ts) {
                            for (Ns(this, t), !s._dp || s.parent || Hs(s, this); s && s.parent;) s.parent._time !== s._start + (s._ts >= 0 ? s._tTime / s._ts : (s.totalDuration() - s._tTime) / -s._ts) && s.totalTime(s._tTime, !0), s = s.parent;
                            !this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && t < this._tDur || this._ts < 0 && t > 0 || !this._tDur && !t) && Gs(this._dp, this, this._start - this._delay)
                        }
                        return (this._tTime !== t || !this._dur && !e || this._initted && Math.abs(this._zTime) === Ce || !t && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = t), Ss(this, t, e)), this
                    }, e.time = function(t, e) {
                        return arguments.length ? this.totalTime(Math.min(this.totalDuration(), t + js(this)) % (this._dur + this._rDelay) || (t ? this._dur : 0), e) : this._time
                    }, e.totalProgress = function(t, e) {
                        return arguments.length ? this.totalTime(this.totalDuration() * t, e) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() > 0 ? 1 : 0
                    }, e.progress = function(t, e) {
                        return arguments.length ? this.totalTime(this.duration() * (!this._yoyo || 1 & this.iteration() ? t : 1 - t) + js(this), e) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0
                    }, e.iteration = function(t, e) {
                        var s = this.duration() + this._rDelay;
                        return arguments.length ? this.totalTime(this._time + (t - 1) * s, e) : this._repeat ? Fs(this._tTime, s) + 1 : 1
                    }, e.timeScale = function(t, e) {
                        if (!arguments.length) return -1e-8 === this._rts ? 0 : this._rts;
                        if (this._rts === t) return this;
                        var s = this.parent && this._ts ? Rs(this.parent._time, this) : this._tTime;
                        return this._rts = +t || 0, this._ts = this._ps || -1e-8 === t ? 0 : this._rts, this.totalTime(si(-Math.abs(this._delay), this._tDur, s), !1 !== e), Bs(this),
                            function(t) {
                                for (var e = t.parent; e && e.parent;) e._dirty = 1, e.totalDuration(), e = e.parent;
                                return t
                            }(this)
                    }, e.paused = function(t) {
                        return arguments.length ? (this._ps !== t && (this._ps = t, t ? (this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()), this._ts = this._act = 0) : (Li(), this._ts = this._rts, this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, 1 === this.progress() && Math.abs(this._zTime) !== Ce && (this._tTime -= Ce)))), this) : this._ps
                    }, e.startTime = function(t) {
                        if (arguments.length) {
                            this._start = t;
                            var e = this.parent || this._dp;
                            return e && (e._sort || !this.parent) && Gs(e, this, t - this._delay), this
                        }
                        return this._start
                    }, e.endTime = function(t) {
                        return this._start + (Fe(t) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1)
                    }, e.rawTime = function(t) {
                        var e = this.parent || this._dp;
                        return e ? t && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? Rs(e.rawTime(t), this) : this._tTime : this._tTime
                    }, e.revert = function(t) {
                        void 0 === t && (t = os);
                        var e = ce;
                        return ce = t, (this._initted || this._startAt) && (this.timeline && this.timeline.revert(t), this.totalTime(-.01, t.suppressEvents)), "nested" !== this.data && !1 !== t.kill && this.kill(), ce = e, this
                    }, e.globalTime = function(t) {
                        for (var e = this, s = arguments.length ? t : e.rawTime(); e;) s = e._start + s / (Math.abs(e._ts) || 1), e = e._dp;
                        return !this.parent && this._sat ? this._sat.globalTime(t) : s
                    }, e.repeat = function(t) {
                        return arguments.length ? (this._repeat = t === 1 / 0 ? -2 : t, Ks(this)) : -2 === this._repeat ? 1 / 0 : this._repeat
                    }, e.repeatDelay = function(t) {
                        if (arguments.length) {
                            var e = this._time;
                            return this._rDelay = t, Ks(this), e ? this.time(e) : this
                        }
                        return this._rDelay
                    }, e.yoyo = function(t) {
                        return arguments.length ? (this._yoyo = t, this) : this._yoyo
                    }, e.seek = function(t, e) {
                        return this.totalTime(Zs(this, t), Fe(e))
                    }, e.restart = function(t, e) {
                        return this.play().totalTime(t ? -this._delay : 0, Fe(e))
                    }, e.play = function(t, e) {
                        return null != t && this.seek(t, e), this.reversed(!1).paused(!1)
                    }, e.reverse = function(t, e) {
                        return null != t && this.seek(t || this.totalDuration(), e), this.reversed(!0).paused(!1)
                    }, e.pause = function(t, e) {
                        return null != t && this.seek(t, e), this.paused(!0)
                    }, e.resume = function() {
                        return this.paused(!1)
                    }, e.reversed = function(t) {
                        return arguments.length ? (!!t !== this.reversed() && this.timeScale(-this._rts || (t ? -1e-8 : 0)), this) : this._rts < 0
                    }, e.invalidate = function() {
                        return this._initted = this._act = 0, this._zTime = -1e-8, this
                    }, e.isActive = function() {
                        var t, e = this.parent || this._dp,
                            s = this._start;
                        return !(e && !(this._ts && this._initted && e.isActive() && (t = e.rawTime(!0)) >= s && t < this.endTime(!0) - Ce))
                    }, e.eventCallback = function(t, e, s) {
                        var i = this.vars;
                        return arguments.length > 1 ? (e ? (i[t] = e, s && (i[t + "Params"] = s), "onUpdate" === t && (this._onUpdate = e)) : delete i[t], this) : i[t]
                    }, e.then = function(t) {
                        var e = this;
                        return new Promise((function(s) {
                            var i = De(t) ? t : $s,
                                n = function() {
                                    var t = e.then;
                                    e.then = null, De(i) && (i = i(e)) && (i.then || i === e) && (e.then = t), s(i), e.then = t
                                };
                            e._initted && 1 === e.totalProgress() && e._ts >= 0 || !e._tTime && e._ts < 0 ? n() : e._prom = n
                        }))
                    }, e.kill = function() {
                        yi(this)
                    }, t
                }();
            Cs(Gi.prototype, {
                _time: 0,
                _start: 0,
                _end: 0,
                _tTime: 0,
                _tDur: 0,
                _dirty: 0,
                _repeat: 0,
                _yoyo: !1,
                parent: null,
                _initted: !1,
                _rDelay: 0,
                _ts: 1,
                _dp: 0,
                ratio: 0,
                _zTime: -1e-8,
                _prom: 0,
                _ps: !1,
                _rts: 1
            });
            var Wi = function(t) {
                function e(e, s) {
                    var i;
                    return void 0 === e && (e = {}), (i = t.call(this, e) || this).labels = {}, i.smoothChildTiming = !!e.smoothChildTiming, i.autoRemoveChildren = !!e.autoRemoveChildren, i._sort = Fe(e.sortChildren), ue && Gs(e.parent || ue, ae(i), s), e.reversed && i.reverse(), e.paused && i.paused(!0), e.scrollTrigger && Ws(ae(i), e.scrollTrigger), i
                }
                oe(e, t);
                var s = e.prototype;
                return s.to = function(t, e, s) {
                    return ti(0, arguments, this), this
                }, s.from = function(t, e, s) {
                    return ti(1, arguments, this), this
                }, s.fromTo = function(t, e, s, i) {
                    return ti(2, arguments, this), this
                }, s.set = function(t, e, s) {
                    return e.duration = 0, e.parent = this, Ls(e).repeatDelay || (e.repeat = 0), e.immediateRender = !!e.immediateRender, new nn(t, e, Zs(this, s), 1), this
                }, s.call = function(t, e, s) {
                    return Gs(this, nn.delayedCall(0, t, e), s)
                }, s.staggerTo = function(t, e, s, i, n, r, a) {
                    return s.duration = e, s.stagger = s.stagger || i, s.onComplete = r, s.onCompleteParams = a, s.parent = this, new nn(t, s, Zs(this, n)), this
                }, s.staggerFrom = function(t, e, s, i, n, r, a) {
                    return s.runBackwards = 1, Ls(s).immediateRender = Fe(s.immediateRender), this.staggerTo(t, e, s, i, n, r, a)
                }, s.staggerFromTo = function(t, e, s, i, n, r, a, o) {
                    return i.startAt = s, Ls(i).immediateRender = Fe(i.immediateRender), this.staggerTo(t, e, i, n, r, a, o)
                }, s.render = function(t, e, s) {
                    var i, n, r, a, o, l, c, h, u, d, p, f, m = this._time,
                        g = this._dirty ? this.totalDuration() : this._tDur,
                        v = this._dur,
                        b = t <= 0 ? 0 : Ts(t),
                        y = this._zTime < 0 != t < 0 && (this._initted || !v);
                    if (this !== ue && b > g && t >= 0 && (b = g), b !== this._tTime || s || y) {
                        if (m !== this._time && v && (b += this._time - m, t += this._time - m), i = b, u = this._start, l = !(h = this._ts), y && (v || (m = this._zTime), (t || !e) && (this._zTime = t)), this._repeat) {
                            if (p = this._yoyo, o = v + this._rDelay, this._repeat < -1 && t < 0) return this.totalTime(100 * o + t, e, s);
                            if (i = Ts(b % o), b === g ? (a = this._repeat, i = v) : ((a = ~~(b / o)) && a === b / o && (i = v, a--), i > v && (i = v)), d = Fs(this._tTime, o), !m && this._tTime && d !== a && this._tTime - d * o - this._dur <= 0 && (d = a), p && 1 & a && (i = v - i, f = 1), a !== d && !this._lock) {
                                var w = p && 1 & d,
                                    T = w === (p && 1 & a);
                                if (a < d && (w = !w), m = w ? 0 : b % v ? v : b, this._lock = 1, this.render(m || (f ? 0 : Ts(a * o)), e, !v)._lock = 0, this._tTime = b, !e && this.parent && bi(this, "onRepeat"), this.vars.repeatRefresh && !f && (this.invalidate()._lock = 1), m && m !== this._time || l !== !this._ts || this.vars.onRepeat && !this.parent && !this._act) return this;
                                if (v = this._dur, g = this._tDur, T && (this._lock = 2, m = w ? v : -1e-4, this.render(m, !0), this.vars.repeatRefresh && !f && this.invalidate()), this._lock = 0, !this._ts && !l) return this;
                                Vi(this, f)
                            }
                        }
                        if (this._hasPause && !this._forcing && this._lock < 2 && (c = function(t, e, s) {
                                var i;
                                if (s > e)
                                    for (i = t._first; i && i._start <= s;) {
                                        if ("isPause" === i.data && i._start > e) return i;
                                        i = i._next
                                    } else
                                        for (i = t._last; i && i._start >= s;) {
                                            if ("isPause" === i.data && i._start < e) return i;
                                            i = i._prev
                                        }
                            }(this, Ts(m), Ts(i)), c && (b -= i - (i = c._start))), this._tTime = b, this._time = i, this._act = !h, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = t, m = 0), !m && i && !e && !a && (bi(this, "onStart"), this._tTime !== b)) return this;
                        if (i >= m && t >= 0)
                            for (n = this._first; n;) {
                                if (r = n._next, (n._act || i >= n._start) && n._ts && c !== n) {
                                    if (n.parent !== this) return this.render(t, e, s);
                                    if (n.render(n._ts > 0 ? (i - n._start) * n._ts : (n._dirty ? n.totalDuration() : n._tDur) + (i - n._start) * n._ts, e, s), i !== this._time || !this._ts && !l) {
                                        c = 0, r && (b += this._zTime = -1e-8);
                                        break
                                    }
                                }
                                n = r
                            } else {
                                n = this._last;
                                for (var _ = t < 0 ? t : i; n;) {
                                    if (r = n._prev, (n._act || _ <= n._end) && n._ts && c !== n) {
                                        if (n.parent !== this) return this.render(t, e, s);
                                        if (n.render(n._ts > 0 ? (_ - n._start) * n._ts : (n._dirty ? n.totalDuration() : n._tDur) + (_ - n._start) * n._ts, e, s || ce && (n._initted || n._startAt)), i !== this._time || !this._ts && !l) {
                                            c = 0, r && (b += this._zTime = _ ? -1e-8 : Ce);
                                            break
                                        }
                                    }
                                    n = r
                                }
                            }
                        if (c && !e && (this.pause(), c.render(i >= m ? 0 : -1e-8)._zTime = i >= m ? 1 : -1, this._ts)) return this._start = u, Bs(this), this.render(t, e, s);
                        this._onUpdate && !e && bi(this, "onUpdate", !0), (b === g && this._tTime >= this.totalDuration() || !b && m) && (u !== this._start && Math.abs(h) === Math.abs(this._ts) || this._lock || ((t || !v) && (b === g && this._ts > 0 || !b && this._ts < 0) && qs(this, 1), e || t < 0 && !m || !b && !m && g || (bi(this, b === g && t >= 0 ? "onComplete" : "onReverseComplete", !0), this._prom && !(b < g && this.timeScale() > 0) && this._prom())))
                    }
                    return this
                }, s.add = function(t, e) {
                    var s = this;
                    if (ze(e) || (e = Zs(this, e, t)), !(t instanceof Gi)) {
                        if (He(t)) return t.forEach((function(t) {
                            return s.add(t, e)
                        })), this;
                        if (qe(t)) return this.addLabel(t, e);
                        if (!De(t)) return this;
                        t = nn.delayedCall(0, t)
                    }
                    return this !== t ? Gs(this, t, e) : this
                }, s.getChildren = function(t, e, s, i) {
                    void 0 === t && (t = !0), void 0 === e && (e = !0), void 0 === s && (s = !0), void 0 === i && (i = -$e);
                    for (var n = [], r = this._first; r;) r._start >= i && (r instanceof nn ? e && n.push(r) : (s && n.push(r), t && n.push.apply(n, r.getChildren(!0, e, s)))), r = r._next;
                    return n
                }, s.getById = function(t) {
                    for (var e = this.getChildren(1, 1, 1), s = e.length; s--;)
                        if (e[s].vars.id === t) return e[s]
                }, s.remove = function(t) {
                    return qe(t) ? this.removeLabel(t) : De(t) ? this.killTweensOf(t) : (Is(this, t), t === this._recent && (this._recent = this._last), Ds(this))
                }, s.totalTime = function(e, s) {
                    return arguments.length ? (this._forcing = 1, !this._dp && this._ts && (this._start = Ts(Ai.time - (this._ts > 0 ? e / this._ts : (this.totalDuration() - e) / -this._ts))), t.prototype.totalTime.call(this, e, s), this._forcing = 0, this) : this._tTime
                }, s.addLabel = function(t, e) {
                    return this.labels[t] = Zs(this, e), this
                }, s.removeLabel = function(t) {
                    return delete this.labels[t], this
                }, s.addPause = function(t, e, s) {
                    var i = nn.delayedCall(0, e || ns, s);
                    return i.data = "isPause", this._hasPause = 1, Gs(this, i, Zs(this, t))
                }, s.removePause = function(t) {
                    var e = this._first;
                    for (t = Zs(this, t); e;) e._start === t && "isPause" === e.data && qs(e), e = e._next
                }, s.killTweensOf = function(t, e, s) {
                    for (var i = this.getTweensOf(t, s), n = i.length; n--;) Ui !== i[n] && i[n].kill(t, e);
                    return this
                }, s.getTweensOf = function(t, e) {
                    for (var s, i = [], n = oi(t), r = this._first, a = ze(e); r;) r instanceof nn ? ks(r._targets, n) && (a ? (!Ui || r._initted && r._ts) && r.globalTime(0) <= e && r.globalTime(r.totalDuration()) > e : !e || r.isActive()) && i.push(r) : (s = r.getTweensOf(n, e)).length && i.push.apply(i, s), r = r._next;
                    return i
                }, s.tweenTo = function(t, e) {
                    e = e || {};
                    var s, i = this,
                        n = Zs(i, t),
                        r = e,
                        a = r.startAt,
                        o = r.onStart,
                        l = r.onStartParams,
                        c = r.immediateRender,
                        h = nn.to(i, Cs({
                            ease: e.ease || "none",
                            lazy: !1,
                            immediateRender: !1,
                            time: n,
                            overwrite: "auto",
                            duration: e.duration || Math.abs((n - (a && "time" in a ? a.time : i._time)) / i.timeScale()) || Ce,
                            onStart: function() {
                                if (i.pause(), !s) {
                                    var t = e.duration || Math.abs((n - (a && "time" in a ? a.time : i._time)) / i.timeScale());
                                    h._dur !== t && Qs(h, t, 0, 1).render(h._time, !0, !0), s = 1
                                }
                                o && o.apply(h, l || [])
                            }
                        }, e));
                    return c ? h.render(0) : h
                }, s.tweenFromTo = function(t, e, s) {
                    return this.tweenTo(e, Cs({
                        startAt: {
                            time: Zs(this, t)
                        }
                    }, s))
                }, s.recent = function() {
                    return this._recent
                }, s.nextLabel = function(t) {
                    return void 0 === t && (t = this._time), vi(this, Zs(this, t))
                }, s.previousLabel = function(t) {
                    return void 0 === t && (t = this._time), vi(this, Zs(this, t), 1)
                }, s.currentLabel = function(t) {
                    return arguments.length ? this.seek(t, !0) : this.previousLabel(this._time + Ce)
                }, s.shiftChildren = function(t, e, s) {
                    void 0 === s && (s = 0);
                    for (var i, n = this._first, r = this.labels; n;) n._start >= s && (n._start += t, n._end += t), n = n._next;
                    if (e)
                        for (i in r) r[i] >= s && (r[i] += t);
                    return Ds(this)
                }, s.invalidate = function(e) {
                    var s = this._first;
                    for (this._lock = 0; s;) s.invalidate(e), s = s._next;
                    return t.prototype.invalidate.call(this, e)
                }, s.clear = function(t) {
                    void 0 === t && (t = !0);
                    for (var e, s = this._first; s;) e = s._next, this.remove(s), s = e;
                    return this._dp && (this._time = this._tTime = this._pTime = 0), t && (this.labels = {}), Ds(this)
                }, s.totalDuration = function(t) {
                    var e, s, i, n = 0,
                        r = this,
                        a = r._last,
                        o = $e;
                    if (arguments.length) return r.timeScale((r._repeat < 0 ? r.duration() : r.totalDuration()) / (r.reversed() ? -t : t));
                    if (r._dirty) {
                        for (i = r.parent; a;) e = a._prev, a._dirty && a.totalDuration(), (s = a._start) > o && r._sort && a._ts && !r._lock ? (r._lock = 1, Gs(r, a, s - a._delay, 1)._lock = 0) : o = s, s < 0 && a._ts && (n -= s, (!i && !r._dp || i && i.smoothChildTiming) && (r._start += s / r._ts, r._time -= s, r._tTime -= s), r.shiftChildren(-s, !1, -Infinity), o = 0), a._end > n && a._ts && (n = a._end), a = e;
                        Qs(r, r === ue && r._time > n ? r._time : n, 1, 1), r._dirty = 0
                    }
                    return r._tDur
                }, e.updateRoot = function(t) {
                    if (ue._ts && (Ss(ue, Rs(t, ue)), ge = Ai.frame), Ai.frame >= ps) {
                        ps += Se.autoSleep || 120;
                        var e = ue._first;
                        if ((!e || !e._ts) && Se.autoSleep && Ai._listeners.length < 2) {
                            for (; e && !e._ts;) e = e._next;
                            e || Ai.sleep()
                        }
                    }
                }, e
            }(Gi);
            Cs(Wi.prototype, {
                _lock: 0,
                _hasPause: 0,
                _forcing: 0
            });
            var Ui, Yi, Xi = function(t, e, s, i, n, r, a) {
                    var o, l, c, h, u, d, p, f, m = new bn(this._pt, t, e, 0, 1, dn, null, n),
                        g = 0,
                        v = 0;
                    for (m.b = s, m.e = i, s += "", (p = ~(i += "").indexOf("random(")) && (i = mi(i)), r && (r(f = [s, i], t, e), s = f[0], i = f[1]), l = s.match(Ye) || []; o = Ye.exec(i);) h = o[0], u = i.substring(g, o.index), c ? c = (c + 1) % 5 : "rgba(" === u.substr(-5) && (c = 1), h !== l[v++] && (d = parseFloat(l[v - 1]) || 0, m._pt = {
                        _next: m._pt,
                        p: u || 1 === v ? u : ",",
                        s: d,
                        c: "=" === h.charAt(1) ? _s(d, h) - d : parseFloat(h) - d,
                        m: c && c < 4 ? Math.round : 0
                    }, g = Ye.lastIndex);
                    return m.c = g < i.length ? i.substring(g, i.length) : "", m.fp = a, (Xe.test(i) || p) && (m.e = 0), this._pt = m, m
                },
                Qi = function(t, e, s, i, n, r, a, o, l, c) {
                    De(i) && (i = i(n || 0, t, r));
                    var h, u = t[e],
                        d = "get" !== s ? s : De(u) ? l ? t[e.indexOf("set") || !De(t["get" + e.substr(3)]) ? e : "get" + e.substr(3)](l) : t[e]() : u,
                        p = De(u) ? l ? on : an : rn;
                    if (qe(i) && (~i.indexOf("random(") && (i = mi(i)), "=" === i.charAt(1) && ((h = _s(d, i) + (ii(d) || 0)) || 0 === h) && (i = h)), !c || d !== i || Yi) return isNaN(d * i) || "" === i ? (!u && !(e in t) && es(e, i), Xi.call(this, t, e, d, i, p, o || Se.stringFilter, l)) : (h = new bn(this._pt, t, e, +d || 0, i - (d || 0), "boolean" == typeof u ? un : hn, 0, p), l && (h.fp = l), a && h.modifier(a, this, t), this._pt = h)
                },
                Ki = function(t, e, s, i, n, r) {
                    var a, o, l, c;
                    if (us[t] && !1 !== (a = new us[t]).init(n, a.rawVars ? e[t] : function(t, e, s, i, n) {
                            if (De(t) && (t = tn(t, n, e, s, i)), !je(t) || t.style && t.nodeType || He(t) || Ne(t)) return qe(t) ? tn(t, n, e, s, i) : t;
                            var r, a = {};
                            for (r in t) a[r] = tn(t[r], n, e, s, i);
                            return a
                        }(e[t], i, n, r, s), s, i, r) && (s._pt = o = new bn(s._pt, n, t, 0, 1, a.render, a, 0, a.priority), s !== ve))
                        for (l = s._ptLookup[s._targets.indexOf(n)], c = a._props.length; c--;) l[a._props[c]] = o;
                    return a
                },
                Ji = function t(e, s, i) {
                    var n, r, a, o, l, c, h, u, d, p, f, m, g, v = e.vars,
                        b = v.ease,
                        y = v.startAt,
                        w = v.immediateRender,
                        T = v.lazy,
                        _ = v.onUpdate,
                        k = v.runBackwards,
                        x = v.yoyoEase,
                        S = v.keyframes,
                        E = v.autoRevert,
                        $ = e._dur,
                        C = e._startAt,
                        M = e._targets,
                        P = e.parent,
                        A = P && "nested" === P.data ? P.vars.targets : M,
                        L = "auto" === e._overwrite && !le,
                        O = e.timeline;
                    if (O && (!S || !b) && (b = "none"), e._ease = ji(b, Ee.ease), e._yEase = x ? zi(ji(!0 === x ? b : x, Ee.ease)) : 0, x && e._yoyo && !e._repeat && (x = e._yEase, e._yEase = e._ease, e._ease = x), e._from = !O && !!v.runBackwards, !O || S && !v.stagger) {
                        if (m = (u = M[0] ? vs(M[0]).harness : 0) && v[u.prop], n = As(v, ls), C && (C._zTime < 0 && C.progress(1), s < 0 && k && w && !E ? C.render(-1, !0) : C.revert(k && $ ? as : rs), C._lazy = 0), y) {
                            if (qs(e._startAt = nn.set(M, Cs({
                                    data: "isStart",
                                    overwrite: !1,
                                    parent: P,
                                    immediateRender: !0,
                                    lazy: !C && Fe(T),
                                    startAt: null,
                                    delay: 0,
                                    onUpdate: _ && function() {
                                        return bi(e, "onUpdate")
                                    },
                                    stagger: 0
                                }, y))), e._startAt._dp = 0, e._startAt._sat = e, s < 0 && (ce || !w && !E) && e._startAt.revert(as), w && $ && s <= 0 && i <= 0) return void(s && (e._zTime = s))
                        } else if (k && $ && !C)
                            if (s && (w = !1), a = Cs({
                                    overwrite: !1,
                                    data: "isFromStart",
                                    lazy: w && !C && Fe(T),
                                    immediateRender: w,
                                    stagger: 0,
                                    parent: P
                                }, n), m && (a[u.prop] = m), qs(e._startAt = nn.set(M, a)), e._startAt._dp = 0, e._startAt._sat = e, s < 0 && (ce ? e._startAt.revert(as) : e._startAt.render(-1, !0)), e._zTime = s, w) {
                                if (!s) return
                            } else t(e._startAt, Ce, Ce);
                        for (e._pt = e._ptCache = 0, T = $ && Fe(T) || T && !$, r = 0; r < M.length; r++) {
                            if (h = (l = M[r])._gsap || gs(M)[r]._gsap, e._ptLookup[r] = p = {}, hs[h.id] && cs.length && xs(), f = A === M ? r : A.indexOf(l), u && !1 !== (d = new u).init(l, m || n, e, f, A) && (e._pt = o = new bn(e._pt, l, d.name, 0, 1, d.render, d, 0, d.priority), d._props.forEach((function(t) {
                                    p[t] = o
                                })), d.priority && (c = 1)), !u || m)
                                for (a in n) us[a] && (d = Ki(a, n, e, f, l, A)) ? d.priority && (c = 1) : p[a] = o = Qi.call(e, l, a, "get", n[a], f, A, 0, v.stringFilter);
                            e._op && e._op[r] && e.kill(l, e._op[r]), L && e._pt && (Ui = e, ue.killTweensOf(l, p, e.globalTime(s)), g = !e.parent, Ui = 0), e._pt && T && (hs[h.id] = 1)
                        }
                        c && vn(e), e._onInit && e._onInit(e)
                    }
                    e._onUpdate = _, e._initted = (!e._op || e._pt) && !g, S && s <= 0 && O.render($e, !0, !0)
                },
                Zi = function(t, e, s, i) {
                    var n, r, a = e.ease || i || "power1.inOut";
                    if (He(e)) r = s[t] || (s[t] = []), e.forEach((function(t, s) {
                        return r.push({
                            t: s / (e.length - 1) * 100,
                            v: t,
                            e: a
                        })
                    }));
                    else
                        for (n in e) r = s[n] || (s[n] = []), "ease" === n || r.push({
                            t: parseFloat(t),
                            v: e[n],
                            e: a
                        })
                },
                tn = function(t, e, s, i, n) {
                    return De(t) ? t.call(e, s, i, n) : qe(t) && ~t.indexOf("random(") ? mi(t) : t
                },
                en = ms + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert",
                sn = {};
            ys(en + ",id,stagger,delay,duration,paused,scrollTrigger", (function(t) {
                return sn[t] = 1
            }));
            var nn = function(t) {
                function e(e, s, i, n) {
                    var r;
                    "number" == typeof s && (i.duration = s, s = i, i = null);
                    var a, o, l, c, h, u, d, p, f = (r = t.call(this, n ? s : Ls(s)) || this).vars,
                        m = f.duration,
                        g = f.delay,
                        v = f.immediateRender,
                        b = f.stagger,
                        y = f.overwrite,
                        w = f.keyframes,
                        T = f.defaults,
                        _ = f.scrollTrigger,
                        k = f.yoyoEase,
                        x = s.parent || ue,
                        S = (He(e) || Ne(e) ? ze(e[0]) : "length" in s) ? [e] : oi(e);
                    if (r._targets = S.length ? gs(S) : ss("GSAP target " + e + " not found. https://gsap.com", !Se.nullTargetWarn) || [], r._ptLookup = [], r._overwrite = y, w || b || Be(m) || Be(g)) {
                        if (s = r.vars, (a = r.timeline = new Wi({
                                data: "nested",
                                defaults: T || {},
                                targets: x && "nested" === x.data ? x.vars.targets : S
                            })).kill(), a.parent = a._dp = ae(r), a._start = 0, b || Be(m) || Be(g)) {
                            if (c = S.length, d = b && hi(b), je(b))
                                for (h in b) ~en.indexOf(h) && (p || (p = {}), p[h] = b[h]);
                            for (o = 0; o < c; o++)(l = As(s, sn)).stagger = 0, k && (l.yoyoEase = k), p && Ms(l, p), u = S[o], l.duration = +tn(m, ae(r), o, u, S), l.delay = (+tn(g, ae(r), o, u, S) || 0) - r._delay, !b && 1 === c && l.delay && (r._delay = g = l.delay, r._start += g, l.delay = 0), a.to(u, l, d ? d(o, u, S) : 0), a._ease = Oi.none;
                            a.duration() ? m = g = 0 : r.timeline = 0
                        } else if (w) {
                            Ls(Cs(a.vars.defaults, {
                                ease: "none"
                            })), a._ease = ji(w.ease || s.ease || "none");
                            var E, $, C, M = 0;
                            if (He(w)) w.forEach((function(t) {
                                return a.to(S, t, ">")
                            })), a.duration();
                            else {
                                for (h in l = {}, w) "ease" === h || "easeEach" === h || Zi(h, w[h], l, w.easeEach);
                                for (h in l)
                                    for (E = l[h].sort((function(t, e) {
                                            return t.t - e.t
                                        })), M = 0, o = 0; o < E.length; o++)(C = {
                                        ease: ($ = E[o]).e,
                                        duration: ($.t - (o ? E[o - 1].t : 0)) / 100 * m
                                    })[h] = $.v, a.to(S, C, M), M += C.duration;
                                a.duration() < m && a.to({}, {
                                    duration: m - a.duration()
                                })
                            }
                        }
                        m || r.duration(m = a.duration())
                    } else r.timeline = 0;
                    return !0 !== y || le || (Ui = ae(r), ue.killTweensOf(S), Ui = 0), Gs(x, ae(r), i), s.reversed && r.reverse(), s.paused && r.paused(!0), (v || !m && !w && r._start === Ts(x._time) && Fe(v) && Vs(ae(r)) && "nested" !== x.data) && (r._tTime = -1e-8, r.render(Math.max(0, -g) || 0)), _ && Ws(ae(r), _), r
                }
                oe(e, t);
                var s = e.prototype;
                return s.render = function(t, e, s) {
                    var i, n, r, a, o, l, c, h, u, d = this._time,
                        p = this._tDur,
                        f = this._dur,
                        m = t < 0,
                        g = t > p - Ce && !m ? p : t < Ce ? 0 : t;
                    if (f) {
                        if (g !== this._tTime || !t || s || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== m) {
                            if (i = g, h = this.timeline, this._repeat) {
                                if (a = f + this._rDelay, this._repeat < -1 && m) return this.totalTime(100 * a + t, e, s);
                                if (i = Ts(g % a), g === p ? (r = this._repeat, i = f) : ((r = ~~(g / a)) && r === Ts(g / a) && (i = f, r--), i > f && (i = f)), (l = this._yoyo && 1 & r) && (u = this._yEase, i = f - i), o = Fs(this._tTime, a), i === d && !s && this._initted && r === o) return this._tTime = g, this;
                                r !== o && (h && this._yEase && Vi(h, l), this.vars.repeatRefresh && !l && !this._lock && this._time !== a && this._initted && (this._lock = s = 1, this.render(Ts(a * r), !0).invalidate()._lock = 0))
                            }
                            if (!this._initted) {
                                if (Us(this, m ? t : i, s, e, g)) return this._tTime = 0, this;
                                if (!(d === this._time || s && this.vars.repeatRefresh && r !== o)) return this;
                                if (f !== this._dur) return this.render(t, e, s)
                            }
                            if (this._tTime = g, this._time = i, !this._act && this._ts && (this._act = 1, this._lazy = 0), this.ratio = c = (u || this._ease)(i / f), this._from && (this.ratio = c = 1 - c), i && !d && !e && !r && (bi(this, "onStart"), this._tTime !== g)) return this;
                            for (n = this._pt; n;) n.r(c, n.d), n = n._next;
                            h && h.render(t < 0 ? t : h._dur * h._ease(i / this._dur), e, s) || this._startAt && (this._zTime = t), this._onUpdate && !e && (m && zs(this, t, 0, s), bi(this, "onUpdate")), this._repeat && r !== o && this.vars.onRepeat && !e && this.parent && bi(this, "onRepeat"), g !== this._tDur && g || this._tTime !== g || (m && !this._onUpdate && zs(this, t, 0, !0), (t || !f) && (g === this._tDur && this._ts > 0 || !g && this._ts < 0) && qs(this, 1), e || m && !d || !(g || d || l) || (bi(this, g === p ? "onComplete" : "onReverseComplete", !0), this._prom && !(g < p && this.timeScale() > 0) && this._prom()))
                        }
                    } else ! function(t, e, s, i) {
                        var n, r, a, o = t.ratio,
                            l = e < 0 || !e && (!t._start && Ys(t) && (t._initted || !Xs(t)) || (t._ts < 0 || t._dp._ts < 0) && !Xs(t)) ? 0 : 1,
                            c = t._rDelay,
                            h = 0;
                        if (c && t._repeat && (h = si(0, t._tDur, e), r = Fs(h, c), t._yoyo && 1 & r && (l = 1 - l), r !== Fs(t._tTime, c) && (o = 1 - l, t.vars.repeatRefresh && t._initted && t.invalidate())), l !== o || ce || i || t._zTime === Ce || !e && t._zTime) {
                            if (!t._initted && Us(t, e, i, s, h)) return;
                            for (a = t._zTime, t._zTime = e || (s ? Ce : 0), s || (s = e && !a), t.ratio = l, t._from && (l = 1 - l), t._time = 0, t._tTime = h, n = t._pt; n;) n.r(l, n.d), n = n._next;
                            e < 0 && zs(t, e, 0, !0), t._onUpdate && !s && bi(t, "onUpdate"), h && t._repeat && !s && t.parent && bi(t, "onRepeat"), (e >= t._tDur || e < 0) && t.ratio === l && (l && qs(t, 1), s || ce || (bi(t, l ? "onComplete" : "onReverseComplete", !0), t._prom && t._prom()))
                        } else t._zTime || (t._zTime = e)
                    }(this, t, e, s);
                    return this
                }, s.targets = function() {
                    return this._targets
                }, s.invalidate = function(e) {
                    return (!e || !this.vars.runBackwards) && (this._startAt = 0), this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(e), t.prototype.invalidate.call(this, e)
                }, s.resetTo = function(t, e, s, i, n) {
                    be || Ai.wake(), this._ts || this.play();
                    var r = Math.min(this._dur, (this._dp._time - this._start) * this._ts);
                    return this._initted || Ji(this, r),
                        function(t, e, s, i, n, r, a, o) {
                            var l, c, h, u, d = (t._pt && t._ptCache || (t._ptCache = {}))[e];
                            if (!d)
                                for (d = t._ptCache[e] = [], h = t._ptLookup, u = t._targets.length; u--;) {
                                    if ((l = h[u][e]) && l.d && l.d._pt)
                                        for (l = l.d._pt; l && l.p !== e && l.fp !== e;) l = l._next;
                                    if (!l) return Yi = 1, t.vars[e] = "+=0", Ji(t, a), Yi = 0, o ? ss(e + " not eligible for reset") : 1;
                                    d.push(l)
                                }
                            for (u = d.length; u--;)(l = (c = d[u])._pt || c).s = !i && 0 !== i || n ? l.s + (i || 0) + r * l.c : i, l.c = s - l.s, c.e && (c.e = ws(s) + ii(c.e)), c.b && (c.b = l.s + ii(c.b))
                        }(this, t, e, s, i, this._ease(r / this._dur), r, n) ? this.resetTo(t, e, s, i, 1) : (Ns(this, 0), this.parent || Os(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0), this.render(0))
                }, s.kill = function(t, e) {
                    if (void 0 === e && (e = "all"), !(t || e && "all" !== e)) return this._lazy = this._pt = 0, this.parent ? yi(this) : this;
                    if (this.timeline) {
                        var s = this.timeline.totalDuration();
                        return this.timeline.killTweensOf(t, e, Ui && !0 !== Ui.vars.overwrite)._first || yi(this), this.parent && s !== this.timeline.totalDuration() && Qs(this, this._dur * this.timeline._tDur / s, 0, 1), this
                    }
                    var i, n, r, a, o, l, c, h = this._targets,
                        u = t ? oi(t) : h,
                        d = this._ptLookup,
                        p = this._pt;
                    if ((!e || "all" === e) && function(t, e) {
                            for (var s = t.length, i = s === e.length; i && s-- && t[s] === e[s];);
                            return s < 0
                        }(h, u)) return "all" === e && (this._pt = 0), yi(this);
                    for (i = this._op = this._op || [], "all" !== e && (qe(e) && (o = {}, ys(e, (function(t) {
                            return o[t] = 1
                        })), e = o), e = function(t, e) {
                            var s, i, n, r, a = t[0] ? vs(t[0]).harness : 0,
                                o = a && a.aliases;
                            if (!o) return e;
                            for (i in s = Ms({}, e), o)
                                if (i in s)
                                    for (n = (r = o[i].split(",")).length; n--;) s[r[n]] = s[i];
                            return s
                        }(h, e)), c = h.length; c--;)
                        if (~u.indexOf(h[c]))
                            for (o in n = d[c], "all" === e ? (i[c] = e, a = n, r = {}) : (r = i[c] = i[c] || {}, a = e), a)(l = n && n[o]) && ("kill" in l.d && !0 !== l.d.kill(o) || Is(this, l, "_pt"), delete n[o]), "all" !== r && (r[o] = 1);
                    return this._initted && !this._pt && p && yi(this), this
                }, e.to = function(t, s) {
                    return new e(t, s, arguments[2])
                }, e.from = function(t, e) {
                    return ti(1, arguments)
                }, e.delayedCall = function(t, s, i, n) {
                    return new e(s, 0, {
                        immediateRender: !1,
                        lazy: !1,
                        overwrite: !1,
                        delay: t,
                        onComplete: s,
                        onReverseComplete: s,
                        onCompleteParams: i,
                        onReverseCompleteParams: i,
                        callbackScope: n
                    })
                }, e.fromTo = function(t, e, s) {
                    return ti(2, arguments)
                }, e.set = function(t, s) {
                    return s.duration = 0, s.repeatDelay || (s.repeat = 0), new e(t, s)
                }, e.killTweensOf = function(t, e, s) {
                    return ue.killTweensOf(t, e, s)
                }, e
            }(Gi);
            Cs(nn.prototype, {
                _targets: [],
                _lazy: 0,
                _startAt: 0,
                _op: 0,
                _onInit: 0
            }), ys("staggerTo,staggerFrom,staggerFromTo", (function(t) {
                nn[t] = function() {
                    var e = new Wi,
                        s = ni.call(arguments, 0);
                    return s.splice("staggerFromTo" === t ? 5 : 4, 0, 0), e[t].apply(e, s)
                }
            }));
            var rn = function(t, e, s) {
                    return t[e] = s
                },
                an = function(t, e, s) {
                    return t[e](s)
                },
                on = function(t, e, s, i) {
                    return t[e](i.fp, s)
                },
                ln = function(t, e, s) {
                    return t.setAttribute(e, s)
                },
                cn = function(t, e) {
                    return De(t[e]) ? an : Ve(t[e]) && t.setAttribute ? ln : rn
                },
                hn = function(t, e) {
                    return e.set(e.t, e.p, Math.round(1e6 * (e.s + e.c * t)) / 1e6, e)
                },
                un = function(t, e) {
                    return e.set(e.t, e.p, !!(e.s + e.c * t), e)
                },
                dn = function(t, e) {
                    var s = e._pt,
                        i = "";
                    if (!t && e.b) i = e.b;
                    else if (1 === t && e.e) i = e.e;
                    else {
                        for (; s;) i = s.p + (s.m ? s.m(s.s + s.c * t) : Math.round(1e4 * (s.s + s.c * t)) / 1e4) + i, s = s._next;
                        i += e.c
                    }
                    e.set(e.t, e.p, i, e)
                },
                pn = function(t, e) {
                    for (var s = e._pt; s;) s.r(t, s.d), s = s._next
                },
                fn = function(t, e, s, i) {
                    for (var n, r = this._pt; r;) n = r._next, r.p === i && r.modifier(t, e, s), r = n
                },
                mn = function(t) {
                    for (var e, s, i = this._pt; i;) s = i._next, i.p === t && !i.op || i.op === t ? Is(this, i, "_pt") : i.dep || (e = 1), i = s;
                    return !e
                },
                gn = function(t, e, s, i) {
                    i.mSet(t, e, i.m.call(i.tween, s, i.mt), i)
                },
                vn = function(t) {
                    for (var e, s, i, n, r = t._pt; r;) {
                        for (e = r._next, s = i; s && s.pr > r.pr;) s = s._next;
                        (r._prev = s ? s._prev : n) ? r._prev._next = r: i = r, (r._next = s) ? s._prev = r : n = r, r = e
                    }
                    t._pt = i
                },
                bn = function() {
                    function t(t, e, s, i, n, r, a, o, l) {
                        this.t = e, this.s = i, this.c = n, this.p = s, this.r = r || hn, this.d = a || this, this.set = o || rn, this.pr = l || 0, this._next = t, t && (t._prev = this)
                    }
                    return t.prototype.modifier = function(t, e, s) {
                        this.mSet = this.mSet || this.set, this.set = gn, this.m = t, this.mt = s, this.tween = e
                    }, t
                }();
            ys(ms + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", (function(t) {
                return ls[t] = 1
            })), Je.TweenMax = Je.TweenLite = nn, Je.TimelineLite = Je.TimelineMax = Wi, ue = new Wi({
                sortChildren: !1,
                defaults: Ee,
                autoRemoveChildren: !0,
                id: "root",
                smoothChildTiming: !0
            }), Se.stringFilter = Pi;
            var yn = [],
                wn = {},
                Tn = [],
                _n = 0,
                kn = 0,
                xn = function(t) {
                    return (wn[t] || Tn).map((function(t) {
                        return t()
                    }))
                },
                Sn = function() {
                    var t = Date.now(),
                        e = [];
                    t - _n > 2 && (xn("matchMediaInit"), yn.forEach((function(t) {
                        var s, i, n, r, a = t.queries,
                            o = t.conditions;
                        for (i in a)(s = de.matchMedia(a[i]).matches) && (n = 1), s !== o[i] && (o[i] = s, r = 1);
                        r && (t.revert(), n && e.push(t))
                    })), xn("matchMediaRevert"), e.forEach((function(t) {
                        return t.onMatch(t, (function(e) {
                            return t.add(null, e)
                        }))
                    })), _n = t, xn("matchMedia"))
                },
                En = function() {
                    function t(t, e) {
                        this.selector = e && li(e), this.data = [], this._r = [], this.isReverted = !1, this.id = kn++, t && this.add(t)
                    }
                    var e = t.prototype;
                    return e.add = function(t, e, s) {
                        De(t) && (s = e, e = t, t = De);
                        var i = this,
                            n = function() {
                                var t, n = he,
                                    r = i.selector;
                                return n && n !== i && n.data.push(i), s && (i.selector = li(s)), he = i, t = e.apply(i, arguments), De(t) && i._r.push(t), he = n, i.selector = r, i.isReverted = !1, t
                            };
                        return i.last = n, t === De ? n(i, (function(t) {
                            return i.add(null, t)
                        })) : t ? i[t] = n : n
                    }, e.ignore = function(t) {
                        var e = he;
                        he = null, t(this), he = e
                    }, e.getTweens = function() {
                        var e = [];
                        return this.data.forEach((function(s) {
                            return s instanceof t ? e.push.apply(e, s.getTweens()) : s instanceof nn && !(s.parent && "nested" === s.parent.data) && e.push(s)
                        })), e
                    }, e.clear = function() {
                        this._r.length = this.data.length = 0
                    }, e.kill = function(t, e) {
                        var s = this;
                        if (t ? function() {
                                for (var e, i = s.getTweens(), n = s.data.length; n--;) "isFlip" === (e = s.data[n]).data && (e.revert(), e.getChildren(!0, !0, !1).forEach((function(t) {
                                    return i.splice(i.indexOf(t), 1)
                                })));
                                for (i.map((function(t) {
                                        return {
                                            g: t._dur || t._delay || t._sat && !t._sat.vars.immediateRender ? t.globalTime(0) : -1 / 0,
                                            t
                                        }
                                    })).sort((function(t, e) {
                                        return e.g - t.g || -1 / 0
                                    })).forEach((function(e) {
                                        return e.t.revert(t)
                                    })), n = s.data.length; n--;)(e = s.data[n]) instanceof Wi ? "nested" !== e.data && (e.scrollTrigger && e.scrollTrigger.revert(), e.kill()) : !(e instanceof nn) && e.revert && e.revert(t);
                                s._r.forEach((function(e) {
                                    return e(t, s)
                                })), s.isReverted = !0
                            }() : this.data.forEach((function(t) {
                                return t.kill && t.kill()
                            })), this.clear(), e)
                            for (var i = yn.length; i--;) yn[i].id === this.id && yn.splice(i, 1)
                    }, e.revert = function(t) {
                        this.kill(t || {})
                    }, t
                }(),
                $n = function() {
                    function t(t) {
                        this.contexts = [], this.scope = t, he && he.data.push(this)
                    }
                    var e = t.prototype;
                    return e.add = function(t, e, s) {
                        je(t) || (t = {
                            matches: t
                        });
                        var i, n, r, a = new En(0, s || this.scope),
                            o = a.conditions = {};
                        for (n in he && !a.selector && (a.selector = he.selector), this.contexts.push(a), e = a.add("onMatch", e), a.queries = t, t) "all" === n ? r = 1 : (i = de.matchMedia(t[n])) && (yn.indexOf(a) < 0 && yn.push(a), (o[n] = i.matches) && (r = 1), i.addListener ? i.addListener(Sn) : i.addEventListener("change", Sn));
                        return r && e(a, (function(t) {
                            return a.add(null, t)
                        })), this
                    }, e.revert = function(t) {
                        this.kill(t || {})
                    }, e.kill = function(t) {
                        this.contexts.forEach((function(e) {
                            return e.kill(t, !0)
                        }))
                    }, t
                }(),
                Cn = {
                    registerPlugin: function() {
                        for (var t = arguments.length, e = new Array(t), s = 0; s < t; s++) e[s] = arguments[s];
                        e.forEach((function(t) {
                            return Ti(t)
                        }))
                    },
                    timeline: function(t) {
                        return new Wi(t)
                    },
                    getTweensOf: function(t, e) {
                        return ue.getTweensOf(t, e)
                    },
                    getProperty: function(t, e, s, i) {
                        qe(t) && (t = oi(t)[0]);
                        var n = vs(t || {}).get,
                            r = s ? $s : Es;
                        return "native" === s && (s = ""), t ? e ? r((us[e] && us[e].get || n)(t, e, s, i)) : function(e, s, i) {
                            return r((us[e] && us[e].get || n)(t, e, s, i))
                        } : t
                    },
                    quickSetter: function(t, e, s) {
                        if ((t = oi(t)).length > 1) {
                            var i = t.map((function(t) {
                                    return An.quickSetter(t, e, s)
                                })),
                                n = i.length;
                            return function(t) {
                                for (var e = n; e--;) i[e](t)
                            }
                        }
                        t = t[0] || {};
                        var r = us[e],
                            a = vs(t),
                            o = a.harness && (a.harness.aliases || {})[e] || e,
                            l = r ? function(e) {
                                var i = new r;
                                ve._pt = 0, i.init(t, s ? e + s : e, ve, 0, [t]), i.render(1, i), ve._pt && pn(1, ve)
                            } : a.set(t, o);
                        return r ? l : function(e) {
                            return l(t, o, s ? e + s : e, a, 1)
                        }
                    },
                    quickTo: function(t, e, s) {
                        var i, n = An.to(t, Ms(((i = {})[e] = "+=0.1", i.paused = !0, i), s || {})),
                            r = function(t, s, i) {
                                return n.resetTo(e, t, s, i)
                            };
                        return r.tween = n, r
                    },
                    isTweening: function(t) {
                        return ue.getTweensOf(t, !0).length > 0
                    },
                    defaults: function(t) {
                        return t && t.ease && (t.ease = ji(t.ease, Ee.ease)), Ps(Ee, t || {})
                    },
                    config: function(t) {
                        return Ps(Se, t || {})
                    },
                    registerEffect: function(t) {
                        var e = t.name,
                            s = t.effect,
                            i = t.plugins,
                            n = t.defaults,
                            r = t.extendTimeline;
                        (i || "").split(",").forEach((function(t) {
                            return t && !us[t] && !Je[t] && ss(e + " effect requires " + t + " plugin.")
                        })), ds[e] = function(t, e, i) {
                            return s(oi(t), Cs(e || {}, n), i)
                        }, r && (Wi.prototype[e] = function(t, s, i) {
                            return this.add(ds[e](t, je(s) ? s : (i = s) && {}, this), i)
                        })
                    },
                    registerEase: function(t, e) {
                        Oi[t] = ji(e)
                    },
                    parseEase: function(t, e) {
                        return arguments.length ? ji(t, e) : Oi
                    },
                    getById: function(t) {
                        return ue.getById(t)
                    },
                    exportRoot: function(t, e) {
                        void 0 === t && (t = {});
                        var s, i, n = new Wi(t);
                        for (n.smoothChildTiming = Fe(t.smoothChildTiming), ue.remove(n), n._dp = 0, n._time = n._tTime = ue._time, s = ue._first; s;) i = s._next, !e && !s._dur && s instanceof nn && s.vars.onComplete === s._targets[0] || Gs(n, s, s._start - s._delay), s = i;
                        return Gs(ue, n, 0), n
                    },
                    context: function(t, e) {
                        return t ? new En(t, e) : he
                    },
                    matchMedia: function(t) {
                        return new $n(t)
                    },
                    matchMediaRefresh: function() {
                        return yn.forEach((function(t) {
                            var e, s, i = t.conditions;
                            for (s in i) i[s] && (i[s] = !1, e = 1);
                            e && t.revert()
                        })) || Sn()
                    },
                    addEventListener: function(t, e) {
                        var s = wn[t] || (wn[t] = []);
                        ~s.indexOf(e) || s.push(e)
                    },
                    removeEventListener: function(t, e) {
                        var s = wn[t],
                            i = s && s.indexOf(e);
                        i >= 0 && s.splice(i, 1)
                    },
                    utils: {
                        wrap: function t(e, s, i) {
                            var n = s - e;
                            return He(e) ? fi(e, t(0, e.length), s) : ei(i, (function(t) {
                                return (n + (t - e) % n) % n + e
                            }))
                        },
                        wrapYoyo: function t(e, s, i) {
                            var n = s - e,
                                r = 2 * n;
                            return He(e) ? fi(e, t(0, e.length - 1), s) : ei(i, (function(t) {
                                return e + ((t = (r + (t - e) % r) % r || 0) > n ? r - t : t)
                            }))
                        },
                        distribute: hi,
                        random: pi,
                        snap: di,
                        normalize: function(t, e, s) {
                            return gi(t, e, 0, 1, s)
                        },
                        getUnit: ii,
                        clamp: function(t, e, s) {
                            return ei(s, (function(s) {
                                return si(t, e, s)
                            }))
                        },
                        splitColor: Si,
                        toArray: oi,
                        selector: li,
                        mapRange: gi,
                        pipe: function() {
                            for (var t = arguments.length, e = new Array(t), s = 0; s < t; s++) e[s] = arguments[s];
                            return function(t) {
                                return e.reduce((function(t, e) {
                                    return e(t)
                                }), t)
                            }
                        },
                        unitize: function(t, e) {
                            return function(s) {
                                return t(parseFloat(s)) + (e || ii(s))
                            }
                        },
                        interpolate: function t(e, s, i, n) {
                            var r = isNaN(e + s) ? 0 : function(t) {
                                return (1 - t) * e + t * s
                            };
                            if (!r) {
                                var a, o, l, c, h, u = qe(e),
                                    d = {};
                                if (!0 === i && (n = 1) && (i = null), u) e = {
                                    p: e
                                }, s = {
                                    p: s
                                };
                                else if (He(e) && !He(s)) {
                                    for (l = [], c = e.length, h = c - 2, o = 1; o < c; o++) l.push(t(e[o - 1], e[o]));
                                    c--, r = function(t) {
                                        t *= c;
                                        var e = Math.min(h, ~~t);
                                        return l[e](t - e)
                                    }, i = s
                                } else n || (e = Ms(He(e) ? [] : {}, e));
                                if (!l) {
                                    for (a in s) Qi.call(d, e, a, "get", s[a]);
                                    r = function(t) {
                                        return pn(t, d) || (u ? e.p : e)
                                    }
                                }
                            }
                            return ei(i, r)
                        },
                        shuffle: ci
                    },
                    install: ts,
                    effects: ds,
                    ticker: Ai,
                    updateRoot: Wi.updateRoot,
                    plugins: us,
                    globalTimeline: ue,
                    core: {
                        PropTween: bn,
                        globals: is,
                        Tween: nn,
                        Timeline: Wi,
                        Animation: Gi,
                        getCache: vs,
                        _removeLinkedListItem: Is,
                        reverting: function() {
                            return ce
                        },
                        context: function(t) {
                            return t && he && (he.data.push(t), t._ctx = he), he
                        },
                        suppressOverwrites: function(t) {
                            return le = t
                        }
                    }
                };
            ys("to,from,fromTo,delayedCall,set,killTweensOf", (function(t) {
                return Cn[t] = nn[t]
            })), Ai.add(Wi.updateRoot), ve = Cn.to({}, {
                duration: 0
            });
            var Mn = function(t, e) {
                    for (var s = t._pt; s && s.p !== e && s.op !== e && s.fp !== e;) s = s._next;
                    return s
                },
                Pn = function(t, e) {
                    return {
                        name: t,
                        rawVars: 1,
                        init: function(t, s, i) {
                            i._onInit = function(t) {
                                var i, n;
                                if (qe(s) && (i = {}, ys(s, (function(t) {
                                        return i[t] = 1
                                    })), s = i), e) {
                                    for (n in i = {}, s) i[n] = e(s[n]);
                                    s = i
                                }! function(t, e) {
                                    var s, i, n, r = t._targets;
                                    for (s in e)
                                        for (i = r.length; i--;)(n = t._ptLookup[i][s]) && (n = n.d) && (n._pt && (n = Mn(n, s)), n && n.modifier && n.modifier(e[s], t, r[i], s))
                                }(t, s)
                            }
                        }
                    }
                },
                An = Cn.registerPlugin({
                    name: "attr",
                    init: function(t, e, s, i, n) {
                        var r, a, o;
                        for (r in this.tween = s, e) o = t.getAttribute(r) || "", (a = this.add(t, "setAttribute", (o || 0) + "", e[r], i, n, 0, 0, r)).op = r, a.b = o, this._props.push(r)
                    },
                    render: function(t, e) {
                        for (var s = e._pt; s;) ce ? s.set(s.t, s.p, s.b, s) : s.r(t, s.d), s = s._next
                    }
                }, {
                    name: "endArray",
                    init: function(t, e) {
                        for (var s = e.length; s--;) this.add(t, s, t[s] || 0, e[s], 0, 0, 0, 0, 0, 1)
                    }
                }, Pn("roundProps", ui), Pn("modifiers"), Pn("snap", di)) || Cn;
            nn.version = Wi.version = An.version = "3.12.5", me = 1, Re() && Li();
            Oi.Power0, Oi.Power1, Oi.Power2, Oi.Power3, Oi.Power4, Oi.Linear, Oi.Quad, Oi.Cubic, Oi.Quart, Oi.Quint, Oi.Strong, Oi.Elastic, Oi.Back, Oi.SteppedEase, Oi.Bounce, Oi.Sine, Oi.Expo, Oi.Circ;
            var Ln, On, In, qn, Dn, zn, Vn, jn, Fn = {},
                Rn = 180 / Math.PI,
                Bn = Math.PI / 180,
                Nn = Math.atan2,
                Hn = /([A-Z])/g,
                Gn = /(left|right|width|margin|padding|x)/i,
                Wn = /[\s,\(]\S/,
                Un = {
                    autoAlpha: "opacity,visibility",
                    scale: "scaleX,scaleY",
                    alpha: "opacity"
                },
                Yn = function(t, e) {
                    return e.set(e.t, e.p, Math.round(1e4 * (e.s + e.c * t)) / 1e4 + e.u, e)
                },
                Xn = function(t, e) {
                    return e.set(e.t, e.p, 1 === t ? e.e : Math.round(1e4 * (e.s + e.c * t)) / 1e4 + e.u, e)
                },
                Qn = function(t, e) {
                    return e.set(e.t, e.p, t ? Math.round(1e4 * (e.s + e.c * t)) / 1e4 + e.u : e.b, e)
                },
                Kn = function(t, e) {
                    var s = e.s + e.c * t;
                    e.set(e.t, e.p, ~~(s + (s < 0 ? -.5 : .5)) + e.u, e)
                },
                Jn = function(t, e) {
                    return e.set(e.t, e.p, t ? e.e : e.b, e)
                },
                Zn = function(t, e) {
                    return e.set(e.t, e.p, 1 !== t ? e.b : e.e, e)
                },
                tr = function(t, e, s) {
                    return t.style[e] = s
                },
                er = function(t, e, s) {
                    return t.style.setProperty(e, s)
                },
                sr = function(t, e, s) {
                    return t._gsap[e] = s
                },
                ir = function(t, e, s) {
                    return t._gsap.scaleX = t._gsap.scaleY = s
                },
                nr = function(t, e, s, i, n) {
                    var r = t._gsap;
                    r.scaleX = r.scaleY = s, r.renderTransform(n, r)
                },
                rr = function(t, e, s, i, n) {
                    var r = t._gsap;
                    r[e] = s, r.renderTransform(n, r)
                },
                ar = "transform",
                or = ar + "Origin",
                lr = function t(e, s) {
                    var i = this,
                        n = this.target,
                        r = n.style,
                        a = n._gsap;
                    if (e in Fn && r) {
                        if (this.tfm = this.tfm || {}, "transform" === e) return Un.transform.split(",").forEach((function(e) {
                            return t.call(i, e, s)
                        }));
                        if (~(e = Un[e] || e).indexOf(",") ? e.split(",").forEach((function(t) {
                                return i.tfm[t] = Er(n, t)
                            })) : this.tfm[e] = a.x ? a[e] : Er(n, e), e === or && (this.tfm.zOrigin = a.zOrigin), this.props.indexOf(ar) >= 0) return;
                        a.svg && (this.svgo = n.getAttribute("data-svg-origin"), this.props.push(or, s, "")), e = ar
                    }(r || s) && this.props.push(e, s, r[e])
                },
                cr = function(t) {
                    t.translate && (t.removeProperty("translate"), t.removeProperty("scale"), t.removeProperty("rotate"))
                },
                hr = function() {
                    var t, e, s = this.props,
                        i = this.target,
                        n = i.style,
                        r = i._gsap;
                    for (t = 0; t < s.length; t += 3) s[t + 1] ? i[s[t]] = s[t + 2] : s[t + 2] ? n[s[t]] = s[t + 2] : n.removeProperty("--" === s[t].substr(0, 2) ? s[t] : s[t].replace(Hn, "-$1").toLowerCase());
                    if (this.tfm) {
                        for (e in this.tfm) r[e] = this.tfm[e];
                        r.svg && (r.renderTransform(), i.setAttribute("data-svg-origin", this.svgo || "")), (t = Vn()) && t.isStart || n[ar] || (cr(n), r.zOrigin && n[or] && (n[or] += " " + r.zOrigin + "px", r.zOrigin = 0, r.renderTransform()), r.uncache = 1)
                    }
                },
                ur = function(t, e) {
                    var s = {
                        target: t,
                        props: [],
                        revert: hr,
                        save: lr
                    };
                    return t._gsap || An.core.getCache(t), e && e.split(",").forEach((function(t) {
                        return s.save(t)
                    })), s
                },
                dr = function(t, e) {
                    var s = On.createElementNS ? On.createElementNS((e || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), t) : On.createElement(t);
                    return s && s.style ? s : On.createElement(t)
                },
                pr = function t(e, s, i) {
                    var n = getComputedStyle(e);
                    return n[s] || n.getPropertyValue(s.replace(Hn, "-$1").toLowerCase()) || n.getPropertyValue(s) || !i && t(e, mr(s) || s, 1) || ""
                },
                fr = "O,Moz,ms,Ms,Webkit".split(","),
                mr = function(t, e, s) {
                    var i = (e || Dn).style,
                        n = 5;
                    if (t in i && !s) return t;
                    for (t = t.charAt(0).toUpperCase() + t.substr(1); n-- && !(fr[n] + t in i););
                    return n < 0 ? null : (3 === n ? "ms" : n >= 0 ? fr[n] : "") + t
                },
                gr = function() {
                    "undefined" != typeof window && window.document && (Ln = window, On = Ln.document, In = On.documentElement, Dn = dr("div") || {
                        style: {}
                    }, dr("div"), ar = mr(ar), or = ar + "Origin", Dn.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0", jn = !!mr("perspective"), Vn = An.core.reverting, qn = 1)
                },
                vr = function t(e) {
                    var s, i = dr("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"),
                        n = this.parentNode,
                        r = this.nextSibling,
                        a = this.style.cssText;
                    if (In.appendChild(i), i.appendChild(this), this.style.display = "block", e) try {
                        s = this.getBBox(), this._gsapBBox = this.getBBox, this.getBBox = t
                    } catch (t) {} else this._gsapBBox && (s = this._gsapBBox());
                    return n && (r ? n.insertBefore(this, r) : n.appendChild(this)), In.removeChild(i), this.style.cssText = a, s
                },
                br = function(t, e) {
                    for (var s = e.length; s--;)
                        if (t.hasAttribute(e[s])) return t.getAttribute(e[s])
                },
                yr = function(t) {
                    var e;
                    try {
                        e = t.getBBox()
                    } catch (s) {
                        e = vr.call(t, !0)
                    }
                    return e && (e.width || e.height) || t.getBBox === vr || (e = vr.call(t, !0)), !e || e.width || e.x || e.y ? e : {
                        x: +br(t, ["x", "cx", "x1"]) || 0,
                        y: +br(t, ["y", "cy", "y1"]) || 0,
                        width: 0,
                        height: 0
                    }
                },
                wr = function(t) {
                    return !(!t.getCTM || t.parentNode && !t.ownerSVGElement || !yr(t))
                },
                Tr = function(t, e) {
                    if (e) {
                        var s, i = t.style;
                        e in Fn && e !== or && (e = ar), i.removeProperty ? ("ms" !== (s = e.substr(0, 2)) && "webkit" !== e.substr(0, 6) || (e = "-" + e), i.removeProperty("--" === s ? e : e.replace(Hn, "-$1").toLowerCase())) : i.removeAttribute(e)
                    }
                },
                _r = function(t, e, s, i, n, r) {
                    var a = new bn(t._pt, e, s, 0, 1, r ? Zn : Jn);
                    return t._pt = a, a.b = i, a.e = n, t._props.push(s), a
                },
                kr = {
                    deg: 1,
                    rad: 1,
                    turn: 1
                },
                xr = {
                    grid: 1,
                    flex: 1
                },
                Sr = function t(e, s, i, n) {
                    var r, a, o, l, c = parseFloat(i) || 0,
                        h = (i + "").trim().substr((c + "").length) || "px",
                        u = Dn.style,
                        d = Gn.test(s),
                        p = "svg" === e.tagName.toLowerCase(),
                        f = (p ? "client" : "offset") + (d ? "Width" : "Height"),
                        m = 100,
                        g = "px" === n,
                        v = "%" === n;
                    if (n === h || !c || kr[n] || kr[h]) return c;
                    if ("px" !== h && !g && (c = t(e, s, i, "px")), l = e.getCTM && wr(e), (v || "%" === h) && (Fn[s] || ~s.indexOf("adius"))) return r = l ? e.getBBox()[d ? "width" : "height"] : e[f], ws(v ? c / r * m : c / 100 * r);
                    if (u[d ? "width" : "height"] = m + (g ? h : n), a = ~s.indexOf("adius") || "em" === n && e.appendChild && !p ? e : e.parentNode, l && (a = (e.ownerSVGElement || {}).parentNode), a && a !== On && a.appendChild || (a = On.body), (o = a._gsap) && v && o.width && d && o.time === Ai.time && !o.uncache) return ws(c / o.width * m);
                    if (!v || "height" !== s && "width" !== s)(v || "%" === h) && !xr[pr(a, "display")] && (u.position = pr(e, "position")), a === e && (u.position = "static"), a.appendChild(Dn), r = Dn[f], a.removeChild(Dn), u.position = "absolute";
                    else {
                        var b = e.style[s];
                        e.style[s] = m + n, r = e[f], b ? e.style[s] = b : Tr(e, s)
                    }
                    return d && v && ((o = vs(a)).time = Ai.time, o.width = a[f]), ws(g ? r * c / m : r && c ? m / r * c : 0)
                },
                Er = function(t, e, s, i) {
                    var n;
                    return qn || gr(), e in Un && "transform" !== e && ~(e = Un[e]).indexOf(",") && (e = e.split(",")[0]), Fn[e] && "transform" !== e ? (n = zr(t, i), n = "transformOrigin" !== e ? n[e] : n.svg ? n.origin : Vr(pr(t, or)) + " " + n.zOrigin + "px") : (!(n = t.style[e]) || "auto" === n || i || ~(n + "").indexOf("calc(")) && (n = Pr[e] && Pr[e](t, e, s) || pr(t, e) || bs(t, e) || ("opacity" === e ? 1 : 0)), s && !~(n + "").trim().indexOf(" ") ? Sr(t, e, n, s) + s : n
                },
                $r = function(t, e, s, i) {
                    if (!s || "none" === s) {
                        var n = mr(e, t, 1),
                            r = n && pr(t, n, 1);
                        r && r !== s ? (e = n, s = r) : "borderColor" === e && (s = pr(t, "borderTopColor"))
                    }
                    var a, o, l, c, h, u, d, p, f, m, g, v = new bn(this._pt, t.style, e, 0, 1, dn),
                        b = 0,
                        y = 0;
                    if (v.b = s, v.e = i, s += "", "auto" === (i += "") && (u = t.style[e], t.style[e] = i, i = pr(t, e) || i, u ? t.style[e] = u : Tr(t, e)), Pi(a = [s, i]), i = a[1], l = (s = a[0]).match(Ue) || [], (i.match(Ue) || []).length) {
                        for (; o = Ue.exec(i);) d = o[0], f = i.substring(b, o.index), h ? h = (h + 1) % 5 : "rgba(" !== f.substr(-5) && "hsla(" !== f.substr(-5) || (h = 1), d !== (u = l[y++] || "") && (c = parseFloat(u) || 0, g = u.substr((c + "").length), "=" === d.charAt(1) && (d = _s(c, d) + g), p = parseFloat(d), m = d.substr((p + "").length), b = Ue.lastIndex - m.length, m || (m = m || Se.units[e] || g, b === i.length && (i += m, v.e += m)), g !== m && (c = Sr(t, e, u, m) || 0), v._pt = {
                            _next: v._pt,
                            p: f || 1 === y ? f : ",",
                            s: c,
                            c: p - c,
                            m: h && h < 4 || "zIndex" === e ? Math.round : 0
                        });
                        v.c = b < i.length ? i.substring(b, i.length) : ""
                    } else v.r = "display" === e && "none" === i ? Zn : Jn;
                    return Xe.test(i) && (v.e = 0), this._pt = v, v
                },
                Cr = {
                    top: "0%",
                    bottom: "100%",
                    left: "0%",
                    right: "100%",
                    center: "50%"
                },
                Mr = function(t, e) {
                    if (e.tween && e.tween._time === e.tween._dur) {
                        var s, i, n, r = e.t,
                            a = r.style,
                            o = e.u,
                            l = r._gsap;
                        if ("all" === o || !0 === o) a.cssText = "", i = 1;
                        else
                            for (n = (o = o.split(",")).length; --n > -1;) s = o[n], Fn[s] && (i = 1, s = "transformOrigin" === s ? or : ar), Tr(r, s);
                        i && (Tr(r, ar), l && (l.svg && r.removeAttribute("transform"), zr(r, 1), l.uncache = 1, cr(a)))
                    }
                },
                Pr = {
                    clearProps: function(t, e, s, i, n) {
                        if ("isFromStart" !== n.data) {
                            var r = t._pt = new bn(t._pt, e, s, 0, 0, Mr);
                            return r.u = i, r.pr = -10, r.tween = n, t._props.push(s), 1
                        }
                    }
                },
                Ar = [1, 0, 0, 1, 0, 0],
                Lr = {},
                Or = function(t) {
                    return "matrix(1, 0, 0, 1, 0, 0)" === t || "none" === t || !t
                },
                Ir = function(t) {
                    var e = pr(t, ar);
                    return Or(e) ? Ar : e.substr(7).match(We).map(ws)
                },
                qr = function(t, e) {
                    var s, i, n, r, a = t._gsap || vs(t),
                        o = t.style,
                        l = Ir(t);
                    return a.svg && t.getAttribute("transform") ? "1,0,0,1,0,0" === (l = [(n = t.transform.baseVal.consolidate().matrix).a, n.b, n.c, n.d, n.e, n.f]).join(",") ? Ar : l : (l !== Ar || t.offsetParent || t === In || a.svg || (n = o.display, o.display = "block", (s = t.parentNode) && t.offsetParent || (r = 1, i = t.nextElementSibling, In.appendChild(t)), l = Ir(t), n ? o.display = n : Tr(t, "display"), r && (i ? s.insertBefore(t, i) : s ? s.appendChild(t) : In.removeChild(t))), e && l.length > 6 ? [l[0], l[1], l[4], l[5], l[12], l[13]] : l)
                },
                Dr = function(t, e, s, i, n, r) {
                    var a, o, l, c = t._gsap,
                        h = n || qr(t, !0),
                        u = c.xOrigin || 0,
                        d = c.yOrigin || 0,
                        p = c.xOffset || 0,
                        f = c.yOffset || 0,
                        m = h[0],
                        g = h[1],
                        v = h[2],
                        b = h[3],
                        y = h[4],
                        w = h[5],
                        T = e.split(" "),
                        _ = parseFloat(T[0]) || 0,
                        k = parseFloat(T[1]) || 0;
                    s ? h !== Ar && (o = m * b - g * v) && (l = _ * (-g / o) + k * (m / o) - (m * w - g * y) / o, _ = _ * (b / o) + k * (-v / o) + (v * w - b * y) / o, k = l) : (_ = (a = yr(t)).x + (~T[0].indexOf("%") ? _ / 100 * a.width : _), k = a.y + (~(T[1] || T[0]).indexOf("%") ? k / 100 * a.height : k)), i || !1 !== i && c.smooth ? (y = _ - u, w = k - d, c.xOffset = p + (y * m + w * v) - y, c.yOffset = f + (y * g + w * b) - w) : c.xOffset = c.yOffset = 0, c.xOrigin = _, c.yOrigin = k, c.smooth = !!i, c.origin = e, c.originIsAbsolute = !!s, t.style[or] = "0px 0px", r && (_r(r, c, "xOrigin", u, _), _r(r, c, "yOrigin", d, k), _r(r, c, "xOffset", p, c.xOffset), _r(r, c, "yOffset", f, c.yOffset)), t.setAttribute("data-svg-origin", _ + " " + k)
                },
                zr = function(t, e) {
                    var s = t._gsap || new Hi(t);
                    if ("x" in s && !e && !s.uncache) return s;
                    var i, n, r, a, o, l, c, h, u, d, p, f, m, g, v, b, y, w, T, _, k, x, S, E, $, C, M, P, A, L, O, I, q = t.style,
                        D = s.scaleX < 0,
                        z = "px",
                        V = "deg",
                        j = getComputedStyle(t),
                        F = pr(t, or) || "0";
                    return i = n = r = l = c = h = u = d = p = 0, a = o = 1, s.svg = !(!t.getCTM || !wr(t)), j.translate && ("none" === j.translate && "none" === j.scale && "none" === j.rotate || (q[ar] = ("none" !== j.translate ? "translate3d(" + (j.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + ("none" !== j.rotate ? "rotate(" + j.rotate + ") " : "") + ("none" !== j.scale ? "scale(" + j.scale.split(" ").join(",") + ") " : "") + ("none" !== j[ar] ? j[ar] : "")), q.scale = q.rotate = q.translate = "none"), g = qr(t, s.svg), s.svg && (s.uncache ? ($ = t.getBBox(), F = s.xOrigin - $.x + "px " + (s.yOrigin - $.y) + "px", E = "") : E = !e && t.getAttribute("data-svg-origin"), Dr(t, E || F, !!E || s.originIsAbsolute, !1 !== s.smooth, g)), f = s.xOrigin || 0, m = s.yOrigin || 0, g !== Ar && (w = g[0], T = g[1], _ = g[2], k = g[3], i = x = g[4], n = S = g[5], 6 === g.length ? (a = Math.sqrt(w * w + T * T), o = Math.sqrt(k * k + _ * _), l = w || T ? Nn(T, w) * Rn : 0, (u = _ || k ? Nn(_, k) * Rn + l : 0) && (o *= Math.abs(Math.cos(u * Bn))), s.svg && (i -= f - (f * w + m * _), n -= m - (f * T + m * k))) : (I = g[6], L = g[7], M = g[8], P = g[9], A = g[10], O = g[11], i = g[12], n = g[13], r = g[14], c = (v = Nn(I, A)) * Rn, v && (E = x * (b = Math.cos(-v)) + M * (y = Math.sin(-v)), $ = S * b + P * y, C = I * b + A * y, M = x * -y + M * b, P = S * -y + P * b, A = I * -y + A * b, O = L * -y + O * b, x = E, S = $, I = C), h = (v = Nn(-_, A)) * Rn, v && (b = Math.cos(-v), O = k * (y = Math.sin(-v)) + O * b, w = E = w * b - M * y, T = $ = T * b - P * y, _ = C = _ * b - A * y), l = (v = Nn(T, w)) * Rn, v && (E = w * (b = Math.cos(v)) + T * (y = Math.sin(v)), $ = x * b + S * y, T = T * b - w * y, S = S * b - x * y, w = E, x = $), c && Math.abs(c) + Math.abs(l) > 359.9 && (c = l = 0, h = 180 - h), a = ws(Math.sqrt(w * w + T * T + _ * _)), o = ws(Math.sqrt(S * S + I * I)), v = Nn(x, S), u = Math.abs(v) > 2e-4 ? v * Rn : 0, p = O ? 1 / (O < 0 ? -O : O) : 0), s.svg && (E = t.getAttribute("transform"), s.forceCSS = t.setAttribute("transform", "") || !Or(pr(t, ar)), E && t.setAttribute("transform", E))), Math.abs(u) > 90 && Math.abs(u) < 270 && (D ? (a *= -1, u += l <= 0 ? 180 : -180, l += l <= 0 ? 180 : -180) : (o *= -1, u += u <= 0 ? 180 : -180)), e = e || s.uncache, s.x = i - ((s.xPercent = i && (!e && s.xPercent || (Math.round(t.offsetWidth / 2) === Math.round(-i) ? -50 : 0))) ? t.offsetWidth * s.xPercent / 100 : 0) + z, s.y = n - ((s.yPercent = n && (!e && s.yPercent || (Math.round(t.offsetHeight / 2) === Math.round(-n) ? -50 : 0))) ? t.offsetHeight * s.yPercent / 100 : 0) + z, s.z = r + z, s.scaleX = ws(a), s.scaleY = ws(o), s.rotation = ws(l) + V, s.rotationX = ws(c) + V, s.rotationY = ws(h) + V, s.skewX = u + V, s.skewY = d + V, s.transformPerspective = p + z, (s.zOrigin = parseFloat(F.split(" ")[2]) || !e && s.zOrigin || 0) && (q[or] = Vr(F)), s.xOffset = s.yOffset = 0, s.force3D = Se.force3D, s.renderTransform = s.svg ? Gr : jn ? Hr : Fr, s.uncache = 0, s
                },
                Vr = function(t) {
                    return (t = t.split(" "))[0] + " " + t[1]
                },
                jr = function(t, e, s) {
                    var i = ii(e);
                    return ws(parseFloat(e) + parseFloat(Sr(t, "x", s + "px", i))) + i
                },
                Fr = function(t, e) {
                    e.z = "0px", e.rotationY = e.rotationX = "0deg", e.force3D = 0, Hr(t, e)
                },
                Rr = "0deg",
                Br = "0px",
                Nr = ") ",
                Hr = function(t, e) {
                    var s = e || this,
                        i = s.xPercent,
                        n = s.yPercent,
                        r = s.x,
                        a = s.y,
                        o = s.z,
                        l = s.rotation,
                        c = s.rotationY,
                        h = s.rotationX,
                        u = s.skewX,
                        d = s.skewY,
                        p = s.scaleX,
                        f = s.scaleY,
                        m = s.transformPerspective,
                        g = s.force3D,
                        v = s.target,
                        b = s.zOrigin,
                        y = "",
                        w = "auto" === g && t && 1 !== t || !0 === g;
                    if (b && (h !== Rr || c !== Rr)) {
                        var T, _ = parseFloat(c) * Bn,
                            k = Math.sin(_),
                            x = Math.cos(_);
                        _ = parseFloat(h) * Bn, T = Math.cos(_), r = jr(v, r, k * T * -b), a = jr(v, a, -Math.sin(_) * -b), o = jr(v, o, x * T * -b + b)
                    }
                    m !== Br && (y += "perspective(" + m + Nr), (i || n) && (y += "translate(" + i + "%, " + n + "%) "), (w || r !== Br || a !== Br || o !== Br) && (y += o !== Br || w ? "translate3d(" + r + ", " + a + ", " + o + ") " : "translate(" + r + ", " + a + Nr), l !== Rr && (y += "rotate(" + l + Nr), c !== Rr && (y += "rotateY(" + c + Nr), h !== Rr && (y += "rotateX(" + h + Nr), u === Rr && d === Rr || (y += "skew(" + u + ", " + d + Nr), 1 === p && 1 === f || (y += "scale(" + p + ", " + f + Nr), v.style[ar] = y || "translate(0, 0)"
                },
                Gr = function(t, e) {
                    var s, i, n, r, a, o = e || this,
                        l = o.xPercent,
                        c = o.yPercent,
                        h = o.x,
                        u = o.y,
                        d = o.rotation,
                        p = o.skewX,
                        f = o.skewY,
                        m = o.scaleX,
                        g = o.scaleY,
                        v = o.target,
                        b = o.xOrigin,
                        y = o.yOrigin,
                        w = o.xOffset,
                        T = o.yOffset,
                        _ = o.forceCSS,
                        k = parseFloat(h),
                        x = parseFloat(u);
                    d = parseFloat(d), p = parseFloat(p), (f = parseFloat(f)) && (p += f = parseFloat(f), d += f), d || p ? (d *= Bn, p *= Bn, s = Math.cos(d) * m, i = Math.sin(d) * m, n = Math.sin(d - p) * -g, r = Math.cos(d - p) * g, p && (f *= Bn, a = Math.tan(p - f), n *= a = Math.sqrt(1 + a * a), r *= a, f && (a = Math.tan(f), s *= a = Math.sqrt(1 + a * a), i *= a)), s = ws(s), i = ws(i), n = ws(n), r = ws(r)) : (s = m, r = g, i = n = 0), (k && !~(h + "").indexOf("px") || x && !~(u + "").indexOf("px")) && (k = Sr(v, "x", h, "px"), x = Sr(v, "y", u, "px")), (b || y || w || T) && (k = ws(k + b - (b * s + y * n) + w), x = ws(x + y - (b * i + y * r) + T)), (l || c) && (a = v.getBBox(), k = ws(k + l / 100 * a.width), x = ws(x + c / 100 * a.height)), a = "matrix(" + s + "," + i + "," + n + "," + r + "," + k + "," + x + ")", v.setAttribute("transform", a), _ && (v.style[ar] = a)
                },
                Wr = function(t, e, s, i, n) {
                    var r, a, o = 360,
                        l = qe(n),
                        c = parseFloat(n) * (l && ~n.indexOf("rad") ? Rn : 1) - i,
                        h = i + c + "deg";
                    return l && ("short" === (r = n.split("_")[1]) && (c %= o) !== c % 180 && (c += c < 0 ? o : -360), "cw" === r && c < 0 ? c = (c + 36e9) % o - ~~(c / o) * o : "ccw" === r && c > 0 && (c = (c - 36e9) % o - ~~(c / o) * o)), t._pt = a = new bn(t._pt, e, s, i, c, Xn), a.e = h, a.u = "deg", t._props.push(s), a
                },
                Ur = function(t, e) {
                    for (var s in e) t[s] = e[s];
                    return t
                },
                Yr = function(t, e, s) {
                    var i, n, r, a, o, l, c, h = Ur({}, s._gsap),
                        u = s.style;
                    for (n in h.svg ? (r = s.getAttribute("transform"), s.setAttribute("transform", ""), u[ar] = e, i = zr(s, 1), Tr(s, ar), s.setAttribute("transform", r)) : (r = getComputedStyle(s)[ar], u[ar] = e, i = zr(s, 1), u[ar] = r), Fn)(r = h[n]) !== (a = i[n]) && "perspective,force3D,transformOrigin,svgOrigin".indexOf(n) < 0 && (o = ii(r) !== (c = ii(a)) ? Sr(s, n, r, c) : parseFloat(r), l = parseFloat(a), t._pt = new bn(t._pt, i, n, o, l - o, Yn), t._pt.u = c || 0, t._props.push(n));
                    Ur(i, h)
                };
            ys("padding,margin,Width,Radius", (function(t, e) {
                var s = "Top",
                    i = "Right",
                    n = "Bottom",
                    r = "Left",
                    a = (e < 3 ? [s, i, n, r] : [s + r, s + i, n + i, n + r]).map((function(s) {
                        return e < 2 ? t + s : "border" + s + t
                    }));
                Pr[e > 1 ? "border" + t : t] = function(t, e, s, i, n) {
                    var r, o;
                    if (arguments.length < 4) return r = a.map((function(e) {
                        return Er(t, e, s)
                    })), 5 === (o = r.join(" ")).split(r[0]).length ? r[0] : o;
                    r = (i + "").split(" "), o = {}, a.forEach((function(t, e) {
                        return o[t] = r[e] = r[e] || r[(e - 1) / 2 | 0]
                    })), t.init(e, o, n)
                }
            }));
            var Xr, Qr, Kr, Jr = {
                name: "css",
                register: gr,
                targetTest: function(t) {
                    return t.style && t.nodeType
                },
                init: function(t, e, s, i, n) {
                    var r, a, o, l, c, h, u, d, p, f, m, g, v, b, y, w, T, _, k, x, S = this._props,
                        E = t.style,
                        $ = s.vars.startAt;
                    for (u in qn || gr(), this.styles = this.styles || ur(t), w = this.styles.props, this.tween = s, e)
                        if ("autoRound" !== u && (a = e[u], !us[u] || !Ki(u, e, s, i, t, n)))
                            if (c = typeof a, h = Pr[u], "function" === c && (c = typeof(a = a.call(s, i, t, n))), "string" === c && ~a.indexOf("random(") && (a = mi(a)), h) h(this, t, u, a, s) && (y = 1);
                            else if ("--" === u.substr(0, 2)) r = (getComputedStyle(t).getPropertyValue(u) + "").trim(), a += "", Ci.lastIndex = 0, Ci.test(r) || (d = ii(r), p = ii(a)), p ? d !== p && (r = Sr(t, u, r, p) + p) : d && (a += d), this.add(E, "setProperty", r, a, i, n, 0, 0, u), S.push(u), w.push(u, 0, E[u]);
                    else if ("undefined" !== c) {
                        if ($ && u in $ ? (r = "function" == typeof $[u] ? $[u].call(s, i, t, n) : $[u], qe(r) && ~r.indexOf("random(") && (r = mi(r)), ii(r + "") || "auto" === r || (r += Se.units[u] || ii(Er(t, u)) || ""), "=" === (r + "").charAt(1) && (r = Er(t, u))) : r = Er(t, u), l = parseFloat(r), (f = "string" === c && "=" === a.charAt(1) && a.substr(0, 2)) && (a = a.substr(2)), o = parseFloat(a), u in Un && ("autoAlpha" === u && (1 === l && "hidden" === Er(t, "visibility") && o && (l = 0), w.push("visibility", 0, E.visibility), _r(this, E, "visibility", l ? "inherit" : "hidden", o ? "inherit" : "hidden", !o)), "scale" !== u && "transform" !== u && ~(u = Un[u]).indexOf(",") && (u = u.split(",")[0])), m = u in Fn)
                            if (this.styles.save(u), g || ((v = t._gsap).renderTransform && !e.parseTransform || zr(t, e.parseTransform), b = !1 !== e.smoothOrigin && v.smooth, (g = this._pt = new bn(this._pt, E, ar, 0, 1, v.renderTransform, v, 0, -1)).dep = 1), "scale" === u) this._pt = new bn(this._pt, v, "scaleY", v.scaleY, (f ? _s(v.scaleY, f + o) : o) - v.scaleY || 0, Yn), this._pt.u = 0, S.push("scaleY", u), u += "X";
                            else {
                                if ("transformOrigin" === u) {
                                    w.push(or, 0, E[or]), _ = void 0, k = void 0, x = void 0, _ = (T = a).split(" "), k = _[0], x = _[1] || "50%", "top" !== k && "bottom" !== k && "left" !== x && "right" !== x || (T = k, k = x, x = T), _[0] = Cr[k] || k, _[1] = Cr[x] || x, a = _.join(" "), v.svg ? Dr(t, a, 0, b, 0, this) : ((p = parseFloat(a.split(" ")[2]) || 0) !== v.zOrigin && _r(this, v, "zOrigin", v.zOrigin, p), _r(this, E, u, Vr(r), Vr(a)));
                                    continue
                                }
                                if ("svgOrigin" === u) {
                                    Dr(t, a, 1, b, 0, this);
                                    continue
                                }
                                if (u in Lr) {
                                    Wr(this, v, u, l, f ? _s(l, f + a) : a);
                                    continue
                                }
                                if ("smoothOrigin" === u) {
                                    _r(this, v, "smooth", v.smooth, a);
                                    continue
                                }
                                if ("force3D" === u) {
                                    v[u] = a;
                                    continue
                                }
                                if ("transform" === u) {
                                    Yr(this, a, t);
                                    continue
                                }
                            }
                        else u in E || (u = mr(u) || u);
                        if (m || (o || 0 === o) && (l || 0 === l) && !Wn.test(a) && u in E) o || (o = 0), (d = (r + "").substr((l + "").length)) !== (p = ii(a) || (u in Se.units ? Se.units[u] : d)) && (l = Sr(t, u, r, p)), this._pt = new bn(this._pt, m ? v : E, u, l, (f ? _s(l, f + o) : o) - l, m || "px" !== p && "zIndex" !== u || !1 === e.autoRound ? Yn : Kn), this._pt.u = p || 0, d !== p && "%" !== p && (this._pt.b = r, this._pt.r = Qn);
                        else if (u in E) $r.call(this, t, u, r, f ? f + a : a);
                        else if (u in t) this.add(t, u, r || t[u], f ? f + a : a, i, n);
                        else if ("parseTransform" !== u) {
                            es(u, a);
                            continue
                        }
                        m || (u in E ? w.push(u, 0, E[u]) : w.push(u, 1, r || t[u])), S.push(u)
                    }
                    y && vn(this)
                },
                render: function(t, e) {
                    if (e.tween._time || !Vn())
                        for (var s = e._pt; s;) s.r(t, s.d), s = s._next;
                    else e.styles.revert()
                },
                get: Er,
                aliases: Un,
                getSetter: function(t, e, s) {
                    var i = Un[e];
                    return i && i.indexOf(",") < 0 && (e = i), e in Fn && e !== or && (t._gsap.x || Er(t, "x")) ? s && zn === s ? "scale" === e ? ir : sr : (zn = s || {}) && ("scale" === e ? nr : rr) : t.style && !Ve(t.style[e]) ? tr : ~e.indexOf("-") ? er : cn(t, e)
                },
                core: {
                    _removeProperty: Tr,
                    _getMatrix: qr
                }
            };
            An.utils.checkPrefix = mr, An.core.getStyleSaver = ur, Kr = ys((Xr = "x,y,z,scale,scaleX,scaleY,xPercent,yPercent") + "," + (Qr = "rotation,rotationX,rotationY,skewX,skewY") + ",transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", (function(t) {
                Fn[t] = 1
            })), ys(Qr, (function(t) {
                Se.units[t] = "deg", Lr[t] = 1
            })), Un[Kr[13]] = Xr + "," + Qr, ys("0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY", (function(t) {
                var e = t.split(":");
                Un[e[1]] = Kr[e[0]]
            })), ys("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", (function(t) {
                Se.units[t] = "px"
            })), An.registerPlugin(Jr);
            var Zr = An.registerPlugin(Jr) || An;
            Zr.core.Tween;

            function ta(t, e) {
                for (var s = 0; s < e.length; s++) {
                    var i = e[s];
                    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
                }
            }
            var ea, sa, ia, na, ra, aa, oa, la, ca, ha, ua, da, pa, fa = function() {
                    return ea || "undefined" != typeof window && (ea = window.gsap) && ea.registerPlugin && ea
                },
                ma = 1,
                ga = [],
                va = [],
                ba = [],
                ya = Date.now,
                wa = function(t, e) {
                    return e
                },
                Ta = function(t, e) {
                    return ~ba.indexOf(t) && ba[ba.indexOf(t) + 1][e]
                },
                _a = function(t) {
                    return !!~ha.indexOf(t)
                },
                ka = function(t, e, s, i, n) {
                    return t.addEventListener(e, s, {
                        passive: !1 !== i,
                        capture: !!n
                    })
                },
                xa = function(t, e, s, i) {
                    return t.removeEventListener(e, s, !!i)
                },
                Sa = "scrollLeft",
                Ea = "scrollTop",
                $a = function() {
                    return ua && ua.isPressed || va.cache++
                },
                Ca = function(t, e) {
                    var s = function s(i) {
                        if (i || 0 === i) {
                            ma && (ia.history.scrollRestoration = "manual");
                            var n = ua && ua.isPressed;
                            i = s.v = Math.round(i) || (ua && ua.iOS ? 1 : 0), t(i), s.cacheID = va.cache, n && wa("ss", i)
                        } else(e || va.cache !== s.cacheID || wa("ref")) && (s.cacheID = va.cache, s.v = t());
                        return s.v + s.offset
                    };
                    return s.offset = 0, t && s
                },
                Ma = {
                    s: Sa,
                    p: "left",
                    p2: "Left",
                    os: "right",
                    os2: "Right",
                    d: "width",
                    d2: "Width",
                    a: "x",
                    sc: Ca((function(t) {
                        return arguments.length ? ia.scrollTo(t, Pa.sc()) : ia.pageXOffset || na[Sa] || ra[Sa] || aa[Sa] || 0
                    }))
                },
                Pa = {
                    s: Ea,
                    p: "top",
                    p2: "Top",
                    os: "bottom",
                    os2: "Bottom",
                    d: "height",
                    d2: "Height",
                    a: "y",
                    op: Ma,
                    sc: Ca((function(t) {
                        return arguments.length ? ia.scrollTo(Ma.sc(), t) : ia.pageYOffset || na[Ea] || ra[Ea] || aa[Ea] || 0
                    }))
                },
                Aa = function(t, e) {
                    return (e && e._ctx && e._ctx.selector || ea.utils.toArray)(t)[0] || ("string" == typeof t && !1 !== ea.config().nullTargetWarn ? console.warn("Element not found:", t) : null)
                },
                La = function(t, e) {
                    var s = e.s,
                        i = e.sc;
                    _a(t) && (t = na.scrollingElement || ra);
                    var n = va.indexOf(t),
                        r = i === Pa.sc ? 1 : 2;
                    !~n && (n = va.push(t) - 1), va[n + r] || ka(t, "scroll", $a);
                    var a = va[n + r],
                        o = a || (va[n + r] = Ca(Ta(t, s), !0) || (_a(t) ? i : Ca((function(e) {
                            return arguments.length ? t[s] = e : t[s]
                        }))));
                    return o.target = t, a || (o.smooth = "smooth" === ea.getProperty(t, "scrollBehavior")), o
                },
                Oa = function(t, e, s) {
                    var i = t,
                        n = t,
                        r = ya(),
                        a = r,
                        o = e || 50,
                        l = Math.max(500, 3 * o),
                        c = function(t, e) {
                            var l = ya();
                            e || l - r > o ? (n = i, i = t, a = r, r = l) : s ? i += t : i = n + (t - n) / (l - a) * (r - a)
                        };
                    return {
                        update: c,
                        reset: function() {
                            n = i = s ? 0 : i, a = r = 0
                        },
                        getVelocity: function(t) {
                            var e = a,
                                o = n,
                                h = ya();
                            return (t || 0 === t) && t !== i && c(t), r === a || h - a > l ? 0 : (i + (s ? o : -o)) / ((s ? h : r) - e) * 1e3
                        }
                    }
                },
                Ia = function(t, e) {
                    return e && !t._gsapAllow && t.preventDefault(), t.changedTouches ? t.changedTouches[0] : t
                },
                qa = function(t) {
                    var e = Math.max.apply(Math, t),
                        s = Math.min.apply(Math, t);
                    return Math.abs(e) >= Math.abs(s) ? e : s
                },
                Da = function() {
                    var t, e, s, i;
                    (ca = ea.core.globals().ScrollTrigger) && ca.core && (t = ca.core, e = t.bridge || {}, s = t._scrollers, i = t._proxies, s.push.apply(s, va), i.push.apply(i, ba), va = s, ba = i, wa = function(t, s) {
                        return e[t](s)
                    })
                },
                za = function(t) {
                    return ea = t || fa(), !sa && ea && "undefined" != typeof document && document.body && (ia = window, na = document, ra = na.documentElement, aa = na.body, ha = [ia, na, ra, aa], ea.utils.clamp, pa = ea.core.context || function() {}, la = "onpointerenter" in aa ? "pointer" : "mouse", oa = Va.isTouch = ia.matchMedia && ia.matchMedia("(hover: none), (pointer: coarse)").matches ? 1 : "ontouchstart" in ia || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 ? 2 : 0, da = Va.eventTypes = ("ontouchstart" in ra ? "touchstart,touchmove,touchcancel,touchend" : "onpointerdown" in ra ? "pointerdown,pointermove,pointercancel,pointerup" : "mousedown,mousemove,mouseup,mouseup").split(","), setTimeout((function() {
                        return ma = 0
                    }), 500), Da(), sa = 1), sa
                };
            Ma.op = Pa, va.cache = 0;
            var Va = function() {
                function t(t) {
                    this.init(t)
                }
                var e, s, i;
                return t.prototype.init = function(t) {
                    sa || za(ea) || console.warn("Please gsap.registerPlugin(Observer)"), ca || Da();
                    var e = t.tolerance,
                        s = t.dragMinimum,
                        i = t.type,
                        n = t.target,
                        r = t.lineHeight,
                        a = t.debounce,
                        o = t.preventDefault,
                        l = t.onStop,
                        c = t.onStopDelay,
                        h = t.ignore,
                        u = t.wheelSpeed,
                        d = t.event,
                        p = t.onDragStart,
                        f = t.onDragEnd,
                        m = t.onDrag,
                        g = t.onPress,
                        v = t.onRelease,
                        b = t.onRight,
                        y = t.onLeft,
                        w = t.onUp,
                        T = t.onDown,
                        _ = t.onChangeX,
                        k = t.onChangeY,
                        x = t.onChange,
                        S = t.onToggleX,
                        E = t.onToggleY,
                        $ = t.onHover,
                        C = t.onHoverEnd,
                        M = t.onMove,
                        P = t.ignoreCheck,
                        A = t.isNormalizer,
                        L = t.onGestureStart,
                        O = t.onGestureEnd,
                        I = t.onWheel,
                        q = t.onEnable,
                        D = t.onDisable,
                        z = t.onClick,
                        V = t.scrollSpeed,
                        j = t.capture,
                        F = t.allowClicks,
                        R = t.lockAxis,
                        B = t.onLockAxis;
                    this.target = n = Aa(n) || ra, this.vars = t, h && (h = ea.utils.toArray(h)), e = e || 1e-9, s = s || 0, u = u || 1, V = V || 1, i = i || "wheel,touch,pointer", a = !1 !== a, r || (r = parseFloat(ia.getComputedStyle(aa).lineHeight) || 22);
                    var N, H, G, W, U, Y, X, Q = this,
                        K = 0,
                        J = 0,
                        Z = t.passive || !o,
                        tt = La(n, Ma),
                        et = La(n, Pa),
                        st = tt(),
                        it = et(),
                        nt = ~i.indexOf("touch") && !~i.indexOf("pointer") && "pointerdown" === da[0],
                        rt = _a(n),
                        at = n.ownerDocument || na,
                        ot = [0, 0, 0],
                        lt = [0, 0, 0],
                        ct = 0,
                        ht = function() {
                            return ct = ya()
                        },
                        ut = function(t, e) {
                            return (Q.event = t) && h && ~h.indexOf(t.target) || e && nt && "touch" !== t.pointerType || P && P(t, e)
                        },
                        dt = function() {
                            var t = Q.deltaX = qa(ot),
                                s = Q.deltaY = qa(lt),
                                i = Math.abs(t) >= e,
                                n = Math.abs(s) >= e;
                            x && (i || n) && x(Q, t, s, ot, lt), i && (b && Q.deltaX > 0 && b(Q), y && Q.deltaX < 0 && y(Q), _ && _(Q), S && Q.deltaX < 0 != K < 0 && S(Q), K = Q.deltaX, ot[0] = ot[1] = ot[2] = 0), n && (T && Q.deltaY > 0 && T(Q), w && Q.deltaY < 0 && w(Q), k && k(Q), E && Q.deltaY < 0 != J < 0 && E(Q), J = Q.deltaY, lt[0] = lt[1] = lt[2] = 0), (W || G) && (M && M(Q), G && (m(Q), G = !1), W = !1), Y && !(Y = !1) && B && B(Q), U && (I(Q), U = !1), N = 0
                        },
                        pt = function(t, e, s) {
                            ot[s] += t, lt[s] += e, Q._vx.update(t), Q._vy.update(e), a ? N || (N = requestAnimationFrame(dt)) : dt()
                        },
                        ft = function(t, e) {
                            R && !X && (Q.axis = X = Math.abs(t) > Math.abs(e) ? "x" : "y", Y = !0), "y" !== X && (ot[2] += t, Q._vx.update(t, !0)), "x" !== X && (lt[2] += e, Q._vy.update(e, !0)), a ? N || (N = requestAnimationFrame(dt)) : dt()
                        },
                        mt = function(t) {
                            if (!ut(t, 1)) {
                                var e = (t = Ia(t, o)).clientX,
                                    i = t.clientY,
                                    n = e - Q.x,
                                    r = i - Q.y,
                                    a = Q.isDragging;
                                Q.x = e, Q.y = i, (a || Math.abs(Q.startX - e) >= s || Math.abs(Q.startY - i) >= s) && (m && (G = !0), a || (Q.isDragging = !0), ft(n, r), a || p && p(Q))
                            }
                        },
                        gt = Q.onPress = function(t) {
                            ut(t, 1) || t && t.button || (Q.axis = X = null, H.pause(), Q.isPressed = !0, t = Ia(t), K = J = 0, Q.startX = Q.x = t.clientX, Q.startY = Q.y = t.clientY, Q._vx.reset(), Q._vy.reset(), ka(A ? n : at, da[1], mt, Z, !0), Q.deltaX = Q.deltaY = 0, g && g(Q))
                        },
                        vt = Q.onRelease = function(t) {
                            if (!ut(t, 1)) {
                                xa(A ? n : at, da[1], mt, !0);
                                var e = !isNaN(Q.y - Q.startY),
                                    s = Q.isDragging,
                                    i = s && (Math.abs(Q.x - Q.startX) > 3 || Math.abs(Q.y - Q.startY) > 3),
                                    r = Ia(t);
                                !i && e && (Q._vx.reset(), Q._vy.reset(), o && F && ea.delayedCall(.08, (function() {
                                    if (ya() - ct > 300 && !t.defaultPrevented)
                                        if (t.target.click) t.target.click();
                                        else if (at.createEvent) {
                                        var e = at.createEvent("MouseEvents");
                                        e.initMouseEvent("click", !0, !0, ia, 1, r.screenX, r.screenY, r.clientX, r.clientY, !1, !1, !1, !1, 0, null), t.target.dispatchEvent(e)
                                    }
                                }))), Q.isDragging = Q.isGesturing = Q.isPressed = !1, l && s && !A && H.restart(!0), f && s && f(Q), v && v(Q, i)
                            }
                        },
                        bt = function(t) {
                            return t.touches && t.touches.length > 1 && (Q.isGesturing = !0) && L(t, Q.isDragging)
                        },
                        yt = function() {
                            return (Q.isGesturing = !1) || O(Q)
                        },
                        wt = function(t) {
                            if (!ut(t)) {
                                var e = tt(),
                                    s = et();
                                pt((e - st) * V, (s - it) * V, 1), st = e, it = s, l && H.restart(!0)
                            }
                        },
                        Tt = function(t) {
                            if (!ut(t)) {
                                t = Ia(t, o), I && (U = !0);
                                var e = (1 === t.deltaMode ? r : 2 === t.deltaMode ? ia.innerHeight : 1) * u;
                                pt(t.deltaX * e, t.deltaY * e, 0), l && !A && H.restart(!0)
                            }
                        },
                        _t = function(t) {
                            if (!ut(t)) {
                                var e = t.clientX,
                                    s = t.clientY,
                                    i = e - Q.x,
                                    n = s - Q.y;
                                Q.x = e, Q.y = s, W = !0, l && H.restart(!0), (i || n) && ft(i, n)
                            }
                        },
                        kt = function(t) {
                            Q.event = t, $(Q)
                        },
                        xt = function(t) {
                            Q.event = t, C(Q)
                        },
                        St = function(t) {
                            return ut(t) || Ia(t, o) && z(Q)
                        };
                    H = Q._dc = ea.delayedCall(c || .25, (function() {
                        Q._vx.reset(), Q._vy.reset(), H.pause(), l && l(Q)
                    })).pause(), Q.deltaX = Q.deltaY = 0, Q._vx = Oa(0, 50, !0), Q._vy = Oa(0, 50, !0), Q.scrollX = tt, Q.scrollY = et, Q.isDragging = Q.isGesturing = Q.isPressed = !1, pa(this), Q.enable = function(t) {
                        return Q.isEnabled || (ka(rt ? at : n, "scroll", $a), i.indexOf("scroll") >= 0 && ka(rt ? at : n, "scroll", wt, Z, j), i.indexOf("wheel") >= 0 && ka(n, "wheel", Tt, Z, j), (i.indexOf("touch") >= 0 && oa || i.indexOf("pointer") >= 0) && (ka(n, da[0], gt, Z, j), ka(at, da[2], vt), ka(at, da[3], vt), F && ka(n, "click", ht, !0, !0), z && ka(n, "click", St), L && ka(at, "gesturestart", bt), O && ka(at, "gestureend", yt), $ && ka(n, la + "enter", kt), C && ka(n, la + "leave", xt), M && ka(n, la + "move", _t)), Q.isEnabled = !0, t && t.type && gt(t), q && q(Q)), Q
                    }, Q.disable = function() {
                        Q.isEnabled && (ga.filter((function(t) {
                            return t !== Q && _a(t.target)
                        })).length || xa(rt ? at : n, "scroll", $a), Q.isPressed && (Q._vx.reset(), Q._vy.reset(), xa(A ? n : at, da[1], mt, !0)), xa(rt ? at : n, "scroll", wt, j), xa(n, "wheel", Tt, j), xa(n, da[0], gt, j), xa(at, da[2], vt), xa(at, da[3], vt), xa(n, "click", ht, !0), xa(n, "click", St), xa(at, "gesturestart", bt), xa(at, "gestureend", yt), xa(n, la + "enter", kt), xa(n, la + "leave", xt), xa(n, la + "move", _t), Q.isEnabled = Q.isPressed = Q.isDragging = !1, D && D(Q))
                    }, Q.kill = Q.revert = function() {
                        Q.disable();
                        var t = ga.indexOf(Q);
                        t >= 0 && ga.splice(t, 1), ua === Q && (ua = 0)
                    }, ga.push(Q), A && _a(n) && (ua = Q), Q.enable(d)
                }, e = t, (s = [{
                    key: "velocityX",
                    get: function() {
                        return this._vx.getVelocity()
                    }
                }, {
                    key: "velocityY",
                    get: function() {
                        return this._vy.getVelocity()
                    }
                }]) && ta(e.prototype, s), i && ta(e, i), t
            }();
            Va.version = "3.12.5", Va.create = function(t) {
                return new Va(t)
            }, Va.register = za, Va.getAll = function() {
                return ga.slice()
            }, Va.getById = function(t) {
                return ga.filter((function(e) {
                    return e.vars.id === t
                }))[0]
            }, fa() && ea.registerPlugin(Va);
            var ja, Fa, Ra, Ba, Na, Ha, Ga, Wa, Ua, Ya, Xa, Qa, Ka, Ja, Za, to, eo, so, io, no, ro, ao, oo, lo, co, ho, uo, po, fo, mo, go, vo, bo, yo, wo, To, _o, ko, xo = 1,
                So = Date.now,
                Eo = So(),
                $o = 0,
                Co = 0,
                Mo = function(t, e, s) {
                    var i = No(t) && ("clamp(" === t.substr(0, 6) || t.indexOf("max") > -1);
                    return s["_" + e + "Clamp"] = i, i ? t.substr(6, t.length - 7) : t
                },
                Po = function(t, e) {
                    return !e || No(t) && "clamp(" === t.substr(0, 6) ? t : "clamp(" + t + ")"
                },
                Ao = function t() {
                    return Co && requestAnimationFrame(t)
                },
                Lo = function() {
                    return Ja = 1
                },
                Oo = function() {
                    return Ja = 0
                },
                Io = function(t) {
                    return t
                },
                qo = function(t) {
                    return Math.round(1e5 * t) / 1e5 || 0
                },
                Do = function() {
                    return "undefined" != typeof window
                },
                zo = function() {
                    return ja || Do() && (ja = window.gsap) && ja.registerPlugin && ja
                },
                Vo = function(t) {
                    return !!~Ga.indexOf(t)
                },
                jo = function(t) {
                    return ("Height" === t ? go : Ra["inner" + t]) || Na["client" + t] || Ha["client" + t]
                },
                Fo = function(t) {
                    return Ta(t, "getBoundingClientRect") || (Vo(t) ? function() {
                        return Zl.width = Ra.innerWidth, Zl.height = go, Zl
                    } : function() {
                        return dl(t)
                    })
                },
                Ro = function(t, e) {
                    var s = e.s,
                        i = e.d2,
                        n = e.d,
                        r = e.a;
                    return Math.max(0, (s = "scroll" + i) && (r = Ta(t, s)) ? r() - Fo(t)()[n] : Vo(t) ? (Na[s] || Ha[s]) - jo(i) : t[s] - t["offset" + i])
                },
                Bo = function(t, e) {
                    for (var s = 0; s < io.length; s += 3)(!e || ~e.indexOf(io[s + 1])) && t(io[s], io[s + 1], io[s + 2])
                },
                No = function(t) {
                    return "string" == typeof t
                },
                Ho = function(t) {
                    return "function" == typeof t
                },
                Go = function(t) {
                    return "number" == typeof t
                },
                Wo = function(t) {
                    return "object" == typeof t
                },
                Uo = function(t, e, s) {
                    return t && t.progress(e ? 0 : 1) && s && t.pause()
                },
                Yo = function(t, e) {
                    if (t.enabled) {
                        var s = t._ctx ? t._ctx.add((function() {
                            return e(t)
                        })) : e(t);
                        s && s.totalTime && (t.callbackAnimation = s)
                    }
                },
                Xo = Math.abs,
                Qo = "left",
                Ko = "right",
                Jo = "bottom",
                Zo = "width",
                tl = "height",
                el = "Right",
                sl = "Left",
                il = "Top",
                nl = "Bottom",
                rl = "padding",
                al = "margin",
                ol = "Width",
                ll = "Height",
                cl = "px",
                hl = function(t) {
                    return Ra.getComputedStyle(t)
                },
                ul = function(t, e) {
                    for (var s in e) s in t || (t[s] = e[s]);
                    return t
                },
                dl = function(t, e) {
                    var s = e && "matrix(1, 0, 0, 1, 0, 0)" !== hl(t)[Za] && ja.to(t, {
                            x: 0,
                            y: 0,
                            xPercent: 0,
                            yPercent: 0,
                            rotation: 0,
                            rotationX: 0,
                            rotationY: 0,
                            scale: 1,
                            skewX: 0,
                            skewY: 0
                        }).progress(1),
                        i = t.getBoundingClientRect();
                    return s && s.progress(0).kill(), i
                },
                pl = function(t, e) {
                    var s = e.d2;
                    return t["offset" + s] || t["client" + s] || 0
                },
                fl = function(t) {
                    var e, s = [],
                        i = t.labels,
                        n = t.duration();
                    for (e in i) s.push(i[e] / n);
                    return s
                },
                ml = function(t) {
                    var e = ja.utils.snap(t),
                        s = Array.isArray(t) && t.slice(0).sort((function(t, e) {
                            return t - e
                        }));
                    return s ? function(t, i, n) {
                        var r;
                        if (void 0 === n && (n = .001), !i) return e(t);
                        if (i > 0) {
                            for (t -= n, r = 0; r < s.length; r++)
                                if (s[r] >= t) return s[r];
                            return s[r - 1]
                        }
                        for (r = s.length, t += n; r--;)
                            if (s[r] <= t) return s[r];
                        return s[0]
                    } : function(s, i, n) {
                        void 0 === n && (n = .001);
                        var r = e(s);
                        return !i || Math.abs(r - s) < n || r - s < 0 == i < 0 ? r : e(i < 0 ? s - t : s + t)
                    }
                },
                gl = function(t, e, s, i) {
                    return s.split(",").forEach((function(s) {
                        return t(e, s, i)
                    }))
                },
                vl = function(t, e, s, i, n) {
                    return t.addEventListener(e, s, {
                        passive: !i,
                        capture: !!n
                    })
                },
                bl = function(t, e, s, i) {
                    return t.removeEventListener(e, s, !!i)
                },
                yl = function(t, e, s) {
                    (s = s && s.wheelHandler) && (t(e, "wheel", s), t(e, "touchmove", s))
                },
                wl = {
                    startColor: "green",
                    endColor: "red",
                    indent: 0,
                    fontSize: "16px",
                    fontWeight: "normal"
                },
                Tl = {
                    toggleActions: "play",
                    anticipatePin: 0
                },
                _l = {
                    top: 0,
                    left: 0,
                    center: .5,
                    bottom: 1,
                    right: 1
                },
                kl = function(t, e) {
                    if (No(t)) {
                        var s = t.indexOf("="),
                            i = ~s ? +(t.charAt(s - 1) + 1) * parseFloat(t.substr(s + 1)) : 0;
                        ~s && (t.indexOf("%") > s && (i *= e / 100), t = t.substr(0, s - 1)), t = i + (t in _l ? _l[t] * e : ~t.indexOf("%") ? parseFloat(t) * e / 100 : parseFloat(t) || 0)
                    }
                    return t
                },
                xl = function(t, e, s, i, n, r, a, o) {
                    var l = n.startColor,
                        c = n.endColor,
                        h = n.fontSize,
                        u = n.indent,
                        d = n.fontWeight,
                        p = Ba.createElement("div"),
                        f = Vo(s) || "fixed" === Ta(s, "pinType"),
                        m = -1 !== t.indexOf("scroller"),
                        g = f ? Ha : s,
                        v = -1 !== t.indexOf("start"),
                        b = v ? l : c,
                        y = "border-color:" + b + ";font-size:" + h + ";color:" + b + ";font-weight:" + d + ";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";
                    return y += "position:" + ((m || o) && f ? "fixed;" : "absolute;"), (m || o || !f) && (y += (i === Pa ? Ko : Jo) + ":" + (r + parseFloat(u)) + "px;"), a && (y += "box-sizing:border-box;text-align:left;width:" + a.offsetWidth + "px;"), p._isStart = v, p.setAttribute("class", "gsap-marker-" + t + (e ? " marker-" + e : "")), p.style.cssText = y, p.innerText = e || 0 === e ? t + "-" + e : t, g.children[0] ? g.insertBefore(p, g.children[0]) : g.appendChild(p), p._offset = p["offset" + i.op.d2], Sl(p, 0, i, v), p
                },
                Sl = function(t, e, s, i) {
                    var n = {
                            display: "block"
                        },
                        r = s[i ? "os2" : "p2"],
                        a = s[i ? "p2" : "os2"];
                    t._isFlipped = i, n[s.a + "Percent"] = i ? -100 : 0, n[s.a] = i ? "1px" : 0, n["border" + r + ol] = 1, n["border" + a + ol] = 0, n[s.p] = e + "px", ja.set(t, n)
                },
                El = [],
                $l = {},
                Cl = function() {
                    return So() - $o > 34 && (wo || (wo = requestAnimationFrame(Wl)))
                },
                Ml = function() {
                    (!oo || !oo.isPressed || oo.startX > Ha.clientWidth) && (va.cache++, oo ? wo || (wo = requestAnimationFrame(Wl)) : Wl(), $o || ql("scrollStart"), $o = So())
                },
                Pl = function() {
                    ho = Ra.innerWidth, co = Ra.innerHeight
                },
                Al = function() {
                    va.cache++, !Ka && !ao && !Ba.fullscreenElement && !Ba.webkitFullscreenElement && (!lo || ho !== Ra.innerWidth || Math.abs(Ra.innerHeight - co) > .25 * Ra.innerHeight) && Wa.restart(!0)
                },
                Ll = {},
                Ol = [],
                Il = function t() {
                    return bl(ac, "scrollEnd", t) || Nl(!0)
                },
                ql = function(t) {
                    return Ll[t] && Ll[t].map((function(t) {
                        return t()
                    })) || Ol
                },
                Dl = [],
                zl = function(t) {
                    for (var e = 0; e < Dl.length; e += 5)(!t || Dl[e + 4] && Dl[e + 4].query === t) && (Dl[e].style.cssText = Dl[e + 1], Dl[e].getBBox && Dl[e].setAttribute("transform", Dl[e + 2] || ""), Dl[e + 3].uncache = 1)
                },
                Vl = function(t, e) {
                    var s;
                    for (to = 0; to < El.length; to++) !(s = El[to]) || e && s._ctx !== e || (t ? s.kill(1) : s.revert(!0, !0));
                    vo = !0, e && zl(e), e || ql("revert")
                },
                jl = function(t, e) {
                    va.cache++, (e || !To) && va.forEach((function(t) {
                        return Ho(t) && t.cacheID++ && (t.rec = 0)
                    })), No(t) && (Ra.history.scrollRestoration = fo = t)
                },
                Fl = 0,
                Rl = function() {
                    Ha.appendChild(mo), go = !oo && mo.offsetHeight || Ra.innerHeight, Ha.removeChild(mo)
                },
                Bl = function(t) {
                    return Ua(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end").forEach((function(e) {
                        return e.style.display = t ? "none" : "block"
                    }))
                },
                Nl = function(t, e) {
                    if (!$o || t || vo) {
                        Rl(), To = ac.isRefreshing = !0, va.forEach((function(t) {
                            return Ho(t) && ++t.cacheID && (t.rec = t())
                        }));
                        var s = ql("refreshInit");
                        no && ac.sort(), e || Vl(), va.forEach((function(t) {
                            Ho(t) && (t.smooth && (t.target.style.scrollBehavior = "auto"), t(0))
                        })), El.slice(0).forEach((function(t) {
                            return t.refresh()
                        })), vo = !1, El.forEach((function(t) {
                            if (t._subPinOffset && t.pin) {
                                var e = t.vars.horizontal ? "offsetWidth" : "offsetHeight",
                                    s = t.pin[e];
                                t.revert(!0, 1), t.adjustPinSpacing(t.pin[e] - s), t.refresh()
                            }
                        })), bo = 1, Bl(!0), El.forEach((function(t) {
                            var e = Ro(t.scroller, t._dir),
                                s = "max" === t.vars.end || t._endClamp && t.end > e,
                                i = t._startClamp && t.start >= e;
                            (s || i) && t.setPositions(i ? e - 1 : t.start, s ? Math.max(i ? e : t.start + 1, e) : t.end, !0)
                        })), Bl(!1), bo = 0, s.forEach((function(t) {
                            return t && t.render && t.render(-1)
                        })), va.forEach((function(t) {
                            Ho(t) && (t.smooth && requestAnimationFrame((function() {
                                return t.target.style.scrollBehavior = "smooth"
                            })), t.rec && t(t.rec))
                        })), jl(fo, 1), Wa.pause(), Fl++, To = 2, Wl(2), El.forEach((function(t) {
                            return Ho(t.vars.onRefresh) && t.vars.onRefresh(t)
                        })), To = ac.isRefreshing = !1, ql("refresh")
                    } else vl(ac, "scrollEnd", Il)
                },
                Hl = 0,
                Gl = 1,
                Wl = function(t) {
                    if (2 === t || !To && !vo) {
                        ac.isUpdating = !0, ko && ko.update(0);
                        var e = El.length,
                            s = So(),
                            i = s - Eo >= 50,
                            n = e && El[0].scroll();
                        if (Gl = Hl > n ? -1 : 1, To || (Hl = n), i && ($o && !Ja && s - $o > 200 && ($o = 0, ql("scrollEnd")), Xa = Eo, Eo = s), Gl < 0) {
                            for (to = e; to-- > 0;) El[to] && El[to].update(0, i);
                            Gl = 1
                        } else
                            for (to = 0; to < e; to++) El[to] && El[to].update(0, i);
                        ac.isUpdating = !1
                    }
                    wo = 0
                },
                Ul = [Qo, "top", Jo, Ko, al + nl, al + el, al + il, al + sl, "display", "flexShrink", "float", "zIndex", "gridColumnStart", "gridColumnEnd", "gridRowStart", "gridRowEnd", "gridArea", "justifySelf", "alignSelf", "placeSelf", "order"],
                Yl = Ul.concat([Zo, tl, "boxSizing", "max" + ol, "max" + ll, "position", al, rl, rl + il, rl + el, rl + nl, rl + sl]),
                Xl = function(t, e, s, i) {
                    if (!t._gsap.swappedIn) {
                        for (var n, r = Ul.length, a = e.style, o = t.style; r--;) a[n = Ul[r]] = s[n];
                        a.position = "absolute" === s.position ? "absolute" : "relative", "inline" === s.display && (a.display = "inline-block"), o[Jo] = o[Ko] = "auto", a.flexBasis = s.flexBasis || "auto", a.overflow = "visible", a.boxSizing = "border-box", a[Zo] = pl(t, Ma) + cl, a[tl] = pl(t, Pa) + cl, a[rl] = o[al] = o.top = o[Qo] = "0", Kl(i), o[Zo] = o["max" + ol] = s[Zo], o[tl] = o["max" + ll] = s[tl], o[rl] = s[rl], t.parentNode !== e && (t.parentNode.insertBefore(e, t), e.appendChild(t)), t._gsap.swappedIn = !0
                    }
                },
                Ql = /([A-Z])/g,
                Kl = function(t) {
                    if (t) {
                        var e, s, i = t.t.style,
                            n = t.length,
                            r = 0;
                        for ((t.t._gsap || ja.core.getCache(t.t)).uncache = 1; r < n; r += 2) s = t[r + 1], e = t[r], s ? i[e] = s : i[e] && i.removeProperty(e.replace(Ql, "-$1").toLowerCase())
                    }
                },
                Jl = function(t) {
                    for (var e = Yl.length, s = t.style, i = [], n = 0; n < e; n++) i.push(Yl[n], s[Yl[n]]);
                    return i.t = t, i
                },
                Zl = {
                    left: 0,
                    top: 0
                },
                tc = function(t, e, s, i, n, r, a, o, l, c, h, u, d, p) {
                    Ho(t) && (t = t(o)), No(t) && "max" === t.substr(0, 3) && (t = u + ("=" === t.charAt(4) ? kl("0" + t.substr(3), s) : 0));
                    var f, m, g, v = d ? d.time() : 0;
                    if (d && d.seek(0), isNaN(t) || (t = +t), Go(t)) d && (t = ja.utils.mapRange(d.scrollTrigger.start, d.scrollTrigger.end, 0, u, t)), a && Sl(a, s, i, !0);
                    else {
                        Ho(e) && (e = e(o));
                        var b, y, w, T, _ = (t || "0").split(" ");
                        g = Aa(e, o) || Ha, (b = dl(g) || {}) && (b.left || b.top) || "none" !== hl(g).display || (T = g.style.display, g.style.display = "block", b = dl(g), T ? g.style.display = T : g.style.removeProperty("display")), y = kl(_[0], b[i.d]), w = kl(_[1] || "0", s), t = b[i.p] - l[i.p] - c + y + n - w, a && Sl(a, w, i, s - w < 20 || a._isStart && w > 20), s -= s - w
                    }
                    if (p && (o[p] = t || -.001, t < 0 && (t = 0)), r) {
                        var k = t + s,
                            x = r._isStart;
                        f = "scroll" + i.d2, Sl(r, k, i, x && k > 20 || !x && (h ? Math.max(Ha[f], Na[f]) : r.parentNode[f]) <= k + 1), h && (l = dl(a), h && (r.style[i.op.p] = l[i.op.p] - i.op.m - r._offset + cl))
                    }
                    return d && g && (f = dl(g), d.seek(u), m = dl(g), d._caScrollDist = f[i.p] - m[i.p], t = t / d._caScrollDist * u), d && d.seek(v), d ? t : Math.round(t)
                },
                ec = /(webkit|moz|length|cssText|inset)/i,
                sc = function(t, e, s, i) {
                    if (t.parentNode !== e) {
                        var n, r, a = t.style;
                        if (e === Ha) {
                            for (n in t._stOrig = a.cssText, r = hl(t)) + n || ec.test(n) || !r[n] || "string" != typeof a[n] || "0" === n || (a[n] = r[n]);
                            a.top = s, a.left = i
                        } else a.cssText = t._stOrig;
                        ja.core.getCache(t).uncache = 1, e.appendChild(t)
                    }
                },
                ic = function(t, e, s) {
                    var i = e,
                        n = i;
                    return function(e) {
                        var r = Math.round(t());
                        return r !== i && r !== n && Math.abs(r - i) > 3 && Math.abs(r - n) > 3 && (e = r, s && s()), n = i, i = e, e
                    }
                },
                nc = function(t, e, s) {
                    var i = {};
                    i[e.p] = "+=" + s, ja.set(t, i)
                },
                rc = function(t, e) {
                    var s = La(t, e),
                        i = "_scroll" + e.p2,
                        n = function e(n, r, a, o, l) {
                            var c = e.tween,
                                h = r.onComplete,
                                u = {};
                            a = a || s();
                            var d = ic(s, a, (function() {
                                c.kill(), e.tween = 0
                            }));
                            return l = o && l || 0, o = o || n - a, c && c.kill(), r[i] = n, r.inherit = !1, r.modifiers = u, u[i] = function() {
                                return d(a + o * c.ratio + l * c.ratio * c.ratio)
                            }, r.onUpdate = function() {
                                va.cache++, e.tween && Wl()
                            }, r.onComplete = function() {
                                e.tween = 0, h && h.call(c)
                            }, c = e.tween = ja.to(t, r)
                        };
                    return t[i] = s, s.wheelHandler = function() {
                        return n.tween && n.tween.kill() && (n.tween = 0)
                    }, vl(t, "wheel", s.wheelHandler), ac.isTouch && vl(t, "touchmove", s.wheelHandler), n
                },
                ac = function() {
                    function t(e, s) {
                        Fa || t.register(ja) || console.warn("Please gsap.registerPlugin(ScrollTrigger)"), po(this), this.init(e, s)
                    }
                    return t.prototype.init = function(e, s) {
                        if (this.progress = this.start = 0, this.vars && this.kill(!0, !0), Co) {
                            var i, n, r, a, o, l, c, h, u, d, p, f, m, g, v, b, y, w, T, _, k, x, S, E, $, C, M, P, A, L, O, I, q, D, z, V, j, F, R, B, N, H, G = e = ul(No(e) || Go(e) || e.nodeType ? {
                                    trigger: e
                                } : e, Tl),
                                W = G.onUpdate,
                                U = G.toggleClass,
                                Y = G.id,
                                X = G.onToggle,
                                Q = G.onRefresh,
                                K = G.scrub,
                                J = G.trigger,
                                Z = G.pin,
                                tt = G.pinSpacing,
                                et = G.invalidateOnRefresh,
                                st = G.anticipatePin,
                                it = G.onScrubComplete,
                                nt = G.onSnapComplete,
                                rt = G.once,
                                at = G.snap,
                                ot = G.pinReparent,
                                lt = G.pinSpacer,
                                ct = G.containerAnimation,
                                ht = G.fastScrollEnd,
                                ut = G.preventOverlaps,
                                dt = e.horizontal || e.containerAnimation && !1 !== e.horizontal ? Ma : Pa,
                                pt = !K && 0 !== K,
                                ft = Aa(e.scroller || Ra),
                                mt = ja.core.getCache(ft),
                                gt = Vo(ft),
                                vt = "fixed" === ("pinType" in e ? e.pinType : Ta(ft, "pinType") || gt && "fixed"),
                                bt = [e.onEnter, e.onLeave, e.onEnterBack, e.onLeaveBack],
                                yt = pt && e.toggleActions.split(" "),
                                wt = "markers" in e ? e.markers : Tl.markers,
                                Tt = gt ? 0 : parseFloat(hl(ft)["border" + dt.p2 + ol]) || 0,
                                _t = this,
                                kt = e.onRefreshInit && function() {
                                    return e.onRefreshInit(_t)
                                },
                                xt = function(t, e, s) {
                                    var i = s.d,
                                        n = s.d2,
                                        r = s.a;
                                    return (r = Ta(t, "getBoundingClientRect")) ? function() {
                                        return r()[i]
                                    } : function() {
                                        return (e ? jo(n) : t["client" + n]) || 0
                                    }
                                }(ft, gt, dt),
                                St = function(t, e) {
                                    return !e || ~ba.indexOf(t) ? Fo(t) : function() {
                                        return Zl
                                    }
                                }(ft, gt),
                                Et = 0,
                                $t = 0,
                                Ct = 0,
                                Mt = La(ft, dt);
                            if (_t._startClamp = _t._endClamp = !1, _t._dir = dt, st *= 45, _t.scroller = ft, _t.scroll = ct ? ct.time.bind(ct) : Mt, a = Mt(), _t.vars = e, s = s || e.animation, "refreshPriority" in e && (no = 1, -9999 === e.refreshPriority && (ko = _t)), mt.tweenScroll = mt.tweenScroll || {
                                    top: rc(ft, Pa),
                                    left: rc(ft, Ma)
                                }, _t.tweenTo = i = mt.tweenScroll[dt.p], _t.scrubDuration = function(t) {
                                    (q = Go(t) && t) ? I ? I.duration(t) : I = ja.to(s, {
                                        ease: "expo",
                                        totalProgress: "+=0",
                                        inherit: !1,
                                        duration: q,
                                        paused: !0,
                                        onComplete: function() {
                                            return it && it(_t)
                                        }
                                    }): (I && I.progress(1).kill(), I = 0)
                                }, s && (s.vars.lazy = !1, s._initted && !_t.isReverted || !1 !== s.vars.immediateRender && !1 !== e.immediateRender && s.duration() && s.render(0, !0, !0), _t.animation = s.pause(), s.scrollTrigger = _t, _t.scrubDuration(K), L = 0, Y || (Y = s.vars.id)), at && (Wo(at) && !at.push || (at = {
                                    snapTo: at
                                }), "scrollBehavior" in Ha.style && ja.set(gt ? [Ha, Na] : ft, {
                                    scrollBehavior: "auto"
                                }), va.forEach((function(t) {
                                    return Ho(t) && t.target === (gt ? Ba.scrollingElement || Na : ft) && (t.smooth = !1)
                                })), r = Ho(at.snapTo) ? at.snapTo : "labels" === at.snapTo ? function(t) {
                                    return function(e) {
                                        return ja.utils.snap(fl(t), e)
                                    }
                                }(s) : "labelsDirectional" === at.snapTo ? (B = s, function(t, e) {
                                    return ml(fl(B))(t, e.direction)
                                }) : !1 !== at.directional ? function(t, e) {
                                    return ml(at.snapTo)(t, So() - $t < 500 ? 0 : e.direction)
                                } : ja.utils.snap(at.snapTo), D = at.duration || {
                                    min: .1,
                                    max: 2
                                }, D = Wo(D) ? Ya(D.min, D.max) : Ya(D, D), z = ja.delayedCall(at.delay || q / 2 || .1, (function() {
                                    var t = Mt(),
                                        e = So() - $t < 500,
                                        n = i.tween;
                                    if (!(e || Math.abs(_t.getVelocity()) < 10) || n || Ja || Et === t) _t.isActive && Et !== t && z.restart(!0);
                                    else {
                                        var a, o, h = (t - l) / g,
                                            u = s && !pt ? s.totalProgress() : h,
                                            d = e ? 0 : (u - O) / (So() - Xa) * 1e3 || 0,
                                            p = ja.utils.clamp(-h, 1 - h, Xo(d / 2) * d / .185),
                                            f = h + (!1 === at.inertia ? 0 : p),
                                            m = at,
                                            v = m.onStart,
                                            b = m.onInterrupt,
                                            y = m.onComplete;
                                        if (a = r(f, _t), Go(a) || (a = f), o = Math.round(l + a * g), t <= c && t >= l && o !== t) {
                                            if (n && !n._initted && n.data <= Xo(o - t)) return;
                                            !1 === at.inertia && (p = a - h), i(o, {
                                                duration: D(Xo(.185 * Math.max(Xo(f - u), Xo(a - u)) / d / .05 || 0)),
                                                ease: at.ease || "power3",
                                                data: Xo(o - t),
                                                onInterrupt: function() {
                                                    return z.restart(!0) && b && b(_t)
                                                },
                                                onComplete: function() {
                                                    _t.update(), Et = Mt(), s && (I ? I.resetTo("totalProgress", a, s._tTime / s._tDur) : s.progress(a)), L = O = s && !pt ? s.totalProgress() : _t.progress, nt && nt(_t), y && y(_t)
                                                }
                                            }, t, p * g, o - t - p * g), v && v(_t, i.tween)
                                        }
                                    }
                                })).pause()), Y && ($l[Y] = _t), (R = (J = _t.trigger = Aa(J || !0 !== Z && Z)) && J._gsap && J._gsap.stRevert) && (R = R(_t)), Z = !0 === Z ? J : Aa(Z), No(U) && (U = {
                                    targets: J,
                                    className: U
                                }), Z && (!1 === tt || tt === al || (tt = !(!tt && Z.parentNode && Z.parentNode.style && "flex" === hl(Z.parentNode).display) && rl), _t.pin = Z, (n = ja.core.getCache(Z)).spacer ? v = n.pinState : (lt && ((lt = Aa(lt)) && !lt.nodeType && (lt = lt.current || lt.nativeElement), n.spacerIsNative = !!lt, lt && (n.spacerState = Jl(lt))), n.spacer = w = lt || Ba.createElement("div"), w.classList.add("pin-spacer"), Y && w.classList.add("pin-spacer-" + Y), n.pinState = v = Jl(Z)), !1 !== e.force3D && ja.set(Z, {
                                    force3D: !0
                                }), _t.spacer = w = n.spacer, A = hl(Z), E = A[tt + dt.os2], _ = ja.getProperty(Z), k = ja.quickSetter(Z, dt.a, cl), Xl(Z, w, A), y = Jl(Z)), wt) {
                                f = Wo(wt) ? ul(wt, wl) : wl, d = xl("scroller-start", Y, ft, dt, f, 0), p = xl("scroller-end", Y, ft, dt, f, 0, d), T = d["offset" + dt.op.d2];
                                var Pt = Aa(Ta(ft, "content") || ft);
                                h = this.markerStart = xl("start", Y, Pt, dt, f, T, 0, ct), u = this.markerEnd = xl("end", Y, Pt, dt, f, T, 0, ct), ct && (F = ja.quickSetter([h, u], dt.a, cl)), vt || ba.length && !0 === Ta(ft, "fixedMarkers") || (H = hl(N = gt ? Ha : ft).position, N.style.position = "absolute" === H || "fixed" === H ? H : "relative", ja.set([d, p], {
                                    force3D: !0
                                }), C = ja.quickSetter(d, dt.a, cl), P = ja.quickSetter(p, dt.a, cl))
                            }
                            if (ct) {
                                var At = ct.vars.onUpdate,
                                    Lt = ct.vars.onUpdateParams;
                                ct.eventCallback("onUpdate", (function() {
                                    _t.update(0, 0, 1), At && At.apply(ct, Lt || [])
                                }))
                            }
                            if (_t.previous = function() {
                                    return El[El.indexOf(_t) - 1]
                                }, _t.next = function() {
                                    return El[El.indexOf(_t) + 1]
                                }, _t.revert = function(t, e) {
                                    if (!e) return _t.kill(!0);
                                    var i = !1 !== t || !_t.enabled,
                                        n = Ka;
                                    i !== _t.isReverted && (i && (V = Math.max(Mt(), _t.scroll.rec || 0), Ct = _t.progress, j = s && s.progress()), h && [h, u, d, p].forEach((function(t) {
                                        return t.style.display = i ? "none" : "block"
                                    })), i && (Ka = _t, _t.update(i)), !Z || ot && _t.isActive || (i ? function(t, e, s) {
                                        Kl(s);
                                        var i = t._gsap;
                                        if (i.spacerIsNative) Kl(i.spacerState);
                                        else if (t._gsap.swappedIn) {
                                            var n = e.parentNode;
                                            n && (n.insertBefore(t, e), n.removeChild(e))
                                        }
                                        t._gsap.swappedIn = !1
                                    }(Z, w, v) : Xl(Z, w, hl(Z), $)), i || _t.update(i), Ka = n, _t.isReverted = i)
                                }, _t.refresh = function(n, r, f, T) {
                                    if (!Ka && _t.enabled || r)
                                        if (Z && n && $o) vl(t, "scrollEnd", Il);
                                        else {
                                            !To && kt && kt(_t), Ka = _t, i.tween && !f && (i.tween.kill(), i.tween = 0), I && I.pause(), et && s && s.revert({
                                                kill: !1
                                            }).invalidate(), _t.isReverted || _t.revert(!0, !0), _t._subPinOffset = !1;
                                            var k, E, C, P, A, L, O, q, D, F, R, B, N, H = xt(),
                                                G = St(),
                                                W = ct ? ct.duration() : Ro(ft, dt),
                                                U = g <= .01,
                                                Y = 0,
                                                X = T || 0,
                                                K = Wo(f) ? f.end : e.end,
                                                st = e.endTrigger || J,
                                                it = Wo(f) ? f.start : e.start || (0 !== e.start && J ? Z ? "0 0" : "0 100%" : 0),
                                                nt = _t.pinnedContainer = e.pinnedContainer && Aa(e.pinnedContainer, _t),
                                                rt = J && Math.max(0, El.indexOf(_t)) || 0,
                                                at = rt;
                                            for (wt && Wo(f) && (B = ja.getProperty(d, dt.p), N = ja.getProperty(p, dt.p)); at--;)(L = El[at]).end || L.refresh(0, 1) || (Ka = _t), !(O = L.pin) || O !== J && O !== Z && O !== nt || L.isReverted || (F || (F = []), F.unshift(L), L.revert(!0, !0)), L !== El[at] && (rt--, at--);
                                            for (Ho(it) && (it = it(_t)), it = Mo(it, "start", _t), l = tc(it, J, H, dt, Mt(), h, d, _t, G, Tt, vt, W, ct, _t._startClamp && "_startClamp") || (Z ? -.001 : 0), Ho(K) && (K = K(_t)), No(K) && !K.indexOf("+=") && (~K.indexOf(" ") ? K = (No(it) ? it.split(" ")[0] : "") + K : (Y = kl(K.substr(2), H), K = No(it) ? it : (ct ? ja.utils.mapRange(0, ct.duration(), ct.scrollTrigger.start, ct.scrollTrigger.end, l) : l) + Y, st = J)), K = Mo(K, "end", _t), c = Math.max(l, tc(K || (st ? "100% 0" : W), st, H, dt, Mt() + Y, u, p, _t, G, Tt, vt, W, ct, _t._endClamp && "_endClamp")) || -.001, Y = 0, at = rt; at--;)(O = (L = El[at]).pin) && L.start - L._pinPush <= l && !ct && L.end > 0 && (k = L.end - (_t._startClamp ? Math.max(0, L.start) : L.start), (O === J && L.start - L._pinPush < l || O === nt) && isNaN(it) && (Y += k * (1 - L.progress)), O === Z && (X += k));
                                            if (l += Y, c += Y, _t._startClamp && (_t._startClamp += Y), _t._endClamp && !To && (_t._endClamp = c || -.001, c = Math.min(c, Ro(ft, dt))), g = c - l || (l -= .01) && .001, U && (Ct = ja.utils.clamp(0, 1, ja.utils.normalize(l, c, V))), _t._pinPush = X, h && Y && ((k = {})[dt.a] = "+=" + Y, nt && (k[dt.p] = "-=" + Mt()), ja.set([h, u], k)), !Z || bo && _t.end >= Ro(ft, dt)) {
                                                if (J && Mt() && !ct)
                                                    for (E = J.parentNode; E && E !== Ha;) E._pinOffset && (l -= E._pinOffset, c -= E._pinOffset), E = E.parentNode
                                            } else k = hl(Z), P = dt === Pa, C = Mt(), x = parseFloat(_(dt.a)) + X, !W && c > 1 && (R = {
                                                style: R = (gt ? Ba.scrollingElement || Na : ft).style,
                                                value: R["overflow" + dt.a.toUpperCase()]
                                            }, gt && "scroll" !== hl(Ha)["overflow" + dt.a.toUpperCase()] && (R.style["overflow" + dt.a.toUpperCase()] = "scroll")), Xl(Z, w, k), y = Jl(Z), E = dl(Z, !0), q = vt && La(ft, P ? Ma : Pa)(), tt ? (($ = [tt + dt.os2, g + X + cl]).t = w, (at = tt === rl ? pl(Z, dt) + g + X : 0) && ($.push(dt.d, at + cl), "auto" !== w.style.flexBasis && (w.style.flexBasis = at + cl)), Kl($), nt && El.forEach((function(t) {
                                                t.pin === nt && !1 !== t.vars.pinSpacing && (t._subPinOffset = !0)
                                            })), vt && Mt(V)) : (at = pl(Z, dt)) && "auto" !== w.style.flexBasis && (w.style.flexBasis = at + cl), vt && ((A = {
                                                top: E.top + (P ? C - l : q) + cl,
                                                left: E.left + (P ? q : C - l) + cl,
                                                boxSizing: "border-box",
                                                position: "fixed"
                                            })[Zo] = A["max" + ol] = Math.ceil(E.width) + cl, A[tl] = A["max" + ll] = Math.ceil(E.height) + cl, A[al] = A[al + il] = A[al + el] = A[al + nl] = A[al + sl] = "0", A[rl] = k[rl], A[rl + il] = k[rl + il], A[rl + el] = k[rl + el], A[rl + nl] = k[rl + nl], A[rl + sl] = k[rl + sl], b = function(t, e, s) {
                                                for (var i, n = [], r = t.length, a = s ? 8 : 0; a < r; a += 2) i = t[a], n.push(i, i in e ? e[i] : t[a + 1]);
                                                return n.t = t.t, n
                                            }(v, A, ot), To && Mt(0)), s ? (D = s._initted, ro(1), s.render(s.duration(), !0, !0), S = _(dt.a) - x + g + X, M = Math.abs(g - S) > 1, vt && M && b.splice(b.length - 2, 2), s.render(0, !0, !0), D || s.invalidate(!0), s.parent || s.totalTime(s.totalTime()), ro(0)) : S = g, R && (R.value ? R.style["overflow" + dt.a.toUpperCase()] = R.value : R.style.removeProperty("overflow-" + dt.a));
                                            F && F.forEach((function(t) {
                                                return t.revert(!1, !0)
                                            })), _t.start = l, _t.end = c, a = o = To ? V : Mt(), ct || To || (a < V && Mt(V), _t.scroll.rec = 0), _t.revert(!1, !0), $t = So(), z && (Et = -1, z.restart(!0)), Ka = 0, s && pt && (s._initted || j) && s.progress() !== j && s.progress(j || 0, !0).render(s.time(), !0, !0), (U || Ct !== _t.progress || ct || et) && (s && !pt && s.totalProgress(ct && l < -.001 && !Ct ? ja.utils.normalize(l, c, 0) : Ct, !0), _t.progress = U || (a - l) / g === Ct ? 0 : Ct), Z && tt && (w._pinOffset = Math.round(_t.progress * S)), I && I.invalidate(), isNaN(B) || (B -= ja.getProperty(d, dt.p), N -= ja.getProperty(p, dt.p), nc(d, dt, B), nc(h, dt, B - (T || 0)), nc(p, dt, N), nc(u, dt, N - (T || 0))), U && !To && _t.update(), !Q || To || m || (m = !0, Q(_t), m = !1)
                                        }
                                }, _t.getVelocity = function() {
                                    return (Mt() - o) / (So() - Xa) * 1e3 || 0
                                }, _t.endAnimation = function() {
                                    Uo(_t.callbackAnimation), s && (I ? I.progress(1) : s.paused() ? pt || Uo(s, _t.direction < 0, 1) : Uo(s, s.reversed()))
                                }, _t.labelToScroll = function(t) {
                                    return s && s.labels && (l || _t.refresh() || l) + s.labels[t] / s.duration() * g || 0
                                }, _t.getTrailing = function(t) {
                                    var e = El.indexOf(_t),
                                        s = _t.direction > 0 ? El.slice(0, e).reverse() : El.slice(e + 1);
                                    return (No(t) ? s.filter((function(e) {
                                        return e.vars.preventOverlaps === t
                                    })) : s).filter((function(t) {
                                        return _t.direction > 0 ? t.end <= l : t.start >= c
                                    }))
                                }, _t.update = function(t, e, n) {
                                    if (!ct || n || t) {
                                        var r, h, u, p, f, m, v, T = !0 === To ? V : _t.scroll(),
                                            _ = t ? 0 : (T - l) / g,
                                            $ = _ < 0 ? 0 : _ > 1 ? 1 : _ || 0,
                                            A = _t.progress;
                                        if (e && (o = a, a = ct ? Mt() : T, at && (O = L, L = s && !pt ? s.totalProgress() : $)), st && Z && !Ka && !xo && $o && (!$ && l < T + (T - o) / (So() - Xa) * st ? $ = 1e-4 : 1 === $ && c > T + (T - o) / (So() - Xa) * st && ($ = .9999)), $ !== A && _t.enabled) {
                                            if (p = (f = (r = _t.isActive = !!$ && $ < 1) !== (!!A && A < 1)) || !!$ != !!A, _t.direction = $ > A ? 1 : -1, _t.progress = $, p && !Ka && (h = $ && !A ? 0 : 1 === $ ? 1 : 1 === A ? 2 : 3, pt && (u = !f && "none" !== yt[h + 1] && yt[h + 1] || yt[h], v = s && ("complete" === u || "reset" === u || u in s))), ut && (f || v) && (v || K || !s) && (Ho(ut) ? ut(_t) : _t.getTrailing(ut).forEach((function(t) {
                                                    return t.endAnimation()
                                                }))), pt || (!I || Ka || xo ? s && s.totalProgress($, !(!Ka || !$t && !t)) : (I._dp._time - I._start !== I._time && I.render(I._dp._time - I._start), I.resetTo ? I.resetTo("totalProgress", $, s._tTime / s._tDur) : (I.vars.totalProgress = $, I.invalidate().restart()))), Z)
                                                if (t && tt && (w.style[tt + dt.os2] = E), vt) {
                                                    if (p) {
                                                        if (m = !t && $ > A && c + 1 > T && T + 1 >= Ro(ft, dt), ot)
                                                            if (t || !r && !m) sc(Z, w);
                                                            else {
                                                                var q = dl(Z, !0),
                                                                    D = T - l;
                                                                sc(Z, Ha, q.top + (dt === Pa ? D : 0) + cl, q.left + (dt === Pa ? 0 : D) + cl)
                                                            }
                                                        Kl(r || m ? b : y), M && $ < 1 && r || k(x + (1 !== $ || m ? 0 : S))
                                                    }
                                                } else k(qo(x + S * $));
                                            at && !i.tween && !Ka && !xo && z.restart(!0), U && (f || rt && $ && ($ < 1 || !yo)) && Ua(U.targets).forEach((function(t) {
                                                return t.classList[r || rt ? "add" : "remove"](U.className)
                                            })), W && !pt && !t && W(_t), p && !Ka ? (pt && (v && ("complete" === u ? s.pause().totalProgress(1) : "reset" === u ? s.restart(!0).pause() : "restart" === u ? s.restart(!0) : s[u]()), W && W(_t)), !f && yo || (X && f && Yo(_t, X), bt[h] && Yo(_t, bt[h]), rt && (1 === $ ? _t.kill(!1, 1) : bt[h] = 0), f || bt[h = 1 === $ ? 1 : 3] && Yo(_t, bt[h])), ht && !r && Math.abs(_t.getVelocity()) > (Go(ht) ? ht : 2500) && (Uo(_t.callbackAnimation), I ? I.progress(1) : Uo(s, "reverse" === u ? 1 : !$, 1))) : pt && W && !Ka && W(_t)
                                        }
                                        if (P) {
                                            var j = ct ? T / ct.duration() * (ct._caScrollDist || 0) : T;
                                            C(j + (d._isFlipped ? 1 : 0)), P(j)
                                        }
                                        F && F(-T / ct.duration() * (ct._caScrollDist || 0))
                                    }
                                }, _t.enable = function(e, s) {
                                    _t.enabled || (_t.enabled = !0, vl(ft, "resize", Al), gt || vl(ft, "scroll", Ml), kt && vl(t, "refreshInit", kt), !1 !== e && (_t.progress = Ct = 0, a = o = Et = Mt()), !1 !== s && _t.refresh())
                                }, _t.getTween = function(t) {
                                    return t && i ? i.tween : I
                                }, _t.setPositions = function(t, e, s, i) {
                                    if (ct) {
                                        var n = ct.scrollTrigger,
                                            r = ct.duration(),
                                            a = n.end - n.start;
                                        t = n.start + a * t / r, e = n.start + a * e / r
                                    }
                                    _t.refresh(!1, !1, {
                                        start: Po(t, s && !!_t._startClamp),
                                        end: Po(e, s && !!_t._endClamp)
                                    }, i), _t.update()
                                }, _t.adjustPinSpacing = function(t) {
                                    if ($ && t) {
                                        var e = $.indexOf(dt.d) + 1;
                                        $[e] = parseFloat($[e]) + t + cl, $[1] = parseFloat($[1]) + t + cl, Kl($)
                                    }
                                }, _t.disable = function(e, s) {
                                    if (_t.enabled && (!1 !== e && _t.revert(!0, !0), _t.enabled = _t.isActive = !1, s || I && I.pause(), V = 0, n && (n.uncache = 1), kt && bl(t, "refreshInit", kt), z && (z.pause(), i.tween && i.tween.kill() && (i.tween = 0)), !gt)) {
                                        for (var r = El.length; r--;)
                                            if (El[r].scroller === ft && El[r] !== _t) return;
                                        bl(ft, "resize", Al), gt || bl(ft, "scroll", Ml)
                                    }
                                }, _t.kill = function(t, i) {
                                    _t.disable(t, i), I && !i && I.kill(), Y && delete $l[Y];
                                    var r = El.indexOf(_t);
                                    r >= 0 && El.splice(r, 1), r === to && Gl > 0 && to--, r = 0, El.forEach((function(t) {
                                        return t.scroller === _t.scroller && (r = 1)
                                    })), r || To || (_t.scroll.rec = 0), s && (s.scrollTrigger = null, t && s.revert({
                                        kill: !1
                                    }), i || s.kill()), h && [h, u, d, p].forEach((function(t) {
                                        return t.parentNode && t.parentNode.removeChild(t)
                                    })), ko === _t && (ko = 0), Z && (n && (n.uncache = 1), r = 0, El.forEach((function(t) {
                                        return t.pin === Z && r++
                                    })), r || (n.spacer = 0)), e.onKill && e.onKill(_t)
                                }, El.push(_t), _t.enable(!1, !1), R && R(_t), s && s.add && !g) {
                                var Ot = _t.update;
                                _t.update = function() {
                                    _t.update = Ot, l || c || _t.refresh()
                                }, ja.delayedCall(.01, _t.update), g = .01, l = c = 0
                            } else _t.refresh();
                            Z && function() {
                                if (_o !== Fl) {
                                    var t = _o = Fl;
                                    requestAnimationFrame((function() {
                                        return t === Fl && Nl(!0)
                                    }))
                                }
                            }()
                        } else this.update = this.refresh = this.kill = Io
                    }, t.register = function(e) {
                        return Fa || (ja = e || zo(), Do() && window.document && t.enable(), Fa = Co), Fa
                    }, t.defaults = function(t) {
                        if (t)
                            for (var e in t) Tl[e] = t[e];
                        return Tl
                    }, t.disable = function(t, e) {
                        Co = 0, El.forEach((function(s) {
                            return s[e ? "kill" : "disable"](t)
                        })), bl(Ra, "wheel", Ml), bl(Ba, "scroll", Ml), clearInterval(Qa), bl(Ba, "touchcancel", Io), bl(Ha, "touchstart", Io), gl(bl, Ba, "pointerdown,touchstart,mousedown", Lo), gl(bl, Ba, "pointerup,touchend,mouseup", Oo), Wa.kill(), Bo(bl);
                        for (var s = 0; s < va.length; s += 3) yl(bl, va[s], va[s + 1]), yl(bl, va[s], va[s + 2])
                    }, t.enable = function() {
                        if (Ra = window, Ba = document, Na = Ba.documentElement, Ha = Ba.body, ja && (Ua = ja.utils.toArray, Ya = ja.utils.clamp, po = ja.core.context || Io, ro = ja.core.suppressOverwrites || Io, fo = Ra.history.scrollRestoration || "auto", Hl = Ra.pageYOffset, ja.core.globals("ScrollTrigger", t), Ha)) {
                            Co = 1, (mo = document.createElement("div")).style.height = "100vh", mo.style.position = "absolute", Rl(), Ao(), Va.register(ja), t.isTouch = Va.isTouch, uo = Va.isTouch && /(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent), lo = 1 === Va.isTouch, vl(Ra, "wheel", Ml), Ga = [Ra, Ba, Na, Ha], ja.matchMedia ? (t.matchMedia = function(t) {
                                var e, s = ja.matchMedia();
                                for (e in t) s.add(e, t[e]);
                                return s
                            }, ja.addEventListener("matchMediaInit", (function() {
                                return Vl()
                            })), ja.addEventListener("matchMediaRevert", (function() {
                                return zl()
                            })), ja.addEventListener("matchMedia", (function() {
                                Nl(0, 1), ql("matchMedia")
                            })), ja.matchMedia("(orientation: portrait)", (function() {
                                return Pl(), Pl
                            }))) : console.warn("Requires GSAP 3.11.0 or later"), Pl(), vl(Ba, "scroll", Ml);
                            var e, s, i = Ha.style,
                                n = i.borderTopStyle,
                                r = ja.core.Animation.prototype;
                            for (r.revert || Object.defineProperty(r, "revert", {
                                    value: function() {
                                        return this.time(-.01, !0)
                                    }
                                }), i.borderTopStyle = "solid", e = dl(Ha), Pa.m = Math.round(e.top + Pa.sc()) || 0, Ma.m = Math.round(e.left + Ma.sc()) || 0, n ? i.borderTopStyle = n : i.removeProperty("border-top-style"), Qa = setInterval(Cl, 250), ja.delayedCall(.5, (function() {
                                    return xo = 0
                                })), vl(Ba, "touchcancel", Io), vl(Ha, "touchstart", Io), gl(vl, Ba, "pointerdown,touchstart,mousedown", Lo), gl(vl, Ba, "pointerup,touchend,mouseup", Oo), Za = ja.utils.checkPrefix("transform"), Yl.push(Za), Fa = So(), Wa = ja.delayedCall(.2, Nl).pause(), io = [Ba, "visibilitychange", function() {
                                    var t = Ra.innerWidth,
                                        e = Ra.innerHeight;
                                    Ba.hidden ? (eo = t, so = e) : eo === t && so === e || Al()
                                }, Ba, "DOMContentLoaded", Nl, Ra, "load", Nl, Ra, "resize", Al], Bo(vl), El.forEach((function(t) {
                                    return t.enable(0, 1)
                                })), s = 0; s < va.length; s += 3) yl(bl, va[s], va[s + 1]), yl(bl, va[s], va[s + 2])
                        }
                    }, t.config = function(e) {
                        "limitCallbacks" in e && (yo = !!e.limitCallbacks);
                        var s = e.syncInterval;
                        s && clearInterval(Qa) || (Qa = s) && setInterval(Cl, s), "ignoreMobileResize" in e && (lo = 1 === t.isTouch && e.ignoreMobileResize), "autoRefreshEvents" in e && (Bo(bl) || Bo(vl, e.autoRefreshEvents || "none"), ao = -1 === (e.autoRefreshEvents + "").indexOf("resize"))
                    }, t.scrollerProxy = function(t, e) {
                        var s = Aa(t),
                            i = va.indexOf(s),
                            n = Vo(s);
                        ~i && va.splice(i, n ? 6 : 2), e && (n ? ba.unshift(Ra, e, Ha, e, Na, e) : ba.unshift(s, e))
                    }, t.clearMatchMedia = function(t) {
                        El.forEach((function(e) {
                            return e._ctx && e._ctx.query === t && e._ctx.kill(!0, !0)
                        }))
                    }, t.isInViewport = function(t, e, s) {
                        var i = (No(t) ? Aa(t) : t).getBoundingClientRect(),
                            n = i[s ? Zo : tl] * e || 0;
                        return s ? i.right - n > 0 && i.left + n < Ra.innerWidth : i.bottom - n > 0 && i.top + n < Ra.innerHeight
                    }, t.positionInViewport = function(t, e, s) {
                        No(t) && (t = Aa(t));
                        var i = t.getBoundingClientRect(),
                            n = i[s ? Zo : tl],
                            r = null == e ? n / 2 : e in _l ? _l[e] * n : ~e.indexOf("%") ? parseFloat(e) * n / 100 : parseFloat(e) || 0;
                        return s ? (i.left + r) / Ra.innerWidth : (i.top + r) / Ra.innerHeight
                    }, t.killAll = function(t) {
                        if (El.slice(0).forEach((function(t) {
                                return "ScrollSmoother" !== t.vars.id && t.kill()
                            })), !0 !== t) {
                            var e = Ll.killAll || [];
                            Ll = {}, e.forEach((function(t) {
                                return t()
                            }))
                        }
                    }, t
                }();
            ac.version = "3.12.5", ac.saveStyles = function(t) {
                return t ? Ua(t).forEach((function(t) {
                    if (t && t.style) {
                        var e = Dl.indexOf(t);
                        e >= 0 && Dl.splice(e, 5), Dl.push(t, t.style.cssText, t.getBBox && t.getAttribute("transform"), ja.core.getCache(t), po())
                    }
                })) : Dl
            }, ac.revert = function(t, e) {
                return Vl(!t, e)
            }, ac.create = function(t, e) {
                return new ac(t, e)
            }, ac.refresh = function(t) {
                return t ? Al() : (Fa || ac.register()) && Nl(!0)
            }, ac.update = function(t) {
                return ++va.cache && Wl(!0 === t ? 2 : 0)
            }, ac.clearScrollMemory = jl, ac.maxScroll = function(t, e) {
                return Ro(t, e ? Ma : Pa)
            }, ac.getScrollFunc = function(t, e) {
                return La(Aa(t), e ? Ma : Pa)
            }, ac.getById = function(t) {
                return $l[t]
            }, ac.getAll = function() {
                return El.filter((function(t) {
                    return "ScrollSmoother" !== t.vars.id
                }))
            }, ac.isScrolling = function() {
                return !!$o
            }, ac.snapDirectional = ml, ac.addEventListener = function(t, e) {
                var s = Ll[t] || (Ll[t] = []);
                ~s.indexOf(e) || s.push(e)
            }, ac.removeEventListener = function(t, e) {
                var s = Ll[t],
                    i = s && s.indexOf(e);
                i >= 0 && s.splice(i, 1)
            }, ac.batch = function(t, e) {
                var s, i = [],
                    n = {},
                    r = e.interval || .016,
                    a = e.batchMax || 1e9,
                    o = function(t, e) {
                        var s = [],
                            i = [],
                            n = ja.delayedCall(r, (function() {
                                e(s, i), s = [], i = []
                            })).pause();
                        return function(t) {
                            s.length || n.restart(!0), s.push(t.trigger), i.push(t), a <= s.length && n.progress(1)
                        }
                    };
                for (s in e) n[s] = "on" === s.substr(0, 2) && Ho(e[s]) && "onRefreshInit" !== s ? o(0, e[s]) : e[s];
                return Ho(a) && (a = a(), vl(ac, "refresh", (function() {
                    return a = e.batchMax()
                }))), Ua(t).forEach((function(t) {
                    var e = {};
                    for (s in n) e[s] = n[s];
                    e.trigger = t, i.push(ac.create(e))
                })), i
            };
            var oc, lc = function(t, e, s, i) {
                    return e > i ? t(i) : e < 0 && t(0), s > i ? (i - e) / (s - e) : s < 0 ? e / (e - s) : 1
                },
                cc = function t(e, s) {
                    !0 === s ? e.style.removeProperty("touch-action") : e.style.touchAction = !0 === s ? "auto" : s ? "pan-" + s + (Va.isTouch ? " pinch-zoom" : "") : "none", e === Na && t(Ha, s)
                },
                hc = {
                    auto: 1,
                    scroll: 1
                },
                uc = function(t) {
                    var e, s = t.event,
                        i = t.target,
                        n = t.axis,
                        r = (s.changedTouches ? s.changedTouches[0] : s).target,
                        a = r._gsap || ja.core.getCache(r),
                        o = So();
                    if (!a._isScrollT || o - a._isScrollT > 2e3) {
                        for (; r && r !== Ha && (r.scrollHeight <= r.clientHeight && r.scrollWidth <= r.clientWidth || !hc[(e = hl(r)).overflowY] && !hc[e.overflowX]);) r = r.parentNode;
                        a._isScroll = r && r !== i && !Vo(r) && (hc[(e = hl(r)).overflowY] || hc[e.overflowX]), a._isScrollT = o
                    }(a._isScroll || "x" === n) && (s.stopPropagation(), s._gsapAllow = !0)
                },
                dc = function(t, e, s, i) {
                    return Va.create({
                        target: t,
                        capture: !0,
                        debounce: !1,
                        lockAxis: !0,
                        type: e,
                        onWheel: i = i && uc,
                        onPress: i,
                        onDrag: i,
                        onScroll: i,
                        onEnable: function() {
                            return s && vl(Ba, Va.eventTypes[0], fc, !1, !0)
                        },
                        onDisable: function() {
                            return bl(Ba, Va.eventTypes[0], fc, !0)
                        }
                    })
                },
                pc = /(input|label|select|textarea)/i,
                fc = function(t) {
                    var e = pc.test(t.target.tagName);
                    (e || oc) && (t._gsapAllow = !0, oc = e)
                },
                mc = function(t) {
                    Wo(t) || (t = {}), t.preventDefault = t.isNormalizer = t.allowClicks = !0, t.type || (t.type = "wheel,touch"), t.debounce = !!t.debounce, t.id = t.id || "normalizer";
                    var e, s, i, n, r, a, o, l, c = t,
                        h = c.normalizeScrollX,
                        u = c.momentum,
                        d = c.allowNestedScroll,
                        p = c.onRelease,
                        f = Aa(t.target) || Na,
                        m = ja.core.globals().ScrollSmoother,
                        g = m && m.get(),
                        v = uo && (t.content && Aa(t.content) || g && !1 !== t.content && !g.smooth() && g.content()),
                        b = La(f, Pa),
                        y = La(f, Ma),
                        w = 1,
                        T = (Va.isTouch && Ra.visualViewport ? Ra.visualViewport.scale * Ra.visualViewport.width : Ra.outerWidth) / Ra.innerWidth,
                        _ = 0,
                        k = Ho(u) ? function() {
                            return u(e)
                        } : function() {
                            return u || 2.8
                        },
                        x = dc(f, t.type, !0, d),
                        S = function() {
                            return n = !1
                        },
                        E = Io,
                        $ = Io,
                        C = function() {
                            s = Ro(f, Pa), $ = Ya(uo ? 1 : 0, s), h && (E = Ya(0, Ro(f, Ma))), i = Fl
                        },
                        M = function() {
                            v._gsap.y = qo(parseFloat(v._gsap.y) + b.offset) + "px", v.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + parseFloat(v._gsap.y) + ", 0, 1)", b.offset = b.cacheID = 0
                        },
                        P = function() {
                            C(), r.isActive() && r.vars.scrollY > s && (b() > s ? r.progress(1) && b(s) : r.resetTo("scrollY", s))
                        };
                    return v && ja.set(v, {
                        y: "+=0"
                    }), t.ignoreCheck = function(t) {
                        return uo && "touchmove" === t.type && function() {
                            if (n) {
                                requestAnimationFrame(S);
                                var t = qo(e.deltaY / 2),
                                    s = $(b.v - t);
                                if (v && s !== b.v + b.offset) {
                                    b.offset = s - b.v;
                                    var i = qo((parseFloat(v && v._gsap.y) || 0) - b.offset);
                                    v.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + i + ", 0, 1)", v._gsap.y = i + "px", b.cacheID = va.cache, Wl()
                                }
                                return !0
                            }
                            b.offset && M(), n = !0
                        }() || w > 1.05 && "touchstart" !== t.type || e.isGesturing || t.touches && t.touches.length > 1
                    }, t.onPress = function() {
                        n = !1;
                        var t = w;
                        w = qo((Ra.visualViewport && Ra.visualViewport.scale || 1) / T), r.pause(), t !== w && cc(f, w > 1.01 || !h && "x"), a = y(), o = b(), C(), i = Fl
                    }, t.onRelease = t.onGestureStart = function(t, e) {
                        if (b.offset && M(), e) {
                            va.cache++;
                            var i, n, a = k();
                            h && (n = (i = y()) + .05 * a * -t.velocityX / .227, a *= lc(y, i, n, Ro(f, Ma)), r.vars.scrollX = E(n)), n = (i = b()) + .05 * a * -t.velocityY / .227, a *= lc(b, i, n, Ro(f, Pa)), r.vars.scrollY = $(n), r.invalidate().duration(a).play(.01), (uo && r.vars.scrollY >= s || i >= s - 1) && ja.to({}, {
                                onUpdate: P,
                                duration: a
                            })
                        } else l.restart(!0);
                        p && p(t)
                    }, t.onWheel = function() {
                        r._ts && r.pause(), So() - _ > 1e3 && (i = 0, _ = So())
                    }, t.onChange = function(t, e, s, n, r) {
                        if (Fl !== i && C(), e && h && y(E(n[2] === e ? a + (t.startX - t.x) : y() + e - n[1])), s) {
                            b.offset && M();
                            var l = r[2] === s,
                                c = l ? o + t.startY - t.y : b() + s - r[1],
                                u = $(c);
                            l && c !== u && (o += u - c), b(u)
                        }(s || e) && Wl()
                    }, t.onEnable = function() {
                        cc(f, !h && "x"), ac.addEventListener("refresh", P), vl(Ra, "resize", P), b.smooth && (b.target.style.scrollBehavior = "auto", b.smooth = y.smooth = !1), x.enable()
                    }, t.onDisable = function() {
                        cc(f, !0), bl(Ra, "resize", P), ac.removeEventListener("refresh", P), x.kill()
                    }, t.lockAxis = !1 !== t.lockAxis, (e = new Va(t)).iOS = uo, uo && !b() && b(1), uo && ja.ticker.add(Io), l = e._dc, r = ja.to(e, {
                        ease: "power4",
                        paused: !0,
                        inherit: !1,
                        scrollX: h ? "+=0.1" : "+=0",
                        scrollY: "+=0.1",
                        modifiers: {
                            scrollY: ic(b, b(), (function() {
                                return r.pause()
                            }))
                        },
                        onUpdate: Wl,
                        onComplete: l.vars.onComplete
                    }), e
                };
            ac.sort = function(t) {
                return El.sort(t || function(t, e) {
                    return -1e6 * (t.vars.refreshPriority || 0) + t.start - (e.start + -1e6 * (e.vars.refreshPriority || 0))
                })
            }, ac.observe = function(t) {
                return new Va(t)
            }, ac.normalizeScroll = function(t) {
                if (void 0 === t) return oo;
                if (!0 === t && oo) return oo.enable();
                if (!1 === t) return oo && oo.kill(), void(oo = t);
                var e = t instanceof Va ? t : mc(t);
                return oo && oo.target === e.target && oo.kill(), Vo(e.target) && (oo = e), e
            }, ac.core = {
                _getVelocityProp: Oa,
                _inputObserver: dc,
                _scrollers: va,
                _proxies: ba,
                bridge: {
                    ss: function() {
                        $o || ql("scrollStart"), $o = So()
                    },
                    ref: function() {
                        return Ka
                    }
                }
            }, zo() && ja.registerPlugin(ac), Zr.registerPlugin(ac);
            const gc = class {
                constructor(t) {
                    this.container = t, this.cards = Array.from(this.container.querySelectorAll("[data-sliding-card]")), this.setupAnimations(), window.addEventListener("resize", this.handleResize)
                }
                setupAnimations() {
                    ac.getAll().forEach((t => t.kill()));
                    const t = window.innerWidth <= 1024;
                    let e;
                    if (this.cards.forEach(((s, i) => {
                            if (i < this.cards.length - 2) {
                                Zr.timeline({
                                    scrollTrigger: {
                                        trigger: s,
                                        start: t ? "top 0px" : "top 200px",
                                        scrub: !0,
                                        ease: "Power2.in",
                                        pin: !0,
                                        pinSpacing: !1
                                    }
                                }).fromTo(s, {
                                    top: t ? "0px" : "200px"
                                }, {
                                    top: t ? "0px" : "200px",
                                    opacity: 0,
                                    scale: .9
                                })
                            } else if (i === this.cards.length - 2) {
                                const e = s.offsetHeight,
                                    i = 24;
                                Zr.timeline({
                                    scrollTrigger: {
                                        trigger: s,
                                        start: t ? "0px" : "top 200px",
                                        end: "+=" + (e - i),
                                        scrub: !0,
                                        ease: "Power2.in",
                                        pin: !0,
                                        pinSpacing: !1
                                    }
                                }).fromTo(s, {
                                    top: t ? "0px" : "200px"
                                }, {
                                    top: t ? "0px" : "200px",
                                    opacity: 0,
                                    scale: .9
                                })
                            } else i === this.cards.length - 1 && (e = s.offsetHeight)
                        })), !t) {
                        const s = document.querySelector("[data-sticky-content]");
                        if (s) {
                            s.offsetHeight;
                            const i = document.querySelector("[data-cards-wrapper]").offsetHeight - e;
                            Zr.timeline({
                                scrollTrigger: {
                                    trigger: s,
                                    start: t ? "0px" : "-=200",
                                    end: `+=${i}`,
                                    pin: !0,
                                    pinSpacing: !0,
                                    ease: "Power2.in"
                                }
                            })
                        }
                    }
                    ac.refresh()
                }
                handleResize = () => {
                    this.setupAnimations()
                }
            };
            Zr.registerPlugin(ac);
            const vc = class {
                constructor(t) {
                    this.swiper = t, this.parent = t.closest(".swiper-parent"), this.initSwiper()
                }
                initSwiper() {
                    const t = new Zt(this.swiper, {
                        modules: [vt, yt],
                        slidesPerView: 1,
                        spaceBetween: 32,
                        autoHeight: !1,
                        navigation: {
                            nextEl: this.parent.querySelector(".swiper-button-next"),
                            prevEl: this.parent.querySelector(".swiper-button-prev-mobile")
                        },
                        pagination: {
                            el: this.parent.querySelector(".swiper-pagination"),
                            type: "fraction",
                            clickable: !1
                        },
                        breakpoints: {
                            768: {
                                slidesPerView: 1
                            },
                            1024: {
                                slidesPerView: 1,
                                navigation: {
                                    prevEl: this.parent.querySelector(".swiper-button-prev")
                                }
                            }
                        }
                    });
                    new ResizeObserver((() => {
                        const e = window.innerWidth;
                        t.params.navigation.prevEl = e >= 1024 ? this.parent.querySelector(".swiper-button-prev") : this.parent.querySelector(".swiper-button-prev-mobile"), t.navigation.destroy(), t.navigation.init(), t.navigation.update()
                    })).observe(this.swiper)
                }
                init() {
                    this.parent.querySelectorAll(".testimonial-card").forEach((t => {
                        const e = t.querySelector("[data-readmore-button]"),
                            s = t.querySelector(".testimonial-content");
                        e && (e.onclick = function() {
                            e.classList.toggle("hidden", !0), s.classList.toggle("max-h-[128px]", !1), s.classList.toggle("overflow-hidden", !1)
                        })
                    }))
                }
            };
            const bc = class {
                constructor(t) {
                    this.swiper = t, this.initSwiper(), t.swiper = this, window.addEventListener("resize", this.handleResize.bind(this))
                }
                initSwiper() {
                    window.innerWidth < 640 && (this.swiperInstance = new Zt(this.swiper, {
                        modules: [vt],
                        slidesPerView: 1.1,
                        spaceBetween: 24,
                        navigation: {
                            nextEl: this.swiper.querySelector(".swiper-button-next"),
                            prevEl: this.swiper.querySelector(".swiper-button-prev")
                        },
                        breakpoints: {
                            639: {
                                spaceBetween: 24,
                                slidesPerView: 2
                            },
                            1024: {
                                spaceBetween: 32,
                                slidesPerView: 3
                            }
                        }
                    }))
                }
                handleResize() {
                    const t = window.innerWidth;
                    t >= 640 && this.swiperInstance && (this.swiperInstance.destroy(!0, !0), this.swiperInstance = null, this.removeInlineStyles()), t < 640 && !this.swiperInstance && this.initSwiper()
                }
                removeInlineStyles() {
                    this.swiper.querySelectorAll(".swiper-slide").forEach((t => {
                        t.style.width = "", t.style.marginRight = ""
                    }))
                }
            };
            const yc = class {
                constructor(t) {
                    this.node = t, this.init()
                }
                init = () => {
                    const t = this.node.querySelector("[data-show-more-btn]"),
                        e = this.node.querySelectorAll(".hidden-card");
                    t && t.addEventListener("click", (() => {
                        e.forEach((t => {
                            t.classList.toggle("hidden", !1)
                        })), t.classList.toggle("hidden", !0)
                    }))
                }
            };
            const wc = class {
                constructor(t) {
                    this.section = t, this.clickTabs = t.querySelectorAll("[data-click-tabs]"), this.selectTabs = t.querySelector("[data-select-tabs]"), this.selectTabs.addEventListener("change", this.handleTabSelectChange), this.clickTabs.forEach((t => t.addEventListener("click", this.handleTabClick))), new O(this.section);
                    const e = window.location.hash.substring(1);
                    if (e) {
                        const t = this.section.querySelector(`[data-anchor="${e}"]`);
                        t && t.value && this.activateTab(t.value)
                    }
                }
                activateTab(t) {
                    this.selectTabs.value = t, this.selectTabs.querySelectorAll("option").forEach((e => e.toggleAttribute("selected", e.value === t))), this.clickTabs.forEach((e => e.classList.toggle("active", e.dataset.tabId === t))), this.toggleContentPanels(t)
                }
                handleTabSelectChange = t => {
                    t.preventDefault();
                    const e = this.section.querySelector(`[data-click-tabs][data-tab-id=${t.target.value}]`);
                    if (e) {
                        const t = new Event("click");
                        e.dispatchEvent(t)
                    }
                };
                handleTabClick = t => {
                    t.preventDefault();
                    const e = t.target.closest("[data-tab-id]").dataset.tabId;
                    this.clickTabs.forEach((t => t.classList.toggle("active", t.dataset.tabId == e))), this.selectTabs.value = e, this.selectTabs.querySelectorAll("option").forEach((t => t.toggleAttribute("selected", t.value == e))), this.toggleContentPanels(e)
                };
                toggleContentPanels = t => {
                    this.section.querySelectorAll("[data-tab-content]").forEach((e => {
                        e.classList.toggle("active", e.dataset.tabId == t)
                    }))
                }
            };
            const Tc = class {
                constructor(t) {
                    this.swiper = t, this.initSwiper()
                }
                initSwiper() {
                    new Zt(this.swiper, {
                        modules: [vt],
                        slidesPerView: 1,
                        spaceBetween: 24,
                        navigation: {
                            nextEl: this.swiper.querySelector(".swiper-button-next"),
                            prevEl: this.swiper.querySelector(".swiper-button-prev")
                        },
                        breakpoints: {
                            500: {
                                slidesPerView: 1.5
                            },
                            768: {
                                slidesPerView: 2.5
                            },
                            1280: {
                                slidesPerView: 4
                            }
                        }
                    })
                }
            };
            const _c = class {
                constructor(t) {
                    this.container = t, this.parent = t.closest(".swiper-parent"), this.initSwiper(), this.presentations = [];
                    this.container.querySelectorAll("[data-presentation-selector]").forEach((t => {
                        this.initCards(), this.changePresentation(t), t.onchange = () => {
                            this.changePresentation(t)
                        }
                    }))
                }
                initSwiper() {
                    this.swiper = new Zt(this.container, {
                        modules: [vt],
                        slidesPerView: 1.1,
                        spaceBetween: 24,
                        autoHeight: !0,
                        navigation: {
                            nextEl: this.parent.querySelector(".swiper-button-next"),
                            prevEl: this.parent.querySelector(".swiper-button-prev")
                        },
                        breakpoints: {
                            768: {
                                slidesPerView: 1
                            }
                        }
                    })
                }
                initCards() {
                    this.container.querySelectorAll("[data-conference-card]").forEach((t => {
                        if (t.querySelectorAll(".presentation")) {
                            const e = t.querySelector("[data-presentation-selector]");
                            let s;
                            e && (s = e.id);
                            const i = t.querySelectorAll("[data-presentation-value]"),
                                n = t.querySelectorAll("[data-speakers]"),
                                r = {
                                    cardId: t.id,
                                    currentSelector: s,
                                    presentationsInCardValues: i,
                                    presentationsInCardSpeakers: n
                                };
                            this.presentations.push(r)
                        }
                    }))
                }
                changePresentation(t) {
                    let e = t.value;
                    this.presentations.forEach((s => {
                        if (s.cardId == t.id) {
                            s.presentationsInCardSpeakers.forEach((t => t.classList.toggle("hidden", t.id != e)))
                        }
                    })), this.swiper.updateAutoHeight()
                }
            };
            var kc = s("../node_modules/headroom.js/dist/headroom.js");
            const xc = {
                init() {
                    C.init(), new kc(document.querySelector("header"), {
                        offset: 40,
                        onPin: function() {
                            this.elem.classList.add("bg-white")
                        },
                        onTop: function() {
                            this.elem.classList.remove("bg-white")
                        }
                    }).init();
                    const t = new IntersectionObserver((t => {
                        t.forEach((t => {
                            t.isIntersecting && t.target.classList.add("revealed")
                        }))
                    }), {
                        threshold: .07
                    });
                    document.querySelectorAll(".reveal-on-scroll:not(.revealed)").forEach((function(e) {
                        t.observe(e)
                    })), document.querySelectorAll(".accordion").forEach((t => new O(t))), document.querySelectorAll("[data-action=open-modal][data-modal-type=default]").forEach((t => new q(t))), document.querySelectorAll("[data-action=open-modal][data-modal-type=video]").forEach((t => new W(t))), document.querySelectorAll(".lightbox-container").forEach((t => new U(t))), document.querySelectorAll("[data-action=play-video]").forEach((t => new Y(t))), document.querySelectorAll(".portals-section").forEach((t => new yc(t))), document.querySelectorAll(".sliding-cards-section").forEach((t => new gc(t))), document.querySelectorAll(".logo-swiper-container").forEach((t => new te(t))), document.querySelectorAll(".images-slider-swiper-container").forEach((t => new ee(t))), document.querySelectorAll(".resources-slider-swiper-container").forEach((t => new se(t))), document.querySelectorAll(".featured-resources-slider-swiper-container").forEach((t => new ie(t))), document.querySelectorAll(".related-resources-slider-swiper-container").forEach((t => new ne(t))), document.querySelectorAll(".team-slider-swiper-container").forEach((t => new bc(t))), document.querySelectorAll(".events-slider-swiper-container").forEach((t => new re(t))), document.querySelectorAll(".conference-slider-swiper-container").forEach((t => new _c(t))), document.querySelectorAll(".testimonials-cards-slider").forEach((t => new vc(t))), document.querySelectorAll(".speaker-slider-swiper-container").forEach((t => new Tc(t))), document.querySelectorAll(".video-section").forEach((t => new Y(t))), document.querySelectorAll(".tabs-section").forEach((t => new wc(t)))
                }
            };
            Zr.registerPlugin(ac);
            const Sc = {
                init(t) {
                    if (!t) return;
                    Zr.matchMedia().add({
                        isSmall: "(max-width: 767.98px)",
                        isMedium: "(min-width: 768px) and (max-width: 1023.98px)",
                        isLarge: "(min-width: 1024px)"
                    }, (e => {
                        const {
                            isSmall: s,
                            isMedium: i,
                            isLarge: n
                        } = e.conditions, r = Zr.timeline({
                            defaults: {
                                ease: "none"
                            },
                            scrollTrigger: {
                                trigger: t,
                                start: "top top",
                                end: () => "+=" + function(t) {
                                    const e = getComputedStyle(t).getPropertyValue("--animation-range").trim();
                                    if (!e) return window.innerHeight;
                                    const s = e.match(/(-?[\d.]+)\s*vw/);
                                    if (s) {
                                        const t = parseFloat(s[1]);
                                        return window.innerWidth * t / 100
                                    }
                                    const i = e.match(/(-?[\d.]+)\s*px/);
                                    if (i) return parseFloat(i[1]);
                                    const n = parseFloat(e);
                                    if (!Number.isNaN(n)) return n;
                                    return window.innerHeight
                                }(t),
                                scrub: !0,
                                invalidateOnRefresh: !0,
                                pin: n,
                                pinSpacing: n
                            }
                        });
                        return r.to(t, {
                            "--hero-teaser-bar-scale": 12,
                            "--hero-teaser-video-zoom": 1,
                            duration: 1
                        }, 0), s && (r.to(t, {
                            "--hero-teaser-opacity": 0,
                            duration: .3
                        }, 0), r.to(t, {
                            "--hero-teaser-video-modal-button-opacity": 1,
                            duration: .1
                        }, .2)), i && (r.to(t, {
                            "--hero-teaser-shift-y": "-4vw",
                            duration: 1
                        }, 0), r.to(t, {
                            "--hero-teaser-opacity": 0,
                            duration: .3
                        }, 0), r.to(t, {
                            "--hero-teaser-video-modal-button-opacity": 1,
                            duration: .2
                        }, .1)), n && (r.to(t, {
                            "--hero-teaser-shift-y": "-10vw",
                            "--hero-teaser-shift-x": "0",
                            duration: 1
                        }, 0), r.to(t, {
                            "--hero-teaser-content-z-index": 1
                        }, .05), r.to(t, {
                            "--hero-teaser-opacity": "0",
                            duration: .2
                        }, 0), r.to(t, {
                            "--hero-teaser-video-modal-button-opacity": 1,
                            duration: .3
                        }, .2), r.to(t, {
                            "--hero-teaser-video-content-move": "-50vw"
                        }, .21), r.to(t, {
                            "--hero-teaser-intro-text-opacity": 1,
                            duration: .79
                        }, .21)), () => {
                            r.scrollTrigger && r.scrollTrigger.kill(), r.kill()
                        }
                    }))
                }
            };
            let Ec, $c, Cc, Mc;
            const Pc = {
                init() {
                    ! function() {
                        if (Ec = document.querySelector(".animated-video-hero [data-teaser-container]"), !Ec) return;
                        Mc = {
                            mobile: Ec.dataset.mobileVideoId,
                            tablet: Ec.dataset.tabletVideoId,
                            desktop: Ec.dataset.desktopVideoId
                        }, new k({
                            default: () => {
                                Ac(Mc.mobile)
                            },
                            md: () => {
                                Ac(Mc.tablet)
                            },
                            lg: () => {
                                Ac(Mc.desktop)
                            }
                        }), $c = document.getElementById("hero-teaser-video-button"), $c && function() {
                            const t = new I($c, "video-modal"),
                                e = $c.dataset.fullVideoId,
                                s = document.querySelector(".hero-teaser-faux-button");
                            s && s.addEventListener("click", (() => {
                                t.openModal()
                            }));
                            t.onOpenCallback = () => {
                                "keep" == t.detail.state ? Cc.play() : (t.dataSlot.querySelector(".full-video-wrapper").innerHTML = `<div class="wistia_embed wistia_async_${e} videoFoam=true size-full object-cover"></div>`, window._wq = window._wq || [], window._wq.push({
                                    id: e,
                                    onReady: function(t) {
                                        Cc = t, t.play()
                                    }
                                }))
                            }, t.onCloseCallback = () => {
                                Cc && Cc.pause()
                            }
                        }()
                    }(), Sc.init(document.querySelector(".animated-video-hero"))
                }
            };

            function Ac(t) {
                t && Ec && (Ec.innerHTML = `<div class="wistia_embed wistia_async_${t}"\n    data-muted="true"\n    data-autoplay="true"\n    data-controls="false"\n    data-controlsvisibleonload="false"\n    data-chromeless="true"\n    data-wmode="transparent"></div>`, window._wq = window._wq || [], window._wq.push({
                    id: t,
                    onReady: function(t) {
                        t.mute(), t.play(), t.bind("timechange", (function(e) {
                            e && e > 8 && (t.time(0), t.play())
                        }))
                    }
                }))
            }
            const Lc = class {
                constructor(t) {
                    this.element = t, this.filterEvent = this.setupFilterEvent(), this.isFiltered = !1, this.initFilter()
                }
                initFilter = () => {
                    this.setIsFiltered(), this.element.addEventListener("change", this.handleFilterChange)
                };
                setIsFiltered = () => {
                    this.isFiltered = "" != this.element.value
                };
                getName = () => this.element.dataset.name;
                getUrlParam = () => this.element.dataset.urlParam;
                getValue = () => this.element.value;
                clear = () => {
                    this.element.value = "", this.setIsFiltered()
                };
                setupFilterEvent = () => new CustomEvent("filter", {
                    detail: this
                });
                handleFilterChange = () => {
                    this.setIsFiltered(), this.element.dispatchEvent(this.filterEvent)
                }
            };
            const Oc = class {
                    constructor(t) {
                        let {
                            postTypes: e,
                            container: s,
                            filters: i = !1,
                            clearButton: n = !1,
                            searchBar: r = !1
                        } = t;
                        this.action = "get_items", this.postTypes = e, this.container = s, this.clearButton = n, this.searchBar = r, this.filters = this.initFilters(i), this.initPagination()
                    }
                    initFilters = t => {
                        if (!1 === t) return !1;
                        let e = (t = t instanceof NodeList ? [...t] : [t]).map((t => new Lc(t)));
                        return e.forEach((t => t.element.addEventListener("filter", this.handleFilterChange))), this.searchBar && (this.searchBar.addEventListener("submit", this.handleSearch), this.searchBar.addEventListener("input", this.checkInput)), this.clearButton && this.clearButton.addEventListener("click", this.clearFilters), e
                    };
                    checkInput = () => {
                        "" == this.searchBar.querySelector("[data-search-value]").value && this.handleSearch()
                    };
                    initPagination = () => {
                        this.container && this.container.querySelectorAll("[data-pagination] a").forEach((t => {
                            t.addEventListener("click", this.handlePaginationClick.bind(null, t), {
                                once: !0
                            })
                        }))
                    };
                    handleFilterChange = () => {
                        if (this.clearSearch(), this.fetchItems(), this.clearButton) {
                            let t = this.filters.filter((t => t.isFiltered)).length;
                            this.toggleClearButton(!t)
                        }
                    };
                    handleSearch = t => {
                        t && t.preventDefault(), this.resetFilters(), this.fetchItems(1, "search")
                    };
                    clearFilters = () => {
                        this.filters.forEach((t => t.clear())), this.handleFilterChange()
                    };
                    resetFilters = () => {
                        this.filters.forEach((t => t.clear()))
                    };
                    clearSearch = () => {
                        this.searchBar.querySelector("[data-search-value]").value = ""
                    };
                    toggleClearButton = t => {
                        this.clearButton && this.clearButton.classList.toggle("hidden", t)
                    };
                    handlePaginationClick = (t, e) => {
                        e.preventDefault(), this.fetchItems(t.dataset.paged)
                    };
                    fetchItems = (() => {
                        var t = this;
                        return function() {
                            let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,
                                s = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "filter",
                                i = {
                                    action: t.action,
                                    post_types: t.postTypes,
                                    paged: e,
                                    limit: t.container.dataset.limit
                                },
                                n = {};
                            "filter" == s && t.filters && t.filters.forEach((t => {
                                i[t.getName()] = t.getValue(), console.log(t), t.isFiltered && (n[t.getUrlParam()] = t.getValue()), t.element.querySelectorAll("input[type=hidden]").forEach((t => {
                                    i[t.name] = t.value
                                }))
                            }));
                            let r = t.searchBar.querySelector("[data-search-value]").value;
                            "search" == s && r && (i.s = r, i.engine = t.searchBar.dataset.searchEngine), t.container.classList.add("loading"), fetch(`${window.ajaxUrl}?${new URLSearchParams(i).toString()}`).then((t => t.json())).then((s => {
                                t.container.innerHTML = s.html, t.initPagination(), t.container.classList.remove("loading"), t.updateUrl(e, n)
                            }))
                        }
                    })();
                    updateUrl = (t, e) => {
                        let s = new RegExp(`${window.pagination_base}/\\d+`),
                            i = t > 1 ? window.pagination_base + "/" + t : "",
                            n = window.location.pathname.match(s) ? window.location.pathname.replace(s, i) : window.location.pathname + i,
                            r = new URLSearchParams(e);
                        n += r.toString() ? "?" + r.toString() : "", history.replaceState(null, null, n)
                    }
                },
                Ic = {
                    init() {
                        new Oc({
                            post_type: "article",
                            filters: document.querySelectorAll("[data-filters]"),
                            container: document.querySelector("[data-index]"),
                            clearButton: document.querySelector("[data-clear-filters]")
                        })
                    }
                },
                qc = {
                    init() {
                        const t = document.querySelector("#branch-selector"),
                            e = document.querySelector(".team-member-index").querySelectorAll(".team-member-card"),
                            s = document.querySelector("[data-current-branch-title]"),
                            i = document.querySelector("[data-show-branches-list]"),
                            n = t.querySelectorAll("button");
                        let r = !1;
                        i.addEventListener("click", (() => {
                            t.classList.toggle("hidden", !1), setTimeout((() => {
                                r = !0
                            }), 0)
                        })), n.forEach((t => {
                            t.addEventListener("click", (() => o(t)))
                        }));
                        const a = new URLSearchParams(window.location.search).get("branch");
                        if (a) {
                            const t = Array.from(n).find((t => t.getAttribute("data-branch-slug") === a));
                            o(t || n[0])
                        } else o(n[0]);

                        function o(i) {
                            const n = i.getAttribute("data-branch-slug"),
                                a = i.getAttribute("data-branch");
                            s.innerHTML = a, t.classList.add("hidden"), r = !1, t.querySelectorAll("[data-branch]").forEach((t => {
                                    t.classList.toggle("text-gray-300", t === i)
                                })), e.forEach((t => {
                                    const e = !(t.querySelector("[data-branch]").dataset.branchSlug == n || "view-all" == n);
                                    t.classList.toggle("hidden", e)
                                })),
                                function(t) {
                                    const e = new URL(window.location);
                                    t && "view-all" !== t ? e.searchParams.set("branch", t) : e.searchParams.delete("branch");
                                    history.replaceState({}, "", e)
                                }(n)
                        }
                        window.addEventListener("click", (function(e) {
                            r && (t.contains(e.target) || e.target === i || (t.classList.add("hidden"), r = !1))
                        }))
                    }
                },
                Dc = {
                    init() {
                        new Oc({
                            postTypes: document.querySelector("[data-index]").dataset.postTypes,
                            filters: document.querySelectorAll("[data-filters]"),
                            container: document.querySelector("[data-index]"),
                            searchBar: document.querySelector("[data-searchbar]")
                        })
                    }
                },
                zc = {
                    init() {
                        const t = document.querySelectorAll("[data-toggle-button]");
                        if (0 == t.length) return;
                        const e = Array.from(t).map((t => t.dataset.for));
                        let s = window.location.hash.replace("#", "");

                        function i() {
                            document.querySelectorAll("[data-for]").forEach((t => {
                                t.classList.toggle("active", t.dataset.for === s)
                            }))
                        }
                        s && e.includes(s) || (s = t[0].dataset.for), i(), t.forEach((t => {
                            t.addEventListener("click", (e => function(t, e) {
                                t.preventDefault(), s = e.dataset.for, window.location.hash = s, i()
                            }(e, t)))
                        }))
                    }
                },
                Vc = {
                    init() {
                        const t = () => {
                            const e = document.querySelectorAll(".whr-item");
                            e.length > 0 ? e.forEach((t => {
                                let e = t.querySelector("a").getAttribute("href");
                                t.addEventListener("click", (t => {
                                    t.preventDefault(), window.open(e, "_blank")
                                }))
                            })) : setTimeout(t, 100)
                        };
                        t()
                    }
                };
            let jc;
            const Fc = {
                    init() {
                        jc = document.getElementById("registration-modal"), jc && (document.querySelectorAll("[data-open-registration-modal]").forEach((t => t.addEventListener("click", Bc))), jc.addEventListener("click", Rc))
                    }
                },
                Rc = t => {
                    t.target.closest(".modal-box") && !t.target.closest('[data-action="close-modal"]') || Nc()
                },
                Bc = t => {
                    t.preventDefault(), jc.classList.add("is-open")
                },
                Nc = () => {
                    jc.classList.remove("is-open")
                };
            i((async () => {
                xc.init();
                const t = document.querySelector("body");
                t.classList.contains("home") && Pc.init(), t.classList.contains("page-template-template-articles") && Ic.init(), t.classList.contains("page-template-template-team") && qc.init(), t.classList.contains("event-template-default") && Fc.init(), t.classList.contains("page-template-template-contact") && zc.init(), t.classList.contains("page-template-template-careers") && Vc.init(), (t.classList.contains("page-template-template-resources") || t.classList.contains("page-template-template-resources-hub") || t.classList.contains("page-template-template-newsroom")) && Dc.init()
            })), window.ajaxUrl = ajax_object.ajax_url, window.pagination_base = ajax_object.pagination_base
        }
    },
    t => {
        var e = e => t(t.s = e);
        e("./scripts/app.js"), e("./styles/app.css")
    }
]);
//# sourceMappingURL=app.6df632.js.map