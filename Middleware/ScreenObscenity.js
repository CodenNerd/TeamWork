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

        return res.status(200).send({
            response: prevResponse,
            adult_content
        });
        
    }
}

export default ScreenImage.screen;