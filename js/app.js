/**
  * The Location object type contains methods and attributes
  * employed by the ViewModel object to manage locations for output.
  * @param {object} locationData - A data object containing a name, phone,
  * 	type and position (lat/lng) field.
*/
var Location = function(locationData) {
	// Create a pointer to this which we can use later.
	var self = this;
	// Set some default observables.
	this.isHidden = ko.observable(false);
	this.isSelected = ko.observable(false);
	// The name, phone, type and position must come form the Model.
	this.name = ko.observable(locationData.name);
	this.phone = ko.observable(locationData.phone);
	this.type = ko.observable(locationData.type);
	this.position = locationData.position;
	// Note the center of the map object and create a marker for this location.
	this.parentMapOriginalCenter = mapObject.getCenter();
	this.marker = new google.maps.Marker({
		position: locationData.position,
		map: mapObject,
		title: locationData.name,
		koObject: self
	});
	// Add a listener on the map marker to respond to clicks.
	google.maps.event.addListener(self.marker, 'click', function() {
		viewModel.changeLocation(this.koObject);
	});
	// Yelp data will be provided based on a JSONP request using the
	// business phone number.
	this.yelpImgSrc = ko.observable('');
	this.yelpAltText = ko.observable('');
	this.yelpReviewText = ko.observable('');
	this.yelpReviewCount = ko.observable('');
	this.yelpReviewUrl = ko.observable('');
	this.hasYelp = ko.computed(function() {
		return self.yelpImgSrc().length > 0;
	});
	// Determine if we have what appears to be a valid ten digit telephone number.
	if (self.phone().length === 10 && !isNaN(self.phone())) {
		// Use an AJAX JSONP call to get the Yelp data.
		$.ajax({
			url: 'http://api.yelp.com/phone_search',
			type: 'GET',
			dataType: 'jsonp',
			data: {
				phone: self.phone(),
				ywsid: 'xuFaz9OB2ls4CoiJXqqqCA'
			}
		})
		.done(function(data) {
			try {
				var businessFound = false;
				if (data.message.code == 0) {
					// There may be more than one business. Loop on them and match the name.
					for (var i = 0; i < data.businesses.length; i++) {
						if (data.businesses[i].name.toLowerCase() === self.name().toLowerCase()) {
							self.yelpImgSrc(data.businesses[i].rating_img_url_small);
							self.yelpAltText('Yelp ' + data.businesses[i].avg_rating + ' star rating image.');
							self.yelpReviewCount(data.businesses[i].review_count);
							self.yelpReviewUrl(data.businesses[i].url);
							if (data.businesses[i].reviews.length > 0) {
								self.yelpReviewText(data.businesses[i].reviews[0].text_excerpt);
							}
							businessFound = true;
							break;
						}
					}
					if (businessFound === false) {
						self.doYelpError();
					}
				} else {
					self.doYelpError();
				}
			}
			catch (ex) {
				self.doYelpError();
			}
		})
		.fail(function() {
			self.doYelpError();
		});
	}

	/**
	  * This function provides a common place to set the error text during any Yelp
	  * AJAX failure.
	  *
	  * @return {void}
	*/
	this.doYelpError = function() {
		viewModel.setErrorMessage('An error occurred while retrieving Yelp data.');
	};

	/**
	  *	This function receives click events for individual map markers. It
	  * will toggle the animation and selected properties of the marker and
	  * refocus the map on the marker.
	  * @param {boolean} forceDisable - An indicator of whether the marker should be forced to disable.
	  * @return {boolean} - Always true so the default click action will proceed.
	*/
	this.doClick = function(forceDisable) {
		if (self.marker.getAnimation() != null || forceDisable === true) {
			self.marker.setAnimation(null);
			self.isSelected(false);
			mapObject.setZoom(15);
			mapObject.setCenter(self.parentMapOriginalCenter);
  		} else {
    		self.marker.setAnimation(google.maps.Animation.BOUNCE);
    		self.isSelected(true);
			mapObject.setZoom(16);
			mapObject.setCenter(self.position);
		}
		return true;
	};
};

/**
  *	This function object is the KO ViewModel.
*/
var ViewModel = function(){
	// Create a pointer to this which we can use later.
	var	self = this;

	// Create and load an observable array of our locatons.
	this.locationList = ko.observableArray([]);
	Restaurants.forEach(function(locationItem) {
		self.locationList.push(new Location(locationItem));
	});
	// Set the default current location.
	this.currentLocation = ko.observable(self.locationList()[0]);

	// Create an observable for error messages.
	this.errorMessage = ko.observable('');

	/**
	  *	This accessor sets the error message.
	  * @param {string} errorMessage - The text of an error message to be shown to the user.
	*/
	this.setErrorMessage = function(errorMessage) {
		self.errorMessage(errorMessage);
	};

	/**
	  *	This KO Computed watches for the presence of an error message.
	*/
	this.noError = ko.computed(function() {
		return self.errorMessage().length <= 0;
	});


	/**
	  *	This function is invoked by KO when a keyup event occurs on the search input element.
	  * @param {object} data - The current data item.
	  * @param {object} event - The event data.
	  * @return {boolean} - Always true so the default action will proceed. Without this,
	  * 	the search bar will never show the typed text.
	*/
	this.doSearch = function(data, event) {
		var itemName;
		var itemType;
		// Get the current search term in lower case.
		var searchTarget = event.target.value.toLowerCase();
		// Loop on the locations.
		for (var i = 0; i < self.locationList().length; i++) {
			// Get the current location's name and type.
			itemName = self.locationList()[i].name().toLowerCase();
			itemType = self.locationList()[i].type().toLowerCase();
			// Check for the presence of the search term in the name or type values.
			if (itemName.indexOf(searchTarget) > -1 || itemType.indexOf(searchTarget) > -1) {
				// The item matches the search
				self.locationList()[i].isHidden(false);
			} else {
				// The item does not match the search.
				self.locationList()[i].isHidden(true);
				// If the iterm is currently selected, deselect it.
				if (self.locationList()[i].isSelected() === true) {
					self.locationList()[i].doClick(true);
				}
			}
		}
		return true;
	};

	/**
	  *	This function is invoked by KO when a click event occurs on a list item.
	  * @param {object} locationObject - The current location.
	  * @return {boolean} - Always true so the default action will proceed.
	*/
	this.changeLocation = function(locationObject) {
		// Determine if the clicked location is the current location.
		if (self.currentLocation() != locationObject) {
			// Deselect any current locations.
			if (self.currentLocation() != null) {
				self.currentLocation().doClick(true);
			}
			// Set the new current location.
			self.currentLocation(locationObject);
		}
		// Invoke the doClick function on the current location.
		self.currentLocation().doClick();
		return true;
	}
}

// Create global scope variables to hold the ViewModel and Google Map.
var viewModel;
var mapObject;

// Use the jQuery DOM ready function to set up the map and View Model.
$(function() {
	// Set up the map options
	var mapOptions = {
		center: {lat: 29.5978467, lng: -95.6099158},
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.HYBRID
	};
	// Instantiate the map
	mapObject = new google.maps.Map(
		document.getElementById('map-canvas'),
		mapOptions
	);
	// Instantiate the ViewModel.
	viewModel = new ViewModel();
	// Apply KO to the View Model
	ko.applyBindings(viewModel);
});
