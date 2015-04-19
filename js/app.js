
var Location = function(data) {
	var self = this;

	this.visible = ko.observable(true);
	this.name = ko.observable(data.name);
	this.title = ko.observable(data.title);
	this.phone = ko.observable(data.phone);
	this.type = ko.observable(data.type);
	this.position = ko.observable(data.position);
	this.marker = new google.maps.Marker({
		position: data.position,
		map: map,
		title: data.title,
		koObject: this
	});

	google.maps.event.addListener(this.marker, 'click', function() {
		ViewModel.changeLocation(this.koObject);
	});

	this.doClick = function() {
		if (self.marker.getAnimation() != null) {
			self.marker.setAnimation(null);
			map.setZoom(15);
  		} else {
    		self.marker.setAnimation(google.maps.Animation.BOUNCE);
			map.setZoom(16);
		}
		map.setCenter(self.position());
	};

	this.disableAnimation = function() {
		if (self.marker.getAnimation() != null) {
			self.marker.setAnimation(null);
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

	init: function() {
		Restaurants.forEach(function(locationItem) {
			ViewModel.locationList.push(new Location(locationItem));
		});
		currentLocation: ko.observable(ViewModel.locationList()[0]);
	},

	changeLocation: function(locationObject) {
		if (ViewModel.currentLocation() != locationObject) {
			if (ViewModel.currentLocation() != null) {
				ViewModel.currentLocation().disableAnimation();
			}
			ViewModel.currentLocation(locationObject);
		}
		ViewModel.currentLocation().doClick();
	}
}

var ViewModel_dodo = function() {
	var self = this;

	this.locationList = ko.observableArray([]);

	this.test = function() {
		return 'Test Complete';
	};

	Restaurants.forEach(function(locationItem) {
		self.locationList.push(new Restaurant(locationItem));
	});

	this.currentLocation = ko.observable(this.locationList()[0]);

	this.changeLocation = function(locationObject) {
		if (self.currentLocation() != locationObject) {
			self.currentLocation().disableAnimation();
			self.currentLocation(locationObject);
		}
		self.currentLocation().doClick();
	}
}
//ko.applyBindings(new ViewModel());