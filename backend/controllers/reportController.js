const pool = require('../config/database'); 
const { fetchUserById } = require('../controllers/userController');
const path = require('path');
const fs = require('fs');
// const jwt = require('jsonwebtoken');

exports.getAllReports = async (req, res) => {
    const { phase, attribute, effect, startDate, endDate } = req.query;

    // Base query
    let query = `
        SELECT 
            vr.reportId AS id, 
            vr.title, 
            a.artifactType, 
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
    `;

    // Array to store query parameters
    const params = [];

    // Conditionally add filters
    if (phase) {
        params.push(phase);
        query += ` AND vp.phase = $${params.length}`;
    }

    if (attribute) {
        params.push(attribute);
        query += ` AND an.attributeName = $${params.length}`;
    }

    if (effect) {
        params.push(effect);
        query += ` AND e.effectName = $${params.length}`;
    }

    if (startDate) {
        params.push(startDate);
        query += ` AND vr.date_added >= $${params.length}`;
    }

    if (endDate) {
        params.push(endDate);
        query += ` AND vr.date_added <= $${params.length}`;
    }

    // Final GROUP BY clause (placed after all conditions)
    query += `
        GROUP BY 
            vr.reportId, 
            vr.title, 
            a.artifactType, 
            vr.date_added, 
            e.effectName, 
            vp.phase,
            vr.approval_status
    `;

    try {
        // Execute the query with the built query string and parameters
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.createReport = async (req, res) => {
    console.log('Received request for /report-data');
    const {
        sub, 
        email,
        name,
        organization,
        title,
        report_description,
        // artifactName,
        artifactType,
        developer,
        deployer,
        phase,
        phase_description,
        attributeName, 
        attr_description,
        effectName, 
        eff_description
    } = req.body;

    const attachments = req.files;

    if (!sub || !email) {
        return res.status(400).json({ error: 'User ID and email are required' });
    }

    // Ensure attributeName is an array
    let attributeTypeArray;
    if (typeof attributeName === 'string') {
        attributeTypeArray = attributeName.split(',').map(item => item.trim());
    } else if (Array.isArray(attributeName)) {
        attributeTypeArray = attributeName;
    } else {
        return res.status(400).json({ error: 'attributeName should be a string or an array' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const reporterId = sub;
        console.log('Id: ', reporterId);

        // Get reporterId from authenticated user
        const reporterQuery = await client.query(
            'SELECT reporterId FROM Reporter WHERE reporterid = $1',
            [reporterId]
        );
        
         if (reporterQuery.rows.length === 0) {
            // Insert new reporter if not found
            reporterQuery = await client.query(
                'INSERT INTO Reporter (reporterId, name, organization, email) VALUES ($1, $2, $3, $4) RETURNING reporterId',
                [reporterId, name, organization, email]
            );
        } else {
            // Update existing reporter details
            await client.query(
                'UPDATE Reporter SET name = $1, organization = $2 WHERE reporterId = $3',
                [name, organization, reporterId]
            );
        }

        // Insert into Vul_report
        const reportResult = await client.query(
            'INSERT INTO Vul_report (title, report_description, reporterId) VALUES ($1, $2, $3) RETURNING reportId',
            [title, report_description, reporterId]
        );
        const reportId = reportResult.rows[0].reportid;

        // Insert into Artifact
        const artifactResult = await client.query(
            'INSERT INTO Artifact (artifactType, developer, deployer, reportId) VALUES ($1, $2, $3, $4) RETURNING artifactId',
            [artifactType, developer, deployer, reportId]
        );
        const artifactId = artifactResult.rows[0].artifactid;

        // Insert into Vul_phase
        const phaseResult = await client.query(
            'INSERT INTO Vul_phase (phase, phase_description, reportId) VALUES ($1, $2, $3) RETURNING phId',
            [phase, phase_description, reportId]
        );
        const phId = phaseResult.rows[0].phid;

        // Insert into Attribute
        const attributeTypeResult = await client.query(
            'INSERT INTO Attribute (attr_description, phId) VALUES ($1, $2) RETURNING attributeTypeId',
            [attr_description, phId]
        );
        const attributeTypeId = attributeTypeResult.rows[0].attributetypeid;

        // Insert into Attribute_names and All_attributes
        for (let i = 0; i < attributeTypeArray.length; i++) {
            const attributeName = attributeTypeArray[i];

            // Retrieve the attributeId from Attribute_names
            const attributeNameResult = await client.query(
                'SELECT attributeId FROM Attribute_names WHERE attributeName = $1',
                [attributeName]
            );

            let attributeId;
            
            if (attributeNameResult.rows.length === 0) {
                // If the attributeName does not exist, insert it into Attribute_names
                const newAttributeNameResult = await client.query(
                    'INSERT INTO Attribute_names (attributeName) VALUES ($1) RETURNING attributeId',
                    [attributeName]
                );
                attributeId = newAttributeNameResult.rows[0].attributeid;
            } else {
                attributeId = attributeNameResult.rows[0].attributeid;
            }

            // Insert into All_attributes
            await client.query(
                'INSERT INTO All_attributes (attributeTypeId, attributeId) VALUES ($1, $2)',
                [attributeTypeId, attributeId]
            );
        }

        // Insert Effect 
        await client.query(
            'INSERT INTO Effect (effectName, eff_description, phId) VALUES ($1, $2, $3)',
            [effectName, eff_description, phId]
        );

        // Insert attachments
        if (attachments) {
            const attachmentDir = path.join(__dirname, '..', 'uploads', reportId.toString());
            if (!fs.existsSync(attachmentDir)) {
                fs.mkdirSync(attachmentDir, { recursive: true });
            }

            for (const file of attachments) {
                const filePath = path.join(attachmentDir, file.originalname);
                // fs.writeFileSync(filePath, file.buffer);
                await fs.promises.writeFile(filePath, file.buffer);
                
                await client.query(
                    'INSERT INTO Attachments (artifactId, filename, mimeType) VALUES ($1, $2, $3)',
                    [artifactId, file.originalname, file.mimetype]
                );
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ reportId });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error during the transaction', err.message);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
};

exports.fetchReportById = async (id) => {
    try {
        const result = await pool.query(`
            SELECT 
                v.reportId AS id, 
                v.date_added,
                v.title, 
                v.report_description,
                v.last_updated,
                v.approval_status,
                array_agg(DISTINCT ad.review_comments) AS review_comments, 
                a.artifactType,
                a.developer, 
                a.deployer, 
                a.artifactId, 
                r.reporterId,
                r.name AS reporterName,
                r.email AS reporterEmail,
                r.organization AS reporterOrganization,
                r.role AS reporterRole, 
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
                Admin_review ad ON v.reportId = ad.reportId
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
            WHERE 
                v.reportId = $1
            GROUP BY 
                -- v.reportId, a.artifactType, a.developer, a.deployer, a.artifactId, r.reporterId, r.name, r.email, r.organization, p.phase, p.phase_description, attr.attr_description, eff.effectName, eff.eff_description
                v.reportId, a.artifactId, r.reporterId, ad.review_id, p.phase, p.phase_description, attr.attr_description, eff.effectName, eff.eff_description
        `, [id]);

        if (result.rows.length === 0) {
            return null;
        }

        return {
            id: result.rows[0].id,
            title: result.rows[0].title,
            date_added: result.rows[0].date_added,
            report_description: result.rows[0].report_description,
            last_updated: result.rows[0].last_updated,
            approval_status: result.rows[0].approval_status,
            review_comments: result.rows[0].review_comments,
            artifactName: result.rows[0].artifactname,
            artifactType: result.rows[0].artifacttype,
            developer: result.rows[0].developer,
            deployer: result.rows[0].deployer,
            reporterId: result.rows[0].reporterid,
            reporterName: result.rows[0].reportername,
            reporterEmail: result.rows[0].reporteremail,
            reporterOrganization: result.rows[0].reporterorganization,
            reporterRole: result.rows[0].reporterrole,
            phase: result.rows[0].phase,
            phaseDescription: result.rows[0].phasedescription,
            attributeName: result.rows[0].attributes, 
            attr_Description: result.rows[0].attr_description,
            effectName: result.rows[0].effect, 
            eff_Description: result.rows[0].eff_description,
            attachments: result.rows[0].attachmentfilenames.map((filename, index) => ({
                filename: filename,
                mimeType: result.rows[0].attachmentmimetypes[index]
            }))
        };
        console.log(review_comments);
    } catch (err) {
        console.error(err.message);
        throw new Error('Database query failed');
    }
};

exports.getReportById = async (req, res) => {
    const { id } = req.params;
    try {
        const reportData = await exports.fetchReportById(id);

        if (!reportData) {
            return res.status(404).json({ error: 'Vulnerability not found' });
        }

        res.json(reportData);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAttachment = async (req, res) => {
    const { id, filename } = req.params;
    const filePath = path.join(__dirname, '..', 'uploads', id, filename);
  
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  };

exports.updateReport = async (req, res) => {
    const { id } = req.params;
    const {
        title,
        report_description,
        phase_description,
        attr_description,
        eff_description,
        deleteAttachments
    } = req.body;

    const files = req.files;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Update the Vul_report table
        let vulReportUpdates = [];
        let vulReportValues = [];
        let queryIndex = 1;

        if (title) {
            vulReportUpdates.push(`title = $${queryIndex++}`);
            vulReportValues.push(title);
        }
        if (report_description) {
            vulReportUpdates.push(`report_description = $${queryIndex++}`);
            vulReportValues.push(report_description);
        }

        if (vulReportUpdates.length > 0) {
            const updateVulReportQuery = `
                UPDATE Vul_report 
                SET ${vulReportUpdates.join(', ')}
                WHERE reportId = $${queryIndex}
                RETURNING *`;
            vulReportValues.push(id);

            const resultVulReport = await client.query(updateVulReportQuery, vulReportValues);
            if (resultVulReport.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ error: 'Report not found' });
            }
        }

        // Update Vul_phase and get phId
        let phId;
        if (phase_description) {
            const updateVulPhaseQuery = `
                UPDATE Vul_phase 
                SET phase_description = $1 
                WHERE reportId = $2 
                RETURNING phId`;
            const resultVulPhase = await client.query(updateVulPhaseQuery, [phase_description, id]);

            if (resultVulPhase.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ error: 'Phase not found for this report' });
            }
            phId = resultVulPhase.rows[0].phid;
        } else {
            const resultVulPhase = await client.query('SELECT phId FROM Vul_phase WHERE reportId = $1', [id]);
            phId = resultVulPhase.rows.length > 0 ? resultVulPhase.rows[0].phid : null;
        }

        // Update Attribute and Effect if phId is available
        if (phId) {
            if (attr_description) {
                const updateAttributeQuery = `
                    UPDATE Attribute 
                    SET attr_description = $1 
                    WHERE phId = $2`;
                await client.query(updateAttributeQuery, [attr_description, phId]);
            }

            if (eff_description) {
                const updateEffectQuery = `
                    UPDATE Effect 
                    SET eff_description = $1 
                    WHERE phId = $2`;
                await client.query(updateEffectQuery, [eff_description, phId]);
            }
        }

        // Handle deletion of existing attachments
        if (deleteAttachments) {
            const deleteAttachmentsArray = JSON.parse(deleteAttachments); // Parse JSON string
        
            for (const filename of deleteAttachmentsArray) {
                const deleteFilePath = path.join('uploads', filename);
        
                // Remove file from filesystem
                if (fs.existsSync(deleteFilePath)) {
                    fs.unlinkSync(deleteFilePath);
                }
        
                // Remove file reference from the database
                await client.query(
                    'DELETE FROM Attachments WHERE infoid = $1 AND filename = $2',
                    [id, filename]
                );
            }
        }

        // Get artifactId for the report
        let artifactId;
        const artifactResult = await client.query('SELECT artifactId FROM Artifact WHERE reportId = $1', [id]);
        if (artifactResult.rows.length > 0) {
            artifactId = artifactResult.rows[0].artifactid;
        } else {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Artifact not found for this report' });
        }

        // Handle new file uploads
        if (files && files.length > 0) {
            const attachmentDir = path.join(__dirname, '..', 'uploads', id.toString());
            if (!fs.existsSync(attachmentDir)) {
                fs.mkdirSync(attachmentDir, { recursive: true });
            }

            for (const file of files) {
                if (file && file.originalname) {
                    const filePath = path.join(attachmentDir, file.originalname);
                    fs.writeFileSync(filePath, file.buffer);

                    await client.query(
                        'INSERT INTO Attachments (artifactId, filename, mimeType) VALUES ($1, $2, $3)',
                        [artifactId, file.originalname, file.mimetype]
                    );
                }
            }
        }

        await client.query('COMMIT');
        res.json({ message: 'Report and related details updated successfully' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
};

exports.deleteReport = async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Delete from related tables first
        await client.query('DELETE FROM Attachments WHERE artifactId IN (SELECT artifactId FROM Artifact WHERE reportId = $1)', [id]);
        await client.query('DELETE FROM All_attributes WHERE attributeTypeId IN (SELECT attributeTypeId FROM Attribute WHERE phId IN (SELECT phId FROM Vul_phase WHERE reportId = $1))', [id]);
        await client.query('DELETE FROM Attribute WHERE phId IN (SELECT phId FROM Vul_phase WHERE reportId = $1)', [id]);
        await client.query('DELETE FROM Effect WHERE phId IN (SELECT phId FROM Vul_phase WHERE reportId = $1)', [id]);
        await client.query('DELETE FROM Vul_phase WHERE reportId = $1', [id]);
        await client.query('DELETE FROM Artifact WHERE reportId = $1', [id]);

        // Finally, delete from Vul_report
        const result = await client.query('DELETE FROM Vul_report WHERE reportId = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Report not found' });
        }

        await client.query('COMMIT');
        res.json(result.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
};

exports.searchReports = async (req, res) => {
    const { query } = req.query;
  
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
  
    try {
      const result = await pool.query(`
        SELECT 
          v.reportId AS id, 
          v.title, 
          v.date_added,
          a.artifactName,
          r.organization,
          p.phase,
          eff.effectName AS effect,
          array_agg(DISTINCT an.attributeName) AS attributes
        FROM 
          Vul_report v
        JOIN 
          Artifact a ON v.reportId = a.reportId
        JOIN 
          Reporter r ON v.reporterId = r.reporterId
        JOIN 
          Vul_phase p ON v.reportId = p.reportId
        LEFT JOIN 
          Effect eff ON p.phId = eff.phId
        LEFT JOIN 
          Attribute at ON p.phId = at.phId
        LEFT JOIN 
          All_attributes aa ON at.attributeTypeId = aa.attributeTypeId
        LEFT JOIN 
          Attribute_names an ON aa.attributeId = an.attributeId
        WHERE 
          v.title ILIKE $1 
          OR a.artifactName ILIKE $1 
          OR r.organization ILIKE $1 
          OR p.phase::TEXT ILIKE $1
          OR eff.effectName::TEXT ILIKE $1
        GROUP BY 
          v.reportId, 
          v.title, 
          v.date_added,
          a.artifactName,
          r.organization,
          p.phase,
          eff.effectName
      `, [`%${query}%`]);
  
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

exports.getPendingReports = async (req, res) => {
    const { phase, attribute, effect, startDate, endDate } = req.query;

    // Base query
    let query = `
        SELECT 
            vr.reportId AS id, 
            vr.title, 
            a.artifactType, 
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
        WHERE vr.approval_status = 'pending'
    `;

    // Array to store query parameters
    const params = [];

    // Conditionally add filters
    if (phase) {
        params.push(phase);
        query += ` AND vp.phase = $${params.length}`;
    }

    if (attribute) {
        params.push(attribute);
        query += ` AND an.attributeName = $${params.length}`;
    }

    if (effect) {
        params.push(effect);
        query += ` AND e.effectName = $${params.length}`;
    }

    if (startDate) {
        params.push(startDate);
        query += ` AND vr.date_added >= $${params.length}`;
    }

    if (endDate) {
        params.push(endDate);
        query += ` AND vr.date_added <= $${params.length}`;
    }

    // Final GROUP BY clause (placed after all conditions)
    query += `
        GROUP BY 
            vr.reportId, 
            vr.title, 
            a.artifactType, 
            vr.date_added, 
            e.effectName, 
            vp.phase,
            vr.approval_status
    `;

    try {
        // Execute the query with the built query string and parameters
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.reviewReport = async (req, res) => {
    const { approval_status, review_comments, sub } = req.body;
    const { id } = req.params;
    
    try {
        const reportResult = await pool.query("SELECT * FROM Vul_report WHERE reportId = $1", [id]);
        if (reportResult.rows.length === 0) {
        return res.status(404).json({ error: "Report not found" });
        }

        await pool.query("UPDATE Vul_report SET approval_status = $1 WHERE reportId = $2", [
        approval_status,
        id,
        ]);
        

        if (approval_status !== "pending") {

            const adminId = sub; 
            console.log(adminId);
            await pool.query(
                "INSERT INTO Admin_review (reportId, adminId, review_comments) VALUES ($1, $2, $3)",
                [id, adminId, review_comments || ""]
            );
        }

        res.json({ message: `Report ${approval_status}` });
    } catch (err) {
        console.error("Error during report review:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.rejectedReports = async (req, res) => {
    const { phase, attribute, effect, startDate, endDate } = req.query;

    // Base query
    let query = `
        SELECT 
            vr.reportId AS id, 
            vr.title, 
            a.artifactType, 
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
        WHERE vr.approval_status = 'rejected'
    `;

    // Array to store query parameters
    const params = [];

    // Conditionally add filters
    if (phase) {
        params.push(phase);
        query += ` AND vp.phase = $${params.length}`;
    }

    if (attribute) {
        params.push(attribute);
        query += ` AND an.attributeName = $${params.length}`;
    }

    if (effect) {
        params.push(effect);
        query += ` AND e.effectName = $${params.length}`;
    }

    if (startDate) {
        params.push(startDate);
        query += ` AND vr.date_added >= $${params.length}`;
    }

    if (endDate) {
        params.push(endDate);
        query += ` AND vr.date_added <= $${params.length}`;
    }

    // Final GROUP BY clause (placed after all conditions)
    query += `
        GROUP BY 
            vr.reportId, 
            vr.title, 
            a.artifactType, 
            vr.date_added, 
            e.effectName, 
            vp.phase,
            vr.approval_status
    `;

    try {
        // Execute the query with the built query string and parameters
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.reportComments = async (req, res) => {
    const { id } = req.params; // Report ID

    try {
        const commentsResult = await pool.query(`
            SELECT review_comments, review_date, adminId
            FROM Admin_review
            WHERE reportId = $1
            ORDER BY review_date DESC
        `, [id]);

        if (commentsResult.rows.length === 0) {
            return res.json({ message: "No comments found for this report." });
        }

        res.json(commentsResult.rows); // Return all comments for the report
    } catch (err) {
        console.error("Error fetching comments:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
