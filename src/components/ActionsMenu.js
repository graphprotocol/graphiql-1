import React from 'react'
import PropTypes from 'prop-types'
import { Grid } from '@material-ui/core'
import MenuItem from './MenuItem'

/*
  Actions menu dropdown for the following actions: 
  - Share, Set as default, Delete, New query
*/

const ActionsMenu = ({
  actions,
  onClickAction,
  onActionsMenuClick,
  actionsOpen,
  isDefaultQuery,
}) => {
  return (
    <Grid className="actions-menu">
      <img
        className="dots-icon"
        src={`${process.env.PUBLIC_URL}/images/dots-icon.svg`}
        onClick={onActionsMenuClick}
      />
      {actionsOpen && (
        <Grid className="actions-menu-options">
          {actions.map((option, index) => (
            <Grid key={index}>
              <MenuItem
                header={option.name}
                className="item"
                onClick={onClickAction}
                addIcon={`${process.env.PUBLIC_URL}/images/plus-icon.svg`}
                isDefaultQuery={isDefaultQuery}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Grid>
  )
}

ActionsMenu.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    })
  ),
  actionsOpen: PropTypes.bool,
  onClickAction: PropTypes.func,
  onActionsMenuClick: PropTypes.func,
  isDefaultQuery: PropTypes.bool,
}

export default ActionsMenu
