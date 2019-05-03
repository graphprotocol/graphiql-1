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
    }
    this.queryName = this.defaultQuery(props.queries).name
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cancel === true) {
      this.setState({ queryName: this.queryName })
    }
  }

  cancel = async () => {
    await this.props.handleCancel()
    this.setState({ queryName: this.queryName })
  }

  handleOpenMenu = e => {
    this.setState({ open: true })
  }

  defaultQuery = queries => {
    if (queries && queries.length > 0) {
      const defaultQuery = queries.find(query => query.default === true)
      return defaultQuery
    }
  }

  selectedQuery = name => {
    const selected = this.state.queries.find(query => query.name === name)
    return selected
  }

  handleChange = e => {
    this.setState({ queryName: e.target.value })
  }

  handleUpdate = () => {
    this.props.handleQueryUpdate({
      id: this.selectedQuery(this.state.selectedValue).id,
      name: this.state.queryName,
      default: true,
    })
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
    const { queries, handleCreate } = this.props

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
          <Typography className="action" onClick={handleCreate}>
            Save as new
          </Typography>
          <Typography className="action" onClick={this.cancel}>
            Cancel
          </Typography>
        </Grid>
      </Grid>
    )
  }
}
