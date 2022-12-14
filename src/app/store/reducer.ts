import { createReducer, on } from '@ngrx/store';
import { StoreModel, UserInterface } from './model';
import * as AllActions from './actions';
import { JwtHelperService } from '@auth0/angular-jwt';

const getCookie = localStorage.getItem('auth');
const helper = new JwtHelperService();
const data =
  getCookie !== null ? helper.decodeToken(JSON.parse(getCookie)) : '';

const initialData = {
  _id: '',
  fname: '',
  lname: '',
  coverPic: '',
  createdAt: '',
  coverPicId: '',
  email: '',
  friends: [],
  profilePic: '',
  profilePicId: '',
  updatedAt: '',
};

const initialState: StoreModel = {
  post: [],
  story: [],
  isLoading: false,
  isLoggedIn: getCookie ? true : false,
  user: initialData,
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
