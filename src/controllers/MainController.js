export const DATAPLATFORM_SEARCH_ENDPOINT = window.location.protocol === 'http:' ? 'http://api.foodakai.com/search-api-1.0/search/' : 'https://api.foodakai.com/search-api-1.0/search/';

export const OR_DELIMITER = '||';
export const AND_DELIMITER = '&&';
//export const API_KEY = 'b1b28e6a-0894-35d7-9e22-c7eaf6da5159';
export const API_KEY = 'db6a04e9-5df3-3f23-8f2a-28b81d1e3aa8';
export const PAGE_SIZE = 100;

export const searchPost = async body => {
	const response = await fetch(DATAPLATFORM_SEARCH_ENDPOINT, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
	const json = await response.json();

	return json;
};

export const searchQuery = async fields => {
	const query = {
		apikey: API_KEY,
		...fields,
		pageSize: 'pageSize' in fields ? fields.pageSize : PAGE_SIZE,
		detail: 'detail' in fields ? fields.detail : true
	};
	const response = await searchPost(query);
	return response;
};
