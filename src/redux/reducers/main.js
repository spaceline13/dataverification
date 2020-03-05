import {
    ADD_HAZARD,
    ADD_INCIDENTS,
    ADD_INCIDENTS_PAGES_LOADED,
    ADD_PRODUCT,
    REMOVE_HAZARD,
    REMOVE_PRODUCT, SET_APPROVED,
    SET_COMMUNITY, SET_COUNTRIES_TAXOOMY,
    SET_DESCRIPTIONS,
    SET_FETCHING_INCIDENTS,
    REPLACE_HAZARDS, SET_HAZARDS_TAXONOMY,
    SET_INCIDENTS,
    SET_INCIDENTS_COUNT,
    REPLACE_PRODUCTS, SET_PRODUCTS_TAXONOMY,
    SET_TITLES, EDIT_PRODUCT, EDIT_HAZARD, EDIT_COUNTRY,
} from '../actionTypes';
import stringSimilarity  from 'string-similarity';

const initialState = {
    community: null,
    incidents: [],
    products: [],
    hazards: [],
    countries: [],
    suppliers: [],
    titles: [],
    descriptions: [],

    fetchingIncidents: true,
    incidentsCount: 0,
    incidentsPagesLoaded: [],

    productsTaxonomy: [],
    hazardsTaxonomy: [],
    countriesTaxonomy: []
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
            const previouslySavedIncidents = action.payload.savedIncidents;
            const incidents = [];
            const products = {};
            const hazards = {};
            const countries = {};
            const suppliers = {};
            const titles = {};
            const descriptions = {};

            incidentsToSet.forEach(incident => {
                incidents.push({ id: incident.dataId, date: incident.createdOn, internalId: incident.internalId, remoteProducts: incident.remoteProducts, remoteHazards: incident.remoteHazards });
                products[incident.dataId] = incident.machineProducts ? incident.machineProducts.map(product => ({ original: product.value, foodakai: state.productsTaxonomy.includes(product.value) ? product.value : null })) : [];
                hazards[incident.dataId] = incident.machineHazards ? incident.machineHazards.map(hazard => ({ original: hazard.value, foodakai: state.hazardsTaxonomy.includes(hazard.value) ? hazard.value : null })) : [];
                countries[incident.dataId] = incident.originInfo ? incident.originInfo.map(origin => origin.country.value ? origin.country.value : origin.country.country) : [];
                suppliers[incident.dataId] = incident.suppliers ? incident.suppliers.map(supplier => ({ title: supplier.title, id: supplier.id })) : [];
                titles[incident.dataId] = incident.title;
                descriptions[incident.dataId] = incident.description;
            });

            if (previouslySavedIncidents) {
                previouslySavedIncidents.forEach(incident => {
                    const stateIncident = incidents.find(sti => sti.id === incident.id);
                    stateIncident.approvedFrom = incident.user;
                    products[incident.id] = incident.products;
                    hazards[incident.id] = incident.hazards;
                    countries[incident.id] = incident.country;
                    suppliers[incident.id] = incident.supplier;
                    titles[incident.id] = incident.title;
                    descriptions[incident.id] = incident.description;
                });
            }

            return {
                ...state,
                incidents,
                products,
                hazards,
                countries,
                suppliers,
                titles,
                descriptions,
            };
        }
        case ADD_INCIDENTS: {
            const incidentsToAdd = action.payload.incidents;
            const incidents = [...state.incidents];
            const products = { ...state.products };
            const hazards = { ...state.hazards };
            const countries = { ...state.countries };
            const suppliers = { ...state.suppliers };
            const titles = { ...state.titles };
            const descriptions = { ...state.descriptions };
            incidentsToAdd.forEach(incident => {
                incidents.push({ id: incident.dataId, date: incident.createdOn, internalId: incident.internalId, remoteProducts: incident.remoteProducts, remoteHazards: incident.remoteHazards });
                products[incident.dataId] = incident.machineProducts ? incident.machineProducts.map(product => ({ original: product.value, foodakai: state.productsTaxonomy.includes(product.value) ? product.value : null })) : [];
                hazards[incident.dataId] = incident.machineHazards ? incident.machineHazards.map(hazard => ({ original: hazard.value, foodakai: state.hazardsTaxonomy.includes(hazard.value) ? hazard.value : null })) : [];
                countries[incident.dataId] = incident.originInfo ? incident.originInfo.map(origin => origin.country.value ? origin.country.value : origin.country.country) : [];
                suppliers[incident.dataId] = incident.suppliers ? incident.suppliers.map(supplier => ({ title: supplier.title, id: supplier.id })) : [];
                titles[incident.dataId] = incident.title;
                descriptions[incident.dataId] = incident.description;
            });
            return {
                ...state,
                incidents,
                products,
                hazards,
                countries,
                suppliers,
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
        case REPLACE_PRODUCTS: {
            const { productsArray, incident_id } = action.payload;

            // check incident's products array against Taxonomy and autofill
            productsArray.forEach(product => {
                if (!product.foodakai) {
                    const { bestMatch } = stringSimilarity.findBestMatch(product.original.toLowerCase(), state.productsTaxonomy);
                    if (bestMatch.rating > 0.8) product.foodakai = bestMatch.target;
                    console.log(bestMatch);
                }
            });

            // remove tags
            const regex = `(<product>(?!${productsArray[0].original})|(?<!${productsArray[0].original})<\\/product>)`;
            const title = state.titles[incident_id] ? state.titles[incident_id].replace(new RegExp(regex, 'g'), '') : null;
            const titles = { ...state.titles, [incident_id]: title };
            const description = state.descriptions[incident_id] ? state.descriptions[incident_id].replace(new RegExp(regex, 'g'), '') : null;
            const descriptions = { ...state.descriptions, [incident_id]: description };

            // new products
            const products = { ...state.products, [incident_id]: productsArray };

            return {
                ...state,
                products,
                titles,
                descriptions
            };
        }
        case ADD_PRODUCT: {
            const { product, incident_id } = action.payload;
            // already exists, don't add more
            if (!state.products[incident_id].find(pr => pr.original === product.original)) {
                // check incident's product against Taxonomy and autofill
                if (!product.foodakai) {
                    const { bestMatch } = stringSimilarity.findBestMatch(product.original.toLowerCase(), state.productsTaxonomy);
                    if (bestMatch.rating > 0.8) product.foodakai = bestMatch.target;
                    console.log(bestMatch);
                }

                const products = { ...state.products, [incident_id]: [...state.products[incident_id], product] };
                return {
                    ...state,
                    products,
                };
            } else {
                return state;
            }
        }
        case EDIT_PRODUCT: {
            const { index, product, incident_id } = action.payload;
            const incidentProducts = state.products[incident_id];
            incidentProducts[index] = product;
            const products = { ...state.products, [incident_id]: incidentProducts };
            return {
                ...state,
                products,
            };
        }
        case REPLACE_HAZARDS: {
            const { hazardsArray, incident_id } = action.payload;

            // check incident's hazards array against Taxonomy and autofill
            hazardsArray.forEach(hazard => {
                if (!hazard.foodakai) {
                    const { bestMatch } = stringSimilarity.findBestMatch(hazard.original.toLowerCase(), state.hazardsTaxonomy);
                    if (bestMatch.rating > 0.9) hazard.foodakai = bestMatch.target;
                    console.log(bestMatch);
                }
            });

            //remove tags
            const regex = `(<hazard>(?!${hazardsArray[0].original})|(?<!${hazardsArray[0].original})<\\/hazard>)`;
            const title = state.titles[incident_id] ? state.titles[incident_id].replace(new RegExp(regex, 'g'), '') : null;
            const titles = { ...state.titles, [incident_id]: title };
            const description = state.descriptions[incident_id] ? state.descriptions[incident_id].replace(new RegExp(regex, 'g'), '') : null;
            const descriptions = { ...state.descriptions, [incident_id]: description };

            // new hazards
            const hazards = { ...state.hazards, [incident_id]: hazardsArray };

            return {
                ...state,
                hazards,
                titles,
                descriptions
            };
        }
        case ADD_HAZARD: {
            const { hazard, incident_id } = action.payload;
            // already exists, don't add more
            if (!state.hazards[incident_id].find(hz => hz.original === hazard.original)) {
                // check incident's hazard against Taxonomy and autofill
                if (!hazard.foodakai) {
                    const { bestMatch } = stringSimilarity.findBestMatch(hazard.original.toLowerCase(), state.hazardsTaxonomy);
                    if (bestMatch.rating > 0.9) hazard.foodakai = bestMatch.target;
                    console.log(bestMatch);
                }
                const hazards = { ...state.hazards, [incident_id]: [...state.hazards[incident_id], hazard] };
                return {
                    ...state,
                    hazards,
                };
            } else {
                return state;
            }
        }
        case EDIT_HAZARD: {
            const { index, hazard, incident_id } = action.payload;
            const incidentHazards = state.hazards[incident_id];
            incidentHazards[index] = hazard;
            const hazards = { ...state.hazards, [incident_id]: incidentHazards };
            return {
                ...state,
                hazards,
            };
        }
        case EDIT_COUNTRY: {
            const { country, incident_id } = action.payload;
            const countries = { ...state.countries, [incident_id]: country };
            return {
                ...state,
                countries,
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
        case SET_APPROVED: {
            const { incident_id, user } = action.payload;
            const incidents = [...state.incidents];
            const index = incidents.findIndex(incident => incident.id === incident_id);
            if (user) incidents[index].approvedFrom = user;
            else delete incidents[index].approvedFrom;
            return {
                ...state,
                incidents,
            };
        }

        case ADD_INCIDENTS_PAGES_LOADED: {
            const { incidentsPagesLoaded } = action.payload;
            return {
                ...state,
                incidentsPagesLoaded: [...state.incidentsPagesLoaded, incidentsPagesLoaded],
            };
        }
        case REMOVE_PRODUCT: {
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
        case REMOVE_HAZARD: {
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

        // TAXONOMIES
        case SET_PRODUCTS_TAXONOMY: {
            const { products } = action.payload;
            return {
                ...state,
                productsTaxonomy: products,
            };
        }
        case SET_HAZARDS_TAXONOMY: {
            const { hazards } = action.payload;
            return {
                ...state,
                hazardsTaxonomy: hazards,
            };
        }
        case SET_COUNTRIES_TAXOOMY: {
            const { countries } = action.payload;
            return {
                ...state,
                countriesTaxonomy: countries,
            };
        }
        default:
            return state;
    }
};

export default main;
