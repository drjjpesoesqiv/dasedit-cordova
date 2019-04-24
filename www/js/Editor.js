var Editor = function(config) {
  this.cm = null;
  this.id = 'codeMirror_' + config.alias;
  this.config = config;
  this.config = Object.assign(this.config, {
    lineNumbers: true,
    matchBrackets: true,
    mode: {
      name: this.config.lang,
      globalVars: true
    },
    styleActiveLine: true
  });

  if (this.config['lang'] == 'xml')
    this.config['htmlMode'] = true;
}

Editor.prototype = {
  init: function() {
    var thisEditor = this;

    this.cm = CodeMirror.fromTextArea(
      document.getElementById(this.id),
      this.config
    );

    var code = Storage.getCode(this.config.alias);
    code = (code === null) ? this.config.value : code;
    this.cm.setValue(code);

    this.cm.on("change", function() {
      Storage.setCode(thisEditor.config.alias, thisEditor.cm.getValue());
    });

    return this;
  },

  setTheme: function(theme) {
    Storage.setTheme(this.config.alias, theme);
    this.cm.setOption('theme', theme);
  }
}
