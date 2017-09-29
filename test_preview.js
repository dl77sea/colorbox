// Get the canvas element from our HTML above
var canvas = document.getElementById("renderCanvas");

// Load the BABYLON 3D engine
var engine = new BABYLON.Engine(canvas, true);

// Now create a basic Babylon Scene object
var scene = new BABYLON.Scene(engine);

// Change the scene background color to green.
scene.clearColor = new BABYLON.Color3(0, 1, 0);

// ArcRotateCamera >> Camera turning around a 3D point (here Vector zero) with mouse and cursor keys
// Parameters : name, alpha, beta, radius, target, scene
var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 1, 120, new BABYLON.Vector3.Zero(), scene);
camera.setPosition(new BABYLON.Vector3(50, 50, -100));

// This attaches the camera to the canvas
camera.attachControl(canvas, false);

// This creates a light, aiming 0,1,0 - to the sky.
// var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(-50, 100, 0), scene);
var light = new BABYLON.PointLight("light", new BABYLON.Vector3(-25, 50, 0), scene);
light.intensity = 1.0;

light.parent = camera

var baseMat = new BABYLON.StandardMaterial("baseMat", scene);
baseMat.alpha = 1.0
baseMat.diffuseColor = new BABYLON.Color3(1.0, 1.0, 1.0); //this is a multiplier if using colorface

var colorFace1 = new BABYLON.Color4(1.0, 0.0, 0.0, 1.0);
var colorFace2 = new BABYLON.Color4(0.0, 1.0, 0.0, 1.0);
var colorFace3 = new BABYLON.Color4(0.0, 0.0, 1.0, 1.0);
var colorFace4 = new BABYLON.Color4(1.0, 0.0, 1.0, 1.0);
var colorFace5 = new BABYLON.Color4(1.0, 1.0, 0.0, 1.0);
var colorFace6 = new BABYLON.Color4(0.0, 1.0, 1.0, 1.0);

var boxOptions = {
  // size: number,
  width: 25,
  height: 25,
  depth: 25,
  // faceUV: Vector4[],
  faceColors: [colorFace1,colorFace2,colorFace3,colorFace4,colorFace5,colorFace6],
  // sideOrientation: number,
  // frontUVs: Vector4,
  // backUVs: Vector4,
  updatable: true
};

var box01 = BABYLON.MeshBuilder.CreateBox('box01', boxOptions, scene);
baseMat.emissiveColor = new BABYLON.Color3(.35, .35, .35);//ambientColor = new BABYLON.Color3(.25,.25,.25);
// scene.ambientColor = new BABYLON.Color3(1.0, 1.0, 1.0);
box01.material = baseMat;

box01.position.x = 0;
box01.position.y = 0;
box01.position.z = 0;

box01.rotation.x = 0;
box01.rotation.y = 0;
box01.rotation.z = 0;

engine.runRenderLoop(function() {
  // box01.rotation.x += .0025
  // box01.rotation.y += .0025
  // box01.rotation.z += .0025
  scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function() {
  engine.resize();
});
