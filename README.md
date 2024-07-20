# sanity-plugin-repos-to-sanity

> This is a **Sanity Studio V3 dashboard widget plugin

## Installation

```sh
npm install repos-to-sanity @octokit/graphql @sanity/client @tanstack/react-query
or
yarn add repos-to-sanity @octokit/graphql @sanity/client @tanstack/react-query
```

## Usage
Add the repo schema into `repo.ts` and add it to your list of schemaTypes
```typescript
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
#index.ts

import repo from 'repo.ts'
export const schemaTypes = [
  ...,
  repo
] 

```

Inside `utils.ts` initialize the following

```ttypescripts
  
  import {graphql} from '@octokit/graphql'
  
  // sanity client

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

export default defineConfig({
  //...
 plugins: [
    ...,
    dashboardTool({
      widgets: [
        ..., 
        // Add here 
      ],
    }),
  ],
})
```

## License

[MIT](LICENSE) © vinceflores

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.
