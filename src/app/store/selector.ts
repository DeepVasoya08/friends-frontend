import { createSelector } from '@ngrx/store';
import { State } from './state';

export const selectStore = (state: State) => state.store_state;

export const userSelector = createSelector(selectStore, (state) => {
  return state.user;
});

export const postSelector = createSelector(selectStore, (state) => {
  return state.post;
});

export const storySelector = createSelector(selectStore, (state) => {
  return state.story;
});

export const loginSelector = createSelector(selectStore, (state) => {
  return state.isLoggedIn;
});

export const loadingSelector = createSelector(selectStore, (state) => {
  return state.isLoading;
});
