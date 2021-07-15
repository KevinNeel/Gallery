var loadFile = function(event) {
	var image = document.getElementById('output');
	image.src = URL.createObjectURL(event.target.files[0]);
};

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
}

// function checkLength(){
// var description = document.getElementById('description').value;

// if(description.length > 150){
// 	alert("Only 150 lines are allowed")
// 	console.log('working')
// }

// }
