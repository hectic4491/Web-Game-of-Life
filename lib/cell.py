"""The Cell module."""
import numpy as np


class Cell():
    """A class used to represent the cells in Conway's Game of Life.
    Cells are stored in a grid and intended to be iterated through 
    generations. Each generation determines the grid of cell's next
    state.

    ...

    Attributes
    ----------
    alive : boolean
        a boolean to determine the current state of a cell.
        alive = true, dead = false.
    next_state : boolean
        a boolean to determine the next state of a cell.
    neighbors_list : numpy array
        an array of the 8 neighboring cells around an individal cell.
    """

    def __init__(self):
        self.alive = False
        self.next_state = False
        self.neighbors = np.empty(8, dtype=object)


    def make_alive(self):
        """
        Sets the cell's 'alive' boolean attribute to True.
        """
        self.alive = True


    def make_dead(self):
        """
        Sets the cell's 'alive' boolean attribute to False.
        """
        self.alive = False


    def determine_next_state(self):
        """
        Determines the cells 'next_state' boolean attribute by reading
        the 'alive' attribute of neighboring cells and running Conway's
        Game of Life algorithm:
        
        Any alive cell with fewer than two alive neighbors dies
           (underpopulation).
        Any alive cell with two or three alive neighbors lives on to
           the next gen (equilibrium).
        Any alive cell with more than three alive neighbors dies
           (overpopulation).
        Any dead cell with exactly three alive neighbors becomes an
           alive cell (reproduction).
        """
        alive_neighbors = 0

        for neighbor in self.neighbors:
            if neighbor.alive:
                alive_neighbors += 1

        if self.alive:
            if alive_neighbors < 2:
                self.next_state = False

            elif alive_neighbors == 2 or  alive_neighbors == 3:
                self.next_state = True

            else:
                self.next_state = False

        else:
            if alive_neighbors == 3:
                self.next_state = True


    def update_state(self):
        """Uses the cell attribute 'next_state' to update the cell's
        attribute 'alive' by calling either the .make_alive() or
        .make_dead() method. 
        """
        if self.next_state:
            self.make_alive()
        else:
            self.make_dead()
