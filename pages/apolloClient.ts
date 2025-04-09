import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
	uri: "/api/graphql", // Change to your GraphQL server URI
	cache: new InMemoryCache(),
});

export default client;
