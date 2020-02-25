import { searchQuery } from './MainController';
import moment from "moment";

// Concat an array to a string delimiting with ||. Works for array of strings or array of objects of type: {key:'example'}
const concatStringsWithOrReducer = (accumulator, currentValue, index) => (index === 0 ? (currentValue.key ? currentValue.key : currentValue) : (accumulator + '||' + (currentValue.key ? currentValue.key : currentValue)));
export const ifArrayCreateStringForQuery = item => (Array.isArray(item) ? item.reduce(concatStringsWithOrReducer, '') : item);

export const fetchIncidentsIncludingUnpublished = ({ freetext = '', product, source, comingFrom, supplier, dateRange }, pageSize = 100, page = 0, detail = false, from, to, callback) => {
    const productString = ifArrayCreateStringForQuery(product);
    const sourceString = ifArrayCreateStringForQuery(source);

    const options = {
        smart: false,
        entityType: 'incident',
        detail,
        page,
        pageSize,
        freetext, // freetext is disabled when supplier is selected
        from: dateRange && dateRange.from ? moment(dateRange.from).format('YYYY-MM-DD') : null,
        to: dateRange && dateRange.to ? moment(dateRange.to).format('YYYY-MM-DD') : null,
        strictQuery: {},
        aggregations: {
            remoteProducts: {
                attribute: 'remoteProducts.value.keyword',
                size: 2000,
            },
            originalSources: {
                attribute: 'originalSource.dataSource.keyword',
                size: 200,
            },
        },
        sortOn: {
            createdOn: 'desc',
        },
        expand: true,
        published: false,
    };

    if (productString && productString !== '') options.strictQuery['remoteProducts.value.keyword'] = productString.key ? productString.key : productString;
    if (sourceString && sourceString !== '') options.strictQuery['originalSource.dataSource.keyword'] = sourceString.key ? sourceString.key : sourceString;
    if (supplier && supplier.title) {
        options.context = 'suppliers';
        options.existenceQuery = ['suppliers||company'];
        options.freetext = supplier.title;
    }

    searchQuery(options).then(({ hits, aggregations }) => {
        if (callback) {
            const response = {
                res: hits.hits.map(hit => hit._source),
                count: hits.total,
                filters: {
                    remoteProducts: aggregations['sterms#remoteProducts'].buckets,
                    originalSources: aggregations['sterms#originalSources'].buckets,
                },
            };

            if (response.filters[comingFrom]) delete response.filters[comingFrom];
            callback(response);
        }
    });
};
