import {useDispatch, useSelector} from 'react-redux';
import React from 'react';
import { getOriginalSources, getRemoteProducts, getSelectedOriginalSources, getSelectedRemoteProducts } from '../../redux/selectors/filterSelectors';
import LocalAutocompleteMulti from '../molecules/LocalAutocompleteMulti';
import Box from "@material-ui/core/Box";
import {setSelectedOriginalSources, setSelectedRemoteProducts} from "../../redux/actions/filterActions";

export const formatNumber = num => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

const Filters = ({ refreshDropdowns }) => {
    const dispatch = useDispatch();
    const remoteProducts = useSelector(getRemoteProducts);
    const originalSources = useSelector(getOriginalSources);
    const selectedRemoteProducts = useSelector(getSelectedRemoteProducts);
    const selectedOriginalSources = useSelector(getSelectedOriginalSources);

    const handleSelectProducts = products => {
        dispatch(setSelectedRemoteProducts(products));
        refreshDropdowns('remoteProducts', products, selectedOriginalSources);
    };

    const handleSelectSources = sources => {
        dispatch(setSelectedOriginalSources(sources));
        refreshDropdowns('originalSources', selectedRemoteProducts, sources);
    };

    return (
        <Box display={'flex'} alignItems={'flex-end'}>
            {remoteProducts && remoteProducts.length > 0 && (
                <Box style={{ width: '-webkit-fill-available', margin: '0px 10px' }}>
                    <LocalAutocompleteMulti
                        selected={selectedRemoteProducts}
                        onSelect={handleSelectProducts}
                        items={remoteProducts}
                        primaryItemOpt={'key'}
                        secondaryItemOpt={'doc_count'}
                        placeholder={
                            <span>
                                <i className="fa fa-md fa-bar-chart" /> Type and select products
                            </span>
                        }
                        formatNumbers={formatNumber}
                    />
                </Box>
            )}
            {originalSources && originalSources.length > 0 && (
                <Box style={{ width: '-webkit-fill-available', margin: '0px 10px' }}>
                    <LocalAutocompleteMulti
                        selected={selectedOriginalSources}
                        onSelect={handleSelectSources}
                        items={originalSources}
                        primaryItemOpt={'key'}
                        secondaryItemOpt={'doc_count'}
                        placeholder={
                            <span>
                                <i className="fa fa-md fa-file-text" /> Type and select sources
                            </span>
                        }
                        formatNumbers={formatNumber}
                    />
                </Box>
            )}
        </Box>
    );
};

export default Filters;
