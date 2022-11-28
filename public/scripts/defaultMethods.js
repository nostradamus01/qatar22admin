const _devMode = false;

const createUrl = (url) => {
    return (!_devMode ? '/.netlify/functions/api' : '') + url;
}

// ****************************************************************

const sendPostRequest = async (url, data) => {
	return await fetch(url, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		}
	});
}

const startLoader = (loaderCmp) => {
    loaderCmp.classList.remove('hidden');
}

const stopLoader = (loaderCmp) => {
    loaderCmp.classList.add('hidden');
}