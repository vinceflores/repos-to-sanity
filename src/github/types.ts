import { graphql } from '@octokit/graphql/types'

export interface Repository {
  description: string
  homepageUrl: string
  url: string
  name: string
  languages: languages[]
  repositoryTopics: repositoryTopics[]
}

export type languages = {
  name: string
  color: string
}

export type repositoryTopics = {
  topic: string
}

export type ProfileType = {
  avatarUrl: string
  name: string
}

export type Pagination = {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: string
  endCursor: string
}

export type FetchReposParams = {
  login: string
  graphqlWithAuth: graphql
  first?: number
  isFork?: boolean
  visibility?: 'PUBLIC' | 'PRIVATE'
  before?: string
  after?: string
}

export type FetchReposResponse = {
  totalCount: number
  repoList: Repository[]
  pageInfo: Pagination
}

export type GithubReposProps = {
  login: string
  first?: number
  isFork?: boolean
  visibility?: 'PUBLIC' | 'PRIVATE'
}
