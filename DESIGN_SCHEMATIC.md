# DESIGN SCHEMATIC

> This is the design schematic and todo list for Conway's Game of Life.

## +DESIGN+

### ++Key Features++

The idea of this project is that we have an interactive Game of Life. This includes:
- Loading and Saving different simulation seeds / patterns.
- Drawing a simulation pattern.
- Pausing and continuing a current simulation.
- Allowing the user to scrub through iterations of the simulation, allowing editing at any step.
- Displaying data about each live simulation (current generations and current population count).
- Displaying the simulation as a "window" and allowing zooming in/out, and panning across the grid.
- A settings panel which would allow
- - Changing the colors of the GUI
- - Changing the framerate of the GUI

### ++TODO List++

- Running and Pausing the simulation.
> We can currently run the simulation at a set size for a set number of iterations.
- Selecting from a library of pre-existing patterns.
- Allowing the backend to process a sent simulation pattern.
- Allowing the backend to process a "random" seed that would generate the same random initial grid everytime on every browser for every user (like minecraft seeds). 
- Having the simulationField grid generate an appropriate size for the user's browser.
- Having the simulationField grid generate on a "window".
- Settings. 
- Adding the drawing functionality.
- Adding the scrubbing functionality.
- Reformating the CSS page.
- Reformating the simulationField grid size to be dynamic and not hard coded.
- Connecting the CSS root variable colors to the colors we use in the simulation for the alive and dead cells.

## +KNOWN BUGS & NAIVE IMPLEMENTATIONS+

> Clicking the start button more than once while the simulation is running causes a flickering effect. The simulation will try to display the simulation twice at the same time. We need to choke click input on the start button while the simulation is running.

> The simulation can be sluggish in browser. We need to rework how the simulation is generated and displayed. We need to instead keep a running
set list (i.e. unique elements) of alive cells, and only check and update the current list of alive cells and their neighbors, rather then running through the entire matrix of cells every frame. This requires rework on the backend and front end. Postpone this fix until more functionality is added.

> The project files currently has a .venv and venv directory. We need to work out which one to keep and which one to scrap. We need to make sure that development is standardized between Travis' system, and Rob's Laptop and Desktop system.

> The main development is still happening on the new-site-design branch. We need to work out the virtual envrionment issue before merging it back onto the master branch.

## +NOTES+

> This is fun, I'm having a good time working on this project :> -rob