var fs = require('fs');
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

        var fNameStat = new Object;
        
        fNameStat = fs.statSync(filepath);

        console.log('watching ' + filepath + ' bytes: ' + fNameStat.size);

        fs.watch(filepath, function (event, filename) {
          var fNameStatChanged = fs.statSync(filepath);
          console.log('file changed from ' + fNameStat.size + ' to ' + fNameStatChanged.size);
      
          fs.open(filepath, 'r', function(err, fd) {
            var newDataLength = fNameStatChanged.size - fNameStat.size;
            var buffer = new Buffer(newDataLength, 'utf-8');
            fs.read(fd, buffer, 0, newDataLength, fNameStat.size, function (err, bytesRead, newData) {
               if (err) {
                  console.log(err);
               };
               io.sockets.emit('new-data', { title: filepath, value: newData });
      
            });
            fNameStat = fs.statSync(fName);
          });
      
        }); 
  });
  
  console.log('Please enter file name');
