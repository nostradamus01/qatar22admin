document.cookie = "adminusername=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

const createLoginCookie = (username) => {
    const date = new Date();
    date.setDate(date.getDate() + 4);
    document.cookie = `adminusername=${username}&true; path=/; expires=${date.toUTCString()}`;
}

const getFormData = (form) => {
	let formData = {};
	let data = new FormData(form);
	for (let [key, value] of data.entries()) {
		formData[key] = value;
	}
	return formData;
}

document.addEventListener('DOMContentLoaded', () => {
    const loaderCmp = document.querySelector('.loader');
    stopLoader(loaderCmp);

    const formPanel = document.querySelector('#loginForm');
    formPanel.addEventListener('submit', async (e) => {
        startLoader(loaderCmp);
        e.preventDefault();
        const errorMsg = document.querySelector('.error-msg');
        const formData = getFormData(formPanel);
        const result = await (await sendPostRequest(createUrl('/login'), formData)).json();
        if (result.success) {
            createLoginCookie(formData.username);
            location.replace('../');
        } else {
            errorMsg.innerText = 'Wrong username or password';
            stopLoader(loaderCmp);
        }
    });
});