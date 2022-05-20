# ARMS - Ashita Rent Management Sysetem

This document details the database specifications and design of ARMS.

## Model objects

### admin

- ID - row count
- username
- email (Would be used to send and receive emails)
- password

### apartment (room)

- ID
- room_number - what is the room's number? (4 chars)
- description
- amount - how much the room costs?

### tenant

- ID
- full name
- username
- password
- email
- phone
- date of birth
- address of previous residence
- date created (created_at)
- date updated (updated_at)

### next of kins

- ID
- tenant_id
- full name
- email
- phone
- address

### cash

This is a document for all cash paid buy tenants. It can also be used as reference of dispute.

- ID
- tenant ID
- token
- amount
- date paid - paid_at

### rent

- ID
- tenant ID - who is in the room?
- apartment ID - what is the room's number? (Unique)
- cash ID - how much paid
- date rented - rented_at - when the room was given out?
- date to evacuate - when the tenant should move out? (this should be done programmatically) month of rented date + (total / cost)

## .env

Create a `.env` file in the root folder and add the following data:

- JWT_SECRET=''
- REFRESH_JWT_SECRET=''
- SALT_ROUNDS=''
- MONGODB_URI=''
