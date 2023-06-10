import { Hono } from 'hono'
import { graphqlServer } from '@hono/graphql-server'
import { serve } from '@hono/node-server'
import schema from './schema';

const app = new Hono()

app.use('/graphql',
  graphqlServer({
    schema,
  })
)

serve(app)
