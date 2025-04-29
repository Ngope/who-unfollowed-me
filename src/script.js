const { chromium } = require('playwright');
require('dotenv').config();
const fs = require('fs');

const INSTAGRAM_URL = 'https://www.instagram.com';
const USERNAME = process.env.INSTAGRAM_USERNAME;
const PASSWORD = process.env.INSTAGRAM_PASSWORD;
const TARGET_ACCOUNT = 'peterson.ngo';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Login
    await page.goto(`${INSTAGRAM_URL}/accounts/login/`);
    await page.fill('input[name="username"]', USERNAME);
    await page.fill('input[name="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForNavigation();

    // Navigate to target account
    await page.goto(`${INSTAGRAM_URL}/${TARGET_ACCOUNT}`);
    await delay(2000);

    // Click followers link
    const followersLink = await page.waitForSelector('a[href$="/followers/"]');
    await followersLink.click();
    await delay(3000);

    // Wait for and verify modal is loaded
    const modal = await page.waitForSelector('div[role="dialog"]', { timeout: 10000 });
    if (!modal) {
      throw new Error('Followers modal failed to load');
    }

    let followers = new Set();
    let previousFollowerCount = 0;
    let noNewFollowersCount = 0;

    while (noNewFollowersCount < 3) {
      // Scroll the modal's scrollable container
      await page.evaluate(() => {
        const scrollableContainer = document.querySelector('div.xyi19xy.x1ccrb07.xtf3nb5.x1pc53ja.x1lliihq.x1iyjqo2.xs83m0k.xz65tgg.x1rife3k.x1n2onr6');
        if (scrollableContainer) {
          const currentScrollTop = scrollableContainer.scrollTop;
          // Scroll down by a fixed amount each time
          scrollableContainer.scrollTop += 800;
        }
      });
      
      // Increase delay to ensure content loads
      await delay(3000);

      // Get current followers with more detailed logging
      const newFollowers = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('div[role="dialog"] a[role="link"]'));
        const usernames = links
          .map(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('/') && !href.includes('hashtag') && !href.includes('explore')) {
              return href.replace('/', '');
            }
            return null;
          })
          .filter(username => username !== null);
        
        return usernames;
      });

      const previousSize = followers.size;
      newFollowers.forEach(follower => followers.add(follower));
      
      // Check if we got new followers
      if (followers.size === previousFollowerCount) {
        noNewFollowersCount++;
        console.log(`No new followers found. Attempt ${noNewFollowersCount}/3`);
      } else {
        noNewFollowersCount = 0;
      }

      previousFollowerCount = followers.size;
    }

    // Save results
    const followersArray = Array.from(followers);
    console.log(`Total followers fetched: ${followersArray.length}`);
    fs.writeFileSync('followers.json', JSON.stringify(followersArray, null, 2));

  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await browser.close();
  }
})();
