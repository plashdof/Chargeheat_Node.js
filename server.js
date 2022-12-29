const express =require('express');
const app = express();

app.get('/', (req,res)=>{
    const result = {
        message: 'helloworld'
    }
    res.send(result);
})

app.get('/api/courses', (req,res)=>{
    res.send([1,2,3]);
})


app.listen(8080,function(){
    console.log('listening on 8080');
})