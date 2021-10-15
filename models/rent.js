const { client } = require("./connection");

module.exports = {
  create: (params) => {
    const query = `
      INSERT INTO rent
        (tenant_id, apartment_id, cash_id, token, amount) 
      VALUES
        ((SELECT id FROM tenant WHERE id=$1),
          (SELECT id FROM apartment WHERE id=$2), 
          (SELECT id FROM cash WHERE id=$3), 
          $4, $5)`;

    return client.query(query, params);
  },
  findOne: {
    id: (id) => {
      const query = `
        SELECT id, tenant_id, apartment_id, cash_id, token, amount, rented_at
        FROM rent WHERE id=$1`;
      return client.query(query, [id]);
    },
    tenant_id: (tenant_id) => {
      const query = `
        SELECT id, tenant_id, apartment_id, cash_id, token, amount, rented_at 
        FROM rent WHERE tenant_id=$1`;

      return client.query(query, [tenant_id]);
    },
  },
  find: () => {
    const query = `
      SELECT id, tenant_id, apartment_id, cash_id, token, amount, rented_at
      FROM rent`;

    return client.query(query);
  },
  update: (params) => {
    const query = `
    UPDATE rent 
    SET 
      tenant_id=(SELECT id FROM tenant WHERE id=$2),
      apartment_id=(SELECT id FROM apartment WHERE id=$3), 
      cash_id=(SELECT id FROM cash WHERE id=$4), 
      amount=$5, rented_at=current_timestamp 
    WHERE id=$1`;

    return client.query(query, params);
  },
  delete: (id) => {
    const query = `DELETE FROM rent WHERE id=$1`;
    return client.query(query, [id]);
  },
};
