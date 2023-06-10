import { makeSchema } from 'nexus'
import { objectType, queryType, mutationType, nonNull, stringArg, intArg, idArg } from 'nexus';
import { PrismaClient } from '@prisma/client'
// import { createUser } from './types/mutation/user';

const prisma = new PrismaClient()

const schema = makeSchema({
  types: [
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
    }),
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
    mutationType({
        definition(t) {
            t.nonNull.field('createUser', {
                type: 'User',
                args: {
                    name: nonNull(stringArg()),
                    email: nonNull(stringArg()),
                },
                resolve(_parent, {name, email}, ctx) {
                    return prisma.user.create({ data: { name, email }})
                },
            })
            t.nonNull.field('deleteUser', {
                type: 'User',
                args: {
                    id: nonNull(intArg()),
                },
                resolve(_parent, {id}, ctx) {
                    return prisma.user.delete({ where: { id }})
                },
            })
            t.nonNull.field('updateUser', {
                type: 'User',
                args: {
                    id: nonNull(intArg()),
                    name: nonNull(stringArg()),
                    email: nonNull(stringArg()),
                },
                resolve(_parent, {id, name, email}, ctx) {
                    return prisma.user.update({ where: { id }, data: { name, email }})
                },
            })
        },
    }),
  ],

});

export default schema;