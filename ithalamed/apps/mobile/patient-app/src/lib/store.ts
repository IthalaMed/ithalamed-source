import { createStore, RootState } from '@ithalamed/mobile-core';

export const store = createStore();

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;

export type { RootState };
