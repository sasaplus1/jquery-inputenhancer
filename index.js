;(function() {

  function InputAreaViewModel(param) {
    this.paramJSON = ko.observable(JSON.stringify(param, null, 2));
    this.maxLength = ko.observable(param.maxLength);

    this.inputClass = ko.observable('list-default');
    this.maxLengthClass = ko.observable('list-default');
    this.overMaxLengthClass = ko.observable('list-default');
  }

  ko.applyBindings({
    inputs: [
      new InputAreaViewModel({
        maxLength: 5
      }),
      new InputAreaViewModel({
        maxLength: 10
      }),
      new InputAreaViewModel({
        maxLength: 0
      })
    ],
    init: function(element, index, data) {
      $(element)
        .find('input')
        .inputenhancer({
          maxLength: index.maxLength()
        })
        .on('input', function(event) {
          index.inputClass('list-input');
          setTimeout(function() {
            index.inputClass('list-default');
          }, 100);
        })
        .on('maxLength', function(event) {
          index.maxLengthClass('list-max-length');
          setTimeout(function() {
            index.maxLengthClass('list-default');
          }, 100);
        })
        .on('overMaxLength', function(event) {
          index.overMaxLengthClass('list-over-max-length');
          setTimeout(function() {
            index.overMaxLengthClass('list-default');
          }, 100);
        });
    }
  }, document.getElementById('input-area-frame'));

}());
