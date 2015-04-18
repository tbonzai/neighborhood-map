
var Restaurant = function(data) {
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
		ViewModel.changeRestaurant(this.koObject);
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

	restaurantList: ko.observableArray([]),

	currentRestaurant: ko.observable(null),

	init: function() {
		Restaurants.forEach(function(restaurantItem) {
			ViewModel.restaurantList.push(new Restaurant(restaurantItem));
		});
		currentRestaurant: ko.observable(ViewModel.restaurantList()[0]);
	},

	changeRestaurant: function(restaurantObject) {
		if (ViewModel.currentRestaurant() != restaurantObject) {
			if (ViewModel.currentRestaurant() != null) {
				ViewModel.currentRestaurant().disableAnimation();
			}
			ViewModel.currentRestaurant(restaurantObject);
		}
		ViewModel.currentRestaurant().doClick();
	}
}

var ViewModel_dodo = function() {
	var self = this;

	this.restaurantList = ko.observableArray([]);

	this.test = function() {
		return 'Test Complete';
	};

	Restaurants.forEach(function(restaurantItem) {
		self.restaurantList.push(new Restaurant(restaurantItem));
	});

	this.currentRestaurant = ko.observable(this.restaurantList()[0]);

	this.changeRestaurant = function(restaurantObject) {
		if (self.currentRestaurant() != restaurantObject) {
			self.currentRestaurant().disableAnimation();
			self.currentRestaurant(restaurantObject);
		}
		self.currentRestaurant().doClick();
	}
}
//ko.applyBindings(new ViewModel());