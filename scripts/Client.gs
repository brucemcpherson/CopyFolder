var Client = (function (ns) {
  
  var result;
  
  // progress will be stored here
  ns.control = {
    progress:{
      status:null,
      interval:1783
    },
    table: {
      vizTable:null,
      dataTable:null,
      div:'viztable'
    }
  };
  

  /**
   * there's a package that comes with the status
   * showing which files have actually been completed
   * @param {boolean} done its all done
   * @return {Client} self
   */
  ns.updateFileProgress = function (done) {
  
    var nc = ns.control;
    var status = nc.progress.status;
    
    var index = VizTable.getColumnIndex (nc.table.dataTable, "copy status");
    
    if (index < 0) {
      App.showNotification ("Table error", "couldnt retrieve statux index");
      ClientProgress.done();
    }
    else {
      //do something
      (status.activeFiles || []).forEach(function (d,i,a) {
        nc.table.dataTable.setCell (i , index , done || i < a.length-1 ? "done" : "copying");
        VizTable.draw  (nc.table.dataTable, nc.table.vizTable);
      });
    }
   
  };
  /**
  * poll for progress update on the server
  */
  ns.progressPoll = function (immediate, close) {
    
    if (ClientProgress.control.running) {
      poller_(immediate ? 10 : ns.control.progress.interval)
      
      .then (function () {
        ns.control.progress.status.barProgress = ClientProgress.getBarProgress();
        return Provoke.run('Server','getProgress', ns.control.progress.status);
      })
      
      .then (function (status) {
        // if its still running after all that
        if (ClientProgress.control.running) {
          // store the status
          ns.control.progress.status = status;
         
          // update the status bar
          ClientProgress.smoothProgress (ns.control.progress.status);

          // update any files that are finished
          ns.updateFileProgress(close);
          
          // the last one finished with a close down
          if (close) {
            ClientProgress.done();
            ClientProgress.control.running = false;
          }
        }
        
        // recurse - if closed it wont run.
        ns.progressPoll();

      })
      
      ['catch'](function (err) {
        App.showNotification(err);
      });
    }
    // 
    else {
      // nothing to do
      ClientProgress.done();
      
    }

  };
  
  // polling for progress update
  function poller_ (waitFor) {
    return new Promise (function (resolve, reject) {
      setTimeout(function () {
        resolve();
      },waitFor);
    });
    
  }
  // get set up listeners and get started
  ns.initialize = function () {
    
    // complete the title from the params
    DomUtils.elem('target').innerHTML = getParameters().folders.target;
    
    // add event listeners
    DomUtils.elem("copy").addEventListener("click", function() {
      // starting the copy
      DomUtils.elem("copy").disabled = true;
      
      // start the progress
      if (ns.control.progress.status) {
        
        // initialize progress options and go
        ClientProgress
        .initialize()
        .start();
        
        // recurse immediately
        ns.progressPoll(true);
      }
      
      // get the server going, copying files.
      Provoke.run("Server", "copyFiles", result,ns.control.progress.status)
      .then(function(data) {
        
        // recurse immediately, and then close
        ns.progressPoll(true, true);
        
        // all done
        App.toast('Copy completed', data.files.length +
                  ' files copied to folder ' + data.target.name);
        
        
      })['catch'](function(err) {
        DomUtils.elem("copy").disabled = false;
        App.showNotification("Copy failure", err);
        
        // close down the progress bar
        ClientProgress.done();
      });
      
    }, false);
    return refreshData();
  };
  
  // get selecteddata
  function refreshData() {
    
    
    // kick off getting the files and creating a server progress session
    var pProg = Provoke.run("Server","createProgress");
    
    // when createprogress is done then store the item
    pProg.then (function(status) {
      ns.control.progress.status = status;
    })
    ['catch'](function(err) {
      App.showNotification ("Progress bar problem", err);
    });
    
    // get the files from the server
    var pGet = new Promise (function(resolve, reject) {
      
      Provoke.run("Server", "getFiles",getParameters())
      .then(function(data) {
        if (!data || !data.files.length) {
          reject("Failure getting files", "no files found in source folder");
        }
        else {
          result = data;
          var nd = ns.control.table;
          
          nd.dataTable = VizTable.makeTable();
          VizTable.addData(nd.dataTable, data.files);
          nd.vizTable = VizTable.render (nd.dataTable,nd.div);
          resolve(data);
        }
      })
    });
    
    // when all is done, we can enable the copy button
    Promise.all([pGet,pProg])
    .then(function (rs) {
      // good to copy so enable the button

      DomUtils.elem("copy").disabled = false;
    })
    ['catch'](function(err) {
      
      App.showNotification ("error getting files", JSON.stringify(err));
    });
    
  };
  

  
  return ns;
})(Client || {});