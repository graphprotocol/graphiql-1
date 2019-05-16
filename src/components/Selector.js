import React from 'react'
import PropTypes from 'prop-types'
import { Input, Grid } from '@material-ui/core'
import MenuItem from './MenuItem'

/**
 * Dropdown menu that's in the Toolbar
 * and contains Saved queries
 *
 */
export class Selector extends React.Component {
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
    handleOpenMenu: PropTypes.func,
    handleChange: PropTypes.func,
    open: PropTypes.bool,
    selectedQueryName: PropTypes.string,
    queryName: PropTypes.string,
  }

  constructor(props) {
    super(props)
  }

  isDefault = () => {
    const selectedQuery = this.props.queries.find(
      query => query.name === this.props.selectedQueryName
    )
    return selectedQuery ? selectedQuery.default : false
  }

  render() {
    const {
      queries,
      open,
      selectedQueryName,
      queryName,
      handleMenuItemClick,
      handleOpenMenu,
      handleChange,
    } = this.props

    return (
      <Grid className="selector" autoComplete="off">
        <Grid container justify="space-between">
          <Input
            name="query"
            value={queryName}
            className="menu-input"
            onChange={handleChange}
            onClick={handleChange}
            placeholder="New query"
          />
          {this.isDefault() && <span className="default-label">Default</span>}
          <Grid className="menu-icons">
            <img
              className="menu-icon"
              src={`${process.env.PUBLIC_URL}/images/query-selector-icon.svg`}
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
                  selected={selectedQueryName === option.name}
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
