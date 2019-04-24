var App = {
  editors: {},

  init: function() {
    this.initEditors([{
      lang: 'xml',
      alias: 'html',
      value: '<h1></h1>'
    },{
      lang: 'css',
      alias: 'css',
      value: 'body { background-color: #111; }'
    },{
      lang: 'javascript',
      alias: 'js',
      value: 'alert("hello");'
    },{
      lang: 'javascript',
      alias: 'json',
      value: '{}'
    }]);
  },

  initEditors: function(configs) {
    var app = this;
    $(configs).each(function(i, config) {
      app.editors[config.alias] = new Editor(config).init();
    });
  },

  selectTheme: function(lang, theme) {
    this.editors[lang].setTheme(theme);
  },

  editorVal: function(editor, val) {
    if (typeof val !== 'undefined')
      this.editors[editor].cm.setValue(val);
    else
      return this.editors[editor].cm.getValue();
  },

  buildHTML: function() {
    const header = '<html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>';
    const footer = '</body></html>';

    let html = this.editorVal('html');

    if ($('#includeJQuery:checked'))
      html += this.getJQueryInclude();

    var jsonCode = this.editorVal('json') ? this.editorVal('json') : '{}';

    let json = "<script>var jsonData = " + jsonCode + "</script>";
    let css  = '<style>' + this.editorVal('css') + '</style>';
    let js   = '<script>' + this.editorVal('js') + '</script>';

    return header + css + html + json + js + footer;
  },

  getJQueryInclude: function() {
    return '<script src="https://code.jquery.com/jquery-3.4.0.js" integrity="sha256-DYZMCC8HTC+QDr5QNaIcfR7VSPtcISykd+6eSmBW5qo=" crossorigin="anonymous"></script>';
  },

  previewHTML: function() {
    $('#preview').removeAttr('src');
    $('#preview').attr('srcdoc', this.buildHTML());
  },

  saveHTML: function() {
    DasFile.save($('#title').val(), this.buildHTML());
  },

  trash: function() {
    for (var editor in this.editors) {
      this.editors[editor].cm.setValue('');
    }
  },

  toggle: function(panel) {
    // hide all panels
    $('.CodeMirror').hide();
    $('#options').hide();
    $('#preview').hide();
    $('#help').hide();

    // if codeMirror panel
    if (panel.indexOf('codeMirror') !== -1) {
      $(panel).next().show();
      for (var editor in this.editors) {
        this.editors[editor].cm.refresh();
      }
    }
    // if plain panel
    else
      $(panel).show();

    // if preview panel
    if (panel == '#preview')
      this.previewHTML();
  }
}

$(function() {
  App.init();

  $('.btnToggle').click(function() {
    $('#toolbar').find('.selected').removeClass('selected');
    $(this).addClass('selected');
    App.toggle($(this).data('toggle'));
  });

  $('#btnSave').click(function() {
    if (confirm("Save file " + $('#title').val() + '.html?'))
      App.saveHTML();
  });

  $('#btnTrash').click(function() {
    if (confirm("Clear all code?"))
      App.trash();
  });

  $("#title").change(function() {
    Storage.setOption('title', $(this).val());
  });
  $('#title').val(Storage.getOption('title') || 'page');

  $('#includeJQuery').change(function() {
    Storage.setOption('includeJQuery', $('#includeJQuery').prop('checked') ? 1 : 0);
  });
  $("#includeJQuery").prop('checked', parseInt(Storage.getOption('includeJQuery')));

  ['html','json','css','js'].forEach(function(lang) {
    var id = '#options_theme_' + lang;
    $(id).html($('#theme_selections_proto').html());
    $(id).change(function() {
      App.selectTheme(lang, $(this).val());
    });
    $(id).val(Storage.getTheme(lang) || 'default').change();
  });

  // toggle HTML panel by default
  App.toggle('#codeMirror_html');
});