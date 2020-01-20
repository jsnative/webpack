import {
  Span, Container, Component, Label, HR
} from "@core/components";

const Theme = {
  Globals: {
    '*': {
      boxSizing: 'border-box',
      outline: 'none'
    },
    html: { margin: 0 },
    body: { margin: 0, fontFamily:  '"Inter", -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'},
    button: {
      outline: 0, border: 0
    },
    'button:focus':{ outline: 0 },
    // @only Mozilla
    // 'button::-moz-focus-inner': { border: 0 }
  },

  Fonts: {
    xsmall: 8,
    small: 10,
    medium: 12,
    normal: 14,
    large: 16,
    xlarge: 20
  },

  Colors: {
    Panel: {
      background: '#2D2D2D',
      resizeHandle: '#1D1D1D',
      darkText: '#636363',
      darkText2: '#828282',
      darkBorder: '#6C6C6C',
      lightText: '#F2F2F2'
    },
    Editor: {
      background: '#070707'
    },
    Designer: {
      toolboxBackground: '#141414'
    },
    ContextMenu: {
      background: '#141414',
      textColor: '#BDBDBD',
      borderColor: '#1E2625'
    },
    appBlue01: '#1F8ECD',
    grey3: '#828282',
    orange: '#FFAA20',
    white: '#FFFFFF',
    black: '#000000',
    $: {
      darken: (color, percent) => {
        return Theme.Colors.$.lighten(color, -percent);
      },
      lighten: (color, percent) => {
        percent = percent / 100;
        /* Credit: https://github.com/PimpTrizkit/PJs/wiki
          12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)
         */
        const f = parseInt(color.slice(1), 16);
        const t = percent < 0 ? 0 : 255;
        const p = percent < 0 ? percent * -1 : percent;
        const R = f >> 16;
        const G = f >> 8 & 0x00FF;
        const B = f & 0x0000FF;
        return '#' + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000
          + (Math.round((t - G) * p) + G) * 0x100
          + (Math.round((t - B) * p) + B)).toString(16).slice(1);
      }
    }
  },

  Specs: {
    Panel: {
      lightBorder: '2px solid #6C6C6C',
      cornerRadius: '4px'
    },
    normalBoxPadding: [8, 15],
    sidebarSearchPadding: 8
  },

  transparent: 'transparent'
}

export const KeyContainer = function(container, events) {
  let ctrl, alt, shift, key = '';
  const register = function(e) {
    if(e.type === 'keydown') {
      if(!alt) {
        alt = e.key === 'Alt' && e.keyCode === 18;
        if(alt) { e.preventDefault(); return; }
      }
      if(!ctrl) {
        ctrl = e.key === 'Control' && e.keyCode === 17;
        if(ctrl) { e.preventDefault(); return; }
      }
      if(!shift) {
        shift = e.key === 'Shift' && e.keyCode === 16;
        if(shift) { e.preventDefault(); return; }
      }

      if(alt) key += 'alt+';
      if(ctrl) key += 'ctrl+';
      if(shift) key += 'shift+';

      if(alt || ctrl || shift) {
        key += e.key.toLowerCase();
        if(events.hasOwnProperty(key)) {
          e.preventDefault();
          e.stopPropagation();
          console.warn("keylistener >>> "+key);
          Function.prototype.call.apply(events[key]);
        }
      }
    }
    if(e.type === 'keyup') {
      alt = ctrl = shift = false;
      key = '';
    }
  }

  container.on({
    'keypress': (e) => register(e),
    'keydown': (e) => register(e),
    'keyup': (e) => register(e)
  });

}

export default Theme;

export class Caret extends Span {
  constructor(size, thickness, direction) {
    super(size, thickness, direction);

    this.display('block')
      .size(size, size)
      .borderColor(Theme.Colors.grey3)
      .borderStyle('solid')
      .borderWidth(0)
      .transform('rotate(-225deg)');

    const dir = Config.caretDirection;
    if(direction === dir.right) this.borderTopWidth(thickness).borderLeftWidth(thickness);
    if(direction === dir.left) this.borderRightWidth(thickness).borderBottomWidth(thickness);
    if(direction === dir.bottom) this.borderTopWidth(thickness).borderRightWidth(thickness);
    if(direction === dir.top) this.borderBottomWidth(thickness).borderLeftWidth(thickness);
  }
}

export class Menu extends Container {
  label; caret; shortcut; subs; config;
  constructor(menu) {
    super(menu);
    this.config = menu;
    if(!this.config.separator) {
      this.label = new Label().text(this.config.title)
        .size('100%', 24).display('inline-block')
        .fontSize(Theme.Fonts.normal)
        .whiteSpace('nowrap').marginRight(10);
      this.subs = new Container()
        .backgroundColor(Theme.Colors.ContextMenu.background)
        .size(220, 'auto')
        .minHeight(50)
        .position('absolute')
        .left('100%')
        .top(0)
        .borderRadius(5)
        .boxShadow('0px 4px 36px rgba(0,0,0,0.25)')
        .padding(5);
      this.lineHeight('1.6')
        .padding(0, 8)
        .borderRadius(3)
        .display('flex')
        .justifyContent('space-between')
        .color(Theme.Colors.ContextMenu.textColor)
        .addChild(this.label)
        .on({
          mouseover: () => { this.setHover() },
          mouseout: () => { this.clearHover() },
          mouseup: () => { this.clearHover() }
        })
      if(this.config.subs) {
        this.caret = new Caret(8, 2, 2)
          .alignSelf('center');
        this.position('relative');
        this.addChild(this.caret, this.subs);
        this.subs.stack(this.config.subs.map(item => new Menu(item)), { vertical: true })
          .display('none');
      }
      if(this.config.shortcut) {
        this.addChild(
          this.shortcut = new Span()
            .fontSize(Theme.Fonts.normal)
            .color(Theme.Colors.$.darken(Theme.Colors.ContextMenu.textColor, 30))
            .text(this.config.shortcut).whiteSpace('nowrap')
        );
      }
      if(this.config.fns) {
        this.on({
          click: (e) => {
            this.config.fns();
          }
        });
      }
    }else {
      this.addChild(
          new HR()
            .borderColor(Theme.Colors.ContextMenu.borderColor)
        )
    }
  }

  clearHover() {
    this.backgroundColor(Theme.Colors.transparent);
    if(this.label) this.label.color(Theme.Colors.ContextMenu.textColor);
    if(this.caret) this.caret.borderColor(Theme.Colors.ContextMenu.textColor);
    if(this.shortcut) this.shortcut.color(Theme.Colors.$.darken(Theme.Colors.ContextMenu.textColor, 30));
    if(this.subs) this.subs.display('none');
  }

  setHover() {
    this.backgroundColor(Theme.Colors.appBlue01);
    if(this.label) this.label.color(Theme.Colors.white);
    if(this.caret) this.caret.borderColor(Theme.Colors.white);
    if(this.shortcut) this.shortcut.color(Theme.Colors.white);
    if(this.subs) this.subs.display('flex');
  }

  toggleDisplay(check) {
    if(this.config.separator) {
      if(check) this.display('block');
      else this.display('none');
    }else {
      if(check) this.display('flex');
      else this.display('none');
    }
  }
}
