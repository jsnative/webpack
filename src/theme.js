import { Button, Section } from '@core/components';

const Theme = {
    background: '#414141',
    padding: {
        medium: 15
    },
    color: '#fff',
    small: 12
};

export default Theme;

export class RoundButton extends Button {

  constructor(text) {
    super(text);
    this.text(text)
      .backgroundColor('#FFF')
      .boxShadow('2px 5px 8px rgba(0,0,0,0.1)')
      .cornerRadius(15)
      .padding([4, 15])
      .color(Theme.background)
  }
}

export class PadSection extends Section {
  constructor(children) {
    super(children);
    this.addChild();
  }
}
