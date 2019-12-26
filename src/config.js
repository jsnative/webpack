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
  },

  caretDirection: { left: 1, right: 2, top: 3, bottom: 4 },
  caretSize: { small: 4, medium: 8, large: 12, xlarge: 16 },
  sidebarDataKind: { folder: 1, file: 2 }
}

