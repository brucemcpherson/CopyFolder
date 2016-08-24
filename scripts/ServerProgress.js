
/**
*@namespace ServerProgress
* this is a progress tracker
* that runs server side
* and should be called from client side 
* periodically
*/
var ServerProgress = (function(ns) {
  
  /**
  * @constructor ProgressItem
  */
  var ProgressItem = function (cache,initialItem, id,  progress) {
    
    var self = this, cache_=cache, id_= id || Utilities.getUuid(), initial_ = initialItem || null;
    
    /**
    * get the id of this progress item
    * @return {string} the id
    */
    self.getId = function () {
      return id_;
    };
    
    /**
    * update progress
    * @param {number} progress updated progress 0-1.
    * @param {object} [statusObject] previous status
    * @return {object} updated status object 
    */
    self.setStatus = function ( progress, statusObject ) {
      
      statusObject = statusObject || {};
      statusObject.updatedAt = new Date().getTime();
      statusObject.startTime = statusObject.startTime || statusObject.updatedAt;
      statusObject.count = (statusObject.count || 0) + 1;
      statusObject.id = statusObject.id || id_;
      statusObject.progress = progress;
      
      cache_.put (id_ , JSON.stringify(statusObject) ,60*60);
      return statusObject;  
    };
    
    /**
    * get status
    * @return {object} status 
    */
    self.getStatus = function () {
      return ns.getById(cache_, id_);
    };
    
    // initialize 
    self.setStatus (progress || 0,initial_);
    
  };
  
  
  /**
  * generate a new progress Item
  * @param {cache} cache the cache to use
  * @param {object} [initialItem] and intial item to carry around if required
  * @return {ProgressItem} a progress item
  */
  ns.newItem = function (cache,initialItem) {
    return new ProgressItem(cache,initialItem);
  };
  
  /**
  * get a status given a progress item id
  * @param {cache} cache the cache to find it in
  * @param {string} id the id of the progres item
  * @return {ProgressItem} the progress item
  */
  ns.getById = function (cache, id) {
    var status = cache.get (id);
    return status ? JSON.parse(status) : null;
  };
  
  /**
  * set a status given a progress item id
  * @param {cache} cache the cache to find it in
  * @param {object} status what to set it to
  * @param {number} progress the progress to set it to
  * @return {ProgressItem} the progress item
  */
  ns.setItem = function (cache, status, progress) {
    return new ProgressItem(cache, status , status.id, progress).getStatus();
  };
  
  return ns;
})(ServerProgress || {});

