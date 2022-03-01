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

const ImportComponent = ({ resource }) => {
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
    //const importData = new FormData();
      const fileReader = new FileReader()
      fileReader.onload = async (e) => {
        const records = await csv().fromString(e.target.result);
        console.log(JSON.stringify(records))
        //importData.append('payload', e.target.result)
        await new ApiClient().resourceAction({
          method: 'post',
          resourceId: resource.id,
          actionName: 'import',
          data: {
            payload: JSON.stringify(records)
          },
        });
        sendNotice({ message: 'Imported successfully', type: 'success' });
      }
      fileReader.readAsText(file)
      //importData.append('file', file);
      //await new ApiClient().resourceAction({
      //  method: 'post',
      //  resourceId: resource.id,
      //  actionName: 'import',
      //  data: importData,
      //});

      //sendNotice({ message: 'Imported successfully', type: 'success' });
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

export default ImportComponent;
