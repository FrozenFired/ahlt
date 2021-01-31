const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const colection = 'Home';
const dbSchema = new Schema({
	
	bgMovie: String,		// 该产品页面的背景视频

	titleColor: String,
	nomeSize: Number,
	firmSize: Number,
	preNome: String,
	firmNome: String,
	afterNome: String,

	titleSize: Number,
	title1: String,
	title2: String,
	title3: String,	
});

dbSchema.pre('save', function(next) {	
	next();
});

const db = mongoose.model(colection, dbSchema);

module.exports = db;