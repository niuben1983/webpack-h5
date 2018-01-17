"use strict";

import jsonp from './jsonp.js';

function BaseWxSahre(opt) {
    let shareConfigForPage = opt || {
        title: '深夜，小姨子突然发来私照 ...',
        desc: '结果我没想到！',
        imgUrl: 'http://static.qcdqcdn.com/special/sizhao/img/share_pic.jpg',
        link: 'http://hd.qichedaquan.com/sizhao/index.html?shareback=' + Math.random(),
        success: () => {
            // location.href = 'http://hd.qichedaquan.com/sizhao/index.html?v='+Math.random()
        }
    };

    //微信分享
    wxConfig(() => {
        wxShare(shareConfigForPage);
    });

}

//微信分享config
function wxConfig(success) {
    let url = location.protocol + '//m.api.qichedaquan.com/thirdpart/weixin/tokenizer?curl=' + encodeURIComponent(location.href.split('#')[0]);
    let data = { "app_id": '5d81db99484c0019cab240b3d04e9a4a' };
    $.ajax({
        url: url,
        data: data,
        dataType: 'jsonp',
        jsonp: 'callback',
        success: function (res) {
            if (res.code === 10000) {
                //alert(res.data.url)
                var c = res.data;
                wx.config({
                    // debug: true,
                    appId: c.appId,
                    timestamp: c.timeStamp,
                    nonceStr: c.nonceStr,
                    signature: c.signature,
                    jsApiList: [
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'onMenuShareQZone',
                        'openLocation',
                        'getLocation'
                    ]
                });
                success && success();
            }
        }
    });
}

function wxShare(opt) {
    if (window.wx) {
        wx.ready(function () {
            wx.onMenuShareTimeline(opt);
            wx.onMenuShareAppMessage(opt);
            wx.onMenuShareQQ(opt);
            wx.onMenuShareQZone(opt);
        })
    }
}

export {
    BaseWxSahre,
    wxConfig,
    wxShare
}


