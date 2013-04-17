var LiveTest = function () {
	this.tests = {};
	this.$body = $('body');
	this.$head = $('head');
	this.$panel = $('<dl>').attr('id', 'jsi-live-test');

	this.init();
};
LiveTest.INTERVAL = 100;
LiveTest.PATH = {
	CSS: '/livetest.css'
};
LiveTest.prototype = {
	init: function () {
		this.generatePanel();
		this.readStyleSheet();
		this.startInterval();
	},
	startInterval: function () {
		setInterval($.proxy(function () {
			this.runTest();
		}, this), LiveTest.INTERVAL);
	},
	readStyleSheet: function () {
		this.$head.append('<link rel="stylesheet" href="' + LiveTest.PATH.CSS + '" />');
	},
	addTest: function (nameTest, functionTest) {
		var
			$nameTest = $('<dt>'),
			$valueTest = $('<dd>');

		if (!this.tests[nameTest]) {
			$nameTest.text(nameTest);
			this.$panel.append($nameTest);
			this.$panel.append($valueTest);

			this.tests[nameTest] = {
				'function': functionTest,
				$nameTest: $nameTest,
				$valueTest: $valueTest
			};
		}

		this.runTest();
	},
	runTest: function () {
		for (var key in this.tests) {
			this.tests[key].$valueTest.text(this.tests[key]['function']());
		}

		this.stylingPanel();
	},
	generatePanel: function () {
		this.$body.append(this.$panel);
	},
	stylingPanel: function () {
		this.$panel.find('dt').css({
			color: '#fff'
		});
		this.$panel.find('dd').css({
			color: '#ccc'
		});
	}
};

var liveTest;

$(function () {
	liveTest = new LiveTest();

	liveTest.addTest('widthWindow', function () {
		return $(window).width() + 'px';
	});
	liveTest.addTest('heightWindow', function () {
		return $(window).height() + 'px';
	});
});
