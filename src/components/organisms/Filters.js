import {useDispatch, useSelector} from 'react-redux';
import React from 'react';
import Toggle from 'react-toggle';
import "react-toggle/style.css";
import {
    getLoadingCuration, getOneHazard,
    getOriginalSources, getPossiblyOk, getRemoteHazards,
    getRemoteProducts, getSelectedDateRange,
    getSelectedOriginalSources, getSelectedRemoteHazards,
    getSelectedRemoteProducts,
    getSelectedSupplier
} from '../../redux/selectors/filterSelectors';
import LocalAutocompleteMulti from '../molecules/LocalAutocompleteMulti';
import Box from "@material-ui/core/Box";
import {
    setOneHazard,
    setPossiblyOk,
    setSelectedDateRange,
    setSelectedOriginalSources, setSelectedRemoteHazards,
    setSelectedRemoteProducts,
    setSelectedSupplier
} from "../../redux/actions/filterActions";
import SearchSupplier from "./SearchSupplier";
import Datepicker from "../molecules/Datepicker";
import Text from "../atoms/Text";
import {getFetchingIncidents} from "../../redux/selectors/mainSelectors";

export const formatNumber = num => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

const Filters = ({ refreshDropdowns, setCurrentPage }) => {
    const dispatch = useDispatch();
    const loadingCuration = useSelector(getLoadingCuration);
    const loadingIncidents = useSelector(getFetchingIncidents);
    const remoteProducts = useSelector(getRemoteProducts);
    const remoteHazards = useSelector(getRemoteHazards);
    const originalSources = useSelector(getOriginalSources);
    const selectedRemoteProducts = useSelector(getSelectedRemoteProducts);
    const selectedRemoteHazards = useSelector(getSelectedRemoteHazards);
    const selectedOriginalSources = useSelector(getSelectedOriginalSources);
    const selectedSupplier = useSelector(getSelectedSupplier);
    const selectedDateRange = useSelector(getSelectedDateRange);
    const selectedPossiblyOk = useSelector(getPossiblyOk);
    const selectedOneHazard = useSelector(getOneHazard);

    const handleSelectProducts = products => {
        const comingFrom = products.length > 0 ? 'remoteProducts' : null; //let the filters reset
        dispatch(setSelectedRemoteProducts(products));
        refreshDropdowns(comingFrom, products, selectedRemoteHazards, selectedOriginalSources, selectedSupplier, selectedDateRange, selectedPossiblyOk, selectedOneHazard);
        setCurrentPage(0);
    };

    const handleSelectHazards = hazards => {
        const comingFrom = hazards.length > 0 ? 'remoteHazards' : null; //let the filters reset
        dispatch(setSelectedRemoteHazards(hazards));
        refreshDropdowns(comingFrom, selectedRemoteProducts, hazards, selectedOriginalSources, selectedSupplier, selectedDateRange, selectedPossiblyOk, selectedOneHazard);
        setCurrentPage(0);
    };

    const handleSelectSources = sources => {
        const comingFrom = sources.length > 0 ? 'originalSources' : null; //let the filters reset
        dispatch(setSelectedOriginalSources(sources));
        refreshDropdowns(comingFrom, selectedRemoteProducts, selectedRemoteHazards, sources, selectedSupplier, selectedDateRange, selectedPossiblyOk, selectedOneHazard);
        setCurrentPage(0);
    };

    const handleSelectSupplier = supplier => {
        const comingFrom = 'supplier';
        dispatch(setSelectedSupplier(supplier));
        refreshDropdowns(comingFrom, selectedRemoteProducts, selectedRemoteHazards, selectedOriginalSources, supplier, selectedDateRange, selectedPossiblyOk, selectedOneHazard);
        setCurrentPage(0);
    };

    const handleSelectDateRange = dateRange => {
        const comingFrom = 'dateRange';
        dispatch(setSelectedDateRange(dateRange));
        refreshDropdowns(comingFrom, selectedRemoteProducts, selectedRemoteHazards, selectedOriginalSources, selectedSupplier, dateRange, selectedPossiblyOk, selectedOneHazard);
        setCurrentPage(0);
    };

    const handlePossiblyOk = event => {
        const comingFrom = 'possiblyOk';
        dispatch(setPossiblyOk(event.target.checked));
        refreshDropdowns(comingFrom, selectedRemoteProducts, selectedRemoteHazards, selectedOriginalSources, selectedSupplier, selectedDateRange, event.target.checked, selectedOneHazard);
        setCurrentPage(0);
    };

    const handleOneHazard = event => {
        const oneHazard = event.target.checked;
        const comingFrom = 'oneHazard';
        dispatch(setOneHazard(oneHazard));
        refreshDropdowns(comingFrom, selectedRemoteProducts, selectedRemoteHazards, selectedOriginalSources, selectedSupplier, selectedDateRange, selectedPossiblyOk, oneHazard);
        setCurrentPage(0);
    };

    if (!(loadingCuration || loadingIncidents)) {
        return (
            <Box display={'flex'} flexDirection={'row'} alignItems={'flex-start'} height={'50px'} mt={'20px'} mb={'20px'}>
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
                        selected={selectedRemoteHazards}
                        onSelect={handleSelectHazards}
                        items={remoteHazards}
                        primaryItemOpt={'key'}
                        secondaryItemOpt={'doc_count'}
                        placeholder={
                            <span>
                            <i className="fa fa-md fa-bar-chart"/> Type and select hazards
                        </span>
                        }
                        formatNumbers={formatNumber}
                    />
                </Box>
                <Box style={{width: '50px', marginRight: '14px'}}>
                    <Box ml={'10px'} mr={'-10px'}>
                        <Text size={'8px'} pb={'2px'} pl={'4px'} color={'#797979'}>one hazard</Text>
                        <Toggle
                            defaultChecked={selectedOneHazard}
                            onChange={handleOneHazard}
                        />
                    </Box>
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
