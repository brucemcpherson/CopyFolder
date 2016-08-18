// this webapp makes your own copy of all the scripts and files used in this course.
// input folder id 
var ASSET_SOURCE_FOLDER_ID = "0B92ExLh4POiZVkd5Y2FVYmZmZjg";

// where you want the files to be copied to
var TARGET_FOLDER_NAME = "Gas for beginners - copy of assets";

// publish this
function doGet(e) {

  /* for testing
  e= e || {};
  e.parameter = e.parameter || {};
  e.parameter =  {
    sourceid:ASSET_SOURCE_FOLDER_ID,
    target:TARGET_FOLDER_NAME
  };
  */
  if (!e.parameter || !e.parameter.sourceid || !e.parameter.target) {
    throw 'supply parameters sourceid (the id of the source folder) and target (the path of the target folder)';
  }
  
  return HtmlService
  .createTemplateFromFile('index')
  .evaluate()
  .append('<script>function getParameters()  {'+
          'return  {folders:{target:"' + 
          e.parameter.target + 
          '",sourceid:"' +
          e.parameter.sourceid +
          '"}}};</script></body>');

  
}
