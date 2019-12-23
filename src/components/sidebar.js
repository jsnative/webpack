import { Component, Container, Input, Button, Span, Label } from '@core/components';
import { KeyContainer, Caret } from '@src/themes/app-theme';

export default class Sidebar extends Component {

  Pref;
  filetypes = {
    folder: 1, file: 2
  }

  fileExplorer;
  componentExplorer;
  sidebarFileMenu;

  constructor() {
    super();
    this.Pref = Config.UserPreferences.workspace.sidebar;
    this.state = {
      allFiles: []
    }

    this.fileExplorer = new Container()
      .flexGrow('1')
      .padding(24, 0)
    this.sidebarFileMenu = new SidebarFileMenu();

    const defaultWidth = 240;
    this.size('auto', '100vh')
      .background(this.Pref.background);
    this.addChild(
      new Container().padding(18).addChild(
        new SidebarSearch()
      ),
      this.sidebarFileMenu,
      new Container()
        .overflowX('auto')
        .display('flex')
        .height('calc(100% - 110px)')
        .addChild(this.fileExplorer)
    );

    this.loadFileDirectory();

    this.state.allFiles.map(filefolder => {
      if(filefolder.type === this.filetypes.folder) {
        this.fileExplorer.addChild(new Folder(filefolder));
      }
      if(filefolder.type === this.filetypes.file) {
        this.fileExplorer.addChild(new File(filefolder));
      }
    });
  }

  onCreate() {
    setTimeout(() => this.sidebarFileMenu.enableFileExplorer(), 250);
  }

  loadFileDirectory(fileDirectory) {
    this.state.allFiles = [
      { type: this.filetypes.folder, name: 'App folder', parent: 0, id: 1, dept: 0 },
      { type: this.filetypes.file, name: 'index.js', parent: 1, id: 2, dept: 1 },
      { type: this.filetypes.file, name: 'config.js', parnet: 1, id: 3, dept: 1 },
      { type: this.filetypes.folder, name: 'src', parent: 1, id: 4, dept: 1 },
      { type: this.filetypes.file, name: 'Editor.js', parent: 4, id: 5, dept: 2},
      { type: this.filetypes.file, name: 'This one is special.js', parent: 4, id: 6, dept: 2},
      { type: this.filetypes.file, name: 'This one is another special.js', parent: 4, id: 7, dept: 2},
      { type: this.filetypes.folder, name: 'Simple folder 2', parent: 4, id: 8, dept: 2},
      { type: this.filetypes.file, name: 'This one is another special', parent: 4, id: 9, dept: 3}
    ];
  }
}


export class SidebarSearch extends Input {
  constructor() {
    super();
    this.backgroundColor('transparent')
      .border(Theme.Specs.Panel.lightBorder)
      .cornerRadius(Theme.Specs.Panel.cornerRadius)
      .padding(Theme.Specs.normalBoxPadding)
      .fontSize(Theme.Fonts.normal)
      .color(Theme.Colors.white)
      .size('100%', 'auto')
      .placeholder('Search file');
  }
}

export class SidebarFileMenu extends Container {

  fileExplorer;
  projectView;
  explorerCaret;
  constructor() {
    super();

    this.fileExplorer = new SidebarFileMenuButton('File Explorer');
    this.projectView = new SidebarFileMenuButton('Project View');
    this.explorerCaret = new Caret(8, 1, 2);
    this.borderBottom('2px solid #212121')
      .paddingLeft(15)
      .paddingRight(15)
      .display('flex')
      .position('relative')
      .addChild(this.fileExplorer,
        new Container().addChild(this.explorerCaret)
          .size(24, 24).display('flex')
          .justifyContent('center')
          .alignItems('center')
          .alignSelf('center')
          .marginBottom(6)
          .marginRight(4),
        this.projectView
      )
    this.fileExplorer.on({
      click: () => this.enableFileExplorer()
    });
    this.projectView.on({
      click: () => this.enableProjectView()
    })
  }

  enableFileExplorer() {
    this.fileExplorer.setEnable(true);
    this.projectView.setEnable(false);
    this.explorerCaret.borderColor(Theme.Colors.Panel.darkText2);
  }

  enableProjectView() {
    this.projectView.setEnable(true);
    this.fileExplorer.setEnable(false);
    this.explorerCaret.borderColor(Theme.Colors.Panel.lightText);
  }
}

export class SidebarFileMenuButton extends Button {

  indicator;
  enabled = false;

  constructor(text) {
    super(text);
    this.fontSize(Theme.Fonts.normal)
      .backgroundColor('transparent')
      .border('none')
      .position('relative')
      .overflow('hidden')
      .color(Theme.Colors.Panel.darkText2)
      .padding([5, 0, 12, 0])
      .text(text)
      .hover({ color: Theme.Colors.Panel.lightText });
    this.indicator = new Container()
      .position('absolute').left('0px')
      .top('100%').size('100%', 6)
      .backgroundColor(Theme.Colors.appBlue01)
      .borderRadius(3, 3, 0, 0);
    this.addChild(this.indicator);
  }

  setEnable(enabled) {
    this.enabled = enabled;
    if(enabled) {
      this.color(Theme.Colors.Panel.lightText);
      this.indicator.animate({ transform: 'translateY(-3px)' });
    }else {
      this.color(Theme.Colors.Panel.darkText2);
      this.indicator.animate({ transform: 'translateY(0px)' });
    }
  }
}

export class Folder extends Container {
  class = "ic-folder";
  open = false;
  icon; label;
  constructor(filefolder) {
    super(filefolder);

    this.icon = new Span().addClassName(this.class)
      .color(Theme.Colors.appBlue01);

    this.label = new Label().text(filefolder.name)
      .color(Theme.Colors.Panel.darkText2)
      .whiteSpace('nowrap')
      .fontWeight('500')
      .fontSize(Theme.Fonts.medium)
      .marginLeft(4)
      .paddingRight(24)
      .display('flex').alignItems('center');

    this.display('flex')
      .alignItems('center')
      .height(26)
      .paddingLeft((filefolder.dept * 20) + 24)
      .addChild(this.icon, this.label)
      .pseudoSelection({
        backgroundColor: 'transparent'
      });

    this.on({
      click: () => {
        this.open = !this.open;
        if(this.open) {
          this.class = 'ic-open-folder';
          this.label.color(Theme.Colors.Panel.lightText)
        }else this.class = "ic-folder";
      },
      mouseenter: () => {
        this.label.color(Theme.Colors.Panel.lightText);
      },
      mouseleave: () => {
        if(!this.open) this.label.color(Theme.Colors.Panel.darkText2);
      }
    });

    this.class.watch((v, o) => {
      this.icon.removeClassName(o);
      this.icon.addClassName(v);
    });
  }

}

export class File extends Container {
  icon; label;
  selected = false;
  structure;
  constructor(filefolder) {
    super(filefolder);
    this.structure = filefolder;

    this.icon = new Span().addClassName('ic-diamond')
      .color(Theme.Colors.Panel.darkText2);

    this.label = new Label().text(filefolder.name)
      .color(Theme.Colors.Panel.darkText2)
      .whiteSpace('nowrap')
      .fontWeight('500')
      .fontSize(Theme.Fonts.medium)
      .paddingBottom(3)
      .paddingRight(24)
      .marginLeft(4);

    this.display('flex')
      .alignItems('center')
      .paddingLeft((filefolder.dept * 20) + 24)
      .height(26).addChild(this.icon, this.label)
      .pseudoSelection({
        backgroundColor: 'transparent'
      });

    this.on({
      click: () => {
        this.selected = !this.selected;
        if(this.selected) {
          this.backgroundColor(Theme.Colors.black);
          this.icon.color(Theme.Colors.Panel.lightText);
          this.label.color(Theme.Colors.Panel.lightText);
          // emit globaly selection event
          Bus.emit(Config.events.Sidebar.fileSelected, this.structure);
        }else {
          this.backgroundColor(Theme.transparent);
          this.icon.color(Theme.Colors.Panel.darkText2);
          this.label.color(Theme.Colors.Panel.darkText2);
        }
      },
      mouseenter: () => {
        this.icon.color(Theme.Colors.Panel.lightText);
        this.label.color(Theme.Colors.Panel.lightText);
      },
      mouseleave: () => {
        if(!this.selected) {
          this.icon.color(Theme.Colors.Panel.darkText2);
          this.label.color(Theme.Colors.Panel.darkText2);
        }
      }
    });

    Bus.on(Config.events.Sidebar.fileSelected, (data) => {
      if(this.structure.id !== data.id && this.structure.name !== data.name) {
        if(this.selected) {
          this.selected = false;
          this.backgroundColor(Theme.transparent);
          this.icon.color(Theme.Colors.Panel.darkText2);
          this.label.color(Theme.Colors.Panel.darkText2);
        }
      }
    });
  }
}
