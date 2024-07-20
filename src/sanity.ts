import {createClient} from '@sanity/client'
import {Repository} from './github/types'
import {SanityClient} from '@sanity/client'

export interface SanityConfig {
  projectId: string
  dataSet: string
  useCon: boolean
  apiVersion: string
  token: string
}

function generateSanityClient(clientConfig: SanityConfig) {
  return createClient(clientConfig)
}

export async function createRepo(repo: Repository, client: SanityClient, schemaName: string) {
  const doc = {
    _type: schemaName,
    repo_name: repo.name,
    repo_url: repo.url,
    live_url: repo.homepageUrl,
    tags: repo.repositoryTopics.map((tag) => tag.topic) || [],
    languages: repo.languages.map((lang) => lang.name) || [],
  }
  try {
    const result = client.create(doc)
    return result
  } catch (error) {
    throw error
  }
}

