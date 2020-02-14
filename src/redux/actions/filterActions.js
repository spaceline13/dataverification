import {
    SET_ORIGINAL_SOURCES,
    SET_REMOTE_PRODUCTS,
    SET_SELECTED_ORIGINAL_SOURCES,
    SET_SELECTED_REMOTE_PRODUCTS
} from '../actionTypes';

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
