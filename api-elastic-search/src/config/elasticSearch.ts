import { Client } from "@elastic/elasticsearch";


const client = new Client({
  node: 'http://localhost:9200', // or your Elastic endpoint
  // auth: { username: 'elastic', password: 'your-password' } // for secured clusters
});

export default client;