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
    'button::-moz-focus-inner': { border: 0 }
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
    appBlue01: '#1F8ECD',
    grey3: '#828282',
    white: '#FFFFFF',
    black: '#000000'
  },

  Specs: {
    Panel: {
      lightBorder: '2px solid #6C6C6C',
      cornerRadius: '4px'
    },
    normalBoxPadding: [8, 15]
  },

  transparent: 'transparent'
}

export const KeyContainer = (container, events) => {
  const keyListener = new Container();
  keyListener.tagName = "KeyboardListener";
  container.addChild(keyListener.on(events))
}

export default Theme;

export class Caret extends Span {
  // @enum direction = { left: 1, right: 2, top: 3, bottom: 4 }
  // @enum size = { small: 4, medium: 8, large: 12, xlarge: 16 }
  constructor(size, thickness, direction) {
    super(size, thickness, direction);
    this.display('block')
      .size(size, size)
      .borderColor(Theme.Colors.grey3)
      .borderStyle('solid')
      .borderWidth(0)
      .transform('rotate(-225deg)');
    const caretDirection$ = { left: 1, right: 2, top: 3, bottom: 4 };
    if(direction === caretDirection$.right) this.borderTopWidth(thickness).borderLeftWidth(thickness);
    if(direction === caretDirection$.left) this.borderRightWidth(thickness).borderBottomWidth(thickness);
    if(direction === caretDirection$.bottom) this.borderTopWidth(thickness).borderRightWidth(thickness);
    if(direction === caretDirection$.top) this.borderBottomWidth(thickness).borderLeftWidth(thickness);
  }

}

