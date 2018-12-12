import * as React from 'react'

export interface GraphiQLProps {
  fetcher?: (graphQLParams: any) => Promise<any>,
  schema?: any,
  query?: string,
  variables?: string,
  operationName?: string,
  response?: string,
  storage?: {
    getItem: () => void,
    setItem: () => void,
    removeItem: () => void,
  },
  defaultQuery?: string,
  onEditQuery?: () => void,
  onEditVariables?: () => void,
  onEditOperationName?: () => void,
  onToggleDocs?: () => void,
  getDefaultFieldNames?: () => void,
  editorTheme?: string,
  onToggleHistory?: () => void,
  ResultsTooltip?: any,
}
declare class GraphiQL extends React.Component<GraphiQLProps, any> {}
export default GraphiQL