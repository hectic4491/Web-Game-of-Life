from random import randint
from cell import Cell
from time import sleep
from os import system

def generateDisplay(displaySize: tuple) -> list:
    """
    Generates a display of given display size.\n
    A display is a list of lists, where the lists contain cell objects.\n
    """
    # create display
    display = list()

    for j in range(0, displaySize[1]):
        display.append([Cell() for _ in range(0, (displaySize[0]))])

    # Connect neighbors by appending neighboring cells for each _cell.neighbors attribute.
    for j, row in enumerate(display):
        for i, _cell in enumerate(row):

            _cell.neighbors.append(display[j-1][i-1])
            _cell.neighbors.append(display[j-1][i])
            _cell.neighbors.append(display[j-1][(i+1) % len(row)])

            _cell.neighbors.append(display[j][i-1])
            _cell.neighbors.append(display[j][(i+1) % len(row)])

            _cell.neighbors.append(display[(j+1) % len(display)][i-1])
            _cell.neighbors.append(display[(j+1) % len(display)][i])
            _cell.neighbors.append(display[(j+1) % len(display)][(i+1) % len(row)])
            
    return display


def randomizeInitialAliveCells(display, rollUpperLimit=3):
    """
    Calls the cell.makeAlive() method to a random set of the cells on the given display.\n
    A higher rollUpperLimit results in a lower probability of calling cell.makeAlive().
    """
    for j in range(len(display)):
        for i in range(len(display[0])):
            randomRoll = randint(0, rollUpperLimit)
            if randomRoll == 1:
                display[j][i].makeAlive()


def writeMatrix(display):
    matrix = [[0 for _ in range(len(display[0]))] for _ in range(len(display))]

    for j in range(len(display)):
        for i in range(len(display[0])):
            cell_bool = int(display[j][i].alive)
            matrix[j][i] = cell_bool
    return matrix


def determineNextGen(display):
    """
    Calls the cell.determineNextState() method on every cell of the given display.
    """
    for j in range(len(display)):
        for i in range(len(display[0])):
            display[j][i].determineNextState()


def updateNextGen(display):
    """
    Calls the cell.updateState() method on every cell of the given display.
    """
    for j in range(len(display)):
        for i in range(len(display[0])):
            display[j][i].updateState()


def printMatrix(matrix):
    for j in range(len(matrix)):
        line = ""
        for i in range(len(matrix[0])):
            line += str(matrix[j][i]) + " "
        print(line)


def showArray(genArray):
    for matrix in genArray:
        printMatrix(matrix)
        sleep(0.25)
        system('clear')