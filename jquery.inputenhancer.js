/*!
 * @license jquery-inputenhancer Copyright(c) 2014 sasa+1
 * https://github.com/sasaplus1/jquery-inputenhancer
 * Released under the MIT license.
 */

// drop this code when minified.
// drop console functions as well.
if (typeof DEBUG !== 'undefined') {
  (!window.console) && (window.console = {
    log: function() {}
  });
}

;(function(factory) {
  if (typeof define === 'function' && !!define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    factory(jQuery);
  }
}(function($) {

  var NAMESPACE = '.inputenhancer',
      isIE, isFx, getSelectionPos;

  // target is IE8 and IE9.
  isIE = (!!document.uniqueID && !!window.attachEvent);
  isFx = (typeof document.documentElement.style.MozAppearance !== 'undefined');
  isSf = (!window.chrome &&
    typeof document.documentElement.style.webkitAppearance !== 'undefined');

  console.log('env /', 'IE:', isIE, 'Fx:', isFx, 'Sf:', isSf);

  /**
   * get selection range positions.
   *
   * @param {Object} element input element.
   * @return {Object} selection range positions.
   */
  getSelectionPos = (!!window.getSelection) ? function(element) {
    return {
      start: element.selectionStart,
      end: element.selectionEnd
    };
  } : function(element) {
    var base, clone, startPos;

    element.focus();

    base = document.selection.createRange();
    clone = base.duplicate();
    clone.expand('textedit');
    clone.setEndPoint('EndToEnd', base);

    startPos = clone.text.length - base.text.length;

    return {
      start: startPos,
      end: startPos + base.text.length
    };
  };

  /**
   * trigger onInput polyfill for IE8 and IE9.
   *
   * @param {Object} event event object.
   */
  function onTriggerInput(event) {
    var that = this.inputenhancer_.jq;

    console.log('onTriggerInput');

    setTimeout(function() {
      console.log('onTriggerInput /', 'trigger pseudo-input');

      that.trigger('pseudo-input' + NAMESPACE);
    }, 0);
  }

  /**
   * trigger for onInput.
   *
   * @param {Object} event event object.
   */
  function onPseudoInput(event) {
    var input = this.inputenhancer_;

    console.log(
        'onPseudoInput',
        'this.value:', this.value,
        'beforeText:', input.beforeText);

    if (this.value === input.beforeText) {
      return;
    }

    console.log(
        'onPseudoInput /',
        'beforeText = this.value: ', this.value,
        'trigger input');

    input.beforeText = this.value;
    input.jq.trigger('input');
  }

  /**
   * onKeyDown event handler for Firefox.
   *
   * @param {Object} event event object.
   */
  function onFxKeyDown(event) {
    var options = this.inputenhancer_.options,
        that, selection;

    console.log('onFxKeyDown /', 'which:', event.which);

    // save
    this.inputenhancer_.keydownWhich = event.which;

    // 229: key input when IME enabled.
    if (options.enableMaxLength && event.which === 229) {
      selection = getSelectionPos(this);

      console.log('onFxKeyDown /', 'selection:', selection.start, selection.end);

      // has selection range.
      if (selection.start !== selection.end) {
        return;
      }

      console.log(
          'onFxKeyDown /',
          'value.length:', this.value.length,
          'options.maxLength', options.maxLength);

      if (this.value.length >= options.maxLength) {
        console.log('onFxKeyDown /', 'trigger overMaxLength');

        that = this.inputenhancer_.jq;
        that.trigger('overMaxLength');

        event.preventDefault();
      }
    }
  }

  /**
   * onKeyPress event handler for Firefox.
   *
   * @param {Object} event event object.
   */
  function onFxKeyPress(event) {
    var options = this.inputenhancer_.options,
        that, selection, inputLength, maxLength;

    console.log('onFxKeyPress /',
        'which:', event.which,
        'alt:', event.altKey,
        'ctrl:', event.ctrlKey,
        'meta:', event.metaKey,
        'keydownWhich:', this.inputenhancer_.keydownWhich);

    if (options.enableMaxLength) {
      switch (this.inputenhancer_.keydownWhich) {
        case 8:   // backspace
        case 9:   // tab
        case 37:  // left
        case 38:  // up
        case 39:  // right
        case 40:  // down
        case 46:  // delete
          return;
      }

      if (event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      selection = getSelectionPos(this);

      console.log('onFxKeyPress /', 'selection:', selection.start, selection.end);

      // has selection range.
      if (selection.start !== selection.end) {
        return;
      }

      inputLength = this.value.length;
      maxLength = options.maxLength;

      if (inputLength === maxLength - 1) {
        console.log('onFxKeyPress /', 'trigger maxLength');

        that = this.inputenhancer_.jq;
        that.trigger('maxLength');
      } else if (inputLength >= maxLength) {
        console.log('onFxKeyPress /', 'trigger overMaxLength');

        that = this.inputenhancer_.jq;
        that.trigger('overMaxLength');

        event.preventDefault();
      }
    }
  }

  /**
   * onKeyDown event handler.
   *
   * @param {Object} event event object.
   */
  function onKeyDown(event) {
    var options = this.inputenhancer_.options,
        that, selection;

    console.log('onKeyDown /', 'which:', event.which);

    // 229: key input when IME enabled.
    if (options.enableMaxLength && event.which === 229) {
      selection = getSelectionPos(this);

      console.log('onKeyDown /', 'selection:', selection.start, selection.end);

      // has selection range.
      if (selection.start !== selection.end) {
        return;
      }

      console.log(
          'onKeyDown /',
          'value.length:', this.value.length,
          'options.maxLength', options.maxLength);

      if (this.value.length >= options.maxLength) {
        console.log('onKeyDown /', 'trigger overMaxLength');

        that = this.inputenhancer_.jq;
        that.trigger('overMaxLength');

        event.preventDefault();
      }
    }
  }

  /**
   * onKeyPress event handler.
   *
   * @param {Object} event event object.
   */
  function onKeyPress(event) {
    var options = this.inputenhancer_.options,
        that, selection, inputLength, maxLength;

    console.log('onKeyPress /',
        'which:', event.which,
        'alt:', event.altKey,
        'ctrl:', event.ctrlKey,
        'meta:', event.metaKey,
        'keydownWhich:', this.inputenhancer_.keydownWhich);

    if (options.enableMaxLength) {
      if (isSf && event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      selection = getSelectionPos(this);

      console.log('onKeyPress /', 'selection:', selection.start, selection.end);

      // has selection range.
      if (selection.start !== selection.end) {
        return;
      }

      inputLength = this.value.length;
      maxLength = options.maxLength;

      if (inputLength === maxLength - 1) {
        console.log('onKeyPress /', 'trigger maxLength');

        that = this.inputenhancer_.jq;
        that.trigger('maxLength');
      } else if (inputLength >= maxLength) {
        console.log('onKeyPress /', 'trigger overMaxLength');

        that = this.inputenhancer_.jq;
        that.trigger('overMaxLength');

        event.preventDefault();
      }
    }
  }

  /**
   * onPaste event handler.
   *
   * @param {Object} event event object.
   */
  function onPaste(event) {
    var options = this.inputenhancer_.options,
        that, selection;

    console.log('onPaste /', 'value:', this.value);

    if (options.enableMaxLength && this.value.length >= options.maxLength) {
      selection = getSelectionPos(this);

      console.log('onPaste /', 'selection:', selection.start, selection.end);

      // has selection range.
      if (selection.start !== selection.end) {
        return;
      }

      console.log('onPaste /', 'trigger overMaxLength');

      that = this.inputenhancer_.jq;
      that.trigger('overMaxLength');

      event.preventDefault();
    }
  }

  /**
   * onInput event handler.
   *
   * @param {Object} event event object.
   */
  function onInput(event) {
    var options = this.inputenhancer_.options,
        that, inputLength, maxLength;

    console.log('onInput /', 'value:', this.value);

    if (options.enableMaxLength) {
      console.log(
          'onInput /',
          'value.length:', this.value.length,
          'options.maxLength:', options.maxLength,
          'value:', this.value,
          'slice:', this.value.slice(0, options.maxLength));

      inputLength = this.value.length;
      maxLength = options.maxLength;

      if (inputLength === maxLength) {
        console.log('onInput /', 'trigger maxLength');

        that = this.inputenhancer_.jq;
        that.trigger('maxLength');
      } else if (inputLength >= maxLength) {
        console.log('onInput /', 'trigger overMaxLength');

        this.value = this.value.slice(0, options.maxLength);

        that = this.inputenhancer_.jq;
        that.trigger('overMaxLength');
      }
    }
  }

  /**
   * inputenhancer main
   *
   * @param {Object} param setting parameters.
   * @return {Object} jQuery object.
   */
  $.fn.inputenhancer = function(param) {
    var options = {
      maxLength: param.maxLength || param.maxlength || 0
    };

    options.enableMaxLength = (options.maxLength > 0);

    // onInput polyfill for IE8 and IE9
    if (isIE) {
      this
        .bind('keydown' + NAMESPACE, onTriggerInput)
        .bind('keypress' + NAMESPACE, onTriggerInput)
        .bind('paste' + NAMESPACE, onTriggerInput)
        .bind('pseudo-input' + NAMESPACE, onPseudoInput);
    }

    if (isFx) {
      this
        .bind('keydown' + NAMESPACE, onFxKeyDown)
        .bind('keypress' + NAMESPACE, onFxKeyPress);
    } else {
      this
        .bind('keydown' + NAMESPACE, onKeyDown)
        .bind('keypress' + NAMESPACE, onKeyPress);
    }

    this
      .bind('paste' + NAMESPACE, onPaste)
      .bind('input' + NAMESPACE, onInput);

    return this.each(function(index, element) {
      element.inputenhancer_ = {
        beforeText: this.value,
        keydownWhich: null,
        options: options,
        jq: $(this)
      };
    });
  };

}));
