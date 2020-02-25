import { useState } from 'react';
import useConstant from 'use-constant';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { useAsync } from 'react-async-hook';

const useDebouncedFetch = asyncFetchFunction => {
	// The text param for the fetch
	const [inputText, setInputText] = useState('');

	// Debounce the original fetch async function with the text param
	const debouncedSearch = useConstant(() =>
		AwesomeDebouncePromise(asyncFetchFunction, 1000)
	);
	const search = useAsync(debouncedSearch, [inputText]);

	// Return everything needed for the hook consumer
	return {
		inputText,
		setInputText,
		search
	};
};

export default useDebouncedFetch;
