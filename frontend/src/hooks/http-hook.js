import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { loadingActions } from '../store';

export const useHttpHook = () => {
  const dispatch = useDispatch();

  const sendRequest = async (url, method = 'GET', bodyData = null) => {
    dispatch(loadingActions.setIsLoading(true));
    try {
      const response = await fetch(url, {
        method,
        body: bodyData,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      // console.log(response);
      if (response.status === 204) {
        dispatch(loadingActions.setIsLoading(false));
        return response;
      }
      const responseData = await response.json();
      // console.log(responseData);
      if (!response.ok) {
        toast.error(responseData.message || 'Something went wrong!', {
          position: 'top-center',
        });
        dispatch(loadingActions.setIsLoading(false));
        return response;
      } else {
        toast.success(responseData.message, {
          position: 'top-center',
        });
      }
      dispatch(loadingActions.setIsLoading(false));
      return responseData;
    } catch (error) {
      console.log(error);
      dispatch(loadingActions.setIsLoading(false));
    }
  };

  return {
    sendRequest,
  };
};
