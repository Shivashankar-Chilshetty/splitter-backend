const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortId = require('shortid');
const logger = require('./loggerLib')
const events = require('events');
const eventEmitter = new events.EventEmitter();
const tokenLib = require('./tokenLib')
const response = require('./responseLib')

let setServer = (server)=>{
    let allOnlineUsers = []
    let io = socketio.listen(server);
    let myIo = io.of('')
    myIo.on('connection', (socket)=>{
        console.log('on connection emitting verify user')
        socket.emit('verifyUser','')
        socket.on('set-user',(authToken)=>{
            console.log('set users called')
            tokenLib.verifyClaimsWithoutSecret(authToken,(err,user)=>{
                if(err){
                    socket.emit('auth-error', {status:500, error:'please provide correct authToken'})
                }
                else{
                    console.log('user is verified. setting his details in onlineuserList[]')
                    let currentUser = user.data;
                    socket.userId = currentUser.userId;
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`
                    console.log(`${fullName} is online`)
                    socket.emit(currentUser.userId,"you are online")
                    let userObj = { userId : currentUser.userId, fullName: fullName}
                    allOnlineUsers.push(userObj)
                    console.log(allOnlineUsers)
                    socket.room = 'split'
                    socket.join(socket.room)
                    socket.to(socket.room).broadcast.emit('online-user-list', allOnlineUsers)
                }
            })
        })// end of listening set-user event
        socket.on('disconnect', () => {
            // disconnect the user from socket
            // remove the user from online list
            // unsubscribe the user from his own channel

            console.log("user is disconnected");
            // console.log(socket.connectorName);
            console.log(socket.userId);
            var removeIndex = allOnlineUsers.map(function(user) { return user.userId; }).indexOf(socket.userId);
            allOnlineUsers.splice(removeIndex,1)
            console.log(allOnlineUsers)


        }) // end of on disconnect
    })
}
module.exports = {
    setServer: setServer
}