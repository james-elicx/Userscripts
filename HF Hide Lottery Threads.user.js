// ==UserScript==
// @name         HF Hide Lottery Threads
// @author       James
// @description  Hide threads for lotteries in the HF Byte Games section. Based off of tBlock Revived.
// @include      *hackforums.net/forumdisplay.php?fid=415*
// @version      0.0.1
// @updateURL    https://github.com/moodiest/Userscripts/raw/master/HF%20Hide%20Lottery%20Threads.user.js
// @downloadURL  https://github.com/moodiest/Userscripts/raw/master/HF%20Hide%20Lottery%20Threads.user.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// ==/UserScript==
//
// ------- CHANGE LOG -------
// Initial release.
// ---------------------------

var debug = true;

var main = function () {
    $(function () {
        removeThreads();
    });
};

function log(message) {
    if (debug) {
        console.log(`[Hide lottery threads] ${message}`);
    }
}

function removeThreads() {
	var threads = $(`span[id^="tid_"]`);
    var threadsRemoveCount = 0;

    threads.each(function (index, thread) {
        var threadName = $(thread).find(`a`).text().toLowerCase();

		if (threadName.includes(`lottery`) || threadName.includes(`lotto`) ||
			((threadName.includes(`buy`) || threadName.includes(`win`)) && threadName.includes(`egg`)) ||
			(threadName.includes(`get`) && threadName.includes(`egg`) && threadName.includes(`now`)) ||
			((threadName.includes(`ruby`) || threadName.includes(`emerald`)) && (threadName.includes(`win`) || threadName.includes(`buy`)))
		   ) {
			var threadElement = $(thread).parentsUntil($(`tbody`), `tr`);
			threadElement.remove();
			threadsRemoveCount++;
			return;
		}
		else {
			return;
		}
		log(`Removed ${threadsRemovedCount} threads`);
    });
}

main();
