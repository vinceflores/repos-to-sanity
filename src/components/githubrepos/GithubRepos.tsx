import {createContext, MouseEventHandler, useContext, useEffect, useMemo, useState} from 'react'
import {DashboardWidgetContainer} from '@sanity/dashboard'
import {fetchRepos} from '../../github/index'
import {FetchReposResponse, GithubReposProps, Pagination, Repository} from '../../github/types'
import {useCallback} from 'react'
import {createRepo, SanityConfig} from '../../sanity'
import {GithubReposListWidgetConfig} from '../../plugin'
import {SanityClient} from '@sanity/client'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from '@tanstack/react-query'
import {Button, PaginationButtons} from './styled'

const SanityContext = createContext<{
  client: SanityClient | {}
}>({
  client: {},
})

export default function GithubReposComponent(props: GithubReposListWidgetConfig) {
  const queryClient = new QueryClient()
  return (
    <DashboardWidgetContainer header="Github Repos">
      <QueryClientProvider client={queryClient}>
        <GithubRepos {...props} />
      </QueryClientProvider>
    </DashboardWidgetContainer>
  )
}

function GithubRepos(props: GithubReposListWidgetConfig) {
  const [totalCount, setTotalCount] = useState(0)
  const [currentCount, setCurrentCount] = useState(0)
  const {login, client, graphqlWithAuth, first, isFork, visibility} = props
  const queryClient = useQueryClient()

  async function fetchTheRepos({
    pageParam,
    first,
    login,
    isFork,
    visibility,
  }: {
    pageParam: string
    login: string
    first: number
    isFork: boolean
    visibility: 'PUBLIC' | 'PRIVATE'
  }): Promise<{
    data: FetchReposResponse
    currentPage: string
    endCursor: string
    prevCursor: string
  }> {
    const {pageInfo, repoList, totalCount} = await fetchRepos({
      login,
      graphqlWithAuth,
      first,
      isFork,
      visibility,
      after: pageParam,
    })

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {repoList, totalCount, pageInfo},
          currentPage: pageParam,
          endCursor: pageInfo.endCursor,
          prevCursor: pageInfo.startCursor,
        })
      }, 1000)
    })
  }

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,

    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['repositories', login, isFork, visibility],
    queryFn: ({pageParam}) =>
      fetchTheRepos({
        pageParam,
        first: first!,
        login,
        visibility: visibility!,
        isFork: isFork!,
      }),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.endCursor,
  })

  return (
    <>
      <SanityContext.Provider
        value={{
          client,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
          }}
        >
          <p>Totalcount: {data?.pages[0].data.totalCount} </p>
          <Button onClick={() => fetchNextPage()}>Next</Button>
        </div>
        <div
          style={{
            height: '300px',
            overflow: 'scroll',
          }}
        >
          {data?.pages.map((page) => {
            return (
              <div key={page.currentPage}>
                {page?.data.repoList?.map((repo: Repository, i: number) => (
                  <RepoRow key={i} repo={repo} />
                ))}
              </div>
            )
          })}
        </div>
      </SanityContext.Provider>
    </>
  )
}

const RepoRow = ({repo}: {repo: Repository}) => {
  const {client} = useContext(SanityContext)
  const addRepo = useCallback(async () => {
    const result = await createRepo(repo, client as SanityClient, 'repo')
    if (result) {
      alert('Success')
    }
  }, [repo])

  return (
    <div
      style={{
        display: 'flex',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <p>{repo.name}</p>
      <Button onClick={addRepo}>Publish</Button>
    </div>
  )
}
