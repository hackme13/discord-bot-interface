import axios from "axios";
import API_URL from '../../../../../config.js'

async function getChannels() {
    try{
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${API_URL}/action/channels`,
            headers: { 
              'Content-Type': 'application/json',
              'authorization': "Bearer " + localStorage.getItem("token")
            },
        };
        
        const res = await axios.request(config);
        if (!res) return
        return res.data
    } catch(error){
        console.log(error)
    }
}

export default getChannels;