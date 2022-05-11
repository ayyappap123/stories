
module.exports = (app, express) => {

    const router = express.Router();
    const StoryController = require('../abcCompany/Controller');
    const config = require('../../../configs/configs');

    router.post('/addStory', (req, res, next) => {
        const carObj = (new StoryController()).boot(req, res);
        return carObj.addStory();
    });

    router.get('/getAllStories', (req, res, next) => {
        const carObj = (new StoryController()).boot(req, res);
        return carObj.getAllStories();
    });


    app.use(config.baseApiUrl, router);
}