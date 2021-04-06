import { PageComponent, H1, P, Container } from '@core/components';
import theme, { RoundButton } from '@src/theme';

export default class Home extends PageComponent {

  body;

  constructor() {
    // initialization
    super();
    this.state = {
      name: 'Test Podddy'
    };
    this.nome = {
      effect: 'fixed'
    };
    this.backgroundColor(theme.background)
      .padding(theme.padding.medium)
      .color(theme.color)
      .minHeight('100vh')
      .flexCenter(true);

    this.body = new Container()
      .transition('all ease-in-out .2s');
    this.body.addChild(
      new H1().text('Welcome to JS-Native')
        .textAlign('center')
        .fontFamily('helvetica, sans-serif')
        .lineHeight('1.6')
        .fontSize(28),
      new P().text('Welcome to the new world of Pure javascript components')
        .textAlign('center')
        .fontSize(theme.small),
      new H1().text(this.state.name)
        .color('red').fontSize(28)
    );
    this.body.on({
      click: () => {
        this.body.padding(15).boxShadow('0px 0px 15px rgba(0,0,0,0.15)');
      },
      dblclick: () => {
        this.body.padding(40);
        this.state.name = 'Special effect';
        this.nome.effect = 'test';
      }
    })

    this.nome.effect.watch((v) => {
      if(v === 'test') {
        this.body.border('2px solid pink');
      }
    });

    const button = new RoundButton('Hello world');
    this.body.addChild(button);
    button.absCenterBottom(true)
      .top('calc(100% + 20px)');
    this.addChild(this.body);
  }

  onCreate() {
    setTimeout(() => {
      this.body.backgroundColor('red');
      setTimeout(() => {
        this.body.backgroundColor('green');
      }, 2000);
    }, 2000);
  }
}

