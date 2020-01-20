import {Container, Component, H1, Canvas, Span } from '@core/components';
import Draw from './draw';
import { Draggable, Scrollable } from '../utilities';
import SimpleBar from 'simplebar';
import { Menu } from '@src/themes/app-theme';

export default class Designer extends Component {

  canvas; toolbox;
  draw; cursor;
  constructor() {
    super();
    Config.designer = this;

    this.toolbox = new Toolbox();
    const cont = new Container()
      .backgroundColor(Theme.Colors.white)
      .size(1400, 1600)
      .position('relative');
    Config.registerContextMenu(cont);
    this.canvas = new Container()
      .padding(800)
      .size('auto', 'auto')
      .display('inline-block')
      .addChild(cont);
    Config.registerContextMenu(this.canvas, 'canvas');

    this.backgroundPosition('0px 0px, 48px 48px, 0px 1px, 16px 16px')
      .backgroundRepeat('repeat, repeat, repeat, repeat')
      .backgroundAttachment('scroll, scroll, scroll, scroll')
      .backgroundImage('radial-gradient(at center center, black 1%, transparent 6%), radial-gradient(at center center, black 1%, transparent 6%), radial-gradient(at center center, rgba(255, 255, 255, 0.1) 0%, transparent 10%), radial-gradient(at center center, rgba(255, 255, 255, 0.1) 0%, transparent -1%)')
      .backgroundOrigin('padding-box, padding-box, padding-box, padding-box')
      .backgroundClip('border-box, border-box, border-box, border-box')
      .backgroundColor(Theme.Colors.Panel.background)
      .backgroundSize('24px 24px')
      .size('auto', '100vh')
      .position('relative')
      .boxSizing('border-box');
    this.addChild(this.toolbox, this.canvas);

    Bus.on(Config.events.Designer.cursorV, () => { cursor = 'v'; });

    let sx, sy, started = false, last;
    Draggable(this, (x, y, event) => {
      if(this.draw && event.target.tagName.toLowerCase() === 'canvas') {
        const lx = event.layerX, ly = event.layerY;
        if(!started) {
          sx = lx; sy = ly;
          started = true;
        }else {
          if(last) {
            if(last.x === sx && last.y === sy) {
              if(sx > lx || sy > ly) {
                this.draw.ctx.clearRect(last.x + 1, last.y + 1, last.w - 2, last.h - 2);
              }else {
                this.draw.ctx.clearRect(last.x - 1, last.y - 1, last.w + 2, last.h + 2);
              }
            }
          }
        }
        this.draw.ctx.globalCompositeOperation = 'source-over';
        this.draw.ctx.beginPath();
        this.draw.ctx.strokeStyle = Theme.Colors.appBlue01;
        this.draw.ctx.fillStyle = Theme.Colors.$.lighten(Theme.Colors.appBlue01, 50) + '40'
        this.draw.ctx.rect(sx, sy, lx - sx, ly - sy);
        last = { x: sx, y: sy, w: lx - sx, h: ly - sy };
        this.draw.ctx.stroke();
        this.draw.ctx.fill();
      }
    }, {
      mouseup: () => {
        started = false;
      }
    });

  }

  onCreate() {
    new SimpleBar(this.node());
  }
}

export class Toolbox extends Container {

  constructor() {
    super();
    this.backgroundColor(Theme.Colors.Designer.toolboxBackground)
      .borderRadius(24)
      .display('flex')
      .position('fixed')
      .right(0)
      .padding([4, 0, 4, 4])
      .transform('translateX(-50%)')
      .marginTop(12)
      .boxShadow('0px 4px 6px rgba(0,0,0,0.25)')
      .addChild(
        new Tool('ic-pointer-filled')
          .on({ click: function() {
            Bus.emit(Config.events.Designer.clearCursor, true);
            Bus.emit(Config.events.Designer.cursorV, true);
            this.enable();
            Config.designer.cursor('default');
          } })
          .paddingLeft(3),
        new Tool('ic-grab')
          .on({ click: function() {
            Bus.emit(Config.events.Designer.clearCursor, true);
            Bus.emit(Config.events.Designer.cursorGrab, true);
            this.enable();
            Config.designer.cursor('grab');
          } }),
        new Tool('ic-text-cursor')
          .on({ click: function() {
            Bus.emit(Config.events.Designer.clearCursor, true);
            Bus.emit(Config.events.Designer.cursorText, true);
            this.enable();
            Config.designer.cursor('text');
          } }),
        // new Tool('ic-')
      )

  }
}

export class Tool extends Span {
  constructor(icon){
    super(icon);
    this.backgroundColor('transparent')
      .addClassName(icon)
      .color(Theme.Colors.white)
      .size(32, 32)
      .borderRadius(16)
      .marginRight(4)
      .hover({ backgroundColor: '#4C4C4C' })
      .cursor('pointer')
      .flexCenter(true);

    Bus.on(Config.events.Designer.clearCursor, () => {
      this.backgroundColor('transparent');
    })
  }

  enable() {
    this.backgroundColor('#4C4C4C');
  }
}
