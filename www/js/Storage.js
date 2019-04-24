var Storage = {
  storage: window.localStorage,

  // themes
  getTheme: function(lang) {
    return this.storage.getItem('options_' + lang + '_theme');
  },
  setTheme: function(lang, value) {
    this.storage.setItem('options_' + lang + '_theme', value);
  },

  // code
  getCode: function(lang) {
    return this.storage.getItem('cached_' + lang);
  },
  setCode: function(lang, value) {
    this.storage.setItem('cached_' + lang, value);
  },

  // options
  setOption: function(key, val) {
    this.storage.setItem('options_' + key, val);
  },
  getOption: function(key) {
    return this.storage.getItem('options_' + key);
  }
}