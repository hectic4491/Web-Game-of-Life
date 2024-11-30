class Cell():

    def __init__(self):
        self.alive = False   # alive = True, dead = False
        self.neighbors = []  # list of neighbor cells
        self.nextState = None


    def makeAlive(self):
        """
        Sets the cell object's 'alive' attribute to True.
        """
        self.alive = True


    def makeDead(self):
        """
        Sets the cell object's 'alive' attribute to False.
        """
        self.alive = False


    def determineNextState(self):
        """
        Determines the cell object's 'nextState' attribute by\n
        reading the 'alive' attribute of neighboring cells.
        """
        #   > Any Live cell with fewer than two live neighbors dies (underpopulation)
        #   > Any Live cell with two or three live neighbors lives on to the next generator (equilibrium)
        #   > Any Live cell with more than three live neighbors dies (overpopulation)
        #   > Any Dead cell with exactly three live neighbors becomes a live cell (reproduction)
        liveNeighbors = int()
        isAlive = self.alive

        for neighbors in self.neighbors:
            if neighbors.alive:
                liveNeighbors += 1
        
        if isAlive:
            if liveNeighbors < 2:
                self.nextState = False

            elif liveNeighbors == 2 or liveNeighbors == 3:
                self.nextState = True

            else:
                self.nextState = False

        else:
            if liveNeighbors == 3:
                self.nextState = True


    def updateState(self):
        """
        Uses the cell object's stored attribute 'nextState' to\n
        update the cell's stored attribute 'alive' by\n
        calling either the makeAlive or makeDead method. 
        """
        if self.nextState:
            self.makeAlive()
        else:
            self.makeDead()