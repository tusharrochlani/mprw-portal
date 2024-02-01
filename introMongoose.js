const ex = require("express");
const bp = require("body-parser");
var path = require("path")
const mon = require("mongoose");
const app = ex();
app.use(ex.static('public'))
app.use(bp.urlencoded({extended: true}));

app.set('views',path.join(__dirname,'public'));
app.engine('html',require('ejs').renderFile);
app.set('view engine','html');


const main = async()=>{
	mon.connect('mongodb://127.0.0.1:27017/mymongodb');
	var db = mon.connection;
	db.once('open',function(callback){
		console.log("Connection Success");
	})
}
// We create schema and model 
// we are creating a model of Student created in mongodb and it will exactly mirror its properties created in schema. Model acts as a mirror image of Mongodb data
var employeeSc = new mon.Schema({
	empId : Number,
	name : String,
	department : String,
	city : String,
	contact : Number
});
const employeeModel = mon.model('Employees2',employeeSc,'Employees2');
app.get('/getdata',function(request,response){
	employeeModel.find().then(function(employeeModels){
		response.send(employeeModels);
		console.log(employeeModels);
	})
})

app.get('/',function(request,response){	
	response.set({'Access-control-Allow-Origin':'*'});
}).listen(3000);


app.get("/land",(request,response)=>{
	response.sendFile(__dirname + "/landingpage.html");

});

app.get("/employee",(request,response)=>{
	response.sendFile(__dirname + "/interviewlogin.html");

});

app.get("/manager",(request,response)=>{
	response.sendFile(__dirname + "/interviewlogin2.html");

});

app.get("/managerpage",(request,response)=>{
	response.sendFile(__dirname + "/managerpage.html");

});

app.get("/employeepage",(request,response)=>{
	response.sendFile(__dirname + "/employeepage.html");

});


// Add data (Employee Registration)
app.get("/register",(request,response)=>{
	response.sendFile(__dirname + "/datainput.html");

});

app.post("/datasave", function(request,response){
	// console.log("Hello");
	// console.log(request);
	// console.log(request.body);
	var a = request.body.empId;
	var b = request.body.name;
	var c = request.body.department;
	var m = request.body.city;
	var n = request.body.contact;

	let data = new employeeModel({'empId':a, 'name':b, 'department':c,'city':m,'contact': n});
   let resp = data.save();
console.log("Data Saved");
return response.send("Data Saved");
});




// Delete Data (Employee Record Deleted)
app.get("/delete",(request,response)=>{
	response.sendFile(__dirname + "/deleteEmployee.html");

});
app.post("/datadelete", function(request,response){
	var a = request.body.empId;
	let data = employeeModel.deleteOne({'empId': parseInt(a)}).exec();
	response.send("Data Deleted");

})


// Update Data
app.get("/update",(request,response)=>{
	response.sendFile(__dirname + "/updateEmployee.html");
});

app.post("/dataupdate", function(request,response){
	var a = request.body.empId;
	var b = request.body.name;
	var c = request.body.department;
	var d = request.body.city;
	var e = request.body.contact;
data = employeeModel.updateOne({'empId': parseInt(a)},{$set:{'name':b,'department':c,'city':d,'contact':e}}).exec();
return response.send("Data Updated");

});

// Find Data
app.get("/datafind",(request,response)=>
	{
		response.sendFile(__dirname+'/datafind.html');
	});

	app.post('/finddata',function(request,response)
{
	var a=request.body.city;
	employeeModel.find({'city':a,}).then(function(employeeModels)
	{
		response.send(employeeModels);
		console.log(employeeModels);
	});
});


// Find Employee Details 
app.get("/finduser", (request, response) => {
    response.sendFile(__dirname + '/showmydetails.html');
});

app.post('/findemployee', function (request, response) {
    var empId = request.body.empId;

    employeeModel.find({'empId': empId}).then(function(data){
		console.log(data);
		response.render('showmydetails',{results:data});
	});
});

// The sorting function is not working currently therefore displaying the find data in json format

// app.get("/datafind", (request, response) => {
//     response.sendFile(__dirname + '/datafind.html');
// });

// app.post('/finddata', function (request, response) {
//     var city = request.body.city;
//     var sortOrder = request.body.sortOrder || 'asc';

//     // Define the sort order based on the 'name' field
//     var sortCriteria = { 'name': sortOrder === 'asc' ? 1 : -1 };

//     // Find employees based on the city and sort by name
//     employeeModel.find({ 'city': city }).sort(sortCriteria).exec((err, employeeModels) => {
//         if (err) {
//             console.error('Error finding employees:', err);
//             response.status(500).send('Internal Server Error');
//             return;
//         }

//         // Render the results in the 'datafindresult.html' file
//         response.render('datafindresult', { results: employeeModels, sortOrder: sortOrder });
//     });
// });

// SHOW Data

app.get('/showdata',function(request,response){
	employeeModel.find({}).then(function(data){
		console.log(data);
		response.render('showdata',{results:data});
	});
});
main()

