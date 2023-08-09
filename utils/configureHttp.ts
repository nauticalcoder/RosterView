import {
    configureHttp as configure,
    // AxiosInstance,
    // AxiosResponse,
    // AxiosError,
  } from '@truefit/http-utils';

  const configureHttp = (apiBaseUrl: string): void => {
    configure({
      baseConfig: {
        baseURL: apiBaseUrl,
      },
      
      // transformHeaders: headers => {
      //   // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      //   return {
      //     ...headers,
      //   //   Authorization: `Bearer ${authTokens?.accessToken ?? ''}`,
      //     Expires: '-1',
      //     Pragma: 'no-cache',
      //     'Cache-Control': 'no-cache',
      //   };
      // },
    //   configureInstance: instance => {
    //     instance.interceptors.response.use(undefined, async (err: AxiosError | undefined) => {
    //       if (err?.isAxiosError && err.response?.status === 401) {
    //         const originalRequest = err.config ?? err.response?.config;
  
    //         if (authTokens && originalRequest.url && originalRequest.url !== REFRESH_TOKEN_URL) {
    //           if (await refreshAccessToken(instance)) {
    //             originalRequest.headers = {
    //               ...originalRequest.headers,
    //               Authorization: `Bearer ${authTokens.accessToken}`,
    //             } as unknown;
  
    //             return instance.request(originalRequest);
    //           }
    //         }
  
    //         DeviceEventEmitter.emit(HTTP_IS_UNAUTHORIZED_EVENT);
    //       }
  
    //       return Promise.reject(err);
    //     });
    //   },
    });
  };
  
  export {
    configureHttp,
    // configureTokens,
    // refreshAccessToken,
    // getTokens,
    // HTTP_TOKENS_CHANGED_EVENT,
    // HTTP_IS_UNAUTHORIZED_EVENT,
  };
  