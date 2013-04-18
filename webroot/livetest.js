var LIVETEST = window.LIVETEST || {};

LIVETEST.General = function (elements) {
	this.tests = {};
	this.elements = elements;
	this.$body = $('body');
	this.$head = $('head');

	this.init();
};
LIVETEST.General.INTERVAL = 100;
LIVETEST.General.prototype = {
	init: function () {
		this.elements.generatePanel();
		this.elements.readStyleSheetToFadeIn();
		this.startInterval();
	},
	startInterval: function () {
		setInterval($.proxy(function () {
			this.runTest();
		}, this), LIVETEST.General.INTERVAL);
	},
	addTest: function (nameTest, functionTest) {
		var
			$panelInner = $('.jsc-live-test-inner'),
			$section = $('<div>').addClass('jsc-live-test-section'),
			$nameTest = $('<div>').addClass('jsc-live-test-title'),
			$valueTest = $('<div>').addClass('jsc-live-test-value');

		if (!this.tests[nameTest]) {
			$nameTest.text(nameTest);
			$section.append($nameTest);
			$section.append($valueTest);
			$panelInner.append($section);

			this.tests[nameTest] = {
				'function': functionTest,
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
		'			<tr>' +
		'				<td><a class="jsc-current" href="javascript: void(0);">General</a></td>' +
		'			</tr>' +
		'		</table>' +
		'	</div>' +
		'	<div id="jsi-live-test-inner-general" class="jsc-live-test-inner jsc-current">' +
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
	this.init();
};
LIVETEST.Tab.prototype = {
	init: function () {
	}
};

var
liveTest,
liveTestElements,
liveTestTab;

if (typeof jQuery === 'function') {
	jQuery(function () {
		liveTestElements = new LIVETEST.Elements();
		liveTest = new LIVETEST.General(liveTestElements);

		liveTest.addTest('window: width', function () {
			return $(window).width() + ' px';
		});
		liveTest.addTest('window: height', function () {
			return $(window).height() + ' px';
		});
		liveTest.addTest('window: scrollTop', function () {
			return $(window).scrollTop() + ' px';
		});
		liveTest.addTest('window: scrollLeft', function () {
			return $(window).scrollLeft() + ' px';
		});
		liveTest.addTest('user agent:', function () {
			return navigator.userAgent;
		});
		liveTest.addTest('hoge', function () {
			return 'hogehoge true hoge falsetrue';
		});
	});
} else {
	console.log('Please load jQuery');
}
