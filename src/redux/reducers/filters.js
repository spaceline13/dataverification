import {
    SET_ORIGINAL_SOURCES,
    SET_REMOTE_PRODUCTS,
    SET_SELECTED_ORIGINAL_SOURCES,
    SET_SELECTED_REMOTE_PRODUCTS
} from '../actionTypes';

const initialState = {
    remoteProducts: [],
    originalSources: [],
    selectedRemoteProducts: [],
    selectedOriginalSources: [],
};

const filters = (state = initialState, action) => {
    switch (action.type) {
        case SET_REMOTE_PRODUCTS: {
            const { remoteProducts } = action.payload;
            return {
                ...state,
                remoteProducts,
            };
        }
        case SET_ORIGINAL_SOURCES: {
            const { originalSources } = action.payload;
            return {
                ...state,
                originalSources,
            };
        }
        case SET_SELECTED_REMOTE_PRODUCTS: {
            const { selectedRemoteProducts } = action.payload;
            return {
                ...state,
                selectedRemoteProducts,
            };
        }
        case SET_SELECTED_ORIGINAL_SOURCES: {
            const { selectedOriginalSources } = action.payload;
            return {
                ...state,
                selectedOriginalSources,
            };
        }
        default:
            return state;
    }
};

export default filters;
