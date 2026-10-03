import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise the real merge code without credentials or a database write.
function compile(file, require = () => { throw new Error('Unexpected import'); }) {
  const compiledModule = { exports: {} };
  const code = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, { module: compiledModule, exports: compiledModule.exports, require });
  return compiledModule.exports;
}
const references = compile('content/client-references.ts');
const { defaultContent } = compile('content/defaults.ts', () => references);
const { mergeContent } = compile('lib/content-merge.ts');
const old = structuredClone(defaultContent);
delete old.clientConfirmationVersion;
old.media.approvedReferenceImageUrls = [];
old.media.contactImageUrl = '/images/old.jpg';
old.hero.title = 'Toimivaa talotekniikkaa vuodesta 1995.';
old.companyPage.fi.history[0].era = 'Alkuvaiheet';
const migrated = mergeContent(defaultContent, old);
assert.equal(migrated.hero.title, defaultContent.hero.title);
assert.equal(migrated.companyPage.fi.history[0].era, '1993');
assert.equal(migrated.media.approvedReferenceImageUrls.length, 9);
assert.equal(migrated.media.contactImageUrl, '');
assert.equal(old.media.contactImageUrl, '/images/old.jpg');
assert.equal(old.media.approvedReferenceImageUrls.length, 0);
assert.ok(!migrated.media.approvedReferenceImageUrls.includes('/images/new-upload.jpg'));
migrated.media.approvedReferenceImageUrls = [];
migrated.media.referenceImages = [];
const saved = mergeContent(defaultContent, migrated);
assert.equal(saved.media.approvedReferenceImageUrls.length, 0);
assert.equal(saved.media.referenceImages.length, 0);
console.log('Legacy CMS corrections, input immutability and later explicit removals: PASS');
