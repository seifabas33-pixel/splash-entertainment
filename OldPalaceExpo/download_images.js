const https = require('https');
const fs = require('fs');
const path = require('path');

const downloadImage = (url, filename) => {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(fs.createWriteStream(filename))
                    .on('error', reject)
                    .once('close', () => resolve(filename));
            } else {
                response.resume();
                reject(new Error(`Request Failed With a Status Code: ${response.statusCode}`));
            }
        }).on('error', reject);
    });
};

const images = [
    { url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/335893118.jpg?k=f8b2c4c1a5360340b10e5443de6f2c3d9a69622d109f5bb6d0426bbced5e3966&o=&hp=1', name: 'resort_pool.jpg' },
    { url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/335893149.jpg?k=85e8a0fcd5ab5d18a1a3cc807cae51cc61e89ce074e64516eb16223295847648&o=&hp=1', name: 'resort_beach.jpg' },
    { url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/335893121.jpg?k=52c5c6f3d4342fc7d7fc4ce6efd929b9e599bdfbb9d12d4b2e8d697fa20364d9&o=&hp=1', name: 'resort_lobby.jpg' }
];

const downloadAll = async () => {
    const assetDir = path.join(__dirname, 'assets', 'images');
    if (!fs.existsSync(assetDir)) {
        fs.mkdirSync(assetDir, { recursive: true });
    }

    for (let img of images) {
        try {
            console.log(`Downloading ${img.name}...`);
            await downloadImage(img.url, path.join(assetDir, img.name));
            console.log(`Successfully downloaded ${img.name}`);
        } catch (e) {
            console.error(`Failed to download ${img.name}: ${e.message}`);
        }
    }
}

downloadAll();
