import {
  PageComponent, H1, P, Container
} from '@core/components';

export default class Home extends PageComponent {

  constructor() {
    // initialization
    super();
    const theme = defaultTheme;
    this.backgroundColor(theme.background)
      .padding(theme.padding.medium)
      .color(theme.color);

    const body = new Container();
    body.addChild(
      new H1().text("Welcome to JS-Native")
        .textAlign('center')
        .fontFamily('helvetica, sans-serif')
        .lineHeight('1.6'),
      new P().text("Welcome to the new world of Pure javascript components")
        .textAlign('center')
        .fontSize(theme.small)
    );
    this.addChild(body);
  }
}

