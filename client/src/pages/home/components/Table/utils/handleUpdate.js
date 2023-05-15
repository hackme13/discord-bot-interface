import axios from "axios";
import API_URL from '../../../../../config.js'

async function handleUpdate(_id) {
    try{
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${API_URL}/action/editChannel`,
            headers: { 
              'Content-Type': 'application/json',
              'authorization': "Bearer " + localStorage.getItem("token")
            },
            data: {}
        };
        
        const res = await axios.request(config);
        if (!res) return
        return res.data
    } catch(error){
        console.log(error)
    }
}

export default handleUpdate;