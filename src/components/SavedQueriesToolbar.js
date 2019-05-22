import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Selector from './Selector'
import ActionsMenu from './ActionsMenu'
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
    selectedQueryName: PropTypes.any,
    query: PropTypes.string,
    onCreateQuery: PropTypes.func,
    onUpdateQuery: PropTypes.func,
    onSelectedAction: PropTypes.func,
    onSelectQuery: PropTypes.func,
    subscription: PropTypes.any,
    onRunQuery: PropTypes.func,
    onStopQuery: PropTypes.func,
    operations: PropTypes.any,
    onEditQuery: PropTypes.func,
    showActions: PropTypes.bool,
    isActionsMenuOpen: PropTypes.bool,
    docExplorerOpen: PropTypes.bool,
    isOwner: PropTypes.bool,
    isMobile: PropTypes.bool,
    onToggleDocs: PropTypes.func,
  }

  constructor(props) {
    super(props)
    const findSelected =
      props.selectedQueryName &&
      this.findSelectedQuery(props.queries, props.selectedQueryName)
    this.state = {
      open: props.isActionsMenuOpen,
      selectedQueryName: findSelected
        ? findSelected.name
        : this.defaultQuery(props.queries).name,
      selectedQueryObj: findSelected ? findSelected : this.defaultQuery(props.queries),
      queries: props.queries,
      query: props.query,
      showActions: props.showActions,
      isActionsMenuOpen: props.isActionsMenuOpen,
      isNewQuery: false,
      docExplorerOpen: props.docExplorerOpen,
      deleteQuery: false,
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
        queryInvalid: false,
        queryTaken: false,
        queryEmpty: false,
        default: false,
        deleteDefault: false,
      },
    }

    // Store selected query, so when cancel is clicked we can revert it
    this.selectedQueryName = this.defaultQuery(props.queries).name
    this.selectedQueryObj = findSelected ? findSelected : this.defaultQuery(props.queries)
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.queries !== this.props.queries) {
      this.setState({ queries: nextProps.queries })
    }

    if (nextProps.query !== this.props.query) {
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

    if (nextProps.docExplorerOpen !== this.props.docExplorerOpen) {
      this.setState({ docExplorerOpen: nextProps.docExplorerOpen })
    }
  }

  render() {
    const { queries, subscription, onRunQuery, onStopQuery, operations } = this.props

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
      errorMessages.queryInvalid ||
      errorMessages.create ||
      errorMessages.update ||
      errorMessages.queryTaken ||
      errorMessages.default ||
      errorMessages.deleteDefault

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
        <Grid className={classnames('flex', 'main-flex')}>
          <Selector
            queries={queries}
            open={this.state.open}
            selectedQueryName={this.state.selectedQueryName}
            onOpenMenu={this.handleOpenMenu}
            onMenuItemClick={this.handleMenuItemClick}
            onChange={this.handleChange}
            isDefaultQuery={this.selectedQueryObj ? this.selectedQueryObj.default : false}
            isOwner={this.props.isOwner}
            isMobile={this.props.isMobile}
          />
          {this.state.showActions && this.props.isOwner && !this.props.isMobile && (
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
                  {'Save'}
                </Typography>
              )}
              <Typography className="action" onClick={this.handleCreate}>
                {'Save as new'}
              </Typography>
              <Typography className="action" onClick={this.handleCancel}>
                {'Cancel'}
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
                {this.state.successMessages.delete && (
                  <img
                    src={`${process.env.PUBLIC_URL}/images/trash-icon.svg`}
                    className="trash-icon"
                  />
                )}
                <Typography className="message">{this.snackbarMessage()}</Typography>
                {this.state.successMessages.delete && (
                  <Typography onClick={this.handleUndoDelete} className="undo-delete">
                    {'Undo'}
                  </Typography>
                )}
              </div>
            }
            className={classnames(
              'snackbar',
              showSuccessMessage
                ? 'snackbar-success'
                : showErrorMessage
                ? 'snackbar-error'
                : '',
              this.state.successMessages.delete && 'snackbar-warning'
            )}
            ContentProps={{
              classes: { root: 'content-root' },
            }}
            onClose={this.handleSnackbarClose}
            resumeHideDuration={0}
          />
        </Grid>
        <Grid className="flex">
          <Grid className="flex actions-flex">
            {!this.state.showActions && this.props.isOwner && !this.props.isMobile && (
              <ActionsMenu
                actions={this.actions()}
                onClickAction={this.handleClickAction}
                actionsOpen={this.state.isActionsMenuOpen}
                onActionsMenuClick={this.handleActionsMenuClick}
                isDefaultQuery={
                  this.selectedQueryObj ? this.selectedQueryObj.default : false
                }
              />
            )}
            <ExecuteButton
              isRunning={Boolean(subscription)}
              onRun={onRunQuery}
              onStop={onStopQuery}
              operations={operations}
            />
          </Grid>
          <div
            className={classnames('topBarWrap', this.state.docExplorerOpen && 'overlap')}
          >
            {!this.state.docExplorerOpen && (
              <button className="docExplorerShow" onClick={this.props.onToggleDocs}>
                <span className="btnInner">{'Show schema'}</span>
              </button>
            )}
          </div>
        </Grid>
      </Grid>
    )
  }

  /* Validations: 
     - Name can't be empty or taken
     - Query can't be empty or invalid. 
     Note: Duplicate query validation happens on the server
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
        other => other.name !== this.state.selectedQueryName
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
    const queryString = this.state.query.replace(/\s/g, '')
    if (queryString.length === 0) {
      return this.setState(
        Object.assign(this.state.errorMessages, {
          queryEmpty: true,
          showActions: false,
        })
      )
    }
    const errors = document.querySelectorAll('.CodeMirror-lint-mark-error')
    if (errors.length > 0) {
      return this.setState(
        Object.assign(this.state.errorMessages, {
          queryInvalid: true,
        })
      )
    }
  }

  /* Click handlers for different actions */
  // create a query
  handleCreate = async () => {
    this.validateName()
    this.validateQuery()

    const result = await this.props.onCreateQuery({
      name: this.state.selectedQueryName,
      query: this.state.query,
    })

    if (result) {
      this.props.onSelectQuery(this.state.selectedQueryName)
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

  // update existing query
  handleUpdate = async () => {
    this.validateName(true)
    this.validateQuery()

    const result = await this.props.onUpdateQuery({
      id: this.state.selectedQueryObj.id,
      name: this.state.selectedQueryName,
      query: this.state.query,
    })

    if (result) {
      this.props.onSelectQuery(this.state.selectedQueryName)
      this.setState(
        Object.assign(this.state.successMessages, { update: true, showActions: false })
      )
    } else {
      this.setState(
        Object.assign(this.state.errorMessages, { update: true, showActions: true })
      )
    }
  }

  // cancel changes to the query
  handleCancel = async e => {
    e.stopPropagation()
    await this.props.onEditQuery(this.selectedQueryObj.query)
    this.setState({
      selectedQueryName: this.selectedQueryName,
      showActions: false,
      isNewQuery: false,
    })
  }

  // type a new query name
  handleChange = e => {
    if (e.target.value !== this.state.selectedQueryName) {
      this.setState({ showActions: true })
    }
    this.setState({
      selectedQueryName: e.target.value,
    })
  }

  // click on the dropdown menu with queries
  handleMenuItemClick = async (e, value) => {
    const selected = this.findSelectedQuery(this.state.queries, value)
    this.props.onSelectQuery(value)
    // save them in case we need to cancel changes
    this.selectedQueryName = value
    this.selectedQueryObj = selected
    this.props.onEditQuery(selected.query)
    await this.setState({
      selectedQueryName: value,
      open: false,
      selectedQueryObj: selected,
    })
  }

  // click to open the actions menu
  handleActionsMenuClick = e => {
    e.stopPropagation()
    this.setState({
      isActionsMenuOpen: true,
    })
  }

  /* handle actions from the actions menu
   - Share, Set as default and Delete */
  handleClickAction = async (e, value) => {
    await this.setState({
      isActionsMenuOpen: false,
    })
    if (value === 'Share') {
      const url = window.location.href
      await navigator.clipboard.writeText(url)
      this.setState(
        Object.assign(this.state.successMessages, {
          share: true,
        })
      )
    } else if (value === 'Set as default') {
      const result = await this.props.onSelectedAction(
        this.state.selectedQueryObj.id,
        value
      )
      if (result) {
        this.selectedQueryObj = result
        this.setState(
          Object.assign(this.state.successMessages, {
            setDefault: true,
            selectedQueryObj: result,
          })
        )
      } else {
        this.setState(
          Object.assign(this.state.errorMessages, {
            default: true,
          })
        )
      }
    } else if (value === 'Delete') {
      if (this.state.selectedQueryObj.default === true) {
        return this.setState(
          Object.assign(this.state.errorMessages, {
            deleteDefault: true,
          })
        )
      }
      await this.setState(
        Object.assign(this.state.successMessages, {
          delete: true,
          selectedQueryObj: this.defaultQuery(this.props.queries),
          selectedQueryName: this.defaultQuery(this.props.queries).name,
          deleteQuery: true,
        })
      )
      this.props.onSelectQuery(this.state.selectedQueryName)
      this.props.onEditQuery(this.state.selectedQueryObj.query)
    } else if (value === 'New query') {
      this.setState({ selectedQueryName: '', isNewQuery: true })
      this.props.onEditQuery('')
    }
  }

  // handle delete action
  handleDelete = () => {
    this.props.onSelectedAction(this.selectedQueryObj.id, 'Delete')
  }

  // undo deleting if user changes their mind
  handleUndoDelete = async () => {
    await this.props.onSelectQuery(this.selectedQueryName)
    this.setState({
      selectedQueryName: this.selectedQueryName,
      selectedQueryObj: this.selectedQueryObj,
      deleteQuery: false,
    })

    this.props.onEditQuery(this.selectedQueryObj.query)
  }

  // open the actions menu
  handleOpenMenu = e => {
    e.stopPropagation()
    this.setState({
      open: true,
    })
  }

  // when shackbar closes, set all the success and error messages to false
  // so they don't show in the UI
  handleSnackbarClose = () => {
    if (this.state.deleteQuery) {
      this.handleDelete()
    }
    this.setState(
      Object.assign(this.state.successMessages, {
        update: false,
        create: false,
        share: false,
        setDefault: false,
        delete: false,
        deleteQuery: false,
        showActions: false,
      })
    )
    this.setState(
      Object.assign(this.state.errorMessages, {
        nameTaken: false,
        nameEmpty: false,
        create: false,
        update: false,
        queryEmpty: false,
        queryInvalid: false,
        queryTaken: false,
      })
    )
  }

  // pick default query that we can use when there are no other queries
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
    } else if (error.queryEmpty) {
      message = "Query can't be empty"
    } else if (error.queryInvalid) {
      message = 'Query is invalid'
    } else if (error.create || error.queryTaken) {
      message = 'Unable to create query (duplicate)'
    } else if (error.update) {
      message = 'Unable to update query (duplicate)'
    } else if (error.default) {
      message = 'Unable to set the default query'
    } else if (error.deleteDefault) {
      message = "Default query can't be deleted"
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
}
