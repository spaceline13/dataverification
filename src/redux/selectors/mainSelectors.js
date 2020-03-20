export const getMainState = store => store.main;
export const getMainStateObject = object => store => (getMainState(store) ? getMainState(store)[object] : null);
export const getCommunity = store => (getMainState(store) ? getMainState(store).community : null);
export const getIncidents = store => (getMainState(store) ? getMainState(store).incidents : null);
export const getProducts = store => (getMainState(store) ? getMainState(store).products : null);
export const getHazards = store => (getMainState(store) ? getMainState(store).hazards : null);
export const getTitles = store => (getMainState(store) ? getMainState(store).titles : null);
export const getCountries = store => (getMainState(store) ? getMainState(store).countries : null);
export const getSuppliers = store => (getMainState(store) ? getMainState(store).suppliers : null);
export const getDescriptions = store => (getMainState(store) ? getMainState(store).descriptions : null);
export const getIncidentsCount = store => (getMainState(store) ? getMainState(store).incidentsCount : []);
export const getFetchingIncidents = store => (getMainState(store) ? getMainState(store).fetchingIncidents : false);
export const getIncidentsPagesLoaded = store => (getMainState(store) ? getMainState(store).incidentsPagesLoaded : []);

// TAXONOMIES

export const getProductsTaxonomy = store => (getMainState(store) ? getMainState(store).productsTaxonomy.map(item => item.name) : []);
export const getHazardsTaxonomy = store => (getMainState(store) ? getMainState(store).hazardsTaxonomy.map(item => item.name) : []);
export const getCountriesTaxonomy = store => (getMainState(store) ? getMainState(store).countriesTaxonomy : []);
