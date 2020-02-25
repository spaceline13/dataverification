import React, { useRef } from 'react';
import Box from '@material-ui/core/Box';
import RemoteAutocomplete from '../molecules/RemoteAutocomplete';
import { asyncSearchForSuppliers } from '../../controllers/SuppliersSearchController';

const SearchSupplier = ({ onSelectSupplier, selectedSupplier }) => {
	const downshiftReference = useRef(null);

	const handleSelectSupplier = supplier => {
		onSelectSupplier(supplier);
	};

	const customListHandler = list => {
		const tmp = [];
		let parent1 = { i: -1, subs: -1 };
		let parent2 = { i: -1, subs: -1 };

		for (let i in list) {
			if (list[i]._source.subsidiaries && list[i]._source.subsidiaries.length > 0) {
				// if has subsidiaries add is parent flag
				tmp.push({ ...list[i]._source, secondaryDataToDisplay: ' (parent)' });

				// check for biggest parents (parent1 & parent2)
				if (list[i]._source.subsidiaries.length > parent1.subs) {
					if (parent1.subs > parent2.subs) parent2 = { ...parent1 };
					parent1 = { i, subs: list[i]._source.subsidiaries.length };
				} else if (list[i]._source.subsidiaries && (list[i]._source.subsidiaries.length > parent2.subs)) {
					parent2 = { i, subs: list[i]._source.subsidiaries.length };
				}
			} else if (list[i]._source.parentOrganizations && list[i]._source.parentOrganizations.length > 0) {
				// if has parents add is subsidiary flag
				tmp.push({ ...list[i]._source, secondaryDataToDisplay: ' (subsidiary)' });
			} else {
				tmp.push(list[i]._source);
			}
		}

		// reorder the biggest parents to the beginning of the array
		if (parent2.i >= 0) tmp.unshift(tmp.splice(parent2.i, 1)[0]);
		if (parent1.i >= 0) tmp.unshift(tmp.splice(parent1.i, 1)[0]);
		return tmp;
	};

	return (
		<Box display={'inline-block'} style={{ width: '90%' }}>
			<RemoteAutocomplete
				onSelect={handleSelectSupplier}
				asyncFetchFunction={asyncSearchForSuppliers}
				placeholder={selectedSupplier ? selectedSupplier.title : null}
				reference={downshiftReference}
				hasAddNew
				customListHandler={customListHandler}
			/>
		</Box>
	);
};

export default SearchSupplier;
