import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography } from '@material-ui/core'
import { SimpleMenu } from './SimpleMenu'

/**
 * Saved queries toolbar with controls and menus
 *
 */
export class SavedQueriesToolbar extends React.Component {
  static propTypes = {
    queries: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        query: PropTypes.string,
        default: PropTypes.bool,
      })
    ),
    handleSelectedQuery: PropTypes.func,
    handleCancel: PropTypes.func,
    handleQueryUpdate: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      selectedValue: this.defaultQuery(props.queries).name,
      queryName: this.defaultQuery(props.queries).name,
      selectedQuery: this.defaultQuery(props.queries),
      queries: props.queries,
      showActions: false,
    }
    this.queryName = this.defaultQuery(props.queries).name
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cancel === true) {
      this.setState({ queryName: this.queryName })
    }
    if (nextProps.queries != this.props.queries) {
      this.setState({ queries: nextProps.queries })
    }
  }

  handleCancel = async () => {
    await this.props.handleCancel()
    this.setState({ queryName: this.queryName })
  }

  handleOpenMenu = e => {
    this.setState({ open: true })
  }

  defaultQuery = queries => {
    if (queries && queries.length > 0) {
      const defaultQuery = queries.find(query => query.default === true)
      if (!defaultQuery) {
        return queries[0]
      }
      return defaultQuery
    }
  }

  selectedQuery = name => {
    const selected = this.state.queries.find(query => query.name === name)
    return selected
  }

  handleChange = e => {
    this.setState({ queryName: e.target.value, showActions: true, showSuccess: false })
  }

  handleUpdate = async () => {
    await this.props.handleQueryUpdate({
      id: this.selectedQuery(this.state.selectedValue).id,
      name: this.state.queryName,
      default: true,
    })
    this.setState({ showActions: false, showSuccess: true })
  }

  handleCreate = async () => {
    await this.props.handleCreateQuery({
      name: this.state.queryName,
      default: false,
    })
    this.setState({ showActions: false, showSuccess: true })
  }

  handleMenuItemClick = (e, header) => {
    this.queryName = header
    this.props.handleSelectedQuery(this.selectedQuery(header).query)
    this.setState({
      selectedValue: header,
      queryName: header,
      open: false,
      selectedQuery: this.selectedQuery(header),
    })
  }
  render() {
    const { queries } = this.props

    return (
      <Grid container className="saved-queries-toolbar">
        <SimpleMenu
          queries={queries}
          handleSelectedQuery={this.props.handleSelectedQuery}
          open={this.state.open}
          handleOpenMenu={this.handleOpenMenu}
          selectedValue={this.state.selectedValue}
          handleMenuItemClick={this.handleMenuItemClick}
          queryName={this.state.queryName}
          handleChange={this.handleChange}
        />
        {this.state.showActions && (
          <Grid
            className="query-actions"
            container
            alignItems="center"
            wrap="nowrap"
            justify="space-around"
          >
            <Typography className="action" onClick={this.handleUpdate}>
              Save
            </Typography>
            <Typography className="action" onClick={this.handleCreate}>
              Save as new
            </Typography>
            <Typography className="action" onClick={this.handleCancel}>
              Cancel
            </Typography>
          </Grid>
        )}
        {this.state.showSuccess && (
          <Grid container alignItems="center" wrap="nowrap" className="show-success">
            <img
              className="check-icon"
              src={`${process.env.PUBLIC_URL}/images/checkbox-icon.svg`}
            />
            <Typography className="success-message">Query saved</Typography>
          </Grid>
        )}
      </Grid>
    )
  }
}
