import './css/css.css';
import { shareToQZone, shareToSinaWeiBo } from './share';
import nativeShareFn from './nativeShare';


var curl = encodeURIComponent(location.href.split('#')[0]);
var getSignatureApi = 'https://m.api.qichedaquan.com/thirdpart/weixin/tokenizer?';
var shareConfig = {
    'title': '',
    'desc': '',
    'link': '',
    'showShare': '',
    'imgurl': '',
    'width': '',
    'height': ''
};
var getShareConfig = (function () {
    if (typeof (shareConfigForPage) == "undefined") {//判断页面中是否有分享的全局变量
        shareConfig.title = document.title;
        shareConfig.link = 'http://h5.qichedaquan.com/';
        shareConfig.desc = document.title;
        shareConfig.imgurl = 'http://jsx.qichedaquan.com/h5/img/logo2.png';
        shareConfig.showShare = '';
        shareConfig.width = '';
        shareConfig.height = '';
    } else {

        if (shareConfigForPage.link.indexOf('?') > 0) {
            shareConfigForPage.link += '&utm_source=webshare&utm_campaign=m'
        } else {
            shareConfigForPage.link += '?utm_source=webshare&utm_campaign=m'
        }
        $.extend(shareConfig, shareConfigForPage);
    };
})();

var browser = {
    versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        var ua = navigator.userAgent.toLowerCase();
        return {
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
            qq: u.match(/\sQQ/i) == "qq", //是否QQ
            isweixin: ua.match(/MicroMessenger/i) == "micromessenger",
            safari: u.toLowerCase().indexOf("safari") > 0,
            qqbrowser: u.indexOf('QQBrowser') > 0,
            ucbrowser: u.indexOf('UCBrowser') > 0,
            baidubrowser: u.indexOf('baidubrowser') > 0,//baidu
            qhbrowser: u.indexOf('QHBrowser') > 0//360
        };
    }()
};
var nativeShare = new nativeShareFn('share_box', shareConfig);
//微信分享config
//http://172.16.0.102:11300 http://m.api.qichedaquan.com
function wxConfig(success) {
    $.ajax({
        url: location.protocol + '//m.api.qichedaquan.com/thirdpart/weixin/tokenizer?curl=' + encodeURIComponent(location.href.split('#')[0]),
        data: {
            app_id: '5d81db99484c0019cab240b3d04e9a4a'
        },
        dataType: 'jsonp',
        jsonp: 'callback',
        success: function (res) {
            if (res.code === 10000) {
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
                success && success()
            }
        }
    })
};
function wxShare(opt) {
    var _opt = {}
    _opt.title = opt.title || document.title
    _opt.desc = opt.desc || document.title
    _opt.link = opt.link || window.location.href
    _opt.imgUrl = opt.imgurl || 'http://jsx.qichedaquan.com/h5/img/logo2.png';
    if (window.wx) {
        wx.ready(function () {
            wx.onMenuShareTimeline(_opt);
            wx.onMenuShareAppMessage(_opt);
            wx.onMenuShareQQ(_opt);
            wx.onMenuShareQZone(_opt);
        })
    }
};

function shareInit() {
    // 判断当前是否是移动端打开
    if (browser.versions.mobile) {

        init();

        if (nativeShare.isSupport()) {//uc 或者 qq 中打开(不区分 移动端设备是ios或者android)
            nativeShare.render();
            $('.share_box').on('click', '.nativeShare', function () {
                $('.zsh_cancel,.cancel_p').trigger('click');
                bdtag(this);
            });
            return;
        } else if (browser.versions.weixin) {// 微信中打开
            //browser.versions.weixin
            var html = '<div class="weixin fl"  style="width:20%"><a href="javascript:void(0)" class="js_weixin_share" bdtag="share_wechat_clicked" ><img src="http://static.qcdqcdn.com/wap/img/wx.png"> <p>微信</p></a></div><div class="friend fl" style="width:20%"><a href="javascript:void(0)" class="js_weixin_f_share" bdtag="share_moments_clicked"><img src="http://static.qcdqcdn.com/wap/img/pyq.png"><p>朋友圈</p></a></div><div class="qq fl" style="width:20%"><a href="javascript:void(0)" class="js_weixin_qq_share" bdtag="share_qq_clicked"><img src="http://static.qcdqcdn.com/wap/img/qq.png"><p>QQ</p></a></div><div class="weibo fl" style="width:20%"><a href="javascript:void(0)" class="js_weibo_share" bdtag="share_weibo_clicked"><img src="http://static.qcdqcdn.com/wap/img/wb.png"><p>微博</p></a></div><div class="kj fl" style="width:20%"><a href="javascript:void(0)" class="js_kj_share" bdtag="share_qzone_clicked"><img src="http://static.qcdqcdn.com/wap/img/kj.png"><p>QQ空间</p></a></div>';
            $('.share_box ').html(html);
            wxConfig();
            wxShare(shareConfig);
            shareInweixinHint();
            shareF();
            shareFf(true);
            return;
        } else if (browser.versions.android) {//一般android中打开
            var html = '<div class="weibo fl" style="width:50%;text-align:center;"><a href="javascript:void(0)" class="js_weibo_share" style="margin-left:1.15rem; width:1.17rem;display:inline-block" bdtag="share_weibo_clicked"><img src="http://static.qcdqcdn.com/wap/img/wb.png"><p>微博</p></a></div><div class="kj fl" style="width:50%;text-align:center "><a href="javascript:void(0)" class="js_kj_share" style="margin-right:1.15rem;width:1.4rem;display:inline-block" bdtag="share_qzone_clicked"><img src="http://static.qcdqcdn.com/wap/img/kj.png"><p>QQ空间</p></a></div>';
            $('.share_box ').html(html);
            shareF();
            shareFs();
            return;
        } else if ((browser.versions.iPhone || browser.versions.iPad) && !browser.versions.baidubrowser && !browser.versions.qhbrowser) {//iPhone中打开
            var html = '<div class="weixin fl"><a href="javascript:void(0)" class="js_weixin_share" bdtag="share_wechat_clicked"><img src="http://static.qcdqcdn.com/wap/img/wx.png"> <p>微信</p></a></div><div class="friend fl"><a href="javascript:void(0)" class="js_weixin_f_share" bdtag="share_moments_clicked"><img src="http://static.qcdqcdn.com/wap/img/pyq.png"><p>朋友圈</p></a></div><div class="weibo fl"><a href="javascript:void(0)" class="js_weibo_share" bdtag="share_weibo_clicked"><img src="http://static.qcdqcdn.com/wap/img/wb.png"><p>微博</p></a></div><div class="kj fl"><a href="javascript:void(0)" class="js_kj_share" bdtag="share_qzone_clicked"><img src="http://static.qcdqcdn.com/wap/img/kj.png"><p>QQ空间</p></a></div>';
            $('.share_box').html(html);
            shareWeixinOrFHint();
            shareF();
            shareFf(false);
            shareFs();
            return
        } else {//其他浏览器打开
            var html = '<div class="weibo fl" style="width:50%;text-align:center;"><a href="javascript:void(0)" class="js_weibo_share" style="margin-left:1.15rem; width:1.17rem;display:inline-block" bdtag="share_weibo_clicked"><img src="http://static.qcdqcdn.com/wap/img/wb.png"><p>微博</p></a></div><div class="kj fl" style="width:50%;text-align:center "><a href="javascript:void(0)" class="js_kj_share" style="margin-right:1.15rem;width:1.4rem;display:inline-block" bdtag="share_qzone_clicked"><img src="http://static.qcdqcdn.com/wap/img/kj.png"><p>QQ空间</p></a></div>';
            $('.share_box ').html(html);
            shareF()
            shareFs()
        }
    }
}
//初始化分享ｄｏｍ
function init() {
    var temp = '<div class="zsh_shareLayer" id="shareLayer"><div class="share_box clearfix"></div><button type="button" class="zsh_cancel">取消</button></div>';

    if ($('#shareLayer').length < 1) {
        $('body').append(temp);
    }
    $('#shareLayer .zsh_cancel').on('click', function () {
        shareHide();
    });

}

// 在微信中打开  分享提示
function shareInweixinHint() {
    var div = $('<div class="share_mark"></div>');
    var weixin_hint = $('<div class="weixin_hint"></div>');
    var p = $('<p>点击&nbsp;<span>•</span><span style="margin: 0px 2px">•</span><span>•</span>&nbsp;即可将内容"发送给朋友"或者"分享到朋友圈"</p>');
    var img = $('<img src="http://static.qcdqcdn.com/wap/img/popo.png" class="po-a">');
    var share_markCss = {
        'display': 'none',
        'position': 'fixed',
        'top': '0',
        'left': '0',
        'z-index': '999',
        '-webkit-box-sizing': 'border-box',
        'box-sizing': 'border-box',
        'width': '100%',
        'height': '100%',
        'padding-bottom': '95px',
        'background': 'rgba(0, 0, 0, 0.6)'
    };
    var weixin_hint_css = {
        'width': '62%',
        'padding': '0.533rem 0.667rem',
        'position': 'fixed',
        'top': '0.333rem',
        'right': '0.267rem',
        'background-color': '#fff',
        'border-radius': '8px',
        'color': '#a4a4a4',
        'z-index': '1000'
    }
    var img_css = {
        'top': '-0.28rem',
        'right': '0.387rem'
    }
    var fontSize = '12x';
    var dpr = $('html').attr('data-dpr');
    if (dpr == 1) {
        fontSize = '13px'
    } else if (dpr == 2) {
        fontSize = '24x'
    } else if (dpr == 3) {
        fontSize = '36x'
    };
    div.css(share_markCss)
    weixin_hint.css(weixin_hint_css)
    weixin_hint.css('font-size', fontSize)
    img.css(img_css);
    weixin_hint.append(p).append(img);
    div.append(weixin_hint)
    $('body').append(div);
    bindEvent();
    function bindEvent() {
        $('.share_mark ').on('click', function () {
            $('.share_mark').css('display', 'none');
            $('.zsh_cancel,.cancel_p').trigger('click');
        })
    }
}
//safari中打开  分享到微信提示
function shareWeixinOrFHint() {
    var fontSize = '12x';
    var dpr = $('html').attr('data-dpr');
    if (dpr == 1) {
        fontSize = '12px'
    } else if (dpr == 2) {
        fontSize = '24x'
    } else if (dpr == 3) {
        fontSize = '36x'
    };
    var div = $('<div class="share_mark"></div>');
    var hint_img = $('<div class="hint_img"></div>');
    var cancel_btn = $('<div class="cancel_btn">我知道了</div>');
    var share_markCss = {
        'display': 'none',
        'position': 'fixed',
        'top': '0',
        'left': '0',
        'z-index': '999',
        '-webkit-box-sizing': 'border-box',
        'box-sizing': 'border-box',
        'width': '100%',
        'height': '100%',
        'background': 'rgba(0, 0, 0, 0.6)'
    };
    var hint_imgCss = {
        'width': '100%',
        'height': '100%',
        'background': 'url("http://static.qcdqcdn.com/wap/img/init-share.png") no-repeat center',
        'background-size': 'contain'
    };
    var cancel_btnCss = {
        'position': 'absolute',
        'bottom': '0',
        'left': '0',
        'width': '100%',
        'background-color': '#fff',
        'font-size': '24px',
        'padding': ' 0.427rem 0',
        'text-align': 'center'
    };
    div.css(share_markCss);
    hint_img.css(hint_imgCss);
    cancel_btn.css(cancel_btnCss).css('font-size', fontSize);
    div.append(hint_img).append(cancel_btn);
    $('body').append(div);
    //'我知道了按钮'注册点击事件
    bindEvent()
    function bindEvent() {
        $('.share_mark .cancel_btn').on('click', function () {
            $('.share_mark').css('display', 'none');
            $('.zsh_cancel,.cancel_p').trigger('click');
        })
        $('.share_mark ').on('click', function () {
            $('.share_mark').css('display', 'none');
            $('.zsh_cancel,.cancel_p').trigger('click');
        })
    }
}
// 微信中打开   微信 微信朋友圈 分享点击事件
function shareFf(flag) {
    // 微信分享
    $('.js_weixin_share').on('click', function () {
        $('.share_mark').css('display', 'block');

        bdtag(this)
    });
    // 微信朋友圈分享点击事件
    $('.js_weixin_f_share').on('click', function () {
        $('.share_mark').css('display', 'block');
        bdtag(this)
    });
    $('.js_weixin_qq_share').on('click', function () {
        $('.share_mark').css('display', 'block');
        bdtag(this)
    });
    $('.js_weixin_qq_share').on('click', function () {
        $('.share_mark').css('display', 'block');
        bdtag(this)
    });
    if (flag) {
        $('.js_kj_share').on('click', function () {
            $('.share_mark').css('display', 'block');
            bdtag(this)
        })
    }
};
function shareFs() {//分享到QQ空间
    $('.js_kj_share').on('click', function () {
        bdtag(this);
        shareToQZone(shareConfig.link, shareConfig.title, shareConfig.desc, shareConfig.imgurl);
    });
}
function shareF() {//分享到新浪微博
    $('.js_weibo_share').on('click', function () {
        bdtag(this);
        shareToSinaWeiBo(shareConfig.link, shareConfig.title, shareConfig.desc, shareConfig.imgurl);
    });
};
function setShareConfig(opt) {
    var _opt = opt;
    nativeShare.config(_opt);
    wxShare(_opt);
}
function shareShow() {
    $('#shareLayer').css('bottom', 0);
}
function shareHide() {
    $('#shareLayer').animate({
        'bottom': '-100%'
    }, 300);
}
export {
    shareInit,
    setShareConfig,
    shareShow,
    shareHide
}


window.bdtag = function (ele) {
    // var _ele = ele;
    // var label = $(_ele).attr('bdtag')
    // var tag = label.split('_')
    // var action = tag.splice(tag.length-1,1)[0]
    // var opt_label = tag.splice(tag.length-1)[0];
    // try{ 
    //     _hmt.push(['_trackEvent', tag.join('_'), action, opt_label]);
    // }catch(e){
    //     console.log(e)
    // }
}