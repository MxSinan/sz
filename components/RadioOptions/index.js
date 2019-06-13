import React, {Component} from 'react'
import PropTypes from "prop-types";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

import styles from './styles'
import {Colors, Fonts, Metrics} from "../../Themes";

const OPTIONS = [
  {label: 'Subjective', value: 's'},
  {label: 'Objective', value: 'o'},
  {label: 'Analysis', value: 'a'},
  {label: 'Plan', value: 'p'}
];

export default class RadioOptions extends Component {
  static propTypes = {
    options: PropTypes.array,
    onPress: PropTypes.func,
    selected: PropTypes.string,
  }
  static defaultProps = {
    options: OPTIONS,
    selected: '',
    onSelectOption: () => {
    }
  }

  _renderRadioButton = (data, key) => {
    return <RadioButton labelHorizontal={true} key={key}>
      <RadioButtonInput
        obj={data}
        index={key}
        isSelected={this.props.selected === data.value}
        onPress={this.props.onSelectOption}
        borderWidth={1}
        buttonInnerColor={Colors.blue}
        buttonOuterColor={this.props.selected === data.value ? Colors.blue : Colors.black}
        buttonSize={Fonts.size.regular}
        buttonOuterSize={Fonts.size.regular}
        buttonStyle={{}}
        buttonWrapStyle={{marginVertical: Metrics.marginFifteen}}
      />
      <RadioButtonLabel
        obj={data}
        index={key}
        labelHorizontal={true}
        onPress={this.props.onSelectOption}
        labelStyle={styles.labelContent}
      />
    </RadioButton>
  }

  render() {
    const {options = []} = this.props

    return (
      <RadioForm
        formHorizontal={false}
        animation={true}>
        {options.map((data, key) => this._renderRadioButton(data, key))}
      </RadioForm>
    )
  }
}
