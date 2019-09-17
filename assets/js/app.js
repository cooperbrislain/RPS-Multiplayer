let Game = {
    Players: [
        /* 
        {
            uuid: xxxxxxx,
            ready: true/false,
            move: null
        }
        */
    ]
}

/**
 * Fast UUID generator, RFC4122 version 4 compliant.
 * @author Jeff Ward (jcward.com).
 * @license MIT license
 * @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
 **/
var UUID = (function() {
    var self = {};
    var lut = []; for (var i=0; i<256; i++) { lut[i] = (i<16?'0':'')+(i).toString(16); }
    self.generate = function() {
        var d0 = Math.random()*0xffffffff|0;
        var d1 = Math.random()*0xffffffff|0;
        var d2 = Math.random()*0xffffffff|0;
        var d3 = Math.random()*0xffffffff|0;
        return lut[d0&0xff]+lut[d0>>8&0xff]+lut[d0>>16&0xff]+lut[d0>>24&0xff]+'-'+
            lut[d1&0xff]+lut[d1>>8&0xff]+'-'+lut[d1>>16&0x0f|0x40]+lut[d1>>24&0xff]+'-'+
            lut[d2&0x3f|0x80]+lut[d2>>8&0xff]+'-'+lut[d2>>16&0xff]+lut[d2>>24&0xff]+
            lut[d3&0xff]+lut[d3>>8&0xff]+lut[d3>>16&0xff]+lut[d3>>24&0xff];
    }
    return self;
})();

let playerID = localStorage.getItem('playerID');
if (playerID) {
    console.log(`using player ID: ${playerID}`);
} else {
    playerID = UUID.generate();
    console.log(`assigning player ID: ${playerID}`);
    localStorage.setItem('playerID', playerID);
}
let nextMove = null;
/* FIREBASE */
const firebaseConfig = {
    apiKey: "AIzaSyACSShSnvrgEte-P-TJKPiumWr5OuFu80c",
    authDomain: "rps-multiplayer-eb98c.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-eb98c.firebaseio.com",
    projectId: "rps-multiplayer-eb98c",
    storageBucket: "",
    messagingSenderId: "96095048698",
    appId: "1:96095048698:web:3e050f256b6e7265378a43"
};

firebase.initializeApp(firebaseConfig);

let database = firebase.database();

/* END FIREBASE */
const do_move = (which) => {
    nextMove = which;
    let which_player = Game.Players.findIndex(playerOb => { return playerOb.uuid === playerID; });
    Game.Players[which_player].ready = true;
    $(`.btn-${which}`).addClass('picked');
    $('.btn:not(.picked)').addClass('notpicked');
    if (Game.Players[0].ready && Game.Players[1].ready) {
        Game.Players[which_player].move = nextMove;
        database.ref().set(Game);
    }
    database.ref().set(Game);
}

$(document).ready(() => {
    $('.btn-rock').on('click', (e) => {
        do_move('rock');
    });

    $('.btn-paper').on('click', (e) => {
        do_move('paper');
    });

    $('.btn-scissors').on('click', (e) => {
        do_move('scissors');
    });
});

database.ref().on("value", (snapshot) => {
    Game = snapshot.val();
    if (Game === null) {
        Game = {
            Players: []
        }
        database.ref().set(Game);
    }
    if (Game.Players.length < 2) {
        if (Game.Players[0].uuid != playerID) {
            Game.Players.push({
                uuid: playerID,
                ready: false,
                move: null
            });
            database.ref().set(Game);
        }
    }
    if (Game.Players.length < 2) {
        $('#modal-waiting').modal('show');
    }
    if (Game.Winner !== undefined) {
        if (Game.Winner == -1) {
            $('#modal-result .modal-body').text('A Tie!');
        } else if (Game.Players[Game.Winner].uuid == playerID) {
            $('#modal-result .modal-body').text('You Win!');
        } else {
            $('#modal-result .modal-body').text('You Lose!');
        }
        $('#modal-result').modal('show');
        Game.Winner = null;
        Game.Players[0].move = null;
        Game.Players[1].move = null;
        Game.Players[0].ready = null;
        Game.Players[1].ready = null;
        database.ref().set(Game);
    } else if (Game.Players[0].move && Game.Players[1].move) {
        if (Game.Players[0].move == Game.Players[1].move) {
            Game.Winner = -1;
        } else {
            if (Game.Players[0].move == 'rock') {
                if (Game.Players[1].move == 'paper') {
                    Game.Winner = 1;
                }
                if (Game.Players[1].move == 'scissors') {
                   Game.Winner = 0;
                }
            }
            if (Game.Players[0].move == 'paper') {
                if (Game.Players[1].move == 'rock') {
                    Game.Winner = 0;
                }
                if (Game.Players[1].move == 'scissors') {
                    Game.Winner = 1;
                }
            }
            if (Game.Players[0].move == 'scissors') {
                if (Game.Players[1].move == 'paper') {
                    Game.Winner = 0;
                }
                if (Game.Players[1].move == 'rock') {
                    Game.Winner = 1;
                }
            }
        }
        database.ref().set(Game);
    } else if (Game.Players[0].ready && Game.Players[1].ready) {
        let which_player = Game.Players.findIndex(playerOb => { return playerOb.uuid === playerID; });
        Game.Players[which_player].move = nextMove;
        database.ref().set(Game);
    }
});