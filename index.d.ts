import * as React from 'react'

type SavedQuery = {
  id: string
  name: string
  query: string
  default?: boolean
  subgraphId?: number
  versionoId?: string
}

export interface GraphiQLProps {
  fetcher?: (graphQLParams: any) => Promise<any>
  schema?: any
  query?: string
  variables?: string
  operationName?: string
  response?: string
  storage?: {
    getItem: (key: string) => any
    setItem: (key: string, value: any) => void
    removeItem: (key: string) => void
  }
  defaultQuery?: string
  onEditQuery?: () => void
  onEditVariables?: () => void
  onEditOperationName?: () => void
  onToggleDocs?: () => void
  getDefaultFieldNames?: () => void
  editorTheme?: string
  onToggleHistory?: () => void
  ResultsTooltip?: any
  defaultTypeOrField: string
  savedQueries: Array<SavedQuery>
  handleUpdateQuery: (query: SavedQuery) => Promise<SavedQuery>
  handleCreateQuery: (query: SavedQuery) => Promise<SavedQuery>
  handleSelectedAction: (id: number, value: string) => void
  isActionsMenuOpen?: boolean
  versionId: string
  selectedQueryName?: string
}
declare class GraphiQL extends React.Component<GraphiQLProps, any> {}
export default GraphiQL
