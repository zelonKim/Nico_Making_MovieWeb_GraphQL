import { ApolloServer, gql } from "apollo-server";
import fetch from "node-fetch";

let tweets = [
  {
    id: "1",
    text: "first one!",
    userId: "2",
  },
  {
    id: "2",
    text: "second one",
    userId: "1",
  },
];


let users = [
  {
    id: "1",
    firstName: "nico",
    lastName: "las",
  },
  {
    id: "2",
    firstName: "Elon",
    lastName: "Mask",
  },
];



/////////////////////////



const typeDefs = gql`

  type Query {
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet

    allUsers: [User!]!

    allMovies: [Movie!]!
    movie(id: String!): Movie

  }


  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }



  type Tweet {
    id: ID!
    text: String!
    author: User
  }


  type User {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
  }

  

  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
  }
`;



//////////////////////



// GET  /api/v1/tweets
// POST DELETE PUT  /api/v1/tweets
// GET  /api/v1/tweet/:id

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },

    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },

    allUsers() {
      console.log("all Users called!");
      return users;
    },

    allMovies() {
      return fetch("https://yts.mx/api/v2/list_movies.json")
        .then((r) => r.json())
        .then((json) => json.data.movies);
    },

    movie(_, { id }) {
      return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
        .then((r) => r.json())
        .then((json) => json.data.movie);
    },
  },

  
  Mutation: {
    postTweet(_, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text,
        userId,
      };
      tweets.push(newTweet);
      return newTweet;
    },

    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },




  User: {
    fullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`;
    },
  },


  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};


/////////////////////


const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
