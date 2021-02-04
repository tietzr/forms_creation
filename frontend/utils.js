// Retorna os dados de configuração do aplicativo
const getConfig = () => {
    return {
        backend_url: "http://localhost:3000"
    }
}

// Requere JQuery e biblioteca Jquery Toaster
// Opções error, warning, success, info
const setToaster = (type, message) => {
    const toastConfig = {
        position: 'top-right',
        heading: 'Atenção',
        text: message,
        showHideTransition: 'fade',
        icon: type
    }
    $.toast(toastConfig);
}

// Retorna um json com os campos do questinário.
// Inputs do form devem ter os attributo "name" preenchidos
const formToJson = (htmlForm) => {
    return Object.fromEntries(new FormData(htmlForm));
}

// Retorna o número sequencial da lista, a partir do valor máximo de um campo.
const getNextOrder = (itemsList, idField) => {
    return (Math.max.apply(Math, itemsList.map(function (o) { return o[idField]; })) | 0) + 1
}

const showPageLoading = () => {
    const loading = $(".page-loading");
    if (loading.length == 0) {
        $("body").append($('<div class="page-loading">Loading&#8230;</div'));
    } else {
        loading.show();
    }
}

const hidePageLoading = () => {
    const loading = $(".page-loading");
    if (loading.length != 0) {
        loading.hide();
    }
}

const errorHandler = (error) => {
    setToaster("error", error.message);
    hidePageLoading();
}

const verifyLoggedUser = () => {
    const userData = JSON.parse(localStorage.getItem("@questionario-user_data"));
    if (userData == null) {
        window.location.replace("/pages/login/login.html")
    } else {
        return userData;
    }
}

const confirmationModal = (title, message, callbackConfirmation, callbackDismiss) => {
    const content = `
    <div id="confirmationModal" class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">${title}</h5>
            </div>
            <div class="modal-body">
                <p>${message}</p>
            </div>
            <div class="modal-footer d-flex justify-content-center">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" id="modalDismiss">Não</button>
                <button type="button" class="btn btn-primary" data-dismiss="modal" id="modalConfirmation">Sim</button>
            </div>
            </div>
        </div>
    </div>
    `;

    $("body").append($(content));
    $("#confirmationModal").modal("toggle");
    $("#modalConfirmation").on("click", () => {
        $("#confirmationModal").modal("toggle");
        $("#confirmationModal").remove();
        callbackConfirmation()
    });
    $("#modalDismiss").on("click", () => {
        $("#confirmationModal").modal("toggle");
        $("#confirmationModal").remove();
        callbackDismiss();
    });
}