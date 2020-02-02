import { INetworkResponse } from '../NetworkErrorLink'
import { DocumentNode } from 'apollo-link'

interface Query<TVariables> {
  query: DocumentNode
  variables?: TVariables
}

interface ReadOptions<TVariables = any> extends Query<TVariables> {
  rootId?: string
  previousResult?: any
}

interface WriteOptions<TResult = any, TVariables = any>
  extends Query<TVariables> {
  dataId: string
  result: TResult
}

export interface ICacheShape {
  read<T, TVariables = any>(query: ReadOptions<TVariables>): T | null
  write<TResult = any, TVariables = any>(
    write: WriteOptions<TResult, TVariables>
  ): void
}

export const cacheFirstHandler = (cache: ICacheShape) => ({
  operation,
}: INetworkResponse) => {
  if (!operation.getContext().__skipErrorAccordingCache__) {
    return null
  }

  return cache.read<any>({
    query: operation.query,
    variables: operation.variables,
  })
}
