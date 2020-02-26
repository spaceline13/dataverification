import Hazard from '../models/hazard';
import fetch from "node-fetch";

export function addHazards(array, page) {
    const hazards = array.map(hazard => new Hazard({ name: hazard }));
    return Hazard.insertMany(hazards).then(() =>  console.log('hazards added page: ', page)).catch(error => console.log(error));
}

export function eraseHazards() {
    return Hazard.remove({}).then(deleted => console.log(deleted)).catch(error => console.log(error));
}

export function getHazards(req, res) {
    return Hazard.find()
        .select('name')
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
    const API_KEY = 'db6a04e9-5df3-3f23-8f2a-28b81d1e3aa8';
    const body = {
        apikey: API_KEY,
        pageSize: 100,
        detail: false,
        page,
        entityType: 'hazard'
    };

    const response = await fetch('http://api.foodakai.com/search-api-1.0/search/', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    const json = await response.json();

    const hazards = json.hits.hits.map(item => item._source.title);
    addHazards(hazards, page);
    if (hazards && hazards.length > 0) {
        const currPage = ++page;
        setTimeout(() => { fetchHazardsFromPlatformToMongo(currPage) }, 1000);
    }
};
