export default {
  startContextMenu: (container) => {
    window.oncontextmenu = (e) => {
      Config.contextMenus.forEach(cm => {
        const sender = e.target || e.srcElement;
        if(cm.sender.node === sender) {
          // open this menu
          console.log(cm.menu);
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
