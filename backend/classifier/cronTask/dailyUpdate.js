require('dotenv').config();
const axios = require('axios');
const pool = require('../../config/database'); 

function isAIRelevant(description) {
  const aiTerms = [
    'machine learning',
    'artificial intelligence',
    'deep learning',
    'neural network',
    'neural net',
    'language model',
    'large language model',
    'llm',
    'ml model',
    'model inference',
    'training data',
    'pretrained model',
    'model weights',
    'embedding model',
    'transformer model',
    'fine-tuning',
    'prompt injection',
    'model serving',
    'model deployment',
    'inference engine',
    'ai system',
    'ai pipeline',
    'ai framework',
    'onnx model',
    'tensorflow',
    'pytorch',
    'huggingface',
    'mlops',
    'model registry',
    'autoML',
    'gradient leakage',
    'membership inference',
    'model stealing'
  ];

  const pattern = new RegExp(`\\b(${aiTerms.join('|')})\\b`, 'i');
  return pattern.test(description);
}

async function fetchCVEs(pubStartDate, pubEndDate) {
  const url = `https://services.nvd.nist.gov/rest/json/cves/2.0?pubStartDate=${pubStartDate}&pubEndDate=${pubEndDate}`;
  try {
    const res = await axios.get(url);
    return res.data.vulnerabilities || [];
  } catch (error) {
    console.error(`Error fetching CVEs:`, error.message);
    return [];
  }
}

async function cveExists(cveId) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      'SELECT 1 FROM Vulnerability WHERE source = $1 AND external_id = $2 LIMIT 1',
      ['NVD', cveId]
    );
    return res.rowCount > 0;
  } catch (err) {
    console.error(`Error checking if CVE exists (${cveId}):`, err.message);
    return false;
  } finally {
    client.release();
  }
}

async function classifyVulnerability(description) {
  const prompt = `
You are an AI security analyst. Based on the following CVE description, classify:
1. Phase: One of ['Development', 'Training', 'Deployment and Use']
2. Attributes affected (can be multiple): Choose from [Accuracy, Fairness, Privacy, Reliability, Resiliency, Robustness, Safety]
3. Effect: One of [0: Correct functioning, "1: Reduced functioning", "2: No actions", "3: Chaotic", "4: Directed actions", "5: Random actions OoB", "6: Directed actions OoB"]
4. Artifact: Choose exactly one from ['Web Application', 'API', 'Mobile Application', 'AI Model (Standalone)', 'Dataset', 'Inference Service', 'Edge Device', 'Chatbot', 'LLM Plugin / Extension', 'ML Pipeline', 'AutoML System', 'Recommendation System', 'Autonomous Vehicle Software', 'Smart Contract (AI-integrated)', 'Virtual Assistant']

Respond in this exact JSON format:
{
  "phase": "value",
  "attributes": ["value1", "value2"],
  "effect": "value",
  "artifact": "value"
}

Response values should be always the full exact term given in the list above inside quotes. 

CVE Description: "${description}"
`;

  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'mistral',
      prompt: prompt,
      stream: false
    });
    const parsed = JSON.parse(response.data.response);
    return {
      phase: parsed.phase,
      attributes: parsed.attributes,
      effect: parsed.effect,
      artifact: parsed.artifact
    };
  } catch (err) {
    console.error('Classification error:', err?.response?.data || err.message || err);
    return {
      phase: 'Unknown',
      attributes: [],
      effect: 'Unknown',
      artifact: 'Unknown'
    };
  }
}

async function storeCVE({ external_id, title, description, phase, attributes, effect, artifact }) {
  const client = await pool.connect();
  const source = 'NVD';
  const cve_link = `https://cve.mitre.org/cgi-bin/cvename.cgi?name=${external_id}`;
  try {
    await client.query('BEGIN');
    // Insert into Vulnerability
    const vulnInsertRes = await client.query(`
      INSERT INTO Vulnerability (source, external_id, title, report_description, cve_link)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (source, external_id) DO NOTHING
      RETURNING vulnid
    `, [source, external_id, title, description, cve_link]);
    const vulnid = vulnInsertRes.rows[0]?.vulnid;
    // if (!vulnid) {
    //   await client.query('ROLLBACK');
    //   // console.log(`Skipping duplicate CVE: ${external_id}`);
    //   return;
    // }
    // Insert into Vul_phase
    const phaseRes = await client.query(`
      INSERT INTO Vul_phase (phase, phase_description, vulnid)
      VALUES ($1, $2, $3)
      RETURNING phId
    `, [phase, `Auto-classified phase: ${phase}`, vulnid]);
    
    const phId = phaseRes.rows[0].phid;    
    
    // Step 1: Insert into Attribute table
  const attrInsertRes = await client.query(`
    INSERT INTO Attribute (attr_description, phId)
    VALUES ($1, $2)
    RETURNING attributeTypeId
  `, ['Auto-classified attributes', phId]);

  const attributeTypeId = attrInsertRes.rows[0].attributetypeid;

  // Step 2: Insert into All_attributes table
  for (const attrName of attributes) {
    // Fetch attributeId from Attribute_names
    const attrIdRes = await client.query(`
      SELECT attributeId FROM Attribute_names WHERE attributeName = $1
    `, [attrName]);

    const attributeId = attrIdRes.rows[0]?.attributeid;
    if (!attributeId) {
      console.warn(`⚠️ Skipping unknown attribute: ${attrName}`);
      continue;
  }

  // Insert into All_attributes
  await client.query(`
    INSERT INTO All_attributes (attributeTypeId, attributeId)
    VALUES ($1, $2)
  `, [attributeTypeId, attributeId]);
  }

    // Insert into Vul_effect
    await client.query(`
      INSERT INTO Effect (effectName, phId)
      VALUES ($1, $2)
    `, [effect, phId]);

    // Insert into Artifact
    await client.query(`
      INSERT INTO Artifact (artifactType, vulnid)
      VALUES ($1, $2)
    `, [artifact, vulnid]);

    await client.query('COMMIT');
    console.log(`CVE ${external_id} stored in DB`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`Error inserting CVE ${external_id}:`, err.message);
  } finally {
    client.release();
  }
}

async function main() {
  const pubStartDate = "2025-04-01T00:00:00.000Z";
  const pubEndDate = "2025-04-10T23:59:59.000Z";

  const cveList = await fetchCVEs(pubStartDate, pubEndDate);
  console.log(`Fetched ${cveList.length} CVEs`);

  for (const item of cveList) {
    const cve = item.cve;
    const cveId = cve.id;

    const alreadyExists = await cveExists(cveId);
    if (alreadyExists) {
      console.log(`Skipping existing CVE: ${cveId}`);
      continue;
    }

    const description = (cve.descriptions || []).find(d => d.lang === 'en')?.value;
    if (!description) continue;

    if (!isAIRelevant(description)) {
      console.log(`Not AI-relevant: ${cveId}`);
      continue;
    }

    console.log(`Classifying ${cveId}`);
    const { phase, attributes, effect, artifact } = await classifyVulnerability(description);

    await storeCVE({
      external_id: cveId,
      title: cveId,
      description,
      phase,
      attributes,
      effect,
      artifact
    });

    console.log(`Stored ${cveId} ✅`);
  }
}


main();
