import { Modal, Spin, Button, Form, Input, Notification } from '@arco-design/web-react';
import { useEffect, useState } from 'react';

import getToken from './utils/getToken';
import saveToken from './utils/saveToken';
import updateToken from './utils/updateToken';

const FormItem = Form.Item;

const AddDiscordToken = () => {
    const [tokenData, setTokenData] = useState({});
    const [prevToken, setPrevToken] = useState("");

    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();

    async function getInitialToken() {
        const resGetInitialToken = await getToken();
        setPrevToken(resGetInitialToken.token)
    };

    useEffect(() => {
        getInitialToken();
    }, [prevToken])

    async function handleToken() {        
        // search for token
        const resGetToken = await getToken();

        setConfirmLoading(false)

        if (!resGetToken.success){
            return Notification.error({
                title: "Failed",
                content: "Something went wrong"
            })
        }
        
        // if no token found -> save a new token
        if (!resGetToken.token) {
            const resSaveToken = await saveToken(tokenData.new_token);
            if (resSaveToken.success){
                return Notification.success({
                    title: "Success",
                    content: "Token saved successfully"
                })
            } else {
                return Notification.error({
                    title: "Failed",
                    content: "Failed to save token"
                })
            }
        }
        
        // if yes token found -> update prev token with new token
        if (resGetToken.token) {
            const resUpdateToken = await updateToken(resGetToken.token, tokenData.new_token);

            if (!resUpdateToken) {
                return Notification.error({
                    title: "Failed",
                    content: `Failed to update token.\nError: ${resUpdateToken.message}`
                })
            }
            if (resUpdateToken.success){
                return Notification.success({
                    title: "Success",
                    content: "Token saved successfully"
                })
            } else {
                return Notification.error({
                    title: "Failed",
                    content: `Failed to update token.\nError: ${resUpdateToken.message}`
                })
            }

        }
    }

    const formItemLayout = {
        labelCol: {
          span: 7,
        },
        wrapperCol: {
          span: 15,
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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plugin" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1 8a7 7 0 1 1 2.898 5.673c-.167-.121-.216-.406-.002-.62l1.8-1.8a3.5 3.5 0 0 0 4.572-.328l1.414-1.415a.5.5 0 0 0 0-.707l-.707-.707 1.559-1.563a.5.5 0 1 0-.708-.706l-1.559 1.562-1.414-1.414 1.56-1.562a.5.5 0 1 0-.707-.706l-1.56 1.56-.707-.706a.5.5 0 0 0-.707 0L5.318 5.975a3.5 3.5 0 0 0-.328 4.571l-1.8 1.8c-.58.58-.62 1.6.121 2.137A8 8 0 1 0 0 8a.5.5 0 0 0 1 0Z"/>
            </svg> Manage Token
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
                onClick={async() => {
                    setConfirmLoading(true);
                    await handleToken()
                }}> Submit </Button>
            </>
        }>
            <Spin delay={500} size={30} tip='This may take a while...' loading={confirmLoading}>
            <Form
            form={form}
            {...formItemLayout}
            style={{ width: "100%" }}
            initialValues={{ previous_token: '' }}
            autoComplete='off'
            onValuesChange={(v, vs) => {
                setTokenData(v)
            }}
            >
            <FormItem 
            initialValue={prevToken}
            label='Previous Token' 
            field='previous_token' 
            rules={[{ required: true }]}>
                <Input disabled/>
            </FormItem>
            <FormItem
                label='New Token'
                field='new_token'
                rules={[{ required: true, type: 'string' }]}
            >
                <Input placeholder='Enter your new token' />
            </FormItem>
            </Form>
            </Spin>
        </Modal>
        </>
    )
}

export default AddDiscordToken;