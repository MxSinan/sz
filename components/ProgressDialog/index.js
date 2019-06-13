import React, { Component } from 'react'
import { ActivityIndicator, View } from 'react-native'
import Colors from '../../Themes/Colors'

export default class ProgressDialog extends Component {
  render () {
    const {hide, containerStyles} = this.props
    return hide ? null : (
      <View style={containerStyles || styles.container}>
        <ActivityIndicator size={'large'} color={Colors.snow} />
      </View>
    )
  }
}

const styles = {
  container: {
    width: 100,
    height: 100,
    position: 'absolute',
    left: '50%',
    top: '50%',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginLeft: -50,
    marginTop: -50
  }
}
