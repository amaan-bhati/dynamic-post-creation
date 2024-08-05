const express = require('express');
const multer = require('multer');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.post('/generate-og-image', upload.single('image'), async (req, res) => {
  const { title, content } = req.body;
  const imagePath = req.file ? req.file.path : null;

  const buffer = await generateOgImage(title, content, imagePath);
  const outputPath = path.join(__dirname, '../public/og-image.png');
  fs.writeFileSync(outputPath, buffer);

  res.json({ imageUrl: '/og-image.png' });
});

const generateOgImage = async (title, content, imagePath) => {
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');

  // Draw background
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw title
  ctx.font = 'bold 48px Arial';
  ctx.fillStyle = '#000';
  ctx.fillText(title, 50, 100);

  // Draw content snippet
  ctx.font = '30px Arial';
  ctx.fillStyle = '#333';
  ctx.fillText(content.substring(0, 100) + '...', 50, 200);

  // Draw image if available
  if (imagePath) {
    const image = await loadImage(imagePath);
    ctx.drawImage(image, 50, 250, 1100, 300);
  }

  return canvas.toBuffer();
};

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
