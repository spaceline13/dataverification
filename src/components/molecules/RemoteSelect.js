import { Select } from '@material-ui/core';
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';

const RemoteSelect = ({ item, onChange, searchForAnnotations }) => {
    const [enableMapping, setEnableMapping] = useState(false);
    const [items, setItems] = useState([]);
    const handleChange = event => {
        onChange(item, event.target.value);
    };
    const handleMapping = () => {
        setEnableMapping(true);
        searchForAnnotations(item.original, res => {
            setItems(res);
        });
    };

    if (item.foodakai || enableMapping) {
        //fetch items
        return (
            <Select autoWidth={true} displayEmpty value={item.foodakai} onChange={handleChange}>
                {items.map((suggestion, i) => (
                    <MenuItem key={i} value={suggestion.label}>
                        {suggestion.label}
                    </MenuItem>
                ))}
            </Select>
        );
    } else {
        return <Button onClick={handleMapping}>Set Mapping</Button>;
    }
};

export default RemoteSelect;
