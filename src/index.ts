import { Hono } from 'hono'
import { graphqlServer } from '@hono/graphql-server'
import { serve } from '@hono/node-server'
import schema from './schema';

import { PrismaClient } from '@prisma/client';
 

const app = new Hono()

const prisma = new PrismaClient()

app.get('/create', async (ctx) => {
    await prisma.user.create({
        data: {
          name: "hoge",
          email: new Date().getTime() + "@example.com",
        },
      })
})

app.get("/block", async (ctx) => {

})


app.use(
  '/graphql',
  graphqlServer({
    schema,
  })
)

serve(app)
