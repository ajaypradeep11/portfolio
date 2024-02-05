import { Engine, Render, Runner, World, Bodies } from 'matter-js';

// Create an engine
const engine = Engine.create();

const gameContainer = document.getElementById('game-container');

// Create a renderer
const render = Render.create({
  element: gameContainer,
  engine: engine,
});

// Create a runner to run the engine
const runner = Runner.create();
Runner.run(runner, engine);

// Add a rectangle and a ground to the world
const rectangle = Bodies.rectangle(200, 200, 50, 50);
const ground = Bodies.rectangle(200, 600, 400, 60, { isStatic: true });
World.add(engine.world, [rectangle, ground]);

// Run the renderer
Render.run(render);