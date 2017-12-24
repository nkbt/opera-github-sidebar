const e = (...args) => React.createElement(...args);
const F = React.Fragment;


const Input = ({name, value, asPassword}) => e('input', {
  type: asPassword.includes(name) ? 'password' : 'text',
  value,
  onChange: event => chrome.storage.local.set({[name]: event.target.value})
});


const Option = props => e('label', {className: 'options-label'},
  e(F, {},
    e('span', {}, props.name),
    e(Input, props)
  ));


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.onOptionsChange = this.onOptionsChange.bind(this);
  }


  componentDidMount() {
    this.unsubscribe = optionsStore(this.onOptionsChange);
  }


  componentWillUnmount() {
    this.unsubscribe();
  }


  onOptionsChange(options) {
    this.setState(options);
  }


  render() {
    const options = this.state;
    const {asPassword} = this.props;

    return e(F, {},
      e('h1', {}, 'Options'),
      Object.keys(options).map(key =>
        e(Option, {
          key,
          name: key,
          value: options[key],
          asPassword
        })));
  }
}


const onLoad = () => ReactDOM.render(e(App, {
  asPassword: ['token']
}), document.querySelector('[data-app]'));


window.addEventListener('load', onLoad, false);
