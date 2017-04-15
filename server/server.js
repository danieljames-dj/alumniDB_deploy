var express = require('express');
var app = express();
var bodyparser = require('body-parser');
// var fileUpload = require('express-fileupload');
app.use(express.static('public'));
app.use(bodyparser.json({limit: '50mb'}));
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
	return next();
});
// app.use(fileUpload());
var mysql = require("mysql");
var fs = require("fs");
var jwt = require('jsonwebtoken');
app.set('superSecret', 'tkmce87');
var con = mysql.createConnection({
  host: "localhost",
  user: "dany",
  password: "emmaus",
  database: "node",
  multipleStatements: true
});
con.connect(function(err) {
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Database Connection established');
});

app.post('/signin',function(req,res) { // UNUSED
	console.log(req.body);
	con.query('select * from users where gEmail=\''+req.body.gEmail+'\'',function(err,rows){
		console.log(rows);
		if (!err && rows.length > 0) {
			if (rows[0].status == 1) {
				res.json({
					success: true
				});
			} else {
				res.json({
					success: false
				});
			}
		} else {
			res.json({
				success: false
			});
		}
	});
});

app.post('/register',function(req,res) {
	console.log(req.body);
	var updateFiles = function(object, uID) {
		object.old_face = ((object.file1) ? '1' : '0');
		object.new_face = ((object.file2) ? '1' : '0');
		object.familyPic1 = ((object.file3) ? '1' : '0');
		object.familyPic2 = ((object.file4) ? '1' : '0');
		console.log("In updateFiles");
		console.log(object);
		if (object.file1) {
			writeStream = fs.createWriteStream("./pics/" + uID + "/1");
			writeStream.write(object.file1);
			writeStream.end();
		}
		if (object.file2) {
			writeStream = fs.createWriteStream("./pics/" + uID + "/2");
			writeStream.write(object.file2);
			writeStream.end();
		}
		if (object.file3) {
			writeStream = fs.createWriteStream("./pics/" + uID + "/3");
			writeStream.write(object.file3);
			writeStream.end();
		}
		if (object.file4) {
			writeStream = fs.createWriteStream("./pics/" + uID + "/4");
			writeStream.write(object.file4);
			writeStream.end();
		}
	}
	con.query('select * from users where gEmail=\''+req.body.gEmail+'\'',function(err,rows) {
		if (!err && rows.length > 0) {
			// old user
			var object = req.body;
			updateFiles(object, rows[0].uID);
			console.log("After updateFiles");
			console.log(object);
			con.query("update users set" +
				" uID = " + "'" + object.uID + "'," +
				" branch = " + "'" + object.branch + "'," +
				" name = " + "'" + object.name + "'," +
				" gName = " + "'" + object.gName + "'," +
				" gEmail = " + "'" + object.gEmail + "'," +
				" name_alt = " + "'" + object.name_alt + "'," +
				" email = " + "'" + object.email + "'," +
				" contact = " + "'" + object.contact + "'," +
				" address_new = " + "'" + object.address_new + "'," +
				" location_current = " + "'" + object.location_current + "'," +
				" intro = " + "'" + object.intro + "'," +
				" old_face = " + "'" + object.old_face + "'," +
				" new_face = " + "'" + object.new_face + "'," +
				" familyPic1 = " + "'" + object.familyPic1 + "'," +
				" familyPic2 = " + "'" + object.familyPic2 + "'," +
				" status = " + "0" +
				" where uID = '" + object.uID + "'",function(err,rows){
					console.log(err);
					console.log(rows);
				});
			res.json({
				success: true
			});
		} else {
			// new user
			fs.readFile('./pics/count', 'utf8', function(err,data) {
				var count = parseInt(data);
				if (req.body.name != 'Select Name') {
					count++;
					console.log(count);
					console.log(count.toString());
					writeStream = fs.createWriteStream("./pics/count");
					writeStream.write(count.toString());
					writeStream.end();
					if (!fs.existsSync("./pics/" + count)) {
						fs.mkdirSync("./pics/" + count);
					}
					var object = req.body;
					updateFiles(object, count);
					console.log("After updateFiles");
					console.log(object);
					con.query("insert into users set" +
						" uID = " + "'" + count + "'," +
						" branch = " + "'" + object.branch + "'," +
						" name = " + "'" + object.name + "'," +
						" gName = " + "'" + object.gName + "'," +
						" gEmail = " + "'" + object.gEmail + "'," +
						" name_alt = " + "'" + object.name_alt + "'," +
						" email = " + "'" + object.email + "'," +
						" contact = " + "'" + object.contact + "'," +
						" address_new = " + "'" + object.address_new + "'," +
						" location_current = " + "'" + object.location_current + "'," +
						" intro = " + "'" + object.intro + "'," +
						" old_face = " + "'" + object.old_face + "'," +
						" new_face = " + "'" + object.new_face + "'," +
						" familyPic1 = " + "'" + object.familyPic1 + "'," +
						" familyPic2 = " + "'" + object.familyPic2 + "'," +
						" status = " + "0" ,function(err,rows){
							console.log(err);
							console.log(rows);
						});
					res.json({
						success: true
					});
				} else {
					res.json({
						success: false
					});
				}
			});
		}
	});
});

app.post('/getBranchName',function(req,res) {
	var curUser = null;
	console.log(req.body);
	con.query('select * from users where gEmail=\''+req.body.gEmail+'\'',function(err,rows){
		console.log(rows);
		if (!err && rows.length > 0) {
			curUser = rows[0];
		}
		con.query('select branch,name from users where status = 0 and gEmail is null order by branch',function(err,rowsNew) {
			console.log("JIKSJD");
			console.log(err);
			console.log(rowsNew);
			if (curUser && curUser.status == 1)
				rowsNew = [];
			if (!err) {
				res.json({
					curUser: curUser,
					rows: rowsNew
				});
			}
		});
	});
});

app.post('/getPic',function(req,res) {
	var curUser = null;
	console.log(req.body);
	con.query('select uID from users where branch=\''+req.body.branch+'\' and name=\''+req.body.name+'\'',function(err,rows){
		console.log(rows);
		if (!err && rows.length > 0) {
			curUser = rows[0];
			console.log(rows[0]);
			fs.readFile("./pics/" + rows[0].uID + "/1", 'utf8', function(err, data) {
				if (!err) {
					res.json({
						success: true,
						details: data
					});
				} else {
					res.json({
						success: false
					});
				}
			});
		} else {
			res.json({
				success: false
			});
		}
	});
});

app.post('/getApproved',function(req,res) {
	console.log(req.body);
	con.query('select gEmail, name, branch from users where gEmail is not null and status = 1',function(err,rows){
		console.log(rows);
		res.json({
			rows: rows
		});
	});
});

app.post('/getNonApproved',function(req,res) {
	console.log(req.body);
	con.query('select gEmail, name, branch from users where gEmail is not null and status = 0',function(err,rows){
		console.log(rows);
		res.json({
			rows: rows
		});
	});
});

app.post('/getUser',function(req,res) {
	console.log(req.body);
	con.query('select * from users where gEmail=\''+req.body.gEmail+'\'',function(err,rows){
		console.log(rows);
		if (!err && rows.length > 0) {
			var details = rows[0], flag = 0;
			if (details.old_face != '0') {
				fs.readFile("./pics/" + details.uID + "/1", 'utf8', function(err, data) {
					if (!err) {
						details.old_face = data;
						flag++;
						if (flag == 4) {
							res.json({
								success: true,
								details: details
							});
							flag++;
						}
					}
				});
			} else {
				flag++;
				if (flag == 4) {
					res.json({
						success: true,
						details: details
					});
					flag++;
				}
			}
			if (details.new_face != '0') {
				fs.readFile("./pics/" + details.uID + "/2", 'utf8', function(err, data) {
					if (!err) {
						details.new_face = data;
						flag++;
						if (flag == 4) {
							res.json({
								success: true,
								details: details
							});
							flag++;
						}
					}
				});
			} else {
				flag++;
				if (flag == 4) {
					res.json({
						success: true,
						details: details
					});
					flag++;
				}
			}
			if (details.familyPic1 != '0') {
				fs.readFile("./pics/" + details.uID + "/3", 'utf8', function(err, data) {
					if (!err) {
						details.familyPic1 = data;
						flag++;
						if (flag == 4) {
							res.json({
								success: true,
								details: details
							});
							flag++;
						}
					}
				});
			} else {
				flag++;
				if (flag == 4) {
					res.json({
						success: true,
						details: details
					});
					flag++;
				}
			}
			if (details.familyPic2 != '0') {
				fs.readFile("./pics/" + details.uID + "/4", 'utf8', function(err, data) {
					if (!err) {
						details.familyPic2 = data;
						flag++;
						if (flag == 4) {
							res.json({
								success: true,
								details: details
							});
							flag++;
						}
					}
				});
			} else {
				flag++;
				if (flag == 4) {
					res.json({
						success: true,
						details: details
					});
					flag++;
				}
			}
			if (flag == 4) {
				res.json({
					success: true,
					details: details
				});
			}
		} else {
			res.json({
				success: false,
				details: null
			});
		}
	});
});

app.post('/getRegdList',function(req,res) { // UNUSED
	console.log(req.body);
	con.query('select * from users where status=1',function(err,rows){
		console.log(rows);
		if (!err && rows.length > 0) {
			res.json({
				success: true,
				details: rows
			});
		} else {
			res.json({
				success: false,
				details: null
			});
		}
	});
});

app.post('/reset',function(req,res) { // UNUSED
	console.log(req.body);
	var count = req.body.length - 1;
	var deleteFolderRecursive = function(path) {
	  if( fs.existsSync(path) ) {
	    fs.readdirSync(path).forEach(function(file,index){
	      var curPath = path + "/" + file;
	      if(fs.lstatSync(curPath).isDirectory()) { // recurse
	        deleteFolderRecursive(curPath);
	      } else { // delete file
	        fs.unlinkSync(curPath);
	      }
	    });
	    fs.rmdirSync(path);
	  }
	};
	// deleteFolderRecursive("./pics");
	if (!fs.existsSync("./pics/")) {
		fs.mkdirSync("./pics/");
	}
	writeStream = fs.createWriteStream("./pics/count");
	writeStream.write(count.toString());
	writeStream.end();
	// con.query("delete from users;",function(err,rows){});
	for (key in req.body) {
		var obj = req.body[key];
		if (obj != null) {
			console.log(obj);
			var old_face = 0;
			if (obj.file) {
				if (!fs.existsSync("./pics/" + obj.uID)) {
					fs.mkdirSync("./pics/" + obj.uID);
				}
				writeStream = fs.createWriteStream("./pics/" + obj.uID + "/1");
				writeStream.write(obj.file);
				writeStream.end();
				old_face = 1;
			}
			con.query("insert into users (uID, branch, name, old_face, status) values ('" + obj.uID + "','" + obj.branch + "','" + obj.name + "','" + old_face + "'," + 0 + ")",function(err,rows) {
				console.log(err);
				console.log(rows);
			});
		}
	}
	// con.query(req.body.query,function(err,rows){
	// 	console.log(err);
	// 	console.log(rows);
	// });
	// con.query("update users set status = 0;",function(err,rows){});
});

app.post('/approve',function(req,res) { // UNUSED
	console.log(req.body);
	con.query("update users set" +
		" status = 1 where gEmail = '" + req.body.gEmail + "'",function(err,rows){
			console.log(err);
			console.log(rows);
		});
		con.query("delete from users where name = '" + req.body.name + "' and gEmail is null",function(err,rows){
			console.log(err);
			console.log(rows);
			res.json({
				success: true
			});
		});
	// con.query("delete from users;",function(err,rows){});
	// con.query(req.body.query,function(err,rows){
	// 	console.log(err);
	// 	console.log(rows);
	// });
	// con.query("update users set status = 0;",function(err,rows){});
});

app.post('/delete',function(req,res) { // UNUSED
	console.log(req.body);
	con.query("delete from users where gEmail = '" + req.body.gEmail + "'",function(err,rows){
			console.log(err);
			console.log(rows);
			res.json({
				success: true
			});
		});
	// con.query("delete from users;",function(err,rows){});
	// con.query(req.body.query,function(err,rows){
	// 	console.log(err);
	// 	console.log(rows);
	// });
	// con.query("update users set status = 0;",function(err,rows){});
});

app.listen(8080, function() {
	console.log("Server listening to port 8080");
});
