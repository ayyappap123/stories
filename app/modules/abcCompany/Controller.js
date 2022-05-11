const _ = require("lodash");
const Controller = require("../Base/Controller");
const Stories = require('./Schema').Stories;
const Model = require("../Base/Model");
class StoryController extends Controller {
    constructor() {
        super();
    }
    /********************************************************
       Purpose: Add Story
       Parameter:
          {
              title: "Swift",
              link: 2019
          }
       Return: JSON String
       ********************************************************/
    async addStory() {
        try {
            if (!this.req.body.title || !this.req.body.link) {
                return this.res.send({ status: 0, message: "Please send proper request parameter." })
            }
            let data = this.req.body;
            const newStory = await new Model(Stories).store(data);
            if (newStory.length == 0) {
                return this.res.send({ status: 0, message: "Story Details Not saved." })
            }
            return this.res.send({ status: 1, message: "Story Details Inserted successfully." });
        } catch (error) {
            console.log("error = ", error);
            this.res.send({ status: 0, message: error });
        }
    }
    /********************************************************
    Purpose: get All Stories
    Parameter:
        {
            page:1,
            pageSize:10
        }
    Return: Array of JSON Objects
   ********************************************************/
    async getAllStories() {
        try {
            let page = 1;
            let pageSize = 100;
            let skip = (Number(page) - 1) * (Number(pageSize));
            let sort = { createdAt: -1 };
            let listing = await Stories.find().sort(sort).skip(skip).limit(Number(pageSize));
            let total = await Stories.countDocuments();
            return this.res.send({ status: 1, message: "Story Details found.", data: listing, page: page, pageSize: pageSize, total: total });
        } catch (error) {
            console.log("error = ", error);
            this.res.send({ status: 0, message: 'Something went wrong.' });
        }
    }
}
module.exports = StoryController;