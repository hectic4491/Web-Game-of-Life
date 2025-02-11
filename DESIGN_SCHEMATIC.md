# DESIGN SCHEMATIC
> This is the design schematic and todo list for Conway's Game of Life.

## +DESIGN+


### ++Key Features++
The idea of this project is that we have an interactive Game of Life. This includes:
- Loading and Saving different simulation seeds / patterns. [DONE]
- Moving the select menu to a new menu that slides out to the right of the control panel.
- Drawing a simulation pattern.
- Pausing and continuing a current simulation. [DONE]
- Allowing the user to scrub through iterations of the simulation, allowing editing at any step. [WIP]
- Displaying data about each live simulation (current generations and current population count). [DONE]
- Displaying the simulation as a "window" and allowing zooming in/out, and panning across the grid. [WIP]
- A settings panel which would allow
- - Changing the colors of the GUI
- - Changing the framerate of the GUI
- Make the app more user design responsive [DONE]
- - Cells change size and color when hovered over
- - Header having a loading graphic (maybe just the words Loading... with a changing ellipses ., .., ..., ) while fetching and processing certain inputs that take some time. This would be a function attached to the fetchSimulation function. Probably use a setInterval() to do it.


### ++TODO List++
- Use Numpy on the backend to utilize arrays.
- We can currently run the simulation at a set size for a set number of iterations.
- Allowing the backend to process a sent simulation pattern.
- Settings. 
- Adding the drawing functionality.
- Reformating the CSS page.
- Reformating the grid size to be dynamic and not hard coded.
- Having the simulationField grid generate an appropriate size for the user's browser.
- Connecting the CSS root variable colors to the colors we use in the simulation for the alive and dead cells.


## +KNOWN BUGS & NAIVE IMPLEMENTATIONS+
> The simulation can be sluggish in browser. We need to rework how the simulation is generated and displayed. We need to instead keep a running set list (i.e. unique elements) of alive cells, and only check and update the current list of alive cells and their neighbors, rather then running through the entire matrix of cells every frame. This requires rework on the backend and front end. Postpone this fix until more functionality is added.


## +COMPLETED+
> Clicking the start button more than once while the simulation is running causes a flickering effect. The simulation will try to display the simulation twice at the same time. We need to choke click input on the start button while the simulation is running.

> Running and Pausing the simulation.

> Combine the fetch functions into a single function.

> Having the simulationField grid generate on a "window".

> Selecting from a library of pre-existing patterns.

> Adding the scrubbing functionality.
## +NOTES+
>  11/28/2024 06:35:00 -rob
>  Set difference: 
>                   A - B  :  i.e. "The elements in A that are not in B."
>                   B - A  :  i.e. "The elements in B that are not in A."
>                   
>                   Let A be generation N's set of alive cell's coordinates.
>                   Let B be generation N-1's set of alive cell's coordinates.
>
>                   Then:
>                     A ∩ B is the set of cells that stay alive. Therefore, no need to update.
>                     A - B is the set of cells that become alive. Therefore, we need to update the background color as "alive".
>                     B - A is the set of cells that become dead. Therefore, we need to update the background color as "dead".
>                   
>                   Thus, we've removed redundancy. We now access only the exact cells that need to be updated every frame.
>
> Design Optimization: We don't need to send a full matrix to the client. The matrix is sparse and will typically contain mostly 0's. This means we have to iterate through the entire matrix every frame only to make a few adjustments. If we drop the matrix data object and instead use a set of the alive cell's coordinates as our data object, we narrow our focus onto the exact cells that need to be updated.


> This is fun, I'm having a good time working on this project :> -rob


> 2/10/2025 07:15:00 -rob
>
> To clean up my code, I think I should think about the program interms of the main object's i defined. Simulation and UI. So instead of passing specific properties to functions, i pass the object to the functions and let the internal function logic pull out the object's information as it needs.

> The select and draw functions should generate their own sub menus.
> Draw will allow us to clear the current screen, or to plainly edit the current frame.

> Instead of having the cells transform their size (thus making them smaller to click) we should instead increase the size of the border as well, so that the area of the clickable cell is still active.

> The button colors should change to grey when they aren't currently clickable.

> While in drawing mode, if we have an empty grid and click new, the backend handles this as "random"