import { Modal, Spin, Button, Form, Input, Message, Notification } from '@arco-design/web-react';
import { useState } from 'react';
import axios from 'axios';
import "./home.route.css";
import { useQueryClient } from 'react-query';

import API_URL from '../../config';

const FormItem = Form.Item;

const AddUserForm = () => {
    const queryClient = useQueryClient();

    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();

    function validateForm() {
        form.validate()
        .then(async (res) => {
            let {
                sender_server,
                sender_channel_id,
                sender_channel,
                receiver_server,
                receiver_channel,
                receiver_webhook
            } = form.getFieldsValue(["sender_server", "sender_channel_id", "sender_channel", "receiver_server", "receiver_channel", "receiver_webhook"]);

            if (
                !sender_server ||
                !sender_channel_id ||
                !sender_channel ||
                !receiver_server ||
                !receiver_channel ||
                !receiver_webhook
            ) {
                setVisible(true)
                setConfirmLoading(false);
                Message.error("Please enter all the fields")
            }

            const addAccount = {
                senderServerName: sender_server,
                senderChannelId: sender_channel_id,
                senderChannelName: sender_channel,
                receiverServerName: receiver_server,
                receiverChannelName: receiver_channel,
                receiverChannelWebhook: receiver_webhook
            };
            
            const addAccountRes = await axios.request({
                method: 'post',
                maxBodyLength: Infinity,
                url: `${API_URL}/action/addChannel`,
                headers: { 
                    "authorization": "Bearer " + localStorage.getItem("token")
                },
                data: addAccount
            })

            if (addAccountRes.status === 201 || addAccountRes.status === 200){
                queryClient.invalidateQueries(['getChannels'], { force: true });

                Notification.success({
                    title: 'Success',
                    content: 'Account added Successfully!',
                })
                    
                form.resetFields()
                setVisible(false);
                setConfirmLoading(false);
            }

        })
        .catch((error) => { 
            if (error.response && error.response.status === 409) {
                Notification.warning({
                    title: 'Warning',
                    content: 'Account with that BOID already exists!',
                })
            } else {
                Notification.error({
                    title: 'Error',
                    content: 'Failed to add account',
                })
            }

            setConfirmLoading(false);
        })
    }

    const formItemLayout = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 20,
        },
    };

    return(
        <>
        <Button 
        className="add-accounts-btn mb-3" 
        onClick={() => {
            setVisible(true)
        }} 
        type='primary'>
            <i className="bi bi-plus-circle"></i> Add Chat
        </Button>
        <Modal
        title='Add User'
        style={{width: 600}}
        visible={visible}
        confirmLoading={confirmLoading}
        onCancel={() => {
            setConfirmLoading(false);
            setVisible(false);
            form.resetFields()
        }}
        footer={
            <>
                <Button
                onClick={() => {
                    form.resetFields()
                }}> Reset </Button>

                <Button
                type='primary'
                onClick={() => {
                    setConfirmLoading(true);
                    validateForm()
                    }}> Submit </Button>
            </>
        }>
            <Spin delay={500} size={30} tip='This may take a while...' loading={confirmLoading}>
            <Form
            {...formItemLayout}
            form={form}
            labelCol={{
                style: { flexBasis: 150 },
            }}
            wrapperCol={{
                style: { flexBasis: 'calc(100% - 150px)' },
            }}>
                <FormItem label='S. Server Name' field='sender_server' rules={[{ type: 'string', required: true }]}>
                    <Input placeholder='Enter sender server name' />
                </FormItem>

                <FormItem label='S. Channel Name' field='sender_channel' rules={[{ type: 'string', required: true,}]}>
                    <Input placeholder='Enter sender channel name' />
                </FormItem>

                <FormItem label='S. Channel ID' field='sender_channel_id' rules={[{ type: 'string', required: true,}]}>
                    <Input placeholder='Enter sender channel ID' />
                </FormItem>

                {/* for channel section */}
                <FormItem label='R. Server Name' field='receiver_server' rules={[{ type: 'string', required: true }]}>
                    <Input placeholder='Enter receiver server name' />
                </FormItem>

                <FormItem label='R. Channel Name' field='receiver_channel' rules={[{ type: 'string', required: true }]}>
                    <Input placeholder='Enter receiver channel name' />
                </FormItem>

                <FormItem label='R. Webhook' field='receiver_webhook' rules={[{ type: 'string', required: true,}]}>
                    <Input placeholder='Enter receiver webhook URL' />
                </FormItem>

            </Form>
            </Spin>
        </Modal>
        </>
    )
}

export default AddUserForm;