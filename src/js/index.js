
import A from "./_a.js";
import { shareInit, setShareConfig, shareShow } from "./common/base-share/index";
import '../css/base.css';
import '../css/index.css';


// const config = CONFIG;
// const { length: len } = [1, 2, 3];
// const arr = [1, 2, 3];
// const arr1 = [...arr];
// arr.push(4);


// [[1, 2], [3, 4]].map(([a, b]) => console.log(a + b));

// a();
// console.info('this is index', config.PUBLICPATH);

const [a, b] = [[1, 2], [3, 4]];

console.info(a, '𠮷'.at(0))

$(function () {
    let shareConfigForPage = {
        title: 'dfg'
    };

    setShareConfig(shareConfigForPage);
    shareInit();

    $('.js_change').on('click', function () {
        setShareConfig({
            title: 'sdfsdf'
        });
    });
});


$(document).on('click', '.js_share', function (event) {
    event.preventDefault();
    shareShow();
});



