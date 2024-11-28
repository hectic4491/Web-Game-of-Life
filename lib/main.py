import lib.simulation_functions as sf

class GenArray():
    def __init__(self, grid_size, steps):
            self.grid_size = grid_size    #(w, h)
            self.steps = steps

            # generate the display matrix
            self.grid = sf.generateGrid(self.grid_size)

            # initialize the alive/dead state of each cell
            sf.randomizeInitialAliveCells(self.grid)

            # append each genMatrix to genArray
            self.genArray = list()
            for i in range(steps):
                subArray = list()

                # write matrix
                genMatrix = sf.writeMatrix(self.grid)
                subArray.append(genMatrix)

                # write generation
                subArray.append(i + 1) # gen starts at 1.

                # write population
                population = sf.countPopulation(genMatrix)
                subArray.append(population)

                sf.determineNextGen(self.grid)
                sf.updateNextGen(self.grid)

                self.genArray.append(subArray)