const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const colection = 'Navdb';
const dbSchema = new Schema({
	level: Number,						// 分类名称。 比如：PELLI
	// 如果level为1 
	photo: String,
	sup: {type: ObjectId, ref: 'Navdb'},

	cn: String,							// 分类的中文名称
	it: String,							// 此分类的意大利文名称
	en: String,							// 此分类的英文名称

	bgMovie: String,		// 该产品页面的背景视频
	headerColor: String,	// 字体颜色
	headerFir: String,		// 背景视频下的主标题一
	headerSec: String,		// 背景视频下的主标题二

	despTitle: String,		// 对此分类的简要描述
	despFir: String,		// 第一段描述
	despSec: String,		// 第二段描述

	// 如果level为 2或3 
	subs: [{type: ObjectId, ref: 'Navdb'}],
	showSubsTbNum: Number,			// 是否显示 子模块内容 以此数字为限制
	subsCol: Number,				// 横排显示的子模块数量
	titleSubs: String,				// 显示 子模块的话写一个标题
	subsFontColor: String,		// 该产品页面下 子模块的table背景颜色
	bgSubsTableColor: String,		// 该产品页面下 子模块的table背景颜色

	isShowSupport: Number,
	supportTitle: String,
	photoSpt1: String,
	titleSpt1: String,
	despSpt1: String,
	photoSpt2: String,
	titleSpt2: String,
	despSpt2: String,
	photoSpt3: String,
	titleSpt3: String,
	despSpt3: String,
	photoSpt4: String,
	titleSpt4: String,
	despSpt4: String,

	isShowIntr: Number,
	intr: String,
	intrtitle1: String,
	intrdesp1: String,
	intrtitle2: String,
	intrdesp2: String,
	intrtitle3: String,
	intrdesp3: String,
	intrtitle4: String,
	intrdesp4: String,

	weight: Number,						// 权重， 排序用的
	shelf: Number,						// 权重， 排序用的
});

dbSchema.pre('save', function(next) {	
	if(this.isNew) {
		if(!this.weight) this.weight = 0;
	} else {}
	next();
});

const db = mongoose.model(colection, dbSchema);

module.exports = db;