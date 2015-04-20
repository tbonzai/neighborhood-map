
var Location = function(data, mapObject) {
	var self = this;

	this.visible = ko.observable(true);
	this.isSelected = ko.observable(false);
	this.name = ko.observable(data.name);
	this.title = ko.observable(data.title);
	this.phone = ko.observable(data.phone);
	this.type = ko.observable(data.type);
	this.position = ko.observable(data.position);
	this.parentMap = mapObject;
	this.parentMapOriginalCenter = mapObject.getCenter();
	this.marker = new google.maps.Marker({
		position: data.position,
		map: this.parentMap,
		title: data.title,
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
			console.log(e);
		},
		success: function(data) {
			console.log('success');
			console.log(data);
		}
	})
	.done(function() {
		console.log("done");
	})
	.fail(function() {
		console.log("fail");
	})
	.always(function() {
		console.log("always");
	});


	google.maps.event.addListener(this.marker, 'click', function() {
		ViewModel.changeLocation(this.koObject);
	});

	this.doClick = function(forceDisable) {
		if (self.marker.getAnimation() != null || forceDisable) {
			self.marker.setAnimation(null);
			self.isSelected(false);
			self.parentMap.setZoom(15);
			self.parentMap.setCenter(self.parentMapOriginalCenter);
  		} else {
    		self.marker.setAnimation(google.maps.Animation.BOUNCE);
    		self.isSelected(true);
			self.parentMap.setZoom(16);
			self.parentMap.setCenter(self.position());
		}
	};

	this.showName = function() {
		return this.name();
	};
};

var ViewModel = {
	self: this,

	locationList: ko.observableArray([]),

	currentLocation: ko.observable(null),

	init: function(mapObject) {
		Restaurants.forEach(function(locationItem) {
			ViewModel.locationList.push(new Location(locationItem, mapObject));
		});
		currentLocation: ko.observable(ViewModel.locationList()[0]);
	},

	changeLocation: function(locationObject) {
		if (ViewModel.currentLocation() != locationObject) {
			if (ViewModel.currentLocation() != null) {
				ViewModel.currentLocation().doClick(true);
			}
			ViewModel.currentLocation(locationObject);
		}
		ViewModel.currentLocation().doClick();
	}
}

$(function() {
	var mapOptions = {
		center: {lat: 29.5978467, lng: -95.6099158},
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.HYBRID
	};
	var mapObject = new google.maps.Map(
		document.getElementById('map-canvas'),
		mapOptions
	);
	ko.applyBindings(ViewModel);
	ViewModel.init(mapObject);
});
