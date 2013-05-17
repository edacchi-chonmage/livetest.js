var LIVETEST = window.LIVETEST || {
	INTERVAL: {
		WRAP: 100
	}
};

LIVETEST.wrap = function () {
	if (typeof jQuery === 'undefined' ||
		typeof $ === 'undefined') {
		if (!document.getElementById('jQuery')) {
			document.write('<script id="jQuery" src="//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>');
		}

		setTimeout(function () {
			LIVETEST.wrap();
		}, LIVETEST.INTERVAL.WRAP);
		
		return false;
	}

	LIVETEST.General = function () {
		this.testcases = {};
		this.tab = new LIVETEST.Tab();
		this.countPassingSpecs = 0;
		this.$countPassingSpecs = null;
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
			'				<td id="jsi-lt-status-passing">' +
			'					Passing <span id="jsi-lt-status-count-spec">0</span> specs' +
			'				</td>' +
			'				<td id="jsi-lt-status-last"></td>' +
			'			</tr>' +
			'		</table>' +
			'		<p id="jsi-lt-footer-specs">' +
			'		</p>' +
			'	</div>' +
			'</div>'
		);
		this.$style = $('<style type="text/css">').html('#jsi-live-test{z-index:9999;position:fixed;left:0;bottom:0;width:100%;height:300px;background:#1b1d1e;margin:0;padding:1px!important;color:#fff;font-family:Helvetica,Arial,Verdana,"ヒラギノ角ゴ ProN W3","Hiragino Kaku Gothic ProN","メイリオ",Meiryo,"ＭＳ Ｐゴシック","MS PGothic",sans-serif;font-size:12px;box-shadow:0 0 20px rgba(0,0,0,.3)}#jsi-live-test,#jsi-live-test div,#jsi-live-test p,#jsi-live-test td{margin:0;padding:0}#jsi-live-test a{text-decoration:none}#jsi-lt-tab{background:#f8f8f2;padding:0}#jsi-lt-tab table{border-collapse:collapse}#jsi-lt-tab td a{display:block;height:100%;padding:1px 10px;color:#fff;background:#a9a9a9;text-decoration:underline}#jsi-lt-tab td a.jsc-current{background:#1b1d1e;text-decoration:none}#jsi-lt-outputs{overflow:auto}.jsc-lt-output{display:none;height:200px;margin-top:1px!important}.jsc-lt-output{display:none}.jsc-lt-output.jsc-current{display:block}.jsc-lt-output table{border-collapse:collapse}.jsc-lt-output table th{width:25px;min-width:25px;background:#232526;color:#425558;text-align:center;vertical-align:top}.jsc-lt-output table td{padding:0 5px 10px!important}.jsc-lt-op-name{color:#fb9632}.jsc-lt-op-value{padding-left:20px!important}.jsc-lt-true{color:#8adc40!important}.jsc-lt-false{color:#f62c5e!important}#jsi-lt-status{width:100%;background:#303030;text-align:center;border-collapse:collapse;font-size:11px;font-weight:bold}#jsi-lt-status td{height:14px;vertical-align:middle}#jsi-lt-status-name{position:relative;min-width:60px;padding:0 7px!important;background:#fff;color:#0a5f5f}#jsi-lt-status-passing:before{content:"";position:absolute;top:2px;left:-5px;display:block;width:10px;height:10px;background:#fff;-webkit-transform:rotate(45deg)}#jsi-lt-status-passing{position:relative;min-width:140px;padding-left:5px!important;background:#1488ad}#jsi-lt-status-last:before{content:"";position:absolute;top:2px;left:-5px;display:block;width:10px;height:10px;background:#1488ad;-webkit-transform:rotate(45deg)}#jsi-lt-status-last{position:relative;width:100%}#jsi-lt-footer-specs{overflow:auto;padding:5px!important}.jsc-lt-footer-spec{display:none;height:30px}.jsc-lt-footer-spec.jsc-current{display:block}.jsc-lt-footer-spec a{display:inline-block;padding:0 5px;color:#425558}');
		this.$tab = this.$panel.find('#jsi-lt-tab');
		this.$footer = this.$panel.find('#jsi-lt-footer');
		this.$outputs = this.$panel.find('#jsi-lt-outputs');

		this.init();
	};
	LIVETEST.General.DURATION = {
		FADEIN_INIT: 300
	};
	LIVETEST.General.BASE_ELEMENTS = {
		$TEST_SECTION: $(
			'<tr>' +
			'	<th class="jsc-lt-op-spec">●</th>' +
			'	<td>' +
			'		<div class="jsc-lt-op-name"></div>' +
			'		<div class="jsc-lt-op-description"></div>' +
			'		<div class="jsc-lt-op-value"></div>' +
			'	</td>' +
			'</tr>'
		),
		$FOOTER_SPEC_CIRCLE: $(
			'<a hrev="javascript: void(0);">●</a>'
		)
	};
	LIVETEST.General.CLASS = {
		BOOL: {
			TRUE: 'jsc-lt-true',
			FALSE: 'jsc-lt-false'
		},
		OUTPUT: {
			BASE: 'jsc-lt-output',
			SPEC: 'jsc-lt-op-spec',
			NAME: 'jsc-lt-op-name',
			VALUE: 'jsc-lt-op-value',
			TABLE: 'jsc-lt-op-table'
		}
	};
	LIVETEST.General.REGEX = {
		COLOR_BOOL: /(true|false)/ig
	};
	LIVETEST.General.REPLACE = {
		COLOR_BOOL: '<span class="jsc-lt-$1">$1</span>'
	};
	LIVETEST.General.INTERVAL = 50;
	LIVETEST.General.prototype = {
		init: function () {
			this.generatePanel();
			this.tab.getElements();
			this.readStyleSheetToFadeInPanel();
			this.startInterval();
			this.calculateToSetOuptputHeight();
		},
		generatePanel: function () {
			this.$body.append(this.$panel);
			this.$countPassingSpecs = $('#jsi-lt-status-count-spec');
		},
		readStyleSheetToFadeInPanel: function () {
			this.$head.append(this.$style);

			// The timeout for read css delay.
			setTimeout($.proxy(function () {
				this.$panel.fadeIn(LIVETEST.General.DURATION.FADEIN_INIT);
			}, this), 0);
		},
		calculateToSetOuptputHeight: function () {
			var
				heightOutputs = 0,
				heightPanel = this.$panel.height(),
				heightTab = this.$tab.height(),
				heightFooter = this.$footer.height();

			heightOutputs = heightPanel - heightTab - heightFooter;

			this.$outputs.height(heightOutputs);

			if (heightTab === 0) {
				// For not read syltes.
				setTimeout($.proxy(this.calculateToSetOuptputHeight, this), LIVETEST.General.INTERVAL);
			}
		},
		startInterval: function () {
			setInterval($.proxy(function () {
				this.runTest();
			}, this), LIVETEST.General.INTERVAL);
		},
		addTestcase: function (testcase) {
			var
				$tableOutput,
				$specFooter,
				nameTab = (testcase.nameTab) ? testcase.nameTab : LIVETEST.Tab.NAME.GENERAL,
				$testsection = LIVETEST.General.BASE_ELEMENTS.$TEST_SECTION.clone(),
				$specFooterCircle = LIVETEST.General.BASE_ELEMENTS.$FOOTER_SPEC_CIRCLE.clone(),
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

				$specFooter = this.tab.$specsFooter.find('.' + LIVETEST.Tab.CLASS.FOOTER_SPEC);
				$specFooter = $specFooter.eq(this.tab.indexTabs[nameTab]);

				$nameTest.text(testcase.nameTest);
				$tableOutput.append($testsection);
				$specFooter.append($specFooterCircle);

				this.runTest();

				this.testcases[testcase.nameTest] = testcase;
				this.testcases[testcase.nameTest].$specTest = $testsection.find('.' + LIVETEST.General.CLASS.OUTPUT.SPEC);
				this.testcases[testcase.nameTest].$nameTest = $nameTest;
				this.testcases[testcase.nameTest].$valueTest = $valueTest;
				this.testcases[testcase.nameTest].$specFooterCircle = $specFooterCircle;
			}
		},
		runTest: function () {
			var
				nameTest,
				resultOutput,
				testcaseTarget;

			this.countPassingSpecs = 0;

			for (nameTest in this.testcases) {
				testcaseTarget = this.testcases[nameTest];

				if (testcaseTarget.flgRanFirst && testcaseTarget.flgNoInterval) {
					continue;
				}

				if (this.tab.indexTabs[testcaseTarget.nameTab] !== this.tab.indexCurrent) {
					// Through the hidden tab.
					continue;
				}

				resultOutput = testcaseTarget.functionOutput();
				this.checkSpec(testcaseTarget);
				testcaseTarget.$valueTest
					.text(resultOutput);

				testcaseTarget.flgRanFirst = true;
			}

			this.$countPassingSpecs.text(this.countPassingSpecs);
			this.changeColorBoolean();
		},
		checkSpec: function (testcaseTarget) {
			testcaseTarget.$specTest.removeClass(LIVETEST.General.CLASS.BOOL.TRUE);
			testcaseTarget.$specTest.removeClass(LIVETEST.General.CLASS.BOOL.FALSE);
			testcaseTarget.$specFooterCircle.removeClass(LIVETEST.General.CLASS.BOOL.TRUE);
			testcaseTarget.$specFooterCircle.removeClass(LIVETEST.General.CLASS.BOOL.FALSE);

			if (typeof testcaseTarget.functionTest !== 'function') {
				return;
			}

			if (testcaseTarget.functionTest()) {
				testcaseTarget.$specTest.addClass(LIVETEST.General.CLASS.BOOL.TRUE);
				testcaseTarget.$specFooterCircle.addClass(LIVETEST.General.CLASS.BOOL.TRUE);
				this.countPassingSpecs++;
			} else {
				testcaseTarget.$specTest.addClass(LIVETEST.General.CLASS.BOOL.FALSE);
				testcaseTarget.$specFooterCircle.addClass(LIVETEST.General.CLASS.BOOL.FALSE);
			}
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
		this.indexCurrent = 0;
		this.indexTabs = {};
		this.$outputs = null;
		this.$linksInTab = null;
		this.$list = null;
		this.$specsFooter = null;
	};
	LIVETEST.Tab.NAME = {
		GENERAL: 'General'
	};
	LIVETEST.Tab.CLASS = {
		CURRENT: 'jsc-current',
		FOOTER_SPEC: 'jsc-lt-footer-spec'
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
		),
		$FOOTER_SPEC: $(
			'<div class="jsc-lt-footer-spec">' +
			'</div>'
		)
	};
	LIVETEST.Tab.COUNT_FIRST_TAB = 1;
	LIVETEST.Tab.prototype = {
		getElements: function () {
			this.$outputs = $('#jsi-lt-outputs');
			this.$list = $('#jsi-lt-tab-list');
			this.$specsFooter = $('#jsi-lt-footer-specs');
		},
		bindEvent: function () {
			var
				nameTab = '',
				_self = this;

			this.$linksInTab.off('click');
			this.$linksInTab.on('click', function () {
				nameTab = $(this).text();
				_self.change(nameTab, _self);
			});
		},
		add: function (nameTab) {
			var
				lengthTabs,
				$tabAdd = LIVETEST.Tab.BASE_ELEMENTS.$TAB.clone(),
				$linkAdd = $tabAdd.find('a'),
				$output = LIVETEST.Tab.BASE_ELEMENTS.$OUTPUT.clone(),
				$specFooter = LIVETEST.Tab.BASE_ELEMENTS.$FOOTER_SPEC.clone();

			this.$outputs.append($output);
			$linkAdd.text(nameTab);
			$tabAdd.append($linkAdd);
			this.$specsFooter.append($specFooter);

			lengthTabs = Object.keys(this.indexTabs).length;
			this.indexTabs[nameTab] = lengthTabs;

			this.$list.append($tabAdd);
			this.$linksInTab = this.$list.find('a');
			lengthTabs = Object.keys(this.indexTabs).length;

			if (lengthTabs === LIVETEST.Tab.COUNT_FIRST_TAB) {
				this.change(nameTab, this);
			}

			this.bindEvent();
		},
		change: function (nameTab, _self) {
			_self.indexCurrent = _self.indexTabs[nameTab];

			var
				$linkTarget = _self.$linksInTab.eq(_self.indexCurrent),
				$outputsChildren = _self.$outputs.find('.' + LIVETEST.General.CLASS.OUTPUT.BASE),
				$outputTarget = $outputsChildren.eq(_self.indexCurrent),
				$specsFooterChildren = _self.$specsFooter.find('.' + LIVETEST.Tab.CLASS.FOOTER_SPEC),
				$specFooterTarget = $specsFooterChildren.eq(_self.indexCurrent);

			if ($linkTarget.hasClass(LIVETEST.Tab.CLASS.CURRENT)) {
				return;
			}

			_self.$linksInTab.removeClass(LIVETEST.Tab.CLASS.CURRENT);
			$outputsChildren.removeClass(LIVETEST.Tab.CLASS.CURRENT);
			$specsFooterChildren.removeClass(LIVETEST.Tab.CLASS.CURRENT);

			$linkTarget.addClass(LIVETEST.Tab.CLASS.CURRENT);
			$outputTarget.addClass(LIVETEST.Tab.CLASS.CURRENT);
			$specFooterTarget.addClass(LIVETEST.Tab.CLASS.CURRENT);
		}
	};

	var liveTest;

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
			},
			functionTest: function () {
				return $(window).scrollTop() >= 100;
			}
		});
		liveTest.addTestcase({
			nameTest: 'window: scrollLeft',
			nameTab: 'hogehoge',
			functionOutput: function () {
				return $(window).scrollLeft() + ' px';
			},
			functionTest: function () {
				return $(window).scrollLeft() >= 0;
			}
		});
		liveTest.addTestcase({
			nameTest: 'test',
			nameTab: 'test',
			functionOutput: function () {
				return 'true false trflafalse';
			}
		});
		liveTest.addTestcase({
			nameTest: 'test1',
			nameTab: 'test1',
			functionOutput: function () {
				return 'true false trflafalse';
			}
		});
		liveTest.addTestcase({
			nameTest: 'test2',
			nameTab: 'test1',
			functionOutput: function () {
				return 'true false trflafalse';
			}
		});
	});
};

LIVETEST.wrap();
