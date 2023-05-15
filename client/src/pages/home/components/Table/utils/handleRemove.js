import axios from "axios";
import API_URL from '../../../../../config.js'

async function handleRemove(_id) {
    try{
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${API_URL}/action/deleteChannel`,
            headers: { 
              'Content-Type': 'application/json',
              'authorization': "Bearer " + localStorage.getItem("token")
            },
            data: { _id }
        };
        
        const res = await axios.request(config);
        if (!res) return false
        return true
    } catch(error){
        console.log(error)
    }
}

export default handleRemove;;