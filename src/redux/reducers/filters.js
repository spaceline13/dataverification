import {
    LOAD_CURATION, SET_LOADING_CURATION, SET_NAME,
    SET_ORIGINAL_SOURCES,
    SET_REMOTE_PRODUCTS, SET_SELECTED_DATE_RANGE,
    SET_SELECTED_ORIGINAL_SOURCES,
    SET_SELECTED_REMOTE_PRODUCTS, SET_SELECTED_SUPPLIER
} from '../actionTypes';

const initialState = {
    name: '',
    loading: false,
    remoteProducts: [],
    originalSources: [],
    selectedSupplier: null,
    selectedDateRange: { from: null, to: null },
    selectedRemoteProducts: [],
    selectedOriginalSources: [],
};

const filters = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_CURATION: {
            const { curationState } = action.payload;
            return curationState;
        }
        case SET_LOADING_CURATION: {
            const { loading } = action.payload;
            return {
                ...state,
                loading,
            };
        }
        case SET_NAME: {
            const { name } = action.payload;
            return {
                ...state,
                name,
            };
        }
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
        case SET_SELECTED_SUPPLIER: {
            const { selectedSupplier } = action.payload;
            return {
                ...state,
                selectedSupplier,
            };
        }
        case SET_SELECTED_DATE_RANGE: {
            const { selectedDateRange } = action.payload;
            return {
                ...state,
                selectedDateRange,
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
