-- Create database 
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

--Check all the tables 
\dt

-- Create ENUM types
CREATE TYPE phase_enum AS ENUM ('Development', 'Training', 'Deployment and Use');
CREATE TYPE attribute_enum AS ENUM ('Accuracy', 'Fairness', 'Privacy', 'Reliability', 'Resiliency', 'Robustness', 'Safety');
CREATE TYPE effect_enum AS ENUM ('0: Correct functioning', '1: Reduced functioning', '2: No actions', '3: Chaotic', '4: Directed actions', '5: Random actions OoB', '6: Directed actions OoB');

-- Create table Reporter
CREATE TABLE Reporter (
    reporterId VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    organization VARCHAR(255),
	role VARCHAR(50) DEFAULT 'reporter'
);

-- Create table Vul_report
CREATE TABLE Vul_report (
    reportId SERIAL PRIMARY KEY,
	date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(255),
    report_description VARCHAR(510),
    reporterId VARCHAR(255), 
	approval_status VARCHAR(50) DEFAULT 'pending',
    FOREIGN KEY (reporterId) REFERENCES Reporter(reporterId)
);

-- Update last_updated everytime the report is updated
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_last_updated
BEFORE UPDATE ON Vul_report
FOR EACH ROW
EXECUTE FUNCTION update_last_updated_column();

-- Create table Artifact
CREATE TABLE Artifact (
    artifactId SERIAL PRIMARY KEY,
    artifactType VARCHAR(255),
    developer VARCHAR(255),
    deployer VARCHAR(255),
    reportId INTEGER,
    FOREIGN KEY (reportId) REFERENCES Vul_report(reportId)
);

-- Create table Vul_phase
CREATE TABLE Vul_phase (
    phId SERIAL PRIMARY KEY,
    phase phase_enum,
    phase_description VARCHAR(510),
    reportId INTEGER,
    FOREIGN KEY (reportId) REFERENCES Vul_report(reportId)
);

-- Create table Attribute_type
CREATE TABLE Attribute (
    attributeTypeId SERIAL PRIMARY KEY,
    attr_description VARCHAR(510),
    phId INTEGER,
    FOREIGN KEY (phId) REFERENCES Vul_phase(phId)
);

-- Create table Attribute_names
CREATE TABLE Attribute_names (
    attributeId SERIAL PRIMARY KEY,
    attributeName attribute_enum
);

--Create table All_attributes for the multiple selection with many-to-many connection
CREATE TABLE All_attributes (
    attributeTypeId INTEGER,
    attributeId INTEGER,
    FOREIGN KEY (attributeTypeId) REFERENCES Attribute(attributeTypeId),
    FOREIGN KEY (attributeId) REFERENCES Attribute_names(attributeId),
    PRIMARY KEY (attributeTypeId, attributeId)
);

-- Create the modified Effect table
CREATE TABLE Effect (
    effectTypeId SERIAL PRIMARY KEY,
    effectName effect_enum,
    eff_description VARCHAR(510),
    phId INTEGER,
    FOREIGN KEY (phId) REFERENCES Vul_phase(phId)
);

-- Create table Attachments
CREATE TABLE Attachments (
    infoId SERIAL PRIMARY KEY,
    artifactId INTEGER,
    attachments BYTEA,
	filename TEXT,
	mimeType TEXT,
    FOREIGN KEY (artifactId) REFERENCES Artifact(artifactId)
);

-- Create table Admin_review
CREATE TABLE Admin_review (
    review_id SERIAL PRIMARY KEY,
    reportId INTEGER,
    adminId VARCHAR(255),
    review_comments VARCHAR(510),
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reportId) REFERENCES Vul_report(reportId),
    FOREIGN KEY (adminId) REFERENCES Reporter(reporterId) 
);

CREATE TABLE Nvd_data (
    nvd_id SERIAL PRIMARY KEY,
    cve_id TEXT UNIQUE NOT NULL,  -- CVE ID from NVD
    title VARCHAR(510),           -- CVE Title
    cve_description TEXT,         -- Full Description
    date_published TIMESTAMP,
    date_updated TIMESTAMP,
    cve_link VARCHAR(255),
    phId INTEGER,                 -- Phase of the vulnerability
    FOREIGN KEY (phId) REFERENCES Vul_phase(phId)
);

CREATE TABLE Nvd_Effect (
    nvd_id INTEGER,
    effectTypeId INTEGER,
    FOREIGN KEY (nvd_id) REFERENCES Nvd_data(nvd_id),
    FOREIGN KEY (effectTypeId) REFERENCES Effect(effectTypeId),
    PRIMARY KEY (nvd_id, effectTypeId)
);

CREATE TABLE Nvd_Attribute (
    nvd_id INTEGER,
    attributeTypeId INTEGER,
    FOREIGN KEY (nvd_id) REFERENCES Nvd_data(nvd_id),
    FOREIGN KEY (attributeTypeId) REFERENCES Attribute(attributeTypeId),
    PRIMARY KEY (nvd_id, attributeTypeId)
);

