require('dotenv').config();
const axios = require('axios');
const pool = require('../../config/database'); 

const BASE_YEAR = 2024;
const MAX_CVE_PER_YEAR = 40000;
const VALID_PHASES = ['Development', 'Training', 'Deployment and Use'];
const VALID_ATTRIBUTES = [
  'Accuracy', 'Fairness', 'Privacy', 'Reliability', 'Resiliency', 'Robustness', 'Safety'
];
const VALID_EFFECTS = [
  "0: Correct functioning", "1: Reduced functioning", "2: No actions", "3: Chaotic",
  "4: Directed actions", "5: Random actions OoB", "6: Directed actions OoB"
];
const VALID_ARTIFACTS = [
  "Web Application", "Desktop Application", "API", "Mobile Application", "AI Model (Standalone)", "Dataset",
  "Inference Service", "Edge Device", "Chatbot", "LLM Plugin / Extension", "ML Pipeline",
  "AutoML System", "Recommendation System", "Autonomous Vehicle Software",
  "Smart Contract (AI-integrated)", "Virtual Assistant"
];

function isAIRelevant(description) {
  const modelConcepts = [
    'machine learning',
    'ml',
    'artificial intelligence',
    'ai',
    'deep learning',
    'neural network',
    'neural net',
    'language model',
    'large language model',
    'llm',
    'ml model',
    'pretrained model',
    'foundation model',
    'generative model',
    'embedding model',
    'transformer model',
    'diffusion model',
    'self-supervised learning'
  ];

  const trainingInference = [
    'training data',
    'model weights',
    'fine-tuning',
    'transfer learning',
    'zero-shot',
    'few-shot',
    'prompt engineering',
    'prompt injection',
    'model inference',
    'inference engine',
    'model serving',
    'model deployment',
    'online learning',
    'continual learning'
  ];

  const aiSecurityTerms = [
    'gradient leakage',
    'membership inference',
    'model inversion',
    'model extraction',
    'model stealing',
    'data poisoning',
    'backdoor attack',
    'evasion attack',
    'adversarial example',
    'adversarial attack',
    'prompt leakage',
    'data leakage',
    'training data leakage',
    'shadow model'
  ];

  const frameworks = [
    'tensorflow',
    'pytorch',
    'jax',
    'onnx model',
    'scikit-learn',
    'huggingface',
    'keras',
    'sklearn',
    'openvino',
    'mlflow',
    'clearml',
    'model registry',
    'mlops',
    'autoML'
  ];

  const infraTerms = [
    'ai pipeline',
    'data pipeline',
    'ml pipeline',
    'data pre-processing',
    'data augmentation',
    'data labeling',
    'model monitoring',
    'model drift',
    'concept drift',
    'dataset shift',
    'model governance',
    'responsible ai'
  ];

  const aiTerms = [
    ...modelConcepts,
    ...trainingInference,
    ...aiSecurityTerms,
    ...frameworks,
    ...infraTerms
  ];

  const pattern = new RegExp(`\\b(${aiTerms.join('|')})\\b`, 'i');
  return pattern.test(description);
}

function generateCVEId(year, number) {
  return `CVE-${year}-${number.toString().padStart(4, '0')}`;
}

async function fetchCVEEntry(cveId) {
  const url = `https://cveawg.mitre.org/api/cve/${cveId}`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    if (error.response && error.response.status === 404) return null; // CVE doesn't exist
    console.error(`Error fetching ${cveId}:`, error.message);
    return null;
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

function validateClassification(parsed) {
  return {
    phase: VALID_PHASES.includes(parsed.phase) ? parsed.phase : 'Deployment and Use',
    attributes: Array.isArray(parsed.attributes)
      ? parsed.attributes.filter(attr => VALID_ATTRIBUTES.includes(attr))
      : [],
    effect: VALID_EFFECTS.includes(parsed.effect) ? parsed.effect : "1: Reduced functioning",
    artifact: VALID_ARTIFACTS.includes(parsed.artifact)
      ? parsed.artifact
      : "AI Model (Standalone)"
  };
}

async function classifyVulnerability(description) {
  const prompt = `
You are an AI security analyst. Based on the following CVE description, classify:
1. Phase: One of ['Development', 'Training', 'Deployment and Use']
2. Attributes affected (can be multiple): Choose from [Accuracy, Fairness, Privacy, Reliability, Resiliency, Robustness, Safety]
3. Effect: One of [0: Correct functioning, "1: Reduced functioning", "2: No actions", "3: Chaotic", "4: Directed actions", "5: Random actions OoB", "6: Directed actions OoB"]
4. Artifact: Choose exactly one from ["Web Application", "Desktop Application", "API", "Mobile Application", "AI Model (Standalone)", "Dataset", "Inference Service", "Edge Device", "Chatbot", "LLM Plugin / Extension", "ML Pipeline", "AutoML System", "Recommendation System", "Autonomous Vehicle Software", "Smart Contract (AI-integrated)", "Virtual Assistant"]

"0: Correct functioning" = At this level there is little to no effect on the functioning of the AI system in general, or other safety controls make sure that any deviation from regular use is corrected before any meaningful change from normal operation is able to manifest. This level is to be used for mostly informational vulnerabilities so they can be monitored in case some other vulnerability or change in environment makes actual exploitation of the vulnerability more feasible or impactful.
"1: Reduced functioning" = Here the normal functioning of the AI system has been affected in some way, but it still manages to function as it is intended to function, just in some way reduced capacity. Examples are degradation of prediction accuracy, increase in noise of the results, slowness in response times, excessive data/compute usage running up abnormal operating expenses, etc.
"2: No actions" = At this level the normal operation of the AI system is denied to it’s users and the organisation utilising it, either by making the system unresponsive in totality by overloading the AI system or its functions, or affecting the underlying infrastructure in a way that creates a Denial of Service situation for the system as a whole. Examples include logic bombs, DoS attacks on infrastructure and open APIs, inability to discard malformed data causing ingestion methods to clog up, degrading analysis enough that no meaningful decision on data can be made, etc.
"3: Chaotic" = At this point the attacker is able to cause the AI system to take actions, but is unable to cause it to take actions that it wouldn’t normally be expected to take, while also not being able to direct which actions precisely the system takes. Examples include affecting self-driving systems in such a way that the vehicle acts erratically, but being unable to cause the system to take specific actions, or causing an AI system to erroneously evaluate loan applications, but not being able to cause certain loans to be accepted, or others to be rejected.
"4: Directed actions" = Here the attacker is able to direct what the AI system does, or how it acts, but is unable to break out of the bounds of the regular operating environment of the AI system. Examples include being able to cause a self-driving system to brake or accelerate on command, or causing an AI system processing loan application to process certain loan applications such that the attacker is able to always cause certain applications to be approved or disapproved if they wish.
"5: Random actions OoB" = At this level the attacker is able to break out of the AI system itself through the AI system and perform actions outside the AI system itself, although not being able to fully control the actions. Examples include for example being able to corrupt databases connected to the AI system, or causing an AI powered robot to flail around uncontrollably without obeying regular limitations on joint movement or movement envelope.
"6: Directed actions OoB" = Here the attacker is able to essentially gain full control of the AI system, both to remove regular limitations on actions the AI system is able to take, as well as possibly breaking out of the system itself to run commands on the machines running the system. Examples include being able to install additional software on the machines running the AI system, or gaining full control of the system while being able to disable all safety systems that would limit system usage.
    
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
    const validated = validateClassification(parsed);

    return validated;
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
    if (!vulnid) {
      await client.query('ROLLBACK');
      // console.log(`Skipping duplicate CVE: ${external_id}`);
      return;
    }
    // Insert into Vul_phase
    const phaseRes = await client.query(`
      INSERT INTO Vul_phase (phase, phase_description, vulnid)
      VALUES ($1, $2, $3)
      RETURNING phId
    `, [phase, `Auto classified and verified by a human.`, vulnid]);
    
    const phId = phaseRes.rows[0].phid;    
    
    // Step 1: Insert into Attribute table
  const attrInsertRes = await client.query(`
    INSERT INTO Attribute (attr_description, phId)
    VALUES ($1, $2)
    RETURNING attributeTypeId
  `, ['Auto classified and verified by a human.', phId]);

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
  try {
    for (let year = BASE_YEAR; year <= new Date().getFullYear(); year++) {
      console.log(`\nScanning CVEs for year ${year}...`);
      for (let number = 1; number <= MAX_CVE_PER_YEAR; number++) {
        const cveId = generateCVEId(year, number);
      
        const alreadyExists = await cveExists(cveId);
        if (alreadyExists) {
          console.log(`Skipping existing CVE: ${cveId}`);
          continue;
        }
      
        console.log(`Fetching ${cveId}`);
        const entry = await fetchCVEEntry(cveId);

        if (!entry) {
          // console.log(`${cveId} not found or failed to fetch`);
          continue;
        }
        if (!entry?.containers?.cna?.descriptions?.length) {
          // console.log(`${cveId} skipped: no description`);
          continue;
        }
        
        const description = entry.containers.cna.descriptions[0].value;
        if (!isAIRelevant(description)) {
          // console.log(`${cveId} skipped: not AI-relevant`);
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
        // console.log(`Description: ${description}`);
        console.log(`Phase: ${phase}\n Attributes: ${attributes}\n Effect: ${effect}\n Artifact: ${artifact}`);
      }
    }
  } catch (err) {
    console.error("Unhandled error in main():", err);
  }
}
main();
