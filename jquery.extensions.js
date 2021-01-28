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
