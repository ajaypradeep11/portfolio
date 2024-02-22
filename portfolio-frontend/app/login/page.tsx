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
import { redirect } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  let wehaveCaled = false;
  useEffect(() => {
    // if (window.innerWidth < 900)
    //   return
    const check = window.innerWidth < 900

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
    var scale = 0.2
    var size = 180
    var def = 40
    // art & design
    var illustration = Bodies.rectangle(90, 500, size, def, { chamfer: { radius: radius }, render: { sprite: { texture: LoginFormImage.src, xScale: scale, yScale: scale } } })
    var art = Bodies.rectangle(235, 460, size, def, { chamfer: { radius: radius }, render: { sprite: { texture: SigninImage.src, xScale: scale, yScale: scale } } })
    var threeD = Bodies.rectangle(190, 460, size, def, { chamfer: { radius: radius }, render: { sprite: { texture: AuthenticateImage.src, xScale: scale, yScale: scale } } })
    var graphic = Bodies.rectangle(160, 420, size, def, { chamfer: { radius: radius }, render: { sprite: { texture: EnterImage.src, xScale: scale, yScale: scale } } })
    var photo = Bodies.rectangle(250, 380, size, def, { chamfer: { radius: radius }, render: { sprite: { texture: AccessImage.src, xScale: scale, yScale: scale } } })
    var x = window.innerWidth - 100; // center the box horizontally
    var y = (window.innerHeight + 480) / 2 - 250; // center the box vertically
    var width = 140; // replace with your width
    var height = 120; // replace with your height    var width = 250; // replace with your width
    var thickness = 10; // replace with your desired thickness
    var angle = Math.PI / 24;
    var box = Bodies.rectangle(x, y - 10, width - 40, height - 135, {
      isStatic: true, // make the box static
      isSensor: true, // make the box a sensor
      render: {
        fillStyle: '#080808',
        lineWidth: 1,
        opacity: 0, // set the opacity to 50%
      }
    });
    var rad = 10
    var pastelColors = ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#ffb3ba', '#ffdfba'];
    var balls = [];
    var random = [90,190,160,340,110,100,290]
    for (let i = 0; i < 7; i++) {
      var ball = Bodies.circle(random[i], y, rad, {
        isStatic: false, // make the ball dynamic
        render: {
          fillStyle: pastelColors[i],
        }
      });

      balls.push(ball);
    }
    // Create the bottom of the box
    var bottom = Bodies.rectangle(x, y + height / 2 - 64, width, thickness, {
      isStatic: true,
      isSensor: true,
      render: {
        sprite: {
          texture: '/shoot1.png',
          xScale: 0.23, // Path to your image
          yScale: 0.23 // Path to your image
        },
        fillStyle: '#080808',
        lineWidth: 1,
        opacity: window.innerWidth > 900 ? 1 : 0,
      }
    });

    var step2 = Bodies.rectangle(x - 140, y - 250, width, thickness, {
      isStatic: true,
      isSensor: true,
      render: {
        sprite: {
          texture: '/step2.png',
          xScale: 0.8, // Path to your image
          yScale: 0.8 // Path to your image
        },
        fillStyle: '#080808',
        lineWidth: 1,
        opacity: window.innerWidth > 900 ? 0.2 : 0,
      }
    });

    var step1 = Bodies.rectangle((x / 2) - ((x / 2) / 2), y + 250, width, thickness, {
      isStatic: true,
      isSensor: true,
      render: {
        sprite: {
          texture: '/step1.png',
          xScale: 0.8, // Path to your image
          yScale: 0.8 // Path to your image
        },
        fillStyle: '#080808',
        lineWidth: 1,
        opacity: window.innerWidth > 900 ? 0.2 : 0,
      }
    });

    // Create the left side of the box
    var left = Bodies.rectangle(x - width / 2, y, thickness, height + 80, {
      isStatic: true,
      // isSensor: true,
      angle: -angle,
      render: {
        fillStyle: '#080808',
        lineWidth: 1,
        opacity: 0,
      }
    });

    // Create the right side of the box
    var right = Bodies.rectangle(x + width / 2, y, thickness, height + 80, {
      isStatic: true,
      // isSensor: true,
      angle: +angle,
      render: {
        fillStyle: '#080808',
        lineWidth: 1,
        opacity: 0,
      }
    });

    var main = [wallLeft, wallRight, roof, illustration, art, threeD, graphic, photo, bottom, left, right, box, step2, step1]
    if (check)
      main = []
    else
      balls = []

    World.add(engine.world, [...balls,
    ...main,ground
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
      <div id="game-container" className="custom-bg  absolute inset-0 z-0"></div>
      <div className="relative mx-auto flex w-full max-w-[1100px] flex-col space-y-2.5 p-4 md:-mt-32 z-10" style={{ "pointerEvents": "none" }}>
        {/* <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div> */}
        <form action={authenticate} className="space-y-3" >
          <LoginForm />


          <Button id='something' className="small-button mt-4 w-full" style={{ display: 'none' }}>
            Log in
          </Button>
        </form>
      </div>
      {/* <div
            className="relative justify-end"
            aria-live="polite"
            aria-atomic="true"
          >
           <Image
            src="/shoot.png" // Path to your image
            alt="Description of the image"
            width={500} // Desired width
            height={500} // Desired height
          />
          </div> */}
    </main>
  );
}