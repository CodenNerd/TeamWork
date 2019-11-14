import vision from '@google-cloud/vision';

const ScreenImage = {
    async screen(req, res, done) {
            const prevResponse = req.response;
            let adult_content;
        try {
            const client = new vision.ImageAnnotatorClient();
            const results = await client.safeSearchDetection(prevResponse.data.imageURL);
            adult_content = results[0].safeSearchAnnotation.adult;
        } catch (error) {
            adult_content = null;
        }
        prevResponse.adult_content = adult_content;
        return res.status(201).send(prevResponse);
        
    }
}

export default ScreenImage.screen;