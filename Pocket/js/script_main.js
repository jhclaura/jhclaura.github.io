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
			for(var i=0; i<staffMats.length; i++){
				var staff = new AniObject( 0.5,
									  staffKeyframeSet,
									  staffAniOffsetSet,
									  staffGeo,
									  staffMats[i],
									  new THREE.Vector3(i,-2.5,7),
									  0.1 );
				staffs.push(staff);
				scene.add(staff.body);
				staffIsWalkings.push(false);
				if(i==5){
					setTimeout(function(){
						staffLoaded = true;
					},2000);
				}
			}
		};
		textureLoader = new THREE.TextureLoader(loadingManger);	
		loader = new THREE.JSONLoader(loadingManger);

		//v.1
		// loader.load("models/pocket3.js", function(geometry){
		// 	var p_m = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({color:0xffffff}) );
		// 	// p_m.scale.set(2,2,2);
		// 	scene.add(p_m);
		// });
		var pocketMat_w = new THREE.MeshLambertMaterial({color:0xffffff});
		var pocketMat_y = new THREE.MeshLambertMaterial({color:0xffff00});
		var pocketMat_b = new THREE.MeshLambertMaterial({color:0x00ffff});
		var pocketMat_r = new THREE.MeshLambertMaterial({color:0xff9933});
		var pocketMat_g = new THREE.MeshLambertMaterial({color:0xff99cd});
		pocketBase = new THREE.Object3D();
		pocketTop = new THREE.Object3D();
		pocketFrame1 = new THREE.Object3D();
		pocketFrame2 = new THREE.Object3D();
		pocketPics = new THREE.Object3D();

		loader.load("models/pockets/base.js", function(g_0){
			pocketBase = new THREE.Mesh( g_0, pocketMat_w );

			loader.load("models/pockets/base_2.js", function(g_1){
				var p_m = new THREE.Mesh( g_1, pocketMat_b );
				pocketBase.add(p_m);

				loader.load("models/pockets/base_1.js", function(g_2){
					var p_m = new THREE.Mesh( g_2, pocketMat_y );
					pocketBase.add(p_m);

					scene.add(pocketBase);
				});
			});
		});

		var tempTexture = textureLoader.load('images/bb.jpg');

		loader.load("models/pockets/top.js", function(g_0){
			pocketTop = new THREE.Mesh( g_0, pocketMat_w );

			loader.load("models/pockets/top_1.js", function(g_1){
				var p_m = new THREE.Mesh( g_1, pocketMat_b );
				pocketTop.add(p_m);

				loader.load("models/pockets/top_2.js", function(g_2){
					var p_m = new THREE.Mesh( g_2, pocketMat_y );
					pocketTop.add(p_m);

					loader.load("models/pockets/top_3.js", function(g_3){
						var p_m = new THREE.Mesh( g_3, pocketMat_r );
						pocketTop.add(p_m);

						loader.load("models/pockets/top_4.js", function(g_4){
							var p_m = new THREE.Mesh( g_4, pocketMat_g );
							pocketTop.add(p_m);

							loader.load("models/pockets/top_5.js", function(g_5){
								var p_m = new THREE.Mesh( g_5, pocketMat_y );
								pocketTop.add(p_m);
								

								loader.load("models/pockets/frame_1.js", function(g_6){
									var frame1 = new THREE.Mesh( g_6, pocketMat_w );

									loader.load("models/pockets/frame_2.js", function(g_6){
										var frame2 = new THREE.Mesh( g_6, pocketMat_w );
										frame2.rotation.x = Math.PI;
										frame2.position.set(0,-1,10.5);
										frame1.add(frame2);

										loader.load("models/pockets/pic_frame_2.js", function(g_7){
											var picFrame = new THREE.Mesh( g_7, new THREE.MeshLambertMaterial({map:tempTexture}) );
											picFrame.position.set(-0.5,-1,0.2);
											picFrame.scale.y = 0.02;
											frame1.add(picFrame);

											frame1.position.set(0,13.5,0);
											frame1.rotation.x = Math.PI/2;

											pocketTop.add(frame1);

											pocketTop.rotation.x = Math.PI/2;
											scene.add(pocketTop);
										});
										
									});
								});								
							});
						});
					});
				});
			});
		});

		// LIGHT
			lamp = new THREE.Object3D();
			light = new THREE.PointLight(0xffff00, 0.5, 15);
			lamp.add(light);
			lamp.position.set(0,15,5);
			scene.add(lamp);

		//TERRAIN
			terrainMat = new THREE.MeshBasicMaterial( {color: 0xc9c9f0} );
			loader.load("models/terrain.js", function(geometry){
				terrain = new THREE.Mesh(geometry, terrainMat);
				scene.add(terrain);
				// terrain.position.y = -5;
			});

		for(var i=0; i<staffImages.length; i++){
			textureLoader.load(staffImages[i], function(texture){
				staffTextures.push(texture);
				var staffMat = new THREE.MeshLambertMaterial({map: texture, morphTargets: true, side: THREE.DoubleSide});
				staffMats.push(staffMat);
			});
		}
		loader.load("models/staff4.js", function(geometry){
			staffGeo = geometry;			
		});

		var cloudGeo = new THREE.PlaneGeometry(4,4,1,1);
		var cloudTextureA = textureLoader.load('images/cloudA.png');
		var cloudMaterialA = new THREE.MeshBasicMaterial({map: cloudTextureA, transparent: true, opacity: 1, side: THREE.DoubleSide});
		var cloudTextureB = textureLoader.load('images/cloudB.png');
		var cloudMaterialB = new THREE.MeshBasicMaterial({map: cloudTextureB, transparent: true, opacity: 1, side: THREE.DoubleSide});

		//Cloud
		for(var i=0; i<30; i++){
			clouds[i] = new THREE.Mesh(cloudGeo, cloudMaterialA);
			clouds[i].position.x = Math.random()*100-40;
			clouds[i].position.z = Math.random()*100-40;
			clouds[i].position.y = Math.random()*20+21;
			clouds[i].rotation.x = Math.PI/2;
			clouds[i].rotation.y = -Math.PI;

			scene.add(clouds[i]);

			clouds[i+30] = new THREE.Mesh(cloudGeo, cloudMaterialB);
			clouds[i+30].position.x = Math.random()*100-40;
			clouds[i+30].position.z = Math.random()*100-40;
			clouds[i+30].position.y = Math.random()*20+21;
			clouds[i+30].rotation.x = Math.PI/2;
			clouds[i+30].rotation.y = -Math.PI;

			scene.add(clouds[i+30]);
		}
		

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

	if(staffLoaded){
		for(var i=0; i<staffs.length; i++){
			if(staffs[i].body) {
				staffs[i].update(null);
			}
		}
		RandomWalking();
	}
	//CLOUDS
	for(var i=0; i<clouds.length; i++){
		clouds[i].position.x += Math.random()*0.01 + 0.01;
		clouds[i].position.z += Math.random()*0.01 + 0.01;

		if(clouds[i].position.x > 100)
			clouds[i].position.x = -100;

		if(clouds[i].position.z > 100)
			clouds[i].position.z = -100;
	}

	//
	time = Date.now();
}

function RandomWalking() {

	for(var i=0; i<staffs.length; i++){

		if( !staffIsWalkings[i] ){

			var randomDestination = new THREE.Vector3(Math.random()*10-5, -2.5, 7+Math.random()*10-5);
			var oldPos = staffs[i].body.position;
			var tDist = oldPos.distanceTo(randomDestination);

			// rotation!
				var cc = new THREE.Vector2( randomDestination.x - oldPos.x, randomDestination.z - oldPos.z );
				var dd = new THREE.Vector2( 0, 1 );

				var angleDesToMe = Math.acos( cc.dot(dd)/cc.length() ) * 180 / Math.PI;
				if(cc.x<0){
					angleDesToMe *= -1;
					angleDesToMe += 360;
				}

			new TWEEN.Tween(staffs[i].body.position).to({x: randomDestination.x, z: randomDestination.z}, tDist*200).start();
			new TWEEN.Tween(staffs[i].body.rotation).to({y: angleDesToMe*Math.PI/180}, 500).easing( TWEEN.Easing.Back.In).start();

			staffIsWalkings[i] = true;

			ResetWalkingStatus( i, tDist*160+2500 );
		}
	}
}

function ResetWalkingStatus(index, time) {
	setTimeout(function(){
		staffIsWalkings[index] = false;
	}, time);
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
