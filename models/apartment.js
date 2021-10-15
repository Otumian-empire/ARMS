const { client } = require("./connection");

module.exports = {
  create: (params) => {
    const query = `
      INSERT INTO apartment
        (room_number, description, amount) 
      VALUES
        ($1, $2, $3)`;

    return client.query(query, params);
  },
  findOne: {
    id: (id) => {
      const query = `
        SELECT id, room_number, description, amount
        FROM apartment WHERE id=$1`;
      return client.query(query, [id]);
    },
    room_number: (room_number) => {
      const query = `
        SELECT id, room_number, description, amount 
        FROM apartment WHERE room_number=$1`;

      return client.query(query, [room_number]);
    },
  },
  find: () => {
    const query = `
      SELECT id, room_number, description, amount
      FROM apartment`;

    return client.query(query, [id]);
  },
  update: {
    id: (params) => {
      const query = `
        UPDATE apartment 
        SET room_number=$2, description=$3, amount=$4
        WHERE id=$1`;

      return client.query(query, params);
    },
    room_number: (params) => {
      const query = `
        UPDATE apartment 
        SET room_number=$2, description=$3, amount=$4
        WHERE room_number=$1`;

      return client.query(query, params);
    },
  },
  delete: (id) => {
    const query = `DELETE FROM apartment WHERE id=$1`;
    return client.query(query, [id]);
  },
};
