const getUserCookie = () => {
    const cookies = document.cookie.split(';');
    const userCookie = cookies.find((cookie) => {
        return cookie.indexOf('adminusername=') >= 0;
    });
    if (userCookie) {
        const value = userCookie.split('=')[1];
        const valueSet = value.split('&');
        return {
            username: valueSet[0],
            alreadyLogined: valueSet[1]
        }
    }
    return null;
}

const userCookie = getUserCookie();

if (userCookie === null || !userCookie.alreadyLogined) {
    location.replace(createUrl('/toLogin'));
} else {
    document.addEventListener('DOMContentLoaded', () => {
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                location.replace(createUrl('/toLogin'));
            });
        }
    });
}