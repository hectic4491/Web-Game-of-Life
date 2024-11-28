from random import randint
from lib.cell import Cell
from time import sleep
from os import system

def generateGrid(gridSize: tuple) -> list:
    """
    Generates a display of given display size.\n
    A display is a list of lists, where the lists contain cell objects.\n
    """
    # Create 2D array; grid
    grid = list()

    for j in range(0, gridSize[1]):
        grid.append([Cell() for _ in range(0, (gridSize[0]))])

    # Connect neighbors by appending neighboring cells for each _cell.neighbors attribute.
    for j, row in enumerate(grid):
        for i, _cell in enumerate(row):

            _cell.neighbors.append(grid[j-1][i-1])
            _cell.neighbors.append(grid[j-1][i])
            _cell.neighbors.append(grid[j-1][(i+1) % len(row)])

            _cell.neighbors.append(grid[j][i-1])
            _cell.neighbors.append(grid[j][(i+1) % len(row)])

            _cell.neighbors.append(grid[(j+1) % len(grid)][i-1])
            _cell.neighbors.append(grid[(j+1) % len(grid)][i])
            _cell.neighbors.append(grid[(j+1) % len(grid)][(i+1) % len(row)])
            
    return grid


def randomizeInitialAliveCells(grid, rollUpperLimit=3):
    """
    Calls the cell.makeAlive() method to a random set of the cells on the given grid.\n
    A higher rollUpperLimit results in a lower probability of calling cell.makeAlive().
    """
    for j in range(len(grid)):
        for i in range(len(grid[0])):
            randomRoll = randint(0, rollUpperLimit)
            # So the point here is that we always have a 1/(rollUpperLimit + 1) chance?
            if randomRoll == 1:
                grid[j][i].makeAlive()


def writeMatrix(grid):
    """
    Writes a matrix of cells objects into a matrix of integers.
    """
    matrix = [[0 for _ in range(len(grid[0]))] for _ in range(len(grid))]

    for j in range(len(grid)):
        for i in range(len(grid[0])):
            cell_bool = int(grid[j][i].alive)
            matrix[j][i] = cell_bool
    return matrix


def determineNextGen(grid):
    """
    Calls the cell.determineNextState() method on every cell of the given grid.
    """
    for j in range(len(grid)):
        for i in range(len(grid[0])):
            grid[j][i].determineNextState()


def updateNextGen(grid):
    """
    Calls the cell.updateState() method on every cell of the given grid.
    """
    for j in range(len(grid)):
        for i in range(len(grid[0])):
            grid[j][i].updateState()


def countPopulation(matrix):
    """
    Counts the population of alive cells in a given matrix frame.
    """
    pop = 0
    for row in matrix:
        for cellBoolean in row:
            if cellBoolean: 
                pop += 1
    return pop


def printMatrix(matrix):
    """
    Testing function to print a matrix.
    """
    for j in range(len(matrix)):
        line = ""
        for i in range(len(matrix[0])):
            line += str(matrix[j][i]) + " "
        print(line)


def showArray(genArray):
    """
    Testing function to iterate through an array of matricies and print each one.
    """
    for matrix in genArray:
        printMatrix(matrix)
        sleep(0.25)
        system('clear')
