const e = (...args) => React.createElement(...args);
const F = React.Fragment;


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {},
      url: ''
    };
    this.onOptionsChange = this.onOptionsChange.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
  }


  componentDidMount() {
    this.unsubscribe = optionsStore(this.onOptionsChange);
    chrome.tabs.onUpdated.addListener(this.onTabChange);
    chrome.tabs.onActivated.addListener(this.onTabChange);
  }


  componentWillUnmount() {
    this.unsubscribe();
    chrome.tabs.onUpdated.removeListener(this.onTabChange);
    chrome.tabs.onActivated.removeListener(this.onTabChange);
  }


  onOptionsChange(options) {
    this.setState({options})
  }


  onTabChange() {
    chrome.tabs.query({
      'currentWindow': true,
      'active': true,
      'url': 'https://github.com/*'
    }, ([{url = ''} = {}]) => this.setState({url}));
  }


  render() {
    const {url} = this.state;

    return e(F, {},
      e('h1', {}, 'Github'),
      e('div', {}, url)
    );
  }
}


const onLoad = () => ReactDOM.render(e(App, {}), document.querySelector('[data-app]'));


window.addEventListener('load', onLoad, false);
