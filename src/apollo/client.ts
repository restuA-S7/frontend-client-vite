import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "https://projectbackend-production-adc8.up.railway.app/graphql/", // Ganti dengan URL GraphQL kamu
  cache: new InMemoryCache(),
});
