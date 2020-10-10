const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortId = require('shortid');
const logger = require('./loggerLib')
const events = require('events');
const eventEmitter = new events.EventEmitter();
const tokenLib = require('./tokenLib')
const response = require('./responseLib')

const HistoryModel = mongoose.model('History');
const time = require('./timeLib')



let setServer = (server) => {
    //below 2 lines are-initialization of socket io library- after initializtion socket is now ready to use in server side
    let io = socketio.listen(server);
    let myIo = io.of('/');      //global instance of socket

    //below line makes initial (client-server) handshake
    myIo.on('connection', (socket) => {
        //console.log('on connecting --emitting verify user');
        socket.emit('verifyUser', '');
        socket.on('set-user', (authToken) => {
            tokenLib.verifyClaimsWithoutSecret(authToken, (err, user) => {
                if (err) {
                    console.log('fail to verify user')
                    socket.emit('auth-error', { status: 500, error: 'please provide correct authToken' })
                }
                else {
                    //console.log('user is verified')
                    //every socket connection that is made to the server has the internal id of its own, but we set & use our own id
                    let currentUser = user.data;
                    socket.userId = currentUser.userId;
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`
                    console.log(`${fullName} is online`);
                    //socket.emit(currentUser.userId,'you are online')
                }
            })
        })//end listener of set-user


        socket.on('disconnect', () => {
            console.log("user is disconnected")
            console.log(socket.userId)
            console.log('went offline')
        })//end of disconnect


        socket.on('create-history', (data) => {
            //console.log('history is creating')
            data['historyId'] = shortId.generate()
            //console.log(data)
            eventEmitter.emit('save-history', data)
        })


        socket.on('notify-updates', (data) => {
            //console.log(data)
            myIo.emit(data.userId, data);
        });
    })
}


eventEmitter.on('save-history', (data) => {
    let newHistory = new HistoryModel({
        historyId: data.historyId,
        userId: data.userId,
        groupId: data.groupId,
        expenseId: data.expenseId,
        message: data.message,
        createdOn: time.now()
    });
    newHistory.save((err, result) => {
        if (err) {
            console.log(`error occured: ${err}`)
        }
        else if (result == undefined || result == null || result == '') {
            console.log('history is not saved');
        }
        else {
            console.log('history saved')
            //console.log(result)
        }
    })
})


module.exports = {
    setServer: setServer
}