import { Modal, Spin, Button, Notification, Divider, Tag } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { IconDelete } from '@arco-design/web-react/icon';

import "./addPings.css"
import handleAddPing from './addPing';
import handleRemovePing from './deletePing';
import getPings from './getPing';

const AddPingsForm = () => {
    const queryClient = useQueryClient();

    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [channelId, setChannelId] = useState("");
    const [role, setRole] = useState("");

    const [data, setData] = useState({})

    async function addPings() {
        const resAdd = await handleAddPing(channelId, role);
        
        if (resAdd && resAdd.success){
            queryClient.invalidateQueries("getPings")

            // updating form state
            setChannelId("")
            setRole("")

            Notification.success({
                title: "Success",
                content: `Ping added successfully`
            })
        } else {
            Notification.error({
                title: "Failed",
                content: `${resAdd? resAdd.message: "Something went wrong"}`
            })
        }
    }

    async function handleDeletePing(channelId) {
        const res = await handleRemovePing(channelId);
        if (res && res.success){
            queryClient.invalidateQueries("getPings")
            Notification.success({
                title: "Success",
                content: `Ping for channel ${channelId} deleted successfully`
            })
        } else {
            Notification.error({
                title: "Failed",
                content: `${res? res.message: "Something went wrong"}`
            })
        }
    }

    const { isSuccess: pingFetchSuccess, data: PingsList } = useQuery('getPings', getPings)

    useEffect(() => {
        if (pingFetchSuccess && PingsList.length > 0){
            const newPingsList = {};

            PingsList.forEach((ping) => {
                const _channelId = ping.channelId;
                const _role = ping.role;
                newPingsList[_channelId] = _role;
            })

            setData(newPingsList)
        }
        
    }, [pingFetchSuccess, PingsList])

    return(
        <div className='keywords-container'>
        <Button 
        className="add-accounts-btn mb-3" 
        onClick={() => {
            setVisible(true)
        }} 
        type='primary'>
            <i className="bi bi-plus-circle"></i> Add Pings
        </Button>
        <Modal
        title='Manage Pings'
        style={{width: 650, maxHeight: 700}}
        visible={visible}
        confirmLoading={confirmLoading}
        onCancel={() => {
            setConfirmLoading(false);
            setVisible(false);
        }}
        footer={
            <>
                <Button
                type='secondary'
                onClick={() => {
                    setChannelId("")
                    setRole("")
                    }}> Close </Button>
            </>
        }>
            <Spin delay={500} size={30} tip='This may take a while...' loading={confirmLoading}>
                <div className="keywords-wrapper">
                    <label htmlFor="#" className='add-keywords-label'>Add Pings</label>
                    <div className="add-keyword">
                        <input 
                        type="text" 
                        value={channelId}
                        onChange={(e) => setChannelId(e.target.value)}
                        placeholder='Enter Channel ID'
                        />

                        <input 
                        className='ping_role'
                        type="text" 
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder='Enter Role'
                        />

                        <Button type='primary px-4' onClick={addPings}>Add Ping</Button>
                    </div>
                    <Divider />
                    <div className="list-keywords">
                        <div className="pings">
                        <label htmlFor="#" className='keywords-label'>Pings</label>
                        {
                            (Object.entries(data).length > 0) ? (
                                Object.entries(data).map(([key, value]) => {
                                    return(
                                        <div className='keyword-item' key={`${key}+${value}`}>
                                            {value === "@everyone" ? (
                                                <span>{key}  :  <Tag color='#00b42a'>{value}</Tag></span>
                                            ) : (
                                                <span>{key}  :  <Tag>{value}</Tag></span>
                                            ) }
                                            <Button
                                            type='primary'
                                            status='danger'
                                            onClick={
                                                () => handleDeletePing(key)
                                            }><IconDelete /></Button>
                                        </div>
                                    )
                                })
                            ) : (
                                <></>
                            )
                        }
                        </div>
                    </div>
                </div>
            </Spin>
        </Modal>
        </div>
    )
}

export default AddPingsForm;