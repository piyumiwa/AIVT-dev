
const axios = require('axios');
// const pool = require('../config/database');


async function fetchCVEData(cveId) {
    try {
        const response = await axios.get(`https://cveawg.mitre.org/api/cve/${cveId}`);
        console.log(response.data.containers.cna.references);
        // console.log('Description: ', response.data.containers.cna.descriptions);
        // console.log('Descriptions: ', response.data.containers.cna.descriptions.map(desc => desc.value));
    } catch (error) {
        console.error("Error fetching CVE data from MITRE:", error);
    }    
}

fetchCVEData("CVE-2025-24666");


