$(document).ready(() => {

	$("#use-location-btn").click(getLocation);

});


function getLocation () {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition((pos) => {
			window.location = `/?lat=${pos.coords.latitude}&long=${pos.coords.longitude}`;
		})
	}
}