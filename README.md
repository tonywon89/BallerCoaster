# BallerCoaster
[Live Link][live]
[live]:http://tonywon89.github.io/BallerCoaster/

BallerCoaster is a front-end application that simulates the movement of balls falling and flying, complete with portals.

## Features and Implementation

### Canvas
All the animation and drawings are done on HTML5 Canvas. The objects themselves are represented as Javascript objects, storing information like their positions.

### Animation
When the "play" button is clicked, the view starts the animation, which uses canvas's `requestAnimationFrame`. The `requestId` is stored, which is used to cancel the animation when the stop button is pressed (`cancelAnimationFrame(requestId)`).

### Balls
Balls have a position and velocity, which are both vector components. Balls are affected by gravity, which is its acceleration.

### Tracks
Tracks detect collisions with balls through vector projections, and translates the balls acceleration to that of gravity on an inclined plane, which is determined by the track's angle.

### Ball Generator
Constantly fires new balls in its specified angle. The user inputs its desired angle, velocity, and frequency of balls fired. The ball is only fired and pushed into the `main.objects` when a specific time is reached. The frequency determines the speed at which that time is reached.

### Portals
There is an entry portal and exit portal. They are associated through a `portalId`. One portal cannot exist without the other, and ensures that once an entry portal is created, an exit portal must be created immediately afterwards. Additionally, when one portal is clicked to be removed, the other object is removed immediately afterwards. This is accomplished through finding the index of the portal clicked, finding it's pair through their portalId, and splicing both of them out of their array.
```javascript
if (this.objects[i] instanceof Portal) {
  var idx = this.objects.indexOf(this.objects[i].findPair());
  idx < i ? this.objects.splice(idx, 2) : this.objects.splice(i, 2);
```
When a ball collides with an entry portal, its position gets transformed into the middle of the exit portal. The ball's new velocity is determined by the speed of it's original velocity, and made into new components using the exit portal's angle.

## Future Directions of BallerCoaster

### Accelerators
What is a Baller Coaster without accelerators that make them go up a lope?

### Ball colors
The goal is to make a beautiful flowing colors falling across the screen

### Hovers and Fans
Balls can hover and fall and get pushed up by a fan, granted that the ball is not too big

### Curved Tracks
Not happy with just straight lines? The goal is to allow one to bend tracks.

### Draggable objects
The goal is to make everything reposition when it is clicked and dragged

### Sounds effects / Music
Want more than just visuals? Wait till you can make a symphony of sounds with all the balls present.
