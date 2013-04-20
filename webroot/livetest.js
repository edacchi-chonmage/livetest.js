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
		BASE: 'jsc-lt-output',
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
			$tableOutput,
			nameTab = (testcase.nameTab) ? testcase.nameTab : LIVETEST.Tab.NAME.GENERAL,
			$testsection = LIVETEST.General.BASE_ELEMENTS.$TEST_SECTION.clone(),
			$nameTest = $testsection.find('.' + LIVETEST.General.CLASS.OUTPUT.NAME),
			$valueTest = $testsection.find('.' + LIVETEST.General.CLASS.OUTPUT.VALUE);

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
	this.$outputs = null;
	this.$linksInTab = null;
	this.$list = null;
};
LIVETEST.Tab.NAME = {
	GENERAL: 'General'
};
LIVETEST.Tab.CLASS = {
	CURRENT: 'jsc-current'
};
LIVETEST.Tab.BASE_ELEMENTS = {
	$OUTPUT: $(
		'<div class="jsc-lt-output">' +
		'	<table class="jsc-lt-op-table">' +
		'	</table>' +
		'</div>'
	),
	$TAB: $(
		'<td>' +
		'	<a href="javascript: void(0);"></a>' +
		'</td>'
	)
};
LIVETEST.Tab.COUNT_FIRST_TAB = 1;
LIVETEST.Tab.prototype = {
	getElements: function () {
		this.$outputs = $('#jsi-lt-outputs');
		this.$list = $('#jsi-lt-tab-list');
	},
	add: function (nameTab) {
		var
			lengthTabs,
			$tabAdd = LIVETEST.Tab.BASE_ELEMENTS.$TAB.clone(),
			$linkAdd = $tabAdd.find('a'),
			$output = LIVETEST.Tab.BASE_ELEMENTS.$OUTPUT.clone();

		this.$outputs.append($output);
		$linkAdd.text(nameTab);
		$tabAdd.append($linkAdd);

		lengthTabs = Object.keys(this.indexTabs).length;
		this.indexTabs[nameTab] = lengthTabs;

		this.$list.append($tabAdd);
		this.$linksInTab = this.$list.find('a');
		lengthTabs = Object.keys(this.indexTabs).length;

		if (lengthTabs === LIVETEST.Tab.COUNT_FIRST_TAB) {
			this.change(nameTab);
		}
	},
	remove: function () {
	},
	change: function (nameTab) {
		var
			$linkTarget = this.$linksInTab.eq(this.indexTabs[nameTab]),
			$outputsChildren = this.$outputs.find('.' + LIVETEST.General.CLASS.OUTPUT.BASE),
			$outputTarget = $outputsChildren.eq(this.indexTabs[nameTab]);

		this.$linksInTab.removeClass(LIVETEST.Tab.CLASS.CURRENT);
		$outputsChildren.removeClass(LIVETEST.Tab.CLASS.CURRENT);

		$linkTarget.addClass(LIVETEST.Tab.CLASS.CURRENT);
		$outputTarget.addClass(LIVETEST.Tab.CLASS.CURRENT);
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
			nameTab: 'test',
			functionOutput: function () {
				return 'true false trflafalse';
			}
		});
	});
} else {
	console.log('Please load jQuery');
}
