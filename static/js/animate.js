
(function(win, doc) {
    var animate = function(elem) { elem = typeof elem === 'string' ? doc.getElementById(elem) : elem;
            return new AnimExtend(elem) },
        pow = Math.pow,
        sin = Math.sin,
        PI = Math.PI,
        BACK_CONST = 1.70158,
        animData = [];
    var Easing = { linear: function(t) {
            return t }, easeIn: function(t) {
            return t * t }, easeOut: function(t) {
            return (2 - t) * t }, easeBoth: function(t) {
            return (t *= 2) < 1 ? .5 * t * t : .5 * (1 - (--t) * (t - 2)) }, easeInStrong: function(t) {
            return t * t * t * t }, easeOutStrong: function(t) {
            return 1 - (--t) * t * t * t }, easeBothStrong: function(t) {
            return (t *= 2) < 1 ? .5 * t * t * t * t : .5 * (2 - (t -= 2) * t * t * t) }, easeOutQuart: function(t) {
            return -(pow((t - 1), 4) - 1) }, easeInOutExpo: function(t) {
            if (t === 0) return 0;
            if (t === 1) return 1;
            if ((t /= 0.5) < 1) return 0.5 * pow(2, 10 * (t - 1));
            return 0.5 * (-pow(2, -10 * --t) + 2) }, easeOutExpo: function(t) {
            return (t === 1) ? 1 : -pow(2, -10 * t) + 1 }, swingFrom: function(t) {
            return t * t * ((BACK_CONST + 1) * t - BACK_CONST) }, swingTo: function(t) {
            return (t -= 1) * t * ((BACK_CONST + 1) * t + BACK_CONST) + 1 }, backIn: function(t) {
            if (t === 1) t -= .001;
            return t * t * ((BACK_CONST + 1) * t - BACK_CONST) }, backOut: function(t) {
            return (t -= 1) * t * ((BACK_CONST + 1) * t + BACK_CONST) + 1 }, bounce: function(t) {
            var s = 7.5625,
                r;
            if (t < (1 / 2.75)) { r = s * t * t } else if (t < (2 / 2.75)) { r = s * (t -= (1.5 / 2.75)) * t + .75 } else if (t < (2.5 / 2.75)) { r = s * (t -= (2.25 / 2.75)) * t + .9375 } else { r = s * (t -= (2.625 / 2.75)) * t + .984375 };
            return r } };
    var animBase = { getStyle: function(elem, p) {
            return 'getComputedStyle' in win ? function() {
                var val = getComputedStyle(elem, null)[p];
                if ((p === 'left' || p === 'right' || p === 'top' || p === 'bottom') && val === 'auto') {
                    return '0px' };
                return val }() : function() {
                var newP = p.replace(/\-(\w)/g, function($, $1) {
                    return $1.toUpperCase() });
                var val = elem.currentStyle[newP];
                if ((newP === "width" || newP === "height") && val === 'auto') {
                    var rect = elem.getBoundingClientRect();
                    return (newP === 'width' ? rect.right - rect.left : rect.bottom - rect.top) + 'px' };
                if (newP === 'opacity') {
                    var filter = elem.currentStyle.filter;
                    if (/opacity/.test(filter)) { val = filter.match(/\d+/)[0] / 100;
                        return (val === 1 || val === 0) ? val.toFixed(0) : val.toFixed(1) } else if (val === undefined) {
                        return '1' } }
                if ((p === 'left' || p === 'right' || p === 'top' || p === 'bottom') && val === 'auto') {
                    return '0px' }
                return val }() }, parseColor: function(val) {
            var r, g, b;
            if (/rgb/.test(val)) {
                var arr = val.match(/\d+/g);
                r = arr[0];
                g = arr[1];
                b = arr[2] } else if (/#/.test(val)) {
                var len = val.length;
                if (len === 7) { r = parseInt(val.slice(1, 3), 16);
                    g = parseInt(val.slice(3, 5), 16);
                    b = parseInt(val.slice(5), 16) } else if (len === 4) { r = parseInt(val.charAt(1) + val.charAt(1), 16);
                    g = parseInt(val.charAt(2) + val.charAt(2), 16);
                    b = parseInt(val.charAt(3) + val.charAt(3), 16) } } else {
                return val };
            return { r: parseFloat(r), g: parseFloat(g), b: parseFloat(b) } }, parseStyle: function(prop) {
            var val = parseFloat(prop),
                unit = prop.replace(/^[\-\d\.]+/, '');
            return isNaN(val) ? { val: this.parseColor(unit), unit: '', fn: function(sv, tv, tu, e) {
                    var r = (sv.r + (tv.r - sv.r) * e).toFixed(0),
                        g = (sv.g + (tv.g - sv.g) * e).toFixed(0),
                        b = (sv.b + (tv.b - sv.b) * e).toFixed(0);
                    return 'rgb(' + r + ',' + g + ',' + b + ')' } } : { val: val, unit: unit, fn: function(sv, tv, tu, e) {
                    return (sv + (tv - sv) * e).toFixed(3) + tu } } }, newObj: function(arr, val) { val = val !== undefined ? val : 1;
            var obj = {};
            for (var i = 0, len = arr.length; i < len; i += 1) { obj[arr[i]] = val };
            return obj }, setOpacity: function(elem, val) {
            if ('getComputedStyle' in win) { elem.style.opacity = val === 1 ? '' : val } else { elem.style.zoom = 1;
                elem.style.filter = val === 1 ? '' : 'alpha(opacity=' + val * 100 + ')' } }, speed: { slow: 600, fast: 200, defaults: 400 }, fxAttrs: function(type, index) {
            var attrs = [
                ['width', 'height', 'opacity', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth'],
                ['height', 'paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth'],
                ['opacity']
            ];
            return { attrs: attrs[index], type: type } }, setOptions: function(elem, duration, easing, callback) {
            var self = this,
                options = {};
            options.duration = (function(d) {
                if (typeof d === 'number') {
                    return d } else if (typeof d === 'string' && self.speed[d]) {
                    return self.speed[d] } else if (!d) {
                    return self.speed.defaults } })(duration);
            options.easing = (function(e) {
                if (typeof e === 'string' && Easing[e]) {
                    return Easing[e] } else if (typeof e === 'function') {
                    return e } else {
                    return Easing.easeBoth } })(easing);
            options.callback = function() {
                if (typeof callback === 'function') { callback() };
                self.dequeue(elem) };
            return options }, setProps: function(elem, props, type) {
            if (type) {
                var attrs = props().attrs,
                    type = props().type,
                    val, obj, p;
                if (type === 'hide') { val = attrs[0] === 'opacity' ? '0' : '0px' };
                obj = this.newObj(attrs, val);
                if (type === 'show') {
                    for (p in obj) { obj[p] = this.getStyle(elem, p) } };
                return obj } else if (props && typeof props === 'object') {
                return props } }, data: function(elem) {
            var animQueue = elem.animQueue;
            if (!animQueue) { animQueue = elem.animQueue = [] };
            return animQueue }, queue: function(elem, data) {
            var animQueue = this.data(elem);
            if (data) { animQueue.push(data) };
            if (animQueue[0] !== 'runing') { this.dequeue(elem) } }, dequeue: function(elem) {
            var self = this,
                animQueue = self.data(elem),
                fn = animQueue.shift();
            if (fn === 'runing') { fn = animQueue.shift() };
            if (fn) { animQueue.unshift('runing');
                if (typeof fn === 'number') { win.setTimeout(function() { self.dequeue(elem) }, fn) } else if (typeof fn === 'function') { fn.call(elem, function() { self.dequeue(elem) }) } };
            if (!animQueue.length) { elem.animQueue = undefined } } };
    var AnimCore = function(elem, options, props, type) { this.elem = elem;
            this.options = options;
            this.props = props;
            this.type = type },
        $ = animBase;
    AnimCore.prototype = { start: function(source, target) { this.startTime = +new Date();
            this.source = source;
            this.target = target;
            animData.push(this);
            var self = this;
            if (self.elem.timer) return;
            self.elem.timer = win.setInterval(function() {
                for (var i = 0, curStep; curStep = animData[i++];) { curStep.run() };
                if (!animData.length) { self.stop() } }, 13) }, run: function(end) {
            var elem = this.elem,
                type = this.type,
                props = this.props,
                startTime = this.startTime,
                elapsedTime = +new Date(),
                duration = this.options.duration,
                endTime = startTime + duration,
                t = elapsedTime > endTime ? 1 : (elapsedTime - startTime) / duration,
                e = this.options.easing(t),
                len = 0,
                i = 0,
                p;
            for (p in props) { len += 1 };
            elem.style.overflow = 'hidden';
            if (type === 'show') { elem.style.display = 'block' };
            for (p in props) { i += 1;
                var sv = this.source[p].val,
                    tv = this.target[p].val,
                    tu = this.target[p].unit;
                if (end || elapsedTime >= endTime) { elem.style.overflow = '';
                    if (type === 'hide') { elem.style.display = 'none' };
                    if (type) {
                        if (p === 'opacity') { $.setOpacity(elem, 1) } else { elem.style[p] = (type === 'hide' ? sv : tv) + tu } } else { elem.style[p] = /color/i.test(p) ? 'rgb(' + tv.r + ',' + tv.g + ',' + tv.b + ')' : tv + tu };
                    if (i === len) { this.complete();
                        this.options.callback.call(elem) } } else {
                    if (sv === tv) continue;
                    if (p === 'opacity') { $.setOpacity(elem, (sv + (tv - sv) * e).toFixed(3)) } else { elem.style[p] = this.target[p].fn(sv, tv, tu, e) } } } }, stop: function() { win.clearInterval(this.elem.timer);
            this.elem.timer = undefined }, complete: function() {
            for (var i = animData.length - 1; i >= 0; i--) {
                if (this === animData[i]) { animData.splice(i, 1) } } } };
    var AnimExtend = function(elem) { this.elem = elem };
    AnimExtend.prototype = { custom: function(props, duration, easing, callback) {
            var elem = this.elem,
                options = $.setOptions(elem, duration, easing, callback),
                type = typeof props === 'function' ? props().type : null;
            props = $.setProps(elem, props, type);
            $.queue(elem, function() {
                var source = {},
                    target = {},
                    p;
                for (p in props) {
                    if (type === 'show') {
                        if (p === 'opacity') { $.setOpacity(elem, '0') } else { elem.style[p] = '0px' } };
                    source[p] = $.parseStyle($.getStyle(elem, p));
                    target[p] = $.parseStyle(props[p]); };
                var core = new AnimCore(elem, options, props, type);
                core.start(source, target) });
            return this }, stop: function(clear, end) {
            var elem = this.elem,
                i = animData.length;
            if (clear) { elem.animQueue = undefined }
            while (i--) {
                if (animData[i].elem === elem) {
                    if (end) { animData[i].run(true);
                        if (elem.timer) return;
                        elem.timer = win.setInterval(function() {
                            for (var j = 0, curStep; curStep = animData[j++];) { curStep.run() };
                            if (!i) { win.clearInterval(elem.timer);
                                elem.timer = undefined } }, 13) };
                    animData.splice(i, 1) } };
            if (!end) { $.dequeue(elem) };
            return this }, show: function(duration, easing, callback) {
            var elem = this.elem;
            if (duration) { this.custom(function() {
                    return $.fxAttrs('show', 0) }, duration, easing, callback) } else { elem.style.display = 'block' };
            return this }, delay: function(time) {
            if (typeof time === 'number') { $.queue(this.elem, time) };
            return this }, hide: function(duration, easing, callback) {
            var elem = this.elem;
            if (duration) { this.custom(function() {
                    return $.fxAttrs('hide', 0) }, duration, easing, callback) } else { elem.style.display = 'none' };
            return this }, slideDown: function(duration, easing, callback) { this.custom(function() {
                return $.fxAttrs('show', 1) }, duration, easing, callback);
            return this }, slideUp: function(duration, easing, callback) { this.custom(function() {
                return $.fxAttrs('hide', 1) }, duration, easing, callback);
            return this }, slideToggle: function(duration, easing, callback) {
            var elem = this.elem;
            $.getStyle(elem, 'display') === 'none' ? this.slideDown(duration, easing, callback) : this.slideUp(duration, easing, callback);
            return this }, fadeIn: function(duration, easing, callback) { this.custom(function() {
                return $.fxAttrs('show', 2) }, duration, easing, callback);
            return this }, fadeOut: function(duration, easing, callback) { this.custom(function() {
                return $.fxAttrs('hide', 2) }, duration, easing, callback);
            return this }, fadeToggle: function(duration, easing, callback) {
            var elem = this.elem;
            $.getStyle(elem, 'display') === 'none' ? this.fadeIn(duration, easing, callback) : this.fadeOut(duration, easing, callback);
            return this } };
    win.animate = animate })(window, document);
