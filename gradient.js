// gradient.js
class gradient {
    paint(ctx, geom, properties) {
      // Use `ctx` as if it was a normal canvas
      const colors = ['red', 'green', 'blue'];
      const size = 32;
      for(let y = 0; y < geom.height/size; y++) {
        for(let x = 0; x < geom.width/size; x++) {
          const color = colors[(x + y) % colors.length];
          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.rect(x * size, y * size, size, size);
          ctx.fill();
        }
      }
    }
  }
  
  // Register our class under a specific name
  registerPaint('gradient', gradientPainter);
  



if ('paintWorklet' in CSS) {
	CSS.paintWorklet.addModule('gradient.js'); 
}

//css custom highlight api

const parentNode = document.getElementById("toggle1");

const range1 = new Range();
range1.setStart(parentNode, 10);
range1.setEnd(parentNode, 20);

const range2 = new Range();
range2.setStart(parentNode, 40);
range2.setEnd(parentNode, 60);


const highlight = new Highlight(range1, range2);


const user1Highlight = new Highlight(user1Range1, user1Range2);
const user2Highlight = new Highlight(user2Range1, user2Range2, user2Range3);

CSS.highlights.set("user-1-highlight", user1Highlight);
CSS.highlights.set("user-2-highlight", user2Highlight);


// Remove a single highlight from the registry.
CSS.highlights.delete("user-1-highlight");

// Clear the registry.
CSS.highlights.clear();





 

