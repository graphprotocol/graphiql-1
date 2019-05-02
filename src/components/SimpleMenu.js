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
    value: PropTypes.string,
    queries: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        query: PropTypes.string,
        default: PropTypes.bool,
      })
    ),
  }

  constructor(props) {
    super(props)
    const initialQuery = this.props.queries.length > 0 ? this.props.queries[0].name : ''
    this.state = {
      selectedValue: initialQuery,
      queryName: initialQuery,
      open: false,
    }
  }

  handleChange = e => {
    console.log('EEEEE: ', e.target)
    this.setState({ queryName: e.target.value })
  }

  handleMenuItemClick = (e, header) => {
    this.setState({ selectedValue: header, queryName: header, open: false })
  }

  handleOpenMenu = e => {
    this.setState({ open: true })
  }

  render() {
    const MenuProps = {
      PaperProps: {
        style: {
          borderRadius: '4px',
          backgroundColor: 'rgba(30,26,48,0.94)',
          boxShadow: '0 -20px 24px 0 rgba(0,0,0,0.4)',
          width: '350px',
          marginLeft: '-17px',
          marginTop: '-17px',
          border: '1px solid rgba(255,255,255,0.08)',
        },
      },
    }
    const { queries } = this.props
    console.log('GRAPHQL: ', queries)

    return (
      <Grid className="simple-menu" autoComplete="off">
        <Grid container justify="space-between">
          <Input
            name="query"
            value={this.state.queryName}
            className="menu-input"
            onChange={this.handleChange}
          />
          <Grid className="menu-icons">
            <div className="vertical-line" />
            <img
              className="menu-icon"
              src={`${process.env.PUBLIC_URL}/images/selector-icon.svg`}
              onClick={this.handleOpenMenu}
            />
          </Grid>
        </Grid>

        {this.state.open && (
          <Grid className="menu-options">
            {queries.map((option, index) => (
              <Grid key={index}>
                <MenuItem
                  header={option.name}
                  className="item"
                  selected={this.state.selectedValue === option.name}
                  isDefault={option.default}
                  onClick={this.handleMenuItemClick}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
    )
  }
}
