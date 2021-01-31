const MdFiles = require('../../middle/filesLocal')
const _ = require('underscore');

const Home = require('../../models/home');

exports.adHomeSet = async(req, res) => {
	try{
		const crAder = req.session.crAder;
		const homes = await Home.find({});
		if(!homes || homes.length == 0) {
			const _object = new Home();
			console.log(_object);
			const home = await _object.save();
			return res.render('./ader/home/detail', {title: '前端主页设置', crAder, home});
		} else if(homes.length == 1) {
			const home = homes[0];
			return res.render('./ader/home/detail', {title: '前端主页设置', crAder, home});
		} else {
			return res.redirect('/error?info=数据错误,请联系管理员');
		}
	} catch(error) {
		console.log(error);
		return res.redirect('/error?info=adHomeSet,Error&error='+error);
	}
}

exports.adHomeUpdFile = async(req, res) => {
	// console.log("/adHomeUpdFile")
	try{
		const obj = req.body.obj;		// 所要更改的home的id
		const home = await Home.findOne({'_id': obj._id})
		if(!home) return res.redirect("/error?info=没有找到此导航信息, 请刷新重试");
		let _object = _.extend(home, obj)
		const homeSave = _object.save();
		return res.redirect("/adHomeSet");
	} catch(error) {
		console.log(error);
		return res.redirect("/error?info=adHomeUpdFile Error");
	}
}
exports.adHomeUpdAjax = async(req, res) => {
	try{
		const id = req.body.id;		// 所要更改的home的id
		const home = await Home.findOne({'_id': id})
		if(!home) return res.json({status: 500, message: "没有找到此导航信息, 请刷新重试"});

		let message = null;
		const type = req.body.type;	// 传输数据的类型
		let val = req.body.val;		// 数据的值
		// console.log(val);
		if(type == "String") {
			val = String(val).replace(/^\s*/g,"");
		} else if(type == "Int") {
			val = parseInt(val);
			if(isNaN(val)) message = "updAjax 参数为整数, 请传递正确的参数"
		} else if(type == "Float") {
			val = parseFloat(val);
			if(isNaN(val)) message = "updAjax 参数为小数, 请传递正确的参数"
		}
		if(message) return res.json({status: 500, message});

		const key = req.body.key;
		if(key == "level") return res.json({status: 500, message: "level参数不可修改"});

		const pickeys = ["photo", "photoSpt1", "photoSpt2", "photoSpt3", "photoSpt4", "bgMovie"]
		if(pickeys.includes(key) && home[key]) {
			if(String(home[key]).length > 30 && (String(home[key]).toUpperCase() != String(val).toUpperCase())) {
				MdFiles.deleteFile(home[key]);
			}
		}

		home[key] = val;
		const homeSave = home.save();
		return res.json({status: 200})
	} catch(error) {
		console.log(error);
		return res.json({status: 500, message: error});
	}
}