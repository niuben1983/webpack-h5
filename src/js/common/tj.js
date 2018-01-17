"use strict";

//微信分享config
function bd() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?df70900c8f4418178bfdb99afe8fc4a3";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
}
function maq() {
    window['_maq'] = window['_maq'] || [];
    window['_maq'].push(['_setAccount', 'xyauto']);

    var ma = document.createElement('script');
    ma.type = 'text/javascript';
    ma.async = true;
    ma.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'www.qchannel03.cn/m.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ma, s);
}
function xy() {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = "http://static.qcdqcdn.com/js/xy.js?ver=1.0";
    var firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(s, firstScript);
}
function stat() {
    bd();
    maq();
    xy();
}

function bdtag(track) {
    let tag = track.split('_');
    try {
        _hmt.push(['_trackEvent', track, tag[0], tag[1], tag[2] || '', tag[3] || '']);
        console.log(tag[2] || '');
    } catch (e) {
        console.log(e)
    }
};

export {
    stat, bdtag
};



