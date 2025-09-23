#!/usr/bin/env node

/**
 * Cron job script to fetch Saudi Arabia news from NewsAPI
 * and create posts in our database
 * 
 * Usage:
 * - Manual run: node scripts/fetch-saudi-news.js
 * - Cron job: 0 */6 * * * cd /path/to/project && node scripts/fetch-saudi-news.js
 *   (runs every 6 hours)
 */

const https = require('https')
const http = require('http')

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'
const NEWSAPI_ENDPOINT = '/api/newsapi/fetch-saudi-news'

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  const timestamp = new Date().toISOString()
  console.log(`${colors[color]}[${timestamp}] ${message}${colors.reset}`)
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://')
    const client = isHttps ? https : http
    
    const req = client.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'RenasPress-Cron/1.0'
      },
      ...options
    }, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data)
          resolve({
            statusCode: res.statusCode,
            data: jsonData
          })
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`))
        }
      })
    })
    
    req.on('error', (error) => {
      reject(error)
    })
    
    req.setTimeout(30000, () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })
    
    req.end()
  })
}

async function fetchSaudiNews() {
  try {
    log('Starting Saudi Arabia news fetch...', 'cyan')
    
    const url = `${API_BASE_URL}${NEWSAPI_ENDPOINT}`
    log(`Making request to: ${url}`, 'blue')
    
    const response = await makeRequest(url)
    
    if (response.statusCode === 200 && response.data.success) {
      log(`✅ Successfully created ${response.data.posts.length} posts`, 'green')
      log(`📊 Total articles processed: ${response.data.totalArticles}`, 'green')
      
      if (response.data.posts.length > 0) {
        log('📝 Created posts:', 'yellow')
        response.data.posts.forEach((post, index) => {
          log(`  ${index + 1}. ${post.title} (${post.category})`, 'yellow')
        })
      }
      
      return {
        success: true,
        postsCreated: response.data.posts.length,
        totalArticles: response.data.totalArticles
      }
    } else {
      log(`❌ API request failed: ${response.data.error || 'Unknown error'}`, 'red')
      return {
        success: false,
        error: response.data.error || 'Unknown error'
      }
    }
    
  } catch (error) {
    log(`❌ Error fetching news: ${error.message}`, 'red')
    return {
      success: false,
      error: error.message
    }
  }
}

// Main execution
async function main() {
  log('🚀 RenasPress Saudi Arabia News Fetcher', 'bright')
  log('=====================================', 'bright')
  
  const result = await fetchSaudiNews()
  
  if (result.success) {
    log('✅ News fetch completed successfully!', 'green')
    process.exit(0)
  } else {
    log('❌ News fetch failed!', 'red')
    process.exit(1)
  }
}

// Handle process signals
process.on('SIGINT', () => {
  log('🛑 Process interrupted by user', 'yellow')
  process.exit(0)
})

process.on('SIGTERM', () => {
  log('🛑 Process terminated', 'yellow')
  process.exit(0)
})

// Run the script
if (require.main === module) {
  main().catch((error) => {
    log(`💥 Unhandled error: ${error.message}`, 'red')
    process.exit(1)
  })
}

module.exports = { fetchSaudiNews }