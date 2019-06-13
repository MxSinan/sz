import React from 'react'
import PropTypes from 'prop-types'
import {Text, TouchableOpacity, View} from 'react-native'

import styles from './styles'
import {Metrics} from "../../Themes";


export default class RecordingItem extends React.Component {
  static propTypes = {
    item: PropTypes.object,
    onItemPress: PropTypes.func,
  }
  static defaultProps = {
    item: {},
    onItemPress: () => {
    }
  }

  render() {
    const {
      item: {
        ReportingType, State, Date
      } = {}, onItemPress
    } = this.props

    return (
      <TouchableOpacity activeOpacity={0.8} style={styles.itemContainer} onPress={onItemPress}>
        <View style={styles.itemContent}>
          <Text style={styles.itemText} numberOfLines={1}>{ReportingType}</Text>
          <Text style={[styles.itemText, {marginHorizontal: Metrics.marginFifteen}]}>{Date}</Text>
          <Text style={styles.itemText} numberOfLines={1}>{State}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}
