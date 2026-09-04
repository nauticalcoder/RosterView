import { join, flatMap } from 'lodash';
import toast from './toast';
import { ApiError, ApiResponseErrors } from '../types';

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
      toast('Invalid Authorization');
      break;
    default:
      toast(toastMessage);
  }

  return response;
};
