import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography } from '@material-ui/core'
import { Selector } from './Selector'
import { ActionsMenu } from './ActionsMenu'
import { ExecuteButton } from './ExecuteButton'

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
    handleSelectedAction: PropTypes.func,
    subscription: PropTypes.any,
    handleRunQuery: PropTypes.func,
    handleStopQuery: PropTypes.func,
    operations: PropTypes.any,
    handleEditQuery: PropTypes.func,
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
      selectedAction: 'Share',
      actionsOpen: false,
      showSavedMsg: false,
      showUpdatedMsg: false,
      showSetDefaultMsg: false,
      deleteQueryMsg: null,
    }
    this.queryName = this.defaultQuery(props.queries).name
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cancel === true) {
      this.setState({ queryName: this.queryName, showActions: false })
    }
    if (nextProps.queries != this.props.queries) {
      console.log('AM I HERE: ', nextProps.queries)
      this.setState({ queries: nextProps.queries })
    }
  }

  handleCancel = async () => {
    await this.props.handleCancel()
    this.setState({ queryName: this.queryName, showActions: false })
  }

  handleOpenMenu = e => {
    this.setState({
      open: true,
      showSuccess: false,
      showSavedMsg: false,
      showUpdatedMsg: false,
      deleteQueryMsg: null,
    })
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
    this.setState({
      queryName: e.target.value,
      showActions: true,
      showSuccess: false,
      showSavedMsg: false,
      showUpdatedMsg: false,
      deleteQueryMsg: null,
    })
  }

  handleUpdate = async () => {
    await this.props.handleQueryUpdate({
      id: this.selectedQuery(this.state.selectedValue).id,
      name: this.state.queryName,
      default: true,
    })
    this.setState({ showActions: false, showSuccess: true, showUpdatedMsg: true })
  }

  handleCreate = async () => {
    await this.props.handleCreateQuery({
      name: this.state.queryName,
      default: false,
    })
    this.setState({ showActions: false, showSuccess: true, showSavedMsg: true })
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

  handleActionsMenuClick = () => {
    this.setState({
      actionsOpen: true,
      showSuccess: false,
      showSavedMsg: false,
      showUpdatedMsg: false,
      showSetDefaultMsg: false,
      deleteQueryMsg: null,
    })
  }

  handleClickAction = async (e, value) => {
    console.log('click action: ', value)
    await this.setState({
      actionsOpen: false,
    })
    if (value === 'Set as default') {
      await this.props.handleSelectedAction(this.state.selectedQuery.id, value)
      this.setState({
        showSetDefaultMsg: true,
        showSuccess: true,
      })
    } else if (value === 'Delete') {
      if (this.state.selectedQuery.default === true) {
        return this.setState({ deleteQueryMsg: "You can't delete default query" })
      }
      await this.props.handleSelectedAction(this.state.selectedQuery.id, value)
      this.props.handleEditQuery(this.state.selectedQuery)

      this.setState({
        showSetDefaultMsg: false,
        showSuccess: true,
        queryName: this.defaultQuery(this.props.queries).name,
      })
    }
  }

  render() {
    const {
      queries,
      subscription,
      handleRunQuery,
      handleStopQuery,
      operations,
    } = this.props
    const actions = [
      { id: '1', name: 'Share' },
      { id: '2', name: 'Set as default' },
      { id: '3', name: 'Duplicate' },
      { id: '4', name: 'Delete' },
      { id: '5', name: 'New query' },
    ]

    console.log('showSetDefaultMsg: ', this.state.showSetDefaultMsg)
    return (
      <Grid
        container
        className="saved-queries-toolbar"
        alignItems="center"
        justify="space-between"
      >
        <Grid className="flex">
          <Selector
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
              {this.state.showSavedMsg && (
                <Typography className="success-message">Query saved</Typography>
              )}
              {this.state.showUpdatedMsg && (
                <Typography className="success-message">Query updated</Typography>
              )}
              {this.state.showSetDefaultMsg && (
                <Typography className="success-message">Default query set</Typography>
              )}
            </Grid>
          )}
          {this.state.deleteQueryMsg && (
            <Grid className="error-wrapper">
              <img
                className="error-icon"
                src={`${process.env.PUBLIC_URL}/images/error-icon.svg`}
              />
              <Typography className="error-message">
                {this.state.deleteQueryMsg}
              </Typography>
            </Grid>
          )}
        </Grid>
        <Grid className="flex">
          {!this.state.showActions && (
            <ActionsMenu
              actions={actions}
              selectedAction={this.state.selectedAction}
              handleClickAction={this.handleClickAction}
              actionsOpen={this.state.actionsOpen}
              handleActionsMenuClick={this.handleActionsMenuClick}
            />
          )}
          <ExecuteButton
            isRunning={Boolean(subscription)}
            onRun={handleRunQuery}
            onStop={handleStopQuery}
            operations={operations}
          />
        </Grid>
      </Grid>
    )
  }
}
