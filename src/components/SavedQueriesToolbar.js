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
    handleUpdateQuery: PropTypes.func,
    handleSelectedAction: PropTypes.func,
    subscription: PropTypes.any,
    handleRunQuery: PropTypes.func,
    handleStopQuery: PropTypes.func,
    operations: PropTypes.any,
    handleEditQuery: PropTypes.func,
    query: PropTypes.string,
    isEditorFocused: PropTypes.bool,
    isQueryValid: PropTypes.bool,
    isActionsMenuOpen: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      selectedQueryName: this.defaultQuery(props.queries).name,
      selectedQueryObj: this.defaultQuery(props.queries),
      queries: props.queries,
      showActions: props.isEditorFocused,
      isActionsMenuOpen: props.isActionsMenuOpen,
      showCreatedMsg: false,
      showUpdatedMsg: false,
      showSetDefaultMsg: false,
      showShareMsg: false,
      deleteDefaultQuery: false,
      isNameEmpty: false,
      isQueryEmpty: false,
      query: this.props.query,
      showErrorUpdate: false,
      isQueryValid: props.isQueryValid,
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

    if (nextProps.isQueryValid !== this.props.isQueryValid) {
      await this.setState({ isQueryValid: nextProps.isQueryValid })
    }

    if (nextProps.isActionsMenuOpen !== this.state.isActionsMenuOpen) {
      this.setState({ isActionsMenuOpen: nextProps.isActionsMenuOpen })
    }

    // if (nextProps.isEditorFocused) {
    //   this.setState({
    //     showActions: nextProps.isEditorFocused,
    //   })
    // }
  }

  handleCreate = async () => {
    // Empty name or query is not allowed
    if (this.state.selectedQueryName === '') {
      return this.setState({ isNameEmpty: true, showActions: false })
    }

    if (this.state.query === '') {
      return this.setState({ isQueryEmpty: true, showActions: false })
    }
    const result = await this.props.handleCreateQuery({
      name: this.state.selectedQueryName,
      default: false,
    })
    console.log('RESULT: ', result)
    this.setState({ showActions: false, showCreatedMsg: true })
  }

  handleUpdate = async () => {
    const isQueryValid = await this.props.handleValidateQuery()

    // Empty name or query is not allowed
    if (this.state.selectedQueryName === '') {
      return this.setState({ isNameEmpty: true, showActions: false })
    }
    if (this.state.query === '') {
      return this.setState({ isQueryEmpty: true, showActions: false })
    }
    console.log('THIS STATE IS VALID: ', isQueryValid)
    this.setState({ showUpdatedMsg: true, showActions: false })
    // if (this.state.isQueryValid) {
    //   const updateResult = await this.props.handleUpdateQuery({
    //     id: this.state.selectedQueryObj.id,
    //     name: this.state.selectedQueryName,
    //     default: this.state.selectedQueryObj.default,
    //     query: this.state.query,
    //   })

    //   if (updateResult && updateResult.name) {
    //     this.setState({
    //       showUpdatedMsg: true,
    //       showActions: false,
    //       deleteDefaultQuery: false,
    //       showCreatedMsg: false,
    //     })
    //   } else {
    //     this.setState({
    //       selectedQueryName: this.selectedQueryName,
    //       query: this.selectedQuery,
    //       showErrorUpdate: true,
    //     })
    //   }
    // }
  }

  handleCancel = async () => {
    await this.props.handleEditQuery(this.selectedQuery)
    this.setState({
      selectedQueryName: this.selectedQueryName,
      showActions: false,
      isEditorFocused: false,
    })
  }

  showErrors = () => {
    return (
      this.state.isNameEmpty ||
      this.state.isQueryEmpty ||
      this.state.deleteDefaultQuery ||
      this.state.showErrorUpdate
    )
  }

  handleOpenMenu = e => {
    this.setState({
      open: true,
      showCreatedMsg: false,
      showUpdatedMsg: false,
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
    this.setState({
      selectedQueryName: e.target.value,
      showActions: true,
      showCreatedMsg: false,
      showUpdatedMsg: false,
      deleteDefaultQuery: false,
      isNameEmpty: false,
      isQueryEmpty: false,
      deleteDefaultQuery: false,
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
      await this.props.handleSelectedAction(this.state.selectedQueryObj.id, value)
      this.setState({
        showSetDefaultMsg: true,
      })
    } else if (value === 'Delete') {
      if (this.state.selectedQueryObj.default === true) {
        return this.setState({ deleteDefaultQuery: false })
      }
      await this.props.handleSelectedAction(this.state.selectedQueryObj.id, value)
      this.props.handleEditQuery(this.state.selectedQueryObj.query)

      this.setState({
        showSetDefaultMsg: false,
        selectedQueryName: this.defaultQuery(this.props.queries).name,
      })
    } else if (value === 'New query') {
      this.setState({ selectedQueryName: '' })
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
      this.state.showShareMsg

    const showErrorMessage = this.state.isNameEmpty || this.state.isQueryEmpty

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
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={showSuccessMessage || showErrorMessage}
            autoHideDuration={3000}
            message={
              <div className="snackbar-content">
                {showErrorMessage ? (
                  <img
                    className="error-icon"
                    src={`${process.env.PUBLIC_URL}/images/error-icon.svg`}
                  />
                ) : (
                  <span className="option-icon" />
                )}
                <Typography className="message">{this.snackbarMessage()}</Typography>
              </div>
            }
            className={classnames(
              'snackbar',
              showSuccessMessage
                ? 'snackbar-success'
                : showErrorMessage
                ? 'snackbar-error'
                : 'snackbar-warning'
            )}
            ContentProps={{
              classes: { root: 'content-root' },
            }}
            // onClose={this.handleSnackbarClose}
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
