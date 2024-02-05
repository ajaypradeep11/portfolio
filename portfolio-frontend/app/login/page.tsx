"use client"
import LoginForm from '@/app/ui/login-form';
import { Engine, Render, Events, World, Bodies, Composite, Mouse, MouseConstraint, Bounds, } from 'matter-js';
import { useEffect } from 'react';
import LoginFormImage from '@/app/asset/loginbutton.png';
import SigninImage from '@/app/asset/signin.png';
import AuthenticateImage from '@/app/asset/authenticate.png';
import EnterImage from '@/app/asset/enter.png';
import AccessImage from '@/app/asset/access.png';
import { authenticate } from '../lib/actions';
import { useFormState } from 'react-dom';
import { Button } from '../ui/button';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  useEffect(() => {
    const gameContainer = document.getElementById('game-container');
    if (gameContainer && gameContainer.firstChild) {
      gameContainer.removeChild(gameContainer.firstChild);
    }

    var engine = Engine.create(),
      world = engine.world;

    // create a renderer
    var render = Render.create({
      element: gameContainer || undefined,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        pixelRatio: 2,
        background: '#080808',
        wireframes: false,
      }
    });


    // create bounds
    var ground = Bodies.rectangle(
      (window.innerWidth / 2) + 160, window.innerHeight + 80, window.innerWidth + 320, 160, { render: { fillStyle: '#080808' }, isStatic: true });
    var wallLeft = Bodies.rectangle(-80, window.innerHeight / 2, 160, window.innerHeight, { isStatic: true });
    var wallRight = Bodies.rectangle(window.innerWidth + 80, window.innerHeight / 2, 160, 1200, { isStatic: true })
    var roof = Bodies.rectangle(
      (window.innerWidth / 2) + 160, -80, window.innerWidth + 320, 160, { isStatic: true })

    var radius = 20

    // create objects

    // art & design
    var illustration = Bodies.rectangle(90, 500, 203, 40, { chamfer: { radius: radius }, render: { sprite: { texture: LoginFormImage.src, xScale: 0.2, yScale: 0.2 } } })
    var art = Bodies.rectangle(235, 460, 203, 40, { chamfer: { radius: radius }, render: { sprite: { texture: SigninImage.src, xScale: 0.2, yScale: 0.2 } } })
    var threeD = Bodies.rectangle(190, 460, 203, 40, { chamfer: { radius: radius }, render: { sprite: { texture: AuthenticateImage.src, xScale: 0.2, yScale: 0.2 } } })
    var graphic = Bodies.rectangle(160, 420, 203, 40, { chamfer: { radius: radius }, render: { sprite: { texture: EnterImage.src, xScale: 0.2, yScale: 0.2 } } })
    var photo = Bodies.rectangle(250, 380, 203, 40, { chamfer: { radius: radius }, render: { sprite: { texture: AccessImage.src, xScale: 0.2, yScale: 0.2 } } })
    var x = window.innerWidth  / 2; // center the box horizontally
    var y = (window.innerHeight + 480 )/ 2; // center the box vertically
    var width = 250; // replace with your width
    var height = 150; // replace with your height    var width = 250; // replace with your width
    var thickness = 10; // replace with your desired thickness
    var box = Bodies.rectangle(x, y, width, height, {
      isStatic: true, // make the box static
      isSensor: true, // make the box a sensor
      render: {
        fillStyle: '#080808',
        lineWidth: 1,
        opacity: 0, // set the opacity to 50%
      }
    });
    // Create the bottom of the box
    var bottom = Bodies.rectangle(x, y + height / 2, width, thickness, {
      isStatic: true,
      // isSensor: true,
      render: {
        fillStyle: '#080808',
        lineWidth: 1,
        opacity: 0.5,
      }
    });

    // Create the left side of the box
    var left = Bodies.rectangle(x - width / 2, y, thickness, height, {
      isStatic: true,
      // isSensor: true,
      render: {
        fillStyle: '#080808',
        lineWidth: 1,
        opacity: 0.5,
      }
    });

    // Create the right side of the box
    var right = Bodies.rectangle(x + width / 2, y, thickness, height, {
      isStatic: true,
      // isSensor: true,
      render: {
        fillStyle: '#080808',
        lineWidth: 1,
        opacity: 0.5,
      }
    });

    World.add(engine.world, [
      ground, wallLeft, wallRight, roof, illustration, art, threeD, graphic, photo, bottom, left, right, box
    ]);
    Events.on(engine, 'collisionStart', function (event) {
      var pairs = event.pairs;
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        if ((pair.bodyA === illustration && pair.bodyB === box) || (pair.bodyA === box && pair.bodyB === illustration)) {
          const buttonElement = document.getElementById('something');
          if (buttonElement) {
            buttonElement.click();
          }
        }
      }
    });
    var mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false
          }
        }
      });

    World.add(world, mouseConstraint);

    render.mouse = mouse;

    let click = false;

    document.addEventListener('mousedown', () => click = true);
    document.addEventListener('mousemove', () => click = false);
    document.addEventListener('mouseup', () => console.log(click ? 'click' : 'drag'));

    Engine.run(engine);

    Render.run(render);
  }, []);

  return (
    <main className="custom-bg flex items-center justify-center md:h-screen">
      <div id="game-container" className="absolute inset-0 z-0"></div>
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32 z-10">
        {/* <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div> */}
        <form action={dispatch} className="space-y-3">
          <LoginForm />
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{errorMessage}</p>
              </>
            )}
          </div>
          <Button id='something' className="small-button mt-4 w-full" style={{display: 'none'}}>
            Log in
          </Button>
        </form>
      </div>
    </main>
  );
}