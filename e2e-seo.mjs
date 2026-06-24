import http from 'http';

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function runTests() {
  console.log("Starting E2E SEO & AIO Tests...\n");
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Test Homepage
    const home = await fetchUrl('http://localhost:3000/');
    assert(home.status === 200, "Homepage returns 200 OK");
    assert(home.data.includes('<main'), "Homepage contains <main> semantic tag");
    assert(home.data.includes('application/ld+json'), "Homepage contains JSON-LD schema");
    assert(home.data.includes('knowsAbout'), "JSON-LD contains 'knowsAbout' for AIO");
    assert(home.data.includes('property="og:title"'), "Homepage contains OpenGraph tags");
    assert(home.data.includes('twitter:card'), "Homepage contains Twitter Card tags");

    // 2. Test About Page Metadata
    const about = await fetchUrl('http://localhost:3000/about');
    assert(about.status === 200, "About page returns 200 OK");
    assert(about.data.includes('Tentang Kami | CV. ADIE'), "About page has correct specific title");

    // 3. Test Products Page Metadata
    const products = await fetchUrl('http://localhost:3000/products');
    assert(products.status === 200, "Products page returns 200 OK");
    assert(products.data.includes('Katalog Produk &amp; Suku Cadang | CV. ADIE'), "Products page has correct specific title");

    // 4. Test Sitemap
    const sitemap = await fetchUrl('http://localhost:3000/sitemap.xml');
    assert(sitemap.status === 200, "sitemap.xml returns 200 OK");
    assert(sitemap.data.includes('https://www.cv-adie.com'), "sitemap.xml contains correct production URLs");

    // 5. Test Robots.txt
    const robots = await fetchUrl('http://localhost:3000/robots.txt');
    assert(robots.status === 200, "robots.txt returns 200 OK");
    assert(robots.data.includes('Allow: /'), "robots.txt contains Allow rule");
    assert(robots.data.includes('Disallow: /admin/'), "robots.txt correctly blocks /admin/");

  } catch (error) {
    console.error("Test execution failed: ", error.message);
    process.exit(1);
  }

  console.log(`\nTests Completed: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) process.exit(1);
}

runTests();
