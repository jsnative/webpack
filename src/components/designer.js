import { Component, Container, H1 } from '@core/components';

export default class Designer extends Component {

  constructor() {
    super();
    this.state = {
      time: '00:00:00'
    }
    this.background(Theme.Colors.Panel.background)
      .size('auto', '100vh');
  }

  onCreate() {
    // setTimeout(() => this.absCenterLeft(true));
  }
}
