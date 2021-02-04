var formId = null;
var userData = null;

const startupQuestionsDataTable = (dataSet) => {
    const columnConfig = [
        {
            title: "Id", data: "questionOrder",
            "width": "10%",

        },
        {
            title: "Questão", data: "question",
            "width": "30%",
        },
        {
            title: "Dica", data: "placeholder",
            "width": "30%",
        },
        {
            title: "Tamanho", data: "maxLength",
            "width": "10%",
        },
        {
            title: "Obrigatório",
            data: "required",
            render: function (data, type, row) {
                return data == "true" ? "Sim" : "Não";
            },
            "width": "10%",
        },
        {
            title: "Ações",
            className: 'form-actions',
            orderable: false,
            data: "actions"
        }
    ];

    const dataTable = $('#questionsList').DataTable({
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

const startupAnswersList = (dataSet) => {

    const columnConfig = [
        { title: "Id", data: "answer_id" },
        { title: "Data de Preenchimento", data: "dt_answer" },
        {
            title: "Ações",
            className: 'form-actions',
            orderable: false,
            data: "actions"
        }
    ];

    const dataTable = $('#answerList').DataTable({
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.10.22/i18n/Portuguese-Brasil.json'
        },
        searching: false,
        lengthChange: false,
        data: dataSet,
        columns: columnConfig
    });

// const answersList = result.answers;
    // answersList.forEach(answerData => {
    //     answerData.actions = buildAnswernActions(answerData);
    // });

    dataTable.on('draw', function () {
        addAnswerRowEvents();
    });
}

const addQuestionRowEvents = () => {
    $(".question-remove").off('click').on("click", (event) => {
        const dataTable = getQuestionsDataTable();
        dataTable.row($(event.currentTarget).parents('tr'))
            .remove()
            .draw();
    });
}

const addAnswerRowEvents = () => {
    $(".question-remove").off('click').on("click", (event) => {
        const dataTable = getQuestionsDataTable();
        dataTable.row($(event.currentTarget).parents('tr'))
            .remove()
            .draw();
    });
}

const getQuestionsDataTable = () => {
    return $('#questionsList').DataTable();
}

const buildQuestionActions = (questionData) => {
    return `<span class="question-remove" title="Remover Questão" question_id="${questionData.questionOrder}"><i class="fas fa-trash-alt"></i></span>`;
}

const buildAnswernActions = (answerData) => {
    return `<span class="question-remove" title="Remover Resposta" answer_id="${answerData.answerId}"><i class="fas fa-trash-alt"></i></span>`;
}

const modalQuestionToggle = () => {
    $("#newQuestionModal").modal('toggle');
}

const fillFormEdit = (formData) => {
    Object.keys(formData).forEach(key => {
        $(`[name="${key}"]`).val(formData[key]);
    });

    setQuestionsDataSource(formData.questions);
}

const setQuestionsDataSource = (questiosn) => {
    questiosn.forEach(questionData => {
        questionData.actions = buildQuestionActions(questionData);
    });
    const datatable = getQuestionsDataTable();
    datatable.clear();
    datatable.rows.add(questiosn).draw();
}

const loadForm = (formId) => {
    fetch(`${getConfig().backend_url}/form/${formId}`).then(result => result.json()).then(result => {
        if (!result.error) {
            hidePageLoading();
            $(".answer-list").show();
            const formData = result.form;
            fillFormEdit(formData);
            startupAnswersList([]);
        } else {
            throw result;
        }
    }).catch((error) => {
        setToaster("error", error.message);
        setTimeout(() => {
            window.location.replace(`/pages/forms/list.html`)
        }, 3000);
    });
}

const saveForm = (event) => {
    showPageLoading();
    const questions = getQuestionsDataTable().data().toArray();
    if (questions.length == 0) {
        setToaster("warning", "É necessário adicionar pelo menos uma questão ao questionário antes de salvar!");
        return false;
    }

    const formData = formToJson(event.currentTarget);
    questions.forEach(question => delete question.actions);
    formData.questions = questions;
    formData.userId = userData._id;

    fetch(`${getConfig().backend_url}/form/save`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(formData)
    }).then(result => result.json()).then(result => {
        debugger
        hidePageLoading();
        if (!result.error) {
            window.location.replace(`/pages/forms/builder/builder.html?id=${result.formId}`)
        } else {
            errorHandler(result);
        }
    }).catch(errorHandler);
}

const handleAddQuestion = (event) => {
    $('#questionForm').validate();
    if (!$('#questionForm').valid()){
        setToaster("warning", "Preencha o formulário corretamente!");
        return false;
    }
    const questionData = formToJson($("#questionForm")[0]);

    modalQuestionToggle();
    const dataTable = getQuestionsDataTable();

    questionData.questionOrder = getNextOrder(dataTable.data().toArray(), "questionOrder");
    questionData.actions = buildQuestionActions(questionData);
    dataTable.row.add(questionData).draw();
    $('#questionForm').trigger("reset");
}

$(document).ready(() => {
    userData = verifyLoggedUser();
    const urlParams = new URLSearchParams(window.location.search);
    showPageLoading();
    startupQuestionsDataTable([]);
    if (urlParams.has("id")) {
        formId = urlParams.get("id");
        loadForm(formId);
    } else {
        hidePageLoading();
    }

    $("#builderForm").on("submit", saveForm);
    $("#newQuestion").click(modalQuestionToggle);
    $("#addQuestion").click(handleAddQuestion);
});