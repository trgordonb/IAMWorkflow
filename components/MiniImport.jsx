import React, { useState } from 'react';
import { ApiClient, useNotice } from 'adminjs';
import {
  DropZoneItem,
  Loader,
  Box,
  Button,
  DropZone,
} from '@adminjs/design-system';
import csv from 'csvtojson'

const MiniImport = (props) => {
    const [file, setFile] = useState(null);
    const sendNotice = useNotice();
    const [isFetching, setFetching] = useState();

    const onUpload = (uploadedFile) => {
        setFile(uploadedFile?.[0] ?? null);
    };

    const onSubmit = async () => {
        if (!file) {
            return;
        }

        setFetching(true);
        try {
            const fileReader = new FileReader()
            fileReader.onload = async (e) => {
                const records = await csv().fromString(e.target.result);
                console.log(props.record)
                await new ApiClient().recordAction({
                    recordId: props.record.id,
                    resourceId: props.resource.id,
                    actionName: 'edit',
                    data: {
                        statementitems: records,
                        status: props.record.params.status,
                        grossamount: props.record.params.grossamount,
                    },
                });
            sendNotice({ message: 'Imported successfully', type: 'success' });
        }
        fileReader.readAsText(file)
        } catch (e) {
            sendNotice({ message: e.message, type: 'error' });
        }
        setFetching(false);
    };

  if (isFetching) {
    return <Loader />;
  }

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
        <Button onClick={onSubmit} disabled={!file || isFetching}>
          Upload
        </Button>
      </Box>
    </Box>
  );
};

export default MiniImport;
