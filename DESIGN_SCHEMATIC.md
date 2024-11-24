# DESIGN SCHEMATIC

> This is the design schematic and todo list for Conway's Game of Life.


## DESIGN

### Key Features

The idea of this project is that we have an interactive Game of Life. This includes:
- Loading and Saving different simulation seeds / patterns.
- Drawing a simulation pattern.
- Pausing and continuing a current simulation.
- Allowing the user to scrub through iterations of the simulation, allowing editing at any step.
- Displaying data about each live simulation (current generations and current population count).

### TODO LIST


## KNOWN BUGS & NAIVE IMPLEMENTATIONS

> Clicking the start button more than once while the simulation is running causes a flickering effect. The simulation will try to display the simulation twice at the same time. We need to choke click input on the start button while the simulation is running.

> The simulation can be sluggish in browser. We need to rework how the simulation is generated and displayed. We need to instead keep a running
set list (i.e. unique elements) of alive cells, and only check and update the current list of alive cells and their neighbors, rather then running through the entire matrix of cells every frame. This requires rework on the backend and front end. Postpone this fix until more functionality is added.


## NOTES

