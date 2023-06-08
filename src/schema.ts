// import * as path from 'path';
import { makeSchema } from 'nexus'
import { objectType, queryType } from 'nexus';
import { User, Profile } from 'nexus-prisma';
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
      name: User.$name,
      description: User.$description,
      definition(t) {
        t.field(User.id)
        t.field(User.name)
        t.field(User.email)
        t.field(User.profile)
     // t.field(User.id.name, User.id)    <-- For nexus@=<1.0 users
      }
    }),
    objectType({
        name: Profile.$name,
        definition(t) {
          t.field(Profile.id)
        },
      })
  ],
});

export default schema;