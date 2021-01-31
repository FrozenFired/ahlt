const bcrypt = require('bcryptjs');
const _ = require('underscore');

const Ader = require('../../models/ader');

exports.aderAdd = (req, res) => {
	res.render('./ader/ader/add', {
		title: 'Add Adminnistrator',
		crAder : req.session.crAder,
	})
}

exports.aderNew = async(req, res) => {
	try{
		const obj = req.body.obj
		obj.code = obj.code.replace(/^\s*/g,"").toUpperCase();
		obj.pwd = await userPwdBcrypt_FilterProm(obj.pwd);

		const aderSame = await Ader.findOne({code: obj.code});
		if(aderSame) return res.redirect('/error?info=此帐号已经被注册，请重新注册');

		const _ader = new Ader(obj)
		const aderSave = await _ader.save();

		return res.redirect('/aders')
	} catch(error) {
		console.log(error)
		return res.redirect('/error?info=admin添加数据错误&error='+error)
	}
}

exports.aders = async(req, res) => {
	// console.log("/aders")
	try{
		const crAder = req.session.crAder;
		const aders = await Ader.find();
		return res.render('./ader/ader/list', {title: '用户列表', crAder, aders })
	} catch(error) {
		return res.redirect('/error?info=查看adimn列表时,数据库查找错误&error='+error)
	}
}

exports.ader = async(req, res) => {
	try{
		const crAder = req.session.crAder;
		const id = req.params.id;
		const ader = await Ader.findOne({_id: id});
		if(!ader) return res.redirect('/error?info=找不到此账号');
		return res.render('./ader/ader/detail', {title: 'admin列表', crAder, ader })
	} catch(error) {
		return res.redirect('/error?info=查看adimn信息时,数据库查找错误&error='+error)
	}
}

exports.aderDel = async(req, res) => {
	try{
		const id = req.params.id;
		const ader = await Ader.findOne({_id: id});
		if(!ader) return res.redirect('/error?info=找不到此账号');
		const del = await Ader.deleteOne({_id: id});
		res.redirect('/aders')
			
	} catch(error) {
		return res.redirect('/error?info=删除adimn时,数据库查找错误&error='+error)
	}
}

const userPwdBcrypt_FilterProm = (pwd) => {
	return new Promise((resolve, reject) => {
		if(!pwd) reject('请您输入密码');
		pwd = pwd.replace(/^\s*/g,"");
		bcrypt.genSalt(parseInt(process.env.SALT_WORK_FACTOR), function(err, salt) {
			if(err) {
				reject('bcrypt.genSalt error!');
			} else {
				bcrypt.hash(pwd, salt, function(err, password) {
					if(err) {
						reject('bcrypt.hash error!');
					} else {
						resolve(password);
					}
				});
			}
		});
	})
}