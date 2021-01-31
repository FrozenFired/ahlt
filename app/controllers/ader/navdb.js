const MdFiles = require('../../middle/filesLocal')
const _ = require('underscore');

const Navdb = require('../../models/navdb');

exports.adNavdbs = async(req, res) => {
	try{
		const crAder = req.session.crAder;
		const navdbs = await Navdb.find({level: 1}).sort({'weight': -1})
		return res.render('./ader/navdb/list', {title: '品牌一级分类列表', crAder, navdbs })
	} catch(error) {
		return res.redirect('/error?info=adNavdbs,Error&error='+error);
	}
}

exports.adNavdbNew = async(req, res) => {
	try{
		const obj = req.body.obj

		let sup = null;
		if(obj.sup) {
			sup = await Navdb.findOne({'_id': obj.sup});
			if(!sup) return res.redirect('/error?info=没有找到此分类的上一级分类');
			if(sup.level == 3) return res.redirect('/error?info=不能再分类了');
			obj.level = parseInt(sup.level)+1;
		} else {
			obj.level = 1;
		}
		// console.log(obj)
		if(obj.cn) obj.cn = obj.cn.replace(/^\s*/g,"");

		const _object = new Navdb(obj)
		if(sup) {
			sup.subs.push(_object._id);
			sup.save((err, supSave) => {
				if(err) console.log(err);
			})
		}

		const navdbSave = await _object.save();
		if(navdbSave.level == 1) {
			return res.redirect('/adNavdbs')
		} else {
			return res.redirect('/adNavdb/'+navdbSave.sup)
		}
	} catch(error) {
		console.log(error);
		return res.redirect('/error?info=adNavdbNew,Error&error='+error);
	}
}

exports.adNavdbUpdFile = async(req, res) => {
	// console.log("/adNavdbUpdFile")
	try{
		const obj = req.body.obj;		// 所要更改的navdb的id
		const navdb = await Navdb.findOne({'_id': obj._id})
		if(!navdb) return res.redirect("/error?info=没有找到此导航信息, 请刷新重试");
		let _object = _.extend(navdb, obj)
		const navdbSave = _object.save();
		return res.redirect("/adNavdb/"+obj._id);
	} catch(error) {
		console.log(error);
		return res.redirect("/error?info=adNavdbUpdFile Error");
	}
}
exports.adNavdbUpdAjax = async(req, res) => {
	try{
		const id = req.body.id;		// 所要更改的navdb的id
		const navdb = await Navdb.findOne({'_id': id})
		if(!navdb) return res.json({status: 500, message: "没有找到此导航信息, 请刷新重试"});

		let message = null;
		const type = req.body.type;	// 传输数据的类型
		let val = req.body.val;		// 数据的值
		// console.log(val);
		if(type == "Int") {
			val = parseInt(val);
			if(isNaN(val)) message = "updAjax 参数为整数, 请传递正确的参数"
		} else if(type == "Float") {
			val = parseFloat(val);
			if(isNaN(val)) message = "updAjax 参数为小数, 请传递正确的参数"
		} else {
			// type == "String"
			val = String(val).replace(/^\s*/g,"");
		}
		if(message) return res.json({status: 500, message});

		const key = req.body.key;
		if(key == "level") return res.json({status: 500, message: "level参数不可修改"});

		const pickeys = ["photo", "photoSpt1", "photoSpt2", "photoSpt3", "photoSpt4", "bgMovie"]
		if(pickeys.includes(key) && navdb[key]) {
			if(String(navdb[key]).length > 30 && (String(navdb[key]).toUpperCase() != String(val).toUpperCase())) {
				MdFiles.deleteFile(navdb[key]);
			}
		}

		navdb[key] = val;
		const navdbSave = navdb.save();
		return res.json({status: 200})
	} catch(error) {
		console.log(error);
		return res.json({status: 500, message: error});
	}
}

exports.adNavdb = async(req, res) => {
	try{
		const crAder = req.session.crAder;
		const id = req.params.id;
		const navdb = await Navdb.findOne({'_id': id}).populate({path: "subs", options: { sort: { 'weight': -1 } }});
		if(!navdb) return res.redirect('/error?info=没有找到此编号');
		return res.render('./ader/navdb/detail', {title: '品牌一级分类详情', crAder, navdb});
	} catch(error) {
		console.log(error);
		return res.redirect('/error?info=adNavdb,Error&error='+error);
	}
}
exports.adNavdbDel = async(req, res) => {
	try{
		const id = req.params.id;
		const navdb = await Navdb.findOne({'_id': id}).populate("sup");

		const subsDelMany = await Navdb.deleteMany({"sup": id});

		const sup = navdb.sup;
		if(sup) {
			sup.subs.remove(id);
			const supSave = await sup.save();
		}

		const navdbDel = await Navdb.deleteOne({'_id': id});

		if(sup) {
			return res.redirect("/adNavdb/"+sup._id);
		} else {
			return res.redirect("/adNavdbs");
		}
	} catch(error) {
		console.log(error);
		return res.redirect('/error?info=adNavdbDel,Error&error='+error);
	}
}