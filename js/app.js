
var Location = function(locationData) {
	var self = this;

	this.visible = ko.observable(true);
	this.isSelected = ko.observable(false);
	this.name = ko.observable(locationData.name);
	this.title = ko.observable(locationData.title);
	this.phone = ko.observable(locationData.phone);
	this.type = ko.observable(locationData.type);
	this.position = locationData.position;
	this.parentMapOriginalCenter = mapObject.getCenter();
	this.marker = new google.maps.Marker({
		position: locationData.position,
		map: mapObject,
		title: locationData.title,
		koObject: this
	});
	this.yelpData = null;
	$.ajax({
		url: 'http://api.yelp.com/phone_search',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			phone: self.phone,
			ywsid: 'xuFaz9OB2ls4CoiJXqqqCA'
		},
		error: function(e){
			console.log('error');
		},
		success: function(data) {
//			console.log('success');
//			console.log(data);
		}
	})
	.done(function() {
//		console.log("done");
	})
	.fail(function() {
//		console.log("fail");
	})
	.always(function() {
//		console.log("always");
	});


	google.maps.event.addListener(self.marker, 'click', function() {
		ViewModel.changeLocation(this.koObject);
	});

	this.doClick = function(forceDisable) {
		if (self.marker.getAnimation() != null || forceDisable) {
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
	};

	this.showName = function() {
		return self.name();
	};
};

var ViewModelFunc = function(){

	var	self = this;

	this.errorExists = ko.observable(false);

	this.locationList = ko.observableArray([]);

	this.errorMessage = ko.observable(
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
			'<span aria-hidden="true">&times;</span>' +
		'</button>' +
		'<strong>Sorry!</strong> An issue occurred while trying to retrieve Yelp reviews.'
	);

	this.currentLocation = ko.observable(null);

	Restaurants.forEach(function(locationItem) {
		self.locationList.push(new Location(locationItem));
	});

	this.currentLocation = ko.observable(self.locationList()[0]);

	this.changeLocation = function(locationObject) {
		if (self.currentLocation() != locationObject) {
			if (self.currentLocation() != null) {
				self.currentLocation().doClick(true);
			}
			self.currentLocation(locationObject);
		}
		self.currentLocation().doClick();
	}
}

var ViewModel;
var mapObject;


$(function() {
	var mapOptions = {
		center: {lat: 29.5978467, lng: -95.6099158},
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.HYBRID
	};
	mapObject = new google.maps.Map(
		document.getElementById('map-canvas'),
		mapOptions
	);

	ViewModel = new ViewModelFunc();
	ko.applyBindings(ViewModel);
});
