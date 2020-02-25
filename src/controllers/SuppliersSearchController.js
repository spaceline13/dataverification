import { startCase } from 'lodash';
import { OR_DELIMITER, searchQuery } from './MainController';

export const fetchCompanyDetails = (user, supplier, callback) => {
	const options = {
		entityType: 'supplier',
		strictQuery: { title: supplier }
	};
	searchQuery(user, options).then(({ hits }) => {
		const ret = hits.hits.length > 0 ? hits.hits[0]._source : null;
		if (ret) {
			ret.location = ret.basedIn[0] ? startCase(ret.basedIn[0].country.value) : '';
		}
		if (callback) {
			callback(ret);
		}
	}).catch(error => console.log(error));
};

export const fetchSupplierIncidents = (user, withYearAggregations, supplier, subsidiaries, altNames, parentOrganizations, page, extra, callback) => {
	const options = {
		entityType: 'incident',
		strictQuery: { 'suppliers.title': supplier },
		page,
		aggregations: {
			byType: {
				attribute: 'notificationType.keyword',
				size: 2
			}
		}
	};
	if (withYearAggregations) {
		options.aggregations = {
			...options.aggregations,
			years: {
				attribute: 'createdOn',
				format: 'YYYY',
				interval: 'YEAR',
				size: 100
			}
		};
	}
	if (subsidiaries.length > 0) {
		// add subsidiaries to the query
		options.strictQuery['suppliers.title'] = options.strictQuery['suppliers.title'] + OR_DELIMITER + subsidiaries.map(sub => sub.title).join(OR_DELIMITER);
	}
	if (altNames.length > 0) {
		// add altNames to the query
		options.strictQuery['suppliers.title'] = options.strictQuery['suppliers.title'] + OR_DELIMITER + altNames.join(OR_DELIMITER);
	}
	if (parentOrganizations.length > 0) {
		// add parentOrganizations to the query
		options.strictQuery['suppliers.title'] = options.strictQuery['suppliers.title'] + OR_DELIMITER + parentOrganizations.map(sub => sub.title).join(OR_DELIMITER);
	}
	searchQuery(user, options).then(({ hits, aggregations }) => {
		if (callback) {
			const response = { res: hits.hits, count: hits.total };
			if (withYearAggregations) response.perYear = aggregations['date_histogram#years'].buckets;
			if (aggregations['sterms#byType']) response.byType = aggregations['sterms#byType'].buckets;
			callback(response);
		}
	}).catch(error => console.log(error));
};

export const fetchSupplierInspections = (user, withYearAggregations, supplier, subsidiaries, altNames, parentOrganizations, page, extra, callback) => {
	const options = {
		entityType: 'inspection',
		strictQuery: {
			'company.title': supplier,
			inspectionOutcomes: '!!no action indicated'
		},
		page,
		aggregations: {
			byType: {
				attribute: 'inspectionType.keyword',
				size: 3
			}
		}
	};
	if (withYearAggregations) {
		options.aggregations = {
			...options.aggregations,
			years: {
				attribute: 'createdOn',
				format: 'YYYY',
				interval: 'YEAR',
				size: 100
			}
		};
	}
	if (subsidiaries.length > 0) {
		// add subsidiaries to the query
		options.strictQuery['company.title'] = options.strictQuery['company.title'] + OR_DELIMITER + subsidiaries.map(sub => sub.title).join(OR_DELIMITER);
	}
	if (altNames.length > 0) {
		// add altNames to the query
		options.strictQuery['company.title'] = options.strictQuery['company.title'] + OR_DELIMITER + altNames.join(OR_DELIMITER);
	}
	if (parentOrganizations.length > 0) {
		// add parentOrganizations to the query
		options.strictQuery['company.title'] = options.strictQuery['company.title'] + OR_DELIMITER + parentOrganizations.map(sub => sub.title).join(OR_DELIMITER);
	}
	if (extra && extra.positiveInspections) {
		// call for positive inspections
		options.strictQuery.inspectionOutcomes = 'no action indicated';
	}
	searchQuery(user, options).then(({ hits, aggregations }) => {
		if (callback) {
			const response = { res: hits.hits, count: hits.total };
			if (withYearAggregations) response.perYear = aggregations['date_histogram#years'].buckets;
			if (aggregations['sterms#byType']) response.byType = aggregations['sterms#byType'].buckets;
			callback(response);
		}
	}).catch(error => console.log(error));
};

// async search for my suppliers autocomplete
export const asyncSearchForSuppliers = (inputText) => {
	const rawMatchScore = 2500;
	const factor = 40;
	const numOfLettersInputed = inputText.length;
	const options = {
		entityType: 'supplier',
		fuzzyQuery: { title: inputText },
		detail: true,
		fuzzinessScore: numOfLettersInputed * rawMatchScore / factor,
		smart: true
	};
	return new Promise(resolve => {
		searchQuery(options).then(res => {
			resolve(res);
			return res;
		}).catch(error => {
			console.log(error);
			resolve(false);
		});
	});
};
