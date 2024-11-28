import lib.simulation_functions as sf

class GenArray():
    def __init__(self, display_size, steps):
            self.display_size = display_size    #(w, h)
            self.steps = steps

            # generate the display matrix
            self.display = sf.generateDisplay(self.display_size)

            # initialize the alive/dead state of each cell
            sf.randomizeInitialAliveCells(self.display)

            # append each genMatrix to genArray
            self.genArray = list()
            for i in range(steps):
                subArray = list()

                # write matrix
                genMatrix = sf.writeMatrix(self.display)
                subArray.append(genMatrix)

                # write generation
                subArray.append(i + 1) # gen starts at 1.

                # write population
                population = sf.countPopulation(genMatrix)
                subArray.append(population)

                sf.determineNextGen(self.display)
                sf.updateNextGen(self.display)

                self.genArray.append(subArray)