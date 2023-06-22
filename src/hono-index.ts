import { Hono } from 'hono'
import { ApolloServer } from '@apollo/server'
import { serve } from '@hono/node-server'
import schema from './schema';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { cors } from 'hono/cors'
import { honoApolloMiddleware } from './honoApolloMiddleware';
import { graphqlServer } from '@hono/graphql-server';

const app = new Hono()
const nodeServer = serve(app)

async function startServer() {
  
  const apollo = new ApolloServer({
    schema,
plugins: [ApolloServerPluginDrainHttpServer({ httpServer: nodeServer  })]
  })

  await apollo.start()

  app.use('*', cors({
    origin: ['http://localhost:3000'],
  }))
  
  app.get('/hello', async (ctx) => {
    console.log("hello world")
    return ctx.text("Hello World!")
  })
  
  // /graphql endpoint に対しては、GraphQL のリクエストを処理する
  // 以下参考に作成
  // https://github.com/apollographql/apollo-server/blob/main/packages/server/src/express4/index.ts#L46
  app.use('/graphql', async (ctx) => {
    await honoApolloMiddleware(ctx, apollo)
  })

  await new Promise<void>((resolve) => nodeServer.listen({ port: 3000 }, resolve));

}

startServer()

// graphql-server を使う場合は以下のようになる
// app.use('/graphql', graphqlServer({schema}))