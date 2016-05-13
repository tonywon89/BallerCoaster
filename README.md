# BallerCoaster
[Live Link][live]
[live]:http://tonywon89.github.io/BallerCoaster/

BallerCoaster is a front-end application that simulates the movement of balls falling and flying, complete with portals.

## Features and Implementation

### Canvas
All the animation and drawings are done on HTML5 Canvas. The objects themselves are represented as Javascript objects, storing information like there position.

### Balls
Balls have a position and velocity, which are both vector components. Balls are affected by gravity, which is its acceleration.

### Tracks
Tracks detect collisions with balls through vector projections, and translates the balls acceleration to that of gravity on an inclined plane, determined by the tracks angle.

### Ball Generator
Constantly fires new balls in its specified angle. The user inputs its desired angle, velocity, and frequency of balls. The ball is only fired and pushed into the main objects when a specific time is reached. The frequency determines the speed at which that time is reached.

### Portals
There is an entry portal and exit portal. When a ball collides with an entry portal, its position gets transformed into the middle of the exit portal. The ball's new velocity is determined by the speed of it's original velocity, and made into new components using the exit portal's angle.

## Future Directions of BallerCoaster

### Accelerators
What is a Baller Coaster without accelerators that make them go up a lope?

### Ball colors
The goal is to make a beautiful flowing colors of balls flying everywhere

### Hovers and Fans
Balls can hover and fall and get pushed up by a fan, granted that the ball is not too big

### Curved Tracks
Not happy with just straight lines? The goal is to allow one to bend tracks.

### Draggable objects
The goal is to make everything reposition when it is clicked and dragged

### Sounds effects / Music
Want more than just visuals? Wait till you can make a symphony of sounds with all the balls present. 
