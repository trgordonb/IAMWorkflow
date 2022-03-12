import React, { useState } from 'react';
import { ApiClient } from 'adminjs';
import {
  DropZoneItem,
  Box,
  Button,
  DropZone,
  Modal
} from '@adminjs/design-system';
import csv from 'csvtojson'

const MiniImport = (props) => {
    const [file, setFile] = useState(null);
    const [showModal, setShowModal] = useState(false)
    const [isSuccess, setIsSuccess] = useState(true)

    const onUpload = (uploadedFile) => {
        setFile(uploadedFile?.[0] ?? null);
    };

    const onSubmit = async () => {
        if (!file) {
            return;
        }
        const fileReader = new FileReader()
        fileReader.onload = async (e) => {
            const records = await csv().fromString(e.target.result);
            const result = await new ApiClient().resourceAction({
                resourceId: 'Statement',
                actionName: 'csvimport',
                data: {
                    statementId: props.record.id,
                    statementitems: records,
                    grossamount: props.record.params.grossamount,
                },
            })
            if (result.data.notice.type === 'error') {
              setIsSuccess(false)
            } else {
              setIsSuccess(true)
            }
            setShowModal(true)
        }
        fileReader.readAsText(file)
    };

  return (
    <Box
      margin="auto"
      maxWidth={600}
      display="flex"
      justifyContent="center"
      flexDirection="column"
    >
      <DropZone files={[]} onChange={onUpload} multiple={false} />
      {file && (
        <DropZoneItem
          file={file}
          filename={file.name}
          onRemove={() => setFile(null)}
        />
      )}
      <Box display="flex" justifyContent="center" m={10}>
        <Button onClick={onSubmit} disabled={!file}>
          Upload
        </Button>
      </Box>
      {
        showModal &&
        <Modal
            title='File Import'
            onOverlayClick={()=> setShowModal(false)}
            variant={ isSuccess ? 'success': 'danger'}
            subTitle={ isSuccess ?  'File Import Success' : 'File Import Fail' }
            buttons={[{
                label: 'OK',
                onClick: () => setShowModal(false)
            }]}
        />
      }
    </Box>
  );
};

export default MiniImport;
