import {
  Action,
  AnyAction,
  applyMiddleware,
  combineReducers,
  legacy_createStore as createStore,
} from "redux";
import thunk, { ThunkAction } from "redux-thunk";
import { adminReducer, userReducer, commonReducer } from "services/app/appReducer";
import { ThunkActionDispatch } from "redux-thunk/src/types";
import { AxiosResponse } from "axios";
import { setError, setLoading } from "../services/app/actions/commonActions";
import keycloak from "../Keycloak";

const rootReducer = combineReducers({
  admin: adminReducer,
  user: userReducer,
  common: commonReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

export type AppRootStateType = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch | ThunkActionDispatch<ThunkActionCreator<any>>;

export type ThunkActionCreator<T> = (payload: T) => ThunkAction<Promise<any>, AppRootStateType, null, AnyAction>;

export function thunkActionCreator<T, R>(restMethod: (payload: T) => Promise<AxiosResponse<R>>, action?: (data: R) => Action): ThunkActionCreator<T> {
  return (payload: T) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
      await keycloak.updateToken(5);

      const { data } = await restMethod(payload);
      action && dispatch(action(data));

      return data;
    } catch (error) {
      if(error.response?.status === 409 || error.response?.status === 501) {
        throw error;
      }
      if(error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Доступ отсутствует');
      }
      dispatch(setError(error.response?.data?.message || error.message));
      throw new Error(error.response.data?.message || error.message);
    }
    finally {
      dispatch(setLoading(false));
    }
  }
}
