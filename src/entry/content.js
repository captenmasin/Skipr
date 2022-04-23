function init() {
	var currentUrl = window.location.href;
	if ((location.hostname === "youtube.com" || location.hostname === "www.youtube.com") && !(currentUrl.indexOf('?t=') !== -1) && !(currentUrl.indexOf('&t=') !== -1)) {
		var videoId = youtube_parser(currentUrl);
		var gUrl = "https://skipr.masondoes.dev/video?video=" + videoId;
		fetch(gUrl).then(response => response.json()).then(video => {
			runRules(video);
		});
	}
}

init();

function titleModified() {
	init();
}

window.onload = function () {
	var titleEl = document.getElementsByTagName("title")[0];
	var docEl = document.documentElement;

	if (docEl && docEl.addEventListener) {
		docEl.addEventListener("DOMSubtreeModified", function (evt) {
			var t = evt.target;
			if (t === titleEl || (t.parentNode && t.parentNode === titleEl)) {
				titleModified();
			}
		}, false);
	} else {
		document.onpropertychange = function () {
			if (window.event.propertyName == "title") {
				titleModified();
			}
		};
	}
};

function youtube_parser(url) {
	var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
	var match = url.match(regExp);
	return (match && match[7].length == 11) ? match[7] : false;
}

function skipVideo(seconds) {
	var video = document.getElementsByTagName('video')[0];
	video.currentTime = parseInt(seconds);
	// if (video.currentTime) {
	//     video.currentTime = parseInt(seconds);
	// }
	// var interval = setInterval(function () {
	//     if (video.currentTime) {
	//         video.currentTime = parseInt(seconds);
	//         clearInterval(interval);
	//     }
	// }, 500);
}


function runRules(video) {
	chrome.storage.sync.get("skipr_rules", function (items) {
		var rules = items.skipr_rules;
		rules.forEach(function (rule) {
			var passedRules = [];
			passedRules.push(checkRule(rule, video));
			if (typeof rule.and !== 'undefined') {
				rule.and.forEach(function (extraRule) {
					passedRules.push(checkRule(extraRule, video));
				});
			}
			if (!passedRules.includes(false))
				if (parseInt(rule.seconds) > 0) {
					skipVideo(rule.seconds);
				}
		});
	});
}

function checkRule(rule, video) {
	var subject = ''

	if (rule.subject === 'title') {
		subject = video.title;
	}
	if (rule.subject === 'channel') {
		subject = video.channelTitle;
	}
	if (rule.subject === 'date') {
		var timestamp = Date.parse(video.publishedAt);
		// var dateObject = new Date(timestamp);
		subject = timestamp;
	}
	if (subject !== 'date') {
		switch (rule.modifier) {
			case 'starts_with':
				if (rule.string !== '' && subject.startsWith(rule.string)) {
					return true;
				}
				break;
			case 'ends_with':
				if (rule.string !== '' && subject.endsWith(rule.string)) {
					return true;
				}
				break;
			case 'contains':
				if (rule.string !== '' && subject.includes(rule.string)) {
					return true;
				}
				break;
			case 'equals':
				if (rule.string !== '' && subject === rule.string) {
					return true;
				}
				break;
			case 'not_equals':
				if (rule.string !== '' && subject !== rule.string) {
					return true;
				}
				break;
		}
	} else {
		let date = new Date(rule.string);
		switch (rule.modifier) {
			case 'newer_than':
				if (subject > date) {
					return true;
				}
				break;
			case 'older_than':
				if (subject < date) {
					return true;
				}
				break;
		}
	}
	return false;
}
