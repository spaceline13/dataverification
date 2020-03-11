import {
    LOAD_CURATION, SET_LOADING_CURATION, SET_NAME, SET_ONE_HAZARD,
    SET_ORIGINAL_SOURCES, SET_POSSIBLY_OK, SET_REMOTE_HAZARDS,
    SET_REMOTE_PRODUCTS, SET_SELECTED_DATE_RANGE,
    SET_SELECTED_ORIGINAL_SOURCES, SET_SELECTED_REMOTE_HAZARDS,
    SET_SELECTED_REMOTE_PRODUCTS, SET_SELECTED_SUPPLIER
} from '../actionTypes';

const initialState = {
    name: '',
    loading: false,
    remoteProducts: [],
    remoteHazards: [],
    originalSources: [],
    selectedSupplier: null,
    selectedDateRange: { from: null, to: null },
    selectedRemoteProducts: [],
    selectedRemoteHazards: [],
    selectedOriginalSources: [],
    possiblyOk: false,
    oneHazard: false,
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
        case SET_REMOTE_HAZARDS: {
            const { remoteHazards } = action.payload;
            return {
                ...state,
                remoteHazards,
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
        case SET_SELECTED_REMOTE_HAZARDS: {
            const { selectedRemoteHazards } = action.payload;
            return {
                ...state,
                selectedRemoteHazards,
            };
        }
        case SET_SELECTED_ORIGINAL_SOURCES: {
            const { selectedOriginalSources } = action.payload;
            return {
                ...state,
                selectedOriginalSources,
            };
        }
        case SET_POSSIBLY_OK: {
            const { possiblyOk } = action.payload;
            return {
                ...state,
                possiblyOk,
            };
        }
        case SET_ONE_HAZARD: {
            const { oneHazard } = action.payload;
            return {
                ...state,
                oneHazard,
            };
        }
        default:
            return state;
    }
};

export default filters;
