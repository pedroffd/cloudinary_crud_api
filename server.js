const { cloudinary } = require('./utils/cloudinary');
const express = require('express');
const app = express();
var cors = require('cors');

app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
/*app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
  }) */
app.get('/api/images', async (req, res) => {
    const { resources } = await cloudinary.search
        .expression(`folder:${process.env.CLOUDINARY_FOLDER_NAME}`)
        .sort_by('public_id', 'desc')
        .max_results(30)
        .execute();

    const publicIds = resources.map((file) => file.public_id);
    res.send(publicIds);
});

app.post('/api/delete', async (req, res) => {
    try {
        await cloudinary.uploader.destroy(req.body.data)
        .then(result=>console.log(result));
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

app.post('/api/upload', async (req, res) => {
    try {
        const fileStr = req.body.data;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        });
        console.log(uploadResponse);
       res.send(uploadResponse)
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('listening on 8080');
});
