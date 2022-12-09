import { createReducer, on } from '@ngrx/store';
import { StoreModel } from './model';
import * as AllActions from './actions';

const getCookie = localStorage.getItem('auth');

const initialState: StoreModel = {
  user: getCookie ? JSON.parse(getCookie) : '',
  post: [],
  story: [],
  isLoading: false,
  isLoggedIn: getCookie ? true : false,
};

export const Reducer = createReducer(
  initialState,
  on(AllActions.user, (state, { u }) => ({
    ...state,
    user: u,
  })),
  on(AllActions.post, (state, { p }) => ({
    ...state,
    post: [p],
  })),
  on(AllActions.story, (state, { s }) => ({
    ...state,
    story: [s],
  })),
  on(AllActions.isLoading, (state) => ({
    ...state,
    isLoading: !state.isLoading,
  })),

  on(AllActions.isLoggedIn, (state) => ({
    ...state,
    isLoggedIn: !state.isLoggedIn,
  }))
);
