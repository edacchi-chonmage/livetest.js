var LIVETEST = window.LIVETEST || {};

LIVETEST.General = function (elements, tab) {
	this.tests = {};
	this.elements = elements;
	this.tab = tab;
	this.$body = $('body');
	this.$head = $('head');

	this.init();
};
LIVETEST.General.INTERVAL = 100;
LIVETEST.General.prototype = {
	init: function () {
		this.elements.generatePanel();
		this.tab.getElements();
		this.elements.readStyleSheetToFadeIn();
		this.startInterval();
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
			$section = $('<div>').addClass('jsc-live-test-section'),
			$nameTest = $('<div>').addClass('jsc-live-test-title'),
			$valueTest = $('<div>').addClass('jsc-live-test-value');

		if (!test.tab) {
			test.tab = LIVETEST.Tab.NAME.GENERAL;
		}

		if (!this.tests[test.name]) {
			if (typeof this.tab.indexTabs[nameTab] === 'undefined') {
				this.tab.add(nameTab);
			}

			$panelInner = $('.jsc-lt-inner-table');
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
		this.elements.$panel.find('.jsc-live-test-value').each(function () {
			$(this).html($(this).text().replace(/(true|false)/ig, '<span class="jsc-live-test-value-$1">$1</span>'));
		});
	}
};

LIVETEST.Elements = function () {
	this.$body = $('body');
	this.$head = $('head');
	this.$panel = null;
};
LIVETEST.Elements.PATH = {
	CSS: '/livetest.css'
};
LIVETEST.Elements.DURATION = {
	FADEIN_INIT: 500
};
LIVETEST.Elements.HTML = {
	PANEL:
		'<div id="jsi-live-test" style="display: none;">' +
		'	<div id="jsi-live-test-tab">' +
		'		<table>' +
		'			<tr id="jsi-lt-tab-inner">' +
		'			</tr>' +
		'		</table>' +
		'	</div>' +
		'	<div id="jsi-lt-inner-wrapper">' +
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
};
LIVETEST.Elements.prototype = {
	generatePanel: function () {
		this.$panel = $(LIVETEST.Elements.HTML.PANEL);
		this.$body.append(this.$panel);
	},
	readStyleSheetToFadeIn: function () {
		this.$head.append('<link rel="stylesheet" href="' + LIVETEST.Elements.PATH.CSS + '" />');

		// The timeout for read css delay.
		setTimeout($.proxy(function () {
			this.$panel.fadeIn(LIVETEST.Elements.DURATION.FADEIN_INIT);
		}, this), 0);
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
		'		<div class="jsc-lt-inner">' +
		'			<table class="jsc-lt-inner-table">' +
		'			</table>' +
		'		</div>'
};
LIVETEST.Tab.prototype = {
	getElements: function () {
		this.$base = $('#jsi-lt-tab');
		this.$inner = $('#jsi-lt-tab-inner');
	},
	add: function (nameTab) {
		var
			$tabAdd = $('<td>'),
			$linkAdd = $('<a>', {
				href: 'javascript: void(0);'
			}),
			$ltInner = $('<div>').addClass('jsc-lt-inner'),
			$ltInnerTable = $('<table>').addClass('jsc-lt-inner-table');

		$ltInner.append($ltInnerTable);
		$('#jsi-lt-inner-wrapper').append($ltInner);

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
			$ltInnerTarget = $('.jsc-lt-inner').eq(this.indexTabs[nameTab]);

		$linkTarget.addClass(LIVETEST.Tab.CLASS.CURRENT);
		$ltInnerTarget.addClass(LIVETEST.Tab.CLASS.CURRENT);
	}
};

var
liveTest,
liveTestElements,
liveTestTab;

if (typeof jQuery === 'function') {
	jQuery(function () {
		liveTestElements = new LIVETEST.Elements();
		liveTestTab = new LIVETEST.Tab();
		liveTest = new LIVETEST.General(liveTestElements, liveTestTab);

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
		liveTest.addTest({
			name: 'test',
			tab: 'test',
			functionOutput: function () {
				return $(window).scrollLeft() + ' px';
			}
		});
	});
} else {
	console.log('Please load jQuery');
}
