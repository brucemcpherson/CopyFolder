/**
 * manipulate a viztable
 */
var VizTable = (function (ns) {

  
  /**
   * find the column number of a given column header
   * @param {DataTable} table the data table
   * @param {string} header the header to look for
   * @return {number} the column number
   */
  ns.getColumnIndex  = function (table, header) {
    var columns = table.getNumberOfColumns();
    for (var i=0;i<columns;i++) {
      if (header === table.getColumnLabel(i)) return i;
    }
    return -1;
  };
  /**
   * create a new datatable
   * @return {DataTable} the table
   */
  ns.makeTable = function () {
    return new google.visualization.DataTable();
  };
  
  /**
   * add data to it
   * @param {DataTable} table the table
   * @param {[object]} data the data
   * @return {DataTable} the table
   */
  ns.addData = function (table,data) {
    
    if (data.length) {
      
      // get the headings
      var fields = Object.keys(data[0]);
      
      // get the likely types
      var types = fields.reduce(function(p,c) {
        data.forEach(function(d) {
          // force to a string if mixed
          if (p[c] && p[c] !== typeof d[c]) {
            p[c] = "string";
          }
          else if (!p[c]){
            p[c] = typeof d[c];
          }
        });
        return p;
      },{});
      
      // add the columns
      fields.forEach(function (d) {
        table.addColumn (types[d] , d);
      });
      table.addColumn("string","copy status");
      
      // and the data
      data.forEach(function(d) {
        table.addRow (fields.map(function(e) {
          return types[e] === "string" ? d[e].toString() : d[e];
        }).concat(['not started']));
      });
    
    }
    
    return table;
    
  };
  
  /**
   * render the table
   * @param {DataTable} table the table
   * @param {string} element the element
   * @return {VizTable} the viz table
   */
  ns.render = function (table, elem) {

    var vizTable = new google.visualization.Table(DomUtils.elem (elem));
    return ns.draw (table , vizTable);

  };
  
  ns.draw = function (table, vizTable) {
    vizTable.draw(table, { width: '100%', height: '100%'});
    return vizTable;
  }
  return ns;
}) (VizTable || {});


          


