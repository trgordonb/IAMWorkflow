import React from 'react';
import { ViewHelpers } from 'adminjs';
import { FormGroup, Link } from '@adminjs/design-system';

const viewHelpers = new ViewHelpers();
const RecordLink = ({ record }) => {
  if (!record?.params) {
    return null;
  }

  const { recordId, resource, recordTitle } = record?.params;
  if (!recordId || !resource) {
    return null;
  }

  return (
    <FormGroup>
      <Link
        href={viewHelpers.recordActionUrl({
          actionName: 'show',
          recordId,
          resourceId: resource,
        })}
      >
        Link to the record at current state
      </Link>
    </FormGroup>
  );
};

export default RecordLink;
