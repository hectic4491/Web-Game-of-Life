from random import randint
import numpy as np
from lib.cell import Cell
from time import sleep
from os import system

### TODO ###
# generate_grid() takes in a single argument for it's grid size. We should
# instead have it take two distinct aguments for it's rows and columns.
# this is tricky because we use the equivalent states of a matrix depending
# on the sitatuation.
#
# grid_size[0] == number of columns == length of a row = 82
#
# grid_size[1] == number of rows == length of a column = 36
#
# # data = GenArray([82, 36], 300).gen_array
#
#
#
#   # resolutions get listed as: w x h   e.g.: 1920x1080 == # of elements x # of rows
#
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
#
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
def generate_grid(height: int, width: int) -> object:
    """ Generates a 2D array called 'grid' of size m x n, where m is the
    height of the grid, and n is the width of the grid.
    """

    # Create empty grid.
    grid = np.empty([height, width], dtype=object)

    for j in range(height):
        for i in range(width):
            grid[j, i] = Cell()

    # Access every cell by index
    for j in range(height):
        for i in range(width):
            cell = grid[j, i]
            # Fill in the cell's neighbors attribute
            # array for each cell.
            cell.neighbors[0] = (grid[j-1, i-1])
            cell.neighbors[1] = (grid[j-1, i])
            cell.neighbors[2] = (grid[j-1, (i+1) % width])

            cell.neighbors[3] = (grid[j, i-1])
            cell.neighbors[4] = (grid[j, (i+1) % width])

            cell.neighbors[5] = (grid[(j+1) % height, i-1])
            cell.neighbors[6] = (grid[(j+1) % height, i])
            cell.neighbors[7] = (grid[(j+1) % height, (i+1) % width])

    return grid


def randomize_initial_pattern(grid: object, roll_upper_limit: int=4):
    """For each cell in the grid, make a dice role to see if it comes 
    alive through the cell.make_alive() method. roll_upper_limit in the
    demoninator in our probability of success fraction.
    i.e.: roll_upper_limit = 4 implies a 1/4 chance for each cell to
    come alive.
    """

    for cell in grid.flat:
        random_roll = randint(1, roll_upper_limit)
        if random_roll == 1:
            cell.make_alive()


def set_pattern(grid: object, pattern: list):
    """Calls the cell.make_alive() method to a specific group of cells
    on the given grid. The indicies of the specific group of cells is 
    provided by the 'pattern' list.
    """

    for j, i in pattern:
        grid(j, i).make_alive()


def determine_next_gen(grid):
    """Calls the cell.determine_next_state() method on every cell of
    the given grid.
    """

    for cell in grid.flat:
        cell.determine_next_state()


def update_next_gen(grid):
    """Calls the cell.update_state() method on every cell of the
    given grid.
    """

    for cell in grid.flat:
        cell.update_state()


def write_alive_array(grid): ## TODO ##
    """
    Writes a matrix of cells objects into a matrix of integers.
    """

    matrix = np.empty(grid.shape, dtype=bool)

    for j in range(len(grid)):
        for i in range(len(grid[0])):
            cell_bool = int(grid[j][i].alive)
            matrix[j][i] = cell_bool
    return matrix


def count_population(matrix):
    """
    Counts the population of alive cells in a given matrix frame.
    """

    pop = 0
    for row in matrix:
        for cell in row:
            if cell: 
                pop += 1
    return pop


def print_matrix(matrix):
    """
    Testing function to print a matrix.
    """
    for j in range(len(matrix)):
        line = ""
        for i in range(len(matrix[0])):
            line += str(matrix[j][i]) + " "
        print(line)


def show_array(gen_array):
    """
    Testing function to iterate through an array of matricies and print each one.
    """
    for matrix in gen_array:
        print_matrix(matrix)
        sleep(0.25)
        system('clear')
