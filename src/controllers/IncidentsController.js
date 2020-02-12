import { searchQuery } from './MainController';

export const fetchIncidentsIncludingUnpublished = (freetext, pageSize = 100, page = 0, detail = false, from, to, callback) => {
    const query = {
        smart: true,
        entityType: 'incident',
        detail,
        page,
        pageSize,
        freetext,
        from,
        to,
        sortOn: {
            createdOn: 'desc',
        },
        expand: true,
        published: false,
    };
    searchQuery(query).then(({ hits }) => {
        if (callback) {
            const response = { res: hits.hits.map(hit => hit._source), count: hits.total };
            callback(response);
        }
    });
};
