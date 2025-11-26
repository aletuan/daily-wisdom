#!/usr/bin/env node

/**
 * Test Avatar CDN Fetching
 * Simulates the avatar loading flow without running the full app
 */

const CDN_BASE_URL = 'https://raw.githubusercontent.com/aletuan/youth-wisdom-avatars/main/avatars/';

function normalizeFilename(authorName) {
  return authorName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.png';
}

async function testCDNFetch(authorName) {
  const filename = normalizeFilename(authorName);
  const cdnUrl = CDN_BASE_URL + filename;

  console.log(`\n🧪 Testing: ${authorName}`);
  console.log(`   URL: ${cdnUrl}`);

  try {
    const response = await fetch(cdnUrl);

    if (response.ok) {
      const contentLength = response.headers.get('content-length');
      const sizeKB = (parseInt(contentLength) / 1024).toFixed(0);
      console.log(`   ✅ SUCCESS - Found on CDN (${sizeKB} KB)`);
      return true;
    } else {
      console.log(`   ❌ NOT FOUND - Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ ERROR - ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('=== Avatar CDN Test ===\n');
  console.log(`CDN Base URL: ${CDN_BASE_URL}`);

  // Test authors we generated
  const generatedAuthors = [
    'Marcus Aurelius',
    'Seneca',
    'Epictetus',
    'Socrates',
    'Plato',
    'Aristotle',
    'Confucius',
    'Lao Tzu',
    'Buddha',
    'Zhuangzi',
  ];

  // Test authors NOT generated (should fail gracefully)
  const notGenerated = [
    'Friedrich Nietzsche',
    'Søren Kierkegaard',
  ];

  console.log('\n--- Testing Generated Avatars (should succeed) ---');
  let successCount = 0;
  for (const author of generatedAuthors) {
    if (await testCDNFetch(author)) {
      successCount++;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n--- Testing Non-Generated Avatars (should fail gracefully) ---');
  let notFoundCount = 0;
  for (const author of notGenerated) {
    if (!await testCDNFetch(author)) {
      notFoundCount++;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n=== Test Summary ===');
  console.log(`✅ CDN hits: ${successCount}/${generatedAuthors.length}`);
  console.log(`❌ Expected misses: ${notFoundCount}/${notGenerated.length}`);

  if (successCount === generatedAuthors.length && notFoundCount === notGenerated.length) {
    console.log('\n🎉 All tests passed! CDN is working correctly.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Check the output above.');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
