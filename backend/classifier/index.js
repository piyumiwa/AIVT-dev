require('dotenv').config();
const axios = require('axios');
const { OpenAI } = require('openai');

// Initialize OpenAI
client = OpenAI(
  base_url="https://models.inference.ai.azure.com",
  api_key=os.getenv("GITHUB_TOKEN"),
)
// const openai = new OpenAI({ apiKey: process.env.GITHUB_TOKEN });

const BASE_YEAR = 2024;
const MAX_CVE_PER_YEAR = 20000; // adjust as needed
const AI_KEYWORDS = [
  'machine learning',
  'artificial intelligence',
  'deep learning',
  'neural network',
  'model',
  'ai system',
  'language model',
  'ML',
  'LLM',
  'training data',
];

function isAIRelevant(description) {
  const text = description.toLowerCase();
  return AI_KEYWORDS.some(keyword => text.includes(keyword.toLowerCase()));
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

async function categorizeVulnerability(description) {
  const prompt = `
You are an AI that classifies AI-related vulnerabilities into three categories:
- Development
- Training
- Deployment and Use

Classify the following vulnerability description accordingly. Respond only with one of the three categories.

Description: "${description}"
`;

  try {
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    return chatResponse.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API error:', error.message);
    return 'Unknown';
  }
}

async function main() {
  for (let year = BASE_YEAR; year <= new Date().getFullYear(); year++) {
    console.log(`\nScanning CVEs for year ${year}...`);
    for (let number = 1; number <= MAX_CVE_PER_YEAR; number++) {
      const cveId = generateCVEId(year, number);
      const entry = await fetchCVEEntry(cveId);

      if (!entry?.containers?.cna?.descriptions?.length) continue;

      const description = entry.containers.cna.descriptions[0].value;
      if (!isAIRelevant(description)) continue;

      const category = await categorizeVulnerability(description);

      console.log(`\n🛡️ CVE: ${cveId}`);
      console.log(`📝 Description: ${description}`);
      console.log(`🏷️ Category: ${category}`);
    }
  }
}

main();


