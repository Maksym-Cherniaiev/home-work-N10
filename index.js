class DataGetter {
	constructor() {
		this.END_POINT = "https://test-users-api.herokuapp.com/users/";
	}

	async getUserData(url, method, data) {
		try {
			const response = await fetch(url, {
				"method": method,
				"Content-Type": "application/json",
				"body": JSON.stringify(data)
			})
			this.userData = await response.json();
			console.log(this.userData["data"]);
			return this.userData;
		} catch (error) {
			console.log("request failed");
		}
	}
}

class Render extends DataGetter {
	constructor() {
		super();
		this.userContainer = document.querySelector(".user-data-container");
	}

	createElement(tag, type, ...elemClass) {
		this.element = document.createElement(tag);
		if (type) {
			this.element.type = type;
		}
		elemClass.forEach(element => {
			this.element.classList.add(element);
		});
		return this.element;
	}

	appendElement(father, ...children) {
		children.forEach(child => {
			father.appendChild(child);
		});
		return father;
	}

	createUserCard(name, age) {
		const userCardForm = this.createElement("form", false, "user-card");

		const userName = this.createElement("input", false, "user-card__name");
		userName.value = name;
		const userAge = this.createElement("input", false, "user-card__age");
		userAge.value = age;

		const buttonContainer = this.createElement("div", false, "user-card__buttons");
		const buttonChange = this.createElement("button", "button", "button__change", "buttons");
		buttonChange.textContent = "change";
		const buttonSave = this.createElement("button", "button", "button__save", "buttons");
		buttonSave.textContent = "save";
		const buttonDelete = this.createElement("button", "button", "button__delete", "buttons");
		buttonDelete.textContent = "delete";

		this.appendElement(buttonContainer, buttonChange, buttonSave, buttonDelete);
		this.appendElement(userCardForm, userName, userAge, buttonContainer);
		this.appendElement(this.userContainer, userCardForm);
		return userCardForm;
	}
}

class ShowUser extends Render {
  constructor() {
		super();
		this.userName = document.querySelector(".search__user-name").value;
		this.userAge = document.querySelector(".search__user-age").value;
	}
	
	searchByName(user) {
		if (user.name.toLowerCase().includes(this.userName)) {
			return this.createUserCard(user.name, user.age);
		}
	}

	searchByAge(user) {
		const userAge = parseInt(this.userAge);
		if (user.age === userAge) {
			return this.createUserCard(user.name, user.age);
		}
	}

	async renderByNameAge() {
		await this.getUserData(this.END_POINT, "get");
		this.userData["data"].forEach(user => {
			if (this.userName) {
				return this.searchByName(user);
			} else if (this.userAge) {
				return this.searchByAge(user);
			}
		});
	}

	async renderAllUser() {
		await this.getUserData(this.END_POINT, "get");
		this.userData["data"].forEach(user => {
			return this.createUserCard(user.name, user.age);
		});
	}
}

document.querySelector(".show-all").addEventListener("click", showUser);
document.querySelector(".search-user__submit").addEventListener("click", showUser);
document.querySelector(".search__user-name").addEventListener("keyup", showUser);
document.querySelector(".search__user-age").addEventListener("keyup", showUser);

function showUser(event) {
	const userData = new ShowUser();
	if (event.target.classList[0] === "show-all") {
		userData.renderAllUser();
	} else if (event.target.classList[0] === "search-user__submit" || event.keyCode == 13) {
		userData.renderByNameAge();
	}
}
