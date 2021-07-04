// ==UserScript==
// @name         HF Wiki: Generate Article to Clipboard
// @version      0.0.2
// @description  Generate basic articles to your clipboard for the HF Wiki.
// @author       James
// @updateURL    https://github.com/moodiest/Userscripts/raw/master/HF%20Wiki%20Generate%20Article%20to%20Clipboard.user.js
// @downloadURL  https://github.com/moodiest/Userscripts/raw/master/HF%20Wiki%20Generate%20Article%20to%20Clipboard.user.js
// @iconURL      https://github.com/moodiest/Userscripts/raw/master/icon.jpg
// @include      https://hackforums.net/member.php?action=profile&uid=*
// @include      https://hackforums.net/myawards.php*
// @grant        GM_setClipboard
// ==/UserScript==

var Gen = {
  init: function () {
      if (document.URL.includes(`member.php?action=profile`)) {
          Gen.addProfileBtn();
      } else if (document.URL.includes(`myawards.php?awid=`)) {
          Gen.addAwardRecipientsBtn();
      } else if (document.URL.includes(`myawards.php`)) {
          Gen.addAwardBtn();
      }
  },

  addProfileBtn: function () {
      document.querySelector(`div.pro-adv-container > div:nth-child(2) > div.float_right`).insertAdjacentHTML(`afterbegin`, `<a href="javascript:void(0);" id="userscript-gen-wiki-article-btn" data-tooltip="HF Wiki: Generate Article to Clipboard" title="HF Wiki: Generate Article to Clipboard" style="padding: 0px 15px;"><i class="fab fa-wikipedia-w fa-lg" aria-hidden="true"></i></a>`);
      document.getElementById(`userscript-gen-wiki-article-btn`).insertAdjacentHTML(`afterbegin`, `<input type="text" id="userscript-gen-wiki-article-text" style="display: none;" value="">`);
      document.getElementById(`userscript-gen-wiki-article-btn`).addEventListener(`click`, function() { Gen.profileGeneration() });
  },

  profileGeneration: function () {
      var template = `{{MemberBox
| Username    = %username%
| UserID      = %uid%
| JoinDate    = %joindate%
| JoinYear    = %joinyear%
| CloseYear   = %closeyear%
| Status      = %status%
| IsAdmin     = %isadmin%
| IsStaff     = %isstaff%
| IsModerator = %ismoderator%
| IsMentor    = %ismentor%
| IsWriter    = %iswriter%
| IsOMC       =
| Biography   =
| History     =
| PersonComm  =
| Alias1      =
| Alias2      =
| Alias3      =
| Alias4      =%awards%%groups%
}}`;

      var article = template;
      article = article.replace(`%username%`, document.querySelector(`div.pro-adv-content-info > div:nth-child(1) > div:nth-child(2) > span > strong > span`).textContent);
      article = article.replace(`%uid%`, document.URL.split(`uid=`)[1]);
      article = article.replace(`%joindate%`, document.querySelector(`div.pro-adv-content-info > div:nth-child(1) > div:nth-child(6)`).textContent.split(`Join Date: `)[1]);
      article = article.replace(`%joinyear%`, document.querySelector(`div.pro-adv-content-info > div:nth-child(1) > div:nth-child(6)`).textContent.split(`, `)[1]);
      article = article.replace(`%closeyear%`, ((document.querySelector(`div.pro-adv-content-info > div:nth-child(1) > div:nth-child(3)`).textContent.includes(`closed`)) ? `TBA` : ``));
      article = article.replace(`%status%`, `Active`);

      document.querySelector(`div.pro-adv-awards-group`).querySelectorAll(`i.award_sprite`).forEach((award, i) => {
          var awardName = award.getAttribute(`title`);
          if (awardName.includes(`’`)) {
              awardName = awardName.replace(`’`, `'`);
          }
          article = article.replace(`%awards%`, `
| AwardName${i+1} = ${((awardName.includes(' - ')) ? awardName.split(' - ')[0] : awardName)}%awards%`);
      });

      article = article.replace(`%awards%`, ``);

      document.querySelector(`div.pro-adv-groups-group`).querySelectorAll(`span`).forEach((group, i) => {
          var groupName = group.querySelector(`img`).getAttribute(`title`);
          if (groupName.includes(`V3ndors`)) {
              groupName = `V3ndor`;
          }
          article = article.replace(`%groups%`, `
| GroupName${i+1} = ${((groupName.includes('HF ')) ? groupName.replace('HF ', '') : groupName)}%groups%`);
          if (groupName.includes(`Admin`)) {
              article = article.replace(`%isadmin%`, `True`);
          } else if (groupName.includes(`Staff`)) {
              article = article.replace(`%isstaff%`, `True`);
          } else if (groupName.includes(`Moderator`)) {
              article = article.replace(`%ismoderator%`, `True`);
          } else if (groupName.includes(`Mentors`)) {
              article = article.replace(`%ismentor%`, `True`);
          } else if (groupName.includes(`Writers`)) {
              article = article.replace(`%iswriter%`, `True`);
          }
      });

      article = article.replace(`%isadmin%`, ``);
      article = article.replace(`%isstaff%`, ``);
      article = article.replace(`%ismoderator%`, ``);
      article = article.replace(`%ismentor%`, ``);
      article = article.replace(`%iswriter%`, ``);
      article = article.replace(`%groups%`, ``);


      document.getElementById(`userscript-gen-wiki-article-text`).setAttribute(`value`, `${article}`);

      GM_setClipboard(article);

      console.log(article);
  },

  addAwardBtn: function () {
      var template = `{{AwardBox
| AwardDesc    = %desc%
| AwardType    = %type%
| AwardID      = %id%
| AwardDetails =
| AwardRecip   =
}}`;

      document.querySelectorAll(`#content > div > form > table > tbody > tr:nth-child(n+3)`).forEach((award, i) => {
          var awardId = award.querySelector(`td:nth-child(1) > strong > a`).href.split(`awid=`)[1];

          award.insertAdjacentHTML(`beforeend`, `<td class="trow1" align="center"><a href="javascript:void(0);" id="userscript-gen-wiki-article-btn-${awardId}" data-tooltip="HF Wiki: Generate Article to Clipboard" title="HF Wiki: Generate Article to Clipboard" style="padding: 0px 15px;"><i class="fab fa-wikipedia-w fa-lg" aria-hidden="true"></i></a></td>`);
          document.getElementById(`userscript-gen-wiki-article-btn-${awardId}`).insertAdjacentHTML(`afterbegin`, `<input type="text" id="userscript-gen-wiki-article-text-${awardId}" style="display: none;" value="">`);

          var article = template;
          article = article.replace(`%desc%`, award.querySelector(`td:nth-child(2)`).textContent);
          article = article.replace(`%type%`, `Regular`);
          article = article.replace(`%id%`, awardId);

          document.getElementById(`userscript-gen-wiki-article-text-${awardId}`).setAttribute(`value`, `${article}`);

          document.getElementById(`userscript-gen-wiki-article-btn-${awardId}`).addEventListener(`click`, function () { Gen.awardGenerationCallback(awardId) });
      });

      document.querySelector(`#content > div > form > table > tbody > tr:nth-child(1) > td`).setAttribute(`colspan`, `4`);
      document.querySelector(`#content > div > form > table > tbody > tr:nth-child(2)`).insertAdjacentHTML(`beforeend`, `<td class="tcat" width="10%" align="center"><strong>Wiki</strong></td>`);

  },

  awardGenerationCallback: function (awardId) {
      var article = document.getElementById(`userscript-gen-wiki-article-text-${awardId}`).getAttribute(`value`);

      GM_setClipboard(article);
  },

  addAwardRecipientsBtn: function () {
      var template = `{{{!}} class="wikitable"
{{!}}-
! Recipient Name !! Reason !! Date Given
{{!}}-%row%
{{!}}}`;

      var awardHeader = document.querySelector(`div.wrapper > form > table > tbody > tr > td.thead > strong`);

      awardHeader.insertAdjacentHTML(`afterend`, `<td class="trow1" align="center"><a href="javascript:void(0);" id="userscript-gen-wiki-article-btn1" data-tooltip="HF Wiki: Generate Recipients to Clipboard - User Article Link" title="HF Wiki: Generate Recipients to Clipboard - User Article Link" style="padding: 0px 15px;"><i class="fab fa-wikipedia-w fa-lg" aria-hidden="true"></i></a></td>`);
      document.getElementById(`userscript-gen-wiki-article-btn1`).insertAdjacentHTML(`afterbegin`, `<input type="text" id="userscript-gen-wiki-article-text1" style="display: none;" value="">`);

      awardHeader.insertAdjacentHTML(`afterend`, `<td class="trow1" align="center"><a href="javascript:void(0);" id="userscript-gen-wiki-article-btn2" data-tooltip="HF Wiki: Generate Recipients to Clipboard - User Profile Link" title="HF Wiki: Generate Recipients to Clipboard - User Profile Link" style="padding: 0px 15px;"><i class="fab fa-wikipedia-w fa-lg" aria-hidden="true"></i></a></td>`);
      document.getElementById(`userscript-gen-wiki-article-btn2`).insertAdjacentHTML(`afterbegin`, `<input type="text" id="userscript-gen-wiki-article-text2" style="display: none;" value="">`);

      var article1 = template;
      var article2 = template;

      document.querySelectorAll(`#content > div > form > table > tbody > tr:nth-child(n+3)`).forEach((userRow, i) => {
          var rowTemplate1 = `
{{!}} [[%username%]] {{!}}{{!}} %reason% {{!}}{{!}} %date%
{{!}}-%row%`;
          var rowTemplate2 = `
{{!}} [https://hackforums.net/member.php?action=profile&uid=%uid% '''%username%'''] {{!}}{{!}} %reason% {{!}}{{!}} %date%
{{!}}-%row%`;

          var uid = userRow.querySelector(`td:nth-child(1) > strong > a`).href.split(`uid=`)[1];
          var username = userRow.querySelector(`td:nth-child(1) > strong > a > span`).textContent;
          var reason = userRow.querySelector(`td:nth-child(2)`).textContent;
          var date = userRow.querySelector(`td:nth-child(4)`).textContent;

          rowTemplate1 = rowTemplate1.replace(`%username%`, username);
          rowTemplate1 = rowTemplate1.replace(`%reason%`, reason);
          rowTemplate1 = rowTemplate1.replace(`%date%`, date);

          rowTemplate2 = rowTemplate2.replace(`%uid%`, uid);
          rowTemplate2 = rowTemplate2.replace(`%username%`, username);
          rowTemplate2 = rowTemplate2.replace(`%reason%`, reason);
          rowTemplate2 = rowTemplate2.replace(`%date%`, date);

          article1 = article1.replace(`%row%`, rowTemplate1);
          article2 = article2.replace(`%row%`, rowTemplate2);
      });

      article1 = article1.replace(`%row%`, ``);
      article2 = article2.replace(`%row%`, ``);

      document.getElementById(`userscript-gen-wiki-article-text1`).setAttribute(`value`, `${article1}`);
      document.getElementById(`userscript-gen-wiki-article-text2`).setAttribute(`value`, `${article2}`);

      document.getElementById(`userscript-gen-wiki-article-btn1`).addEventListener(`click`, function () { Gen.awardRecipientsGenerationCallback(`1`) });
      document.getElementById(`userscript-gen-wiki-article-btn2`).addEventListener(`click`, function () { Gen.awardRecipientsGenerationCallback(`2`) });
  },

  awardRecipientsGenerationCallback: function (type) {
      var article = document.getElementById(`userscript-gen-wiki-article-text${type}`).getAttribute(`value`);

      GM_setClipboard(article);
  }

}

Gen.init();