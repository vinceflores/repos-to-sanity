import {graphql} from '@octokit/graphql'
import type {GraphQlQueryResponseData} from '@octokit/graphql'
import {FetchReposResponse, FetchReposParams, Pagination, Repository} from './types'

export async function fetchRepos({
  login,
  graphqlWithAuth,
  first = 15,
  isFork = false,
  visibility = 'PUBLIC',
  after = '',
  before = '',
}: FetchReposParams): Promise<FetchReposResponse> {
  try {
    const {user} = await graphqlWithAuth<GraphQlQueryResponseData>(
      `
                query {
                  user(login:  "${login}" ){
                    repositories(
                    first:  ${first},
                    isFork: ${isFork},
                    before: "${before!}",
                    after: "${after!}",
                    visibility: ${visibility},
                    orderBy: {
                        direction:  DESC, 
                        field: UPDATED_AT
                    }){
                        totalCount,
                        pageInfo{
                          hasNextPage,
                          hasPreviousPage, 
                          startCursor, 
                          endCursor
                      }, 
                        nodes{
                          description,
                          homepageUrl,
                          url, 
                          name,
                          languages(first: 10 , orderBy: {
                              direction: DESC, 
                              field: SIZE
                          }){
                              nodes{
                                  name, color 
                              }
                          }
                            # end of languages 
                          repositoryTopics(first: 20){
                              nodes{
                                  topic{
                                    name 
                                  }
                              }
                          }
                        }
                    }
                }
              
              } 
      `,
    )

    const result: Repository[] = user?.repositories?.nodes.map((node: any) => {
      const {languages, repositoryTopics} = node
      return {
        ...node,
        languages: languages.nodes,
        repositoryTopics: repositoryTopics.nodes.map((topic: {topic: {name: string}}) => ({
          topic: topic.topic.name,
        })),
      }
    })

    return {
      totalCount: user?.repositories.totalCount,
      pageInfo: user?.repositories.pageInfo,
      repoList: result,
    }
  } catch (error) {
    console.log("error", error)
    throw error
  }
}
