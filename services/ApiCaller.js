import * as _ from 'lodash'
import {showMessage} from '../utils'
import {stringify} from 'query-string';

export const API_BASE_URL = 'http://suzie.kiws.nl/'

export const defaultHeaders = {
  'Content-Type': 'application/json',
  'x-authorization': ''

}

export const setAuthorizationHeader = (token) => {
  defaultHeaders['x-authorization'] = `Bearer ${token}`
}
export const callApi = (url = ``, {method = 'POST', headers = {}, postParams = {}, data = {}, text = false}, showError = true, isRedirect = true) => (
  new Promise((resolve, reject) => {
    const params = method === 'POST' || method === 'PUT' ? {
      body: JSON.stringify(data),
      params: postParams
    } : {params: JSON.stringify(data)}
    fetch(`${API_BASE_URL}${url}`, {
      method,
      headers: {
        ...defaultHeaders,
        ...headers
      },
      ...params
    })
      .then(response => {
        const {status, res: resData, ok = false, problem = 'TIMEOUT_ERROR', _bodyInit = '', _bodyText = ''} = response || {}
        if (ok && status && status >= 200 && status <= 300) {
          if (_.isEmpty(_bodyInit) && _.isEmpty(_bodyText)) {
            return resolve({})
          }
          resolve(text ? response.text() : response.json())
        } else {
          let message = ''
          if (resData) {
            if (typeof resData.error === 'object' && resData.error.message) {
              message = resData.error.message
            } else if (resData.message) {
              message = resData.message
            } else if (resData.msg) {
              message = resData.msg
            } else if (_.isString(resData)) {
              message = resData
            } else {
              message = getMessage(resData)
            }
          } else if (response._bodyText && _.isString(response._bodyText)) {
            message = response._bodyText
          } else {
            message = getMessage(resData)
          }
          if (showError) {
            showMessage(message)
          }
          if (status === 401 && isRedirect) {
          }

          return Promise.reject(message)
        }
      })
      .catch(err => reject(err))
  }))

export const getRecordings = (data) => new Promise((resolve, reject) => {
  callApi(`${endpoints.GET_RECORDINGS}?${stringify(data)}`, {method: 'GET'})
    .then((res) => resolve(res))
    .catch(({message}) => {
      return reject(message)
    })
})

export const getSpecificRecording = (data) => new Promise((resolve, reject) => {
  callApi(`${endpoints.GET_SPECIFIC_RECORDING}?${stringify(data)}`, {method: 'GET'})
    .then((res) => resolve(res))
    .catch(({message}) => {
      return reject(message)
    })
})

export const saveRecording = (data) => new Promise((resolve, reject) => {
  callApi(endpoints.SAVE_RECORDING, {method: 'POST', data})
    .then((res) => resolve(res))
    .catch(({message}) => {
      showMessage(message)
      return reject(message)
    })
})


export const getMessage = (error) => {
  if (error === 'TIMEOUT_ERROR') {
    return 'No Response From Server.'
  } else if (error === 'CONNECTION_ERROR') {
    return 'Server Is Not Available.'
  } else if (error === 'NETWORK_ERROR') {
    return 'Network not available.'
  } else {
    return 'Something went wrong. Please try again'
  }
}

export const endpoints = {
  SAVE_RECORDING: 'rest/api/v1/audio/submit',
  GET_RECORDINGS: 'rest/api/v1/audio/recordings',
  GET_SPECIFIC_RECORDING: 'rest/api/v1/audio/recording',
}
