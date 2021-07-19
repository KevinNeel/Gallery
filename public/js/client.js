var loadFile = function(event) {
	var image = document.getElementById('output');
	image.src = URL.createObjectURL(event.target.files[0]);
};



// function checkLength(){
// var description = document.getElementById('description').value;

// if(description.length > 150){
// 	alert("Only 150 lines are allowed")
// 	console.log('working')
// }

// }
