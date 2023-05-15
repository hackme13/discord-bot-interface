import axios from "axios";
import API_URL from '../../../../config.js'

async function handleAddKeyword(keyword) {
    try{
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${API_URL}/action/addKeywords`,
            headers: { 
              'Content-Type': 'application/json',
              'authorization': "Bearer " + localStorage.getItem("token")
            },
            data: keyword
        };
        
        const res = await axios.request(config);
        return res.data
    } catch(error){
        console.log(error)
    }
}

export default handleAddKeyword;;