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
            the list of newly alive cell coordinates
    (dead) 'dead' : list
            the list of newly dead cell coordinates
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

        # Typecast to JSON legal data type: list.
        self.render_data = self.render_data.tolist()



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
            random_roll = randint(1, roll_upper_limit)
            if random_roll == 1:
                cell.make_alive()


    def _write_gen_data(self, step):
        """Writes the generation data to a data object.
        """

        gen_data = {"alive": None,
                    "dead": None,
                    "population": None,
                    "generation": None}
        
        all_alive = set()

        n = 0
        for j in range(self._height):
            for i in range(self._width):
                if self._grid[j, i].alive:
                    all_alive.add((j, i))
                    n += 1
                # n will also tell us the population count of that gen.

        gen_data["population"] = n
        gen_data["generation"] = step

        if step == 0:
            gen_data["alive"] = list(all_alive)
            gen_data["dead"] = []

        else:
            # Let A be generation N's set of alive cell's coordinates.
            # Let B be generation N-1's set of alive cell's coordinates.
            # Then:
            # A ∩ B is the set of cells that remain alive. (no update)
            #
            # A - B is the set of cells that became alive. (update)
            #
            # B - A is the set of cells that became dead. (update)

            # A - B
            gen_data["alive"] = all_alive - set(self.render_data[step-1]["alive"])
            # B - A
            gen_data["dead"] = set(self.render_data[step-1]["alive"]) - all_alive

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
    myData = Simulation(height = 36, width = 82, steps = 100)
    print(len(myData.render_data[99]["alive"]))
    print(len(myData.render_data[99]["dead"]))






### NOTES ###
# generate_grid() takes in a single argument for it's grid size. We
# should instead have it take two distinct aguments for it's rows and
# columns. This is tricky because we use the equivalent states of a
# matrix depending on the sitatuation.
#
# grid_size[0] == number of columns == length of a row = 82
#
# grid_size[1] == number of rows == length of a column = 36
#
# # data = GenArray([82, 36], 300).gen_array
#
#   # resolutions get listed as: w x h   e.g.: 1920x1080
#                                          == # of elements x # of rows
#
#   The matrix 'grid' would be a 3 x 4 matrix. i.e. m x n: m = 3, n = 4
#
#   m == number of rows = 3
#   n == number of columns i.e. elements per row = 4
#
#   grid =[
#       [1, 0, 1, 0],
#    m  [0, 1, 0, 0],
#       [0, 0, 0, 1],
#       ]     n
#
#   a(j,i)
#       1 <= i <= m
#       1 <= j <= n
#
#   gird[0] = [1, 0, 1, 0]
#   grid[0][0] = 1
#
#   These are Equivalent statements about the grid object.
#
#    grid.length
#    == j ??
#    == m = 3 ( in our matrix example )
#    == length of the grid
#**  == number of subarrays
#    == number of rows
#    == height of display
#    == length of a column
#    == grid_size[1]
#    == 36 ( in our JavaScript simulation)
#
#   And,
#
#    grid[i].length
#    == i ??
#    == n = 4 ( in our matrix example )
#    == length of a subarray
#**  == number of elements in subarray
#    == number of columns
#    == width of display
#    == length of a row
#    == grid_size[0]
#    == 82 ( in our JavaScript simulation)
#
#  And,
#
#   grid[i][j]
#   == index of a cell
#   == div element id? (not sure about this one)
#
#
#   If I start using a numpy 2D array, accessing looks like:
#   arr[0, 1]; where we access "the second element on the first row"
#   Think of 2-D arrays like a table with rows and columns. Where the
#   Dimension represents the row and the index represents the column.
#   arr[r, c]
#   arr[m, n]
#   arr[h, w]
#   arr[j, i]
#
# We would like to know how big to make the alive_set array, so that
# we could pre-allocate the necessary space in memory.
# It needs to be large enough to fit every alive cell's coordinates.
# The coordinates for each alive cell are stored in a set of the
# form {j, i}, where j is the row index and i is the column index.
#
# We can't know how many cells are going to exist in each generation
# however, we could supply a statistically implied lower limit.
# On a random pattern, a grid of size m x n will most likely have
# around (m x n) / 4 amount of alive cells on its initial generation.
# (because of our 25% dice roll to become alive).
#
# e.g.: An intial random pattern grid of size (36, 82) will
# have on average: (36 x 82) / 4 = 738 alive members on it's first
# initial generation. So the we should consider this the lower limit
# of the required array size.
#
# I'll choose twice the lower limit to be my pre-allocated array
# size for now.
#
#
#
#
# Let A be generation N's set of alive cell's coordinates.
# Let B be generation N-1's set of alive cell's coordinates.
#
# Then:
#   A ∩ B is the set of cells that stay alive. Therefore, no need to
#          update.
#   A - B is the set of cells that became alive. Therefore, we need to
#       update the background color as "alive".
#   B - A is the set of cells that became dead. Therefore, we need
#       to update the background color as "dead".
