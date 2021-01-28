// ==UserScript==
// @name        青果教务系统辅助脚本
// @namespace   Violentmonkey Scripts
// @downloadUrl https://cdn.jsdelivr.net/gh/xjfnet/UserScript/青果教务系统辅助脚本.user.js
// @match       http*://58.51.106.66:9301/*
// @match       http*://172.18.254.16/*
// @require     https://cdn.jsdelivr.net/gh/xjfnet/UserScript/assets/easyui/jquery.min.js
// @require     https://cdn.jsdelivr.net/gh/xjfnet/UserScript/assets/easyui/jquery.easyui.min.js
// @require     https://gitee.com/QQ56188788/user-script/raw/master/assets/js.cookie.js
// @require     https://gitee.com/QQ56188788/user-script/raw/master/assets/xlsx/xlsx.full.min.js
// @require     https://gitee.com/QQ56188788/user-script/raw/master/assets/tippy/popper.min.js
// @require     https://gitee.com/QQ56188788/user-script/raw/master/assets/tippy/tippy-bundle.umd.min.js
// @grant       GM_getResourceText
// @version     1.70
// @author      夏剑峰
// @description 青果教务系统辅助功能：成绩模板导出，成绩导入，按姓名导入综合成功
// ==/UserScript==

(async function ($) {
    "use strict"

    if (location.pathname == '/_data/login_home.aspx') {

    }
    else if (location.pathname == "/XSCJ/Tea_KCCJLR_add_temp.aspx") {
        window.moveTo(0, 0);
        window.resizeTo(screen.availWidth, screen.availHeight);
        $('form').css({ margin: 0 });

    } else if (location.pathname == "aaaaa") {
    }
})(jQuery)