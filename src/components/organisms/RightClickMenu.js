import React from 'react';
import { Menu, Item } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';
import { useDispatch } from "react-redux";
import {
    addHazard,
    addProduct,
    setDescriptions,
    replaceHazards,
    replaceProducts,
    setTitles
} from "../../redux/actions/mainActions";

const getSelectedText = () => {
    if (window.getSelection) {
        return window.getSelection().toString();
    } else if (document.selection) {
        return document.selection.createRange().text;
    }
    return '';
};

const getIncidentID = element => {
    return element.offsetParent.dataset.id;
};
const getIncidentField = element => {
    return element.offsetParent.dataset.field;
};

const findSubText = (element, selected) => {
    // current element text
    const current = element.textContent;
    // previous element text
    const prev = element.previousElementSibling ? element.previousElementSibling.previousElementSibling.textContent : '';
    // next element text
    const next = element.nextElementSibling ? element.nextElementSibling.nextElementSibling.textContent : '';
    // the sub area of the text that contains the selected text. (the selected may be contained in more than one fragment (ex. current + next) that's why we create the subText
    let subText;
    if (current.indexOf(selected) !== -1) {
        subText = current;
    } else if ((prev + ' ' + current).indexOf(selected) !== -1) {
        subText = prev + ' ' + current;
    } else if ((current + ' ' + next).indexOf(selected) !== -1) {
        subText = current + ' ' + next;
    }
    return subText;
};

const formatSubText = (subText, selected, tag) => {
    const formatted = subText.replace(selected, '<' + tag + '>' + selected + '</' + tag + '>');
    return formatted;
};

const getInfoForIncident = (event, tag) => {
    const element = event.target;
    // selected word or phrase
    const selected = getSelectedText().replace('\n', ' ');
    // incident id
    const incident_id = getIncidentID(element);

    // format the text for annotations tracking
    const field = getIncidentField(element);
    const subText = findSubText(element, selected);
    const formatted = formatSubText(subText, selected, tag);

    return { selected, incident_id, field, subText, formatted };
};

// create your menu first
const RightClickMenu = () => {
    const dispatch = useDispatch();
    const handleAddProduct = ({ event }) => {
        // do all the staff needed to get the bellow info
        const { selected, incident_id, field, subText, formatted } = getInfoForIncident(event, 'product');

        if (incident_id) {
            // set the new products object to redux store
            const product = {original: selected, foodakai: null};
            dispatch(addProduct(product, incident_id));

            // set the annotations to redux store
            if (field === 'title') {
                dispatch(setTitles(incident_id, subText, formatted));
            } else if (field === 'description') {
                dispatch(setDescriptions(incident_id, subText, formatted));
            }
        }
    };
    const handleReplaceProducts = ({ event }) => {
        // comments same as above
        const { selected, incident_id, field, subText, formatted } = getInfoForIncident(event, 'product');

        if (incident_id) {
            if (field === 'title') {
                dispatch(setTitles(incident_id, subText, formatted));
            } else if (field === 'description') {
                dispatch(setDescriptions(incident_id, subText, formatted));
            }

            const product = {original: selected, foodakai: null};
            dispatch(replaceProducts([product], incident_id));
        }
    };
    const handleAddHazard = ({ event }) => {
        // comments same as above
        const { selected, incident_id, field, subText, formatted } = getInfoForIncident(event, 'hazard');

        if (incident_id) {
            const hazard = {original: selected, foodakai: null};
            dispatch(addHazard(hazard, incident_id));

            if (field === 'title') {
                dispatch(setTitles(incident_id, subText, formatted));
            } else if (field === 'description') {
                dispatch(setDescriptions(incident_id, subText, formatted));
            }
        }
    };
    const handleReplaceHazards = ({ event }) => {
        // comments same as above
        const { selected, incident_id, field, subText, formatted } = getInfoForIncident(event, 'hazard');

        if (incident_id) {
            if (field === 'title') {
                dispatch(setTitles(incident_id, subText, formatted));
            } else if (field === 'description') {
                dispatch(setDescriptions(incident_id, subText, formatted));
            }

            const hazard = {original: selected, foodakai: null};

            dispatch(replaceHazards([hazard], incident_id));
        }
    };
    return (
        <Menu id="menu_id">
            <Item onClick={handleAddProduct}>add to products</Item>
            <Item onClick={handleReplaceProducts}>replace products</Item>
            <Item onClick={handleAddHazard}>add to hazards</Item>
            <Item onClick={handleReplaceHazards}>replace hazards</Item>
        </Menu>
    );
};

export default RightClickMenu;
