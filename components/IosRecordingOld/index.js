import React, {Component} from 'react';
import {Button, PermissionsAndroid, Platform, StyleSheet, Text, View} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {Colors, Metrics} from "../../Themes";

const ratio = 5
const screenWidth = Metrics.screenWidth

const styles: any = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.snow,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleTxt: {
    color: Colors.black,
  },
  viewRecorder: {
    width: '100%',
    alignItems: 'center',
  },
  recordBtnWrapper: {
    flexDirection: 'row',
  },
  viewPlayer: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  viewBarWrapper: {
    alignSelf: 'stretch',
  },
  viewBar: {
    color: '#ccc',
    alignSelf: 'stretch',
  },
  viewBarPlay: {
    backgroundColor: Colors.gray,
    height: 10
  },
  playStatusTxt: {
    color: Colors.white,
  },
  playBtnWrapper: {
    flexDirection: 'row',
  },
  btn: {
    borderColor: 'white',
  },
  txt: {
    color: 'white',
  },
  txtRecordCounter: {
    color: Colors.black,
    textAlignVertical: 'center',
    fontWeight: '200',
    fontFamily: 'Helvetica Neue',
    letterSpacing: 3,
  },
  txtCounter: {
    color: Colors.black,
    textAlignVertical: 'center',
    fontWeight: '200',
    fontFamily: 'Helvetica Neue',
    letterSpacing: 3,
  },
});

interface IState {
  isLoggingIn: boolean;
  recordSecs: number;
  recordTime: string;
  currentPositionSec: number;
  currentDurationSec: number;
  playTime: string;
  duration: string;
}

class IosRecordingOld extends Component<any, IState> {
  timer: any;
  audioRecorderPlayer: AudioRecorderPlayer;

  constructor(props) {
    super(props);
    this.state = {
      isLoggingIn: false,
      recordSecs: 0,
      recordTime: '00:00:00',
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: '00:00:00',
      duration: '00:00:00',
    };

    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.record && <Text style={styles.txtRecordCounter}>{this.state.recordTime}</Text>}
        {this.props.record && <View style={styles.viewRecorder}>
          <View style={styles.recordBtnWrapper}>
            <Button
              title='RECORD'
              style={styles.btn}
              onPress={this.onStartRecord}/>
            <Button
              style={[
                styles.btn
              ]}
              title='STOP'
              onPress={this.onStopRecord}/>
            {this.state.path && <Button
              style={[
                styles.btn
              ]}
              title='DONE'
              onPress={() => this.props.onSaveRecording(this.state.path)}/>}
          </View>
        </View>}
        <View style={styles.viewPlayer}>
          <Text style={styles.txtCounter}>{this.state.playTime} / {this.state.duration}</Text>
          <View style={styles.playBtnWrapper}>
            <Button
              title={'PLAY'}
              style={styles.btn}
              onPress={this.onStartPlay}/>
            <Button
              style={[
                styles.btn
              ]}
              onPress={this.onPausePlay}
              title={'PAUSE'}/>
            <Button
              style={[
                styles.btn,
              ]}
              title={'STOP'}
              onPress={this.onStopPlay}/>
          </View>
        </View>
      </View>
    );
  }

  onStatusPress = (e: any) => {
    const touchX = e.nativeEvent.locationX;
    console.log(`touchX: ${touchX}`);
    const playWidth = (this.state.currentPositionSec / this.state.currentDurationSec) * (screenWidth - 56 * ratio);
    console.log(`currentPlayWidth: ${playWidth}`);

    const currentPosition = Math.round(this.state.currentPositionSec);
    console.log(`currentPosition: ${currentPosition}`);

    if (playWidth && playWidth < touchX) {
      const addSecs = Math.round((currentPosition + 3000));
      this.audioRecorderPlayer.seekToPlayer(addSecs);
      console.log(`addSecs: ${addSecs}`);
    } else {
      const subSecs = Math.round((currentPosition - 3000));
      this.audioRecorderPlayer.seekToPlayer(subSecs);
      console.log(`subSecs: ${subSecs}`);
    }
  }

  onStartRecord = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Permissions for write access',
            message: 'Give permission to your storage to write a file',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the camera');
        } else {
          console.log('permission denied');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Permissions for write access',
            message: 'Give permission to your storage to write a file',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the camera');
        } else {
          console.log('permission denied');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
    const path = Platform.select({
      ios: 'hello.m4a',
      path: null
    });
    const uri = await this.audioRecorderPlayer.startRecorder(path);
    this.audioRecorderPlayer.addRecordBackListener((e) => {
      this.setState({
        recordSecs: e.current_position,
        recordTime: this.audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
      });
      return;
    });
    console.log(`uri: ${uri}`);
  }

  onStopRecord = async () => {
    const result = await this.audioRecorderPlayer.stopRecorder();
    this.audioRecorderPlayer.removeRecordBackListener();
    alert(result)
    this.setState({
      recordSecs: 0,
      path: result
    });
    console.log(result);
  }

  onStartPlay = async () => {
    const path = Platform.select({
      ios: 'hello.m4a'
    });
    alert(this.props.audioPath || path)
    const msg = await this.audioRecorderPlayer.startPlayer(this.props.audioPath || path);
    this.audioRecorderPlayer.setVolume(1.0);
    console.log(msg);
    this.audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.current_position === e.duration) {
        this.audioRecorderPlayer.stopPlayer();
      }
      this.setState({
        currentPositionSec: e.current_position,
        currentDurationSec: e.duration,
        playTime: this.audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
        duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      });
      return;
    });
  }

  onPausePlay = async () => {
    await this.audioRecorderPlayer.pausePlayer();
  }

  onStopPlay = async () => {
    this.audioRecorderPlayer.stopPlayer();
    this.audioRecorderPlayer.removePlayBackListener();
  }
}

export default IosRecordingOld;
