# AIVT-test

Your SQL script looks good for creating a PostgreSQL database and defining various tables and types. Here’s a step-by-step guide on how to execute this in Ubuntu:

### Step 1: Install PostgreSQL
If you haven't already installed PostgreSQL, you can do so using the following command:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### Step 2: Access PostgreSQL
Switch to the `postgres` user (the default superuser) to execute SQL commands:
```bash
sudo -i -u postgres
```

### Step 3: Open the PostgreSQL Command Line
Start the PostgreSQL interactive terminal:
```bash
psql
```

### Step 4: Create the Database
Run the SQL command to create your database:
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
```

### Step 5: Connect to the New Database
Connect to the newly created database:
```sql
\c aivtdb
```

### Step 6: Create ENUM Types
Execute the commands to create the ENUM types:
```sql
CREATE TYPE phase_enum AS ENUM ('Development', 'Training', 'Deployment and Use');
CREATE TYPE attribute_enum AS ENUM ('Accuracy', 'Fairness', 'Privacy', 'Reliability', 'Resiliency', 'Robustness', 'Safety');
CREATE TYPE effect_enum AS ENUM ('0: Correct functioning', '1: Reduced functioning', '2: No actions', '3: Chaotic', '4: Directed actions', '5: Random actions OoB', '6: Directed actions OoB');
```

### Step 7: Create Tables
Run the SQL commands to create all the tables:
```sql
CREATE TABLE Reporter (
    reporterId SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    organization VARCHAR(255),
    salt VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(50) DEFAULT 'reporter'
);

CREATE TABLE Vul_report (
    reportId SERIAL PRIMARY KEY,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(255),
    report_description VARCHAR(510),
    reporterId INTEGER, 
    approval_status VARCHAR(50) DEFAULT 'pending',
    FOREIGN KEY (reporterId) REFERENCES Reporter(reporterId)
);

CREATE TABLE Admin_review (
    reviewId SERIAL PRIMARY KEY,
    reportId INTEGER,
    adminId INTEGER,
    review_comments VARCHAR(510),
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reportId) REFERENCES Vul_report(reportId),
    FOREIGN KEY (adminId) REFERENCES Reporter(reporterId) 
);

CREATE TABLE Artifact (
    artifactId SERIAL PRIMARY KEY,
    artifactName VARCHAR(255),
    artifactType VARCHAR(255),
    developer VARCHAR(255),
    deployer VARCHAR(255),
    reportId INTEGER,
    FOREIGN KEY (reportId) REFERENCES Vul_report(reportId)
);

CREATE TABLE Vul_phase (
    phId SERIAL PRIMARY KEY,
    phase phase_enum,
    phase_description VARCHAR(510),
    reportId INTEGER,
    FOREIGN KEY (reportId) REFERENCES Vul_report(reportId)
);

CREATE TABLE Attribute (
    attributeTypeId SERIAL PRIMARY KEY,
    attr_description VARCHAR(510),
    phId INTEGER,
    FOREIGN KEY (phId) REFERENCES Vul_phase(phId)
);

CREATE TABLE Attribute_names (
    attributeId SERIAL PRIMARY KEY,
    attributeName attribute_enum
);

CREATE TABLE All_attributes (
    attributeTypeId INTEGER,
    attributeId INTEGER,
    FOREIGN KEY (attributeTypeId) REFERENCES Attribute(attributeTypeId),
    FOREIGN KEY (attributeId) REFERENCES Attribute_names(attributeId),
    PRIMARY KEY (attributeTypeId, attributeId)
);

CREATE TABLE Effect (
    effectTypeId SERIAL PRIMARY KEY,
    effectName effect_enum,
    eff_description VARCHAR(510),
    phId INTEGER,
    FOREIGN KEY (phId) REFERENCES Vul_phase(phId)
);

CREATE TABLE Attachments (
    infoId SERIAL,
    artifactId INTEGER,
    attachments BYTEA,
    filename VARCHAR(255),
    mimeType VARCHAR(255),
    FOREIGN KEY (artifactId) REFERENCES Artifact(artifactId)
);
```

### Step 8: Exit PostgreSQL
Once you are done, you can exit the PostgreSQL command line:
```sql
\q
```

### Step 9: Adjust Permissions (Optional)
If you need to give a different user access to the database, you can do so by running:
```sql
GRANT ALL PRIVILEGES ON DATABASE aivtdb TO your_username;
```

### Summary
This guide walks you through creating a PostgreSQL database and defining your tables and types based on your provided SQL script. If you encounter any errors or have additional questions, feel free to ask!
