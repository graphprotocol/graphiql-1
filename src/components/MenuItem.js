import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import classnames from 'classnames';

const MenuItem = ({ header, className, selected, isDefault }) => {
  return (
    <Grid
      container
      className={classnames('menu-item', className, selected && 'selected')}>
      <Grid>
        <Typography className="header">
          {header}
          {isDefault && <span className="default-tag">Default</span>}
          {selected && (
            <img src={`${process.env.PUBLIC_URL}/images/checked-icon.svg`} />
          )}
        </Typography>
      </Grid>
    </Grid>
  );
};

MenuItem.propTypes = {
  header: PropTypes.string,
  className: PropTypes.string,
  selected: PropTypes.boolean,
  isDefault: PropTypes.booleean,
};

export default MenuItem;
