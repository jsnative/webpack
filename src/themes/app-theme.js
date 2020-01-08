import {
  Span, Container, Component
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
    black: '#000000',
    $: {
      darken: (color, percent) => {
        return Color.$.lighten(color, -percent);
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

export class ScrollComponent extends Component {

  _bar; _content;

  constructor(...args) {
    super(...args);
    this._bar = new Container()
      .position('absolute')
      .backgroundColor('rgba(0, 0, 0, 1)')
      .width(9).borderRadius(4).top(0).zIndex('2').cursor('pointer')
      .transition('opacity 0.25s linear')
      .minHeight('40px');
    this._content = new Container()
      .size('calc(100% + 18px)', '100%')
      .padding('0 0 0 0')
      .overflowX('auto')
      .overflowY('scroll')
      .boxSizing('border-box');
    this.height('1500px');
    let lastPageY,
      raf = window.requestAnimationFrame || w.setImmediate || function(c) { return setTimeout(c, 0); };
    this._bar.on({
      mousedown: function(e) {
        lastPageY = e.pageY;
        // set mousedown css
        window.addEventListener('mousemove', drag);
        window.addEventListener('mouseup', stop);
        return false;
      }
    });
    this.position('relative')
      .overflow('hidden')
      .zIndex('1');

    const drag = (e) => {
      let delta = e.pageY - lastPageY;
      lastPageY = e.pageY;
      raf(() => {
        this._content.node().scrollTop += delta / this.scrollRatio;
      });
    }

    const stop = function() {
      // remove mousedown css
      window.removeEventListener('mousemove', drag);
      window.removeEventListener('mouseup', stop);
    }

    const moveBar = (e) => {
      let totalHeight = this.node().scrollHeight,
          ownHeight = this.node().clientHeight;

      this.scrollRatio = ownHeight / totalHeight;

      var isRtl = this.direction() === 'rtl';
      var right = isRtl ?
        (this._content.node().clientWidth - this._bar.node().clientWidth + 18) :
        (this._content.node().clientWidth - this._bar.node().clientWidth) * -1;

      raf(() => {
        // Hide scrollbar if no scrolling is possible
        if(this.scrollRatio >= 1) {
          // this._bar.classList.add('ss-hidden')
        } else {
          // _this.bar.classList.remove('ss-hidden')
          this._bar.height(Math.max(this.scrollRatio * 100, 10) + '%')
            .top((this._content.node().scrollTop / totalHeight ) * 100 + '%')
            .right(right);
        }
      });
    }

    super.addChild(this._content, this._bar);
  }

  addChild(...children) {
    this._content.addChild(...children);
    return this;
  }

}

