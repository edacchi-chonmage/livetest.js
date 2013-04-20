var LIVETEST = window.LIVETEST || {};

LIVETEST.General = function () {
	this.testcases = {};
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
		'	<div id="jsi-lt-outputs">' +
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
LIVETEST.General.BASE_ELEMENTS = {
	$TEST_SECTION: $(
		'<tr>' +
		'	<th>●</th>' +
		'	<td>' +
		'		<div class="jsc-lt-op-name"></div>' +
		'		<div class="jsc-lt-op-value"></div>' +
		'	</td>' +
		'</tr>'
	)
};
LIVETEST.General.CLASS = {
	OUTPUT: {
		NAME: 'jsc-lt-op-name',
		VALUE: 'jsc-lt-op-value',
		TABLE: 'jsc-lt-op-table'
	}
};
LIVETEST.General.REGEX = {
	COLOR_BOOL: /(true|false)/ig
};
LIVETEST.General.REPLACE = {
	COLOR_BOOL: '<span class="jsc-lt-value-$1">$1</span>'
};
LIVETEST.General.INTERVAL = 50;
LIVETEST.General.prototype = {
	init: function () {
		this.generatePanel();
		this.tab.getElements();
		this.readStyleSheetToFadeInPanel();
		this.startInterval();
	},
	generatePanel: function () {
		this.$body.append(this.$panel);
	},
	readStyleSheetToFadeInPanel: function () {
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
	addTestcase: function (testcase) {
		var
			$tableOutput = null,
			nameTab = (testcase.nameTab) ? testcase.nameTab : LIVETEST.Tab.NAME.GENERAL,
			$testsection = LIVETEST.General.BASE_ELEMENTS.$TEST_SECTION.clone(),
			$nameTest = $testsection.find('.' + LIVETEST.General.CLASS.OUTPUT.NAME),
			$valueTest = $testsection.find('.' + LIVETEST.General.CLASS.OUTPUT.VALUE),
			testcaseTarget = this.testcases[testcase.nameTest];

		if (!testcase.nameTab) {
			testcase.nameTab = LIVETEST.Tab.NAME.GENERAL;
		}

		if (!this.testcases[testcase.nameTest]) {
			if (typeof this.tab.indexTabs[nameTab] === 'undefined') {
				// Nothing a tab.
				this.tab.add(nameTab);
			}

			$tableOutput = this.$panel.find('.' + LIVETEST.General.CLASS.OUTPUT.TABLE);
			$tableOutput = $tableOutput.eq(this.tab.indexTabs[nameTab]);

			$nameTest.text(testcase.nameTest);
			$tableOutput.append($testsection);

			this.testcases[testcase.nameTest] = testcase;
			this.testcases[testcase.nameTest].$nameTest = $nameTest;
			this.testcases[testcase.nameTest].$valueTest = $valueTest;
		}
	},
	runTest: function () {
		for (var nameTest in this.testcases) {
			this.testcases[nameTest].$valueTest
				.text(this.testcases[nameTest].functionOutput());
		}

		this.changeColorBoolean();
	},
	changeColorBoolean: function () {
		var
			$valueTest,
			valueColored,
			$valuesTest = this.$panel.find('.' + LIVETEST.General.CLASS.OUTPUT.VALUE);

		$valuesTest.each(function () {
			$valueTest = $(this);
			valueColored = $valueTest.text().replace(
				LIVETEST.General.REGEX.COLOR_BOOL,
				LIVETEST.General.REPLACE.COLOR_BOOL
			);

			$valueTest.html(valueColored);
		});
	}
};

LIVETEST.Tab = function () {
	this.currentIndex = 0;
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
		'			<table class="jsc-lt-op-table">' +
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
			$ltInnerTable = $('<table>').addClass('jsc-lt-op-table');

		$ltInner.append($ltInnerTable);
		$('#jsi-lt-outputs').append($ltInner);

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
		liveTest.addTestcase({
			nameTest: 'window: width',
			functionOutput: function () {
				return $(window).width() + ' px';
			}
		});
		liveTest.addTestcase({
			nameTest: 'window: height',
			functionOutput: function () {
				return $(window).height() + ' px';
			}
		});
		liveTest.addTestcase({
			nameTest: 'window: scrollTop',
			functionOutput: function () {
				return $(window).scrollTop() + ' px';
			}
		});
		liveTest.addTestcase({
			nameTest: 'window: scrollLeft',
			functionOutput: function () {
				return $(window).scrollLeft() + ' px';
			}
		});
		liveTest.addTestcase({
			nameTest: 'test',
			functionOutput: function () {
				return 'true false trflafalse';
			}
		});
	});
} else {
	console.log('Please load jQuery');
}
