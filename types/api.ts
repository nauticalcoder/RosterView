import {AxiosResponse} from '@truefit/http-utils';

export type ApiError = {
  response: AxiosResponse<ApiErrorResponseData | string>;
};

export type ApiErrorResponseData = {
  errors: ApiResponseErrors;
};

export type ApiResponseErrors = {
  [field: string]: Array<string>;
};
