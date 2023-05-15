import axios from "axios";
import API_URL from '../../../config.js'

async function saveToken(token) {
    try{
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${API_URL}/token/saveToken`,
            headers: { 
              'Content-Type': 'application/json',
              'authorization': "Bearer " + localStorage.getItem("token")
            },
            data: { token }
        };
        
        const res = await axios.request(config);
        return res.data
    } catch(error){
        console.log(error)
    }
}

export default saveToken;