const { Client } = require("pg");

const client = new Client({
  connectionString: "postgresql://postgres:postgres@localhost/onetomany"
});

client.connect();

module.exports = client;