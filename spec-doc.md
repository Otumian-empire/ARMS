# ARMS - Ashita Rent Management Sysetem

This document details the database specifications and design of ARMS.

## Model objects

### apartment (room)

- ID
- room_number - what is the room's number? (4 chars)
- description
- fee - how much the room costs?

### admin

- ID
- username
- email (Would be used to send and receive emails)
- password

### tenant

- ID
- full name
- username
- password
- email
- mobile number
- date of birth
- address of previous residence
- date created
- next of kins
  <!-- for the sake of reusing the same data set
  with a new sql database, it is better not to nest
  any value -->
  - full name
  - email
  - mobile number
  - address

### cash

This is a document for all cash paid buy tenants. It can also be used as reference of dispute.

- ID
- tenant ID
- amount
- date paid

### rent

- ID
- apartment ID - what is the room's number? (Unique)
- tenant ID - who is in the room?
- cash ID - how much paid
- date rented - when the room was given out?
- date to evacuate - when the tenant should move out?

## .env

Create a `.env` file and add the following data:

- JWT_SECRET=''
- REFRESH_JWT_SECRET=''
- MONGODB_URI=''
- SALT_ROUNDS=''
