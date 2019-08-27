
var app = getApp();
var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};

function EventHelper() {
  this.trigger = (event, selector, params) => {
    console.log("trigger  event=" + event + ", selector=" + selector)
    if (!this.events[event]) {
      console.log("events isn't found")
      return;
    }
    if (!this.events[event].has(selector)) {
      console.log("selector isn't found")
      return;
    }

    var handlers = this.events[event].get(selector);
    for (var i = 0; i < handlers.length; ++i) {
      handlers[i].handler(this, params);
    }
  };

  this.on = (event, selector, name, handler) => {
    this.events[event] = new Map();
    this.events[event].set(selector, []);
    this.events[event].get(selector).push({
      name: name,
      handler: handler
    })
    console.log(event);
  };

  this.off = (event, selector, name) => {
    for (var i = 0; i < this.events[event].get(selector).length; ++i) {
      if (this.events[event].get(selector)[i].name == name) {
        delete this.events[event].get(selector)[i];
      }
    }
  }
}
EventHelper.prototype.events = {};

(function (NS, event) {
  if (NS.event) return;

  NS.event = event;
  module.exports = NS.config;
})(com.lightningdog.rrq, new EventHelper());
