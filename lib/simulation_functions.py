from random import randint
import numpy as np
from lib.cell import Cell
from time import sleep
from os import system

def generate_grid(grid_size: tuple) -> list:
    """ Generates a 2D array called 'grid' of size m x n, where m is the
    number of columns and n is the number of rows; or equivalently: m
    is the length of each row, and n is the length of each column.
    """
    # Create the grid's outer array.
    grid = []

    for j in range(0, grid_size[1]):
        grid.append([Cell() for _ in range(0, (grid_size[0]))])

    # Connect neighbors by appending neighboring cells for each _cell.neighbors attribute.
    for j, row in enumerate(grid):
        for i, _cell in enumerate(row):

            _cell.neighbors[0] = (grid[j-1][i-1])
            _cell.neighbors[1] = (grid[j-1][i])
            _cell.neighbors[2] = (grid[j-1][(i+1) % len(row)])

            _cell.neighbors[3] = (grid[j][i-1])
            _cell.neighbors[4] = (grid[j][(i+1) % len(row)])

            _cell.neighbors[5] = (grid[(j+1) % len(grid)][i-1])
            _cell.neighbors[6] = (grid[(j+1) % len(grid)][i])
            _cell.neighbors[7] = (grid[(j+1) % len(grid)][(i+1) % len(row)])
            
    return grid


def randomize_initial_alive_cells(grid, roll_upper_limit=3):
    """
    Calls the cell.makeAlive() method to a random set of the cells on the given grid.\n
    A higher rollUpperLimit results in a lower probability of calling cell.makeAlive().
    """
    for j in range(len(grid)):
        for i in range(len(grid[0])):
            random_roll = randint(0, roll_upper_limit)
            # So the point here is that we always have a 1/(rollUpperLimit + 1) chance?
            if random_roll == 1:
                grid[j][i].make_alive()


def write_matrix(grid):
    """
    Writes a matrix of cells objects into a matrix of integers.
    """
    matrix = [[0 for _ in range(len(grid[0]))] for _ in range(len(grid))]

    for j in range(len(grid)):
        for i in range(len(grid[0])):
            cell_bool = int(grid[j][i].alive)
            matrix[j][i] = cell_bool
    return matrix


def determine_next_gen(grid):
    """
    Calls the cell.determineNextState() method on every cell of the given grid.
    """
    for j in range(len(grid)):
        for i in range(len(grid[0])):
            grid[j][i].determine_next_state()


def update_next_gen(grid):
    """
    Calls the cell.updateState() method on every cell of the given grid.
    """
    for j in range(len(grid)):
        for i in range(len(grid[0])):
            grid[j][i].update_state()


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
