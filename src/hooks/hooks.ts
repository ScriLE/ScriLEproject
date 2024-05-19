import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'
import type {AppRootStateType as RootState, AppDispatch} from '../store/redux-store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector