const fs = require('fs');
const path = require('path');
const nextConfig = require('../next.config');

const basePath = nextConfig.basePath ?? '';

const outputPath = path.join(__dirname, '..', 'generated');

// Check if file exists, create if not
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath);
}

fs.writeFileSync(
  `${outputPath}/basePath.ts`,
  `export const basePath = '${basePath}';
`,
);
