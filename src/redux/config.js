import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import rootReducer from './reducers';

export default function configureStore (preloadedState) {
    const composedStore = composeWithDevTools();
    const store = createStore(rootReducer, preloadedState, composedStore);
    return store;
}
