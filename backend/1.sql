-- Database: aivtdb

-- DROP DATABASE IF EXISTS aivtdb;

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

-- Create ENUM types
CREATE TYPE phase_enum AS ENUM ('Development', 'Training', 'Deployment and Use');
CREATE TYPE attribute_enum AS ENUM ('Accuracy', 'Fairness', 'Privacy', 'Reliability', 'Resiliency', 'Robustness', 'Safety');
-- CREATE TYPE effect_enum AS ENUM ('0: Correct functioning', '1: Reduced functioning', '2: No actions', '3: Random actions', '4: Directed actions', '5: Random actions OoB', '6: Directed actions OoB');

CREATE TYPE effect_enum AS ENUM ('0: Correct functioning', '1: Reduced functioning', '2: No actions', '3: Chaotic', '4: Directed actions', '5: Random actions OoB', '6: Directed actions OoB');

ALTER TABLE Effect
ALTER COLUMN effectName TYPE new_effect_enum
USING effectName::text::new_effect_enum;

DROP TYPE effect_enum ;
ALTER TYPE new_effect_enum RENAME TO effect_enum;


-- Create table Reporter
CREATE TABLE Reporter (
    reporterId SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    organization VARCHAR(255),
	salt VARCHAR(255),
	password VARCHAR(255),
	role VARCHAR(50) DEFAULT 'reporter'
);

ALTER TABLE Reporter
	ADD COLUMN salt VARCHAR(255);

ALTER TABLE Reporter ADD COLUMN role VARCHAR(50) DEFAULT 'reporter';

ALTER TABLE Vul_report
ADD COLUMN date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE Vul_report ADD COLUMN approval_status VARCHAR(50) DEFAULT 'pending';



-- Create table Vul_report
CREATE TABLE Vul_report (
    reportId SERIAL PRIMARY KEY,
	date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(255),
    report_description VARCHAR(510),
    reporterId INTEGER, 
	approval_status VARCHAR(50) DEFAULT 'pending',
    FOREIGN KEY (reporterId) REFERENCES Reporter(reporterId)
);

-- Create table Admin_review
CREATE TABLE Admin_review (
    reviewId SERIAL PRIMARY KEY,
    reportId INTEGER,
    adminId INTEGER,
    review_comments VARCHAR(510),
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reportId) REFERENCES Vul_report(reportId),
    FOREIGN KEY (adminId) REFERENCES Reporter(reporterId) 
);

-- Create table Artifact
CREATE TABLE Artifact (
    artifactId SERIAL PRIMARY KEY,
    artifactName VARCHAR(255),
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
    infoId SERIAL,
    artifactId INTEGER,
    attachments BYTEA,
	filename VARCHAR(255),
	mimeType VARCHAR(255),
    FOREIGN KEY (artifactId) REFERENCES Artifact(artifactId)
);

-- -- Create table Effect
-- CREATE TABLE Effect (
--     effectTypeId SERIAL PRIMARY KEY,
--     eff_description VARCHAR(510),
--     phId INTEGER,
--     FOREIGN KEY (phId) REFERENCES Vul_phase(phId)
-- );

-- -- Create table Effect_names
-- CREATE TABLE Effect_names (
--     effectId SERIAL PRIMARY KEY,
--     effectName effect_enum
-- );

-- --Create table All_effects for the multiple selection with many-to-many connection
-- CREATE TABLE All_effects (
--     effectTypeId INTEGER,
--     effectId INTEGER,
--     FOREIGN KEY (effectTypeId) REFERENCES Effect(effectTypeId),
--     FOREIGN KEY (effectId) REFERENCES Effect_names(effectId),
--     PRIMARY KEY (effectTypeId, effectId)
-- );

DROP TABLE artifact, attachments, attribute, attribute_names, all_attributes, effect, reporter, vul_phase, vul_report CASCADE;



-- Drop the Effect_names and All_effects tables as they are no longer needed
DROP TABLE Effect CASCADE;
DROP TABLE IF EXISTS Effect_names CASCADE;
DROP TABLE IF EXISTS All_effects CASCADE;


-- Sample data for Reporter
INSERT INTO Reporter (name, email, organization)
VALUES 
('John Doe', 'john.doe@example.com', 'CyberSec Inc.'),
('Jane Smith', 'jane.smith@example.com', 'SecureTech');

SELECT * FROM 	Reporter;

UPDATE Reporter SET role = 'admin' WHERE reporterId = 28 RETURNING *

-- Sample data for Vul_report
INSERT INTO Vul_report (title, report_description, reporterId)
VALUES 
('SQL Injection Vulnerability', 'A SQL injection vulnerability in the login form.', 1),
('Cross-Site Scripting', 'A persistent XSS vulnerability in the comment section.', 2);

SELECT * FROM Vul_report;

-- Sample data for Artifact
INSERT INTO Artifact (artifactName, artifactType, developer, deployer, reportId)
VALUES 
('WebApp v1.0', 'Web Application', 'DevTeam A', 'OpsTeam B', 1),
('API Server v2.1', 'API', 'DevTeam B', 'OpsTeam A', 2);

SELECT * FROM Artifact;

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

-- Sample data for Vul_phase
INSERT INTO Vul_phase (phase, phase_description, reportId)
VALUES 
('Development', 'Phase in which the vulnerability was introduced.', 1),
('Deployment and Use', 'Phase during which the vulnerability was discovered.', 2);

SELECT * FROM Vul_phase;

-- Sample data for Attribute_type
INSERT INTO Attribute (attr_description, phId)
VALUES 
('Accuracy', 1),
('Privacy', 2);

SELECT * FROM Attribute_type;

-- Sample data for Attribute_desc
INSERT INTO Attribute_desc (attributeTypeId, attr_description)
VALUES 
(1, 'The system accurately identifies the vulnerability.'),
(2, 'The system does not protect user privacy.');

SELECT * FROM Attribute_desc;

-- Sample data for Effect_type
INSERT INTO Effect_type (effectName, effectValue, phId)
VALUES 
('0: Correct functioning', TRUE, 1),
('3: Random actions', TRUE, 2);

SELECT * FROM Effect_type;

-- Sample data for Effect_desc
INSERT INTO Effect_desc (effectTypeId, eff_description)
VALUES 
(1, 'The system functions correctly under normal conditions.'),
(2, 'The system exhibits random actions when exploited.');

SELECT * FROM Effect_desc;


-- Sample data for Attachments
-- INSERT INTO Attachments (artifactId, attachments)
-- VALUES 
-- (1, decode('48656c6c6f20576f726c64', 'hex')), 
-- (2, decode('53616d706c652046696c6520436f6e74656e74', 'hex')); 

-- Inserting sample data into the Attachments table

INSERT INTO Attachments (artifactId, attachments, filename, mimeType)
VALUES
(1, '\\x89504e470d0a1a0a0000000d494844520000001000000010080200000059f4d9a000000017352474200aece1ce90000000467414d410000b18f0bfc6100000001c674c410000b18f0bfc61000000000467414d410000b18f0bfc61000000000467414d410000b18f0bfc6100000000', 'example_image.png', 'image/png');

SELECT * FROM Attachments;

UPDATE Attachments 
	SET filename = 'file1.pdf', mimetype = 'application/pdf'
	WHERE infoid = 1;
	

SELECT 
        v.reportId AS id, 
        v.title, 
        a.artifactName 
      FROM 
        Vul_report v
      JOIN 
        Artifact a ON v.reportId = a.reportId

SELECT * 
	FROM Vul_report v
	JOIN 
    Artifact a ON v.artifactId = a.artifactId;

SELECT * FROM Vul_report v JOIN Artifact a ON v.artifactId = a.artifactId

SELECT 
            v.reportId AS id, 
            v.title, 
            v.report_description,
            a.artifactName,
            r.name AS reporterName,
            r.email AS reporterEmail,
            r.organization AS reporterOrganization,
            p.phase,
            p.phase_description AS phaseDescription,
            encode(at.attachments, 'base64') AS attachments,
            at.filename AS attachmentFilename,
            at.mimeType AS attachmentMimeType
        FROM 
            Vul_report v
        JOIN 
            Artifact a ON v.reportId = a.reportId
        JOIN 
            Reporter r ON v.reporterId = r.reporterId
        JOIN 
            Vul_phase p ON v.reportId = p.reportId
        LEFT JOIN 
            Attachments at ON a.artifactId = at.artifactId;


-- Clear existing data
DELETE FROM Vul_report;     

    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;


-- Sample data for Attribute
INSERT INTO Attribute (attr_description, phId) VALUES 
('Accuracy of the system', 1),
('Fairness of the system', 2);

SELECT * FROM Attribute;

-- Sample data for Attribute_names
INSERT INTO Attribute_names (attributeName) VALUES 
('Accuracy'),
('Fairness'),
('Privacy'),
('Reliability'),
('Resiliency'),
('Robustness'),
('Safety');

SELECT * FROM Attribute_names;

-- Sample data for All_attributes
INSERT INTO All_attributes (attributeTypeId, attributeId) VALUES 
(6, 10), -- Accuracy of the system
(7, 12); -- Fairness of the system
;
SELECT * FROM All_attributes;

-- Sample data for Effect
INSERT INTO Effect (eff_description, phId) VALUES 
('System functions correctly', 1),
('System has reduced functionality', 2);

SELECT * FROM Effect;

-- Sample data for Effect_names
INSERT INTO Effect_names (effectName) VALUES 
('0: Correct functioning'),
('1: Reduced functioning'),
('2: No actions'),
('3: Random actions'),
('4: Directed actions'),
('5: Random actions OoB'),
('6: Directed actions OoB');

SELECT * FROM Effect_names;


-- Sample data for All_effects
INSERT INTO All_effects (effectTypeId, effectId) VALUES 
(1, 6), -- System functions correctly
(2, 4); -- System has reduced functionality

select * from All_effects;

SELECT 
	v.reportId AS id, 
	v.title, 
	v.report_description,
	v.approval_status AS status,
	a.artifactName,
	a.artifactType,
	a.developer, 
	a.deployer, 
	a.artifactId, 
	r.reporterId,
	r.name AS reporterName,
	r.email AS reporterEmail,
	r.organization AS reporterOrganization,
	p.phase,
	p.phase_description AS phaseDescription,
	array_agg(DISTINCT an.attributeName) AS attributes,
	attr.attr_description AS attr_Description,
	eff.effectName AS effect,
	eff.eff_description AS eff_Description,
	array_agg(DISTINCT att.attachments) AS attachments,
	array_agg(DISTINCT att.filename) AS attachmentFilenames,
	array_agg(DISTINCT att.mimeType) AS attachmentMimeTypes
	
FROM 
	Vul_report v
JOIN 
	Artifact a ON v.reportId = a.reportId
JOIN 
	Reporter r ON v.reporterId = r.reporterId
JOIN 
	Vul_phase p ON v.reportId = p.reportId
LEFT JOIN 
	All_attributes aa ON p.phId = aa.attributeTypeId
LEFT JOIN 
	Attribute_names an ON aa.attributeId = an.attributeId
LEFT JOIN 
	Attribute attr ON p.phId = attr.phId
LEFT JOIN 
	Effect eff ON p.phId = eff.phId
LEFT JOIN 
	Attachments att ON a.artifactId = att.artifactId
GROUP BY 
	v.reportId, v.status, a.artifactName, a.artifactType, a.developer, a.deployer, a.artifactId, r.reporterId, r.name, r.email, r.organization, p.phase, p.phase_description, attr.attr_description, eff.effectName, eff.eff_description
        
	 
SELECT n.nspname as "Schema",
       t.typname as "Name",
       t.typtype as "Type",
       e.enumlabel as "Enum Value"
FROM pg_type t 
JOIN pg_enum e 
  ON t.oid = e.enumtypid  
JOIN pg_catalog.pg_namespace n 
  ON n.oid = t.typnamespace
WHERE t.typname = 'effect_enum';

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'Effect';

CREATE DATABASE copy_DB WITH TEMPLATE aivtdb OWNER postgres;

SELECT 
	vr.reportId AS id, 
	vr.title, 
	a.artifactName, 
	vr.date_added, 
	e.effectName, 
	vp.phase, 
	array_agg(DISTINCT an.attributeName) AS attributes,
	vr.approval_status
FROM Vul_report vr
JOIN Artifact a ON vr.reportId = a.reportId
JOIN Vul_phase vp ON vr.reportId = vp.reportId
JOIN Effect e ON vp.phId = e.phId
LEFT JOIN Attribute at ON vp.phId = at.phId
LEFT JOIN All_attributes aa ON at.attributeTypeId = aa.attributeTypeId
LEFT JOIN Attribute_names an ON aa.attributeId = an.attributeId
WHERE vr.approval_status = 'approved'
GROUP BY 
    vr.reportId, 
    vr.title, 
    a.artifactName, 
    vr.date_added, 
    e.effectName, 
    vp.phase,
	vr.approval_status;

SELECT 
	vr.reportId AS id, 
	vr.title, 
	a.artifactName, 
	vr.date_added, 
	e.effectName, 
	vp.phase, 
	array_agg(DISTINCT an.attributeName) AS attributes
FROM Vul_report vr
JOIN Artifact a ON vr.reportId = a.reportId
JOIN Vul_phase vp ON vr.reportId = vp.reportId
JOIN Effect e ON vp.phId = e.phId
LEFT JOIN Attribute at ON vp.phId = at.phId
LEFT JOIN All_attributes aa ON at.attributeTypeId = aa.attributeTypeId
LEFT JOIN Attribute_names an ON aa.attributeId = an.attributeId
        WHERE 1=1

SELECT typname
FROM pg_type
WHERE typname IN ('phase_enum', 'attribute_enum', 'effect_enum');

\d+ Effect
\d+ Vul_phase
\d+ Attribute
