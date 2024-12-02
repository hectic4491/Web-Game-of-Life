"""The Simulation module."""
from random import randint
import numpy as np

try:
    from lib.cell import Cell
except ModuleNotFoundError as e:
    print(f"Import Error: {e}")
    from cell import Cell


class Simulation ():
    """A class used to represent the Game of Life Simulation. The class
    is inteded to be a data wrapper to automate generation and data prep
    for the front end simulation request. After creating an object, grab
    the data from the .render_data attribute.

    Creating a simulation object will generate a grid of size height x 
    width. Then a pattern will be applied (the default being the random
    pattern) on the initial generation of cells. The simulation then 
    runs and writes the necessary data to the attribute .render_data
    

    Parameters
    ----------
    height : int
        The height of the simulation grid
    width : int
        The width of the simulation grid
    steps : int
        The amount of steps to run the simulation
    pattern : list
        The pattern used to initialize the simulation.
        Defaults to None. i.e. The internal class initializes the
        default random pattern.

    Public Attributes
    ----------
    render_data : list
        The data to be sent to the front end. The contents of each
        element in the list is a dictionary. The dictionary has the
        following keys:

    (key) 'alive' : list
            the list of all alive cell coordinates
    (key) 'population' : int
            the amount of cells currently alive
    (key) 'generation' : int
            the current generation index
    """

    def __init__(self, height: int,
                 width: int,
                 steps: int,
                 pattern: set=None):
        # Store these attributes for use in later functions.
        self._height = height
        self._width = width

        # Create the grid and initialize the render_data.
        self._grid = self._generate_grid()
        self.render_data = np.empty(steps, dtype=dict)

        # If we are given a pattern, apply the pattern to the grid.
        if pattern:
            self._set_pattern(pattern)
        # Else, no pattern, apply the default random patter to the grid
        else:
            self._randomize_initial_pattern()

        # Build the render_data
        for step in range(steps):
            self.render_data[step] = self._write_gen_data(step)
            self._determine_next_gen()
            self._update_next_gen()

        # Typecast to JSON legal data types.
        for gen_data in self.render_data:
            gen_data['alive'] = [list(indices) for indices in gen_data['alive']]
        self.render_data = list(self.render_data)


    ## Internal functions to aid object construction.
    ## Not meant to be called outside of the object.
    def _generate_grid(self):
        """Internal method. Generates a 2D array called 'grid' of size
        m x n, where m is the height of the grid, and n is the width of
        the grid.
        """

        # Create empty grid.
        _grid = np.empty([self._height, self._width], dtype=object)

        for j in range(self._height):
            for i in range(self._width):
                _grid[j, i] = Cell()

        # Access every cell by index
        for j in range(self._height):
            for i in range(self._width):
                cell = _grid[j, i]
                # Fill in the 'neighbors' attribute array for each cell.
                cell.neighbors[0] = (_grid[j-1, i-1])
                cell.neighbors[1] = (_grid[j-1, i])
                cell.neighbors[2] = (_grid[j-1, (i+1) % self._width])

                cell.neighbors[3] = (_grid[j, i-1])
                cell.neighbors[4] = (_grid[j, (i+1) % self._width])

                cell.neighbors[5] = (_grid[(j+1) % self._height, i-1])
                cell.neighbors[6] = (_grid[(j+1) % self._height, i])
                cell.neighbors[7] = (_grid[(j+1) % self._height,
                                          (i+1) % self._width])

        return _grid


    def _set_pattern(self, pattern: set):
        """Calls the cell.make_alive() method to a specific group of cells
        on the given grid. The indicies of the specific group of cells is 
        provided by the 'pattern' list.
        """
        # pattern should take the form of : [[j1, i1], [j2, i2], ...  ,[jn, in]]
        for j, i in pattern:
            self._grid[j, i].make_alive()


    def _randomize_initial_pattern(self, roll_upper_limit: int=4):
        """For each cell in the grid, make a dice role to see if it comes 
        alive through the cell.make_alive() method. roll_upper_limit in the
        demoninator in our probability of success fraction.
        i.e.: roll_upper_limit = 4 implies a 1/4 chance for each cell to
        come alive.
        """

        for cell in self._grid.flat:
            if randint(1, roll_upper_limit) == 1:
                cell.make_alive()


    def _write_gen_data(self, step):
        """Writes the generation data to a data object.
        """

        gen_data = {"alive": [],
                    "population": 0,
                    "generation": step}

        for j in range(self._height):
            for i in range(self._width):
                if self._grid[j, i].alive:
                    gen_data['alive'].append([j, i])
                    gen_data['population'] += 1
        return gen_data


    def _determine_next_gen(self):
        """Calls the cell.determine_next_state() method on every cell of
        the given grid.
        """

        for cell in self._grid.flat:
            cell.determine_next_state()


    def _update_next_gen(self):
        """Calls the cell.update_state() method on every cell of the
        given grid.
        """

        for cell in self._grid.flat:
            cell.update_state()




## Testing Code ##
if __name__ == '__main__':
    myData = Simulation(height = 8, width = 16, steps = 4)
    print(myData.render_data)
