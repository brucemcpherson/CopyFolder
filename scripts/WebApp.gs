
// v2.0.1
// copy contents of folder
// should be published as user accessing the app
// more info see - http://ramblings.mcpher.com/Home/excelquirks/gassnips/copyfolders
function doGet(e) {


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
