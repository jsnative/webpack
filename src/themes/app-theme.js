import {
  Span, Container
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
    appBlue01: '#1F8ECD',
    grey3: '#828282',
    orange: '#FFAA20',
    white: '#FFFFFF',
    black: '#000000'
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
        e.preventDefault();
        e.stopPropagation();
        key += e.key.toLowerCase();
        console.warn("keylistener >>> "+key);
        if(events.hasOwnProperty(key)) {
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

