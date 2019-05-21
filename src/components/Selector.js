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
    open: PropTypes.bool,
    selectedQueryName: PropTypes.string,
    handleOpenMenu: PropTypes.func,
    handleMenuItemClick: PropTypes.func,
    handleChange: PropTypes.func,
    isDefaultQuery: PropTypes.bool,
    isOwner: PropTypes.bool,
    isMobile: PropTypes.bool,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {
      queries,
      open,
      selectedQueryName,
      handleMenuItemClick,
      handleOpenMenu,
      handleChange,
      isDefaultQuery,
      isOwner,
      isMobile,
    } = this.props

    return (
      <Grid className="selector" autoComplete="off">
        <Grid
          container
          justify="space-between"
          onClick={!isOwner || isMobile ? handleOpenMenu : () => false}
          className={!isOwner || isMobile ? 'pointer' : ''}
        >
          <Input
            name="query"
            value={selectedQueryName}
            className="menu-input"
            onChange={handleChange}
            onClick={handleChange}
            placeholder="New query"
            readOnly={!isOwner || isMobile}
          />
          {isDefaultQuery && <span className="default-label">Default</span>}
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
