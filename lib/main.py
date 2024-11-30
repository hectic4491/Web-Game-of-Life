import lib.simulation_functions as sf

class GenArray():
    def __init__(self, grid_size, steps):
            self.grid_size = grid_size    #(w, h)
            self.steps = steps

            # generate the display matrix
            self.grid = sf.generate_grid(self.grid_size)

            # initialize the alive/dead state of each cell
            sf.randomize_initial_alive_cells(self.grid)

            # append each genMatrix to genArray
            self.gen_array = list()
            for i in range(steps):
                sub_array = list()

                # write matrix
                gen_matrix = sf.write_matrix(self.grid)
                sub_array.append(gen_matrix)

                # write generation
                sub_array.append(i + 1) # gen starts at 1.

                # write population
                population = sf.count_population(gen_matrix)
                sub_array.append(population)

                sf.determine_next_gen(self.grid)
                sf.update_next_gen(self.grid)

                self.gen_array.append(sub_array)