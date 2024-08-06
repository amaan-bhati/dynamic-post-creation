const express = require('express');
const multer = require('multer');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.post('/generate-og-image', upload.single('image'), async (req, res) => {
  const { title, content } = req.body;
  const imagePath = req.file ? req.file.path : null;

  const imageUrl = await generateOgImage(title, content, imagePath);
  res.json({ imageUrl });
});

const generateOgImage = async (title, content, imagePath) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const contentHtml = `
    <html>
    <head>
      <style>
        body {
          width: 1200px;
          height: 630px;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          background-color: white;
          font-family: Arial, sans-serif;
        }
        .container {
          padding: 20px;
        }
        h1 {
          font-size: 48px;
          color: black;
        }
        p {
          font-size: 24px;
          color: #333;
        }
        img {
          max-width: 100%;
          height: auto;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>${title}</h1>
        <p>${content.substring(0, 100)}...</p>
        ${imagePath ? `<img src="file://${path.resolve(imagePath)}" />` : ''}
      </div>
    </body>
    </html>
  `;

  await page.setContent(contentHtml);
  await page.setViewport({ width: 1200, height: 630 });

  const outputPath = path.join(__dirname, '../public/og-image.png');
  await page.screenshot({ path: outputPath });
  await browser.close();

  return '/og-image.png';
};

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
