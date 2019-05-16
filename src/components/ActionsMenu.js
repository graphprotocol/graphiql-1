import React from 'react'
import PropTypes from 'prop-types'
import { Grid } from '@material-ui/core'
import MenuItem from './MenuItem'

/**
 * Dropdown menu that's in the Toolbar
 * and contains Saved queries
 *
 */
export class ActionsMenu extends React.Component {
  static propTypes = {
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      })
    ),
    actionsOpen: PropTypes.bool,
    handleClickAction: PropTypes.func,
    handleActionsMenuClick: PropTypes.func,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { actions, handleClickAction, handleActionsMenuClick, actionsOpen } = this.props

    return (
      <Grid className="actions-menu">
        <img
          className="dots-icon"
          src={`${process.env.PUBLIC_URL}/images/dots-icon.svg`}
          onClick={handleActionsMenuClick}
        />
        {actionsOpen && (
          <Grid className="actions-menu-options">
            {actions.map((option, index) => (
              <Grid key={index}>
                <MenuItem
                  header={option.name}
                  className="item"
                  onClick={handleClickAction}
                  addIcon={`${process.env.PUBLIC_URL}/images/plus-icon.svg`}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
    )
  }
}
