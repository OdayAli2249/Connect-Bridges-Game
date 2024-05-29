const crypto = require('crypto');

module.exports = {
    Create_New_Cell: function () {

        var Cell = {
            X: 0,
            Y: 0,
            set: function (XPos, YPos) {
                this.X = XPos;
                this.Y = YPos;
                return this;
            },
            get: function () {
                return {
                    X: this.X,
                    Y: this.Y
                }
            }
        }

        return Cell;

    },


    Create_New_Component: function () {

        var Component = {

            ID: crypto.randomBytes(16).toString("hex"),
            Body: [],
            Type: '',
            Push: function(cell){
            this.Body.push(cell);
            return this;
            }

        }

        return Component;

    },

    Create_New_Bridge: function () {

        var Component = this.Create_New_Component();
        Component.Type = 'Bridge';
        return Component;

    },

    Create_New_Grass: function () {

        var Component = this.Create_New_Component();
        Component.Type = 'Grass';
        return Component;

    },

    Create_New_Rock: function () {

        var Component = this.Create_New_Component();
        Component.Type = 'Rock';
        return Component;

    },

    Create_New_Grid: function () {

        var Grid = {

            Dimension: {

                Width: 0,
                Hieght: 0

            },
            Components: [],
            Total_Cells_Number: function (components) {
                var Total = 0;
                for (var i in components) {
                    Total += components[i].Body.length;
                }
                return Total;
            },
            Check_Out_of_Dimension: function (components, grid) {

                var in_Boundaries = (cell) => {
                    return (0 <= cell.X && cell.X < grid.Dimension.Width) && (0 <= cell.Y && cell.Y < grid.Dimension.Hieght);
                }

                for (var i in components.Body) {

                    if (!in_Boundaries(components.Body[i])) {
                        console.log('Out of boundaries');
                        return false;
                    }

                }

                return true;

            },
            add_Component: function (component) {
                this.Components.push(component);
            },
            set_Components: function(components){
                this.Components = [...components];
            },
            Delete_Component: function (component) {
                // later ... 
            }


        }


        return Grid;


    }
}