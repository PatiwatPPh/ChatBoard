const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const sqlite3 = require('sqlite3').verbose();
 
// open database in memory
let db = new sqlite3.Database('realtimeapp', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

let list = [];

io.on('connection', function( socket ) {


  setInterval(() => {
    
    db.all('SELECT id,title,completed,name FROM [ChatMessage]', [], (err, rows) => {
      if (err) {
        throw err;
      }
      list = rows;
    });
    socket.emit('list', {
      type: 'SET',
      data: list
    });
  }, 500);
  
 

  socket.on('list:add', item => {
    list.push(item);
    db.run('INSERT INTO [ChatMessage] (id,title,completed,name) VALUES (?,?,?,?)', item.id,item.title,item.completed,item.name);
    io.sockets.emit('list', {
      type: 'ADD',
      data: list
    });
  });

  socket.on('list:remove', id => {
    list = list.filter(item => item.id !== id);
    db.run('Delete from [ChatMessage] where id=?', id);
    io.sockets.emit('list', {
      type: 'REMOVE',
      ids : id
    });
  });

  socket.on('list:toggle', id => {
    list = list.map(item => {
      if( item.id === id ) {
        return {
          ...item,
          completed: !item.completed
        }
      }
      return item;
    });
    db.run('Update [ChatMessage] set completed=true where id=?', id);
    io.sockets.emit('list', {
      type: 'UPDATE',
      ids : id,
      data: list.find(current => current.id === id)
    });
  })
});

server.listen(8000);

module.exports = app;
