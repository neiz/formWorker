/* =========================================================
 * formWorker.js v0.0.1
 * 
 * =========================================================
 * Copyright 2013 Neil Allen.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

  "use strict";


 /* formWorker Class Definition
  * ====================== */

  var formWorker = function (element, options) {
    this.options = options
    this.$element = $(element)
      .delegate('[data-dismiss="formWorker"]', 'click.dismiss.formWorker', $.proxy(this.hide, this))
    this.options.remote && this.$element.find('.formWorker-body').load(this.options.remote)
  };

  formWorker.prototype = {

      constructor: formWorker

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move formWorkers dom position
          }

          that.$element.show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element
            .addClass('in')
            .attr('aria-hidden', false)

          that.enforceFocus()

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
            that.$element.focus().trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.formWorker')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)

        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideformWorker()
      }
  }


 /* formWorker Plugin Definition
  * ======================= */

  var old = $.fn.formWorker

  $.fn.formWorker = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('formWorker')
        , options = $.extend({}, $.fn.formWorker.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('formWorker', (data = new formWorker(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.formWorker.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.formWorker.Constructor = formWorker


 /* formWorker noConflict
  * ================= */

  $.fn.formWorker.noConflict = function () {
    $.fn.formWorker = old
    return this
  }

}(window.jQuery);