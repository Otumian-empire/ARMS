require("dotenv").config();
const { Client } = require("pg");

const client = new Client();

(async () => {
  await client
    .connect()
    .then(() => console.log("Database connected\ndropping all tables"))
    .catch((err) => console.error("connection error", err.stack));

  // add sesseion later
  await client
    .query(
      `drop table if exists rent,
        cash, 
        next_of_kin,
        admin,
        apartment,
        tenant cascade;`
    )
    .then((d) => console.log(d.command + " all tables"))
    .catch((err) => console.error(err.stack));

  console.log("-------------- Creating new databases --------------");

  /* 
  created_at timestamp without time zone default current_timestamp not null,
  updated_at timestamp without time zone */

  // ADMIN table
  await client
    .query(
      `create table admin(
        id serial primary key,
        username varchar(150) not null,
        email varchar(255) not null unique,
        password varchar(255) not null
      );`
    )
    .then((d) => console.log(d.command + " admin"))
    .catch((err) => console.error(err.stack));

  // APARTMENT table
  await client
    .query(
      `create table apartment(
        id serial primary key,
        room_number varchar(5) not null,
        description varchar(500),
        amount varchar(255) not null
      );`
    )
    .then((d) => console.log(d.command + " apartment"))
    .catch((err) => console.error(err.stack));

  // TENANT table
  await client
    .query(
      `create table tenant(
        id serial primary key,
        full_name varchar(150) not null,
        username varchar(150) not null,
        email varchar(255) not null unique,
        phone varchar(25) not null,
        date_of_birth varchar(25) not null,
        address_previous_resident varchar(255) not null,
        created_at timestamp without time zone default current_timestamp not null,
        updated_at timestamp without time zone
      );`
    )
    .then((d) => console.log(d.command + " tenant"))
    .catch((err) => console.error(err.stack));

  // NEXT OF KIN table -fk
  await client
    .query(
      `create table next_of_kin(
        id serial primary key,
        tenant_id int references tenant(id) on delete cascade on update cascade not null,
        full_name varchar(150) not null,
        email varchar(255) not null unique,
        phone varchar(25)  not null,
        address varchar(255) not null
    );`
    ).then((d) => console.log(d.command + " next_of_kin"))
    .catch((err) => console.error(err.stack));

  // CASH table - fk
  await client
    .query(
      `create table cash(
          id serial primary key,
          tenant_id int references tenant(id) on delete cascade on update cascade not null,
          token uuid not null,
          amount real not null,
          paid_at timestamp without time zone default current_timestamp not null
        );`
    ).then((d) => console.log(d.command + " cash"))
    .catch((err) => console.error(err.stack));

  // RENT table - fk
  // evacuate_at timestamp without time zone default current_timestamp not null
  await client
    .query(
      `create table rent(
        id serial primary key,
        tenant_id int references tenant(id) on delete cascade on update cascade not null,
        apartment_id int references apartment(id) on delete cascade on update cascade not null unique,
        cash_id int references cash(id) on delete cascade on update cascade not null unique,
        rented_at timestamp without time zone default current_timestamp not null
      );`
    ).then((d) => console.log(d.command + " rent"))
    .catch((err) => console.error(err.stack));

  // disconnects database
  await client
    .end()
    .then(() => console.log("Tables created\nDatabase disconnected"))
    .catch((err) => console.error(err));
})();
