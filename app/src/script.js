const { chromium } = require('playwright');
require('dotenv').config();
const fs = require('fs');

const INSTAGRAM_URL = 'https://www.instagram.com';
const USERNAME = process.env.INSTAGRAM_USERNAME;
const PASSWORD = process.env.INSTAGRAM_PASSWORD;
const TARGET_ACCOUNT = 'target_account_username'; // Replace with the target Instagram account

(async () => {
  const browser = await chromium.launch({ headless: false }); // Set headless to true to run in the background
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to Instagram login page
  await page.goto(`${INSTAGRAM_URL}/accounts/login/`);

  // Log in
  await page.fill('input[name="username"]', USERNAME);
  await page.fill('input[name="password"]', PASSWORD);
  await page.click('button[type="submit"]');

  // Wait for navigation to complete after login
  await page.waitForNavigation();

  // Navigate to the target profile page
  await page.goto(`${INSTAGRAM_URL}/${TARGET_ACCOUNT}`);

  // Click on the followers link
  await page.click('a[href$="/followers/"]');

  // Wait for the followers modal to load
  await page.waitForSelector('div[role="dialog"]');

  // Scrape follower usernames
  let followers = await page.evaluate(() => {
    let followersList = [];
    const followerElements = document.querySelectorAll('div[role="dialog"] ul li a');

    followerElements.forEach(element => {
      followersList.push(element.textContent);
    });

    return followersList;
  });

  console.log(`Followers of ${TARGET_ACCOUNT}:`, followers);

  // Save current followers to a file
  fs.writeFileSync('followers.json', JSON.stringify(followers));

  // Load previous followers from the file
  let previousFollowers = fs.existsSync('followers.json') ? JSON.parse(fs.readFileSync('followers.json', 'utf-8')) : [];

  // Find who recently unfollowed
  let unfollowed = previousFollowers.filter(user => !followers.includes(user));
  console.log('Recently unfollowed:', unfollowed);

  await browser.close();
})();
