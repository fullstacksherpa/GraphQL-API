export const typeDef = /* GraphQL */ `
  type Query {
    comments: [Comment]
  }

  type Comment {
    _id: ID
    text: String
    email: String

    user: User
  }
`;

export const resolvers = {
  Query: {
    comments: (obj, args, { mongo }) => {
      return mongo.comments.find().toArray();
    },
  },

  Comment: {
    user: ({ email }, args, { mongo }) => {
      return mongo.users.findOne({ email });
    },
  },
};
