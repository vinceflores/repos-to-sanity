import React from 'react'
// import GithubRepos from './components/githubrepos/GithubRepos'
import {LayoutConfig, DashboardWidget} from '@sanity/dashboard'
import {GithubReposProps} from './github/types'
import {SanityClient} from '@sanity/client'
import {graphql} from '@octokit/graphql/types'
import GithubReposComponent from './components/githubrepos/GithubRepos'

export interface GithubReposListWidgetConfig extends GithubReposProps {
  layout?: LayoutConfig
  client: SanityClient
  graphqlWithAuth: graphql
}

export function GithubReposListWidget(config: GithubReposListWidgetConfig): DashboardWidget {
  return {
    name: 'github_repos-to-sanity',
    component: function component() {
      return <GithubReposComponent {...config} />
    },
    layout: config.layout,
  }
}
