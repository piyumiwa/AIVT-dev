# Useful commands in PostgreSQL

## 1. Connect to the server

```
sudo -i -u postgres
```

`postgres` is the username which was provided earlier. 

## 2. After connecting to the server, connect to the database using `psql` interface. The terminal look like below. 

```cli
postgres@aivt:~$ psql
psql (16.8 (Ubuntu 16.8-0ubuntu0.24.04.1))
Type "help" for help.

postgres=#
```

## 3. List available DBs. 

```
postgres=# \l
                                                   List of databases
   Name    |  Owner   | Encoding | Locale Provider | Collate |  Ctype  | ICU Locale | ICU Rules |   Access privileges   
-----------+----------+----------+-----------------+---------+---------+------------+-----------+-----------------------
 aivtdb    | postgres | UTF8     | libc            | C.UTF-8 | C.UTF-8 |            |           | 
 postgres  | postgres | UTF8     | libc            | C.UTF-8 | C.UTF-8 |            |           | 
 template0 | postgres | UTF8     | libc            | C.UTF-8 | C.UTF-8 |            |           | =c/postgres          +
           |          |          |                 |         |         |            |           | postgres=CTc/postgres
 template1 | postgres | UTF8     | libc            | C.UTF-8 | C.UTF-8 |            |           | =c/postgres          +
           |          |          |                 |         |         |            |           | postgres=CTc/postgres
(4 rows)
```

## 4. Connect to your database. 

```
postgres=# \c aivtdb
You are now connected to database "aivtdb" as user "postgres".
aivtdb=# 
```

## 5. List available tables.

```
aivtdb=# \dt
              List of relations
 Schema |      Name       | Type  |  Owner   
--------+-----------------+-------+----------
 public | admin_review    | table | postgres
 public | all_attributes  | table | postgres
 public | artifact        | table | postgres
 public | attribute       | table | postgres
 public | attribute_names | table | postgres
 public | effect          | table | postgres
 public | reporter        | table | postgres
 public | vul_phase       | table | postgres
 public | vul_report      | table | postgres
(9 rows)

aivtdb=# 
```

## 6. Details of a single table

There are two options to check out the details of the tables as `\d` and `\d+`

```
aivtdb=# \d reporter
                                   Table "public.reporter"
    Column    |          Type          | Collation | Nullable |            Default            
--------------+------------------------+-----------+----------+-------------------------------
 reporterid   | character varying(255) |           | not null | 
 name         | character varying(255) |           |          | 
 email        | character varying(255) |           |          | 
 organization | character varying(255) |           |          | 
 role         | character varying(50)  |           |          | 'reporter'::character varying
Indexes:
    "reporter_pkey" PRIMARY KEY, btree (reporterid)
Referenced by:
    TABLE "admin_review" CONSTRAINT "admin_review_adminid_fkey" FOREIGN KEY (adminid) REFERENCES reporter(reporterid)
    TABLE "vul_report" CONSTRAINT "vul_report_reporterid_fkey" FOREIGN KEY (reporterid) REFERENCES reporter(reporterid)
```

## 7. List all schemas 

```
\dn
```

## 8. List users 

```
\du
```

or for more details;

```
\du <username>
```



