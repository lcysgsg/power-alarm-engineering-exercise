import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
let backendReady=false
for(let attempt=0;attempt<100;attempt++){
  try {
    const response=await fetch('http://127.0.0.1:8080/api/health')
    if(response.ok && (await response.json()).status==='UP'){backendReady=true;break}
  }catch{}
  await new Promise(resolve=>setTimeout(resolve,1000))
}
assert.ok(backendReady,'Backend did not become healthy before browser test')
const browser=await chromium.launch({headless:true,args:['--no-sandbox']})
try {
 const page=await browser.newPage({viewport:{width:1440,height:900}})
 const pageErrors=[]
 page.on('pageerror',error=>pageErrors.push(error.message))
 await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'})
 await page.getByText('API 已连接').waitFor({timeout:20000})
 await page.getByText('设备告警台账',{exact:true}).waitFor()
 const originalRows=await page.locator('tbody tr').count()
 assert.equal(originalRows,3)
 await page.locator('tbody tr').filter({hasText:'1号主变'}).getByRole('button',{name:'确认'}).click()
 await page.locator('#operator').fill('浏览器验收')
 await page.locator('[role=dialog]').getByRole('button',{name:'确认',exact:true}).click()
 await page.getByText('浏览器验收',{exact:true}).waitFor()
 await page.getByRole('button',{name:'发送示例事件'}).click()
 await page.getByText('2号主变',{exact:true}).waitFor()
 assert.deepEqual(pageErrors,[], 'Unexpected frontend JavaScript exceptions')
 await mkdir('artifacts',{recursive:true})
 await page.screenshot({path:'artifacts/advanced-browser.png',fullPage:true})
 console.log('PASS browser: loaded alarm list, acknowledged alarm, submitted simulated event and displayed new alarm')
} finally {await browser.close()}
