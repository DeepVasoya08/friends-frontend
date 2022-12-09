import { createAction, props } from '@ngrx/store';

export const user = createAction('User', props<{ u: any }>());
export const post = createAction('Post', props<{ p: any }>());
export const story = createAction('Story', props<{ s: any }>());
export const isLoading = createAction('isLoading');
export const isLoggedIn = createAction('isLoggedIn');
