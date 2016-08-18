/**
* used to expose memebers of a namespace
* @param {string} namespace name
* @param {method} method name
*/
function exposeRun (namespace, method , argArray ) {
  var func = (namespace ? this[namespace][method] : this[method])
  if (argArray && argArray.length) {
    return func.apply(this,argArray);
  }
  else {
    return func();
  }
}

/**
 * executed by google.script.run from the client
 * @namespace Server
 */
var Server = (function (ns) {
  
  /**
   * copy the files when the button is hit on the client
   * @param {object} data the object describing what needs to be copied
   * @return {object} the data object as sent
   */ 
  ns.copyFiles = function (data) {
    
    // get the source and target folders
    var sourceFolder = DriveApp.getFolderById(data.source.id);
    var targetFolder = DriveApp.getFolderById(data.target.id);
    
    // for each of the data files make a copy to the target folder
    data.files.forEach(function (d) {
      var file = DriveApp.getFileById(d.id);
      file.makeCopy(file.getName(), targetFolder);
    });
    
    // return the data that was sent for processing
    return data;
  };
  
   /**
   * get the files to make a table on the clint side
   * @return {object} data the object describing what needs to be copied
   */ 
  ns.getFiles = function  (parameters) {
  
    // find the input folder
    var sourceFolder = DriveApp.getFolderById(parameters.folders.sourceid);
  
    // find or create the target folder
    var iterator = DriveApp.getFoldersByName(parameters.folders.target);
  
    // create if doesnt exist
    var targetFolder = iterator.hasNext() ? iterator.next() : DriveApp.createFolder(parameters.folders.target);
  
    // get all the files in the source folder
    var iterator = sourceFolder.getFiles();
    var files = [];
    while (iterator.hasNext()) {
      var file = iterator.next();
      files.push ({
        id:file.getId(),
        name:file.getName(),
        mime:file.getMimeType()
      });
    }
  
    // this is files that will be processed if the copy button is hot.
    return {
      files:files,
      source:{
        name:sourceFolder.getName(),
        id:sourceFolder.getId()
      },
      target:{
        name:targetFolder.getName(),
        id:targetFolder.getId()
      }
    };
  
  };


  
  return ns;
}) (Server || {});




