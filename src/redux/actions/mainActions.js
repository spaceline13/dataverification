import {
    ADD_HAZARDS,
    ADD_INCIDENTS,
    ADD_INCIDENTS_PAGES_LOADED,
    ADD_PRODUCTS, LOAD_CURATION,
    REMOVE_HAZARDS,
    REMOVE_PRODUCTS,
    SET_COMMUNITY, SET_DESCRIPTIONS,
    SET_FETCHING_INCIDENTS,
    SET_HAZARDS,
    SET_INCIDENTS,
    SET_INCIDENTS_COUNT, SET_NAME,
    SET_PRODUCTS, SET_TITLES,
} from '../actionTypes';

const loadCuration = curationState => ({
    type: LOAD_CURATION,
    payload: {
        curationState,
    },
});

const setName = name => ({
    type: SET_NAME,
    payload: {
        name,
    },
});

const setCommunity = community => ({
    type: SET_COMMUNITY,
    payload: {
        community,
    },
});

const setIncidents = incidents => ({
    type: SET_INCIDENTS,
    payload: {
        incidents,
    },
});

const setProducts = (product, incident_id) => ({
    type: SET_PRODUCTS,
    payload: {
        product,
        incident_id,
    },
});
const setHazards = (hazard, incident_id) => ({
    type: SET_HAZARDS,
    payload: {
        hazard,
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

const addIncidentsPagesLoaded = incidentsPagesLoaded => ({
    type: ADD_INCIDENTS_PAGES_LOADED,
    payload: {
        incidentsPagesLoaded,
    },
});

const addProducts = (product, incident_id) => ({
    type: ADD_PRODUCTS,
    payload: {
        product,
        incident_id,
    },
});
const addHazards = (hazard, incident_id) => ({
    type: ADD_HAZARDS,
    payload: {
        hazard,
        incident_id,
    },
});
const removeProducts = (product, incident_id) => ({
    type: REMOVE_PRODUCTS,
    payload: {
        product,
        incident_id,
    },
});
const removeHazards = (hazard, incident_id) => ({
    type: REMOVE_HAZARDS,
    payload: {
        hazard,
        incident_id,
    },
});

export {
    loadCuration,
    setName,
    addIncidents,
    addIncidentsPagesLoaded,
    setFetchingIncidents,
    setIncidentsCount,
    setCommunity,
    setIncidents,
    setTitles,
    setDescriptions,
    setProducts,
    setHazards,
    addProducts,
    addHazards,
    removeProducts,
    removeHazards,
};
