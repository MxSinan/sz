import React, {Component} from 'react'
import {TextInput, View, Button} from "react-native";
import PropTypes from "prop-types";

import styles from './styles';

export default class UserInfo extends Component {
  static propTypes = {
    data: PropTypes.object,
    onChange: PropTypes.func,
  }
  static defaultProps = {
    data: {},
    onChange: () => {
    }
  }

  render() {
    const {data: {newUserId = ''} = {} = {}, onChange} = this.props

    return (
        <TextInput
          placeholder={'Enter User Id'}
          style={styles.textInput}
          onChangeText={onChange("newUserId")}
          value={newUserId}
        />
    )
  }
}
