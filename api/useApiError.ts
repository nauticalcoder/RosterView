// import {DeviceEventEmitter} from 'react-native';
import {join, flatMap} from 'lodash';
import {toast} from '../services';
import {ApiError, ApiResponseErrors} from '../types';

const useApiError = () => {
  return async (error: ApiError): Promise<ApiResponseErrors | string | undefined> => {
    const status = error?.response?.status;
    const data = error?.response?.data;

    let response: ApiResponseErrors | string | undefined;
    let toastMessage;

    console.log(data);
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

    switch (status) {
      case 401:
        // await keychain.resetGenericPassword();
        // DeviceEventEmitter.emit(HTTP_IS_UNAUTHORIZED_EVENT);
        toast('Invalid Authorization');
        break;
      default:
        toast(toastMessage);
    }

    return response;
  };
};

export default useApiError;
