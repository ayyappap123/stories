var mongoose = require('mongoose');
var schema = mongoose.Schema;
var story = new schema({
    title: { type: String },
    link: { type: String }
}, {
        timestamps: true
    });
let Stories = mongoose.model('Story', story);
module.exports = {
    Stories
}