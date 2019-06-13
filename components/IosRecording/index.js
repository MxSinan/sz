import React, {Component} from 'react';
import * as lodash from 'lodash'
import {Platform, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View,} from 'react-native';

import Sound from 'react-native-sound';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import Entypo from "react-native-vector-icons/Entypo";

class IosRecording extends Component {

  constructor(props) {
    super(props)
  }
  state = {
    currentTime: 0.0,
    recording: false,
    paused: false,
    stoppedRecording: false,
    finished: false,
    audioPath: AudioUtils.DocumentDirectoryPath + '/test.wav',
    hasPermission: undefined,
  };

  prepareRecordingPath(audioPath){
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      AudioEncoding: "lpcm",
      IncludeBase64: true
    });
  }

  componentDidMount() {
    AudioRecorder.requestAuthorization().then((isAuthorised) => {
      this.setState({ hasPermission: isAuthorised });

      if (!isAuthorised) return;

      this.prepareRecordingPath(this.state.audioPath);

      AudioRecorder.onProgress = (data) => {
        this.setState({currentTime: Math.floor(data.currentTime)});
      };

      AudioRecorder.onFinished = (data) => {
        // Android callback comes in the form of a promise instead.
        if (Platform.OS === 'ios') {
          this._finishRecording(data.status === "OK", data.audioFileURL, data.audioFileSize, data.base64);
        }
      };
    });
  }

  _renderButton(title, onPress, active) {
    var style = (active) ? styles.activeButtonText : styles.buttonText;

    return (
      <TouchableHighlight style={styles.button} onPress={onPress}>
        <Text style={style}>
          {title}
        </Text>
      </TouchableHighlight>
    );
  }

  _renderPauseButton(onPress, active) {
    var style = (active) ? styles.activeButtonText : styles.buttonText;
    var title = this.state.paused ? "RESUME" : "PAUSE";
    return (
      <TouchableHighlight style={styles.button} onPress={onPress}>
        <Text style={style}>
          {title}
        </Text>
      </TouchableHighlight>
    );
  }

  async _pause() {
    if (!this.state.recording) {
      console.warn('Can\'t pause, not recording!');
      return;
    }

    try {
      const filePath = await AudioRecorder.pauseRecording();
      this.setState({paused: true});
    } catch (error) {
      console.error(error);
    }
  }

  async _resume() {
    if (!this.state.paused) {
      console.warn('Can\'t resume, not paused!');
      return;
    }

    try {
      await AudioRecorder.resumeRecording();
      this.setState({paused: false});
    } catch (error) {
      console.error(error);
    }
  }

  async _stop() {
    if (!this.state.recording) {
      console.warn('Can\'t stop, not recording!');
      return;
    }

    this.setState({stoppedRecording: true, recording: false, paused: false});

    await this.onStopPlay()
    try {
      const filePath = await AudioRecorder.stopRecording();

      if (Platform.OS === 'android') {
        this._finishRecording(true, filePath);
      }
      return filePath;
    } catch (error) {
      console.error(error);
    }
  }

  async _play(audioPath) {
    if (this.state.recording) {
      await this._stop();
    }

    if(this.state.playingAudio) {
      this.sound.stop()
      this.setState({playingAudio: false})
      return
    }
    // These timeouts are a hacky workaround for some issues with react-native-sound.
    // See https://github.com/zmxv/react-native-sound/issues/89.
    setTimeout(() => {
      const path = audioPath || this.props.audioPath || this.state.audioPath
      console.log('NowWillbePlayingPath: ' + path)
      if(this.sound) {
        this.sound.release()
      }
      this.sound = new Sound(path, '', (error) => {
        if (error) {
          console.log('failed to load the sound', error);
        }
      });

      setTimeout(() => {
        this.setState({playingAudio: true})
        try {
          this.sound.play((success) => {
            if (success) {
              console.log('successfully finished playing');
            } else {
              console.log('playback failed due to audio decoding errors');
            }
            this.setState({playingAudio: false})
          });
        } catch (e) {
          this.setState({playingAudio: false})
        }
      }, 100);
    }, 100);
  }

  // onStartPlay = async () => {
  //   if (this.state.recording) {
  //     await this._stop();
  //   }
  //
  //   const path = this.props.audioPath || this.state.audioPath
  //   console.log('playingFileRecordedAtPath: ' + this.state.audioPath)
  //   const msg = await this.audioRecorderPlayer.startPlayer(this.state.audioPath);
  //   this.audioRecorderPlayer.setVolume(1.0);
  //   console.log('playAudioMsg: ' + msg);
  //   this.audioRecorderPlayer.addPlayBackListener((e) => {
  //     if (e.current_position === e.duration) {
  //       this.audioRecorderPlayer.stopPlayer();
  //     }
  //     // this.setState({
  //     //   currentPositionSec: e.current_position,
  //     //   currentDurationSec: e.duration,
  //     //   playTime: this.audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
  //     //   duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
  //     // });
  //     return;
  //   });
  // }

  onPausePlay = async () => {
    await this.audioRecorderPlayer.pausePlayer();
  }

  onStopPlay = async () => {
    if(this.audioRecorderPlayer) {
      this.audioRecorderPlayer.stopPlayer();
      this.audioRecorderPlayer.removePlayBackListener();
      return
    }
    return
  }

  async _record() {
    if (this.state.recording) {
      console.warn('Already recording!');
      return;
    }

    if (!this.state.hasPermission) {
      console.warn('Can\'t record, no permission granted!');
      return;
    }

    if(this.state.stoppedRecording){
      this.prepareRecordingPath(this.state.audioPath);
    }

    this.setState({recording: true, paused: false});

    try {
      const filePath = await AudioRecorder.startRecording();
    } catch (error) {
      console.error(error);
    }
  }

  _finishRecording(didSucceed, filePath, fileSize, base64) {
    this.setState({ finished: didSucceed, base64});
    console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath} and size of ${fileSize || 0} bytes`);
  }

  onGoBack = async () => {
    try {
      if (this.state.recording) {
        await this._stop()
      }
      if (this.sound) {
        await this.sound.stop(() => 0)
      }
    } catch (e) {
      console.log('err: ' + e.message)
    } finally {
      this.props.onHideIosRecording()
    }


  }
  render() {
    const { recording, base64, audioPath, playingAudio } = this.state
    return (
      <View style={styles.container}>
        <View style={styles.controls}>
          {!this.props.audioPath ? this._renderButton("RECORD", () => {this._record()}, this.state.recording ) : null}
          {(this.props.audioPath || audioPath) ? this._renderButton((playingAudio ? "STOP" : "PLAY"), () => {this._play()} ) : null}
          {(recording) ? this._renderButton("STOP", () => {this._stop()} ) : null}
          {(!lodash.isEmpty(base64)) ? this._renderButton("DONE", () => {this.props.onSaveRecording(this.state.base64, true)} ) : null}
          {recording ? this._renderPauseButton(() => {this.state.paused ? this._resume() : this._pause()}) : null}
          {recording ? <Text style={styles.progressText}>{this.state.currentTime}s</Text> : null}
        </View>

        <TouchableOpacity style={styles.backContainer}
          onPress={this.onGoBack}
        >
          <Entypo name={Platform.OS === 'ios' ? 'chevron-left' : 'arrow-left'} size={25} color={'#fff'}/>
          <Text style={{color: '#fff', fontSize: 22}}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2b608a",
  },
  controls: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  backContainer: {
    position: 'absolute',
    flexDirection: 'row',
    left: 10,
    top: 10,
    padding: 15
  },
  progressText: {
    paddingTop: 50,
    fontSize: 50,
    color: "#fff"
  },
  button: {
    padding: 20
  },
  disabledButtonText: {
    color: '#eee'
  },
  buttonText: {
    fontSize: 20,
    color: "#fff"
  },
  activeButtonText: {
    fontSize: 20,
    color: "#B81F00"
  }

});

export default IosRecording;
