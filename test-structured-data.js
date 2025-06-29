// Test script to verify structured data implementation
// Run this after the site is deployed to test the structured data

const testStructuredData = async () => {
  const url = 'https://codeclinic.nl'; // Update with your actual domain
  
  try {
    console.log('Testing structured data implementation...');
    
    // Test 1: Check if the page loads
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Test 2: Check for LocalBusiness schema
    const localBusinessMatch = html.match(/"@type":\s*"LocalBusiness"/);
    if (localBusinessMatch) {
      console.log('✅ LocalBusiness schema found');
    } else {
      console.log('❌ LocalBusiness schema not found');
    }
    
    // Test 3: Check for Organization schema
    const organizationMatch = html.match(/"@type":\s*"Organization"/);
    if (organizationMatch) {
      console.log('✅ Organization schema found');
    } else {
      console.log('❌ Organization schema not found');
    }
    
    // Test 4: Check for WebSite schema
    const websiteMatch = html.match(/"@type":\s*"WebSite"/);
    if (websiteMatch) {
      console.log('✅ WebSite schema found');
    } else {
      console.log('❌ WebSite schema not found');
    }
    
    // Test 5: Check for BreadcrumbList schema
    const breadcrumbMatch = html.match(/"@type":\s*"BreadcrumbList"/);
    if (breadcrumbMatch) {
      console.log('✅ BreadcrumbList schema found');
    } else {
      console.log('❌ BreadcrumbList schema not found');
    }
    
    // Test 6: Check for business name
    const businessNameMatch = html.match(/"name":\s*"CodeClinic\.nl"/);
    if (businessNameMatch) {
      console.log('✅ Business name found');
    } else {
      console.log('❌ Business name not found');
    }
    
    // Test 7: Check for phone number
    const phoneMatch = html.match(/"telephone":\s*"\+31-6-24837889"/);
    if (phoneMatch) {
      console.log('✅ Phone number found');
    } else {
      console.log('❌ Phone number not found');
    }
    
    // Test 8: Check for service area
    const serviceAreaMatch = html.match(/"areaServed":/);
    if (serviceAreaMatch) {
      console.log('✅ Service area information found');
    } else {
      console.log('❌ Service area information not found');
    }
    
    // Test 9: Check for "no cure no pay" guarantee
    const guaranteeMatch = html.match(/Niet opgelost = geen kosten/);
    if (guaranteeMatch) {
      console.log('✅ "No cure no pay" guarantee found');
    } else {
      console.log('❌ "No cure no pay" guarantee not found');
    }
    
    console.log('\n📋 Next steps:');
    console.log('1. Visit https://search.google.com/test/rich-results');
    console.log('2. Enter your URL to test structured data');
    console.log('3. Check for any errors or warnings');
    console.log('4. Verify that LocalBusiness schema is recognized');
    console.log('5. Test FAQ page separately for FAQPage schema');
    
  } catch (error) {
    console.error('❌ Error testing structured data:', error.message);
  }
};

// Run the test
testStructuredData(); 