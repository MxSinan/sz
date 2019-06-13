import Snackbar from 'react-native-snackbar'
import Colors from "../Themes/Colors";
import * as moment from 'moment'
import RNFS from 'react-native-fs'
import {AsyncStorage} from 'react-native';

export const showMessage = (message: string) => {
  Snackbar.show({
    title: message,
    duration: Snackbar.LENGTH_LONG,
    action: {
      title: 'OK',
      color: Colors.snow,
      onPress: () => {
      }
    }
  })
}

export const formatDate = (date, isUnix = false, formatkey = 'DD/MM/YYYY, hh:mm a') => {

  if (isUnix) {
    return moment.unix(date).utc().format(formatkey)
  }

  return moment(date).format(formatkey)
}


export const getFileUri = async (base64Content, id, ext, path) => {
  path = path || `file://${RNFS.DocumentDirectoryPath}/${id}.${ext}`
  try {
    await RNFS.writeFile(path, base64Content, 'base64')
    console.log('writtenOnPath: ' + path)
    return path;
  } catch (err) {
    showMessage("Error in playing audio")
    return null
  }
}

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
  }
};

export const getRndInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getAsyncData = async (key) => {
  return AsyncStorage.getItem(key)
}

export const retrieveData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value
    }
  } catch (error) {
  }
  const data = `user${getRndInteger(0, 560000)}@kiws.nl`
  storeData("userid", data)
  return data
};

export const getString = (text) => text
