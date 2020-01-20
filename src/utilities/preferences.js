import { Container, Label } from '@core/components';
import { Menu } from '@src/themes/app-theme';

export default {
  startContextMenu: (container) => {
    let showing,
    menus = new Container()
      .stack(Config.contextMenuMenus.map(item => new Menu(item)), { vertical: true }),
    main = new Container()
      .backgroundColor(Theme.Colors.ContextMenu.background)
      .minWidth(220)
      .minHeight(28)
      .position('fixed')
      .borderRadius(5)
      .boxShadow('0px 4px 36px rgba(0,0,0,0.25)')
      .padding(5)
      .addChild(menus);

    window.addEventListener('click', (e) => {
      if(showing) {
        // e.preventDefault();
        main.display('none').top('-100%').left('-100%');
        showing = false;
      }
    });
    window.addEventListener('blur', (e) => {
      if(showing) {
        // e.preventDefault();
        main.display('none').top('-100%').left('-100%');
        showing = false;
      }
    })
    window.oncontextmenu = (e) => {
      Config.contextMenus.forEach(cm => {
        const sender = e.target || e.srcElement;
        if(cm.sender.node() === sender) {
          // open this menu
          e.preventDefault(); e.stopPropagation();
          if(Config.contextMenuSetup[cm.type] == undefined) throw new Error("Context menu for object not properly configured");

          if(cm.type === 'canvas') {
            menus.children().forEach(child => {
              child.toggleDisplay(Config.contextMenuSetup[cm.type].indexOf(child.config.id) >= 0);
            });
          }
          showing = true;
          main.top(e.clientY + 2).left(e.clientX + 2).display('block');
          if(!main.parent()) container.addChild(main);
        }
      });
      // emit locally
      container.emit('contextmenu', e);
      // emit globally
      Bus.emit('contextmenu', e);
      return false;
    }
  }
}
