import { PageComponent } from '@core/components';

export default class Home extends PageComponent {

  state = {
    title: "JS-Native App",
    description: "Welcome to JS-Native"
  }
  constructor() {
    // initialization
    console.log("Hello world");
  }
}

