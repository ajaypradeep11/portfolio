"use client"
import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
import { Engine, Render, Events, World, Bodies, Composite, Vertices, Svg, Mouse, MouseConstraint, Bounds, } from 'matter-js';
import { useEffect } from 'react';
import LoginFormImage from '@/app/asset/loginbutton.png';
import SigninImage from '@/app/asset/signin.png';
import AuthenticateImage from '@/app/asset/authenticate.png';
import EnterImage from '@/app/asset/enter.png';
import AccessImage from '@/app/asset/access.png';

export default function LoginPage() {
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
    var illustration = Bodies.rectangle(90, 500, 133, 40, { chamfer: { radius: radius }, render: { sprite: { texture: LoginFormImage.src, xScale: 0.2, yScale: 0.2 } } })
    var art = Bodies.rectangle(235, 460, 56, 40, { chamfer: { radius: radius }, render: { sprite: { texture: SigninImage.src, xScale: 0.2, yScale: 0.2  } } })
    var threeD = Bodies.rectangle(190, 460, 52, 40, { chamfer: { radius: radius }, render: { sprite: { texture: AuthenticateImage.src, xScale: 0.2, yScale: 0.2  } } })
    var graphic = Bodies.rectangle(160, 420, 105, 40, { chamfer: { radius: radius }, render: { sprite: { texture: EnterImage.src, xScale: 0.2, yScale: 0.2  } } })
    var photo = Bodies.rectangle(250, 380, 86, 40, { chamfer: { radius: radius }, render: { sprite: { texture: AccessImage.src, xScale: 0.2, yScale: 0.2  } } })

    World.add(engine.world, [
      ground, wallLeft, wallRight, roof, illustration,art, threeD, graphic, photo,
    ]);

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

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // Allow page scrolling in matter.js window
    // mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    // mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

    // Detect clicks vs. drags
    let click = false;

    document.addEventListener('mousedown', () => click = true);
    document.addEventListener('mousemove', () => click = false);
    document.addEventListener('mouseup', () => console.log(click ? 'click' : 'drag'));

    // // Create a On-Mouseup Event-Handler
    // Events.on(mouseConstraint, 'mouseup', function (event: { source: any; }) {
    //   var mouseConstraint = event.source;
    //   var bodies = engine.world.bodies;
    //   if (!mouseConstraint.bodyB) {
    //     for (var i = 0; i < bodies.length; i++) {
    //       var body = bodies[i];
    //       // Check if clicked or dragged
    //       if (click === true) {
    //         if (body && body.bounds && mouseConstraint && mouseConstraint.mouse && mouseConstraint.mouse.position) {
    //           if (Bounds.contains(body.bounds, mouseConstraint.mouse.position)) {
    //             var bodyUrl = body.url;
    //             console.log("Body.Url >> " + bodyUrl);
    //             // Hyperlinking feature
    //             if (bodyUrl != undefined) {
    //               //window.location.href = bodyUrl;
    //               window.open(bodyUrl, '_blank');
    //               console.log("Hyperlink was opened");
    //             }
    //             break;
    //           }
    //         }
    //       }
    //     }
    //   }
    // });

    // run the engine
    Engine.run(engine);

    // run the renderer
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
        <LoginForm />
      </div>
    </main>
  );
}