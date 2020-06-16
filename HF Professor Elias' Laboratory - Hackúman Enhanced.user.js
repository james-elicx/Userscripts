// ==UserScript==
// @name         HF Professor Elias' Laboratory - Hackúman Enhanced
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Professor Elias' Laboratory researches new and innovative ways to take care of and enhance a Hackúman's natural abilities.
// @author       James
// @include      https://hackforums.net/hackuman.php*
// @updateURL    https://github.com/moodiest/Userscripts/raw/master/HF%20Professor%20Elias'%20Laboratory%20-%20Hack%C3%BAman%20Enhanced.user.js
// @downloadURL  https://github.com/moodiest/Userscripts/raw/master/HF%20Professor%20Elias'%20Laboratory%20-%20Hack%C3%BAman%20Enhanced.user.js
// @require      https://userscripts-mirror.org/scripts/source/107941.user.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==
//
// ------- CHANGE LOG -------
// Initial release.
// ---------------------------

var debug = true;
var labProfName = `Professor Elias' Laboratory`;

var humLabConfigData;
var humLabConfigDefault = {
	labItems: [
		{
			id: 0,
			name: 'quickAttack',
			enabled: true,
			defaultHackuman: {
				id: 0,
				name: `not set`
			}
		},
		{
			id: 1,
			name: 'autoFeed',
			enabled: false,
			hackuman: []
		}
	]
};

var main = function () {
	$(function () {
		initConfig();

		//humLabConfigData.labItems[1].hackuman = [];
		//updateConfig();

		//console.log(humLabConfigData);

		initUserInterface();

		if (humLabConfigData.labItems[0].enabled) {
			initQuickAttack();
		}

		if (humLabConfigData.labItems[1].enabled) {
			initAutoFeed();
		}
	});
};

function log(message) {
	if (debug)
	{
		console.log(`[${labProfName}] ${message}`);
	}
}

String.prototype.contains = function (value) {
    return (this.indexOf(value) >= 0);
};

Array.prototype.contains = function (value) {
    return (this.indexOf(value) >= 0);
};

/*** Begin: Config ***/

function initConfig () {
    humLabConfigData = GM_SuperValue.get('humLabConfig', humLabConfigDefault);
    GM_SuperValue.set('humLabConfig', humLabConfigData);
}

function updateConfig () {
	let oldData = GM_SuperValue.get('humLabConfig', humLabConfigDefault);

    if (humLabConfigData === oldData) {
		return;
	}
	else {
		GM_SuperValue.set('humLabConfig', humLabConfigData);
	}
}

function getConfig () {
    humLabConfigData = GM_SuperValue.get('humLabConfig', humLabConfigDefault);
	return humLabConfigData;
}

/*** End: Config ***/

/*** Begin: User Interface ***/

function initUserInterface () {
	createLaboratoryTab();

	if (document.URL.contains(`laboratory`)) {
		updateLaboratoryItems();
		createLaboratoryPage();
	}
}

function createLaboratoryTab () {
	let tabHtml = `<div data-navoption="laboratory" class="hum-nav-option hum-nav-option-battle hum-nav-option-laboratory " style="text-align: right !important;"><div style="border: 2px solid #363636;border-top-left-radius: 15px 10px;border-top-right-radius: 15px 10px;border-bottom-left-radius: 15px 10px;border-bottom-right-radius: 15px 10px;"><a href="hackuman.php?action=laboratory" style="display: inline-block; line-height: 30px; padding: 0px 11px; color: #d6d6d6; font-weight: 500; text-shadow: 0px 1px 1px #00000075;"><i class="fa fa-cog" width="24" height="24" style="margin-bottom: -7px; color: #8d8d8d;"></i><span class="mobile-remove" style="margin-left: 6px; position: relative; top: 1px;">Laboratory</span></a></div></div>`
	let hackumanTabs = $(`div.hum-nav-container > div`);
	$(hackumanTabs).append(tabHtml);
}

function createLaboratoryPage () {
	document.title = `Hackúman - Laboratory`;
	$(`div.hum-nav-container > div > div.hum-nav-option-laboratory`).addClass(`hum-nav-option-active`);
	$(`div.hum-nav-container`).parent().children().eq(1).append(`<div class="hum-laboratory-main-body"></div>`);
	var laboratoryContentNode = $(`div.hum-laboratory-main-body`);

	let headerHtml = `<div class="hum-laboratory-header">
<div style="padding-top: 10px;"><span style="font-size: 36px; color: #e2e2e2; font-weight: bold; letter-spacing: 0.5px; text-shadow: 0px 2px 0px #0000007a, 0px -1px 1px #0000007a, 1px 0px 1px #0000007a, -1px 0px 1px #0000007a, 0px 1px 1px #0000007a;">${labProfName}</span></div>
<div style="max-width: 500px; margin: auto;"><span style="color: #d6d6d6; font-size: 16px; font-weight: 500; letter-spacing: 0.5px; text-shadow: 0px 1px 1px #00000075;">${labProfName} researches new and innovative ways to take care of and enhance a Hackúman's natural abilities.</span></div>
</div>`;
	$(laboratoryContentNode).append(headerHtml);
	var headerNode = $(`div.hum-laboratory-header`);

	let bodyHtml = `<div class="hum-laboratory-body" style="display: flex; flex-wrap: wrap; justify-content: center;"></div>`;
	$(laboratoryContentNode).append(bodyHtml);
	var bodyNode = $(`div.hum-laboratory-body`);

	$(laboratoryItems).each(function (index, labItem) {
		let labItemHtml = `<div id="hum-laboratory-item-${labItem.id}" class="hum-item-container hum-item-container-1 hum-laboratory-item" data-hsid="1" style="flex: 0 0 220px; max-width: 355px; min-height: 0px; border: 2px solid #1a1a1a; margin: 15px; background-color: #333; position: relative; border-radius: 11px 8px;">
<div style="padding: 10px; border: 2px solid #3e3e3e; height: 100%; box-sizing: border-box; border-radius: 11px 8px;">
<div style="text-align: left; display: flex; overflow: hidden; height: 100%;">
<div style="flex: 1 0 auto; color: #d6d6d6;font-weight: 500;text-shadow: 0px 1px 1px #00000075;font-size: 16px;flex: 1 0 20px; display: flex; flex-direction: column;">
<div style="flex: 1 0 auto;">
<div style="vertical-align: top; margin-left: 10px; font-size: 13px; font-weight: initial; color: #999;">
<div class="hum-mon-top-message" style="margin-top: 6px;"><a href="javascript:void(0);"><strong class="hum-mon-name" data-name="Snitch Killer" style="font-size: 18px; color: #d6d6d6; text-shadow: 0px 1px 1px #00000075;"><div style="flex: 0 0 auto;"><i class="${labItem.icon}" style="width: 20px; vertical-align: center; margin-left: 8px;"></i><span style="vertical-align: top; margin-left: 6px;">${labItem.name}</span></div></strong></a></div>

<div style="margin: auto; margin-top: 6px; border-bottom: 1px solid #272727; width: 80%;"></div>

<div style="margin-top: 10px; text-align: left; display: flex; height: 120px;">
<div style="color: #d6d6d6; font-size: 13px; font-weight: 400; text-shadow: 0px 1px 1px #00000075; position: relative; top: -1px; margin-right: 4px; "><strong>Description:</strong> ${labItem.desc}</div>
</div>
<div style="margin-top: -7.5px; text-align: left; display: flex; height: 40px;">
<div id="hum-laboratory-item-${labItem.id}-notes" style="color: #d6d6d6; font-size: 13px; font-weight: 400; text-shadow: 0px 1px 1px #00000075; position: relative; top: -1px; margin-right: 4px; "><strong>Notes:</strong> ${labItem.notes}</div>
</div>
</div>
</div>
<div style="flex: 0 0 36px; text-align: center; margin-top: 10px;">
<div>
<div class="pro-adv-3d-button hum-mon-button" style="width: 50px; user-select: none;" unselectable="on" onselectstart="return false;" onmousedown="return false;" id="hum-laboratory-item-toggle-${labItem.id}">
<div><span class="hum-mon-button-text">${labItem.toggleText}</span></div>
</div>
<div class="pro-adv-3d-button hum-mon-button" style="width: 75px; user-select: none;" unselectable="on" onselectstart="return false;" onmousedown="return false;" id="hum-laboratory-item-configure-${labItem.id}">
<div><span class="hum-mon-button-text">Configure</span></div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>`;
		$(bodyNode).append(labItemHtml);

		$(`div#hum-laboratory-item-toggle-${labItem.id}`).on('click', function (event) {
			toggleItem(labItem.id);
		});

		$(`div#hum-laboratory-item-configure-${labItem.id}`).on('click', function (event) {
			configureItem(labItem.id);
		});
	});
}

var laboratoryItems;

function updateLaboratoryItems () {
	laboratoryItems = [
		{
			id: 0,
			name: `Quick Attack`,
			icon: `fa fa-clock-o`,
			desc: `Activate buttons that allow you to rapidly make special and regular attacks without having to select your Hackúman each time.`,
			notes: `Default attacker is ${humLabConfigData.labItems[0].defaultHackuman.name}`,
			toggleText: getToggleText(humLabConfigData.labItems[0].enabled),
		},
		{
			id: 1,
			name: `Auto Feed`,
			icon: `fa fa-cutlery`,
			desc: `Automatically feed Hackúman when you visit the Hackúman home page. It will stop feeding if it uses more than 500 βytes or 50 moves.`,
			notes: `Experimental.`,
			toggleText: getToggleText(humLabConfigData.labItems[1].enabled),
		}
	];
}

function getToggleText (value) {
	if (value) {
		return "Disable";
		log(value);
	}
	else {
		return "Enable";
		log(value);
	}
}

/*** End: User Interface ***/

/*** Begin: UI - Configure Modals ***/

function modalSelectDefaultHumConfigure (labItemId) {
	//log(`t`);
	let hid = 3196;
	let mon = $('.hum-mon-container-' + hid);

	let data = {
		action: "do_attack_mon_pre",
		hid: hid,
		my_post_key: my_post_key
	}

	var dataBlock;

	var running_ajax = true;

		let new_element = `<div class="jquery-modal blocker current" style="opacity: 1;"></div><div class="modal" id="attack_box_` + hid + `" style="display: none; max-width: 100% !important; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9999; position: fixed;">
<div style="overflow-y: auto; min-height: 150px; max-height: 405px; background-color: #212121; padding: 5px;">
<div style="display: flex; flex-wrap: wrap;">
<div style="margin: auto;">
<div style="text-align: center;"><i class="fa fa-spinner fa-spin fa-3x" aria-hidden="true"></i></div>
<div style="color: #d6d6d6; font-weight: 500; text-shadow: 0px 1px 1px #00000075; margin-top: 15px;">Loading Hackúman...</div>
	</div>
	</div>
	</div>
<a href="#close-modal" rel="modal:close" class="close-modal ">Close</a>
	</div></div>`;

		let new_element_block = `<div class="modal" id="attack_box_` + hid + `" style="display: none; max-width: 100% !important;">
<div style="overflow-y: auto; max-height: 430px; display: flex; flex-wrap: wrap; background-color: #212121; padding: 5px;">
<div style="flex: 1 0 calc(50% - 20px); border: 1px solid black; width: 100px; height: 180px; margin: 5px;"></div>
<div style="flex: 1 0 calc(50% - 20px); border: 1px solid black; width: 100px; height: 180px; margin: 5px;"></div>
<div style="flex: 1 0 calc(50% - 20px); border: 1px solid black; width: 100px; height: 180px; margin: 5px;"></div>
<div style="flex: 1 0 calc(50% - 20px); border: 1px solid black; width: 100px; height: 180px; margin: 5px;"></div>
	</div>
	</div>`;

	$(new_element).appendTo('body');

	$(`div#attack_box_${hid}`).css("display", "block");

	$(".close-modal").on("click", function(){
		$(`div#attack_box_${hid}`).remove();
		$("div.jquery-modal.blocker.current").remove();
	});

	$("div.jquery-modal.blocker.current").on("click", function(){
		$(`div#attack_box_${hid}`).remove();
		$("div.jquery-modal.blocker.current").remove();
	});

	var getDataBlock = $.ajax({
		type: "POST",
		url: "hackuman.php?ajax=1",
		data: data,
		dataType: "json",
		success: function(data) {
			if(typeof data == 'object') {
				if(data.hasOwnProperty("errors")) {
					//$.modal.close();

					$.each(data.errors, function(i, message) {
						$.jGrowl('Error:  ' + message, { theme: 'jgrowl_error' });
					});
				} else if(data.hasOwnProperty("success")) {
					if(data.content.length) {
						//$('#attack_box_' + hid + ' > div > div').first().html(data.content);
						$('#attack_box_' + hid + ' > div > div').first().html(``);
						$('#attack_box_' + hid + '').append(`<div id="modalDataThing" style="display:none">${data.content}</div>`);
						dataBlock = data;
						//console.log(dataBlock);
						$(`#modalDataThing`).find(`div.hum-attack-modal-choice`).each(function (index, item) {
							let humInfo = {
								id: $(item).attr(`onclick`).split(',')[1].trim(),
								name: $(item).find(`strong.hum-mon-name`).attr(`data-name`),
								image: $(item).find(`img.hum-display-egg`).attr(`src`),
								progressBar: $(item).find(`div.hum-mon-progressbar-container`)
							}
							//console.log(humInfo);
							var attackBoxes;
							$('#attack_box_' + hid + ' > div > div').first().append(`<div id="hum-laboratory-quickAttack-${humInfo.id}" class="hum-attack-modal-choice" style="flex: 1 0 calc(50% - 20px); border: 1px solid #111; width: 100px; height: 180px; margin: 5px; background-color: #333;" onclick="javascript:void(0);">
<div style="margin-top: 8px; text-align: center;">
<div style="display: inline-block; position: relative;"><div class="hum-display-bigeggs" style="display: inline-block; position: relative; transition: all 1.2s ease 0s; right: 0px; height: 100px; width: 100px; top: -8px;"><img class="hum-display-egg" style="position: absolute; right: 0px; transition: all 1.2s ease 0s; opacity: 1; max-width: 100%; " src="${humInfo.image}"></div></div>
</div>
<div style="margin-top: 3px; text-align: center;"><strong class="hum-mon-name" data-name="${humInfo.name}" style="font-size: 20px; color: #d6d6d6; text-shadow: 0px 1px 1px #00000075;">${humInfo.name}</strong></div>
<div style="display: flex; margin-top: 5px; padding-left: 6px;">
<div>
${humInfo.progressBar.html()}
</div>
</div>
</div>`);

							$(`div#hum-laboratory-quickAttack-${humInfo.id}`).on("click", function(){
								setMainHackuman(labItemId, humInfo.id, humInfo.name);
								$(`div#attack_box_${hid}`).remove();
								$("div.jquery-modal.blocker.current").remove();
							});
						});
						if ($(`#modalDataThing`).find(`div.hum-attack-modal-choice`).length % 2 != 0) {
							$('#attack_box_' + hid + ' > div > div').first().append(`<div style="flex: 1 0 calc(50% - 20px);width: 100px;height: 180px;margin: 5px;"></div>`);
						}

						$('#attack_box_' + hid + ' > div').first().prepend(`<div style="color: #d6d6d6;font-weight: 500;text-shadow: 0px 1px 1px #00000075;height: 20px;line-height: 20px;text-align: center;font-size: 18px;">Please choose your default attacker...</div>`);
					} else {
						$('#attack_box_' + hid + ' > div').first().html(`<div style="color: #d6d6d6;font-weight: 500;text-shadow: 0px 1px 1px #00000075;line-height: 20px;text-align: center;font-size: 18px; margin-top: 40px;">You have no HackÃºman to attack with! Make posts to get an egg.</div>
<div style="margin-top: 8px; text-align: center;"><a class="pro-adv-3d-button" href="search.php?action=getnew" style="background-color: #0f0f0f !important;">Find Posts</a></div>`);
						$.jGrowl('You have no Hackúman to attack with! Make posts to get an egg.', { theme: 'jgrowl_error' });
					}
				}
			}
		},
		error: function() {
			$.jGrowl('Unknown Error', { theme: 'jgrowl_error' });
		},
		complete: function() {
			mon.find('.hum-mon-button-text-feed').text('Attack');
			running_ajax = false;
		}
	});

	getDataBlock.done(function () {
		//console.log(dataBlock);
	});


}

function modalToggleForHumConfigure (labItemId) {
	//log(`t`);
	let hid = 3196;
	let mon = $('.hum-mon-container-' + hid);

	let data = {
		action: "do_attack_mon_pre",
		hid: hid,
		my_post_key: my_post_key
	}

	var dataBlock;

	var running_ajax = true;

		let new_element = `<div class="jquery-modal blocker current" style="opacity: 1;"></div><div class="modal" id="attack_box_` + hid + `" style="display: none; max-width: 100% !important; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9999; position: fixed;">
<div style="overflow-y: auto; min-height: 150px; max-height: 405px; background-color: #212121; padding: 5px;">
<div style="display: flex; flex-wrap: wrap;">
<div style="margin: auto;">
<div style="text-align: center;"><i class="fa fa-spinner fa-spin fa-3x" aria-hidden="true"></i></div>
<div style="color: #d6d6d6; font-weight: 500; text-shadow: 0px 1px 1px #00000075; margin-top: 15px;">Loading Hackúman...</div>
	</div>
	</div>
	</div>
<a href="#close-modal" rel="modal:close" class="close-modal ">Close</a>
	</div></div>`;

		let new_element_block = `<div class="modal" id="attack_box_` + hid + `" style="display: none; max-width: 100% !important;">
<div style="overflow-y: auto; max-height: 430px; display: flex; flex-wrap: wrap; background-color: #212121; padding: 5px;">
<div style="flex: 1 0 calc(50% - 20px); border: 1px solid black; width: 100px; height: 180px; margin: 5px;"></div>
<div style="flex: 1 0 calc(50% - 20px); border: 1px solid black; width: 100px; height: 180px; margin: 5px;"></div>
<div style="flex: 1 0 calc(50% - 20px); border: 1px solid black; width: 100px; height: 180px; margin: 5px;"></div>
<div style="flex: 1 0 calc(50% - 20px); border: 1px solid black; width: 100px; height: 180px; margin: 5px;"></div>
	</div>
	</div>`;

	$(new_element).appendTo('body');

	$(`div#attack_box_${hid}`).css("display", "block");

	$(".close-modal").on("click", function(){
		$(`div#attack_box_${hid}`).remove();
		$("div.jquery-modal.blocker.current").remove();
	});

	$("div.jquery-modal.blocker.current").on("click", function(){
		$(`div#attack_box_${hid}`).remove();
		$("div.jquery-modal.blocker.current").remove();
	});

	var getDataBlock = $.ajax({
			type: "POST",
			url: "hackuman.php?ajax=1",
			data: data,
			dataType: "json",
			success: function(data) {
				if(typeof data == 'object') {
					if(data.hasOwnProperty("errors")) {
						//$.modal.close();

						$.each(data.errors, function(i, message) {
							$.jGrowl('Error:  ' + message, { theme: 'jgrowl_error' });
						});
					} else if(data.hasOwnProperty("success")) {
						if(data.content.length) {
							//$('#attack_box_' + hid + ' > div > div').first().html(data.content);
							$('#attack_box_' + hid + ' > div > div').first().html(``);
							$('#attack_box_' + hid + '').append(`<div id="modalDataThing" style="display:none">${data.content}</div>`);
							dataBlock = data;
							//console.log(dataBlock);
							$(`#modalDataThing`).find(`div.hum-attack-modal-choice`).each(function (index, item) {
								let humInfo = {
									id: $(item).attr(`onclick`).split(',')[1].trim(),
									name: $(item).find(`strong.hum-mon-name`).attr(`data-name`),
									image: $(item).find(`img.hum-display-egg`).attr(`src`),
									progressBar: $(item).find(`div.hum-mon-progressbar-container`)
								}
								//console.log(humInfo);
								var attackBoxes;
								var toggleBtnTxt;
								try {
									toggleBtnTxt = getToggleText(humLabConfigData.labItems[labItemId].hackuman[humInfo.id].enabled);
								}
								catch (e) {
									//console.log(`missing`);
									humLabConfigData.labItems[labItemId].hackuman[humInfo.id] = { enabled: false };
									//console.log(humLabConfigData);
									updateConfig();
									toggleBtnTxt = getToggleText(humLabConfigData.labItems[labItemId].hackuman[humInfo.id].enabled);
									if (humLabConfigData.labItems[labItemId].hackuman[humInfo.id].enabled) {
									}
								}
								$('#attack_box_' + hid + ' > div > div').first().append(`<div id="hum-laboratory-toggleForHackuman-${humInfo.id}" class="hum-attack-modal-choice" style="flex: 1 0 calc(50% - 20px); border: 1px solid #111; width: 100px; height: 180px; margin: 5px; background-color: #333;">
	<div style="margin-top: 8px; text-align: center;">
		<div style="display: inline-block; position: relative;"><div class="hum-display-bigeggs" style="display: inline-block; position: relative; transition: all 1.2s ease 0s; right: 0px; height: 100px; width: 100px; top: -8px;"><img class="hum-display-egg" style="position: absolute; right: 0px; transition: all 1.2s ease 0s; opacity: 1; max-width: 100%; " src="${humInfo.image}"></div></div>
	</div>
	<div style="margin-top: 3px; text-align: center;"><strong class="hum-mon-name" data-name="${humInfo.name}" style="font-size: 20px; color: #d6d6d6; text-shadow: 0px 1px 1px #00000075;">${humInfo.name}</strong></div>
	<div style="display: flex; margin-top: 0px; justify-content: center;">
    <div>
        <div style="flex: 0 0 36px; text-align: center;">
        <div>
        <div class="pro-adv-3d-button hum-mon-button" style="width: 75px; user-select: none;" unselectable="on" onselectstart="return false;" onmousedown="return false;" id="hum-laboratory-item-toggleForHackuman-${humInfo.id}">
        <div><span class="hum-mon-button-text">${toggleBtnTxt}</span></div>
        </div>
        </div>
        </div>
    </div>
    </div>
</div>`);

								$(`div#hum-laboratory-toggleForHackuman-${humInfo.id}`).on("click", function(){
									toggleForHackuman(labItemId, humInfo.id);
								});
							});
							if ($(`#modalDataThing`).find(`div.hum-attack-modal-choice`).length % 2 != 0) {
								$('#attack_box_' + hid + ' > div > div').first().append(`<div style="flex: 1 0 calc(50% - 20px);width: 100px;height: 180px;margin: 5px;"></div>`);
							}

							$('#attack_box_' + hid + ' > div').first().prepend(`<div style="color: #d6d6d6;font-weight: 500;text-shadow: 0px 1px 1px #00000075;height: 20px;line-height: 20px;text-align: center;font-size: 18px;">Select Hackúman to enable this tool for...</div>`);
						} else {
							$('#attack_box_' + hid + ' > div').first().html(`<div style="color: #d6d6d6;font-weight: 500;text-shadow: 0px 1px 1px #00000075;line-height: 20px;text-align: center;font-size: 18px; margin-top: 40px;">You have no HackÃºman to attack with! Make posts to get an egg.</div>
<div style="margin-top: 8px; text-align: center;"><a class="pro-adv-3d-button" href="search.php?action=getnew" style="background-color: #0f0f0f !important;">Find Posts</a></div>`);
							$.jGrowl('You have no Hackúman to attack with! Make posts to get an egg.', { theme: 'jgrowl_error' });
						}
					}
				}
			},
			error: function() {
				$.jGrowl('Unknown Error', { theme: 'jgrowl_error' });
			},
			complete: function() {
				mon.find('.hum-mon-button-text-feed').text('Attack');
				running_ajax = false;
			}
	});

	getDataBlock.done(function () {
		//console.log(dataBlock);
	});


}

/*** End: UI - Configure Modals ***/

/*** Begin: Toggle Buttons ***/

function toggleItem (id) {
	humLabConfigData.labItems[id].enabled = !humLabConfigData.labItems[id].enabled;
	updateConfig();
	laboratoryItems[id].toggleText = getToggleText(humLabConfigData.labItems[id].enabled);
	$(`div#hum-laboratory-item-toggle-${id} > div > span`).text(laboratoryItems[id].toggleText);
}

function configureItem (labItemId) {
	switch (labItemId) {
		case 0:
			modalSelectDefaultHumConfigure(labItemId);
			break;
		case 1:
			modalToggleForHumConfigure(labItemId);
			break;
		default:
			break;
	}
}

function setMainHackuman (labItemId, id, name) {
	humLabConfigData.labItems[labItemId].defaultHackuman.id = parseInt(id);
	humLabConfigData.labItems[labItemId].defaultHackuman.name = name;
    updateConfig();
	updateLaboratoryItems();
	switch (labItemId) {
		case 0:
			$(`div#hum-laboratory-item-0-notes`).html(`<strong>Notes:</strong> ${laboratoryItems[labItemId].notes}`);
			break;
		case 1:
			break;
		default:
			break;
	}

    //log(`New Hackúman ID: ${humLabConfigData.labItems[0].defaultHackuman.id}`);
}

function toggleForHackuman (labItemId, id) {
	try {
		humLabConfigData.labItems[labItemId].hackuman[id].enabled = !humLabConfigData.labItems[labItemId].hackuman[id].enabled;
		$(`div#hum-laboratory-item-toggleForHackuman-${id} > div > span`).text(getToggleText(humLabConfigData.labItems[labItemId].hackuman[id].enabled));
		updateConfig();
		switch (labItemId) {
			case 0:
				break;
			case 1:
				break;
			default:
				break;
		}
	}
	catch (e) {
		log(`error`);
	}

    //log(`New Hackúman ID: ${humLabConfigData.labItems[0].defaultHackuman.id}`);
}

/*** End: Toggle Buttons ***/

/*** Begin: Auto Feed ***/

function initAutoFeed () {
    if (!document.URL.contains(`?`)) {
        autoFeed();
    }
}

function autoFeed () {
	let allHUM = $(document).find(`div[id^="feed_hum_"]`);
	let moves = parseInt($(document).find(`span#HUMActions`).text());
	let movesLeft = parseInt($(document).find(`span#HUMActions`).text());
	let bytesStart = $(document).find(`span#HUMMYPS`).text();
	try {
		bytesStart = bytesStart.replace(`,`, ``);
	}
	catch (e) {

	}
	bytesStart = parseInt(bytesStart);

	$(allHUM).each(function (index, singleHUM) {
		let id = $(singleHUM).attr(`id`).split(`_`)[2];
		let humElement = $(singleHUM).parent().parent().find(`div`)[0];
		let food = $($($(humElement).find(`div.hum-mon-progressbar-container`)[1]).find(`div`)).find(`span`).text();
		let foodCurr = parseInt(food.split(`/`)[0]);
		let foodMax = parseInt(food.split(`/`)[1]);
		let bytesNum = parseInt(bytesStart);

		try {
			if (humLabConfigData.labItems[1].hackuman[id].enabled) {
				while ((foodCurr < (foodMax - 1)) && (movesLeft > 0)) {
					if ((bytesStart - bytesNum) >= 500) {
						log(`Used 500 bytes to feed ${id}`);
						return;
					}
					if ((moves - movesLeft) >= 50) {
						log(`Used 50 moves to feed ${id}`);
						return;
					}
					log(`Feeding ${id}.`);

					let hid = id;
					let mon = $('.hum-mon-container-' + hid);

					var running_ajax = false;

					if(running_ajax) {
						return;
					}

					running_ajax = true;

					mon.find('.hum-mon-button-text-feed').html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');

					let data = {
						action: "do_feed_mon",
						hid: hid,
						my_post_key: my_post_key
					}

					var feedMonster = $.ajax({
						type: "POST",
						url: "hackuman.php?ajax=1",
						data: data,
						dataType: "json",
						async: false,
						success: function(data) {
							if(typeof data == 'object') {
								if(data.hasOwnProperty("errors")) {
									$.each(data.errors, function(i, message) {
										$.jGrowl('Error:  ' + message, { theme: 'jgrowl_error' });
									});
								} else if(data.hasOwnProperty("success")) {
									mon.find('.hum-progress-bar-feed-food').css('width', (data.food / data.maxfood * 100) + '%').next('span').text(Math.ceil(data.food) + ' / ' + Math.ceil(data.maxfood));
									foodCurr = parseInt(Math.ceil(data.food));
									foodMax = parseInt(Math.ceil(data.maxfood));
									movesLeft = parseInt(data.actions_left);
									bytesNum = parseInt(data.bytes);
									//console.log(data);
									//console.log(foodCurr);
									//console.log(foodMax);
								}
							}
						},
						error: function() {
							$.jGrowl('Unknown Error', { theme: 'jgrowl_error' });
						},
						complete: function() {
							mon.find('.hum-mon-button-text-feed').text('Feed');
							running_ajax = false;
						}
					});

					feedMonster.done(function () {
						//console.log(dataBlock);
					});

					//movesLeft = parseInt($(document).find(`span#HUMActions`).text());
					//console.log(movesLeft);
					log(`Finished feeding ${id}.`);
				}
				log(`${id} is not hungry.`);
			}
		}
		catch (e) {

		}
	});
}

/*** End: Auto Feed ***/

/*** Begin: Quick Attack ***/

function initQuickAttack () {
    let myHUM = humLabConfigData.labItems[0].defaultHackuman.id;
    //log(`My Hackúman ID: ${myHUM}`);

    if (document.URL.contains("battle")) {
        battlePage(myHUM);
    }
    //else if (!(window.location.href.indexOf("battle") > -1) && !(window.location.href.indexOf("crew") > -1) && !(window.location.href.indexOf("shop") > -1) && !(window.location.href.indexOf("activity") > -1) && !(window.location.href.indexOf("laboratory") > -1)) {
    //    mainPage();
    //}
}

function battlePage (myHUM) {
	//log(myHUM);
    if (myHUM == 0) {
        alert(`To use Quick Attack, please set a default Hackúman by using the configure button in ${labProfName}.`);
    }
    else {
        let allHUM = $(document).find(`div.hum-mon-container`);

        $(allHUM).each(function (index, singleHUM) {
            let btnRow = $(singleHUM).find(`div > div > div`).last().parent().parent();
            let thisHUM = $(singleHUM).attr(`data-hid`);

            $(btnRow).prepend(`<div class="pro-adv-3d-button hum-mon-button" style="width: 15px; user-select: none;" unselectable="on" onselectstart="return false;" onmousedown="return false;" id="attack_hum_${thisHUM}" onclick="HUM.humAttackHackuman(${thisHUM}, ${myHUM}, 0);"><div><span class="hum-mon-button-text">A</span></div></div>`);
            $(btnRow).append(`<div class="pro-adv-3d-button hum-mon-button" style="width: 15px; user-select: none;" unselectable="on" onselectstart="return false;" onmousedown="return false;" id="attack_hum_${thisHUM}" onclick="HUM.humAttackHackuman(${thisHUM}, ${myHUM}, 1);"><div><span class="hum-mon-button-text">S</span></div></div>`);
        });
    }
}

/*** End: Quick Attack ***/

main();