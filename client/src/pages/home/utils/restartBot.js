import axios from "axios";
import API_URL from '../../../config.js'

async function restartBot() {
    try{
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${API_URL}/action/startBot`,
            headers: { 
              'Content-Type': 'application/json',
              'authorization': "Bearer " + localStorage.getItem("token")
            },
        };
        
        const res = await axios.request(config);
        return res.data
    } catch(error){
        console.log(error)
    }
}

export default restartBot;