
var Location = function(data) {
	var self = this;

	this.visible = ko.observable(true);
	this.isSelected = ko.observable(false);
	this.name = ko.observable(data.name);
	this.title = ko.observable(data.title);
	this.phone = ko.observable(data.phone);
	this.type = ko.observable(data.type);
	this.position = ko.observable(data.position);
	this.parentMap = map;
	this.parentMapOriginalCenter = map.getCenter();
	this.marker = new google.maps.Marker({
		position: data.position,
		map: this.parentMap,
		title: data.title,
		koObject: this
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

	init: function() {
		Restaurants.forEach(function(locationItem	) {
			ViewModel.locationList.push(new Location(locationItem));
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