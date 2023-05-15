import axios from "axios";
import API_URL from '../../../../config.js'

async function handleAddPing(channelId, role) {
    try{
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${API_URL}/action/addPing`,
            headers: { 
              'Content-Type': 'application/json',
              'authorization': "Bearer " + localStorage.getItem("token")
            },
            data: { channelId, role }
        };
        
        const res = await axios.request(config);
        return res.data
    } catch(error){
        console.log(error)
    }
}

export default handleAddPing;;