
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
      speed:350,
      defaultDuration:360000,
      rate:350/360000
    }
  };
  
  // check if the bar is running
  ns.isRunning = function () {
    return NProgress.isStarted();
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
    nt.duration = duration;
    
    // what's left to do
    nt.bar = ns.getBarProgress();
    nt.left = 1-nt.bar;
    
    // what time is left
    nt.togo = nt.left*nt.duration;
    
    // the rate at which it needs to go it whats left - whats been reported
    nt.rate = nt.left*nt.speed/nt.togo;
    
    
    // adjust the trickle rate to accommodate whats left
    NProgress.configure({ 
      trickleRate: nt.rate , 
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
    // just discovered that trickle speed does exist anymore
    //so ..
    NProgress.trickle = function () {
      NProgress.inc (ns.control.trickle.rate);
    };
    
    NProgress.configure({ 
      easing: 'linear',
      trickleRate:ns.control.trickle.rate,
      trickleSpeed:ns.control.trickle.speed,
      minimum: 0.01
    });
    return ns;
  };
  
  ns.set = function (perc) {
    NProgress.set (perc);
  };
  
  /**
   * smooths out progress according to data in item
   * @param {object} item the item generated server side
   * @return {ClientProgress} self
   */
  ns.smoothProgress = function (item) {
    
    var nt = ns.control.trickle;
    
    // we have the starttime, and the update time. so that's the duration to get this far
    var soFar = item.updatedAt - item.startTime;
    
    // how long it'll take at this rate
    var estDuration = item.progress ? soFar /item.progress : nt.duration;

    // but if we havent yet reached the minimum duration, go there
    if (item.min && ns.getBarProgress() < item.min) {
      //ns.set (item.min);
    }
    
    // so the expected duration must be between 
    var maxDuration = soFar / Math.min(item.max,1);
    var minDuration = soFar / Math.max(item.min,0.01);
    
    // we can set the new estimate duration if needed
    if (nt.duration > maxDuration && item.max) {
      // slowing it down
       ns.setTrickle (maxDuration);
    }
    else if (nt.duration < minDuration && item.min) {
      // speeding it up
       ns.setTrickle (minDuration);
    }
    
    return ns;
    
  };
  
  
  
  return ns;
})(ClientProgress || {});


