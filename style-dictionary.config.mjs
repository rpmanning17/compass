/**
 * Style Dictionary configuration for Compass.
 *
 * Source files: DTCG-aligned JSON in tokens/ (atomic) and tokens/semantic/ (alias layer).
 * Outputs three formats per Phase 2 plan:
 *   - dist/tokens.css         CSS custom properties (alias chains preserved)
 *   - dist/tokens.js          ES module exports for component consumption
 *   - dist/tokens.d.ts        TypeScript declarations for typed imports
 *   - dist/tokens.figma.json  Bundled DTCG JSON for Tokens Studio import
 *
 * DTCG mode is auto-detected via $value / $type fields in source files.
 */
import StyleDictionary from 'style-dictionary';

// ---------------------------------------------------------------------------
// Custom preprocessor: expand composite typography tokens (CSS platform only)
// ---------------------------------------------------------------------------
// CSS `font:` shorthand has no slot for letter-spacing, so SD's stock
// typography/css/shorthand transform silently drops it. Instead, we expand
// each composite typography token into atomic per-property tokens before the
// transform pipeline runs. JS and Figma platforms keep composites intact.

const TYPOGRAPHY_PROP_TYPES = {
  fontFamily:    'fontFamily',
  fontSize:      'dimension',
  fontWeight:    'fontWeight',
  lineHeight:    'number',
  letterSpacing: 'dimension',
};

function expandTypography(node) {
  if (!node || typeof node !== 'object') return node;

  // Composite typography token → expand into a group of atomic tokens
  if (
    node.$type === 'typography' &&
    node.$value &&
    typeof node.$value === 'object' &&
    !Array.isArray(node.$value)
  ) {
    const expanded = {};
    for (const [prop, propValue] of Object.entries(node.$value)) {
      // camelCase prop → kebab-case key (font-family, line-height, etc.)
      const kebabKey = prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
      expanded[kebabKey] = {
        $value: propValue,
        $type: TYPOGRAPHY_PROP_TYPES[prop] ?? 'string',
      };
    }
    return expanded;
  }

  // Other token leaves: pass through unchanged
  if ('$value' in node) return node;

  // Group: recurse
  const result = {};
  for (const [key, value] of Object.entries(node)) {
    result[key] = expandTypography(value);
  }
  return result;
}

StyleDictionary.registerPreprocessor({
  name: 'expand-typography',
  preprocessor: expandTypography,
});

// ---------------------------------------------------------------------------
// Custom format: clean DTCG JSON (Figma platform)
// ---------------------------------------------------------------------------
// SD's stock `json` format dumps internal metadata (filePath, isSource,
// original, name, attributes, path) on every token. Tokens Studio expects
// clean DTCG with just $value / $type / $description. This format walks the
// token tree and emits only those.

function cleanDtcgTree(node) {
  // Token leaf: keep only DTCG-spec keys.
  // Use original.$value to preserve {alias.path} references — Tokens Studio
  // imports alias-aware so per-client theming cascades work. Resolving here
  // would flatten the semantic layer into hardcoded values.
  if (node && typeof node === 'object' && '$value' in node) {
    const sourceValue = node.original?.$value ?? node.$value;
    const sourceType = node.original?.$type ?? node.$type;
    const sourceDesc = node.original?.$description ?? node.$description;
    const result = { $value: sourceValue, $type: sourceType };
    if (sourceDesc) result.$description = sourceDesc;
    return result;
  }

  if (!node || typeof node !== 'object') return node;

  // Group: recurse
  const result = {};
  for (const [key, value] of Object.entries(node)) {
    if (value && typeof value === 'object') {
      result[key] = cleanDtcgTree(value);
    }
  }
  return result;
}

StyleDictionary.registerFormat({
  name: 'json/dtcg-clean',
  format: ({ dictionary }) =>
    JSON.stringify(cleanDtcgTree(dictionary.tokens), null, 2) + '\n',
});

// ---------------------------------------------------------------------------
// Platform configuration
// ---------------------------------------------------------------------------

export default {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      preprocessors: ['expand-typography'],
      transformGroup: 'css',
      buildPath: 'dist/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: { outputReferences: true },
        },
      ],
    },
    ts: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [
        { destination: 'tokens.js',   format: 'javascript/es6' },
        { destination: 'tokens.d.ts', format: 'typescript/es6-declarations' },
      ],
    },
    figma: {
      buildPath: 'dist/',
      files: [
        {
          destination: 'tokens.figma.json',
          format: 'json/dtcg-clean',
        },
      ],
    },
  },
};
