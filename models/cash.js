const { client } = require("./connection");

module.exports = {
  create: (params) => {
    const query = `
      INSERT INTO cash
        (tenant_id, token, amount) 
      VALUES
        ((SELECT id FROM tenant WHERE id=$1), $2, $3)`;

    return client.query(query, params);
  },
  findOne: {
    id: (id) => {
      const query = `
        SELECT id, tenant_id, token, amount, paid_at
        FROM cash WHERE id=$1`;
      return client.query(query, [id]);
    },
    tenant_id: (tenant_id) => {
      const query = `
        SELECT id, tenant_id, token, amount, paid_at 
        FROM cash WHERE tenant_id=$1`;

      return client.query(query, [tenant_id]);
    },
  },
  find: () => {
    const query = `
      SELECT id, tenant_id, token, amount, paid_at
      FROM cash`;

    return client.query(query);
  },
  update: (params) => {
    const query = `
    UPDATE cash SET amount=$2, paid_at=current_timestamp WHERE id=$1`;

    return client.query(query, params);
  },
  delete: (id) => {
    const query = `DELETE FROM cash WHERE id=$1`;
    return client.query(query, [id]);
  },
};
