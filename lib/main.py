import simulation_functions as sf

class GenArray():
    def __init__(self, display_size, steps):
            self.display_size = display_size    #(w, h)
            self.steps = steps
            self.genArray = list()

            # generate the display matrix
            self.display = sf.generateDisplay(self.display_size)

            # initialize the alive/dead state of each cell
            sf.randomizeInitialAliveCells(self.display)

            # append each genMatrix to genArray
            self.genArray = list()
            for _ in range(steps):
                genMatrix = sf.writeMatrix(self.display)
                self.genArray.append(genMatrix)
                sf.determineNextGen(self.display)
                sf.updateNextGen(self.display)


# Driver code to demonstrate the object
if __name__ == '__main__':
     array = GenArray(display_size=(60,30), steps=50)
     sf.showArray(array.genArray)