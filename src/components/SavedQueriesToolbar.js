import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Selector } from './Selector'
import { ActionsMenu } from './ActionsMenu'
import { ExecuteButton } from './ExecuteButton'
import Snackbar from '@material-ui/core/Snackbar'
import classnames from 'classnames'

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
    handleCreateQuery: PropTypes.func,
    handleUpdateQuery: PropTypes.func,
    handleSelectedAction: PropTypes.func,
    subscription: PropTypes.any,
    handleRunQuery: PropTypes.func,
    handleStopQuery: PropTypes.func,
    operations: PropTypes.any,
    handleEditQuery: PropTypes.func,
    query: PropTypes.string,
    showActions: PropTypes.bool,
    isActionsMenuOpen: PropTypes.bool,
    versionId: PropTypes.string,
    selectedQueryName: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      selectedQueryName: this.defaultQuery(props.queries).name,
      selectedQueryObj: this.defaultQuery(props.queries),
      queries: props.queries,
      query: props.query,
      showActions: props.showActions,
      isActionsMenuOpen: props.isActionsMenuOpen,
      showCreatedMsg: false,
      showUpdatedMsg: false,
      showSetDefaultMsg: false,
      showShareMsg: false,
      showDeletedMsg: false,
      deleteDefaultQuery: false,
      isNameEmpty: false,
      isQueryEmpty: false,
      isNameTaken: false,
      isQueryTaken: false,
      query: this.props.query,
      showErrorUpdate: false,
      showErrorCreate: false,
      isQueryInvalid: false,
      showErrorDefaultMsg: false,
      showErrorDeletedMsg: false,
      isNewQuery: false,
    }

    // Store selected query, so when cancel is clicked we can revert it
    this.selectedQueryName = this.defaultQuery(props.queries).name
    this.selectedQuery = props.query
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.queries != this.props.queries) {
      this.setState({ queries: nextProps.queries })
    }

    if (nextProps.query != this.props.query) {
      this.setState({ query: nextProps.query })
    }

    if (nextProps.isActionsMenuOpen !== this.state.isActionsMenuOpen) {
      this.setState({ isActionsMenuOpen: nextProps.isActionsMenuOpen })
    }

    if (nextProps.showActions !== this.props.showActions) {
      this.setState({
        showActions: nextProps.showActions,
      })
    }
  }

  validateName = () => {
    const name = this.state.selectedQueryName
    if (name === '') {
      return this.setState({ isNameEmpty: true, showActions: false })
    }
    const foundName = this.state.queries.find(query => query.name === name)

    if (foundName) {
      return this.setState({ isNameTaken: true })
    }
  }

  validateUpdatedName = () => {
    const name = this.state.selectedQueryName
    if (name === '') {
      return this.setState({ isNameEmpty: true, showActions: false })
    }
    const otherQueries = this.state.queries
      .map(q => {
        if (q.name !== this.selectedQueryName) {
          return q
        }
      })
      .filter(qqq => qqq !== undefined)

    const foundName = otherQueries.find(qq => qq && qq.name === name)
    if (foundName) {
      return this.setState({ isNameTaken: true })
    }
  }

  validateQuery = () => {
    const myquery = this.state.query.replace(/↵/gm, '').replace(/\s/g, '')
    const foundQuery = this.state.queries.find(
      query => query.query.replace(/↵/gm, '').replace(/\s/g, '') === myquery
    )
    if (foundQuery) {
      return this.setState({ isQueryTaken: true })
    }

    const queryString = this.state.query.replace(/\s/g, '')
    if (queryString.length === 0) {
      return this.setState({ isQueryEmpty: true, showActions: false })
    }

    const errors = document.querySelectorAll('.CodeMirror-lint-mark-error')
    if (errors.length > 0) {
      return this.setState({ isQueryInvalid: true })
    }
  }

  handleCreate = async e => {
    this.validateName()
    this.validateQuery()

    const result = await this.props.handleCreateQuery({
      name: this.state.selectedQueryName,
      query: this.state.query,
    })

    if (result) {
      this.setState({ showActions: false, showCreatedMsg: true, isNewQuery: false })
    } else {
      this.setState({ showActions: true, showErrorCreate: true })
    }
  }

  handleUpdate = async () => {
    this.validateUpdatedName()
    this.validateQuery()
    const result = await this.props.handleUpdateQuery({
      id: this.state.selectedQueryObj.id,
      name: this.state.selectedQueryName,
      query: this.state.query,
    })

    if (result) {
      this.setState({ showActions: false, showUpdatedMsg: true })
    } else {
      this.setState({ showActions: true, showErrorUpdate: true })
    }
  }

  handleCancel = async e => {
    e.stopPropagation()
    await this.props.handleEditQuery(this.selectedQuery)
    this.setState({
      selectedQueryName: this.selectedQueryName,
      showActions: false,
      isNewQuery: false,
    })
  }

  handleOpenMenu = e => {
    this.setState({
      open: true,
      deleteDefaultQuery: false,
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

  findSelectedQuery = name => {
    const selected = this.state.queries.find(query => query.name === name)
    return selected
  }

  handleChange = e => {
    if (e.target.value !== this.state.selectedQueryName) {
      this.setState({ showActions: true })
    }
    this.setState({
      selectedQueryName: e.target.value,
      showCreatedMsg: false,
      showUpdatedMsg: false,
      deleteDefaultQuery: false,
      isNameEmpty: false,
      isQueryEmpty: false,
    })
  }

  handleMenuItemClick = async (e, value) => {
    const selected = this.findSelectedQuery(value)
    // save them in case we need to cancel changes
    this.selectedQueryName = value
    this.selectedQuery = selected.query
    this.props.handleEditQuery(selected.query)
    await this.setState({
      selectedQueryName: value,
      open: false,
      selectedQueryObj: selected,
    })
  }

  handleActionsMenuClick = e => {
    e.stopPropagation()
    this.setState({
      isActionsMenuOpen: true,
      showCreatedMsg: false,
      showUpdatedMsg: false,
      showSetDefaultMsg: false,
      deleteDefaultQuery: false,
    })
  }

  handleClickAction = async (e, value) => {
    await this.setState({
      isActionsMenuOpen: false,
    })
    if (value === 'Share') {
      this.setState({ showShareMsg: true })
    } else if (value === 'Set as default') {
      const result = await this.props.handleSelectedAction(
        this.state.selectedQueryObj.id,
        value
      )
      if (result) {
        this.setState({ showSetDefaultMsg: true, selectedQueryObj: result })
      } else {
        this.setState({ showErrorDefaultMsg: true })
      }
    } else if (value === 'Delete') {
      if (this.state.selectedQueryObj.default === true) {
        return this.setState({ deleteDefaultQuery: true })
      }
      const deleteResult = await this.props.handleSelectedAction(
        this.state.selectedQueryObj.id,
        value
      )
      if (deleteResult) {
        this.setState({
          selectedQueryName: this.defaultQuery(this.props.queries).name,
          showDeletedMsg: true,
        })
      } else {
        this.setState({ showErrorDeletedMsg: true })
      }
    } else if (value === 'New query') {
      this.setState({ selectedQueryName: '', isNewQuery: true })
      this.props.handleEditQuery('')
    }
  }

  handleSnackbarClose = (event, reason) => {
    this.setState({
      showUpdatedMsg: false,
      showCreatedMsg: false,
      showSetDefaultMsg: false,
      showShareMsg: false,
      showErrorMessage: false,
      isNameTaken: false,
      isQueryEmpty: false,
      isQueryInvalid: false,
      showErrorCreate: false,
      isQueryTaken: false,
      showErrorDefaultMsg: false,
      deleteDefaultQuery: false,
      showErrorDeletedMsg: false,
      showDeletedMsg: false,
    })
  }

  snackbarMessage = () => {
    let message
    if (this.state.showUpdatedMsg) {
      message = 'Query updated'
    } else if (this.state.showCreatedMsg) {
      message = 'Query created'
    } else if (this.state.showSetDefaultMsg) {
      message = 'Default query set'
    } else if (this.state.showShareMsg) {
      message = 'URL copied to clipboard'
    } else if (this.state.isNameEmpty) {
      message = "Name can't be empty"
    } else if (this.state.isNameTaken) {
      message = 'Name is already taken'
    } else if (this.state.isQueryEmpty) {
      message = "Query can't be empty"
    } else if (this.state.isQueryInvalid) {
      message = 'Query is invalid'
    } else if (this.state.showErrorCreate || this.state.isQueryTaken) {
      message = 'Unable to update query (duplicate)'
    } else if (this.state.showErrorDefaultMsg) {
      message = 'Unable to set the default query'
    } else if (this.state.deleteDefaultQuery) {
      message = "Default query can't be deleted"
    } else if (this.state.showDeletedMsg) {
      message = 'Query successfully deleted'
    } else if (this.state.showErrorDeletedMsg) {
      message = 'Unable to delete query'
    }
    return message
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
      { id: '3', name: 'Delete' },
      { id: '4', name: 'New query' },
    ]

    const showSuccessMessage =
      this.state.showUpdatedMsg ||
      this.state.showCreatedMsg ||
      this.state.showSetDefaultMsg ||
      this.state.showShareMsg ||
      this.state.showDeletedMsg

    const showErrorMessage =
      this.state.isNameEmpty ||
      this.state.isQueryEmpty ||
      this.state.isNameTaken ||
      this.state.isQueryInvalid ||
      this.state.showErrorCreate ||
      this.state.isQueryTaken ||
      this.state.showErrorDefaultMsg ||
      this.state.deleteDefaultQuery ||
      this.state.showErrorDeletedMsg

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
            open={this.state.open}
            handleOpenMenu={this.handleOpenMenu}
            selectedQueryName={this.state.selectedQueryName}
            handleMenuItemClick={this.handleMenuItemClick}
            queryName={this.state.selectedQueryName}
            handleChange={this.handleChange}
          />
          {this.state.showActions && (
            <Grid
              className={classnames(
                'query-actions',
                this.state.isNewQuery && 'new-query'
              )}
              container
              alignItems="center"
              wrap="nowrap"
              justify="space-around"
            >
              {!this.state.isNewQuery && (
                <Typography className="action" onClick={this.handleUpdate}>
                  Save
                </Typography>
              )}
              <Typography className="action" onClick={this.handleCreate}>
                Save as new
              </Typography>
              <Typography className="action" onClick={this.handleCancel}>
                Cancel
              </Typography>
            </Grid>
          )}
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={showSuccessMessage || showErrorMessage}
            autoHideDuration={3000}
            message={
              <div className="snackbar-content">
                <Typography className="message">{this.snackbarMessage()}</Typography>
              </div>
            }
            className={classnames(
              'snackbar',
              showSuccessMessage
                ? 'snackbar-success'
                : showErrorMessage
                ? 'snackbar-error'
                : ''
            )}
            ContentProps={{
              classes: { root: 'content-root' },
            }}
            onClose={this.handleSnackbarClose}
          />
        </Grid>
        <Grid className="flex">
          {!this.state.showActions && (
            <ActionsMenu
              actions={actions}
              handleClickAction={this.handleClickAction}
              actionsOpen={this.state.isActionsMenuOpen}
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
