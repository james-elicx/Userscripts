// ==UserScript==
// @name         HF tBlock Revived
// @author       James, Mr. Trvp
// @description  Blacklists unwanted threads and sections from ever being shown. Revived and updated by James for the current HF and originally by Mr. Trvp.
// @include      *hackforums.net/*
// @version      0.0.2
// @updateURL    https://github.com/moodiest/Userscripts/raw/master/HF%20tBlock%20Revived.user.js
// @downloadURL  https://github.com/moodiest/Userscripts/raw/master/HF%20tBlock%20Revived.user.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        GM_info
// @require      https://userscripts-mirror.org/scripts/source/107941.user.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @resource     ContentTemplate https://raw.githubusercontent.com/moodiest/Userscripts/master/tBlock%20Revived/contentTemplate.html
// @resource     SectionTemplate https://raw.githubusercontent.com/moodiest/Userscripts/master/tBlock%20Revived/sectionTemplate.html
// @resource     RowTemplate https://raw.githubusercontent.com/moodiest/Userscripts/master/tBlock%20Revived/rowTemplate.html
// ==/UserScript==
//
// ------- CHANGE LOG -------
// Initial release.
// ---------------------------

var debug = true;

var contentTemplate = GM_getResourceText('ContentTemplate');
var sectionTemplate = GM_getResourceText('SectionTemplate');
var rowTemplate = GM_getResourceText('RowTemplate');

var main = function () {
    $(function () {
        initializeConfig();

        addBlockedToNavigation();

        applyForumMods();
    });
};

// Start global functions //

String.prototype.contains = function (value) {
    return (this.indexOf(value) >= 0);
};

Array.prototype.contains = function (value) {
    return (this.indexOf(value) >= 0);
};

function log(message) {
    if (debug) {
        console.log('[tBlock Revived] ' + message);
    }
}

// End global functions //

function initializeConfig() {
    log('Initializing config...');

    var forums = GM_SuperValue.get('forums', {});
    GM_SuperValue.set('forums', forums);

    var threads = GM_SuperValue.get('threads', {});
    GM_SuperValue.set('threads', threads);

    var users = GM_SuperValue.get('users', {});
    GM_SuperValue.set('users', users);
}

// Start settings //

function addBlockedToNavigation() {
    log('Adding blocked link to links...');


    let toggleTopbarSettingsBtnCurrVal = GM_SuperValue.get("toggleTopbarSettingsBtnTextBool", false);
    if (toggleTopbarSettingsBtnCurrVal) {
        let settingsHtml = `<li><a href="http://hackforums.net/tBlock.php" id="tBlock_blocked" title="tBlock Revived" data-tag="tBlock Revived" data-tooltip="tBlock Revived"><i class="fa fa-ban fa-lg" aria-hidden="true"></i></a></li>`

        $(document.querySelector(`ul.menu.user_links`)).prepend(settingsHtml);
    }

    try {
        let panelLinks = document.querySelector(".panel_links");
        let userOptionsList = panelLinks.querySelectorAll(".button-dropdown")[0];
        let userOptionsListContent = userOptionsList.querySelectorAll(".dropdown-menu")[0];

        // Lynx's Raffle Site
        $(userOptionsListContent).append(`<li style="display: block; padding: 8px 0px;"><a href="https://hackforums.net/tBlock.php" class="usercp" title="tBlock Revived"><i class="fa fa-ban fa-lg" aria-hidden="true"></i><span style="font-size: 15px; color: #efefef;">tBlock Revived</span></a></li>`);
    }
    catch (e) {
        return;
    }
}

// End settings //


// Start Blacklisting //

function applyForumMods() {
    var term = '';
    if (document.URL.contains('search.php')) {
        term = 'search';
    }
    else if (document.URL.contains('member.php?action=profile')) {
        term = 'user';
    }
    else if (document.URL.contains('forumdisplay.php')) {
        term = 'forum';
    }
    else if (document.URL.contains('showthread.php')) {
        term = 'thread';
    }
    else if (document.URL.contains('tBlock.php')) {
        initializetBlockPage();
        return;
    }

    log('Applying forum mods...');
    addBlacklistLink(term);
    removeBlacklisted(term);
}

function addBlacklistLink(term) {
    if (term === 'search') {
        return;
    }

    var items = GM_SuperValue.get(term + 's', {});

    if (term === "user") {
        let popularityBtn = document.querySelector("div.pro-adv-card > div > a[data-tooltip='Popularity']").getAttribute("href");
        let id = popularityBtn.split('=')[1];

        let blacklisted = (id in items);
        let blacklistTerm = getBlacklistTerm(blacklisted);

        let blacklistHtml = `<div><a href="javascript:void(0);" id="blacklister" title="${blacklistTerm} user"><i class="fa fa-ban" aria-hidden="true" style="margin-right: 10px; color: #797979;"></i>${blacklistTerm} user</a></div>`;

        let blacklistElement = document.querySelector("div.pro-adv-card-dotoptions");
        $(blacklistElement).append(blacklistHtml);

        $('#blacklister').on('click', function (event) {
            addToBlacklistCallback(term, blacklistTerm.toLowerCase(), id);
        });
    }
    else if (term === "thread") {
        let optionsPopup = document.querySelectorAll("div#thread_modes_popup.popup_menu > div.popup_item_container > a.popup_item");
        let newReplyBtn = optionsPopup[optionsPopup.length - 1].getAttribute("href");
        let id = newReplyBtn.split('=')[1];

        let blacklisted = (id in items);
        let blacklistTerm = getBlacklistTerm(blacklisted);

        let blacklistHtml = `<a href="javascript:void(0);" id="blacklister" title="${blacklistTerm} thread" rel="nofollow" ><i class="fa fa-ban oc-hf-icon fa-lg" style="margin-right: 9px;"></i></a>`;

        let blacklistElement = document.querySelector("table.tborder.clear > tbody > tr > td.thead > div.float_right > span.smalltext > strong");
        $(blacklistElement).prepend(blacklistHtml);

        $('#blacklister').on('click', function (event) {
            addToBlacklistCallback(term, blacklistTerm.toLowerCase(), id);
        });
    }
    else if (term === "forum") {
        try {
            let postThreadBtn = document.querySelector("a.button.new_thread_button").getAttribute("href");
            let id = postThreadBtn.split('=')[1];

            let blacklisted = (id in items);
            let blacklistTerm = getBlacklistTerm(blacklisted);

            let blacklistHtml = `<a href="javascript:void(0);" id="blacklister" title="${blacklistTerm} forum" rel="nofollow"><i class="fa fa-ban oc-hf-icon fa-lg"></i></a>&nbsp;&nbsp;|&nbsp;&nbsp;`;

            let blacklistElement = document.querySelector("table.tborder.clear > tbody > tr > td.thead > div.float_right > span.smalltext > strong");
            $(blacklistElement).prepend(blacklistHtml);

            $('#blacklister').on('click', function (event) {
                addToBlacklistCallback(term, blacklistTerm.toLowerCase(), id);
            });
        }
        catch (e) {
            return;
        }



        let toggleSfThreadCurrVal = GM_SuperValue.get("toggleSfThreadTextBool", false);
        if (toggleSfThreadCurrVal) {
            let threadsList = document.querySelectorAll("table > tbody > tr.inline_row");
            threadsList.forEach(function (thread) {
                let threadTitle = thread.querySelector("span.subject_new");
                if (threadTitle === null) {
                    threadTitle = thread.querySelector("span.subject_old");
                }
                let threadTitleText = $(threadTitle).text();
                let threadID = $(threadTitle).attr('id').replace('tid_', '');

                let blacklisted = (threadID in items);
                let blacklistTerm = getBlacklistTerm(blacklisted);

                let threadBlackDiv = `<a href="javascript:void(0);" id="blacklister-${threadID}" title="${blacklistTerm} thread" rel="nofollow"><small style="font-weight:400; color: #8b8b8b;"> [${blacklistTerm}]</small></a>`;

                $(threadTitle).append(threadBlackDiv);

                threadBlackDiv = document.getElementById(`blacklister-${threadID}`);
                if(threadBlackDiv) {
                    threadBlackDiv.addEventListener ("click", function(){ addToBlacklistCallbackSFT("thread", blacklistTerm.toLowerCase(), threadID, threadTitleText); }, false);
                }
            });
        }
    }
}

function getBlacklistTerm(blacklisted) {
    if (blacklisted)
        return 'Unblacklist';
    else
        return 'Blacklist';
}

function addToBlacklistCallback(term, blacklistTerm, id) {
    var result = confirm(`Are you sure you want to ${blacklistTerm} this ${term}?`);

    if (!result) {
        return;
    }

    var items = GM_SuperValue.get(term + 's', {});
    var blacklisted = (id in items);
    if (blacklisted) {
        delete items[id];
    }
    else {
        log(term);

        if (term === 'user') {
            items[id] = $(`div.pro-adv-card > div > span.largetext > strong > span[class*='group']`).text();
        }
        else {
            items[id] = $('tbody > tr > td.thead > div > h1').text();
        }
    }

    //blacklistTerm = getBlacklistTerm(!blacklisted).toLowerCase();
    //$('#blacklister').text('[' + blacklistTerm + ']');

    GM_SuperValue.set(term + 's', items);

    logBlocked();
}

function addToBlacklistCallbackSFT(term, blacklistTerm, id, threadTitle) {
    var result = confirm(`Are you sure you want to ${blacklistTerm} this ${term}?`);

    if (!result) {
        return;
    }

    var items = GM_SuperValue.get(term + 's', {});
    var blacklisted = (id in items);
    if (blacklisted) {
        delete items[id];
    }
    else {
        log("thread");

        items[id] = threadTitle;
    }

    //blacklistTerm = getBlacklistTerm(!blacklisted).toLowerCase();
    //$('#blacklister').text('[' + blacklistTerm + ']');

    GM_SuperValue.set(term + 's', items);

    logBlocked();
}

function logBlocked() {
    var i = 0;
    for (var forum in GM_SuperValue.get('forums')) {
        i++;

        log('BLOCKED FID #' + i);
        log(forum);
    }

    log('TOTAL BLOCKED FORUMS: ' + (i + 1));

    i = 0;
    for (var thread in GM_SuperValue.get('threads')) {
        i++;

        log('BLOCKED TID #' + i);
        log(thread);
    }

    log('TOTAL BLOCKED THREADS: ' + (i + 1));

    i = 0;
    for (var user in GM_SuperValue.get('users')) {
        i++;

        log('BLOCKED USER #' + i);
        log(user);
    }

    log('TOTAL BLOCKED THREADS: ' + (i + 1));
}

function removeBlacklisted(term) {
    removeBlacklistedThreads(term);

    if (term === 'forum') {
        removeBlacklistedForumsFromForumDisplay();
    }
    else {
        removeBlacklistedForumsFromHome();
    }
}

function removeBlacklistedThreads(term) {
    var blockedForums = GM_SuperValue.get('forums');
    var blockedThreads = GM_SuperValue.get('threads');
    var blockedUsers = GM_SuperValue.get('users');

    var threadsSubjectOld = $('span.subject_old[id^="tid_"]');
    if (threadsSubjectOld.length === 0) {
        threadsSubjectOld = $('span > a.subject_old[id^="tid_"]');
    }
    var threadsSubjectNew = $('span.subject_new[id^="tid_"]');
    if (threadsSubjectNew.length === 0) {
        threadsSubjectNew = $('span > a.subject_new[id^="tid_"]');
    }

    var threadsRemoveCount = 0;
    threadsSubjectOld.each(function (index, thread) {
        var threadElement = $(thread).parentsUntil($('tbody'), 'tr');
        //log("-");

        if (term === 'search') {
            //log("1");
            var fid = $(threadElement).find('td:nth-child(3) > a').attr('href').replace('forumdisplay.php?fid=', '');

            if (fid in blockedForums) {
                threadsRemoveCount++;
                threadElement.remove();
                return;
            }
        }

        //log("2");
        var tid = $(thread).attr('id').replace('tid_', '');
        if (tid in blockedThreads) {
            threadsRemoveCount++;
            threadElement.remove();
            return;
        }

        //log("3");
        //var userElement = $(thread).parent().next().find('a');
        let userElement = $(threadElement).find("div.author.smalltext > a");
        var uid = $(userElement).attr('href').replace('https://hackforums.net/member.php?action=profile&uid=', '');
        if (uid in blockedUsers) {
            threadsRemoveCount++;
            threadElement.remove();
        }
        //log("4");
    });
    threadsSubjectNew.each(function (index, thread) {
        var threadElement = $(thread).parentsUntil($('tbody'), 'tr');
        //log("-");

        if (term === 'search') {
            //log("1");
            var fid = $(threadElement).find('td:nth-child(3) > a').attr('href').replace('forumdisplay.php?fid=', '');

            if (fid in blockedForums) {
                threadsRemoveCount++;
                threadElement.remove();
                return;
            }
        }

        //log("2");
        var tid = $(thread).attr('id').replace('tid_', '');
        if (tid in blockedThreads) {
            threadsRemoveCount++;
            threadElement.remove();
            return;
        }

        //log("3");
        //var userElement = $(thread).parent().next().find('a');
        let userElement = $(threadElement).find("div.author.smalltext > a");
        var uid = $(userElement).attr('href').replace('https://hackforums.net/member.php?action=profile&uid=', '');
        if (uid in blockedUsers) {
            threadsRemoveCount++;
            threadElement.remove();
        }
        //log("4");
    });

    if (threadsRemoveCount === 0) {
        return;
    }

    //var searchResultElement = $('div.quick_keys > table.tborder > tbody > tr:nth-child(1) > td > strong');
    //$(searchResultElement).append(formatRemovalCountElement('thread', threadsRemoveCount));
}

function removeBlacklistedForumsFromHome() {
    var blockedForums = GM_SuperValue.get('forums');

    var forums = $('div[id^=tabmenu_]');
    forums.each(function (forumIndex, forum) {
        var subForumsRemoveCount = 0;

        var subForums = $(forum).find('tbody[id^=cat] > tr:nth-child(n+2) > td:nth-child(2) > div > strong > a'); // td > div > div.subforum-text > ul.columns
        var subForums2 = $(forum).find('tbody[id^=cat] > tr:nth-child(n+2) > td:nth-child(2) > strong > a'); // td > div.subforum-text > ul.columns

        subForums.each(function (subForumIndex, subForum) {
            var subForumFid = $(subForum).attr('href').replace('forumdisplay.php?fid=', '');
            var subForumElement = $(subForum).parentsUntil('tbody', 'tr');

            log("test");
            if (subForumFid in blockedForums) {
                subForumsRemoveCount++;
                subForumElement.remove();
            } else {
                var subSubForumsRemoveCount = 0;
                var subSubForums = $(subForum).closest('td').find('div > div.subforum-text > ul.columns > li > a');

                subSubForums.each(function (subSubForumIndex, subSubForum) {
                    var subSubForumFid = $(subSubForum).attr('href').replace('forumdisplay.php?fid=', '');
                    var subSubForumElement = $(subSubForum).parentsUntil('ul', 'li');

                    if (subSubForumFid in blockedForums) {
                        subSubForumsRemoveCount++;
                        subSubForumElement.remove();
                    }
                });
            }
        });
        subForums2.each(function (subForumIndex, subForum) {
            var subForumFid = $(subForum).attr('href').replace('forumdisplay.php?fid=', '');
            var subForumElement = $(subForum).parentsUntil('tbody', 'tr');

            log("test");
            if (subForumFid in blockedForums) {
                subForumsRemoveCount++;
                subForumElement.remove();
            } else {
                var subSubForumsRemoveCount = 0;
                var subSubForums = $(subForum).closest('td').find('div.subforum-text > ul.columns > li > a');

                subSubForums.each(function (subSubForumIndex, subSubForum) {
                    var subSubForumFid = $(subSubForum).attr('href').replace('forumdisplay.php?fid=', '');
                    var subSubForumElement = $(subSubForum).parentsUntil('ul', 'li');

                    if (subSubForumFid in blockedForums) {
                        subSubForumsRemoveCount++;
                        subSubForumElement.remove();
                    }
                });
            }
        });
    });
}

function removeBlacklistedForumsFromForumDisplay() {
    var blockedForums = GM_SuperValue.get('forums');

    var forums = $('tr:nth-child(n+3) > td:nth-child(2) > div > strong > a'); // td > div > div.subforum-text > ul.columns
    let forumsParent = $(forums).parentsUntil('div.wrapper', 'table');
    var forums2 = $('tr:nth-child(n+3) > td:nth-child(2) > strong > a'); // td > div.subforum-text > ul.columns
    let forums2Parent = $(forums).parentsUntil('div.wrapper', 'table');
    var forumsRemovedCount = 0;

    forums.each(function (forumIndex, forum) {
        var fid = $(forum).attr('href').replace('forumdisplay.php?fid=', '');
        var forumElement = $(forum).parentsUntil('tbody', 'tr');

        if (fid in blockedForums) {
            forumsRemovedCount++;
            forumElement.remove();
        } else {
            var subForumsRemoveCount = 0;
            var subForums = $(forum).closest('td').find('div > div.subforum-text > ul.columns > li > a');

            subForums.each(function (subForumIndex, subForum) {
                var subForumFid = $(subForum).attr('href').replace('forumdisplay.php?fid=', '');
                var subForumElement = $(subForum).parentsUntil('ul', 'li');

                if (subForumFid in blockedForums) {
                    subForumsRemoveCount++;
                    subForumElement.remove();
                }
            });
        }
    });
    forums2.each(function (forumIndex, forum) {
        var fid = $(forum).attr('href').replace('forumdisplay.php?fid=', '');
        var forumElement = $(forum).parentsUntil('tbody', 'tr');

        if (fid in blockedForums) {
            forumsRemovedCount++;
            forumElement.remove();
        } else {
            var subForumsRemoveCount = 0;
            var subForums = $(forum).closest('td').find('div.subforum-text > ul.columns > li > a');

            subForums.each(function (subForumIndex, subForum) {
                var subForumFid = $(subForum).attr('href').replace('forumdisplay.php?fid=', '');
                var subForumElement = $(subForum).parentsUntil('ul', 'li');

                if (subForumFid in blockedForums) {
                    subForumsRemoveCount++;
                    subForumElement.remove();
                }
            });
        }
    });
    var forumsNewNum = forumsParent.find("tbody > tr").length;
    var forums2NewNum = forums2Parent.find("tbody > tr").length;
    if (forumsNewNum < 3 || forums2NewNum < 3) {
        forumsParent.remove();
        let wrapDivBRs = document.querySelectorAll('div#content > div.wrapper > br');
        wrapDivBRs[3].remove();
        wrapDivBRs[3].remove();
        wrapDivBRs[3].remove();
        wrapDivBRs[4].remove();
    }
}

function formatRemovalCountElement(term, count) {
    var appendHtml = ' - ';
    appendHtml += '<span style="color: red; font-size: xx-small; font-weight: bold;">' + count + '</span>';
    appendHtml += '<span style="color: white; font-size: xx-small; font-weight: normal;"> ' + term + (count == 1 ? '' : 's') + ' removed</span></strong>';

    return appendHtml;
}

// End Blacklisting //


// Start Block Page

function initializetBlockPage() {
    log('Initializing block page...');

    document.title = 'HF - tBlock Settings';
    //document.head.innerHTML += '<style>' + trashIconStyle + '</style>';
    document.head.innerHTML += '<link type="text/css" rel="stylesheet" href="https://hackforums.net/cache/themes/theme14/global.css">';
    document.head.innerHTML += '<link type="text/css" rel="stylesheet" href="https://hackforums.net/fonts/fa/css/all.min.css">';
    document.body.innerHTML = createContent();

    $("a.sfThreadBlacklistToggle").on('click', toggleSfThreadClick);

    $("a.topbarSettingsButtonToggle").on('click', toggleTopbarSettingsButtonToggleClick);

    $('.trash_icon').on('click', deleteItemCallback);
}

function toggleSfThreadClick() {
    let toggleSfThreadCurrVal = GM_SuperValue.get("toggleSfThreadTextBool", false);

    GM_SuperValue.set("toggleSfThreadTextBool", !toggleSfThreadCurrVal)

    document.querySelector("a.sfThreadBlacklistToggle").text = `${getToggleSfThreadText()} blacklist button for all threads in subforum view. (Click Here)`;
}

function getToggleSfThreadText() {
    let toggleSfThreadCurrVal = GM_SuperValue.get("toggleSfThreadTextBool", false);

    if (toggleSfThreadCurrVal) {
        return "Disable";
    }
    else {
        return "Enable";
    }
}

function toggleTopbarSettingsButtonToggleClick() {
    let toggleTopbarSettingsBtnCurrVal = GM_SuperValue.get("toggleTopbarSettingsBtnTextBool", false);

    GM_SuperValue.set("toggleTopbarSettingsBtnTextBool", !toggleTopbarSettingsBtnCurrVal)

    document.querySelector("a.topbarSettingsButtonToggle").text = `${getToggleTopbarSettingsButtonText()} top navbar dashboard button. (Click Here)`;
}

function getToggleTopbarSettingsButtonText() {
    let toggleTopbarSettingsBtnCurrVal = GM_SuperValue.get("toggleTopbarSettingsBtnTextBool", false);

    if (toggleTopbarSettingsBtnCurrVal) {
        return "Disable";
    }
    else {
        return "Enable";
    }
}

function deleteItemCallback(e) {
    e.preventDefault();

    var result = confirm('Are you sure you want remove this blacklist?');
    if (!result) {
        return;
    }

    var type = (e.target).parentElement.getAttribute('data-type');
    var id = (e.target).parentElement.getAttribute('data-id');

    /*console.log(type);
    console.log(id);
    console.log(e);*/

    var key = keyFromType(type, true);

    var items = GM_SuperValue.get(key);
    delete items[id];
    GM_SuperValue.set(key, items);

    var rowElement = $('tr[data-id="' + id + '"]');
    if ((Object.keys(items).length === 0)) {
        $(createRow(0, '', 'none')).insertAfter(rowElement);
    }
    rowElement.remove();
}

function createContent() {
    var content = contentTemplate;
    content = content.replace('{forums}', createSection('fid'));
    content = content.replace('{threads}', createSection('tid'));
    content = content.replace('{users}', createSection('uid'));
    content = content.replace('{getToggleSfThreadText}', getToggleSfThreadText());
    content = content.replace('{getToggleTopbarSettingsButtonText}', getToggleTopbarSettingsButtonText());

    return content;
}

function createSection(type) {
    var key = keyFromType(type, false);
    var items = GM_SuperValue.get(key.toLowerCase());

    var section = sectionTemplate.replace('{title}', key);

    //log(key + ' - ' + Object.keys(items).length);
    if (Object.keys(items).length === 0) {
        section += createRow(0, '', 'none');
    } else {
        for (var id in items)
            section += createRow(id, items[id], type);
    }

    return section;
}

function keyFromType(type, lowercase) {
    var key = '';

    switch (type) {
        case 'fid': key = 'Forums'; break;
        case 'tid': key = 'Threads'; break;
        case 'uid': key = 'Users'; break;
    }

    if (!lowercase)
        return key;
    else
        return key.toLowerCase();
}

function createRow(id, title, type) {
    var cellOne = '<a href="{page}?{type}={id}" target="_blank">{title}</a>',
        cellTwo = '<a href="javascript:void(0);" class="trash_icon" data-id="{id}" data-type="{type}"><i class="fa fa-trash" aria-hidden="true"></i></a>';

    if (type !== 'none') {
        var page = (type === 'fid' ? 'forumdisplay' : 'showthread') + '.php';
        cellOne = cellOne.replace('{page}', page);
        cellOne = cellOne.replace('{type}', type);
        cellOne = cellOne.replace('{id}', id);
        cellOne = cellOne.replace('{title}', title);

        cellTwo = cellTwo.replace('{type}', type);
        cellTwo = cellTwo.replace('{id}', id);
    } else {
        cellOne = '<span>No items exist.</span>';
    }

    var row = rowTemplate;
    row = row.replace('{id}', id);
    row = row.replace('{cellOne}', cellOne);
    row = row.replace('{cellTwo}', cellTwo);

    return row;
}

// End Block Page

main();
