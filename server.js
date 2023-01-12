const express =require('express');
const mysql = require('mysql')
var bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
app.use(corse());

var bodyParser = require('body-parser');

app.use(bodyParser.json({limit: '50mb'})); 
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// aws RDS 와 연결
var connection = mysql.createConnection({
    host: "testdb.cvnx8yjnprze.ap-northeast-2.rds.amazonaws.com",
    user: "plashdof",
    database: "testdb",
    password:"jt8026jt97!",
    port: 3306
})

// 서버 테스트용 get API
app.get('/', (req,res)=>{
    const result = {
        userId : 1234,
        userPwd : "1234"
    }
    res.send(result);
})

// eco post API
app.post('/eco', function (req, res) {
    var image = req.body.image;
    var name = req.body.name;

    let id = req.headers.id;
        console.log(req.headers);

    // 삽입을 수행하는 sql문.
    var sql = 'INSERT INTO ecopoint (image, name, id) VALUES (?, ?, ?)';
    var params = [image, name,id];

        // sql 문의 ?는 두번째 매개변수로 넘겨진 params의 값으로 치환된다.
    connection.query(sql, params, function (err, result) {
        var resultCode = 404;
        var message = '에러가 발생했습니다';

        if (err) {
            console.log(err);
        } else {
            resultCode = 200;
            message = '에코 포인트 적립에 성공했습니다.';
        }

        res.json({
            'code': resultCode,
            'message': message
        });
     });
});

// user profile 정보 불러오기
app.get('/admin/eco', (req, res) => {
    
    let sql = "SELECT photo, name, id FROM ecopoint";
  
    connection.query(sql, function (err, rows, result) {
      
      res.send(rows);
    });
});



// 로그인 post API
app.post('/login', (req,res)=>{ 

    // 프론트에서 body 받아서 userPwd 와 userId 변수에 넣기
    var userPwd = req.body.userPwd;
    var userId = req.body.userId;

    // 존재하는 ID 인지 데이터베이스에서 확인하는 Query문
    var sql = 'select * from Users where UserId = ?';

    // Query문 데이터베이스에서 돌리기
    connection.query(sql, userId, (err,result)=>{
        var resultCode = 404;
        var message = 'error';
        
        // Query문 에러체크
        if(err){
            
        }else{    

            if(result.length === 0){

                // ID가 DB에 없을경우
                resultCode = 204;
                message = '존재하지 않는 계정';
            }else if(userPwd !== result[0].UserPwd){

                // ID는 있지만, 비밀번호가 다를경우
                resultCode = 204;
                message = '비밀번호가 틀렸습니다';
            }else{
                // ID 와 비밀번호 모두 일치할 경우
                resultCode = 200;
                message = '로그인 성공!!' + result[0].UserName + '님 환영합니다!';
            }
        }

        // 프론트로 보내는 응답코드, 메세지
        res.json({
            'code': resultCode,
            'message':message 
        })

    })
})


app.listen(8080,function(){
    console.log('listening on 8080');
})