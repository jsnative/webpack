import {
  PageComponent, H1, P, Container
} from '@core/components';
import MainContainer from './components/main-container';
// Preferences
import { Preferences, UserPreferences } from './utilities';
// css font asset
import './assets/inter/stylesheet.css';
import './assets/icon-font/css/fontello.css';

export default class App extends PageComponent {

  state = {

  }

  // main container - S1
  mainContainer;


  constructor() {
    // initialization
    super();
    // load preferences
    Preferences.startContextMenu(this);

    // load user preferences
    Config.UserPreferences = UserPreferences.init();

    // check user validity

    // start utilities
    this.mainContainer = new MainContainer();
    this.addChild(this.mainContainer);

    // start loading files
    // clean up
  }
}

