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

var myStartX = 5, myStartY = 0, myStartZ = 13.5;
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
		renderer.setClearColor(0xc4fff5, 1);
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
		hemiLight = new THREE.HemisphereLight( 0xf9ff91, 0x3ac5b9, 0);
		scene.add(hemiLight);


	// CAMERA
		camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 10000);
		camera.position.z -= 0.6;

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

function update()
{	

	TWEEN.update();
	controls.update( Date.now() - time );
	// controls.update();

	var dt = clock.getDelta();


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
