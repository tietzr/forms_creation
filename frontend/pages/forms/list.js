var formId = null;
var userData = null;

/////////////////// DataGrid

const startupFormsList = (dataSet) => {

    const columnConfig = [
        { title: "Id", data: "_id" },
        { title: "Nome do Questionário", data: "name" },
        {
            title: "Ações",
            className: 'form-actions',
            orderable: false,
            data: "actions"
        }
    ];

    const dataTable = $('#formsList').DataTable({
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.10.22/i18n/Portuguese-Brasil.json'
        },
        searching: false,
        lengthChange: false,
        data: dataSet,
        columns: columnConfig
    });

    dataTable.on('draw', function () {
        addQuestionRowEvents();
    });
}

const loadForms = (userId) => {
    fetch(`${getConfig().backend_url}/form/list`,
        {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ userId: userId })
        }
    ).then(result => result.json()).then(result => {
        if (!result.error) {
            hidePageLoading();
            setFormsDataSource(result.forms)
        } else {
            throw result;
        }
    }).catch(errorHandler);
}

const removeForm = (event) => {
    fetch(`${getConfig().backend_url}/form/delete`,
        {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ formId: event.currentTarget.attributes.form_id.value })
        }
    ).then(result => result.json()).then(result => {
        if (!result.error) {
            const dataTable = getDataTable();
            dataTable.row($(event.currentTarget).parents('tr'))
                .remove()
                .draw();
            hidePageLoading();
            setToaster("success", "Formulário removido com sucesso!");
            loadForms(userData._id);
        } else {
            throw result;
        }
    }).catch(errorHandler);
}

/////////////////// Acesso ao Backend

const setFormsDataSource = (forms) => {
    forms.forEach(formData => {
        formData.actions = buildQuestionActions(formData);
    });
    const datatable = getDataTable();
    datatable.clear();
    datatable.rows.add(forms).draw();
}

const addQuestionRowEvents = () => {
    $(".form-remove").off('click').on("click", (event) => {
        confirmationModal("Remover Questionário", "Deseja realmente remover o questionário? <br> Ao remover o questionário, todas as respostas enviadas também serão removidas.",
            () => {
                removeForm(event);
            });
    });

    $(".form-edit").off('click').on("click", (event) => {
        window.location.replace(`builder/builder.html?formId=${event.currentTarget.attributes.form_id.value}`);
    });

    $(".form-answer").off('click').on("click", (event) => {
        window.location.replace(`answer/answer.html?formId=${event.currentTarget.attributes.form_id.value}`);
    });
}

const getDataTable = () => {
    return $('#formsList').DataTable();
}

const buildQuestionActions = (formData) => {
    return `<span class="list-action form-remove" title="Remover Questionário" form_id="${formData._id}"><i class="fas fa-trash-alt"></i></span>
            <span class="list-action form-edit" title="Editar Questionário" form_id="${formData._id}"><i class="fas fa-edit"></i></span>
            <span class="list-action form-answer" title="Responder Questionário" form_id="${formData._id}"><i class="fas fa-tasks"></i></span>`;
}

const modalQuestionToggle = () => {
    $("#newQuestionModal").modal('toggle');
}

$(document).ready(() => {
    userData = verifyLoggedUser();
    attachLogOut(userData);
    showPageLoading();
    loadForms(userData._id);
    startupFormsList([]);
});