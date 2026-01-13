
import { execa } from 'execa';
import puppeteer from 'puppeteer';
import fs from 'fs/promises';

async function runCommands() {
    try {
        // Step 1: Run npm install
        console.log('Running npm install...');
        await execa('npm', ['install'], { stdio: 'inherit' });
        console.log('✅ npm install completed');

        // Step 2: Run npm build
        console.log('Running npm build...');
        await execa('npm', ['run', 'build'], { stdio: 'inherit' });
        console.log('✅ npm build completed');

        // Step 3: Start dev server in background
        console.log('Starting dev server...');
        const devServer = execa('npm', ['run', 'dev'], { 
            stdio: 'pipe',
            env: { ...process.env, PORT: '5173' }
        });

        // Wait a bit for the server to start
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Step 4: Take screenshots using Puppeteer
        console.log('Taking screenshots...');
        await takeScreenshots();

        // Step 5: Update README.md
        console.log('Updating README.md...');
        await updateReadme();

        // Clean up - close the dev server
        devServer.kill();
        
        console.log('✅ All tasks completed successfully!');
    } catch (error) {
        console.error('❌ Error occurred:', error);
        process.exit(1);
    }
}

async function takeScreenshots() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        // Navigate to the app
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });

        // Create screenshots directory if it doesn't exist
        await fs.mkdir('./screenshots', { recursive: true });

        // Take desktop screenshot
        await page.setViewport({ width: 1920, height: 1080 });
        await page.screenshot({ path: './screenshots/desktop-mode.png', fullPage: true });
        console.log('✅ Desktop screenshot saved');

        // Take mobile screenshot
        await page.setViewport({ width: 375, height: 667 }); // iPhone SE size
        await page.screenshot({ path: './screenshots/mobile-mode.png', fullPage: true });
        console.log('✅ Mobile screenshot saved');
    } finally {
        await browser.close();
    }
}

async function updateReadme() {
    // Read current README content
    let readmeContent = await fs.readFile('./README.md', 'utf8');

    // Update the screenshots section with new timestamps
    const desktopScreenshotLine = '| Desktop | ![Desktop Mode](./screenshots/desktop-mode.png?t=' + Date.now() + ') |';
    const mobileScreenshotLine = '| Mobile | ![Mobile Mode](./screenshots/mobile-mode.png?t=' + Date.now() + ') |';

    // Find and replace the screenshots table
    const screenshotsSectionRegex = /\|\s*Device\s*\|\s*Screenshot\s*\|\s*\|[-\s]+\|\s*\|(?:\s*\|[^\|]*\|[^\|]*\|\s*\n?)+/;

    const newScreenshotsTable = '| Device | Screenshot |\n|--------|------------|\n' + desktopScreenshotLine + '\n' + mobileScreenshotLine;

    readmeContent = readmeContent.replace(screenshotsSectionRegex, newScreenshotsTable);

    // Write updated content back to README
    await fs.writeFile('./README.md', readmeContent);
    console.log('✅ README.md updated with new screenshots');
}

// Run the commands
await runCommands();

