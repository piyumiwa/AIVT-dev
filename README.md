# AIVT-test

## Installing PostgreSQL in local PC

Here's the guide to launch the pgAdmin DB in your PC. 

1. Install `postgreSQL` in local PC using [this tutorial.](https://www.geeksforgeeks.org/postgresql-installing-postgresql-without-admin-rights-on-windows/)
2. After verifying the installation, the database can be initialize and associate a user. The command for this is mentioned below with the user called `postgres`.

```
initdb -D C:\Users\pweebadu23\Documents\postgresql\postgresql-17.0-1\pgsql\data -U postgres -E utf8
```

3. Start the Postgres server using below command.

``` cli
pg_ctl -D C:\Users\pweebadu23\Documents\postgresql\postgresql-17.0-1\pgsql\data -l logfile start  
```

3. The server shoud be started after this step. Then, the user can connect to `postgres` server using below command. 

```
psql -U postgres
```

4. Here the user is defined as `postgres`. Then the database can be configiured as usual. 

The authentication has been configured using a 3rd party platform called [Auth0](https://auth0.com/docs). `auth0` is configured in a basic personal account but in development environment the account can be changed to a premium account.
I have changed the database tables from the [previous version](https://github.com/PiyumiUoR/AIVT?tab=readme-ov-file#deploying-the-database) due to the usage of `auth0` for the user authentication.  The new `Reporter` table appears as below. 

```sql
CREATE TABLE Reporter (
    reporterId VARCHAR(255),
    name VARCHAR(255),
    email VARCHAR(255),
    organization VARCHAR(255)
);
```

The `email` and the `reporterId` has been extracted from the `auth0` database now. 

## Installing PostgreSQL in ubuntu server

1. Install PostgreSQL. ([PostgreSQL's official website](https://www.postgresql.org/download/))
2. Upon completion of the installation, use below command to start the `postgresql` server.
    ```cli
    pg_ctl -D C:\Users\pweebadu23\Documents\postgresql\postgresql-17.0-1\pgsql\data -l logfile start
    ```
2. Open a terminal or command prompt and connect to PostgreSQL using the `psql` command. Replace `username` with your PostgreSQL username. Bydefault it's `postgres`.
   ```sh
   psql -U postgres
   ```
3. Execute the following SQL commands to create a new database.
    ```sql
    CREATE DATABASE aivtdb
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

    -- Connect to the newly created database
    \c aivtdb
    ```