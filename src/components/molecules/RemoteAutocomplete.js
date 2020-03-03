import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MuiDownshift from 'mui-downshift';
import React from 'react';
import useDebouncedFetch from '../../utils/hooks/useDebouncedFetch';

// The component is set to read from API the response as seen bellow:
// obj(response) -> obj(hits) -> array(hits) => object(item => item._source) -> string(title)
// for any changes, you have to change the items prop

const RemoteAutocomplete = ({ key, onSelect, asyncFetchFunction, placeholder, reference, hasAddNew, variant, customListHandler, noWait }) => {
	const { inputText, setInputText, search } = useDebouncedFetch(asyncFetchFunction, true);

	return (
		<MuiDownshift
			key={key}
			ref={reference}
			variant={variant ? variant : 'standard'}
			getListItem={
				({ getItemProps, item }) => {
					return (item ?
						item.addnew ? (
							// the 'add new option'
							<ListItem button {...getItemProps(item)} style={{ backgroundColor: '#ccc' }} >
								<ListItemText primary={<span style={{ fontStyle: 'italic' }}>Add new item</span>} />
							</ListItem>
						) : (
							// the actual options
							<ListItem button {...getItemProps(item)}>
								<ListItemText primary={<span dangerouslySetInnerHTML={{ __html: item.title.replace(inputText, '<b>' + inputText + '</b>') }} />} secondary={item.secondaryDataToDisplay ? item.secondaryDataToDisplay : ''} />
							</ListItem>
						) :
						search.loading ? (
							// the 'is loading' label
							<ListItem button disabled>
								<ListItemText primary={<span style={{ fontStyle: 'italic' }}>Loading...</span>} />
							</ListItem>
						) : (
							// the 'no items' label
							<ListItem button disabled>
								<ListItemText primary={<span style={{ fontStyle: 'italic' }}>No items found</span>} />
							</ListItem>
						)
					);
				}
			}
			includeFooter={true}
			items={
				(
					search.result ? (
						// if custom list reorder
						customListHandler ? (
							hasAddNew && inputText.length > 0 ? [
								{
									title: inputText,
									addnew: true
								},
								...customListHandler(search.result.hits.hits)
							] : search.result.hits.hits.map(item => item._source)
						) : (
						// that's the standard order (if no custom list reorder function is provided)
							hasAddNew && inputText.length > 0 ? [
								{
									title: inputText,
									addnew: true
								},
								...search.result.hits.hits.map(item => item._source)
							] : search.result.hits.hits.map(item => item._source)
						)
					) : []
				)
			}
			itemToString={item => (item ? item.title : '')}
			loading={search.loading}
			showEmpty={true}
			onChange={onSelect}
			getInputProps={() => ({
				label: placeholder ? placeholder : 'Search for Supplier'
			})}
			onStateChange={async changes => {
				if (typeof changes.inputValue === 'string') {
					setInputText(changes.inputValue);
				}
			}}
		/>
	);
};

export default RemoteAutocomplete;
