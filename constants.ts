
import { LanguageOption } from './types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
  { value: 'cplusplus', label: 'C++' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'rust', label: 'Rust' },
];

export const CODE_REVIEW_PROMPT_TEMPLATE = (language: string, code: string): string => `
You are an expert AI code reviewer. Your task is to analyze the following ${language} code snippet and provide a comprehensive review.

Please structure your feedback in Markdown format. Focus on the following aspects:

1.  **Overall Impression & Summary**:
    *   Briefly summarize the code's purpose and your general assessment.

2.  **Correctness & Potential Bugs**:
    *   Identify any logical errors, off-by-one errors, or unhandled edge cases.
    *   Point out potential runtime errors.

3.  **Clarity, Readability & Maintainability**:
    *   Assess variable naming, function naming, and overall code organization.
    *   Comment on the use of comments (too few, too many, unclear).
    *   Suggest improvements for making the code easier to understand and maintain.

4.  **Efficiency & Performance**:
    *   Identify any obvious performance bottlenecks.
    *   Suggest more efficient algorithms or data structures if applicable. (Avoid premature optimization unless significant gains are clear).

5.  **Security Vulnerabilities**:
    *   Point out common security issues relevant to the language and code (e.g., XSS, SQL injection, insecure handling of secrets - if context allows).

6.  **Best Practices & Idiomatic Code**:
    *   Does the code follow established best practices for ${language}?
    *   Is the code idiomatic, or does it use patterns that are unconventional for ${language}?

7.  **Actionable Suggestions for Improvement**:
    *   Provide specific, constructive, and actionable recommendations.
    *   If possible, provide brief corrected code examples for critical issues.

**Important**:
*   Be constructive and polite.
*   Prioritize the most important issues.
*   If the code is too short or simple for a deep review in some sections, state that clearly for those sections.
*   Use Markdown for formatting (e.g., headings with ##, lists with * or -, bold with **, italics with *, and code blocks with \`\`\`language ... \`\`\`).

Here is the ${language} code to review:
\`\`\`${language}
${code}
\`\`\`
`;

export const EXAMPLE_CODE: { [key: string]: string } = {
  javascript: `function greet(name) {\n  console.log("Hello, " + name);\n}\ngreet("World");\n\nfunction sum(arr) {\n  let total = 0;\n  for(let i=0; i< arr.length; i++) {\n    total += arr[i]\n  }\n  return total;\n}`,
  python: `def greet(name):\n    print(f"Hello, {name}")\n\ngreet("World")\n\ndef calculate_sum(numbers):\n    total = 0\n    for num in numbers:\n        total += num\n    return total`,
  typescript: `function greet(name: string): void {\n  console.log(\`Hello, \${name}\`);\n}\ngreet("World");\n\nfunction sum(arr: number[]): number {\n  return arr.reduce((acc, current) => acc + current, 0);\n}`,
};

export const LANGUAGE_MAP: { [key: string]: string } = {
  js: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  py: 'python',
  ts: 'typescript',
  tsx: 'typescript',
  java: 'java',
  cs: 'csharp',
  go: 'go',
  rb: 'ruby',
  php: 'php',
  cpp: 'cplusplus',
  h: 'cplusplus',
  hpp: 'cplusplus',
  swift: 'swift',
  kt: 'kotlin',
  kts: 'kotlin',
  rs: 'rust',
};
