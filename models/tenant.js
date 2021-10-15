const { client } = require("./connection");

module.exports = {
  create: (params) => {
    const query = `
      INSERT INTO tenant
        (full_name, username, email, phone,
          date_of_birth, address_previous_resident) 
      VALUES
        ($1, $2, $3, $4, $5, $6)`;

    return client.query(query, params);
  },
  findOne: {
    id: (id) => {
      const query = `
        SELECT 
          id, full_name, username, email, phone,
          date_of_birth, address_previous_resident,
          created_at, updated_at
        FROM tenant WHERE id=$1`;
      return client.query(query, [id]);
    },
    username: (username) => {
      const query = `
        SELECT 
          id, full_name, username, email, phone,
          date_of_birth, address_previous_resident,
          created_at, updated_at
        FROM tenant WHERE username=$1`;

      return client.query(query, [username]);
    },
  },
  find: () => {
    const query = `
      SELECT 
        id, full_name, username, email, phone,
        date_of_birth, address_previous_resident,
        created_at, updated_at
      FROM tenant`;

    return client.query(query);
  },
  update: {
    username: (params) => {
      const query = `
        UPDATE tenant 
        SET username=$2, updated_at=curtenant_timestamp
        WHERE email=$1`;

      return client.query(query, params);
    },
    details: (params) => {
      const query = `
        UPDATE tenant 
        SET
          full_name=$2, email=$3, phone=$4,
          date_of_birth=$5, address_previous_resident=$6
          updated_at=curtenant_timestamp
        WHERE username=$1`;

      return client.query(query, params);
    },
  },
  delete: (id) => {
    const query = `DELETE FROM tenant WHERE id=$1`;
    return client.query(query, [id]);
  },
};
