import React, { useState, useRef, useEffect } from 'react';

import { Button, Table, Input, Popconfirm, Message} from '@arco-design/web-react';
import { IconSearch, IconArrowDown, IconArrowRight } from '@arco-design/web-react/icon';

import { useQuery, useMutation, useQueryClient } from "react-query"
import getChannels from './utils/getChannels';
import handleRemove from './utils/handleRemove';
import AddUserForm from '../../addUserForm';

const DataTable = ({setStatisticsData}) => {
    // Get QueryClient from the context
    const queryClient = useQueryClient()

    const deleteChannelMutation = useMutation(handleRemove, {
        onSuccess: () => {
            queryClient.invalidateQueries("getChannels")
          },
    })

    const inputRef = useRef(null);
    const [data, setData] = useState([]);

    const columns = [
        {
            title: 'Sender Server',
            dataIndex: 'sender_server',
            filterIcon: <IconSearch />,
            filterDropdown: ({ filterKeys, setFilterKeys, confirm }) => {
            return (
                <div className='arco-table-custom-filter'>
                <Input.Search
                    ref={inputRef}
                    searchButton
                    placeholder='Please enter name'
                    value={filterKeys[0] || ''}
                    onChange={(value) => {
                    setFilterKeys(value ? [value] : []);
                    }}
                    onSearch={() => {
                    confirm();
                    }}
                />
                </div>
            );
            },
            onFilter: (value, row) => (value ? row.sender_server.indexOf(value) !== -1 : true),
            onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => inputRef.current.focus(), 150);
            }
            }
        },
        {
            title: "Chhanel ID",
            dataIndex: "sender_channel_id"
        },
        {
            title: 'Sender Channel',
            dataIndex: 'sender_channel'
        },
        {
            title: 'Receiver Server',
            dataIndex: 'receiver_server',
        },

        {
            title: 'Receiver Channel',
            dataIndex: 'receiver_channel'
        },
        {
            title: "Last Updated",
            dataIndex: 'last_updated'
        },
        {
            title: 'Actions',
            dataIndex: 'op',
            render: (_, record) => (
                <div style={{width: 200}}>
                {/* <Button
                    onClick={() => editRow(record)}
                    type='primary'
                    className="me-2"
                    status='primary'
                > Edit </Button> */}
                <Popconfirm
                title='Are you sure you want to delete?'
                onOk={() => removeRow(record.key)}
                onCancel={() => {
                    Message.error({
                        content: 'Delete cancelled.',
                    });
                }}
                okText='Delete'
                cancelText='Cancel'
                focusLock
                position='bottom'>
                    <Button type='primary' status='danger' style={{ marginRight: 20 }}>
                    Delete
                    </Button>
                </Popconfirm>
                </div>
            )
        }
    ];

    const { isSuccess: channelFetchSuccess, data: channelsList } = useQuery('getChannels', getChannels)

    useEffect(() => {
        if (channelFetchSuccess && channelsList.length > 0){
            const newArray = channelsList.map(obj => ({
                key: obj._id,
                sender_server: obj.senderServerName,
                sender_channel_id: obj.senderChannelId,
                sender_channel: obj.senderChannelName,
                receiver_server: obj.receiverServerName,
                receiver_channel: obj.receiverChannelName,
                last_updated: new Date(obj.updatedAt).toLocaleDateString(),
                receiver_webhook: obj.receiverChannelWebhook
              }));
            setData(newArray)
            setStatisticsData(newArray)
        }
    }, [channelFetchSuccess, channelsList, setStatisticsData])

    async function removeRow(key) {
        deleteChannelMutation.mutate(key)
    }

    return (
        <div 
        style={{width: '100%'}}
        className='data-table'>
        
        {/* add user form */}
        <AddUserForm />

        <Table
            style={{width: '100%'}}
            data={data}
            columns={columns}
            expandedRowRender={(record) => record.receiver_webhook}
            expandProps={{
                expandRowByClick: true,
                icon: ({ expanded, record, ...restProps }) =>
                expanded ? (
                    <button {...restProps}>
                    <IconArrowDown />
                    </button>
                ) : (
                    <button {...restProps}>
                    <IconArrowRight />
                    </button>
                ),
                width: 60,
                columnTitle: 'Expand',
                rowExpandable: (record) => record.key !== '4',
            }}
            className='table-demo-editable-cell'
        />
        </div>
    );
}
  
export default DataTable;
  