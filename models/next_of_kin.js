const { client } = require("./connection");

module.exports = {
  create: (params) => {
    const query = `
      INSERT INTO next_of_kin
        (tenant_id, full_name, email, phone, address) 
      VALUES
        ((SELECT id FROM tenant WHERE id=$1), 
          $2, $3, $4, $5)`;

    return client.query(query, params);
  },
  findOne: (id) => {
    const query = `
      SELECT
        id, tenant_id, full_name, email, phone, address
      FROM next_of_kin WHERE id=$1`;
    return client.query(query, [id]);
  },
  find: () => {
    const query = `
      SELECT 
        id, tenant_id, full_name, email, phone, address
      FROM next_of_kin`;

    return client.query(query);
  },
  update: (params) => {
    const query = `
      UPDATE next_of_kin 
      SET full_name=$2, email=$3, phone=$4, address=$5
      WHERE id=$1`;

    return client.query(query, params);
  },
  delete: (id) => {
    const query = `DELETE FROM next_of_kin WHERE id=$1`;
    return client.query(query, [id]);
  },
};
