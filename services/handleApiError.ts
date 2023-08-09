import {join, flatMap} from 'lodash';
import {Alert, Platform} from 'react-native';
import Toast from 'react-native-simple-toast';
import {ApiError, ApiResponseErrors} from '../types';

export default (error: ApiError): ApiResponseErrors | string | undefined => {
  const status = error?.response?.status;
  const data = error?.response?.data;

  let response: ApiResponseErrors | string | undefined;
  let toastMessage;

  if (typeof data === 'string') {
    toastMessage = data;
    response = data;
  } else if (data?.errors) {
    const flattenErrors = flatMap(Object.values(data.errors));
    toastMessage = join(flattenErrors, '. ');
    response = data.errors;
  } else {
    toastMessage = `A server error has occurred`;
  }

  console.error(toastMessage);

  switch (status) {
    case 401:
      Toast.showWithGravity('Invalid Authorization', Toast.SHORT, Toast.BOTTOM, [
        'RCTModalHostViewController',
      ]);
      break;
    case 400:
      if (Platform.OS === 'android') {
        Alert.alert(toastMessage);
      } else {
        Toast.showWithGravity(toastMessage, Toast.SHORT, Toast.BOTTOM);
      }
      break;
    default:
      Toast.showWithGravity(toastMessage, Toast.SHORT, Toast.BOTTOM);
  }

  return response;
};
