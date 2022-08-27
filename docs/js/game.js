
export class Game {
    constructor(ui) {

    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Body = Matter.Body,
        Composites = Matter.Composites,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Vertices = Matter.Vertices,
        Common = Matter.Common,
        Composite = Matter.Composite,
        Query = Matter.Query,
        Bodies = Matter.Bodies;

    // create engine
    var engine = Engine.create(),
        world = engine.world;

    // create renderer
    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 575,
            height: 867,
            //showAngleIndicator: true,
            wireframes: false,
            background: '#aaccff',
        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // add bodies
    var size = 50;

    // (xx, yy, columns, rows, columnGap, rowGap, callback)
    /*var stack = Composites.stack(300, 600 - size * 6/2, 5, 5, 0, 0, function(x, y) {
        var partA = Bodies.rectangle(x, y, size, size, { label: 'block', density: 0.5, restitution: 0.000000001 });

        return Body.create({
            parts: [partA]
        });
    });*/
    /*
    var stack = Composites.stack(300, 600 - size * 6/2, 5, 5, 0, 0, function(x, y) {
        var partA = Bodies.rectangle(x, y, size, size, { label: 'block', density: 0.5, restitution: 0.000000001 });

        return Body.create({
            parts: [partA]
        });
    });*/

    Common.setDecomp(window.decomp);

    var blockTemplates = [
        {vert:Vertices.fromPath('0 0  50 0  50 50  0 50'), color:'#FF6B22'},
        {vert:Vertices.fromPath('0 0  100 0  100 50  0 50'), color:'#005AFF'},
        {vert:Vertices.fromPath('0 0  100 0  100 100  0 100'), color:'#03AF7A'},
        {vert:Vertices.fromPath('0 0  50 0  50 50 100 50 100 100 0 100'), color:'#4DC4FF'},
        {vert:Vertices.fromPath('0 0  50 0  50 100 0 100'), color:'#AA4499'},
        {vert:Vertices.fromPath('0 0  50 0  50 50  100 50  100 0  150 0  150 100  0 100'), color:'#FFF100'},
    ];
    /**
     * 0 小さい正方形
     * 1 横長
     * 2 正方形
     * 3 くつ
     * 4 縦長
     * 5 凹
     */
    const layout = [
        {id: 0, rot:0, x: 0, y:0},
        {id: 1, rot:0, x: 1, y:0},
        {id: 2, rot:0, x: 1, y:1},
        {id: 3, rot:0, x: 1, y:2},
        {id: 1, rot:0, x: -1, y:2},
        {id: 4, rot:0, x: -1, y:3},
        {id: 5, rot:0, x: 3, y:5},
        {id: 0, rot:0, x: 1, y:3},

        {id: 1, rot:0, x: -1, y:5},
        {id: 1, rot:0, x: 1, y:5},
        {id: 4, rot:0, x: 2, y:6},
        {id: 5, rot:0, x: 2, y:8},
        {id: 0, rot:0, x: 0, y:6},
        
        {id: 0, rot:0, x: -1, y:8},
        {id: 0, rot:0, x: 0, y:8},
        {id: 0, rot:0, x: 1, y:8},
        {id: 0, rot:0, x: 2, y:8},
    ];

    
    let blocks = [];
    layout.forEach(b => {
        let tmpBody = Bodies.fromVertices(
            0, 0, blockTemplates[b.id].vert, 
            {
                isStatic: false,
                render: {
                    fillStyle: blockTemplates[b.id].color
                }
            },
            true);
        console.log(tmpBody);
        console.log(tmpBody.vertices[0]);
        let x = tmpBody.vertices[0].x;
        let y = tmpBody.vertices[0].y;
        Body.translate(tmpBody, {x: 200-x+b.x * size, y: -2-y+b.y * size});
        blocks.push(tmpBody);      
    });

    // Blocks
    Composite.add(world, blocks);

/*    density: 5, // 密度
    frictionAir: 0.001, // 空気抵抗
    restitution: 0.3, // 弾力性
    friction: 8, // 摩擦
    label: 'facebook',
    angle: Math.random() * 10,*/
    // キャラクター：六角形
    let hex = Bodies.polygon(250, -60, 6, 60, 
        {
            label: 'hex', 
            density: 0.000005, restitution: 0.000000001,
            render: {
                strokeStyle: '#ffffff',
                sprite: {
                    texture: 'img/kirby.png'
                }
            }
        }
    );
    Body.rotate(hex, Math.PI/6);

    // Walls
    let composite = Composite.add(world, [
        //Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
        //Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
        //Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
        Bodies.rectangle(250, 600, 250, 300, { isStatic: true,
            render: {
                fillStyle: "#B50"
        }}),
        hex
    ]);    

    // add mouse control
    var mouse = Mouse.create(render.canvas);

    const startTime = performance.now(); // 開始時間


    // Fail / Clear Check
    const gameStateTimerInterval = 1000;
    const gameStateTimer = setInterval(() => {
        if (hex.position.x < 140 || hex.position.x > 400) {
            clearInterval(gameStateTimer);
                    
            ui.showDialog("失敗！", "リトライ", function(){
                window.location.reload();
            });
            return;
        }

        if (composite.bodies.length == 2) {
            const endTime = performance.now(); // 終了時間
            let clearTime = endTime - startTime;
            let date = new Date(clearTime);
            clearInterval(gameStateTimer);

            ui.showDialog("成功！！！" + date.getMinutes() + "分" + date.getSeconds() + "秒", "リトライ", function(){
                window.location.reload();
            });
            return;
        }

    }, gameStateTimerInterval);

    /*
    const hexPosTimerInterval = 100;
    const hexPosTimer = setInterval(() => {
        
    }, checkTimerInterval);*/
let score = 0;
ui.setScore(score);
    render.canvas.addEventListener('touchend', () => {
        const query = Query.point(Composite.allBodies(world), mouse.position)
        console.log(mouse.position);
        console.log(query);
        if (query.length > 0 && query[0].label == 'Body'){
            score++;
            ui.setScore(score);
            Composite.remove(composite, query[0]);
        }
        });

    //Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 800, y: 600 }
    });

}
}