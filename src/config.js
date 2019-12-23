// theme imports
import { AppTheme } from "@src/themes";
// source imports
import App from "@src/app";

export default {
  // default theme
  theme: AppTheme,
  // define app routes
  routes: [
    { path: '/', component: App, name: "App" }
  ],
  // Custom definitions
  contextMenus: [],
  // User preferences
  UserPreferences: {},
  // Custom methods
  registerContextMenu: (container, menu) => {
    Config.contextMenus.push({ sender: container, menu: menu });
  },

  events: {
    Sidebar: {
      fileSelected: 'sidebar.file-selected'
    }
  }
}

