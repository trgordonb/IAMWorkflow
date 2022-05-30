import React from 'react';
import { FormGroup, Link } from '@adminjs/design-system';

const PageLink = ({ record }) => {
  console.log(record)
  return (
    <FormGroup>
      <Link
        href={record.params.link}
      >
        Link to the records
      </Link>
    </FormGroup>
  );
};

export default PageLink;
