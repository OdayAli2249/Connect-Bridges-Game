const utils = require('./Utils.js');
const gridt = utils.Create_New_Grid();

var PlayMode;
var Create_New_State = function () {

    var State = class {

        constructor(grid) {
            this.grid = grid;
        }

        Move(_ID, Direction) {

            let Register = (Cell, direction) => {
                if (direction == 'Left') {
                    Cell.X--;
                } else if (direction == 'Right') {
                    Cell.X++;
                } else if (direction == 'Top') {
                    Cell.Y++;
                } else {
                    Cell.Y--;
                }
            }

            let Unregister = (Cell, direction) => {
                if (direction == 'Left') {
                    Cell.X++;
                } else if (direction == 'Right') {
                    Cell.X--;
                } else if (direction == 'Top') {
                    Cell.Y--;
                } else {
                    Cell.Y++;
                }
            }

            // find component
            var component = this.grid.Components.find(c => {

                return c.ID == _ID;
            });
            //console.log(component);
            //register move
            for (var i in component.Body) {
                Register(component.Body[i], Direction);
            }
            //console.log(component);
            //update filled cells
            var Filled_Cells_Temp = [];
            for (var i in this.grid.Components) {
                for (var j in this.grid.Components[i].Body) {
                    Filled_Cells_Temp.push(this.grid.Components[i].Body[j].X + ',' + this.grid.Components[i].Body[j].Y);
                }
            }
            console.log(Filled_Cells_Temp);
            //check
            if ((new Set(Filled_Cells_Temp).size < Filled_Cells_Temp.length) || !gridt.Check_Out_of_Dimension(component, this.grid)) {
                //unregister move
                for (var i in component.Body) {
                    Unregister(component.Body[i], Direction);
                }
                console.log('\nMove : ' + Direction + ' ' + _ID + ' REJECTED');
                return false;
            }
            console.log('\nMove : ' + Direction + ' ' + _ID + ' ACCEPTED');
            return true;
        }


        

        get_Potential_State(State) {

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

        Reach_Goal() {
            var grid = toArray(State);
            var stack = [];
            console.log(grid);

            for (var i in grid[0]) {
                if (grid[0][i] == '#') {
                    stack.push({ X: 0, Y: i });
                    grid[0][i] = 'v';
                }
            }

            while (stack.length != 0) {
                var cell = stack.pop();
                console.log(grid);
                if (cell.Y == grid.length - 1) {
                    return true;
                }
                if (cell.X + 1 < grid[0].length) {
                    if (grid[cell.X + 1][cell.Y] != 'v') {
                        stack.push({ X: cell.X + 1, Y: cell.Y });
                        grid[cell.X + 1][cell.Y] = 'v';
                    }
                }
                if (cell.X - 1 >= 0) {
                    if (grid[cell.X - 1][cell.Y] != 'v') {
                        stack.push({ X: cell.X - 1, Y: cell.Y });
                        grid[cell.X - 1][cell.Y] = 'v';
                    }
                }
                if (cell.Y + 1 < grid.length) {
                    if (grid[cell.X][cell.Y + 1] != 'v') {
                        stack.push({ X: cell.X, Y: cell.Y + 1 });
                        grid[cell.X][cell.Y + 1] = 'v';
                    }
                }
                if (cell.Y - 1 >= 0) {
                    if (grid[cell.X][cell.Y - 1] != 'v') {
                        stack.push({ X: cell.X, Y: cell.Y - 1 });
                        grid[cell.X][cell.Y + 1] = 'v';
                    }
                }


            }

            return false;

        }

    }

    return State;
}

module.exports = Create_New_State;



