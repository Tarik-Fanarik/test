import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import Select from 'react-select';
 
const options = [
  { value: 'pl', label: 'Polska' },
  { value: 'en', label: 'English' },
];
 
class ChangeLanguage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: this.corectLanguage(),
    };
  }
  corectLanguage = () => {
    options.find((item) => {
      return item.value === this.props.i18n.language;
    });
  }
  translate = (language) => {
    const { i18n } = this.props;
    const { value } = language;
    this.setState({
      language,
    });
    i18n.changeLanguage(value);
  }
  render() {
    const { language } = this.state;
    return (
      <div>
        <Select
          defaultValue={options[0]}
          options={options}
          value={language}
          onChange={this.translate}
          className="App-Select"
        />
      </div>
    );
  }
};
 
export default withTranslation('translations')(ChangeLanguage);
