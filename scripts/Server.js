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
  
  var getCache_ = function () {
    return CacheService.getUserCache();
  };
  /**
   * initialize a server progress item
   * @param {object} [item] an initial value for the progress item if required
   * @return {object} a status object
   */
  ns.createProgress = function (item) {
    return ServerProgress.newItem(getCache_(),item).getStatus();
  };
  
    /**
   * initialize a server progress item
   * @param {object} [item] an initial value for the progress item if required
   * @return {object} a status object
   */
  ns.getProgress = function (item) {
    return ServerProgress.getById (getCache_(),item.id);
  };
  
  /**
   * set progress
   * @param {number} progress progress 0-1
   * @param {object} item the current item
   * @return {object} the updated item
   */
  ns.setProgress = function (progress,item) {
    return ServerProgress.setItem (getCache_(), item, progress);
  };
  /**
   * copy the files when the button is hit on the client
   * @param {object} data the object describing what needs to be copied
   * @param {object} [item] this is a progress item
   * @return {object} the data object as sent
   */ 
  ns.copyFiles = function (data,item) {
    
    // get the source and target folders
    var sourceFolder = DriveApp.getFolderById(data.source.id);
    var targetFolder = DriveApp.getFolderById(data.target.id);
    // we can use this to send back what we're actually working on
    item.activeFiles = [];
    
    // for each of the data files make a copy to the target folder
    data.files.forEach(function (d,i,a) {
      var file = DriveApp.getFileById(d.id);
      
      if (item) {
        // set max an min progress for this pass
        item.activeFiles.push(d.id);
        item.max = (i+1)/a.length;
        item.min = i/a.length;
        item.size = file.getSize();
        ns.setProgress(item.min, item);
      }
      // copy the file
      file.makeCopy(file.getName(), targetFolder);

    });
    // done
    if (item) {
      ns.setProgress(1, item);
    } 

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




