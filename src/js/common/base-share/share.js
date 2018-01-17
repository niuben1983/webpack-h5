 /**
 * Created by dongbo on 2017/2/25.
 */
function shareToSinaWeiBo(url, title, content, pic) {
    var img = pic || '';
    console.log(img)
    var urlx = "http://v.t.sina.com.cn/share/share.php?c=&url="+ encodeURIComponent(url) + "&pic="
        + img + "&type=1" + "&title=" + encodeURIComponent(title+'   分享至@行圆汽车大全' ) + '&content='+ encodeURIComponent(content) + "&rnd=" + new Date().valueOf();
    window.open(urlx);
}
// 分享到qq空间 ico_qzone.gif
function shareToQZone(url, title, content, pic) {
    var urlx = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title="
        + encodeURIComponent(title) + "&url=" + encodeURIComponent(url) + "&summary=" + encodeURIComponent(content)+'&pics='+ encodeURIComponent(pic);
    window.open(urlx);
}
export {
    shareToQZone,
    shareToSinaWeiBo
}