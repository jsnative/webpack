import {
  Container, Component, H1, Input, Button, Span
} from "@core/components";
import Editor from '../editor';
import Designer from '../designer';
import Sidebar from '../sidebar';
import { Draggable } from '../../utilities';

export default class MainContainer extends Container {

  editor;
  designer;
  sidebar;

  constructor() {
    super();
    // initialize
    Config.registerContextMenu(this, this.contextMenu);
    // design
    this.background(Theme.Colors.white)
      .size('100vw', '100vh');
    // Workspace user preferences
    const UpWs = Config.UserPreferences.workspace,
      WinPref = UpWs.editor.window;
    //
    this.sidebar = new Sidebar();
    this.addChild(this.sidebar);
    this.sidebar.absTopLeft(0, 0)
      .right(window.innerWidth - 240);
    this.sidebar.addChild(new ContainerResize(this.sidebarResize))
    //
    if(WinPref.position === WinPref.position$.attached) {
      this.editor = new Editor();
      this.addChild(this.editor);
      this.editor.absTopLeft(0, 240)
        .right(window.innerWidth - (240 + 600));
      this.editor.addChild(new ContainerResize(this.editorResize))
    }
    //
    this.designer = new Designer();
    this.addChild(this.designer);
    this.designer.absTopLeft(0, 240 + 600)
      .right(0);
  }

  sidebarResize = (x, y, event) => {
    this.sidebar.width(event.pageX + 8);
    Config.UserPreferences.workspace.sidebar.width = event.pageX + 8;
    const editorRight = this.editor.node().getBoundingClientRect().right;
    this.editor.left(event.pageX + 8).width(editorRight - (event.pageX + 8));
    Config.UserPreferences.workspace.editor.width = editorRight - (event.pageX + 8);
    this.designer.left(editorRight);
    // Save changes
    Config.UserPreferences.save();
  }

  editorResize = (x, y, event) => {
    this.editor.width(event.pageX - this.editor.left() + 8);
    Config.UserPreferences.workspace.editor.width = event.pageX - this.editor.left() + 8;
    this.designer.left(event.pageX + 8);
    // Save changes
    Config.UserPreferences.save();
  }

  onCreate() {
  }

  // Utility definitions
  keyEvents = {
    'keyup': () => {},
    'keypress': () => {},
    'keydown': () => {}
  }

  contextMenu = {
    'text': () => {}
    // text: name, action: function
  }
}

export class ContainerResize extends Component {
  handle;
  constructor(onResize) {
    super(onResize);
    this.size(8, '100vh')
      .backgroundColor('transparent');
    this.handle = new Container()
      .width(1)
      .backgroundColor(Theme.Colors.Panel.resizeHandle)
      .height(72);
    this.addChild(this.handle)
      .display('flex')
      .alignItems('center')
      .cursor('col-resize');
    Draggable(this, (x, y, event) => {
      onResize(x, y, event)
    });
  }

  onCreate() {
    setTimeout(() => {
      const coord = this.coord(this.parent());
      this.position('absolute')
        .right(0)
        .top(0)
        .zIndex(1);
    });
  }

  coord(element) {
    return {
      width: element.node.offsetWidth,
      height: element.node.offsetHeight,
      left: element.node.offsetLeft,
      top: element.node.offsetTop
    }
  }
}
