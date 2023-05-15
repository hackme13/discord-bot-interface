import "./statistics.css"

const Statistics = ({statisticsData}) => {
    // Connection (number of objects)
    const connectionCount = statisticsData.length;

    // Sender (number of unique sender id)
    const uniqueSenders = [...new Set(statisticsData.map(obj => obj.sender_channel_id))];
    const senderCount = uniqueSenders.length;

    // Webhook (number of unique webhook)
    const uniqueWebhooks = [...new Set(statisticsData.map(obj => obj.receiver_webhook))];
    const webhookCount = uniqueWebhooks.length;

    return(
        <>
        <div className="parent-div-statistics">
            {/* unique connections */}
            <div className="card">
                <div className="left">
                    <div className="icon connections">
                        <i className="bi bi-discord"></i>
                    </div>
                </div>
                <div className="right">
                    <div className="number">{connectionCount}</div>
                    <div className="title text-muted">Connections</div>
                </div>
            </div>

            {/* sender card */}
            <div className="card">
                <div className="left">
                    <div className="icon sender">
                        <i className="bi bi-robot"></i>
                    </div>
                </div>
                <div className="right">
                    <div className="number">{senderCount}</div>
                    <div className="title text-muted">Sender</div>
                </div>
            </div>

            {/* receiver card */}
            <div className="card">
                <div className="left">
                    <div className="icon receiver">
                        <i className="bi bi-chat-left-text"></i>
                    </div>
                </div>
                <div className="right">
                    <div className="number">{webhookCount}</div>
                    <div className="title text-muted">Receiver</div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Statistics;