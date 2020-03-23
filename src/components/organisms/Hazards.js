import Text from "../atoms/Text";
import Box from "@material-ui/core/Box";
import RemoteAutocomplete from "../molecules/RemoteAutocomplete";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getHazards, getHazardsTaxonomy} from "../../redux/selectors/mainSelectors";
import styled from "styled-components";
import {addHazard, editHazard, removeHazard} from "../../redux/actions/mainActions";
import {TextField} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

const Hazard = styled.div`
    border: 1px solid #bda878;
    border-radius: 3px;
    padding: 4px;
    background: #f5f2ee;
    margin-right: 4px;
`;

const Hazards = ({ incident }) => {
    const dispatch = useDispatch();

    const hazards = useSelector(getHazards);
    const hazardsTaxonomy = useSelector(getHazardsTaxonomy);

    const [newHazard, setNewHazard] = useState();

    const addNewHazard = () => {
        const hazard = {original: newHazard, foodakai: null};
        dispatch(addHazard(hazard, incident.id));
        setNewHazard('');
    };
    const handleEditHazard = (incident_id, hazard, foodakaiMapping) => {
        const selectedIndex = hazards[incident_id].findIndex(hz => hz.original === hazard.original);
        if ( selectedIndex !== -1 ) {
            hazards[incident_id][selectedIndex].foodakai = foodakaiMapping;
            dispatch(editHazard(selectedIndex, hazards[incident_id][selectedIndex], incident_id));
        } else {
            alert('could not find hazard in incident');
        }
    };
    const handleRemoveHazard = (incident_id, hazard) => {
        dispatch(removeHazard(hazard, incident_id));
    };
    const filterHazardsAutocomplete = (inputText) => {
        const inputValue = inputText.trim().toLowerCase();
        const inputLength = inputValue.length;

        var reg = new RegExp(inputValue.split('').join('\\w*').replace(/\W/, ""), 'i');
        const results = inputLength === 0 ? [] : hazardsTaxonomy.filter(hz =>
            hz.name.match(reg)
        );

        return ({
            hits: {
                hits: results.sort((a, b) => (a.name.length < b.name.length ? -1 : 1)).map(res => (
                    {
                        ['_source']: {
                            title: res.name,
                            parents: res.parents
                        }
                    }
                ))
            }
        });
    };
    return (
        <>
            <Text>
                <b>Hazards:</b>
            </Text>
            <Text>
                {hazards[incident.id] &&
                    hazards[incident.id].map((hazard, index) => (
                        <Hazard key={index}>
                            <i className="fas fa-times" style={{
                                cursor: 'pointer',
                                position: 'relative',
                                top: '-3px',
                                right: '-3px',
                                float: 'right',
                                background: '#f9f9f9',
                                padding: '1px 3px'
                            }} onClick={() => handleRemoveHazard(incident.id, hazard)}/>
                            <Text inline mr={'2px'} style={{
                                position: 'relative',
                                top: '3px'
                            }}>{hazard.original}</Text>
                            <Box display={'inline-block'}>
                                <RemoteAutocomplete
                                    hasHierarchy
                                    noWait
                                    key={'product' + incident.id + index}
                                    variant={'outlined'}
                                    onSelect={(value) => handleEditHazard(incident.id, hazard, value ? value.name : null)}
                                    asyncFetchFunction={filterHazardsAutocomplete}
                                    placeholder={hazard.foodakai ? hazard.foodakai : 'Find hazard'}
                                />
                            </Box>
                        </Hazard>
                    ))
                }
            </Text>
            <Grid container>
                <Grid item xs={10}>
                    <TextField value={newHazard} onChange={(event) => setNewHazard(event.target.value)} />
                </Grid>
                <Grid item xs={2}>
                    <button onClick={addNewHazard} style={{
                        borderRadius: '3px',
                        float: 'right',
                        marginRight: '4px',
                        marginTop: '3px',
                        background: 'rgb(246, 242, 239)'
                    }}><i className="fas fa-plus"></i></button>
                </Grid>
            </Grid>
        </>
    );
};

export default Hazards;
