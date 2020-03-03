import {useDispatch, useSelector} from 'react-redux';
import React from 'react';
import Toggle from 'react-toggle';
import "react-toggle/style.css";
import {
    getLoadingCuration,
    getOriginalSources, getPossiblyOk,
    getRemoteProducts, getSelectedDateRange,
    getSelectedOriginalSources,
    getSelectedRemoteProducts,
    getSelectedSupplier
} from '../../redux/selectors/filterSelectors';
import LocalAutocompleteMulti from '../molecules/LocalAutocompleteMulti';
import Box from "@material-ui/core/Box";
import {
    setPossiblyOk,
    setSelectedDateRange,
    setSelectedOriginalSources,
    setSelectedRemoteProducts,
    setSelectedSupplier
} from "../../redux/actions/filterActions";
import SearchSupplier from "./SearchSupplier";
import Datepicker from "../molecules/Datepicker";
import Text from "../atoms/Text";
import {getFetchingIncidents} from "../../redux/selectors/mainSelectors";

export const formatNumber = num => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

const Filters = ({ refreshDropdowns }) => {
    const dispatch = useDispatch();
    const loadingCuration = useSelector(getLoadingCuration);
    const loadingIncidents = useSelector(getFetchingIncidents);
    const remoteProducts = useSelector(getRemoteProducts);
    const originalSources = useSelector(getOriginalSources);
    const selectedRemoteProducts = useSelector(getSelectedRemoteProducts);
    const selectedOriginalSources = useSelector(getSelectedOriginalSources);
    const selectedSupplier = useSelector(getSelectedSupplier);
    const selectedDateRange = useSelector(getSelectedDateRange);
    const selectedPossiblyOk = useSelector(getPossiblyOk);

    const handleSelectProducts = products => {
        dispatch(setSelectedRemoteProducts(products));
        refreshDropdowns('remoteProducts', products, selectedOriginalSources, selectedSupplier, selectedDateRange, selectedPossiblyOk);
    };

    const handleSelectSources = sources => {
        dispatch(setSelectedOriginalSources(sources));
        refreshDropdowns('originalSources', selectedRemoteProducts, sources, selectedSupplier, selectedDateRange, selectedPossiblyOk);
    };

    const handleSelectSupplier = supplier => {
        dispatch(setSelectedSupplier(supplier));
        refreshDropdowns('supplier', selectedRemoteProducts, selectedOriginalSources, supplier, selectedDateRange, selectedPossiblyOk);
    };

    const handleSelectDateRange = dateRange => {
        dispatch(setSelectedDateRange(dateRange));
        refreshDropdowns('dateRange', selectedRemoteProducts, selectedOriginalSources, selectedSupplier, dateRange, selectedPossiblyOk);
    };

    const handlePossiblyOk = event => {
        dispatch(setPossiblyOk(event.target.checked));
        refreshDropdowns('possiblyOk', selectedRemoteProducts, selectedOriginalSources, selectedSupplier, selectedDateRange, event.target.checked);
    };

    if (!(loadingCuration || loadingIncidents)) {
        return (
            <Box display={'flex'} alignItems={'flex-end'} mt={'20px'} mb={'20px'}>
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
                <Box display={'flex'} alignItems={'flex-end'}
                     style={{width: '-webkit-fill-available', margin: '0px 10px'}}>
                    <SearchSupplier onSelectSupplier={handleSelectSupplier} selectedSupplier={selectedSupplier}/>
                    {selectedSupplier && <i style={{cursor: 'pointer', position: 'relative', top: '-4px' }} onClick={() => handleSelectSupplier(null)}
                                            className="fas fa-times"></i>
                    }
                    <Box ml={'10px'} mr={'-10px'}>
                        <Text size={'8px'} pb={'2px'} pl={'4px'} color={'#797979'}>possibly ok</Text>
                        <Toggle
                            defaultChecked={selectedPossiblyOk}
                            onChange={handlePossiblyOk}
                        />
                    </Box>
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
