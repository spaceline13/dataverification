import {
    ADD_HAZARD,
    ADD_INCIDENTS,
    ADD_INCIDENTS_PAGES_LOADED,
    ADD_PRODUCT,
    REMOVE_HAZARD,
    REMOVE_PRODUCT, SET_APPROVED,
    SET_COMMUNITY, SET_COUNTRIES_TAXOOMY, SET_DESCRIPTIONS,
    SET_FETCHING_INCIDENTS,
    REPLACE_HAZARDS, SET_HAZARDS_TAXONOMY,
    SET_INCIDENTS,
    SET_INCIDENTS_COUNT,
    REPLACE_PRODUCTS, SET_PRODUCTS_TAXONOMY, SET_TITLES, EDIT_PRODUCT, EDIT_HAZARD, IMPORT_SAVED_INCIDENTS,
} from '../actionTypes';

const setCommunity = community => ({
    type: SET_COMMUNITY,
    payload: {
        community,
    },
});

const setIncidents = (incidents, savedIncidents) => ({
    type: SET_INCIDENTS,
    payload: {
        incidents,
        savedIncidents,
    },
});

const replaceProducts = (productsArray, incident_id) => ({
    type: REPLACE_PRODUCTS,
    payload: {
        productsArray,
        incident_id,
    },
});
const replaceHazards = (hazardsArray, incident_id) => ({
    type: REPLACE_HAZARDS,
    payload: {
        hazardsArray,
        incident_id,
    },
});

const addIncidents = incidents => ({
    type: ADD_INCIDENTS,
    payload: {
        incidents,
    },
});

const setIncidentsCount = incidentsCount => ({
    type: SET_INCIDENTS_COUNT,
    payload: {
        incidentsCount,
    },
});

const setFetchingIncidents = fetchingIncidents => ({
    type: SET_FETCHING_INCIDENTS,
    payload: {
        fetchingIncidents,
    },
});

const setTitles = (incident_id, originalSliceOfText, formattedSliceOfText) => ({
    type: SET_TITLES,
    payload: {
        incident_id,
        originalSliceOfText,
        formattedSliceOfText,
    },
});

const setDescriptions = (incident_id, originalSliceOfText, formattedSliceOfText) => ({
    type: SET_DESCRIPTIONS,
    payload: {
        incident_id,
        originalSliceOfText,
        formattedSliceOfText,
    },
});

const setApproved = (incident_id, user) => ({
    type: SET_APPROVED,
    payload: {
        incident_id,
        user,
    },
});

const addIncidentsPagesLoaded = incidentsPagesLoaded => ({
    type: ADD_INCIDENTS_PAGES_LOADED,
    payload: {
        incidentsPagesLoaded,
    },
});

const addProduct = (product, incident_id) => ({
    type: ADD_PRODUCT,
    payload: {
        product,
        incident_id,
    },
});
const editProduct = (index, product, incident_id) => ({
    type: EDIT_PRODUCT,
    payload: {
        index,
        product,
        incident_id,
    },
});
const addHazard = (hazard, incident_id) => ({
    type: ADD_HAZARD,
    payload: {
        hazard,
        incident_id,
    },
});
const editHazard = (index, hazard, incident_id) => ({
    type: EDIT_HAZARD,
    payload: {
        index,
        hazard,
        incident_id,
    },
});
const removeProduct = (product, incident_id) => ({
    type: REMOVE_PRODUCT,
    payload: {
        product,
        incident_id,
    },
});
const removeHazard = (hazard, incident_id) => ({
    type: REMOVE_HAZARD,
    payload: {
        hazard,
        incident_id,
    },
});

export const setProductsTaxonomy = products => ({
    type: SET_PRODUCTS_TAXONOMY,
    payload: {
        products,
    },
});

export const setHazardsTaxonomy = hazards => ({
    type: SET_HAZARDS_TAXONOMY,
    payload: {
        hazards,
    },
});

export const setCountriesTaxonomy = countries => ({
    type: SET_COUNTRIES_TAXOOMY,
    payload: {
        countries,
    },
});

export {
    addIncidents,
    addIncidentsPagesLoaded,
    setFetchingIncidents,
    setIncidentsCount,
    setCommunity,
    setIncidents,
    setTitles,
    setDescriptions,
    replaceProducts,
    replaceHazards,
    setApproved,
    addProduct,
    editProduct,
    addHazard,
    editHazard,
    removeProduct,
    removeHazard,
};
