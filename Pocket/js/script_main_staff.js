////////////////////////////////////////////////////////////	
// SET_UP_VARIABLES
////////////////////////////////////////////////////////////

var scene, camera, container, renderer, effect, stats;
var vrmanager;
var hemiLight, controls;
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var time, clock;

var loadedCount = 0;

var myStartX = 0, myStartY = 0, myStartZ = 30;
var myPosition;

var textureLoader, loader, loadingManger;
var keyIsPressed;
var myWorldCenter = new THREE.Vector3();

var staff, staffGeo, staffLoaded = false, staffs=[], staffTextures=[], staffMats = [], staffIsWalkings=[];
var staffImages = ["images/staffs/1.png","images/staffs/2.png","images/staffs/3.png",
				   "images/staffs/4.png","images/staffs/5.png","images/staffs/6.png"];
var staffKeyframeSet = [ 34 ];
var staffAniOffsetSet = [ 1 ];

var clouds = [];
var glowTexture, lamp;
var pocketBase, pocketTop, pocketFrame1, pocketFrame2, pocketPics;

var woodMat, jarMat, bottleMat, bottleLidMat;
var jarsAmount=14, jarTextures=[];
var furnitures=[], jarsss=[], bottlesss=[], lidsss=[], jars=[];
var headLight, lightTarget;

var flyLights=[], lightColors = [0xff0040,0x0040ff,0x00ffaa,0xffaa00];

var dummyEye, EyeColor;
var starGeo, starMat, stars=[];
var time = Math.PI/2;
var frequency = 0.01;
var amplitude = 1;
var offset = 0;
var spin;
var tanWave = new TanWave(time, frequency*5, amplitude, offset);
var sinWave = new SinWave(time, frequency*5, amplitude/50, offset);

////////////////////////////////////////////////////////////

init();

///////////////////////////////////////////////////////////
// FUNCTIONS 
///////////////////////////////////////////////////////////
function init(){

	//Prevent scrolling for Mobile
	noScrolling = function(event){
		event.preventDefault();
	};
	document.body.addEventListener('touchmove', noScrolling, false);


	time = Date.now();

	// THREE.JS -------------------------------------------
		clock = new THREE.Clock();

	// RENDERER
		container = document.getElementById('render-canvas');
		renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setClearColor(0x000000, 1);
		container.appendChild(renderer.domElement);

	// VR_EFFECT
		effect = new THREE.VREffect(renderer);
		effect.setSize(window.innerWidth, window.innerHeight);

	// Create a VR manager helper to enter and exit VR mode.
		var params = {
		  hideButton: false, // Default: false.
		  isUndistorted: false // Default: false.
		};
		vrmanager = new WebVRManager(renderer, effect, params);

	// SCENE
		scene = new THREE.Scene();

	// LIGHT
		// hemiLight = new THREE.HemisphereLight( 0xf9ff91, 0x3ac5b9, 0);
		// scene.add(hemiLight);
		headLight = new THREE.SpotLight( 0xf9ff91 );
		headLight.penumbra = 0.4;
		headLight.angle = 0.45;
		headLight.distance = 150;
		// headLight.position.set( myStartX, myStartY+1, myStartZ );
		scene.add( headLight );
		// lightTarget = new THREE.Mesh( new THREE.SphereGeometry(1), new THREE.MeshBasicMaterial({color:0xff0000}) );
		lightTarget = new THREE.Object3D();
		scene.add( lightTarget );
		headLight.target = lightTarget;

		//FLYING_LIGHT
		light = new THREE.PointLight(0xff0040, 1, 50);
		flyLights.push(light);
		scene.add(light);
		light = new THREE.PointLight(0x0040ff, 1, 50);
		flyLights.push(light);
		scene.add(light);
		light = new THREE.PointLight(0x00ffaa, 1, 50);
		flyLights.push(light);
		scene.add(light);
		light = new THREE.PointLight(0xffaa00, 1, 50);
		flyLights.push(light);
		scene.add(light);

		for(var i=0; i<lightColors.length; i++){
			light = new THREE.PointLight(lightColors[i], 1, 50);
			light.position.x = Math.sin(0.5/4*(i+1))*20;
			light.position.y = Math.cos(0.3/4*(i+1))*50;
			light.position.z = Math.sin(0.3/4*(i+1))*10;

			flyLights.push(light);
			scene.add(light);
		}

	// CAMERA
		camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 10000);
		camera.position.z -= 0.6;

	// RAYCASTER!
		eyerayCaster = new THREE.Raycaster();
		dummyEye = new THREE.Mesh(new THREE.SphereGeometry(1),  new THREE.MeshBasicMaterial({color: 0xff0000}));
		dummyEye.scale.set(0.1,0.1,0.1);
		scene.add(dummyEye);
		EyeColor = new THREE.Color( 0x0000ff );

	// CONTROLS
		controls = new THREE.DeviceControls(camera, myWorldCenter, true);
		scene.add( controls.getObject() );

	// OBJECTS
		loadingManger = new THREE.LoadingManager();
		loadingManger.onLoad = function () {
			//
		};
		textureLoader = new THREE.TextureLoader(loadingManger);	
		loader = new THREE.JSONLoader(loadingManger);

		// JAR
		var texture = textureLoader.load('images/wood.png');
		woodMat = new THREE.MeshLambertMaterial({map: texture});

		texture = textureLoader.load('images/jar2.png');
		jarMat = new THREE.MeshLambertMaterial({map: texture, transparent: true, alphaTest: 0});

		texture = textureLoader.load('images/bottle.png');
		bottleMat = new THREE.MeshLambertMaterial({color: 0xffff00, wireframe: true});

		bottleLidMat = new THREE.MeshLambertMaterial({color: 0x523530});

		loadModelSpecimen("models/pockets/shelves.js", "models/pockets/jars.js", "models/pockets/bottles.js", "models/pockets/bottleLids.js", woodMat, jarMat, bottleMat, bottleLidMat);

	// BANNER
		var whiteMat = new THREE.MeshLambertMaterial( {color: 0xffffff} );
		loader.load("models/pockets/banner.js", function(geometry){
			var banner = new THREE.Mesh(geometry, whiteMat);
			light = new THREE.PointLight(0xffff00, 0.5, 15);
			light.position.z = 5;
			banner.add(light);

			loader.load("models/pockets/banner_feedback.js", function(geometryB){
				var bannerF = new THREE.Mesh(geometryB, whiteMat);
				bannerF.position.y = -3;
				banner.add(bannerF);

				banner.scale.set(3,3,3);
				banner.position.set(0,50,-30);
				scene.add(banner);
			});
		});

	// STARS
		loader.load("models/star.js", function(geometry){
			starGeo = geometry;

			var starData = {
								sum: 1,
								survey: {
									speed: 3,
									service: 5,
									clean: 5,
									product: 5
								},
								feedback: "Good smile!",
								index: 0
							};
			var starrr = new Star( new THREE.Vector3(5,0,0), starData);
			stars.push(starrr);
		});

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '5px';
	stats.domElement.style.zIndex = 100;
	stats.domElement.children[ 0 ].style.background = "transparent";
	stats.domElement.children[ 0 ].children[1].style.display = "none";
	container.appendChild( stats.domElement );

	// EVENTS
	window.addEventListener('resize', onWindowResize, false);
	window.addEventListener('vrdisplaypresentchange', onWindowResize, true);
	// window.addEventListener('click', startSpeech, false);

	clock.start();

	animate(performance ? performance.now() : Date.now());
}

function loadModelSpecimen (model1, model2, model5, model6, mat1, mat2, mat5, mat6) {
	var furnitures = [], jarsss = [], specimenA = [], specimenB = [], bottlesss = [], lidsss = [];

	var loader = new THREE.JSONLoader();
	loader.load(model1, function(geometry){
		for(var i=0; i<2; i++){
			var generalMesh = new THREE.Mesh(geometry, mat1);
			// generalMesh.scale.set( i+1, i+1, i+1 );
			// generalMesh.position.y = i+1-5;
			// generalMesh.rotation.y = i*Math.PI/3;
			generalMesh.scale.set( i+1, i+1, i+1 );
			generalMesh.position.x = i*10;
			generalMesh.position.z = i*-40;
			 generalMesh.position.y = i*20;
			scene.add(generalMesh);
			furnitures.push(generalMesh);
		}
	});

	loader.load(model2, function(geometry){
		// for(var i=0; i<3; i++){
			var generalMesh = new THREE.Mesh(geometry, mat2);
			// generalMesh.scale.set( i+1, i+1, i+1 );
			// generalMesh.position.y = i+1-5;
			// generalMesh.rotation.y = i*Math.PI/3;
			scene.add(generalMesh);
			jarsss.push(generalMesh);
		// }
	});

	loader.load(model5, function(geometry){
		// for(var i=0; i<3; i++){
			var generalMesh = new THREE.Mesh(geometry, mat5);
			// generalMesh.scale.set( i+1, i+1, i+1 );
			// generalMesh.position.y = i+1-5;
			// generalMesh.rotation.y = i*Math.PI/3;
			scene.add(generalMesh);
			bottlesss.push(generalMesh);
		// }
	});

	loader.load(model6, function(geometry){
		// for(var i=0; i<3; i++){
			var generalMesh = new THREE.Mesh(geometry, mat6);
			// generalMesh.scale.set( i+1, i+1, i+1 );
			// generalMesh.position.y = i+1-5;
			// generalMesh.rotation.y = i*Math.PI/3;
			scene.add(generalMesh);
			lidsss.push(generalMesh);
		// }
	});
}

function loadModelJar2 (model, meshMat) {

	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry){
		for(var i=0; i<3; i++){
			var generalMesh = new THREE.Mesh(geometry, meshMat);
			generalMesh.scale.set( i+1, i+1, i+1 );
			generalMesh.position.y = i+1-5;
			generalMesh.rotation.y = i*Math.PI/3;
			scene.add(generalMesh);
			jars.push(generalMesh);
		}
	});
}

// v.2
// Request animation frame loop function
var lastRender = 0;

function animate(timestamp) {
	var delta = Math.min(timestamp - lastRender, 500);
	lastRender = timestamp;

	update();
	
	// Render the scene through the manager.
	vrmanager.render(scene, camera, timestamp);
	stats.update();

	requestAnimationFrame(animate);
}

var timeElapsed;
var lookingAtStar;
function update()
{	

	TWEEN.update();
	controls.update( Date.now() - time );
	// controls.update();

	var dt = clock.getDelta();
	timeElapsed = clock.getElapsedTime();

	var camPos = controls.position();
	var camDir = controls.getDirection();
	headLight.position.copy( camPos );
	var v1 = new THREE.Vector3();
	var v2 = new THREE.Vector3();
	v2.copy( camPos );
	v1.copy( camDir );
	v2.add( v1.multiplyScalar( 10 ) );
	lightTarget.position.copy( v2 );

	for(var i=0; i<flyLights.length; i++){
		flyLights[i].position.x = Math.sin(timeElapsed*0.5/4*(i+1))*20;
		flyLights[i].position.y = Math.cos(timeElapsed*0.3/4*(i+1))*50;
		flyLights[i].position.z = Math.sin(timeElapsed*0.3/4*(i+1))*10;
	}

	spin = 0.05*tanWave.run();
	for(var i=0; i<stars.length; i++){
		if(lookingAtStar==i){
			// stars[i].body.rotation.y = spin;
			stars[i].body.rotation.z = spin;
		}
	}

	// eyeRay!
		var directionCam = controls.getDirection(1).clone();
		eyerayCaster.set( controls.position().clone(), directionCam );
		eyeIntersects = eyerayCaster.intersectObjects( scene.children, true );
		//console.log(intersects);

		if( eyeIntersects.length > 1 ){
			var iName = eyeIntersects[ 1 ].object.name;
			iName = iName.split(" ");
			// console.log(iName);
			// eyeIntersects[ 0 ].object.material.color.copy(EyeColor);
			// console.log(eyeIntersects[ 0 ].object);

			if(iName.length==2){
				lookingAtStar = iName[1];
			} else {
				lookingAtStar = -1;
			}

			// var vector = new THREE.Vector3();
			// // v1
			// // vector.setFromMatrixPosition( eyeIntersects[ 0 ].object.matrixWorld );

			// // v2
			// vector.copy( eyeIntersects[ 1 ].point );
			// dummyEye.position.copy( vector );
		}

	//
	time = Date.now();
}

function fullscreen() {
	if (container.requestFullscreen) {
		container.requestFullscreen();
	} else if (container.msRequestFullscreen) {
		container.msRequestFullscreen();
	} else if (container.mozRequestFullScreen) {
		container.mozRequestFullScreen();
	} else if (container.webkitRequestFullscreen) {
		container.webkitRequestFullscreen();
	}
}

function onWindowResize() {
	effect.setSize( window.innerWidth, window.innerHeight );
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}
