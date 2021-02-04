const login = (loginData) => {
    fetch(`${getConfig().backend_url}/user/login`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(loginData)
    }).then(result => result.json()).then(result => {
        hidePageLoading();
        if (!result.error) {
            localStorage.setItem('@questionario-user_data', JSON.stringify(result.user));
            window.location.replace("/pages/forms/list.html");
        } else {
            errorHandler(result)
        }
    }).catch(errorHandler);
}

$(document).ready(() => {
    $("#loginForm").submit(function (event) {
        const loginData = Object.fromEntries(new FormData(event.currentTarget));
        showPageLoading();
        login(loginData);

        return false;
    });
});