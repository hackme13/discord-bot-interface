import axios from "axios";
import API_URL from '../../../config.js'

async function updateToken(existingToken, newToken) {
    try{
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${API_URL}/token/updateToken`,
            headers: { 
              'Content-Type': 'application/json',
              'authorization': "Bearer " + localStorage.getItem("token")
            },
            data: { existingToken, newToken }
        };
        
        const res = await axios.request(config);
        return res.data
    } catch(error){
        console.log(error)
    }
}

export default updateToken;