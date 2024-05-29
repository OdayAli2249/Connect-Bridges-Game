const utils = require('./Logic/Utils.js');
const generate = require('./Logic/Generate.js');

var express = require('express');
var app = express();
var serv = require('http').Server(app);
var State = generate.File_Generator('./Resources/SM4.json');
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/View/Client.html');
});

app.post('/', function (req, res) {
    var body = [];
    req.on('data', (chunk) => {
        body.push(chunk);

    })

    req.on('end', () => {
        const parceBody = Buffer.concat(body).toString();
        console.log(parceBody);
        var _Data = parceBody.split('=')[1];
        console.log(_Data);
        var id = _Data.substring(0, 8);
        var direction = _Data.substring(9, _Data.length);
        var complete_ID = State.grid.Components.find(c => {  
            return c.ID.substring(0, 8) == id
        });
        State.Move(complete_ID.ID, direction);

        var arr = toArray(State);
        for (var i in arr) {
            console.log(arr[arr.length - 1 - i]);
        }
        if (Reach_Goal(State)) {
            console.log('Win !');
            console.log('restart .. ');
            State = generate.File_Generator('./Resources/SM4.json');
            var arr = toArray(State);
            for (var i in arr) {
                console.log(arr[arr.length - 1 - i]);
            }

        } else {
            console.log('continues .. ');
        }
        var r = 0;
        var shapes = ['@', '#', '$', '%', '&', 'Z', 'W'];
        console.log('Select piece ID then (in browser) type : ID then space then (Left - Right - Top - Down) _ EX : 896c3d32 Left ');
        console.log('Pieces : ');
        for (var i in State.grid.Components) {
            r++;
            if (r >= shapes.length) {
                r = 0;
            }
            console.log(State.grid.Components[i].ID.substring(0, 8) + ' ' + shapes[r]);
        }



    })
})

serv.listen(3000);

var arr = toArray(State);
for (var i in arr) {
    console.log(arr[arr.length - 1 - i]);
}
var r = 0;
var shapes = ['@', '#', '$', '%', '&', 'Z', 'W'];
console.log('Select piece ID then (in browser) type : ID then space then (Left - Right - Top - Down) _ EX : 896c3d32 Left ');
console.log('Pieces : ');
for (var i in State.grid.Components) {
    r++;
    if (r >= shapes.length) {
        r = 0;
    }
    console.log(State.grid.Components[i].ID.substring(0, 8) + ' ' + shapes[r]);
}



function toArray(state) {

    var arr = [];
    var i = 0
    while (i < state.grid.Dimension.Hieght) {
        var arrt = [];
        var j = 0;
        while (j < state.grid.Dimension.Width) {
            arrt.push('.');
            j++;
        }
        arr.push(arrt);
        i++;
    }
    var r = 0;
    var shapes = ['@', '#', '$', '%', '&', 'Z', 'W'];

    for (var i in state.grid.Components) {
        r++;
        if (r >= shapes.length) {
            r = 0;
        }
        if (state.grid.Components.Type != 'Grass') {
            for (var j in state.grid.Components[i].Body) {

                arr[state.grid.Components[i].Body[j].Y][state.grid.Components[i].Body[j].X] = shapes[r];

            }
        }
    }
    return arr;

}

function PrintGrid(state) {

    for (var i in state.length) {
        for (var j in state[i].length) {
            console.log(" " + state[i][j]);
        }
        console.log("\n");

    }

}

function MakeCopy(State) {
    const StateClass = require('./Logic/State.js')();
    var StateCT = JSON.parse(JSON.stringify(State));
    return new StateClass(StateCT.grid);
}

function get_Potential_State(State) {

    var Copies = [

        { St: MakeCopy(State), Dir: 'Top' }
        , { St: MakeCopy(State), Dir: 'Down' }
        , { St: MakeCopy(State), Dir: 'Left' }
        , { St: MakeCopy(State), Dir: 'Right' }

    ];

    var Res = [];
    for (cop in Copies) {
        console.log('\nCurrnet Dir : ' + Copies[cop].Dir);
        for (com in Copies[cop].St.grid.Components) {
            Copies[cop].St = MakeCopy(State);
            console.log('****************');
            console.log(Copies[cop].St.grid.Components[1]);
            console.log('****************');
            console.log('\nCurrnet Comp : ' + Copies[cop].St.grid.Components[com].ID);
            var CanGoAhead = true;
            while (CanGoAhead) {
                var canMove = Copies[cop].St.Move(Copies[cop].St.grid.Components[com].ID, Copies[cop].Dir);
                if (canMove) {
                    console.log('\nAdd new accepted state .');
                    Res.push(MakeCopy(Copies[cop].St));
                } else {

                    CanGoAhead = false;

                }


            }
            console.log('\n...');

        }
        console.log('\n...................');

    }

    console.log('Result Length : ' + Res.length);
    return Res;

}

function Reach_Goal(State) {

    var grid = toArray(State);
    var stack = [];

    for (var i in grid[0]) {
        if (grid[0][i] != '.') {
            stack.push({ X: 0, Y: i });
            grid[0][i] = 'v';
        }
    }
    while (stack.length != 0) {
        var cell = stack.pop();
        var X = parseInt(cell.X);
        var Y = parseInt(cell.Y);
        if (cell.Y == grid.length - 1) {
            return true;
        }
        if (X + 1 < grid[0].length) {
            if (grid[Y][X + 1] != 'v' && grid[Y][X + 1] != '.') {
                stack.push({ X: X + 1, Y: Y });
                grid[Y][X + 1] = 'v';
            }
        }
        if (X - 1 >= 0) {
            if (grid[Y][X - 1] != 'v' && grid[Y][X - 1] != '.') {
                stack.push({ X: X - 1, Y: Y });
                grid[Y][X - 1] = 'v';
            }
        }
        if (Y + 1 < grid.length) {
            if (grid[Y + 1][X] != 'v' && grid[Y + 1][X] != '.') {
                stack.push({ X: X, Y: Y + 1 });
                grid[Y + 1][X] = 'v';
            }
        }
        if (Y - 1 >= 0) {
            if (grid[Y - 1][X] != 'v' && grid[Y - 1][X] != '.') {
                stack.push({ X: X, Y: Y - 1 });
                grid[Y + 1][X] = 'v';
            }
        }


    }

    return false;

}



