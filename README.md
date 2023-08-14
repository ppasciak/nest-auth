# NestJS JWT authorization service

## Features
Service allows for CRUD operations on users, login, logout and regenerating access JWT tokens. 

All endpoints with descriptions are listed in the [queries.rest](queries.rest) file. If you are using VSC, you can install [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension to run these directly from the file. 

## Environmental variables
Variables in the .env file:
- **DATABASE_URL** - used by Prisma client to connect to the database
- **JWT_TOKEN** - used to encrypt and decrypt the JWT access token
- **JWT_REFRESH_TOKEN** - used to encrypt and decrypt the JWT refresh token
- **JWT_EXP_TIME** - expiration time of the JWT access token, (refresh tokens does not have expiration time)

## Setup
Most convenient way to run the procjet is using docker:
```
docker compose up
```

## Stack
- **NestJS** as backend framework
- **bcrypt** to hash user passwords
- **JWT** to authenticate users
- **MySQL** as database
- **Docker** for easier development
- **Prisma** as ORM mapping

