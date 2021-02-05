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

const startupAnswersList = (answers) => {

    const columnConfig = [
        { title: "Id", data: "_id" },
        { title: "Data de Preenchimento", data: "dtCreate" },
        {
            title: "Ações",
            className: 'form-actions',
            orderable: false,
            data: "actions"
        }
    ];

    answers.forEach(answerData => {
        answerData.actions = buildAnswernActions(answerData);
    });

    const dataTable = $('#answerList').DataTable({
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.10.22/i18n/Portuguese-Brasil.json'
        },
        searching: false,
        lengthChange: false,
        data: answers,
        columns: columnConfig
    });


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

const removeAnswer = (event) => {
    showPageLoading();
    fetch(`${getConfig().backend_url}/answer/delete`,
        {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ answerId: event.currentTarget.attributes.answer_id.value })
        }
    ).then(result => result.json()).then(result => {
        if (!result.error) {
            const dataTable = getAnswersDataTable();
            dataTable.row($(event.currentTarget).parents('tr'))
                .remove()
                .draw();

            hidePageLoading();
            setToaster("success", "Resposta removida com sucesso!");
        } else {
            throw result;
        }
    }).catch(errorHandler);
}
const addAnswerRowEvents = () => {
    $(".answer-remove").off('click').on("click", (event) => {
        confirmationModal("Remover Resposta", `Deseja realmente remover a resposta de id ${event.currentTarget.attributes.answer_id.value}?`,
        () => {
            removeAnswer(event);
        });        
    });

    $(".answer-view").off('click').on("click", (event) => {
        window.location.replace(`/pages/forms/answer/answer.html?formId=${formId}&answerId=${event.currentTarget.attributes.answer_id.value}`);     
    });
}

const getQuestionsDataTable = () => {
    return $('#questionsList').DataTable();
}

const getAnswersDataTable = () => {
    return $('#answerList').DataTable();
}

const buildQuestionActions = (questionData) => {
    return `<span class="list-action question-remove edit-disabled" title="Remover Questão" question_id="${questionData.questionOrder}"><i class="fas fa-trash-alt"></i></span>`;
}

const buildAnswernActions = (answerData) => {
    return `<span class="list-action answer-remove" title="Remover Resposta" answer_id="${answerData._id}"><i class="fas fa-trash-alt"></i></span>
                <span class="list-action answer-view" title="Visualizar Resposta" answer_id="${answerData._id}"><i class="far fa-eye"></i></span>`;
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
            $("#navAnswers").show();
            const formData = result.form;
            formId = formData._id;
            fillFormEdit(formData);

            if (formData.answers.length > 0){
                $(".edit-disabled").hide();
                $(".alert-edit").show();                
            }

            startupAnswersList(formData.answers);
        } else {
            throw result;
        }
    }).catch((error) => {
        setToastarAndRedirect("error", error.message,`/pages/forms/list.html`);
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
    formData._id = formId;
    if (!formId){
        questions.push({
            questionOrder: getNextOrder(questions, "questionOrder"),
            question: "Latitude",
            placeholder: "latitude",
            maxLength: "20",
            required: "true"
        });

        questions.push({
            questionOrder: getNextOrder(questions, "questionOrder"),
            question: "Longitude",
            placeholder: "longitude",
            maxLength: "20",
            required: "true"
        });
    }
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
        if (!result.error) {
            setToastarAndRedirect("success", "Questionário salvo com sucesso!",`/pages/forms/list.html`);
        } else {
            hidePageLoading();
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
    attachLogOut(userData);
    const urlParams = new URLSearchParams(window.location.search);
    showPageLoading();
    startupQuestionsDataTable([]);
    if (urlParams.has("formId")) {
        formId = urlParams.get("formId");
        loadForm(formId);
    } else {
        hidePageLoading();
    }

    $("#builderForm").on("submit", saveForm);
    $("#newQuestion").click(modalQuestionToggle);
    $("#addQuestion").click(handleAddQuestion);
    $("#newAnswer").click(() => {
        window.location.replace(`/pages/forms/answer/answer.html?formId=${formId}`);
    });

    $("#goBackButton").click(() => {
        window.location.replace(`/pages/forms/list.html`);   
    });

});