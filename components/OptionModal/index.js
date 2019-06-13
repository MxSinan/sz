import React, {Component} from 'react'
import {Modal, ScrollView,  View} from "react-native"

import styles from './styles'

export default class OptionModal extends Component {
  render() {
    return (
        <Modal
          animationType="slide"
          transparent={true}
          style={styles.mainContainer}
          hardwareAccelerated={true}
          visible={this.props.visible}
          onRequestClose={this.props.onClose}>
          <View style={styles.modalContainer}>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.contentContainer}>
              {this.props.children}
            </ScrollView>
          </View>
        </Modal>
    );
  }
}
