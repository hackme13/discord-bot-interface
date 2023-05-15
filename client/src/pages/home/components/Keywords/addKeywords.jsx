import { Modal, Spin, Button, Notification, Divider, Tooltip } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { IconDelete } from '@arco-design/web-react/icon';

import "./addKeywords.css"
import getKeywords from './getKeywords.js';
import handleRemoveKeyword from './deleteKeyword.js';
import handleAddKeyword from './addKeyword.js';

const AddKeywordsForm = () => {
    const queryClient = useQueryClient();

    const [replacementsList, setReplacementsList] = useState([""]);
    const [blacklistList, setBlacklistList] = useState([""]);
    const [blacklistembedList, setBlacklistembedList] = useState([""]);

    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [replacement, setReplacement] = useState("");
    const [blacklist, setBlacklist] = useState("");
    const [blacklistembed, setBlacklistembed] = useState("");

    async function addKeywords() {
        const inputObject = {
            replacement,
            blacklist,
            blacklistembed
        }

        const replacementKey = inputObject.replacement.split(":")[0];
        const replacementValue = inputObject.replacement.split(":")[1]

        const transformedObject = {
            replacements: {
                [replacementKey]: replacementValue
            },
            blacklist: !inputObject.blacklist? [] : [inputObject.blacklist],
            blacklistembed: !inputObject.blacklistembed? [] : [inputObject.blacklistembed]
        };

        const existingObject = {
            replacements: replacementsList,
            blacklist: blacklistList,
            blacklistembed: blacklistembedList
        }

        const mergedObject = {
            ...existingObject,
            replacements: {
              ...existingObject.replacements,
              ...transformedObject.replacements
            },
            blacklist: [...existingObject.blacklist.concat(transformedObject.blacklist)],
            blacklistembed: [...existingObject.blacklistembed.concat(transformedObject.blacklistembed)]
        };

        const resAdd = await handleAddKeyword(mergedObject);
        
        if (resAdd && resAdd.success){
            queryClient.invalidateQueries("getKeywords")

            // updating form state
            setReplacement("")
            setBlacklist("")
            setBlacklistembed("")

            Notification.success({
                title: "Success",
                content: `Keywords updated successfully`
            })
        } else {
            Notification.error({
                title: "Failed",
                content: `${resAdd? resAdd.message: "Something went wrong"}`
            })
        }
          
    }

    async function handleDeleteKeyword(word, type) {
        const res = await handleRemoveKeyword(word, type);
        if (res && res.success){
            queryClient.invalidateQueries("getKeywords")
            Notification.success({
                title: "Success",
                content: `Keyword ${word} deleted successfully`
            })
        } else {
            Notification.error({
                title: "Failed",
                content: `${res? res.message: "Something went wrong"}`
            })
        }
    }

    const { isSuccess: keywordFetchSuccess, data: keywordsList } = useQuery('getKeywords', getKeywords)

    useEffect(() => {
        if (keywordFetchSuccess && keywordsList.length > 0){
            setReplacementsList(keywordsList[0].replacements)
            setBlacklistList(keywordsList[0].blacklist)
            setBlacklistembedList(keywordsList[0].blacklistembed)
        }
        
    }, [keywordFetchSuccess, keywordsList])

    return(
        <div className='keywords-container'>
        <Button 
        className="add-accounts-btn mb-3" 
        onClick={() => {
            setVisible(true)
        }} 
        type='primary'>
            <i className="bi bi-plus-circle"></i> Add Keywords
        </Button>
        <Modal
        title='Manage Keywords'
        style={{width: 770, maxHeight: 700}}
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
                    setReplacement("")
                    setBlacklist("")
                    setBlacklistembed("")
                    setVisible(false);
                    }}> Close </Button>
            </>
        }>
            <Spin delay={500} size={30} tip='This may take a while...' loading={confirmLoading}>
                <div className="keywords-wrapper">
                    <label htmlFor="#" className='add-keywords-label'>Add Keywords</label>
                    <div className="add-keyword">
                        <Tooltip mini content='Format => word:replacement'>
                            <input 
                            type="text" 
                            value={replacement}
                            onChange={(e) => setReplacement(e.target.value)}
                            placeholder='Enter Replacement'
                            />
                        </Tooltip>

                        <input 
                        type="text" 
                        value={blacklist}
                        onChange={(e) => setBlacklist(e.target.value)}
                        placeholder='Enter Blacklist'
                        />

                        <input 
                        type="text" 
                        value={blacklistembed}
                        onChange={(e) => setBlacklistembed(e.target.value)}
                        placeholder='Enter Blacklistembed'
                        />

                        <Button type='primary' onClick={addKeywords}>Add</Button>
                    </div>
                    <Divider />
                    <div className="list-keywords">
                        <div className="replacements">
                        <label htmlFor="#" className='keywords-label'>Replacements</label>
                        {
                            Object.entries(replacementsList).map(([key, value]) => {
                                return(
                                    <div className='keyword-item' key={`${key}+${value}`}>
                                        <span>{key} : {value}</span>
                                        <Button
                                        type='primary'
                                        status='danger'
                                        onClick={
                                            () => handleDeleteKeyword(key, "replacement")
                                        }><IconDelete /></Button>
                                    </div>
                                )
                            })
                        }
                        </div>
                        <div className="blacklist">
                        <label htmlFor="#" className='keywords-label'>Blacklist</label>
                        {
                            blacklistList.map((item, index) => {
                                return(
                                    <div className='keyword-item' key={`${index}+${item}`}>
                                        <span>{item}</span>
                                        <Button
                                        type='primary'
                                        status='danger'
                                        onClick={
                                            () => handleDeleteKeyword(item, "blacklist")
                                        }><IconDelete /></Button>
                                    </div>
                                )
                            })
                        }
                        </div>
                        <div className="blacklist-embed">
                        <label htmlFor="#" className='keywords-label'>Blacklist Embed</label>
                        {
                            blacklistembedList.map((item, index) => {
                                return(
                                    <div className='keyword-item' key={`${index}+${item}`}>
                                        <span>{item}</span>
                                        <Button
                                        type='primary'
                                        status='danger'
                                        onClick={
                                            () => handleDeleteKeyword(item, "blacklistembed")
                                        }><IconDelete /></Button>
                                    </div>
                                )
                            })
                        }
                        </div>
                    </div>
                </div>
            </Spin>
        </Modal>
        </div>
    )
}

export default AddKeywordsForm;