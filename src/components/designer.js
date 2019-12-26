import { Component, Container, H1, Canvas, Span } from '@core/components';

export default class Designer extends Component {

  canvas; toolbox;
  constructor() {
    super();

    this.canvas = new Canvas()
      .size(5000, 5000)
      .backgroundColor(Theme.Colors.Panel.background);
    this.toolbox = new Toolbox();

    this.background(Theme.Colors.Panel.background)
      .size('auto', '100vh')
      .overflow('auto')
      .position('relative');
    this.addChild(this.canvas, this.toolbox);

    this.canvas.absCenter(true);
  }

  onCreate() {
    // setTimeout(() => this.absCenterLeft(true));
  }
}

export class Toolbox extends Container {

  constructor() {
    super();
    this.backgroundColor(Theme.Colors.Designer.toolboxBackground)
      .borderRadius(24)
      .display('flex')
      .position('absolute')
      .left('50%')
      .padding([4, 0, 4, 4])
      .transform('translateX(-50%)')
      .marginTop(12)
      .boxShadow('0px 4px 6px rgba(0,0,0,0.25)')
      .addChild(
        new Tool('ic-pointer'),
        new Tool('ic-grab'),
        new Tool('ic-text-cursor'),
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
  }
}
