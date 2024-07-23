> This is a **Sanity Studio v3** plugin.

# repos-to-sanity

> This is a \*\*Sanity Studio V3 dashboard widget plugin

This plugin allows you to import a github repository into your Sanity Studio CMS with just a click of a button.

![alt text](<Dashboard _ vinceflores_ca.jpeg>)

## Requirements

if `@sanity/dashboard` has not been installed.

```
npm i @sanity/dashboard
```

or

```
yarn add @sanity/dashboard
```

## Installation

```sh
npm install repos-to-sanity @octokit/graphql @sanity/client @tanstack/react-query
or
yarn add repos-to-sanity @octokit/graphql @sanity/client @tanstack/react-query
```

## Usage

Add the repo schema into `repo.ts` and add it to your list of schemaTypes

```typescript
// repo.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'repo',
  title: 'Repo',
  type: 'document',
  fields: [
    defineField({
      name: 'preview',
      title: 'Preview',
      type: 'image',

      description: 'Preview of the live site',
    }),
    defineField({
      name: 'repo_name',
      title: 'Reposityory Name',
      type: 'string',
      description: 'please use the name of the reposityory from github',
    }),
    defineField({
      name: 'repo_url',
      title: 'URL',
      type: 'string',
      description: 'This is the link to your repository',
    }),
    defineField({
      name: 'live_url',
      title: 'Live',
      type: 'string',
      description: 'This is the link to your repository',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      description: 'This is where the tags go',
    }),
    defineField({
      name: 'languages',
      title: 'Languages',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Ex: JavaScript, Python, Go',
    }),
  ],
})
```

```typescript
// index.ts

import repo from 'repo.ts'
export const schemaTypes = [
  ...,
  repo
]

```

> ###### Note: Be careful with your environment variables as `SANITY_STUDIO` prefix may expose them in the client side. Please refer to [sanity docs](https://www.sanity.io/docs/environment-variables)
>
> Copy into `utils.ts` to initialize necessary clients

```ttypescripts
//utils.ts
import {createClient} from '@sanity/client'
import {graphql} from '@octokit/graphql'

// sanity client
export const sanityClient = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_.DATASET,
  useCdn: false, // set to `false` to bypass the edge cache
  apiVersion: '2023-05-03', // use current date (YYYY-MM-DD) to target the latest API version
  token: process.env.SANITY_STUDIO_.SANITY_SECRET_TOKEN
})

// github graphql with auth
export const graphqlWithAuth = graphql.defaults({
      headers: {
        authorization: 'bearer ' + process.env.SANITY_STUDIO_GITHUB_TOKEN,
      },
})

```

Add it as a widget within `dashboard` in `sanity.config.ts` (or .js):

```typescript
import {defineConfig} from 'sanity'
import {sanityClient,graphqlWithAuth } from '@/utils.ts'
import {
  dashboardTool,
} from '@sanity/dashboard'
import {GithubReposListWidget} from 'repos-to-sanity'

export default defineConfig({
  //...
 plugins: [
    ...,
    dashboardTool({
      widgets: [
        ...,
        // Example Here
        GithubReposListWidget({
          sanityClient,
          graphqlWithAuth,
          login: "GITHUB_USERNAME",
          first: 5,
          layout: {
            width: "auto",
            height: "auto"
          }
        }),
      ],
    }),
  ],
})
```

## Configuration

| Name            | Description                                               | Type                                                             |
| --------------- | --------------------------------------------------------- | ---------------------------------------------------------------- |
| cleint          | The sanity client instance to be used to perform queries. | SanityClient                                                     |
| first           | The first `n` repositories to be fetched `Default = 15 `. | number                                                           |
| graphqlWithAuth | The octokit client used to fetch github's graphql api.    | graphql                                                          |
| login           | The github login, for example 'vinceflores'               | string                                                           |
| isFork          | Determines if a repository is a fork                      | boolean                                                          |
| visibility      | The visibility of the repository. 'PUBLIC' or 'PRIVATE'   | string                                                           |
| layout          | Configures the `width` and `height` of the widget         | `width`/`height` : ['auto', 'full', 'large', 'small', 'medium' ] |

## License

[MIT](LICENSE) © vinceflores

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.

### Release new version

Run ["CI & Release" workflow](TODO/actions/workflows/main.yml).
Make sure to select the main branch and check "Release new version".

Semantic release will only release on configured branches, so it is safe to run release on any branch.
