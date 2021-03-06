/**
  * This data model of restaurants follows the pattern
  * required by our ViewModel. It contains an array
  * of location objects. Each object contains the following fields:
  * name - The name of the restaraunt or location. Must match the name
  * 	in Yelp to provide reviews.
  * position - The latitude and longitude coordinates as provided by Google Maps.
  * type - Could be used for any location type. Here it is type of food served at location.
  * 	Value is used by the search bar.
  * phone - The ten digit phone number of the location. This is required to retrieve
  * 	Yelp data with a simple JSONP request.
*/
var Restaurants = [
	{
		name: 'Aura Brasserie',
		position: {lat: 29.5966271, lng: -95.6210102},
		type: 'french',
		phone: '2814032872'
	},
	{
		name: 'Azuma on the Lake',
		position: {lat: 29.6013212, lng: -95.6219195},
		type: 'japanese',
		phone: '2813130518'
	},
	{
		name: 'BJ\'s Restaurant & Brewhouse',
		position: {lat: 29.5981547, lng: -95.6200846},
		type: 'american',
		phone: '2812420400'
	},
	{
		name: 'Blu Restaurant',
		position: {lat: 29.596409, lng: -95.6205871},
		type: 'asian',
		phone: '2819037324'
	},
	{
		name: 'Cafe Adobe',
		position: {lat: 29.5979456, lng: -95.6177761},
		type: 'mexican',
		phone: '2812771700'
	},
	{
		name: 'Carrabba\'s',
		position: {lat: 29.5971497, lng: -95.6174173},
		type: 'italian',
		phone: '2819804433'
	},
	{
		name: 'Churrascos Sugar Land',
		position: {lat: 29.602647, lng: -95.6220093},
		type: 'mexican',
		phone: '8325325300'
	},
	{
		name: 'Escalante\'s',
		position: {lat: 29.5967816, lng: -95.6208973},
		type: 'mexican',
		phone: '2812421100'
	},
	{
		name: 'Fish City Grill',
		position: {lat: 29.596686, lng: -95.6217351},
		type: 'american',
		phone: '2814943474'
	},
	{
		name: 'Fish Place',
		position: {lat: 29.5922354, lng: -95.6039822},
		type: 'cajun',
		phone: '2814910003'
	},
	{
		name: 'Five Guys Burgers and Fries',
		position: {lat: 29.6007364, lng: -95.6214347},
		type: 'american',
		phone: '2812777755'
	},
	{
		name: 'Grimaldi\'s Pizzeria',
		position: {lat: 29.5926797, lng: -95.6233109},
		type: 'italian',
		phone: '2812652280'
	},
	{
		name: 'Japaneiro\'s Sushi Bistro & Latin Grill',
		position: {lat: 29.5971985, lng: -95.6214856},
		type: 'japanese',
		phone: '2812421121'
	},
	{
		name: 'Lasagna House',
		position: {lat: 29.5961082, lng: -95.6216352},
		type: 'italian',
		phone: '2812773400'
	},
	{
		name: 'Los Tios Mexican Restaurants',
		position: {lat: 29.5909083, lng: -95.6045173},
		type: 'mexican',
		phone: '2819801313'
	},
	{
		name: 'Lupe Tortilla',
		position: {lat: 29.5991511 , lng: -95.6202543},
		type: 'mexican',
		phone: '2812657500'
	},
	{
		name: 'Pepperoni\'s Pizza',
		position: {lat: 29.5894616, lng: -95.5956314},
		type: 'italian',
		phone: '2812655555'
	},
	{
		name: 'Perry\'s Steakhouse & Grille',
		position: {lat: 29.596735, lng: -95.6227758},
		type: 'american',
		phone: '2815652727'
	},
	{
		name: 'P.F. Chang\'s',
		position: {lat: 29.5954003, lng: -95.6241477},
		type: 'asian',
		phone: '2813138650'
	},
	{
		name: 'The Rouxpour',
		position: {lat: 29.5961863, lng: -95.6201921},
		type: 'cajun',
		phone: '2812407689'
	},
	{
		name: 'Skeeter\'s Mesquite Grill',
		position: {lat: 29.5875688, lng: -95.6240579},
		type: 'american',
		phone: '2819800066'
	},
	{
		name: 'Tierra del Fuego TX',
		position: {lat: 29.5963927, lng: -95.6233511},
		type: 'argentinean',
		phone: '8329994045'
	},
	{
		name: 'Veritas Steak and Seafood',
		position: {lat: 29.6021357, lng: -95.6220455},
		type: 'american',
		phone: '2814912901'
	}
];