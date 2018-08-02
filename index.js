const { ApolloServer, gql } = require('apollo-server');

const bucketList = [
  {
    id: 1,
    description: 'Eat a banana',
    completed: true,
  },
  {
    id: 2,
    description: 'Skydiving',
    completed: false,
  },
  {
    id: 3,
    description: 'Bungee-jumping',
    completed: false,
  },
];

const typeDefs = gql`
  type BucketBullet {
    id: ID!
    description: String
    completed: Boolean
  }

  type Query {
    bucketBullets: [BucketBullet]
  }

  type Mutation {
    addBullet(description: String): BucketBullet
    toggleBullet(id: Int): BucketBullet
  }
`;

const resolvers = {
  Query: {
    bucketBullets: () => bucketList,
  },
  Mutation: {
    addBullet(parent, args, context, info){
      const maxId = Math.max(...bucketList.map(o => o.id));
      const newBullet = {id: (maxId+1), description: args.description, completed: false};
      bucketList.push(newBullet);
      return newBullet;
    },
    toggleBullet(parent, args, context, info){
      const match = bucketList.find(o => o.id === args.id);
      if (!match) throw new Error("No bullet found with this ID");
      match.completed = !match.completed;
      return match;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});