var fs = require('fs');
const Tail = require('tail').Tail;
var app = require('http').createServer(handler)
var io = require('socket.io')(app);

app.listen(9099);

console.log("Server listening on port 9099")


function handler(req, res) {
  fs.readFile('./index.html',
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }

      res.writeHead(200);
      res.end(data);
    });
}
var filename='';
var stdin = process.openStdin();

stdin.addListener("data", function(d) {
    
        filepath=d.toString().trim();
        var tail = new Tail(filepath);
        tail.watch()

        tail.on("line", data => {
          console.log(data);
          io.sockets.emit('new-data', { title: filepath, value: data });
        });
  });
  
  console.log('Please enter file name');