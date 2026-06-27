const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { useServer } = require("graphql-ws/lib/use/ws");
const { createServer } = require("http");
const { WebSocketServer } = require("ws");
const mongoose = require("mongoose");
const { typeDefs } = require("./schema/typeDefs");
const resolvers = require("./resolvers");
require("dotenv").config();
async function bootstrap() {
  await mongoose.connect(process.env.MONGODB_URI);
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const app = express();
  const httpServer = createServer(app);
  const wsServer = new WebSocketServer({ server: httpServer, path: "/graphql" });
  useServer({ schema }, wsServer);
  const server = new ApolloServer({ schema });
  await server.start();
  app.use(cors()); app.use(express.json());
  app.use("/graphql", expressMiddleware(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization?.replace("Bearer ","");
      return { token, userId: token ? require("jsonwebtoken").verify(token, process.env.JWT_SECRET)?.id : null };
    },
  }));
  httpServer.listen(4000, () => console.log("CodeCollab GraphQL server on :4000"));
}
bootstrap().catch(console.error);
