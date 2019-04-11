class DataGetter {
	constructor() {
		this.END_POINT = "https://test-users-api.herokuapp.com/users";
		this.URL_NAMES = "https://randomuser.me/api/?results=20";
	}

	async getUserData(url, method, data, mode) {
		try {
			const response = await fetch(url, {
				"method": method,
				"body": JSON.stringify(data),
				"headers": {
					"Accept": "application/json",
					"Content-Type": "application/json"
				},
				"mode": mode
			});
			this.userData = await response.json();
			return this.userData;
		} catch (error) {
			console.log(error,"request failed");
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

	createUserCard(name, age, id) {
		const formWrap = this.createElement("div", false, "form-wrapper");

		const userCardForm = this.createElement("form", false, "user-form");
		userCardForm.id = id;
		const fieldset = this.createElement("fieldset", false, "form-fieldset");

		const formDecoration = this.createElement("legend", false, "form-decoration");
		formDecoration.textContent = "USER CARD";
		const userName = this.createElement("input", false, "user-card", "name");
		userName.disabled = true;
		userName.value = name;
		const userAge = this.createElement("input", "number", "user-card", "age");
		userAge.disabled = true;
		userAge.value = age;

		const buttonContainer = this.createElement("div", false, "user-card__buttons");
		const buttonChange = this.createElement("button", "button", "button__change", "buttons");
		buttonChange.textContent = "change";
		const buttonSave = this.createElement("button", "button", "button__save", "buttons");
		buttonSave.disabled = true;
		buttonSave.textContent = "save";
		const buttonDelete = this.createElement("button", "button", "button__delete", "buttons");
		buttonDelete.textContent = "delete";

		this.appendElement(buttonContainer, buttonChange, buttonSave, buttonDelete);
		this.appendElement(userCardForm, fieldset);
		this.appendElement(fieldset, formDecoration, userName, userAge, buttonContainer);
		this.appendElement(formWrap, userCardForm);
		this.appendElement(this.userContainer, formWrap);
		return userCardForm;
	}
}

class ShowUser extends Render {
  constructor() {
		super();
		this.userName = document.querySelector(".search__user-name");
		this.userAge = document.querySelector(".search__user-age");
		this.addUserName = document.querySelector(".create__user-name");
		this.addUserAge = document.querySelector(".create__user-age");
	}
	
	searchByName(user) {
		if (user.name.toLowerCase() === this.userName.value.toLowerCase()) {
			return this.createUserCard(user.name, user.age, user.id);
		}
	}

	searchByAge(user) {
		const userAge = parseInt(this.userAge.value);
		if (user.age === userAge) {
			return this.createUserCard(user.name, user.age, user.id);
		}
	}

	searchByNameAndAge(user) {
		const userAge = parseInt(this.userAge.value);
		if (user.name.toLowerCase() === this.userName.value.toLowerCase() && user.age === userAge) {
			return this.createUserCard(user.name, user.age, user.id);
		}
	}

	async getByNameAndAge() {
		await this.getUserData(this.END_POINT, "get");
		this.userData["data"].forEach(user => {
			if (this.userName.value && this.userAge.value) {
				this.searchByNameAndAge(user);
			} else if (this.userName.value) {
				this.searchByName(user);
			} else if (this.userAge.value) {
				this.searchByAge(user);
			}
		});
	}

	async getAllUser() {
		await this.getUserData(this.END_POINT, "get");
		this.userData["data"].forEach(user => {
			return this.createUserCard(user.name, user.age, user.id);
		});
	}

	async createUser() {
		if (this.addUserName.value !== "" && this.addUserAge.value !== undefined) {
			const userAgeNum = parseInt(this.addUserAge.value);
			const userObj = {
				name: this.addUserName.value,
				age: userAgeNum
			};
			await this.getUserData(this.END_POINT, "post", userObj);
			return this.createUserCard(this.addUserName.value, this.addUserAge.value);
		}
	}

	async deleteUser(event) {
		const userCard = event.target.form;
		userCard.remove();
		await this.getUserData(`${this.END_POINT}/${userCard.id}`, "delete");
	}

	clearPage() {
		while (this.userContainer.firstChild) {
			this.userContainer.removeChild(this.userContainer.firstChild);
		}
		this.userName.value = null;
		this.userAge.value = null;
		this.addUserName.value = null;
		this.addUserAge.value = null;
		return this.userContainer;
	}

	changeActivity(element) {
		element.disabled ? element.disabled = false : element.disabled = true;
	}

	toggleInputActivity(event) {
		const formElements = event.target.form.firstChild.childNodes;
		this.buttonChange = formElements[3].childNodes[0];
		this.buttonSave = formElements[3].childNodes[1];
		formElements.forEach(element => this.changeActivity(element));
		this.buttonChange.disabled ? (
			this.changeActivity(this.buttonChange),
			this.changeActivity(this.buttonSave)
		) : (
			this.changeActivity(this.buttonChange),
			this.changeActivity(this.buttonSave)
		);
	}

	async updateUser(event) {
		const formElements = event.target.form.firstChild.childNodes;
		const newName = formElements[1].value;
		const newAge = formElements[2].value;
		const userObj = {
			name: newName,
		  age: newAge
		}
		await this.getUserData(`${this.END_POINT}/${event.target.form.id}`, "put", userObj);
		this.toggleInputActivity(event);
	}

	async updateServer() {
		let arrOfId = [];
		await this.getUserData(this.END_POINT, "get");
		this.userData.data.forEach(object => {
			arrOfId.push(object.id);
		});
		arrOfId.forEach(async id => {
			await this.getUserData(`${this.END_POINT}/${id}`, "delete");
		});
		await this.getUserData(this.URL_NAMES, "get");
		this.userData.results.forEach(async object => {
			const newUser = {
				name: object.name.first.charAt(0).toUpperCase() + object.name.first.slice(1),
				age: (Math.floor(Math.random() * (110 - 1)))
			}
			await this.getUserData(this.END_POINT, "post", newUser);
		});
		console.log(this.userData);
	}
}

document.querySelector(".header-container").addEventListener("click", showUser);
document.querySelector(".search-user__form").addEventListener("keyup", showUser);
document.querySelector(".user-data-container").addEventListener("click", showUser);

function showUser(event) {
	const userData = new ShowUser();
	const elementClass = event.target.classList[0];
	if (elementClass === "show-all") {
		userData.getAllUser();
	} else if (elementClass === "search-user__submit" || event.keyCode == 13) {
		userData.getByNameAndAge();
	} else if (elementClass === "clear-all") {
		userData.clearPage();
	} else if (elementClass === "create-user__submit") {
		userData.createUser();
	} else if (elementClass === "button__delete") {
		userData.deleteUser(event);
	} else if (elementClass === "button__change") {
		userData.toggleInputActivity(event);
	} else if (elementClass === "button__save") {
		userData.updateUser(event);
	} else if (elementClass === "update-server") {
		userData.updateServer();
	}
}
