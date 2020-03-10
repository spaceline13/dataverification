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

/* --------- UTILITY FUNCTIONS ---------- */
const checkProductAgainstTaxonomyAndAutofill = (product, productsTaxonomy) => {
    if (!product.foodakai) {
        const original = product.original.toLowerCase();
        let { bestMatch } = stringSimilarity.findBestMatch(original, productsTaxonomy);

        // transform , seperated ex. Beans, Dried => Dried Beans
        if (original.indexOf(', ') !== -1) {
            const array = original.split(', ').reverse();
            const comma_bestMatch = stringSimilarity.findBestMatch(array.join(' '), productsTaxonomy).bestMatch;
            if (comma_bestMatch.rating > bestMatch.rating) bestMatch = comma_bestMatch;
        }

        if (bestMatch.rating > 0.78) product.foodakai = bestMatch.target;
        console.log(bestMatch);
    }
};
const checkHazardAgainstTaxonomyAndAutofill = (hazard, hazardsTaxonomy) => {
    if (!hazard.foodakai) {
        const original = hazard.original.toLowerCase();
        // specific hack for specific hazard
        if ((original.indexOf('produced without') !== -1) && (original.indexOf('benefit')  !== -1) && (original.indexOf('inspection')  !== -1)) {
            hazard.foodakai = 'unauthorised use of federal inspection mark';
        } else { // check for matching
            let {bestMatch} = stringSimilarity.findBestMatch(original, hazardsTaxonomy);

            // transform f to ph and check
            if (original.indexOf('f') !== -1) {
                const ph_original = original.replace('f', 'ph');
                const ph_bestMatch = stringSimilarity.findBestMatch(ph_original, hazardsTaxonomy).bestMatch;
                if (ph_bestMatch.rating > bestMatch.rating) bestMatch = ph_bestMatch;
            }

            // transform f to ph and check
            if (original.indexOf('ph') !== -1) {
                const f_original = original.replace('ph', 'f');
                const f_bestMatch = stringSimilarity.findBestMatch(f_original, hazardsTaxonomy).bestMatch;
                if (f_bestMatch.rating > bestMatch.rating) bestMatch = f_bestMatch;
            }

            // check for string + 'products thereof' in hazards
            if (bestMatch.rating < 0.8 && original.length > 3) {
                const products_thereof_bestMatch = stringSimilarity.findBestMatch(original + ' and products thereof', hazardsTaxonomy).bestMatch;
                if ((products_thereof_bestMatch.rating > 0.9) && (products_thereof_bestMatch.rating > bestMatch.rating)) bestMatch = products_thereof_bestMatch;
            }

            if (bestMatch.rating > 0.775) hazard.foodakai = bestMatch.target;
            console.log(bestMatch);
        }
    }
};
const removeTags = (tag, incident_id, array, titles, descriptions) => {
    // remove tags
    const regex = `(<${tag}>(?!${array[0].original})|(?<!${array[0].original})<\\/${tag}>)`;
    const title = titles[incident_id] ? titles[incident_id].replace(new RegExp(regex, 'g'), '') : null;
    const description = descriptions[incident_id] ? descriptions[incident_id].replace(new RegExp(regex, 'g'), '') : null;

    return {
        titles: { ...titles, [incident_id]: title },
        descriptions: { ...descriptions, [incident_id]: description },
    }
};
const removeTag = (tag, incident_id, product, titles, descriptions) => {
    const result = {};
    const tagged = `<${tag}>${product.original}</${tag}>`;

    // check description for tagged text
    if (descriptions[incident_id] && descriptions[incident_id].indexOf(tagged) !== -1) {
        // find the description of the incident and replace the tags with the untagged text
        const description = descriptions[incident_id].replace(tagged, product.original);
        // create new array of descriptions to replace old one
        result.descriptions = { ...descriptions, [incident_id]: description };
    }

    //check title for tagged text
    if (titles[incident_id] && titles[incident_id].indexOf(tagged) !== -1) {
        // find the title of the incident and replace the tags with the untagged text
        const title = titles[incident_id].replace(tagged, product.original);
        // create new array of titles to replace old one
        result.titles = { ...titles, [incident_id]: title };
    }

    return result;
};

/* ---------- MAIN REDUCER ---------- */
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
            /* SET INCIDENTS IS THE MAIN IMPORTING FUNCTION OF THE TOOL. IT FILLS ALL THE OTHER ARRAYS */
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
            /* LOAD PREVIOUSLY SAVED INCIDENTS FROM MONGO ACCORDING TO INCIDENT IDS */
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
            /* MOSTLY USED ON LOAD MORE INCIDENTS WHEN PAGE NUMBER IS BIG ENOUGH TO LOAD MORE INCIDENTS FROM THE DATA PLATFORM */
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
                checkProductAgainstTaxonomyAndAutofill(product, state.productsTaxonomy);
            });

            // remove all product tags
            const tag = 'product';
            const { titles, descriptions } = removeTags(tag, incident_id, productsArray, state.titles, state.descriptions);

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
                checkProductAgainstTaxonomyAndAutofill(product, state.productsTaxonomy);

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
                checkHazardAgainstTaxonomyAndAutofill(hazard, state.hazardsTaxonomy);
            });

            // remove all hazard tags
            const tag = 'hazard';
            const { titles, descriptions } = removeTags(tag, incident_id, hazardsArray, state.titles, state.descriptions);

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
                checkHazardAgainstTaxonomyAndAutofill(hazard, state.hazardsTaxonomy);

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

            // remove specific tag
            const tag = 'product';
            const { descriptions, titles } = removeTag(tag, incident_id, product, state.titles, state.descriptions);

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

            // remove specific tag
            const tag = 'hazard';
            const { descriptions, titles } = removeTag(tag, incident_id, hazard, state.titles, state.descriptions);

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
