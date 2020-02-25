const getMainState = store => store.main;
const getMainStateObject = object => store => (getMainState(store) ? getMainState(store)[object] : null);
const getCommunity = store => (getMainState(store) ? getMainState(store).community : null);
const getIncidents = store => (getMainState(store) ? getMainState(store).incidents : null);
const getProducts = store => (getMainState(store) ? getMainState(store).products : null);
const getHazards = store => (getMainState(store) ? getMainState(store).hazards : null);
const getTitles = store => (getMainState(store) ? getMainState(store).titles : null);
const getCountries = store => (getMainState(store) ? getMainState(store).countries : null);
const getSuppliers = store => (getMainState(store) ? getMainState(store).suppliers : null);
const getDescriptions = store => (getMainState(store) ? getMainState(store).descriptions : null);
const getIncidentsCount = store => (getMainState(store) ? getMainState(store).incidentsCount : []);
const getFetchingIncidents = store => (getMainState(store) ? getMainState(store).fetchingIncidents : false);
const getIncidentsPagesLoaded = store => (getMainState(store) ? getMainState(store).incidentsPagesLoaded : []);

export { getMainState, getCommunity, getCountries, getSuppliers, getTitles, getProducts, getDescriptions, getIncidents, getHazards, getMainStateObject, getIncidentsCount, getFetchingIncidents, getIncidentsPagesLoaded };
