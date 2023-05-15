import axios from "axios";
import API_URL from '../../../../config.js'

async function handleRemoveKeyword(keyword, type) {
    try{
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${API_URL}/action/deleteKeyword`,
            headers: { 
              'Content-Type': 'application/json',
              'authorization': "Bearer " + localStorage.getItem("token")
            },
            data: { keyword, type }
        };
        
        const res = await axios.request(config);
        return res.data
    } catch(error){
        console.log(error)
    }
}

export default handleRemoveKeyword;;