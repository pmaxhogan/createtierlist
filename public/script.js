const templates = {
	Empty: [],
	"Candy Bars": `
Hershey's
Milky Way
3 Musketeers
Baby Ruth
Almond Joy
Butterfinger
Kit Kat
Snickers
Take 5
Twix
Payday
Heath
Mounds
Mr. Goodbar
Bounty
Hershey's White Chocolate
Hershey's Krackel
Crunch
Hershey's Cookies & Cream
`
		.trim()
		.split("\n")
		.sort(),
	"Car Colors": `
White
Gray
Silver
Blue
Red
Brown
Gold
Green
Tan
Orange
`
		.trim()
		.split("\n"),
	"Star Wars Movies": `
Episode IV - A New Hope
Episode V – The Empire Strikes Back
Episode VI – Return of the Jedi
Episode I – The Phantom Menace
Episode II – Attack of the Clones
Episode III – Revenge of the Sith
Episode VII – The Force Awakens
Episode VIII – The Last Jedi
Episode IX – The Rise of Skywalker
Star Wars: The Clone Wars
Rogue One
Solo
`
		.trim()
		.split("\n")
};

const defaultColors = [
	"#F27A7A",
	"#FEC07F",
	"#FEFF80",
	"#80FF80",
	"#80C0FF",
	"#8080FF",
	"#F379F3"
];

new Vue({
	el: "#app",
	data: {
		templates,
		items: [],
		trash: [],
		categories: "SABCDEF".split("").map((name, idx) => ({
			items: [],
			color: defaultColors[idx],
			name
		})),
		presetToLoad: null,
		textToAdd: "",
		drag: false,
		listName: "Unnamed Tier List"
	},
	methods: {
		// broken
		// paste(event){
		// 	const text = (event.clipboardData || window.clipboardData).getData('text');
		//
		// 	const selection = window.getSelection();
		// 	if (!selection.rangeCount) return false;
		// 	selection.deleteFromDocument();
		// 	selection.getRangeAt(0).insertNode(document.createTextNode(text));
		//
		// 	console.log(selection.focusNode.innerText);
		//
		// 	event.preventDefault();
		// },
		putStateInUrl(){
			const data = {items: this.items, categories: this.categories, listName: this.listName};
			location = "#" + encodeURIComponent(JSON.stringify(data));
		},
		updateState(state){
			this.items = state.items;
			this.categories = state.categories;
			this.listName = state.listName;
		},
		resetItems() {
			this.items = [];
			this.categories.forEach((category) => (category.items = []));
		},
		resetTiers() {
			this.categories = "SABCDEF".split("").map((name, idx) => ({
				items: [],
				color: defaultColors[idx],
				name
			}));
			this.resetItems();
		},
		loadPreset() {
			this.resetItems();
			this.items = templates[this.presetToLoad].map((name) => ({
				name,
				id: Math.random()
			}));
			this.listName = this.presetToLoad + " Tier List";
			this.presetToLoad = null;
		},
		addTier() {
			this.categories.push({
				whiteText: true,
				color: "#424242",
				items: [],
				name: "Edit name"
			});
		},
		addText() {
			this.items.push({
				name: this.textToAdd,
				id: Math.random()
			});
			this.textToAdd = "";
		},
		deleteTier(tier){
			this.categories.splice(this.categories.indexOf(tier), 1);
		},
		onMove({ relatedContext, draggedContext }) {
			const relatedElement = relatedContext.element;
			const draggedElement = draggedContext.element;
			return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed;
		}
	},
	watch: {
		listName(){
			this.putStateInUrl();
		},
		categories: {
			deep: true,
			handler(){
				this.putStateInUrl();
			}
		},
		items(){
			this.putStateInUrl();
		}
	},
	mounted(){
		if(location.hash.length > 1){
			const data = JSON.parse(decodeURIComponent(location.hash.slice(1)));
			this.updateState(data);
		}
	},
	vuetify: new Vuetify({
		theme: { dark: true }
	})
});
