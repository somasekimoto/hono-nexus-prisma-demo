```
npm install
npm run start
```

```
open http://localhost:3000
```

# Request Examples for Graphql with CURL 


Query
```bash
curl --request POST \
    --header 'content-type: application/json' \
    --url http://localhost:3000/graphql \
    --data '{"query":"query  Query{\n  users {\n    id\n    email\n  }\n}"}'
```


Mutation
```bash
curl --request POST \
    --header 'content-type: application/json' \
    --url http://localhost:3000/graphql \
    --data '{"query":"mutation CreateUser($name: String!, $email: String!) {\n  createUser(name: $name, email: $email) {\n    name\n    email\n  }\n}","variables":{"name":"bins","email":"jifoaj@email.com"}}'
```


# Refs
https://github.com/apollographql/apollo-server/blob/main/packages/server/src/express4/index.ts#L46

https://github.com/honojs/middleware/blob/main/packages/graphql-server/src/index.ts#L49