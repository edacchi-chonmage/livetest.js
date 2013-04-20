var LIVETEST = window.LIVETEST || {};

LIVETEST.General = function () {
	this.tests = {};
	this.tab = new LIVETEST.Tab();
	this.$body = $('body');
	this.$head = $('head');
	this.$panel = $(
		'<div id="jsi-live-test" style="display: none;">' +
		'	<div id="jsi-lt-tab">' +
		'		<table>' +
		'			<tr id="jsi-lt-tab-list">' +
		'			</tr>' +
		'		</table>' +
		'	</div>' +
		'	<div id="jsi-lt-output-wrapper">' +
		'	</div>' +
		'	<div id="jsi-lt-footer">' +
		'		<table id="jsi-lt-status">' +
		'			<tr>' +
		'				<td id="jsi-lt-status-name">LIVETEST</td>' +
		'				<td id="jsi-lt-status-passing">Pssing 0 specs</td>' +
		'				<td id="jsi-lt-status-last"></td>' +
		'			</tr>' +
		'		</table>' +
		'		<p id="jsi-lt-specs">' +
		'		</p>' +
		'	</div>' +
		'</div>'
	);

	this.init();
};
LIVETEST.General.PATH = {
	CSS: '/livetest.css'
};
LIVETEST.General.DURATION = {
	FADEIN_INIT: 300
};
LIVETEST.General.INTERVAL = 50;
LIVETEST.General.prototype = {
	init: function () {
		this.generatePanel();
		this.tab.getElements();
		this.readStyleSheetToFadeIn();
		this.startInterval();
	},
	generatePanel: function () {
		this.$body.append(this.$panel);
	},
	readStyleSheetToFadeIn: function () {
		this.$head.append('<link rel="stylesheet" href="' + LIVETEST.General.PATH.CSS + '" />');

		// The timeout for read css delay.
		setTimeout($.proxy(function () {
			this.$panel.fadeIn(LIVETEST.General.DURATION.FADEIN_INIT);
		}, this), 0);
	},
	startInterval: function () {
		setInterval($.proxy(function () {
			this.runTest();
		}, this), LIVETEST.General.INTERVAL);
	},
	addTest: function (test) {
		var
			$panelInner = null,
			nameTab = (test.tab) ? test.tab : LIVETEST.Tab.NAME.GENERAL,
			$rowTable = $('<tr>'),
			$thTable = $('<th>').text('●'),
			$tdTable = $('<td>'),
			$section = $('<div class="jsc-lt-section">'),
			$nameTest = $('<div class="jsc-lt-title">'),
			$valueTest = $('<div class="jsc-lt-value">');

		if (!test.tab) {
			test.tab = LIVETEST.Tab.NAME.GENERAL;
		}

		if (!this.tests[test.name]) {
			if (typeof this.tab.indexTabs[nameTab] === 'undefined') {
				this.tab.add(nameTab);
			}

			$panelInner = $('.jsc-lt-output-table');
			$panelInner = $panelInner.eq(this.tab.indexTabs[nameTab]);

			$nameTest.text(test.name);
			$section.append($nameTest);
			$section.append($valueTest);
			$tdTable.append($section);
			$rowTable
				.append($thTable)
				.append($tdTable);
			$panelInner.append($rowTable);

			this.tests[test.name] = {
				'function': test.functionOutput,
				$nameTest: $nameTest,
				$valueTest: $valueTest
			};
		}
	},
	runTest: function () {
		for (var key in this.tests) {
			this.tests[key].$valueTest.text(this.tests[key]['function']());
		}

		this.changeColorBoolean();
	},
	changeColorBoolean: function () {
		this.$panel.find('.jsc-lt-value').each(function () {
			$(this).html($(this).text().replace(/(true|false)/ig, '<span class="jsc-lt-value-$1">$1</span>'));
		});
	}
};

LIVETEST.Tab = function () {
	this.indexTabs = {};
	this.$linksInTab = null;
	this.$base = null;
	this.$inner = null;
};
LIVETEST.Tab.NAME = {
	GENERAL: 'General'
};
LIVETEST.Tab.CLASS = {
	CURRENT: 'jsc-current'
};
LIVETEST.Tab.HTML = {
	INNER:
		'		<div class="jsc-lt-output">' +
		'			<table class="jsc-lt-output-table">' +
		'			</table>' +
		'		</div>'
};
LIVETEST.Tab.prototype = {
	getElements: function () {
		this.$base = $('#jsi-lt-tab');
		this.$inner = $('#jsi-lt-tab-list');
	},
	add: function (nameTab) {
		var
			$tabAdd = $('<td>'),
			$linkAdd = $('<a>', {
				href: 'javascript: void(0);'
			}),
			$ltInner = $('<div>').addClass('jsc-lt-output'),
			$ltInnerTable = $('<table>').addClass('jsc-lt-output-table');

		$ltInner.append($ltInnerTable);
		$('#jsi-lt-output-wrapper').append($ltInner);

		$linkAdd.text(nameTab);
		$tabAdd.append($linkAdd);
		this.indexTabs[nameTab] = Object.keys(this.indexTabs).length;

		this.$inner.append($tabAdd);
		this.$linksInTab = this.$inner.find('a');

		if (Object.keys(this.indexTabs).length === 1) {
			this.change(nameTab);
		}
	},
	remove: function () {
	},
	change: function (nameTab) {
		var
			$linkTarget = this.$linksInTab.eq(this.indexTabs[nameTab]),
			$ltInnerTarget = $('.jsc-lt-output').eq(this.indexTabs[nameTab]);

		$linkTarget.addClass(LIVETEST.Tab.CLASS.CURRENT);
		$ltInnerTarget.addClass(LIVETEST.Tab.CLASS.CURRENT);
	}
};

var liveTest;

if (typeof jQuery === 'function') {
	jQuery(function () {
		liveTest = new LIVETEST.General();

		// Default test
		liveTest.addTest({
			name: 'window: width',
			functionOutput: function () {
				return $(window).width() + ' px';
			}
		});
		liveTest.addTest({
			name: 'window: height',
			functionOutput: function () {
				return $(window).height() + ' px';
			}
		});
		liveTest.addTest({
			name: 'window: scrollTop',
			functionOutput: function () {
				return $(window).scrollTop() + ' px';
			}
		});
		liveTest.addTest({
			name: 'window: scrollLeft',
			functionOutput: function () {
				return $(window).scrollLeft() + ' px';
			}
		});
		// liveTest.addTest({
		// 	name: 'test',
		// 	tab: 'test',
		// 	functionOutput: function () {
		// 		return $(window).scrollLeft() + ' px';
		// 	}
		// });
	});
} else {
	console.log('Please load jQuery');
}
