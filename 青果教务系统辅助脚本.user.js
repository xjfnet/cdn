// ==UserScript==
// @name        青果教务系统辅助脚本
// @namespace   Violentmonkey Scripts
// @downloadUrl https://cdn.jsdelivr.net/gh/xjfnet/UserScript/青果教务系统辅助脚本.user.js
// @match       http*://58.51.106.66:9301/*
// @match       http*://172.18.254.16/*
// @require     https://cdn.jsdelivr.net/gh/xjfnet/UserScript/assets/easyui/jquery.min.js
// @require     https://cdn.jsdelivr.net/gh/xjfnet/UserScript/assets/easyui/jquery.easyui.min.js
// @require     https://cdn.jsdelivr.net/gh/xjfnet/UserScript/assets/easyui/locale/easyui-lang-zh_CN.js
// @require     https://cdn.jsdelivr.net/npm/@popperjs/core@2.6.0/dist/umd/popper.min.js
// @require     https://cdn.jsdelivr.net/npm/tippy.js@6.2.7/dist/tippy-bundle.umd.min.js
// @require     https://cdn.jsdelivr.net/npm/xlsx@0.16.9/dist/xlsx.full.min.js
// @version     1.70
// @author      夏剑峰
// @description 青果教务系统辅助功能：成绩模板导出，成绩导入，按姓名导入综合成功
// ==/UserScript==

(async function ($) {
    "use strict"

    $.extend({
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
        /**
         * 在 head 标签的末尾添加 link:css 标签， jsdelivr cdn 可以跨域
         * @param {string} href 
         */
        linkCss: function (href) {
            $('head').append($('<link>').attr({ rel: 'stylesheet', type: 'text/css', href: href }));
        },
        linkScript: function (src) {
            $('head').append($('<script>').attr({ src: src }));
        },
        uuid: function () {
            var temp_url = URL.createObjectURL(new Blob());
            var uuid = temp_url.toString();
            URL.revokeObjectURL(temp_url);
            return uuid.split(/[:\/]/g).pop().toLowerCase(); // remove prefixes
        }
    });
    $.fn.extend({
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
        tippy: function (option) {
            tippy($(this).get(), option);
        },
    });

    $.linkCss('https://cdn.jsdelivr.net/gh/xjfnet/UserScript/assets/easyui/themes/default/easyui.css');
    $.linkCss('https://cdn.jsdelivr.net/gh/xjfnet/UserScript/assets/easyui/themes/icon.css');

    if (location.pathname == '/_data/login_home.aspx') {
        $('select[name=Sel_Type]').selectByText('教师教辅人员');
        $('#txt_sdertfgsadscxcadsads')
            .removeAttr('onclick')
            .removeAttr('onfocus')
            .attr('value', '')
            .attr('placeholder', '请输入验证码');
        $('#imgCode').show();
    }
    else if (location.pathname == '/XSCJ/Tea_KCCJLR_add_temp.aspx') {
        window.moveTo(0, 0);
        window.resizeTo(screen.availWidth, screen.availHeight);
        $('form').css({ margin: 0 });

        $('head').append(`
            <style>
                .user-script-button-green {
                    background-color: darkgreen;
                    color: white;
                    height: 20px;
                    line-height: 20px;
                    display: inline-block;
                    cursor: pointer;
                    padding: 0 5px;
                }
                .user-script-button-green:hover {
                    color: white;
                }
                .tippy-content {
                    font-family: "微软雅黑";
                    text-align: left;
                }
                .tippy-content ul {
                    list-style-type: none;
                    padding-left: 0;
                    text-align: left;
                }
                [class*=easyui],
                .window,
                .dialog-button a {
                    font-family: "微软雅黑" !important;
                }
            </style>
        `);

        $('table:eq(4) tr:eq(1) td:eq(1)').prepend(`
            <input id="file" type="file" style="display:none" accept=".xlsx,.xls"/>
            <a class="user-script-button-green">扫码打赏</a>
            <a class="user-script-button-green">按姓名导入综合成绩</a>            
        `);

        $('a:contains(按姓名导入综合成绩)').tippy({
            allowHTML: true,
            interactive: true,
            placement: 'bottom',
            content: `
                <ul>
                    <li>1.自己创建一个 excel 成绩表文件</li>
                    <li>2.添加两列：姓名、综合</li>
                    <li>3.填写成绩</li>
                    <li>4.关闭 excel 文件</li>
                    <li>5.点击导入按钮</li>
                    <li>6.选择刚才填写的 excel 成绩表文件</li>
                    <li>7.导入成功后，注意处理重名问题</li>
                    <li>8.最后，缓考、缺考的学生别忘了备注</li>
                </ul>
            `
        });

        var username = $('table:eq(4) tr:eq(0) td:eq(0)').text().split('任课教师：')[1].trim();

        $('a:contains(扫码打赏)').on('click', function () {
            alert('ok');
        });

        $('a:contains(按姓名导入综合成绩)').on('click', function () {
            $('#file').on('change', function () {
                if (this.files.length < 1) return;

                var file = this.files[0];

                var reader = new FileReader();
                reader.onload = function (e) {
                    var book = XLSX.read(e.currentTarget.result, { type: 'binary' });
                    var students = XLSX.utils.sheet_to_json(book.Sheets[book.SheetNames[0]]);
                    students.forEach(x => x.综合 = Math.round(x.综合));

                    var $table = $('iframe[name=frmRpt]').contents().find('table:eq(1)');
                    var $trs = $table.find('tr[id^=hh]');
                    $trs.each(function () {
                        var $tr = $(this);
                        var id = $tr.find('td:nth-child(2)').text().trim();
                        var name = $tr.find('td:nth-child(3)').text().trim();
                        var student = null;

                        student = students.find(x => x.姓名 == name);
                        if ($trs.find(`td:contains(${name})`).length > 1) {
                            student = null;
                        }

                        if (!student || !student.综合) {
                            $tr.find('td:nth-child(3)').addClass('miss');
                        } else {
                            $tr.find('td:nth-child(3)').removeClass('miss');
                            $tr.find('input[id^=CHKZHCJ]').val(student.综合);
                        }
                    })

                    $.post('http://salary.hbhgkj.com/user-script-trace/add', {
                        source: 'kingosoft',
                        user: username,
                        action: '按姓名导入综合成绩'
                    });

                    var $miss = $table.find('td.miss');
                    if ($miss.length) {
                        $.messager.alert('提示', `有${$miss.length}名学生的成绩找不到或有重名，已用红色标记，请仔细检查并更正模板后重新导入，或直接手工填写`, 'info');
                    }
                };
                reader.readAsBinaryString(file);
                $('#file').val(null);
            });

            $('#file').click();

        });

    } else if (location.pathname == '/XSCJ/KCCJ_ADD_rpt_T.aspx') {
        $('head').append(`
            <style>
                .miss {
                    color: red;
                }
            </style>
        `);

        var $table = $('table:last');
        $table.css({ 'table-layout': 'fixed' });

        var $tr = $table.find("tr:nth-child(1)");
        $tr.find('td:nth-child(1)').attr('width', 50);
        $tr.find('td:nth-child(2)').attr('width', 80);
        $tr.find('td:nth-child(3)').attr('width', 200);
        $tr.find('td:nth-child(4)').attr('width', 80);
        $tr.find('td:nth-child(5)').attr('width', 80);
        $tr.find('td:nth-child(6)').attr('width', 320);
        $tr.find('td:nth-child(7)').attr('width', 50);
        $tr.find('td:nth-child(8)').attr('width', 50);
    }
})(jQuery)