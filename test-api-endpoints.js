#!/usr/bin/env node

// Test script to verify API endpoints on both API Gateways

const https = require('https');

const APIs = {
  'spool-api (alj6xppcj6)': 'https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod',
  'academia-search-api (1nnruhxb5d)': 'https://1nnruhxb5d.execute-api.us-east-1.amazonaws.com/prod'
};

const endpoints = [
  '/api/thread/connection/test',
  '/api/thread/list',
  '/api/thread/test-thread-id/graph',
  '/health',
  '/',
  '/api',
  '/api/thread'
];

function testEndpoint(apiName, baseUrl, endpoint) {
  return new Promise((resolve) => {
    const url = baseUrl + endpoint;
    console.log(`\nTesting ${apiName} - ${endpoint}`);
    console.log(`URL: ${url}`);
    
    https.get(url, (res) => {
      console.log(`Status: ${res.statusCode}`);
      console.log(`Headers:`, res.headers);
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (data) {
          try {
            const parsed = JSON.parse(data);
            console.log('Response:', JSON.stringify(parsed, null, 2));
          } catch {
            console.log('Response (raw):', data.substring(0, 200));
          }
        }
        resolve();
      });
    }).on('error', (err) => {
      console.log(`Error: ${err.message}`);
      resolve();
    });
  });
}

async function testAPIs() {
  for (const [apiName, baseUrl] of Object.entries(APIs)) {
    console.log('\n' + '='.repeat(60));
    console.log(`Testing ${apiName}`);
    console.log('='.repeat(60));
    
    for (const endpoint of endpoints) {
      await testEndpoint(apiName, baseUrl, endpoint);
      await new Promise(r => setTimeout(r, 500)); // Rate limiting
    }
  }
}

testAPIs();