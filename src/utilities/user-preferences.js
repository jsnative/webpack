import { StringSettingsParse as SSParser, Settings } from './index';

export default {

  init() {
    // read from database
    // parse to json
    // save some new preferences
    // clean up
    // return parsed settings
    const settings = Settings.toObject(`{
      "workspace.editor.window.position": 1,
      "workspace.editor.window.position$": {
        "attached": 1,
        "floating": 2,
        "window": 3
      },
      "workspace.editor.window.width": 0,
      "workspace.editor.window.x": 0,
      "workspace.editor.window.y": 0,

      "workspace.editor.background": "#070707",

      "workspace.sidebar.width": 240,
      "workspace.sidebar.background": "#0C0C0C"
    }`);
    let saveTimeout;
    settings.save = function() {
      if(saveTimeout) window.clearTimeout(saveTimeout);
      saveTimeout = window.setTimeout(() => {
        const saveData = Settings.toString(this);
        console.log("Changes saved");
      }, 1000);
    }
    return settings;
  }
}
