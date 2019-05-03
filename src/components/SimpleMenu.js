import React from 'react'
import PropTypes from 'prop-types'
import { MenuItem as MuiMenuItem, Input, Grid } from '@material-ui/core'
import MenuItem from './MenuItem'

/**
 * Dropdown menu that's in the Toolbar
 * and contains Saved queries
 *
 */
export class SimpleMenu extends React.Component {
  static propTypes = {
    queries: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        query: PropTypes.string,
        default: PropTypes.bool,
      })
    ),
    handleMenuItemClick: PropTypes.func,
    handleQueryUpdate: PropTypes.func,
    handleOpenMenu: PropTypes.func,
    handleChange: PropTypes.func,
    open: PropTypes.bool,
    selectedValue: PropTypes.string,
    queryName: PropTypes.string,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {
      queries,
      open,
      selectedValue,
      queryName,
      handleMenuItemClick,
      handleOpenMenu,
      handleChange,
    } = this.props

    return (
      <Grid className="simple-menu" autoComplete="off">
        <Grid container justify="space-between">
          <Input
            name="query"
            value={queryName}
            className="menu-input"
            onChange={handleChange}
          />
          <Grid className="menu-icons">
            <div className="vertical-line" />
            <img
              className="menu-icon"
              src={`${process.env.PUBLIC_URL}/images/selector-icon.svg`}
              onClick={handleOpenMenu}
            />
          </Grid>
        </Grid>

        {open && (
          <Grid className="menu-options">
            {queries.map((option, index) => (
              <Grid key={index}>
                <MenuItem
                  header={option.name}
                  className="item"
                  selected={selectedValue === option.name}
                  isDefault={option.default}
                  onClick={handleMenuItemClick}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
    )
  }
}
