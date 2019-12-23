import UserPreferences from './user-preferences';
import Preferences from './preferences';

export { UserPreferences, Preferences };

const type = o => Object.prototype.toString.call(o).substr(8).replace(']','');

export const StringSettingsParse = function (obj) {

}

export const Settings = {
  toObject(string) {
    const json = JSON.parse(string);
    let result = {}, main = result;
    for(let key in json) {
      key.split('.').map((k, i) => {
        if(result.hasOwnProperty(k)) {
          result = result[k];
        }else {
          if(i === key.split('.').length - 1) {
            if(type(result) === "Object") {
              result[k] = json[key];
            }
            result = main;
          }else {
            result[k] = {};
            result = result[k];
          }
        }
      })
    }
    return main;
  },
  toString(object, name = "") {
    let result = undefined;
    const parse = (object, name) => {
      let lastKey = undefined, keyString = "";
      let data = {};
      for(let key in object) {
        keyString = (name.length > 0) ? name + "." + key : key;
        if(type(object[key]) === "Object") {
          data = Object.assign(data, parse(object[key], keyString));
        }else {
          data[keyString] = object[key];
        }
      }
      return data;
    }
    result = parse(object, name);
    return JSON.stringify(result);
  }
}

export const Draggable = function(element, draw) {
  let moveReady = false;
  const mousedown = function(e) {
    moveReady = true;
    window.addEventListener('mouseup', mouseup);
    window.addEventListener('mousemove', mousemove);
  };

  const mousemove = function(e) {
    if(moveReady) {
      draw(e.clientX, e.clientY, e);
    }
  }

  const mouseup = function(e) {
    moveReady = false;
    window.removeEventListener('mouseup', mouseup);
    window.removeEventListener('mousemove', mousemove);
  };

  element.on({
    'mousedown': mousedown,
    'mouseup': mouseup,
    'mousemove': mousemove
  });
}
