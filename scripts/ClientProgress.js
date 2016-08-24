
/**
* runs client side and
* coperates with ServerProgress
* to report on progress being made server side
* @namespace ClientProgress
*/
var ClientProgress = (function (ns) {
  
  ns.control = {
    running:false,
    stuck:{
      count:0
    },
    trickle: {
      duration:0,
      speed:250,
      defaultDuration:200000
    }
  };
  
  // check if the bar is running
  ns.isRunning = function () {
    return NProgress.isStarted()
  };
  
  /** 
   * set the trickle speed
   * every time we have a new 
   * estimate for how long this will take
   * @param {number} duration new estimated duration in ms
   * @return {ClientProgress} self
   */
  ns.setTrickle = function (duration) {
  
    // this is the expected overall duration 
    // and affects the trickle speed and rate.
    var nt = ns.control.trickle;
    
    // the rate at which it needs to go it whats left - whats been reported
    var rate = nt.speed/(ns.isRunning() ? (1-ns.getBarProgress())*duration : duration) ;
    nt.duration = duration;
    
    // adjust the trickle rate to accommodate whats left
    NProgress.configure({ 
      trickleRate: rate , 
      trickleSpeed: nt.speed 
    });
    return ns;
    
  };
  
  // return current status bar position
  ns.getBarProgress = function () {
    return NProgress.status || 0;
  };
  
  // start the bar
  ns.start = function () {
    ns.control.running = true;
    ns.control.stuck.count = 0;
    ns.setTrickle (ns.control.trickle.defaultDuration);
    return NProgress.start();
  };
  
  // set to a particular value
  ns.set = function (p) {
    return NProgress.set(p);
  };
  
  // its all over
  ns.done = function () {
    ns.control.running = false;
    return NProgress.done();
  };
  
  // increment a little bit
  ns.inc = function () {
    return NProgress.inc();
  };
  
  // any initialization
  ns.initialize = function () {
    NProgress.configure({ 
      easing: 'linear',
      trickleRate:.01,
      trickleSpeed:ns.control.trickle.speed
    });
    return ns;
  };
  
  /**
   * smooths out progress according to data in item
   * @param {object} item the item generated server side
   * @return {ClientProgress} self
   */
  ns.smoothProgress = function (item) {
    
    var nt = ns.control.trickle;
    
    // we have the starttime, and the update time. so that's the duration to get this far
    var duration = item.updatedAt - item.startTime;
    
    // how long it'll take at this rate
    var estDuration = item.progress ? duration /item.progress : nt.duration;

    // so the expected duration must be between 
    var soFar = nt.duration * ns.getBarProgress();
    var maxDuration = duration / Math.min(item.max,1);
    var minDuration = duration / Math.max(item.min,0.01);

    
    // we can set the new estimate duration if needed
    if (soFar > maxDuration && item.max) {
       ns.setTrickle (maxDuration);
    }
    else if (soFar < minDuration && item.min) {
       ns.setTrickle (minDuration);
    }
    else if (item.progress) {
       ns.setTrickle (estDuration);
    }
    
    return ns;
    
  };
  
  
  
  return ns;
})(ClientProgress || {});


