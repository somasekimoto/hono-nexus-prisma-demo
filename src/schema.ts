import { makeSchema } from 'nexus'
import { objectType, queryType, mutationType } from 'nexus';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const schema = makeSchema({
  types: [
    queryType({
        definition(t) {
          t.nonNull.list.nonNull.field('users', {
            type: 'User',
            resolve(_, __, ctx) {
              return prisma.user.findMany()
            },
          })
        },
      }),
    objectType({
      name: "User",
      definition(t) {
        t.nonNull.int('id')
        t.nonNull.string('name')
        t.nonNull.string('email')
        t.nonNull.string('profile')
        t.list.field('users', {
            type: 'User',
            resolve(parent, _args, ctx) {
                return prisma.user.findMany()
            },
        })
      }
    }),
    objectType({
        name: 'Profile',
        definition(t) {
            t.nonNull.int('id')
        },
      })
  ],
});

export default schema;