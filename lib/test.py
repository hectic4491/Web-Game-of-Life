import numpy as np
import time

array = np.random.rand(1000, 1000)

# Nested Loops
start_time = time.time()
for row in array:
    for element in row:
        pass
print("Nested Loops: %s seconds" % (time.time() - start_time))

# flat Iterator !!! This one wins
start_time = time.time()
for element in array.flat:
    pass
print("flat Iterator: %s seconds" % (time.time() - start_time))

# nditer
start_time = time.time()
for element in np.nditer(array):
    pass
print("nditer: %s seconds" % (time.time() - start_time))

# Flatten
start_time = time.time()
for element in array.flatten():
    pass
print("Flatten: %s seconds" % (time.time() - start_time))
