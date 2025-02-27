#!/usr/bin/env node
require("dotenv").config();
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const { Groq } = require('groq-sdk');

let instance;
let using = "groq";

if (process.env['GROQ_API_KEY']) {
  instance = new Groq({ apiKey: process.env['GROQ_API_KEY'] })
} else {
  using = "openai"
  instance = new OpenAI({
    apiKey: process.env['OPEN_AI_KEY']
  });
}

console.log(`Iniciando a geração dos testes usando ${using}`);

const ia = instance;

function extract(json) {
  const regex = /```javascript([\s\S]*?)```/;
  const match = json.match(regex);

  if (match && match[1]) {
    return match[1].trim();
  }

  return json;
}

// Função para gerar testes com IA
async function generateTest(code, docPath) {
  const prompt = `Você é um especialista em Node.js e testes automatizados (PT/BR). 
  Gere testes automatizados para o seguinte código usando Jest. Siga estas instruções **à risca**:
  1. Use \`require\` para importar os métodos do código e do \`@jest/globals\`.
  2. Certifique-se de importar corretamente os métodos do \`@jest/globals\` (describe, it, expect, TODOS OS METODOS QUE PRECISAREM PARA OS TESTES).
  3. O caminho para importar os métodos do código deve ser \`${docPath}\`.
  4. Forneça **apenas o código dos testes**, sem explicações ou comentários adicionais.
  5. Mantenha o foco em cobrir todos os cenários possíveis (casos de sucesso e erro) para garantir a robustez dos testes.
  Aqui está o código que deve ser testado:
  \`\`\`javascript
  ${code}
  \`\`\``.trim();

  try {
    const chatCompletion = await ia.chat.completions.create({
      messages: [{ role: 'system', content: prompt }],
      model: using === "openai" ? 'gpt-4o' : "llama3-70b-8192"
    });
    const content = chatCompletion.choices[0]?.message.content;
    return content.trim();
  } catch (error) {
    console.error(`❌ Erro ao gerar testes: ${JSON.stringify(error)}`);
    return null;
  }
}

// Função principal
async function main() {
  const docPath = process.argv[2];

  if (!docPath) {
    console.warn('Por favor, forneça o caminho do arquivo JavaScript.');
    console.warn('Exemplo: iatest ./caminho/para/arquivo.js');
    process.exit(1);
  }

  const absolutPath = path.resolve(docPath);

  if (!fs.existsSync(absolutPath)) {
    console.error(`Arquivo não encontrado: ${absolutPath}`);
    process.exit(1);
  }

  const code = fs.readFileSync(absolutPath, 'utf-8');
  const codeTest = await generateTest(code, docPath);

  if (!codeTest) {
    console.error('Não foi possível gerar testes.');
    process.exit(1);
  }

  const testPath = path.join(
    path.dirname(absolutPath),
    `${path.basename(absolutPath, '.js')}.test.js`
  );

  fs.writeFileSync(testPath, extract(codeTest),);
  console.log("✅ O teste automatizado foi gerado com sucesso !");
}

main();