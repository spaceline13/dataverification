import ListItem from '@material-ui/core/ListItem';
import MuiDownshift from 'mui-downshift';
import React, { useState } from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import Box from '@material-ui/core/Box';

import Text from '../atoms/Text';

const LocalAutocomplete = ({ items, selectedItem, onSelect, placeholder, reference, primaryItemOpt, secondaryItemOpt, formatNumbers, loading = false, hasHierarchy }) => {
    const [filtered, setFiltered] = useState(items);
    let input = null;
    const handleStateChange = changes => {
        if (typeof changes.inputValue === 'string') {
            const filteredItems = items.filter(item => item[primaryItemOpt].toLowerCase().includes(changes.inputValue.toLowerCase()));
            setFiltered(filteredItems);
        }
    };

    return (
        <MuiDownshift
            focusOnClear
            defaultSelectedItem={selectedItem}
            getListItem={({ getItemProps, item }) =>
                item ? (
                    <ListItem button {...getItemProps(item)}>
                        {hasHierarchy ? (
                            <Text inline>
                                {item.parents.map(parent => (
                                    <span>{parent} > </span>
                                ))}{' '}
                                <b>{item.label}</b>
                            </Text>
                        ) : (
                            <Box>
                                <Text inline>{item[primaryItemOpt]}</Text>&nbsp;
                                {secondaryItemOpt && (
                                    <Text inline color={'grey'}>
                                        ({formatNumbers ? formatNumbers(item[secondaryItemOpt]) : item[secondaryItemOpt]})
                                    </Text>
                                )}
                            </Box>
                        )}
                    </ListItem>
                ) : (
                    <ListItem button disabled>
                        <ListItemText primary={<span style={{ fontStyle: 'italic' }}>No items found</span>} />
                    </ListItem>
                )
            }
            inputRef={a => {
                input = a;
            }}
            itemToString={item => (item ? (hasHierarchy ? item.value : item[primaryItemOpt]) : '')}
            ref={reference}
            items={filtered}
            showEmpty={true}
            onChange={value => {
                if (input) input.blur();
                onSelect(value);
            }}
            getInputProps={() => ({
                label: placeholder,
            })}
            onStateChange={handleStateChange}
            loading={loading}
        />
    );
};

export default LocalAutocomplete;
