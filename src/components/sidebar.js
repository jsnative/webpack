import { Component, Container, Input, Button, Span, Label } from '@core/components';
import { KeyContainer, Caret } from '@src/themes/app-theme';

export default class Sidebar extends Component {

  Pref;
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
    this.size(defaultWidth, '100vh')
      .background(this.Pref.background);
    this.addChild(
      new Container().padding(18).addChild(
        new SidebarSearch()
      ),
      this.sidebarFileMenu,
      new Container()
        .overflowX('auto')
        .display('flex')
        .height('calc(100% - 111px)')
        .addChild(new Container()
          .backgroundColor(this.Pref.background)
          .position('absolute')
          .height('calc(100% - 130px)')
          .width(30).top(111).right(0)
          .zIndex(0)
        )
        .addChild(this.fileExplorer)
    );

    this.loadFileDirectory();
  }

  onCreate() {
    setTimeout(() => this.sidebarFileMenu.enableFileExplorer(), 250);
  }

  loadFileDirectory(fileDirectory) {
    this.fileExplorer.addChild(new Folder(
      { type: Config.sidebarDataKind.folder, name: 'App Folder', parent: 0, id: 1, subs: [
        { type: Config.sidebarDataKind.file, name: 'index.js', parent: 1, id: 2 },
        { type: Config.sidebarDataKind.file, name: 'index.js', parent: 1, id: 2, dept: 1 },
        { type: Config.sidebarDataKind.file, name: 'config.js', parent: 1, id: 3, dept: 1 },
        { type: Config.sidebarDataKind.folder, name: 'src', parent: 1, id: 4,  subs: [
          { type: Config.sidebarDataKind.file, name: 'This one is special.js', parent: 2, id: 6},
          { type: Config.sidebarDataKind.file, name: 'This one is another special.js', parent: 2, id: 7},
          { type: Config.sidebarDataKind.folder, name: 'animation', parent: 2, id: 4,  subs: [
            { type: Config.sidebarDataKind.file, name: 'Template.js', parent: 3, id: 6},
            { type: Config.sidebarDataKind.file, name: 'Thnother special.js', parent: 3, id: 7},
            { type: Config.sidebarDataKind.file, name: 'Special.js', parent: 3, id: 6},
            { type: Config.sidebarDataKind.file, name: 'Another special.js', parent: 3, id: 7},
            { type: Config.sidebarDataKind.file, name: 'This one is special.js', parent: 3, id: 6},
            { type: Config.sidebarDataKind.file, name: 'This one is another special.js', parent: 3, id: 7}

          ] },
          { type: Config.sidebarDataKind.folder, name: 'Extras', parent: 2, id: 4,  subs: [
            { type: Config.sidebarDataKind.file, name: 'This one is special.js', parent: 3, id: 6},
            { type: Config.sidebarDataKind.file, name: 'This one is another special.js', parent: 3, id: 7}
          ] }
        ] },
      ]}
    ));
  }
}


export class SidebarSearch extends Container {

  input; icon;
  constructor() {
    super();
    this.icon = new Span().addClassName('ic-search')
        .color(Theme.Colors.Panel.darkText2)
        .fontSize(Theme.Fonts.large);
    this.input = new Input()
      .fontSize(Theme.Fonts.normal)
      .color(Theme.Colors.white)
      .placeholder('Search file, content')
      .border(0)
      .backgroundColor('transparent')
      .width('calc(100% - 24px)')
      .on({'input': (e) => {
        if(e.target.value.length > 0) {
          this.icon.color(Theme.Colors.Panel.lightText);
          this.borderColor(Theme.Colors.Panel.lightText);
        }else {
          this.icon.color(Theme.Colors.Panel.darkText2);
          this.borderColor(Theme.Colors.Panel.darkBorder);
        }
      }});
    this.backgroundColor('transparent')
      .display('flex')
      .border(Theme.Specs.Panel.lightBorder)
      .cornerRadius(Theme.Specs.Panel.cornerRadius)
      .padding(Theme.Specs.sidebarSearchPadding)
      .size('100%', 36)
      .addChild(this.icon, this.input);

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
  class = "ic-open-folder";
  open = true;
  icon; label; container;
  indicator;
  structure;
  constructor(filefolder) {
    super(filefolder);
    this.structure = filefolder;

    const sidebarWidth = Config.UserPreferences.workspace.sidebar.width;
    this.indicator = new Caret(8, 2, 4)
      .position('absolute')
      .left(sidebarWidth - 20);

    this.icon = new Span().addClassName(this.class)
      .color(Theme.Colors.appBlue01);

    this.label = new Label().text(filefolder.name)
      .color(Theme.Colors.Panel.darkText2)
      .whiteSpace('nowrap')
      .fontWeight('500')
      .fontSize(Theme.Fonts.medium)
      .marginLeft(4)
      .paddingRight(24)
      .height('100%')
      .display('flex').alignItems('center');

    this.container = new Container()
      .size('100%', 'auto')
      .transition('.3s all cubic-bezier(0.19, 1, 0.22, 1)')
      .overflow('hidden');

    this.addChild(
      new Container()
        .display('flex')
        .alignItems('center')
        .height(26)
        .paddingLeft((filefolder.parent * 20) + 24)
        .addChild(this.icon, this.label, this.indicator)
        .pseudoSelection({
          backgroundColor: 'transparent'
        }).on({
          click: () => {
            this.open = !this.open;
            if(this.open) {
              this.container.height('auto');
              const offsetHeight = this.container.node().offsetHeight;
              this.container.height('0px');
              setTimeout(() => {
                this.container.height(offsetHeight);
                this.container.opacity('1');
              }, 50);
              setTimeout(() => this.container.height('auto'), 400);
              this.class = 'ic-open-folder';
              this.icon.color(Theme.Colors.appBlue01);
              this.label.color(Theme.Colors.Panel.lightText);
            }else {
              const offsetHeight = this.container.node().offsetHeight;
              this.container.height(offsetHeight);
              this.container.opacity('0');
              setTimeout(() => {
                this.class = "ic-folder";
                this.icon.color(Theme.Colors.Panel.lightText);
                this.container.height('0px');
              }, 50);
            }
          },
          mouseenter: (e) => {
            this.label.color(Theme.Colors.Panel.lightText);
          },
          mouseleave: () => {
            if(!this.open) this.label.color(Theme.Colors.Panel.darkText2);
          }
        }),
      this.container
    );

    this.class.watch((v, o) => {
      this.icon.removeClassName(o);
      this.icon.addClassName(v);
    });

    this.structure.subs.forEach(filefolder => {
      filefolder.dept = this.structure.dept + filefolder.dept;
      if(filefolder.type === Config.sidebarDataKind.file) {
        this.container.addChild(new File(filefolder));
      }else {
        this.container.addChild(new Folder(filefolder));
      }
    });
  }
}

export class File extends Container {
  icon; label;
  selected = false;
  indicator;
  structure;
  constructor(filefolder) {
    super(filefolder);
    this.structure = filefolder;

    const sidebarWidth = Config.UserPreferences.workspace.sidebar.width;
    const sidebarBackground = Config.UserPreferences.workspace.sidebar.background;
    this.indicator = new Container()
      .display('flex')
      .justifyContent('flex-end')
      .position('absolute')
      .zIndex('0')
      .left(sidebarWidth - 20)
      .addChild(
        new Span()
          .size(8, 8)
          .borderRadius(4)
          .backgroundColor(Theme.Colors.appBlue01)
          // .display('none')
      );

    this.icon = new Span().addClassName('ic-js-small')
      .color(Theme.Colors.orange);


    this.label = new Label().text(filefolder.name)
      .color(Theme.Colors.Panel.darkText2)
      .whiteSpace('nowrap')
      .fontWeight('500')
      .fontSize(Theme.Fonts.medium)
      .paddingRight(24)
      .height('100%')
      .display('flex')
      .alignItems('center')
      .marginLeft(4);

    this.display('flex')
      .alignItems('center')
      .paddingLeft((filefolder.parent * 20) + 24)
      .height(26).addChild(this.icon, this.label, this.indicator)
      .pseudoSelection({
        backgroundColor: 'transparent'
      });

    this.on({
      click: () => {
        this.selected = !this.selected;
        if(this.selected) {
          // emit globaly selection event
          Bus.emit(Config.events.Sidebar.fileSelected, this.structure);
        }
      },
      mouseenter: () => {
        this.label.color(Theme.Colors.Panel.lightText);
      },
      mouseleave: () => {
        if(!this.selected) {
          this.label.color(Theme.Colors.Panel.darkText2);
        }
      }
    });

    Bus.on(Config.events.Sidebar.fileSelected, (data) => {
      if(this.structure.id !== data.id && this.structure.name !== data.name) {
        if(this.selected) {
          this.selected = false;
          this.backgroundColor(Theme.transparent);
          this.label.color(Theme.Colors.Panel.darkText2);
        }
      }else {
        this.backgroundColor(Theme.Colors.black);
        this.label.color(Theme.Colors.Panel.lightText);
      }
    });
  }
}
