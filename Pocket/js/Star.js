
//Star CLASS
function Star(_pos, _data){
	
	this.data = _data;
	if(this.data.sum==1)
		this.color = new THREE.Color(0xdb355b);
	else
		this.color = new THREE.Color(0x353fdb);

	this.mat = new THREE.MeshPhongMaterial( { color: this.color, shininess: 60 } );
	this.body = new THREE.Mesh( starGeo.clone(), this.mat );
	this.body.position.copy( _pos );
	this.body.name = "star " + this.data.index;
	scene.add(this.body);
}

// Star.prototype.update = function(){
	
// };

