# AIVT-test

## Installing PostgreSQL in local Windows PC

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

<!-- ## Installing PostgreSQL in ubuntu server

1. Install PostgreSQL. ([PostgreSQL's official website](https://www.postgresql.org/download/))
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
    ``` -->

## Deploying the system in CSC VM

Here's an enhanced version of your `README.md` file, which provides a detailed description of the entire process, including setting up the VM, installing necessary packages, configuring the backend and frontend, and managing the services using PM2 and Nginx.

### Prerequisites

Before deploying the AIVT system, ensure that your environment meets the following prerequisites:

- Ubuntu 20.04 or later
- Node.js and npm
- PostgreSQL
- Nginx
- PM2

### Setting Up the Environment

#### Step 1: Update and Upgrade Your System

First, update and upgrade your system packages to ensure everything is up to date:

```bash
sudo apt update
sudo apt upgrade
```

#### Step 2: Install Required Packages

Install Node.js, npm, and Nginx:

```bash
sudo apt install nodejs npm nginx
```

Check the installed versions:

```bash
node -v
npm -v
```

#### Step 3: Set Up the Backend

1. **Clone the AIVT Repository:**

   ```bash
   git clone https://github.com/PiyumiUoR/AIVT.git
   cd AIVT/backend/
   ```

2. **Install Backend Dependencies:**

   ```bash
   npm install
   ```

3. **Set Up PM2 to Manage the Backend Process:**

   Install PM2 globally:

   ```bash
   sudo npm install -g pm2
   ```

   Start the backend server using PM2:

   ```bash
   pm2 start server.js --name backend
   ```

   Set up PM2 to run on startup:

   ```bash
   pm2 startup
   pm2 save
   ```

#### Step 4: Set Up the Frontend

1. **Navigate to the Frontend Directory:**

   ```bash
   cd ../frontend/
   ```

2. **Install Frontend Dependencies:**

   ```bash
   npm install
   ```

3. **Build the Frontend:**

   Build the frontend for production:

   ```bash
   npm run build
   ```

#### Step 5: Configure Nginx

1. **Create an Nginx Configuration for the React Frontend:**

   Open the Nginx configuration file:

   ```bash
   sudo nano /etc/nginx/sites-available/react-frontend
   ```

   Add the following configuration to serve the React app:

   ```nginx
   server {
    listen 80;
    server_name 192.16.1.105 86.50.169.201;

    root /home/ubuntu/AIVT/frontend/build;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    client_max_body_size 50M;

    error_log  /var/log/nginx/vue-app-error.log;
    access_log /var/log/nginx/vue-app-access.log;
    error_page 404 /404.html;
   }
   ```

2. **Enable the Nginx Configuration:**

   Create a symbolic link to enable the configuration:

   ```bash
   sudo ln -s /etc/nginx/sites-available/react-frontend /etc/nginx/sites-enabled/
   ```

3. **Test and Restart Nginx:**

   Test the Nginx configuration for syntax errors:

   ```bash
   sudo nginx -t
   ```

   Restart Nginx to apply the changes:

   ```bash
   sudo systemctl restart nginx
   ```

4. **Open Necessary Ports:**

   Allow Nginx Full and any other necessary ports (e.g., for your backend):

   ```bash
   sudo ufw allow 'Nginx Full'
   sudo ufw allow 5000/tcp
   sudo ufw allow 22/tcp
   ```

   Enable the firewall `ufw`.

   ```bash
   sudo ufw enable
   ```   

#### Step 6: Install and Configure PostgreSQL

1. **Install PostgreSQL:**

   ```bash
   sudo apt install postgresql postgresql-contrib
   ```

2. **Start and Enable PostgreSQL Service:**

   ```bash
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

3. **Create the Database:**

   Connect to PostgreSQL:

   ```bash
   sudo -i -u postgres
   psql
   ```

   Create a new database:

   ```sql
   CREATE DATABASE aivtdb
   WITH
   OWNER = postgres
   ENCODING = 'UTF8'
   LC_COLLATE = 'C.UTF-8'
   LC_CTYPE = 'C.UTF-8'
   LOCALE_PROVIDER = 'libc'
   TABLESPACE = pg_default
   CONNECTION LIMIT = -1
   IS_TEMPLATE = False;
   ```

   Connect to the new database:

   ```sql
   \c aivtdb
   ```

   Create the required ENUM types and tables with the SQL shown in [2.sql](./backend/2.sql). If errors occurs with permission, change below `config` file as below.

   ```bash
   sudo nano /etc/postgresql/16/main/pg_hba.conf
   ```

   Then change the privileges to below lines.

   ```bash
   # Database administrative login by Unix domain socket
   local   all             postgres                                trust
   
   # TYPE  DATABASE        USER            ADDRESS                 METHOD
   
   # "local" is for Unix domain socket connections only
   local   all             all                                     trust
   # IPv4 local connections:
   host    all             all             127.0.0.1/32            trust
   # IPv6 local connections:
   host    all             all             ::1/128                 trust
   # Allow replication connections from localhost, by a user with the
   # replication privilege.
   local   replication     all                                     peer
   host    replication     all             127.0.0.1/32            scram-sha-256
   host    replication     all             ::1/128                 scram-sha-256
   ```

5. **Set Up the Backend to Use the Database:**

   Edit the `.env` file with a secret token value. The steps are shown in [Create the secret token](#create-the-secret-token).

#### Step 7: Monitor and Manage Services

1. **Monitor Nginx Logs:**

   To view Nginx error logs:

   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

#### Step 8: Final Steps

1. **Set Permissions for the Frontend Build Directory:**

   Set the correct permissions:

   ```bash
   sudo chown -R ubuntu:www-data /home/ubuntu/AIVT-dev/frontend/build
   sudo chmod -R 755 /home/ubuntu/AIVT-dev/frontend/build
   sudo chmod -R 755 /home/ubuntu/AIVT-dev/frontend
   sudo chmod +x /home/ubuntu
   sudo chmod +x /home/ubuntu/AIVT-dev
   ```

   If any errors occur with permission, try adding user `www-data` to user group with below command.

   ```bash
   sudo gpasswd -a www-data ubuntu
   ```

   If you don't have a domain name and are accessing your server using its **IP address**, you can still enable HTTPS using a self-signed SSL certificate or a free SSL certificate with your IP address. Here's how to do it:

---

#### Use a Self-Signed SSL Certificate
This option works for testing purposes but will show a browser warning because the certificate is not trusted.

1. **Generate a Self-Signed Certificate**
   ```bash
   sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
       -keyout /etc/ssl/private/selfsigned.key \
       -out /etc/ssl/certs/selfsigned.crt
   ```

   - **Common Name (CN)**: Enter your server's IP address when prompted.

2. **Configure Nginx for HTTPS**
   Update your Nginx configuration to serve HTTPS using the self-signed certificate.

   ```nginx
   server {
    listen 443 ssl;
    server_name <SERVER_IP>; # Replace with your IP addresses or keep as-is for multiple IPs

    ssl_certificate /etc/ssl/certs/selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/selfsigned.key;

    location / {
        root /home/ubuntu/AIVT-test/frontend/build;
        index index.html;
        try_files $uri /index.html; # Ensures SPA routing works correctly
    }

    location /api/ {
        proxy_pass http://localhost:5000; # Proxy API requests to the backend
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 50M; # Adjust the maximum upload size if necessary

    error_log /var/log/nginx/vue-app-error.log;
    access_log /var/log/nginx/vue-app-access.log;

   
    error_page 404 /404.html; # Custom error page for 404
   }
   
   server {
       listen 80;
       server_name <SERVER_IP>; # Replace with your IP addresses
   
       return 301 https://$host$request_uri; # Redirect HTTP to HTTPS
   }
   ```

3. **Restart Nginx**
   ```bash
   sudo systemctl restart nginx
   ```

4. **Access the Website**
   Visit your site using:
   ```
   https://YOUR_SERVER_IP
   ```

   Your browser will likely warn about the self-signed certificate. Click "Proceed" to access the site.

3. **Test Everything:**

   - Access the frontend via your IP as `http://your_ip/.
   - Ensure the backend is running properly.
   - Verify that Nginx is correctly proxying requests to the backend.                  

## Deploying Mistral in local server

### Install ollama

```
curl https://ollama.ai/install.sh | sh
```