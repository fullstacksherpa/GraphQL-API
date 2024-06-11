var express = require("express");
var { createHandler } = require("graphql-http/lib/use/express");
var {
  buildSchema,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  graphql,
} = require("graphql");
var { ruruHTML } = require("ruru/server");

// Construct a schema, using GraphQL schema language
var scchema = buildSchema(`
  type Query {
    hello(name: String): String
	age: Int
	user: User
  }

  type User {
    id: Int
	name: String
  }
`);

const User = new GraphQLObjectType({
  name: "User",
  fields: {
    id: {
      type: GraphQLInt,
    },
    name: {
      type: GraphQLString,
      resolve: (obj) => {
        const name = obj.name.trim().toUpperCase();
        if (obj.isAdmin) {
          return "yes, he is admin";
        }
        return name;
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => {
          return "Hello World";
        },
      },
      user: {
        type: User,
        resolve: () => {
          return {
            id: 1,
            name: "    sherpa      ",
            extra: "hey",
            isAdmin: true,
          };
        },
      },
    },
  }),
});

// The root provides a resolver function for each API endpoint
// var root = {
//   hello(args) {
//     return "Hello " + args.name;
//   },
//   age() {
//     return 25;
//   },
//   user: () => {
//     return {
//       id: 5,
//       name: "Phutila",
//     };
//   },
// };

var app = express();

// Create and use the GraphQL handler.
app.all(
  "/graphql",
  createHandler({
    schema: schema,
  })
);

//serve the graphiQL IDE.
app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});
// Start the server at port
app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
