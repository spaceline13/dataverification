/* This Table is made to work directly with the results that the DataPlatform API returns (hits.hits)
	It does't need any manipulation form Selectors or Formatters
	It assumes that the data is of form: items(array)._source...
 */

import Box from '@material-ui/core/Box';
import React, { useState, useEffect } from 'react';
import ShowMoreText from 'react-show-more-text';
import { useDispatch, useSelector } from 'react-redux';

import Text from '../atoms/Text';
import Paginator from '../molecules/Paginator';
import { PAGE_SIZE } from '../../consts';
import {
    getDescriptions,
    getHazards,
    getIncidents,
    getIncidentsCount,
    getIncidentsPagesLoaded,
    getProducts, getTitles
} from '../../redux/selectors/mainSelectors';
import RemoteSelect from '../molecules/RemoteSelect';
import {removeHazards, removeProducts, setHazards, setProducts} from '../../redux/actions/mainActions';
import { fetchAnnotationTermsWithCallback } from '../../controllers/AnnotationController';

const IncidentsTable = ({ onLoadMorePages, color }) => {
    const dispatch = useDispatch();
    const incidents = useSelector(getIncidents);
    const products = useSelector(getProducts);
    const hazards = useSelector(getHazards);
    const titles = useSelector(getTitles);
    const descriptions = useSelector(getDescriptions);
    const count = useSelector(getIncidentsCount);
    const pagesLoaded = useSelector(getIncidentsPagesLoaded);

    const pageItemsCount = 8;
    const [currentPage, setCurrentPage] = useState(0);
    const [currentPageItems, setCurrentPageItems] = useState([]);
    const totalPages = Math.ceil(count / pageItemsCount);

    useEffect(() => {
        // set items to display for current page (slice of the initial array)
        setCurrentPageItems(incidents.slice(currentPage * pageItemsCount, currentPage * pageItemsCount + pageItemsCount));
    }, [incidents, currentPage]);

    const handlePageClick = page => {
        setCurrentPage(page.selected);
        const pageToAskDataPlatform = Math.floor((page.selected + 1) / (PAGE_SIZE / pageItemsCount)); // ex. 1 = first 100 incidents. 2 = 100-200 incidents etc.
        // if DataPlatform page has not been loaded, fetch data
        if (!pagesLoaded.includes(pageToAskDataPlatform)) {
            if (onLoadMorePages) {
                onLoadMorePages(pageToAskDataPlatform);
            }
        }
    };

    const handleEditProduct = (incident_id, product, foodakaiMapping) => {
        const selectedProduct = products[incident_id].find(pr => pr.original === product.original);
        selectedProduct.foodakai = foodakaiMapping;
        dispatch(setProducts(products[incident_id], incident_id));
    };
    const handleEditHazard = (incident_id, hazard, foodakaiMapping) => {
        const selectedHazard = hazards[incident_id].find(hz => hz.original === hazard.original);
        selectedHazard.foodakai = foodakaiMapping;
        dispatch(setHazards(hazards[incident_id], incident_id));
    };
    const handleRemoveProduct = (incident_id, product) => {
        dispatch(removeProducts(product, incident_id));
    };
    const handleRemoveHazard = (incident_id, hazard) => {
        dispatch(removeHazards(hazard, incident_id));
    };

    const searchAnnotations = (item, vocabulary, cb) => {
        fetchAnnotationTermsWithCallback(item, vocabulary, res => {
            cb(res);
        });
    };

    return (
        <div>
            {totalPages > 1 ? (
                <center>
                    <Paginator currentPage={currentPage} handlePageClick={handlePageClick} totalPages={totalPages} extraProps={color ? { containerClassName: `pagination pull-right ${color}` } : {}} />
                </center>
            ) : (
                <Box mt={'43px'} />
            )}
            <table className="table table-hover-dark table-striped" style={{ color: '#636971' }}>
                <thead>
                    <tr>
                        <th width={'200px'}>Title</th>
                        <th width={'700px'}>Description</th>
                        <th width={'250px'}>Product</th>
                        <th width={'250px'}>Hazard</th>
                    </tr>
                </thead>
                <tbody>
                    {currentPageItems.map((incident, indexI) => {
                        return (
                            <tr key={indexI} style={{ padding: '20px 0px' }}>
                                <td data-id={incident.id} data-field={'title'}>
                                    <Text>{titles[incident.id]}</Text>
                                </td>
                                <td data-id={incident.id} data-field={'description'}>
                                    <Text>
                                        {descriptions[incident.id] && (
                                            <ShowMoreText lines={5} more="Show more" less="Show less" anchorClass="" expanded={false} width={'670'}>
                                                {descriptions[incident.id]}
                                            </ShowMoreText>
                                        )}
                                    </Text>
                                </td>
                                <td data-id={incident.id}>
                                    <Text>
                                        {products[incident.id].map((product, index) => (
                                            <div key={index}>
                                                <span>{product.original}</span>
                                                {' : '}
                                                <RemoteSelect
                                                    item={product}
                                                    onChange={(item, value) => handleEditProduct(incident.id, item, value)}
                                                    searchForAnnotations={(item, cb) => searchAnnotations(item, 'products', cb)}
                                                />
                                                <i className="fas fa-times" style={{ cursor: 'pointer' }} onClick={() => handleRemoveProduct(incident.id, product)} />
                                            </div>
                                        ))}
                                    </Text>
                                </td>
                                <td data-id={incident.id}>
                                    <Text>
                                        {hazards[incident.id].map((hazard, index) => (
                                            <div key={index}>
                                                <span>{hazard.original}</span>
                                                {' : '}
                                                <RemoteSelect
                                                    item={hazard}
                                                    onChange={(item, value) => handleEditHazard(incident.id, item, value)}
                                                    searchForAnnotations={(item, cb) => searchAnnotations(item, 'hazards', cb)}
                                                />
                                                <i className="fas fa-times" style={{ cursor: 'pointer' }} onClick={() => handleRemoveHazard(incident.id, hazard)} />
                                            </div>
                                        ))}
                                    </Text>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default IncidentsTable;
