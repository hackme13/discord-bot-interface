//import styles
import "./home.route.css"
import Statistics from './components/Statistics/Statistics.jsx';
import DataTable from './components/Table/Table';
import AddKeywordsForm from "./components/Keywords/addKeywords";
import AddDiscordToken from "./addDiscordToken";
import { useState } from "react";

import { Button, Notification } from '@arco-design/web-react';
import restartBot from "./utils/restartBot";
import AddPingsForm from "./components/Pings/addPings";

async function handleRestartBot() {
    const res = await restartBot();
    if (res && res.success){
        return Notification.success({
            title: "Success",
            content: "Bot restarted successfully"
        })
    }

    return Notification.error({
        title: "Failed",
        content: `${res.message}`
    })
}

const Home = () => {
    const [statisticsData, setStatisticsData] = useState([])
    return (
        <div className="home">
        <label htmlFor="#" className="content-header">Dashboard</label>

        <div className="content">
            <div className="statistics">
                <Statistics statisticsData={statisticsData} />
            </div>

            <label 
            htmlFor="#" 
            className="content-header" 
            style={{margin: "30px 0 0 0", fontSize: "20px"}}>
                Actions
            </label>

            <div className="keywords action-btns mt-3">
                <AddKeywordsForm />
                <AddDiscordToken />
                <AddPingsForm />
                <Button 
                className="add-accounts-btn mb-3" 
                onClick={() => {
                    handleRestartBot()
                }} 
                type='primary'>
                    <i className="bi bi-arrow-clockwise"></i> Restart Bot
                </Button>
            </div>

            <label 
            htmlFor="#" 
            className="content-header" 
            style={{margin: "20px 0 0 0", fontSize: "18px"}}>
                Mirror Chats
            </label>
            
            <div className="data-table mt-3">
                <DataTable setStatisticsData={setStatisticsData} />
            </div>
        </div>
        </div>
    )
}

export default Home;