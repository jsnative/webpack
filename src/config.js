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
  contextMenuMenus: [
    { id: 'main.new-component', title: 'New Component', shortcut: 'Ctrl+Shift+N', fns: () => { } },
    { id: 'main.new-from', title: 'New Component From', subs: [
      { title: 'Vertical List', fns: () => {} },
      { title: 'Horizontal List', fns: () => {} },
      { title: 'Nav Bar', fns: () => {} }
    ]},
    { id: 'main.add-child', title: 'Add Child', subs: [
      { title: 'Container', shortcut: 'Ctrl+Shift+C', fns: () => { console.log("Something clicked"); } },
      { title: 'Button', shortcut: 'Ctrl+P', fns: () => { console.log("Something clicked"); } },
      { title: 'Input', shortcut: 'Shift+Alt+F', fns: () => { console.log("Something clicked"); } }
    ]},
    { id: 'main.embed-in', title: 'Embed In', subs: [
      { title: 'Best Rapper', fns: () => { console.log("Something clicked"); } },
      { title: 'In Africa', subs: [
        { title: 'Doing Awfuly', fns: () => confirm("You 'rite?") }
      ]},
    ]},
    { id: 'main.$separator', separator: true },
    { id: 'edit.delete', title: 'Delete', shortcut: 'Del', fns: () => { confirm('Delete?' )}},
    { id: 'edit.cut', title: 'Cut', shortcut: 'Ctrl+X / X', fns: () => { confirm('Delete?' )}},
    { id: 'edit.copy', title: 'Copy', shortcut: 'Ctrl+C / C', fns: () => { confirm('Delete?' )}},
    { id: 'edit.paste', title: 'Paste', shortcut: 'Ctrl+V / V', fns: () => { confirm('Delete?' )}},
    { id: 'edit.$separator', separator: true },
  ],
  contextMenuSetup: {
    'canvas': ['main.new-component', 'main.new-from', 'main.$separator', 'edit.select-all', 'edit.paste']
  },
  // User preferences
  UserPreferences: {},
  // Custom methods
  registerContextMenu: (container, type) => {
    Config.contextMenus.push({ sender: container, type: type });
  },

  editor: undefined,
  sidebar: undefined,
  designer: undefined,

  events: {
    Sidebar: {
      fileSelected: 'sidebar.file-selected'
    },
    Designer: {
      cursorV: 'designer.cursor-v',
      cursorGrab: 'designer.cursor-grab',
      cursorText: 'designer.cursor-text',
      clearCursor: 'designer.clear-cursor'
    }
  },

  caretDirection: { left: 1, right: 2, top: 3, bottom: 4 },
  caretSize: { small: 4, medium: 8, large: 12, xlarge: 16 },
  sidebarDataKind: { folder: 1, file: 2 }
}

