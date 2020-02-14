import React, { useState } from "react";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MuiDownshift from 'mui-downshift';
import Text from '../atoms/Text';
import Box from "@material-ui/core/Box";
import RestrictedLengthChip from "../atoms/RestrictedLengthChip";

const LocalAutocompleteMulti = ({ items, selected, onSelect, placeholder, primaryItemOpt, secondaryItemOpt, formatNumbers, hasHierarchy }) => {
	const [inputValue, setInputValue] = useState();
	const [filteredItems, setFilteredItems] = useState(items);
	const [selectedItems, setSelectedItems] = useState(selected ? selected : []);

	const handleChange = (item, downshiftProps) => {
		const tmpSelected = [...selectedItems, item];
		setSelectedItems(tmpSelected);
		if (onSelect) onSelect(tmpSelected);
		downshiftProps.openMenu();
		setInputValue('');
		setFilteredItems(items);
	};

	const handleInputChange = event => {
		const { value } = event.target;
		const filtered = items.filter(item => item[primaryItemOpt].toLowerCase().includes(value.toLowerCase()));
		setFilteredItems(filtered);
		setInputValue(value);
	};

	const handleDelete = item => {
		const tmpSelected = selectedItems.filter(it => it[primaryItemOpt] !== item[primaryItemOpt]);
		setSelectedItems(tmpSelected);
		if (onSelect) onSelect(tmpSelected);
	};

	const inputProps = () => ({
		onChange: handleInputChange,
		startAdornment: (
			selectedItems.map(item => (
				<RestrictedLengthChip
					key={item[primaryItemOpt]}
					label={item[primaryItemOpt]}
					onDelete={() => handleDelete(item)}
				/>
			))
		),
		endAdornment: null,
		label: placeholder,
		style: { flexWrap: 'wrap' }
	});

	const getListItem = ({ getItemProps, item }) => (
		item ? (
			<ListItem button {...getItemProps()} disabled={selectedItems.includes(item)}>
				{hasHierarchy ? (
					<Text inline>{item.parents && item.parents.map(parent => <span>{parent} > </span>)} <b>{item.label}</b></Text>
				) : (
					<Box>
						<Text inline>{item[primaryItemOpt]}</Text>&nbsp;{secondaryItemOpt && <Text inline color={'grey'}>({formatNumbers ? formatNumbers(item[secondaryItemOpt]) : item[secondaryItemOpt]})</Text>}
					</Box>
				)}
			</ListItem>
		) : (
			<ListItem button disabled>
				<ListItemText primary={<span style={{ fontStyle: 'italic' }}>No items found</span>} />
			</ListItem>
		)
	);

	return (
		<MuiDownshift
			getInputProps={inputProps}
			getListItem={getListItem}
			itemToString={item => (item ? (hasHierarchy ? item.value : item[primaryItemOpt]) : '')}
			inputValue={inputValue}
			items={filteredItems}
			showEmpty={true}
			onChange={handleChange}
		/>
	);
};

export default LocalAutocompleteMulti;
