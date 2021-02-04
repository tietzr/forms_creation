const createUser = (userData) => {
    fetch(`${getConfig().backend_url}/user/create`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(userData)
    }).then(result => result.json()).then(result => {
        hidePageLoading();
        if (!result.error) {
            localStorage.setItem('@questionario-user_data', JSON.stringify(result.user));
            window.location.replace("/pages/forms/list.html");
        } else {
            errorHandler(result);
        }
    }).catch(errorHandler);
}

$(document).ready(() => {
    $("#registerForm").submit(event => {
        const userData = formToJson(event.currentTarget);
        if (userData.password !== userData.confirmPassword){
            setToaster("error", "Senha e confirmação de senha devem ser iguais!");
            return false;
        } 
        showPageLoading();
        createUser(userData);

        return false;
    });
});