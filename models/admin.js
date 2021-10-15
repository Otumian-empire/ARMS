const { client } = require("./connection");

module.exports = {
  create: (params) => {
    const query = `
      INSERT INTO admin
        (username, email, password) 
      VALUES
        ($1, $2, $3)`;

    return client.query(query, params);
  },
  findOne: {
    id: (id) => {
      const query = `SELECT id, username, email FROM users WHERE id=$1`;
      return client.query(query, [id]);
    },
    username: (username) => {
      const query = `
        SELECT id, username, email, password 
        FROM users WHERE username=$1`;

      return client.query(query, [username]);
    },
  },
  find: () => {
    const query = `
      SELECT 
        id, unique_id, full_name, email, password,
        user_type, phone, confirmed_email  
      FROM users`;

    return client.query(query, [id]);
  },
  update: {
    password: (params) => {
      const query = `UPDATE admin SET password=$2 WHERE username=$1`;
      return client.query(query, params);
    },
    email: (params) => {
      const query = `UPDATE admin SET email=$2 WHERE username=$1`;
      return client.query(query, params);
    },
  },
  delete: (username) => {
    const query = `DELETE FROM admin WHERE username=$1`;
    return client.query(query, [username]);
  },
};
