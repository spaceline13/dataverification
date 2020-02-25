import {
    LOAD_CURATION, SET_LOADING_CURATION, SET_NAME,
    SET_ORIGINAL_SOURCES,
    SET_REMOTE_PRODUCTS, SET_SELECTED_DATE_RANGE,
    SET_SELECTED_ORIGINAL_SOURCES,
    SET_SELECTED_REMOTE_PRODUCTS, SET_SELECTED_SUPPLIER
} from '../actionTypes';


export const loadCuration = curationState => ({
    type: LOAD_CURATION,
    payload: {
        curationState,
    },
});

export const setLoadingCuration = loading => ({
    type: SET_LOADING_CURATION,
    payload: {
        loading,
    },
});

export const setName = name => ({
    type: SET_NAME,
    payload: {
        name,
    },
});

export const setRemoteProducts = remoteProducts => ({
    type: SET_REMOTE_PRODUCTS,
    payload: {
        remoteProducts,
    },
});

export const setOriginalSources = originalSources => ({
    type: SET_ORIGINAL_SOURCES,
    payload: {
        originalSources,
    },
});

export const setSelectedRemoteProducts = selectedRemoteProducts => ({
    type: SET_SELECTED_REMOTE_PRODUCTS,
    payload: {
        selectedRemoteProducts,
    },
});

export const setSelectedOriginalSources = selectedOriginalSources => ({
    type: SET_SELECTED_ORIGINAL_SOURCES,
    payload: {
        selectedOriginalSources,
    },
});

export const setSelectedSupplier = selectedSupplier => ({
    type: SET_SELECTED_SUPPLIER,
    payload: {
        selectedSupplier,
    },
});

export const setSelectedDateRange = selectedDateRange => ({
    type: SET_SELECTED_DATE_RANGE,
    payload: {
        selectedDateRange,
    },
});
