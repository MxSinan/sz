import React, {Component} from 'react'
import RNFS from "react-native-fs";
import {FlatList, TouchableOpacity, Text, View, Button, Platform} from "react-native";
import {RNVoiceRecorder} from "react-native-voice-recorder";
import {orderBy} from 'lodash'

import styles from './styles'
import RecordingItem from "../../components/RecordingItem";
import {getRecordings, getSpecificRecording, saveRecording} from "../../services/ApiCaller";
import ProgressDialog from "../../components/ProgressDialog";
import VectorIcon from "../../components/VectorIcon";
import {getAsyncData, getFileUri, retrieveData, showMessage, storeData} from "../../utils";
import UserInfo from "../../components/UserInfo";
import RadioOptions from "../../components/RadioOptions";
import OptionModal from "../../components/OptionModal";
import IosRecording from "../../components/IosRecording";

const RECORDING_STATE = {
  RECORDING: 'RECORDING',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  STOPPED: 'STOPPED'
}
export default class RecordingListingScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      userid: '',
      newUserId: '',
      offset: 0,
      limit: 20,
      recordings: [],
      hasMore: true,
      refreshing: false
    }
  }

  async componentDidMount(): void {
    const userid = await retrieveData("userid")
    this.setState({
      userid,
      newUserId: userid,
    }, this.getRecordingApiCall)
  }

  async getRecordingApiCall(reset = false): void {
    const {recordings = [], offset = 0, limit = 20, userid} = this.state
    try {
      const newRecordings = await getRecordings({offset, limit, userid})
      this.setState({
        hasMore: newRecordings.result !== -1,
        recordings: orderBy(reset ? newRecordings.recordings : [...recordings, ...newRecordings.recordings], 'Number', 'desc')
      })
    } catch (e) {
      this.setState({
        hasMore: false
      })
    } finally {
      this.setState({
        loading: false,
        refreshing: false
      })
    }
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
      offset: 0,
      limit: 20,
    }, () => this.getRecordingApiCall(true))
  }

  onEndReached = () => {
    const {hasMore = true, offset = 0, limit = 20} = this.state
    if (!hasMore) {
      return
    }

    this.setState({
      loading: true,
      offset: offset + limit
    }, this.getRecordingApiCall)
  }

  _onRecord = () => {
    RNVoiceRecorder.Record({
      format: 'wav',
      onDone: async (path) => {
        this.setState({
          offset: 0,
          loading: true
        })
        const {userid, offset, selected} = this.state
        try {
          const base = await RNFS.readFile(path, 'base64');
          await saveRecording({userid, base: `data:audio/wav;base64,${base}`, soap: selected})
          this.getRecordingApiCall(true)
        } catch (err) {
          this.setState({
            offset,
            loading: false
          })
        }
      },
      onCancel: () => {
      }
    });
  }

  _onPlay = (path, format) => {
    if (!path) {
      return;
    }

    RNVoiceRecorder.Play({
      path: path,
      format: format,
      onDone: path => {
      },
      onCancel: () => {
      }
    });
  }

  onItemPress = async (id) => {
    const {userid, path} = this.state
    this.setState({
      loading: true
    })
    try {
      const data = await getSpecificRecording({userid, id})
      const {base64 = null} = data
      if (!base64 || base64 == 'none') {
        showMessage("Audio is not found for this entry")
        return;
      }

      const path = await getFileUri(base64, id, 'wav', path)
      if (Platform.OS === 'ios') {
        this.setState({
          audioPath: path
        })
        return;
      }
      this._onPlay(path, 'wav')
    } catch (e) {
    } finally {
      this.setState({
        loading: false
      })
    }
  }

  onChange = (key) => (value) => {
    this.setState({
      [key]: value
    })
  }

  onSave = () => {
    const {newUserId} = this.state
    this.setState({
      userid: newUserId,
      loading: true,
      offset: 0
    }, () => this.getRecordingApiCall(true))
    storeData("userid", newUserId)
  }

  onSelectOption = (selected) => {
    this.setState({
      selected
    })
  }

  onToggleModal = (key, value) => () => {
    this.setState({
      [key]: value,
      selected: ''
    })
  }

  onSaveIOSRecording = async (path, isBase64) => {
    this.setState({
      offset: 0,
      loading: true,
      recordingIOS: false
    }, async () => {
      const {userid, offset, selected} = this.state
      try {
        let base = path
        if (!isBase64) {
          base = await RNFS.readFile(path, 'base64');
        }
        await saveRecording({userid, base: `data:audio/wav;base64,${base}`, soap: selected})
        this.getRecordingApiCall(true)
      } catch (err) {
        alert(JSON.stringify(err))
        this.setState({
          offset,
          loading: false
        })
      }
    })
  }

  renderRecordingItem = ({item}) => {
    return (
      <RecordingItem item={item} onItemPress={() => this.onItemPress(item.Number)}/>
    )
  }

  renderNewRecordingButton = () => {
    return (
      <TouchableOpacity onPress={this.onToggleModal('optionModalVisible', true)} style={styles.addContainer}>
        <VectorIcon name={'plus'} type={'Entypo'} style={styles.icon}/>
      </TouchableOpacity>
    )
  }

  renderUserButton = () => {
    return (
      <TouchableOpacity onPress={this.onToggleModal('userModalVisible', true)} style={styles.userContainer}>
        <VectorIcon name={'user'} type={'Entypo'} style={styles.icon}/>
      </TouchableOpacity>
    )
  }

  renderEmptyComponent = () => {
    return <View style={styles.emptyContainer}>
      {!this.state.loading && <Text>No Recording Available</Text>}
    </View>
  }

  renderOptionModal = () => {
    const {selected = '', optionModalVisible = false} = this.state
    return <OptionModal visible={optionModalVisible}
                        onClose={this.onToggleModal('optionModalVisible', false)}>
      <Text style={styles.heading}>Options</Text>
      <RadioOptions
        onSelectOption={this.onSelectOption}
        selected={selected}/>

      <View style={styles.buttonContainer}>
        <TouchableOpacity activeOpacity={0.8} style={styles.btn}
                          onPress={this.onToggleModal('optionModalVisible', false)}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={styles.btn} onPress={() => {
          this.setState({
            'optionModalVisible': false
          }, () => {
            if (Platform.OS === 'ios') {
              this.setState({
                recordingIOS: true
              })
              return;
            }
            // setTimeout(() => this._onRecord(), 500)
          })
        }} disabled={!selected}>
          <Text style={styles.okText}>Ok</Text>
        </TouchableOpacity>
      </View>
    </OptionModal>
  }

  renderUserModal = () => {
    const {userModalVisible = false} = this.state

    return <OptionModal visible={userModalVisible}
                        onClose={this.onToggleModal('userModalVisible', false)}>
      <Text style={styles.heading}>User</Text>
      <UserInfo data={this.state}
                onChange={this.onChange}
                onSave={this.onSave}/>

      <View style={styles.buttonContainer}>
        <TouchableOpacity activeOpacity={0.8} style={styles.btn}
                          onPress={this.onToggleModal('userModalVisible', false)}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={styles.btn} onPress={() => {
          this.setState({
            'userModalVisible': false
          }, () => setTimeout(this.onSave, 200))
        }}>
          <Text style={styles.okText}>Ok</Text>
        </TouchableOpacity>
      </View>
    </OptionModal>
  }

  renderListingPage = () => {
    const {refreshing = false, recordings = [], recordingState} = this.state

    return <>
      {this.renderOptionModal()}
      {this.renderUserModal()}

      <FlatList
        data={recordings}
        extraData={this.state}
        refreshing={refreshing}
        onRefresh={this.onRefresh}
        renderItem={this.renderRecordingItem}
        onEndReached={this.onEndReached}
        ListEmptyComponent={this.renderEmptyComponent}
        contentContainerStyle={styles.contentContainerStyle}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => String(item && item.Number ? item.Number : index)}
      />
      {this.renderNewRecordingButton()}
      {this.renderUserButton()}
    </>
  }

  hideIosRecording = () => {
    this.setState({recordingIOS: false, audioPath: null})
  }
  renderIOSRecordingPage = () => {
    const {recordingIOS, audioPath} = this.state

    return <IosRecording onSaveRecording={this.onSaveIOSRecording}
                         record={recordingIOS}
                         audioPath={audioPath}
                         onHideIosRecording={this.hideIosRecording}
    />
  }

  render() {
    const {loading = true, recordingIOS, audioPath} = this.state
    console.log('showIosView: ' + (Platform.OS === 'ios' && (recordingIOS || audioPath)))
    return (
      <>
        {!recordingIOS && !audioPath && this.renderListingPage()}
        {Platform.OS === 'ios' && (recordingIOS || audioPath) ? this.renderIOSRecordingPage() : null}
        <ProgressDialog hide={!loading}/>
      </>
    )
  }
}
