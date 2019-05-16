import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography } from '@material-ui/core'
import classnames from 'classnames'

const MenuItem = ({
  header,
  className,
  selected,
  isDefault,
  onClick,
  optionIcon,
  trashIcon,
  addIcon,
}) => {
  return (
    <Grid
      container
      className={classnames('menu-item', className, selected && 'selected')}
      onClick={e => onClick(e, header)}
    >
      <Grid container alignItems="center">
        {addIcon && header === 'New query' && <img className="add-icon" src={addIcon} />}
        <Typography
          className={classnames(
            'header',
            addIcon && header === 'New query' && 'new-query'
          )}
        >
          {header}
          {isDefault && <span className="default-tag">Default</span>}
          {selected && <img src={`${process.env.PUBLIC_URL}/images/checked-icon.svg`} />}
        </Typography>
      </Grid>
    </Grid>
  )
}

MenuItem.propTypes = {
  header: PropTypes.string,
  className: PropTypes.string,
  selected: PropTypes.oneOfType([PropTypes.boolean, undefined]),
  isDefault: PropTypes.oneOfType([PropTypes.boolean, undefined]),
  onClick: PropTypes.func,
  optionIcon: PropTypes.bool,
  trashIcon: PropTypes.string,
}

export default MenuItem
