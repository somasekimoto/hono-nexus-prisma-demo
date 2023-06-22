import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import {
  HeaderMap,
  HTTPGraphQLRequest,
  HTTPGraphQLResponse,
} from "@apollo/server";
import { ApolloServer } from "@apollo/server";

// 以下参考に作成
// https://github.com/apollographql/apollo-server/blob/main/packages/server/src/express4/index.ts#L46
export const honoApolloMiddleware = async (
  ctx: Context,
  apollo: ApolloServer
) => {
  let reqBody = null;
  const reqMethod = ctx.req.method.toUpperCase();
  if (reqMethod == "POST") {
    reqBody = await ctx.req.json();
    if (!reqBody) {
      throw new HTTPException(500, { message: "body is not set" });
    }
  }

  const headers = new HeaderMap();
  ctx.req.headers.forEach((value, key) => {
    if (value !== undefined) {
      headers.set(
        key,
        (Array.isArray(value) ? value.join(", ") : value) as string
      );
    }
  });

  const httpGraphQLRequest: HTTPGraphQLRequest = {
    method: reqMethod,
    headers,
    search: new URL(ctx.req.url).search ?? "",
    body: reqBody,
  };

  // console.log("httpGraphQLRequest", httpGraphQLRequest)

  const httpRes: HTTPGraphQLResponse = await apollo.executeHTTPGraphQLRequest({
    httpGraphQLRequest,
    context: async () => ({ req: ctx.req, res: ctx.res }),
  });
  for (const [key, value] of httpRes.headers) {
    ctx.res.headers.set(key, value);
  }
  ctx.status = () => httpRes.status || 200;

  if (httpRes.body.kind === "complete") {
    return ctx.text(httpRes.body.string);
  }

  let chunkedText = "";
  for await (const chunk of httpRes.body.asyncIterator) {
    chunkedText += chunk;
  }
  return ctx.text(chunkedText);
};
