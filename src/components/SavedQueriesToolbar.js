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
    handleSelectQuery: PropTypes.func,
    docExplorerOpen: PropTypes.bool,
    selectedQueryName: PropTypes.any,
  }

  constructor(props) {
    super(props)
    this.state = {
      open: props.isActionsMenuOpen,
      selectedQueryName:
        props.selectedQueryName &&
        this.findSelectedQuery(props.queries, props.selectedQueryName)
          ? this.findSelectedQuery(props.queries, props.selectedQueryName).name
          : this.defaultQuery(props.queries).name,
      selectedQueryObj:
        props.selectedQueryName &&
        this.findSelectedQuery(props.queries, props.selectedQueryName)
          ? this.findSelectedQuery(props.queries, props.selectedQueryName)
          : this.defaultQuery(props.queries),
      queries: props.queries,
      query: props.query,
      showActions: props.showActions,
      isActionsMenuOpen: props.isActionsMenuOpen,
      deleteDefaultQuery: false,
      isQueryEmpty: false,
      isQueryTaken: false,
      isQueryInvalid: false,
      showErrorDefaultMsg: false,
      showErrorDeletedMsg: false,
      isNewQuery: false,
      docExplorerOpen: props.docExplorerOpen,
      successMessages: {
        create: false,
        update: false,
        setDefault: false,
        share: false,
        delete: false,
      },
      errorMessages: {
        nameTaken: false,
        nameEmpty: false,
        create: false,
        update: false,
      },
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

    if (
      nextProps.isActionsMenuOpen !== this.state.isActionsMenuOpen ||
      nextProps.isActionsMenuOpen !== this.state.open
    ) {
      this.setState({
        isActionsMenuOpen: nextProps.isActionsMenuOpen,
        open: nextProps.isActionsMenuOpen,
      })
    }

    if (nextProps.showActions !== this.props.showActions) {
      this.setState({
        showActions: nextProps.showActions,
      })
    }

    if (nextProps.docExplorerOpen != this.props.docExplorerOpen) {
      this.setState({ docExplorerOpen: nextProps.docExplorerOpen })
    }
  }

  /* Validations: 
     - Name can't be empty or taken
     - Query can't be empty, taken or invalid
  */
  validateName = updated => {
    const name = this.state.selectedQueryName
    if (name === '') {
      return this.setState(
        Object.assign(this.state.errorMessages, {
          nameEmpty: true,
          showActions: false,
        })
      )
    }
    let foundName
    if (updated) {
      const otherQueries = this.state.queries.filter(
        other => other.name !== this.selectedQueryName
      )
      foundName = otherQueries.find(found => found.name === name)
    } else {
      foundName = this.state.queries.find(query => query.name === name)
    }
    return this.setState(
      Object.assign(this.state.errorMessages, {
        nameTaken: foundName !== undefined,
      })
    )
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
      this.props.handleSelectQuery(this.state.selectedQueryName)
      this.setState(
        Object.assign(this.state.successMessages, {
          create: true,
          showActions: false,
          isNewQuery: false,
        })
      )
    } else {
      this.setState(
        Object.assign(this.state.errorMessages, { create: true, showActions: true })
      )
    }
  }

  handleUpdate = async () => {
    this.validateName(true)
    this.validateQuery()

    const result = await this.props.handleUpdateQuery({
      id: this.state.selectedQueryObj.id,
      name: this.state.selectedQueryName,
      query: this.state.query,
    })

    if (result) {
      this.props.handleSelectQuery(this.state.selectedQueryName)
      this.setState(
        Object.assign(this.state.successMessages, { update: true, showActions: false })
      )
    } else {
      this.setState(
        Object.assign(this.state.errorMessages, { update: true, showActions: true })
      )
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
    e.stopPropagation()
    this.setState({
      open: true,
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

  findSelectedQuery = (queries, name) => queries.find(query => query.name === name)

  handleChange = e => {
    if (e.target.value !== this.state.selectedQueryName) {
      this.setState({ showActions: true })
    }
    this.setState({
      selectedQueryName: e.target.value,
      deleteDefaultQuery: false,
      isQueryEmpty: false,
    })
  }

  handleMenuItemClick = async (e, value) => {
    const selected = this.findSelectedQuery(this.state.queries, value)
    this.props.handleSelectQuery(value)
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
      deleteDefaultQuery: false,
    })
  }

  handleClickAction = async (e, value) => {
    await this.setState({
      isActionsMenuOpen: false,
    })
    if (value === 'Share') {
      this.setState(
        Object.assign(this.state.successMessages, {
          share: true,
        })
      )
    } else if (value === 'Set as default') {
      const result = await this.props.handleSelectedAction(
        this.state.selectedQueryObj.id,
        value
      )
      if (result) {
        this.setState(
          Object.assign(this.state.successMessages, {
            setDefault: true,
            selectedQueryObj: result,
          })
        )
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
        this.setState(
          Object.assign(this.state.successMessages, {
            delete: true,
            selectedQueryObj: result,
            selectedQueryName: this.defaultQuery(this.props.queries).name,
          })
        )
      } else {
        this.setState({ showErrorDeletedMsg: true })
      }
    } else if (value === 'New query') {
      this.setState({ selectedQueryName: '', isNewQuery: true })
      this.props.handleEditQuery('')
    }
  }

  handleSnackbarClose = (event, reason) => {
    this.setState(
      Object.assign(this.state.successMessages, {
        update: false,
        create: false,
        share: false,
        setDefault: false,
        delete: false,
      })
    )
    this.setState(
      Object.assign(this.state.errorMessages, {
        nameTaken: false,
        nameEmpty: false,
        create: false,
        update: false,
      })
    )
    this.setState({
      isQueryEmpty: false,
      isQueryInvalid: false,
      isQueryTaken: false,
      showErrorDefaultMsg: false,
      deleteDefaultQuery: false,
      showErrorDeletedMsg: false,
    })
  }

  snackbarMessage = () => {
    let message
    const success = this.state.successMessages
    const error = this.state.errorMessages
    if (success.update) {
      message = 'Query updated'
    } else if (success.create) {
      message = 'Query created'
    } else if (success.setDefault) {
      message = 'Default query set'
    } else if (success.share) {
      message = 'URL copied to clipboard'
    } else if (success.delete) {
      message = 'Query successfully deleted'
    } else if (error.nameEmpty) {
      message = "Name can't be empty"
    } else if (error.nameTaken) {
      message = 'Name is already taken'
    } else if (this.state.isQueryEmpty) {
      message = "Query can't be empty"
    } else if (this.state.isQueryInvalid) {
      message = 'Query is invalid'
    } else if (error.create || this.state.isQueryTaken) {
      message = 'Unable to create query (duplicate)'
    } else if (error.update) {
      message = 'Unable to update query (duplicate)'
    } else if (this.state.showErrorDefaultMsg) {
      message = 'Unable to set the default query'
    } else if (this.state.deleteDefaultQuery) {
      message = "Default query can't be deleted"
    } else if (this.state.showErrorDeletedMsg) {
      message = 'Unable to delete query'
    }
    return message
  }

  actions = () => {
    return [
      { id: '1', name: 'Share' },
      { id: '2', name: 'Set as default' },
      { id: '3', name: 'Delete' },
      { id: '4', name: 'New query' },
    ]
  }

  render() {
    const {
      queries,
      subscription,
      handleRunQuery,
      handleStopQuery,
      operations,
    } = this.props

    const { successMessages, errorMessages } = this.state

    const showSuccessMessage =
      successMessages.delete ||
      successMessages.update ||
      successMessages.create ||
      successMessages.setDefault ||
      successMessages.share

    const showErrorMessage =
      errorMessages.nameEmpty ||
      errorMessages.nameTaken ||
      this.state.isQueryInvalid ||
      errorMessages.create ||
      errorMessages.update ||
      this.state.isQueryTaken ||
      this.state.showErrorDefaultMsg ||
      this.state.deleteDefaultQuery ||
      this.state.showErrorDeletedMsg

    return (
      <Grid
        container
        className={classnames(
          'saved-queries-toolbar',
          !this.state.docExplorerOpen && 'schema-hidden'
        )}
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
              actions={this.actions()}
              handleClickAction={this.handleClickAction}
              actionsOpen={this.state.isActionsMenuOpen}
              handleActionsMenuClick={this.handleActionsMenuClick}
              isDefaultQuery={
                this.state.selectedQueryObj ? this.state.selectedQueryObj.default : false
              }
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
