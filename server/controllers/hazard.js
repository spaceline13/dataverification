import Hazard from '../models/hazard';
import fetch from "node-fetch";

export function addHazards(array, page) {
    const hazards = array.map(hazard => new Hazard(hazard));
    return Hazard.insertMany(hazards).then(() => {/* console.log('hazards added page: ', page)*/}).catch(error => console.log(error));
}

export function eraseHazards() {
    return Hazard.remove({}).then(deleted => console.log(deleted)).catch(error => console.log(error));
}

export function getHazards(req, res) {
    return Hazard.find()
        .select('name parents synonyms')
        .then(allHazards => {
            return res.status(200).json({
                success: true,
                message: 'A list of all hazards',
                hazards: allHazards,
            });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: 'Server error. Please try again.',
                error: err.message,
            });
        });
}

export const fetchHazardsFromPlatformToMongo = async (page = 0) => {

    const response = await fetch('http://148.251.22.254:8080/nlp-api-1.0/export/term/json?vocabulary=fdk_hazards', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const json = await response.json();

    const hazards = json.map(item => ({ name: item.label, parents: item.parent, synonyms: item.synonym }));
    addHazards(hazards, page);

    // PAGING FOR SEARCH API< ANNOTATION API DONT USE IT
    /*if (hazards && hazards.length > 0) {
        const currPage = ++page;
        setTimeout(() => { fetchHazardsFromPlatformToMongo(currPage) }, 1000);
    } else {
        console.log('added ', page, ' pages of ', pageSize, ' hazards');
    }*/
};
