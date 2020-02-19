import React from 'react';
import ShowMoreText from 'react-show-more-text';
import { useDispatch, useSelector } from 'react-redux';

import Text from '../atoms/Text';
import {
    getDescriptions,
    getHazards,
    getProducts, getTitles
} from '../../redux/selectors/mainSelectors';
import RemoteSelect from '../molecules/RemoteSelect';
import {removeHazards, removeProducts, setHazards, setProducts} from '../../redux/actions/mainActions';
import { fetchAnnotationTermsWithCallback } from '../../controllers/AnnotationController';

const IncidentsTable = ({ currentPageItems }) => {
    const dispatch = useDispatch();
    const products = useSelector(getProducts);
    const hazards = useSelector(getHazards);
    const titles = useSelector(getTitles);
    const descriptions = useSelector(getDescriptions);

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
            <table className="table table-hover-dark table-striped" style={{ color: '#636971' }}>
                <thead>
                    <tr>
                        <th width={'200px'}>Title</th>
                        <th width={'800px'}>Description</th>
                        <th>Product</th>
                        <th>Hazard</th>
                        <th width={'20px'}><i className="fas fa-check"></i></th>
                    </tr>
                </thead>
                <tbody>
                    {currentPageItems.map((incident, indexI) => {
                        const checked =
                            hazards[incident.id] && hazards[incident.id].length > 0 && !hazards[incident.id].find(hz => !hz.foodakai) && products[incident.id] && products[incident.id].length > 0 && !products[incident.id].find(pr => !pr.foodakai);
                        const trStyling = checked ? { padding: '20px 0px', background: 'rgba(113,195,80,0.2)' } : { padding: '20px 0px' };
                        return (
                            <tr key={indexI} style={trStyling}>
                                <td data-id={incident.id} data-field={'title'}>
                                    <Text>{titles[incident.id]}</Text>
                                </td>
                                <td data-id={incident.id} data-field={'description'}>
                                    <Text>
                                        {descriptions[incident.id] && (
                                            <ShowMoreText lines={5} more="Show more" less="Show less" anchorClass="" expanded={false} width={'770'}>
                                                {descriptions[incident.id]}
                                            </ShowMoreText>
                                        )}
                                    </Text>
                                </td>
                                <td data-id={incident.id}>
                                    <Text>
                                        {products[incident.id] && products[incident.id].map((product, index) => (
                                            <div key={index}>
                                                <Text inline>{product.original}</Text>
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
                                        {hazards[incident.id] && hazards[incident.id].map((hazard, index) => (
                                            <div key={index}>
                                                <Text inline>{hazard.original}</Text>
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
                                <td>
                                    {checked ? (
                                        <i className="fas fa-check-circle" style={{ color: '#2d7543' }} />
                                    ) : (
                                        <i className="fas fa-times-circle" />
                                    )}
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
