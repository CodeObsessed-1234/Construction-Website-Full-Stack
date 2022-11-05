const express = require("express");
const mysql = require('mysql');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;


//creates coonection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'nitin',
  database: 'login'
})
//creates table
connection.query("create table log(name varchar(20),usr varchar(50) primary key,pass varchar(50) not null)", (err, row, col) => {
  // if(err!=null) console.log(err);
})


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, "../views"));


// base root
app.get('/', (req, res) => {
  res.redirect('/main');
})




//get the main file html----------------------------
app.get('/main', (req, res) => {
  res.render('main', { login: `Login` })
});
//*----------------------------------------------





//after login and signup to the user page
var name;
app.get(`/main/usr`, (req, res) => {
  console.log(name);
  res.render('main', {
    channelName: `${name}`,
    login: ``

  })
})



//new usr Register------------------------------------

app.get('/accountPage', (req, res) => {
  res.sendFile(path.join(__dirname, "../public/accountPage.html"));
})

//alternative of url accountPage
app.get('/accountPage.html', (req, res) => {
  res.redirect("/accountPage");
})

//insert into the database 
app.post("/accountPage", (req, res) => {
  console.log(req.body);
  console.log(req.body.password + " " + req.body.confirmPassword+req.body.name);
  if (req.body.password === req.body.confirmPassword) {
    console.log('in');
    connection.query(`insert into log values('${req.body.name}','${req.body.email}','${req.body.password}')`, (err) => {
      if (err == null) {
        name = req.body.name;
        res.redirect('/main/usr')
      }

    });
    return;
  }
  console.log("mismatch password");
  res.redirect('/accountPage')
})
//*-------------------------------------------------------








//check for login----------------------------------
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'))
});

//alternative of url
app.get('/login.html', (req, res) => { res.redirect('/login') })


app.post('/login', (req, res) => {

  let user = req.body.user;
  let password = req.body.pass;



  connection.query(`select * from log where usr='${user}' and pass='${password}'`, (err, row) => {

    let str = JSON.stringify(row);
    let json = JSON.parse(str);

    if (Object.keys(json).length > 0) {
      if (json[0].usr == user && json[0].pass == password) {
        console.log("logged In");
        name = `${json[0].name}`;
        res.redirect(`/main/usr`);


      }
    }
    else {
      name = '';
      console.log("fialed");
      res.redirect('/login');
    }
  })
});






app.use('', (req, res) => {
  res.send("<h1>404 page not found</h1>")
})


app.listen(3000, () => {
  console.log("listning");
});
