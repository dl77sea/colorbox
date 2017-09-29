function isEquivalent(a, b) {
  // Create arrays of property names
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length != bProps.length) {
    return false;
  }

  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];

    // If values of same property are not equal,
    // objects are not equivalent
    if (a[propName] !== b[propName]) {
      return false;
    }
  }

  // If we made it this far, objects
  // are considered equivalent
  return true;
}

// Get the canvas element from our HTML above
var canvas = document.getElementById("renderCanvas");

// Load the BABYLON 3D engine
var engine = new BABYLON.Engine(canvas, true);

// This begins the creation of a function that we will 'call' just after it's built
var createScene = function() {

  // Now create a basic Babylon Scene object
  var scene = new BABYLON.Scene(engine);

  // Change the scene background color to green.
  scene.clearColor = new BABYLON.Color3(0, 1, 0);

  // This creates and positions a free camera
  // var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
  // ArcRotateCamera >> Camera turning around a 3D point (here Vector zero) with mouse and cursor keys
  // Parameters : name, alpha, beta, radius, target, scene
  var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 1, 120, new BABYLON.Vector3.Zero(), scene);
  camera.setPosition(new BABYLON.Vector3(50, 50, -100));
  // camera.position.x = 0;
  // camera.position.z = 50;
  // camera.position.z = 0;


  // This targets the camera to scene origin
  // camera.setTarget(BABYLON.Vector3.Zero());

  // This attaches the camera to the canvas
  camera.attachControl(canvas, false);

  // This creates a light, aiming 0,1,0 - to the sky.
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(-50, 100, 0), scene);

  // Dim the light a small amount
  light.intensity = 1.0;

  // Let's try our built-in 'sphere' shape. Params: name, subdivisions, size, scene
  var sphere0 = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
  var sphereX = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
  var sphereY = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
  var sphereZ = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

  var boxOptions = {
    // size: number,
    width: 25,
    height: 25,
    depth: 25,
    // faceUV: Vector4[],
    // faceColors: Color4[],
    // sideOrientation: number,
    // frontUVs: Vector4,
    // backUVs: Vector4,
    updatable: true
  };

  var box01 = BABYLON.MeshBuilder.CreateBox("box01", boxOptions, scene)

  var materialSnarf = new BABYLON.StandardMaterial("snarf", scene);

  var materialTestX = new BABYLON.StandardMaterial("testX", scene);
  var materialTestY = new BABYLON.StandardMaterial("testY", scene);
  var materialTestZ = new BABYLON.StandardMaterial("testZ", scene);

  materialSnarf.diffuseColor = new BABYLON.Color3(1.0, 1.0, 1.0);

  materialTestX.diffuseColor = new BABYLON.Color3(1.0, 0.0, 0.0);
  materialTestY.diffuseColor = new BABYLON.Color3(0.0, 1.0, 0.0);
  materialTestZ.diffuseColor = new BABYLON.Color3(0.0, 0.0, 1.0);

  materialSnarf.alpha = 0.5;

  box01.material = materialSnarf;

  sphereX.material = materialTestX;
  sphereY.material = materialTestY;
  sphereZ.material = materialTestZ;

  box01.position.x = 0;
  box01.position.y = 0;
  box01.position.z = 0;

  sphere0.position.x = 0;
  sphere0.position.y = 0;
  sphere0.position.z = 0;

  sphereX.position.x = 10;
  sphereX.position.y = 0;
  sphereX.position.z = 0;

  sphereY.position.x = 0;
  sphereY.position.y = 10;
  sphereY.position.z = 0;

  sphereZ.position.x = 0;
  sphereZ.position.y = 0;
  sphereZ.position.z = 10;

  //register action on test mesh
  box01.actionManager = new BABYLON.ActionManager(scene);
  var normals = box01.getVerticesData(BABYLON.VertexBuffer.NormalKind);
  var vertices = box01.getVerticesData(BABYLON.VertexBuffer.PositionKind);
  console.log(normals)

  var observer1;
  var observer2;


  //setup push/pull index-into-vertexbuffer for each side of box01
  var vertsLeft = [];
  var vertsRight = [];
  var vertsBack = [];
  var vertsFront = [];
  var vertsTop = [];
  var vertsBottom = [];

  let i;

  var vertsToMove = [];

  //x
  for (i = 0; i < vertices.length; i += 3) {
    if (Math.sign(vertices[i]) === 1) {
      vertsLeft.push(i)
    }
  }
  for (i = 0; i < vertices.length; i += 3) {
    if (Math.sign(vertices[i]) === -1) {
      vertsRight.push(i)
    }
  }
  //y
  for (i = 1; i < vertices.length; i += 3) {
    if (Math.sign(vertices[i]) === 1) {
      vertsTop.push(i)
    }
  }
  for (i = 1; i < vertices.length; i += 3) {
    if (Math.sign(vertices[i]) === -1) {
      vertsBottom.push(i)
    }
  }
  //z
  for (i = 2; i < vertices.length; i += 3) {
    if (Math.sign(vertices[i]) === 1) {
      vertsFront.push(i)
    }
  }
  for (i = 2; i < vertices.length; i += 3) {
    if (Math.sign(vertices[i]) === -1) {
      vertsBack.push(i)
    }
  }

  //box has been clicked on
  //so register an action to it that:
  //creates helper plane with action assigned
  box01.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger,
    function(event) {
      //get location clicked on, so we know where to create helper plane
      let pickedObj = scene.pick(event.pointerX, event.pointerY);
      let v3PickedNormal = scene.pick(event.pointerX, event.pointerY).getNormal()
      let v3PickedWorldCoord = scene.pick(event.pointerX, event.pointerY).pickedPoint;
      console.log("check this: ", v3PickedWorldCoord)
      let prevPickedPoint = v3PickedWorldCoord;
      // let pickedFaceId = scene.pick(event.pointerX, event.pointerY).faceId;
      console.log(pickedObj)
      //freeze camera
      camera.detachControl(canvas)

      //set box to not pickable bc we want to get pick location of helper plane instead
      box01.isPickable = false;

      //create helper plane
      var planeHelper = BABYLON.Mesh.CreatePlane("plane", 200.0, scene, false, BABYLON.Mesh.DOUBLESIDE);

      //this is needed to let plane helper mesh pass through observer
      scene.pointerMovePredicate = function(mesh) {
        if (mesh === planeHelper)
          return true
        return false
      }

      planeHelper.isVisible = false;

      function positionHelperPlane() {
        planeHelper.position.x = v3PickedWorldCoord.x;
        planeHelper.position.y = v3PickedWorldCoord.y;
        planeHelper.position.z = v3PickedWorldCoord.z;
      }

      //this is the value which is set to index into picked point vector by update vertex function
      var indPickedPoint;
      var normalCoef;

      // left end picked
      if (isEquivalent(v3PickedNormal, {
          x: 1,
          y: 0,
          z: 0
        })) {
        console.log("left")
        normalCoef = 1;
        //default plane rotation ok here, just transform position
        positionHelperPlane();
        vertsToMove = vertsLeft;
        indPickedPoint = "x"
      } else if (isEquivalent(v3PickedNormal, {
          x: 0,
          y: 0,
          z: 1
        })) {
        console.log("front")
        normalCoef = 1;
        positionHelperPlane();
        planeHelper.rotation.y = Math.PI / 2;
        vertsToMove = vertsFront;
        indPickedPoint = "z"
      } else if (isEquivalent(v3PickedNormal, {
          x: -1,
          y: 0,
          z: 0
        })) {
        console.log("right")
        normalCoef = -1;
        // default plane rotation ok here, just transform position
        positionHelperPlane();
        vertsToMove = vertsRight;
        indPickedPoint = "x"
      } else if (isEquivalent(v3PickedNormal, {
          x: 0,
          y: 0,
          z: -1
        })) {
        console.log("back")
        normalCoef = -1;
        positionHelperPlane();
        planeHelper.rotation.y = Math.PI / 2;
        // planeHelper.rotation.z = Math.PI / 2;
        vertsToMove = vertsBack;
        indPickedPoint = "z"
      } else if (isEquivalent(v3PickedNormal, {
          x: 0,
          y: 1,
          z: 0
        })) {
        console.log("top")
        normalCoef = 1;
        positionHelperPlane();
        //default plane rotation ok here, just transform position
        vertsToMove = vertsTop;
        indPickedPoint = "y"
      } else if (isEquivalent(v3PickedNormal, {
          x: 0,
          y: -1,
          z: 0
        })) {
        console.log("bottom")
        normalCoef = -1;
        positionHelperPlane();
        //default plane rotation ok here, just transform position
        vertsToMove = vertsBottom;
        indPickedPoint = "y"
      }

      // watch for mouse off canvas
      canvas.addEventListener("mouseout", function() {
        console.log("mouse out")
        // scene.onPointerObservable.remove(observer1);
        //end moving vertices when this happens
        scene.removeMesh(planeHelper)

        //resume camera
        camera.attachControl(canvas, false);

        scene.onPointerObservable.remove(observer2);
        box01.isPickable = true;
      })

      //set up listener for on-up event so we know when to exit edit-mode
      observer1 = scene.onPointerObservable.add(function(pointerInfo) {
        console.log("observer", pointerInfo.event.type)
        console.log("observer1", pointerInfo)
        if (pointerInfo.event.type === "pointerup") {
          // planeHelper.actionManager.delete()
          scene.removeMesh(planeHelper)

          //resume camera
          camera.attachControl(canvas, false);

          //get rid of observers so they don't continue to fire after done editing box
          // scene.onPointerObservable.remove(observer1);
          scene.onPointerObservable.remove(observer2);
          console.log("removed")
          //set box back to being pickable
          box01.isPickable = true;
        }
      });

      //register action to helper plane, so when pointer is over plane, an observer will return world coordinate so we know where to drag vertices to.
      //PUT THIS BACK IN? planeHelper.actionManager = new BABYLON.ActionManager(scene);

      //fire up a scene event handler (onPointerObservable) that will detect and fire callback event when pointer moved.
      //assign it to a reference so it can be removed upon mouse/touch-up
      //this is what moves the vertices when dragging.
      //this observer is meant to observe mouse movement over the "helper plane" to get dragging coordinates.
      observer2 = scene.onPointerObservable.add(function(pointerInfo) {

        function difPoint(curPoint, prevPoint) {
          let retPoint = {};

          retPoint.x = curPoint.x - prevPoint.x;
          retPoint.y = curPoint.y - prevPoint.y;
          retPoint.z = curPoint.z - prevPoint.z;

          return retPoint;
        }

        //this is needed to return position via scene.pick
        var predicatePlaneHelper = function(mesh) {
          if (mesh === planeHelper)
            return true;
          return false;
        }
        let pickedPoint = scene.pick(scene.pointerX, scene.pointerY, predicatePlaneHelper).pickedPoint;

        console.log("pickedPoint", pickedPoint)
        console.log("prevPickedPoint", prevPickedPoint)

        let distToMove = difPoint(pickedPoint, prevPickedPoint);

        prevPickedPoint = pickedPoint;

        // let constraints = {x: 30, y: 30, z: 30}
        let threshMid = 12.5
        box01.updateMeshPositions(function() {
          let checkPos = (vertices[vertsToMove[0]] + distToMove[indPickedPoint]) * normalCoef

          if (checkPos >= 2.5 && checkPos <= 25) {
            for (let ind of vertsToMove) {
              vertices[ind] += distToMove[indPickedPoint];
            }
          } else {
            //do this to avoid "stuttering" motion when near threshold values
            if (checkPos > threshMid) {
              for (let ind of vertsToMove) {
                vertices[ind] = 25 * normalCoef
              }
            } else {
              for (let ind of vertsToMove) {
                vertices[ind] = 2.5 * normalCoef
              }
            }
          }

        });
        box01.refreshBoundingInfo();
        box01.updateVerticesData(BABYLON.VertexBuffer.PositionKind, vertices);
      }) //end observer2
    })); //end pickable box action defenition
  return scene;
};


// Now, call the createScene function that you just finished creating
var scene = createScene();

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function() {
  // console.log(engine.getFps())
  scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function() {
  engine.resize();
});
