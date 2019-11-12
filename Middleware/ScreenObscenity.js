import vision from '@google-cloud/vision';

const ScreenImage = {
    async screen(req, res) {

        // Creates a client
        const client = new vision.ImageAnnotatorClient();

        // Performs label detection on the image file
        const result = await client.safeSearchDetection('');

       return res.status(200).send({
           result
       });

    }
}

export default ScreenImage.screen;