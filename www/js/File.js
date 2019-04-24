var DasFile = {
  save: function(fileName, fileData) {
    var blob = new Blob([fileData], {type : 'text/plain'});
    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory , function (dirEntry) {
      DasFile.create(dirEntry, fileName + ".html", blob);
    });
  },

  create: function(dirEntry, fileName, blob) {
    dirEntry.getFile(fileName, {create: true, exclusive: false}, function(fileEntry) {
      DasFile.write(fileEntry, blob);
    });
  },

  write: function(fileEntry, blob) {
    fileEntry.createWriter(function (fileWriter) {
      fileWriter.onwriteend = function() {
        alert('HTML File Saved');
      };
      fileWriter.write(blob);
    });
  }
}
