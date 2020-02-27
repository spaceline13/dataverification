import {useDispatch, useSelector} from 'react-redux';
import React from 'react';
import {
    getLoadingCuration,
    getOriginalSources,
    getRemoteProducts, getSelectedDateRange,
    getSelectedOriginalSources,
    getSelectedRemoteProducts,
    getSelectedSupplier
} from '../../redux/selectors/filterSelectors';
import LocalAutocompleteMulti from '../molecules/LocalAutocompleteMulti';
import Box from "@material-ui/core/Box";
import {
    setSelectedDateRange,
    setSelectedOriginalSources,
    setSelectedRemoteProducts,
    setSelectedSupplier
} from "../../redux/actions/filterActions";
import SearchSupplier from "./SearchSupplier";
import Datepicker from "../molecules/Datepicker";

export const formatNumber = num => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

const Filters = ({ refreshDropdowns }) => {
    const dispatch = useDispatch();
    const loadingCuration = useSelector(getLoadingCuration);
    const remoteProducts = useSelector(getRemoteProducts);
    const originalSources = useSelector(getOriginalSources);
    const selectedRemoteProducts = useSelector(getSelectedRemoteProducts);
    const selectedOriginalSources = useSelector(getSelectedOriginalSources);
    const selectedSupplier = useSelector(getSelectedSupplier);
    const selectedDateRange = useSelector(getSelectedDateRange);

    const handleSelectProducts = products => {
        dispatch(setSelectedRemoteProducts(products));
        refreshDropdowns('remoteProducts', products, selectedOriginalSources, selectedSupplier);
    };

    const handleSelectSources = sources => {
        dispatch(setSelectedOriginalSources(sources));
        refreshDropdowns('originalSources', selectedRemoteProducts, sources, selectedSupplier);
    };

    const handleSelectSupplier = supplier => {
        dispatch(setSelectedSupplier(supplier));
        refreshDropdowns('supplier', selectedRemoteProducts, selectedOriginalSources, supplier);
    };

    const handleSelectDateRange = dateRange => {
        dispatch(setSelectedDateRange(dateRange));
        refreshDropdowns('dateRange', selectedRemoteProducts, selectedOriginalSources, selectedSupplier, dateRange);
    };

    if (!loadingCuration) {
        return (
            <Box display={'flex'} alignItems={'flex-end'} mt={'20px'} mb={'20px'}>
                {remoteProducts && remoteProducts.length > 0 && (
                    <Box style={{width: '-webkit-fill-available', margin: '0px 10px'}}>
                        <LocalAutocompleteMulti
                            selected={selectedRemoteProducts}
                            onSelect={handleSelectProducts}
                            items={remoteProducts}
                            primaryItemOpt={'key'}
                            secondaryItemOpt={'doc_count'}
                            placeholder={
                                <span>
                                <i className="fa fa-md fa-bar-chart"/> Type and select products
                            </span>
                            }
                            formatNumbers={formatNumber}
                        />
                    </Box>
                )}
                {originalSources && originalSources.length > 0 && (
                    <Box style={{width: '-webkit-fill-available', margin: '0px 10px'}}>
                        <LocalAutocompleteMulti
                            selected={selectedOriginalSources}
                            onSelect={handleSelectSources}
                            items={originalSources}
                            primaryItemOpt={'key'}
                            secondaryItemOpt={'doc_count'}
                            placeholder={
                                <span>
                                <i className="fa fa-md fa-file-text"/> Type and select sources
                            </span>
                            }
                            formatNumbers={formatNumber}
                        />
                    </Box>
                )}
                <Box display={'flex'} alignItems={'flex-end'}
                     style={{width: '-webkit-fill-available', margin: '0px 10px'}}>
                    <SearchSupplier onSelectSupplier={handleSelectSupplier} selectedSupplier={selectedSupplier}/>
                    {selectedSupplier && <i style={{cursor: 'pointer', position: 'relative', top: '-4px' }} onClick={() => handleSelectSupplier(null)}
                                            className="fas fa-times"></i>
                    }
                </Box>
                <Box style={{width: '-webkit-fill-available', margin: '0px 10px'}}>
                    <Datepicker
                        filterTerms={selectedDateRange}
                        showDatesFilter
                        onUserInput={handleSelectDateRange}
                    />
                </Box>
            </Box>
        );
    } else {
        return <div>Loading...</div>;
    }
};

export default Filters;
