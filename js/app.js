
var Location = function(locationData) {
	var self = this;

	this.isHidden = ko.observable(false);
	this.isSelected = ko.observable(false);
	this.name = ko.observable(locationData.name);
	this.yelpImgSrc = ko.observable('');
	this.yelpAltText = ko.observable('');
	this.yelpReviewText = ko.observable('');
	this.yelpReviewCount = ko.observable('');
	this.yelpReviewUrl = ko.observable('');
	this.hasYelp = ko.computed(function() {
		return self.yelpImgSrc().length > 0;
	});
	this.phone = ko.observable(locationData.phone);
	this.type = ko.observable(locationData.type);
	this.position = locationData.position;
	this.parentMapOriginalCenter = mapObject.getCenter();
	this.marker = new google.maps.Marker({
		position: locationData.position,
		map: mapObject,
		title: locationData.name,
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
		error: function(ex) {
			console.log('error')
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

	this.doYelpError = function() {
		ViewModel.setErrorMessage('An error occurred while retrieving Yelp data.');
	};

	google.maps.event.addListener(self.marker, 'click', function() {
		ViewModel.changeLocation(this.koObject);
	});

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

var ViewModelFunc = function(){

	var	self = this;

	this.locationList = ko.observableArray([]);

	this.errorMessage = ko.observable('');

	this.noError = ko.computed(function() {
		return self.errorMessage().length <= 0;
	});

	this.currentLocation = ko.observable(null);

	Restaurants.forEach(function(locationItem) {
		self.locationList.push(new Location(locationItem));
	});

	this.currentLocation = ko.observable(self.locationList()[0]);

	this.setErrorMessage = function(errorMessage) {
		self.errorMessage(errorMessage);
	};

	this.doSearch = function(x, z) {
		var searchTarget = z.target.value.toLowerCase();
		var itemTitle;
		var itemType;
		for (var i = 0; i < self.locationList().length; i++) {
			itemTitle = self.locationList()[i].name().toLowerCase();
			itemType = self.locationList()[i].type().toLowerCase();
			if (itemTitle.indexOf(searchTarget) > -1 || itemType.indexOf(searchTarget) > -1) {
				self.locationList()[i].isHidden(false);
			} else {
				self.locationList()[i].isHidden(true);
				if (self.locationList()[i].isSelected() === true) {
					self.locationList()[i].doClick(true);
				}
			}
		}
		return true;
	};

	this.changeLocation = function(locationObject) {
		if (self.currentLocation() != locationObject) {
			if (self.currentLocation() != null) {
				self.currentLocation().doClick(true);
			}
			self.currentLocation(locationObject);
		}
		self.currentLocation().doClick();
		return true;
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
