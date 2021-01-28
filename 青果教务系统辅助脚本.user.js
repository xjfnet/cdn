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

    jQuery.extend({
        waitUntil: function waitUntil(predicate, timeout, interval) {
            var timerInterval = interval || 50;
            var timerTimeout = timeout || 1000 * 60 * 5;

            return new Promise(function promiseCallback(resolve, reject) {
                var timer;
                var timeoutTimer;
                var clearTimers;
                var doStep;

                clearTimers = function clearWaitTimers() {
                    clearTimeout(timeoutTimer);
                    clearInterval(timer);
                };

                doStep = function doTimerStep() {
                    var result;

                    try {
                        result = predicate();

                        if (result) {
                            clearTimers();
                            resolve(result);
                        } else {
                            timer = setTimeout(doStep, timerInterval);
                        }
                    } catch (e) {
                        clearTimers();
                        reject(e);
                    }
                };

                timer = setTimeout(doStep, timerInterval);
                timeoutTimer = setTimeout(function onTimeout() {
                    clearTimers();
                    reject(new Error('Timed out after waiting for ' + timerTimeout + 'ms'));
                }, timerTimeout);
            });
        },
    });
    jQuery.fn.extend({
        waitUntilExists: function (timeout, interval) {
            var context = this.context;
            var selector = this.selector;
            return jQuery.waitUntil(function () {
                return !!jQuery(selector, context).length;
            });
        },
        selectByText: function (text) {
            $(this).find('option').each(function () {
                if ($(this).text().includes(text)) {
                    this.selected = true;
                    return false;
                }
            });
        },
        selectByValue: function (value) {
            $(this).find('option').each(function () {
                if ($(this).val().includes(value)) {
                    this.selected = true;
                    return false;
                }
            });
        },
    });

    if (location.pathname == '/_data/login_home.aspx') {
        $('select[name=Sel_Type]').selectByText('教师教辅人员');
    }
    else if (location.pathname == "/XSCJ/Tea_KCCJLR_add_temp.aspx") {
        window.moveTo(0, 0);
        window.resizeTo(screen.availWidth, screen.availHeight);
        $('form').css({ margin: 0 });

    } else if (location.pathname == "aaaaa") {
    }
})(jQuery)