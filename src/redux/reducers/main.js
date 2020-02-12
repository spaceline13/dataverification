import {
    ADD_HAZARDS,
    ADD_INCIDENTS,
    ADD_INCIDENTS_PAGES_LOADED, ADD_PRODUCTS, REMOVE_HAZARDS, REMOVE_PRODUCTS,
    SET_COMMUNITY, SET_DESCRIPTIONS, SET_FETCHING_INCIDENTS, SET_HAZARDS,
    SET_INCIDENTS,
    SET_INCIDENTS_COUNT,
    SET_PRODUCTS, SET_TITLES
} from '../actionTypes';

const initialState = {
    community: null,
    incidents: [],
    products: [],
    hazards: [],
    titles: [],
    descriptions: [],

    fetchingIncidents: true,
    incidentsCount: 0,
    incidentsPagesLoaded: [],
};

const main = (state = initialState, action) => {
    switch (action.type) {
        case SET_COMMUNITY: {
            const { community } = action.payload;
            return {
                ...state,
                community,
            };
        }
        case SET_INCIDENTS: {
            const incidentsToSet = action.payload.incidents;
            const incidents = [];
            const products = {};
            const hazards = {};
            const titles = {};
            const descriptions = {};

            incidentsToSet.forEach(incident => {
                incidents.push({ id: incident.id });
                products[incident.id] = incident.products.map(product => ({ original: product, foodakai: null }));
                hazards[incident.id] = incident.hazards.map(hazard => ({ original: hazard, foodakai: null }));
                titles[incident.id] = incident.title;
                descriptions[incident.id] = incident.description;
            });

            return {
                ...state,
                incidents,
                products,
                hazards,
                titles,
                descriptions,
            };
        }
        case SET_DESCRIPTIONS: {
            const { incident_id, originalSliceOfText, formattedSliceOfText } = action.payload;

            const newDescription = state.descriptions[incident_id].replace(originalSliceOfText, formattedSliceOfText);
            const descriptions = { ...state.descriptions, [incident_id]: newDescription };

            return {
                ...state,
                descriptions,
            };
        }
        case SET_TITLES: {
            const { incident_id, originalSliceOfText, formattedSliceOfText } = action.payload;

            const newTitle = state.titles[incident_id].replace(originalSliceOfText, formattedSliceOfText);
            const titles = { ...state.titles, [incident_id]: newTitle };

            return {
                ...state,
                titles,
            };
        }
        case SET_PRODUCTS: {
            const { product, incident_id } = action.payload;
            const products = { ...state.products, [incident_id]: product };
            return {
                ...state,
                products,
            };
        }
        case SET_HAZARDS: {
            const { hazard, incident_id } = action.payload;
            const hazards = { ...state.products, [incident_id]: hazard };
            return {
                ...state,
                hazards,
            };
        }
        case SET_FETCHING_INCIDENTS: {
            const { fetchingIncidents } = action.payload;
            return {
                ...state,
                fetchingIncidents,
            };
        }
        case SET_INCIDENTS_COUNT: {
            const { incidentsCount } = action.payload;
            return {
                ...state,
                incidentsCount,
            };
        }

        case ADD_INCIDENTS: {
            const incidentsToAdd = action.payload.incidents;
            const incidents = [...state.incidents];
            const products = { ...state.products };
            const hazards = { ...state.hazards };
            incidentsToAdd.forEach(incident => {
                incidents.push({ id: incident.id, title: incident.title, description: incident.description });
                products[incident.id] = incident.products.map(product => ({ original: product, foodakai: null }));
                hazards[incident.id] = incident.hazards.map(hazard => ({ original: hazard, foodakai: null }));
            });
            return {
                ...state,
                incidents,
                products,
                hazards,
            };
        }
        case ADD_PRODUCTS: {
            const { product, incident_id } = action.payload;
            // already exists, don't add more
            if (!state.products[incident_id].find(pr => pr.original === product.original)) {
                const products = { ...state.products, [incident_id]: [...state.products[incident_id], product] };
                return {
                    ...state,
                    products,
                };
            } else {
                return state;
            }
        }
        case ADD_HAZARDS: {
            const { hazard, incident_id } = action.payload;
            // already exists, don't add more
            if (!state.hazards[incident_id].find(hz => hz.original === hazard.original)) {
                const hazards = { ...state.hazards, [incident_id]: [...state.hazards[incident_id], hazard] };
                return {
                    ...state,
                    hazards,
                };
            } else {
                return state;
            }
        }
        case ADD_INCIDENTS_PAGES_LOADED: {
            const { incidentsPagesLoaded } = action.payload;
            return {
                ...state,
                incidentsPagesLoaded: [...state.incidentsPagesLoaded, incidentsPagesLoaded]
            };
        }
        case REMOVE_PRODUCTS: {
            const { incident_id, product } = action.payload;
            // find product in incident's products and remove it from incident's products list
            const listOfSpecficIncidentProducts = state.products[incident_id].filter(pr => !(pr.original === product.original && pr.foodakai === product.foodakai));
            // create new array of products to replace the old one
            const products = { ...state.products, [incident_id]: listOfSpecficIncidentProducts };

            const tagged = '<product>' + product.original + '</product>';

            // check description for tagged text
            let descriptions = null;
            if (state.descriptions[incident_id] && state.descriptions[incident_id].indexOf(tagged) !== -1) {
                // find the description of the incident and replace the tags with the untagged text
                const description = state.descriptions[incident_id].replace(tagged, product.original);
                // create new array of descriptions to replace old one
                descriptions = { ...state.descriptions, [incident_id]: description };
            }

            //check title for tagged text
            let titles = null;
            if (state.titles[incident_id] && state.titles[incident_id].indexOf(tagged) !== -1) {
                // find the title of the incident and replace the tags with the untagged text
                const title = state.titles[incident_id].replace(tagged, product.original);
                // create new array of titles to replace old one
                titles = { ...state.titles, [incident_id]: title };
            }

            // return new object with the regarded changes
            const res = { ...state, products };
            if (descriptions) res.descriptions = descriptions;
            else if (titles) res.titles = titles;

            return res;
        }
        case REMOVE_HAZARDS: {
            const { incident_id, hazard } = action.payload;
            // find product in incident's hazards and remove it from incident's hazards list
            const listOfSpecficIncidentHazards = state.hazards[incident_id].filter(hz => !(hz.original === hazard.original && hz.foodakai === hazard.foodakai));
            // create new array of hazards to replace the old one
            const hazards = { ...state.hazards, [incident_id]: listOfSpecficIncidentHazards };

            const tagged = '<hazard>' + hazard.original + '</hazard>';

            // check description for tagged text
            let descriptions = null;
            if (state.descriptions[incident_id] && state.descriptions[incident_id].indexOf(tagged) !== -1) {
                // find the description of the incident and replace the tags with the untagged text
                const description = state.descriptions[incident_id].replace(tagged, hazard.original);
                // create new array of descriptions to replace old one
                descriptions = { ...state.descriptions, [incident_id]: description };
            }

            //check title for tagged text
            let titles = null;
            if (state.titles[incident_id] && state.titles[incident_id].indexOf(tagged) !== -1) {
                // find the title of the incident and replace the tags with the untagged text
                const title = state.titles[incident_id].replace(tagged, hazard.original);
                // create new array of titles to replace old one
                titles = { ...state.titles, [incident_id]: title };
            }

            // return new object with the regarded changes
            const res = { ...state, hazards };
            if (descriptions) res.descriptions = descriptions;
            else if (titles) res.titles = titles;

            return res;
        }
        default:
            return state;
    }
};

export default main;
