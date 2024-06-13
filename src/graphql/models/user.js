import { ObjectId } from "mongodb";

export const typeDef =
  /* GraphQL */
  `
    type Query {
      user(id: ID!): User
      users: [User]!
    }

    type Mutation {
      createUser(user: NewUserInput!): User
      deleteUser(id: ID!): Boolean
      updateUser(id: ID!, update: UpdateUserInput): User
    }

    input UpdateUserInput {
      name: String!
    }

    input NewUserInput {
      name: String!
      email: String!
    }

    type User {
      id: ID!
      name: String
      email: String
    }
  `;

export const resolvers = {
  Query: {
    users: (obj, args, { mongo }) => {
      return mongo.users.find().limit(5).toArray();
    },
    user: (obj, { id }, { mongo }) => {
      return mongo.users.findOne({ _id: new ObjectId(id) });
    },
  },

  Mutation: {
    createUser: async (_, { user }, { mongo }) => {
      console.log(user);
      const response = await mongo.users.insertOne(user);
      console.log(user);
      return {
        ...user,
      };
    },
    deleteUser: async (obj, { id }, { mongo }) => {
      await mongo.users.deleteOne({ _id: new ObjectId(id) });
      return true;
    },
    updateUser: async (obj, { id, update }, { mongo }) => {
      await mongo.users.updateOne({ _id: new ObjectId(id) }, { $set: { name: update.name } });
      return mongo.users.findOne({ _id: new ObjectId(id) });
    },
  },
  User: {
    id: (obj) => {
      return obj._id || obj.id;
    },
    name: (obj) => {
      return obj.name.toUpperCase();
    },
  },
};
