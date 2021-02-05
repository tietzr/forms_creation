var formId = null;
var answerId = null;

const loadForm = (formId) => {
    return fetch(`${getConfig().backend_url}/form/${formId}`).then(result => result.json());
}

const loadAnswer = (answerId) => {
    return fetch(`${getConfig().backend_url}/answer/${answerId}`).then(result => result.json());
}

const handleFormData = (results) => {
    if (!results[0].error) {
        const formData = results[0].form;
        setFormDesc(formData.name, answerId);
        buildQuestionList(formData.questions);

        if (answerId) {
            if (!results[1].error) {
                fillFormAnswers(results[1].answer);
            } else {
                throw results[1];
            }
        } else {
            getLocation();
        }
    } else {
        throw results[0];
    }
}

const saveAnswer = () => {
    showPageLoading();

    const answers = getAnswers();

    const answerForm = {
        userId: userData._id,
        formId,
        answers
    }

    fetch(`${getConfig().backend_url}/answer/create`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(answerForm)
    }).then(result => result.json()).then(result => {
        if (!result.error) {
            setToastarAndRedirect("success", "Salvo com sucesso!", `/pages/forms/builder/builder.html?formId=${formId}`)
        } else {
            hidePageLoading();
            errorHandler(result);
        }
    }).catch(errorHandler);
}

const buildQuestionList = (fieldList) => {
    const formItem = $("#questionsForm");
    const locationFields = fieldList.filter(item => item.question == "Latitude" || item.question == "Longitude");
    fieldList.forEach(fieldData => {
        if (fieldData.question != "Latitude" && fieldData.question != "Longitude"){
            $(buildField(fieldData)).insertBefore(formItem.children().last())
        }
    });

    locationFields.forEach(fieldData => {
        $(buildField(fieldData)).insertBefore(formItem.children().last())
    });
}

const fillFormAnswers = (answerData) => {
    const formInputs = $("#questionsForm input").toArray();
    formInputs.forEach(formInput => {
        const answer = answerData.answers.find(answer => answer.questionId == formInput.attributes.question_id.value);
        formInput.value = answer.answer;
        formInput.disabled = true;
    });

    $("#saveButton").hide();
    hidePageLoading();
}

const setFormDesc = (formName, answerId = null) => {
    if (answerId) {
        $("#formName").html(`Formulário: ${formName} <br> Resposta de nº  ${answerId} `);
    } else {
        $("#formName").html(`Formulário: ${formName}`);
    }
}

const getDataTable = () => {
    return $('#questionsList').DataTable();
}

const getAnswers = () => {
    const inputs = $("#questionsForm input").toArray();
    const answers = [];
    inputs.forEach(inputData => {
        answers.push({
            questionId: inputData.attributes.question_id.value,
            answer: inputData.value
        });
    });

    return answers;
}

const buildField = (fieldData) => {
    return `
    <div class="form-group">
        <label ${fieldData.required ? 'class="required"' : ""}>${fieldData.question}</label>
        <input class="form-control form-answer" placeholder="${fieldData.placeholder} (Max ${fieldData.maxLength} caracteres)"  question_id="${fieldData._id}"
            type="text" ${fieldData.required ? "required" : ""} maxlength="${fieldData.maxLength}">
    </div>`;
}

const geolocationError = () => {
    setToastarAndRedirect("error", "A localização é obrigatória para o preenchimento do formulário", "/pages/forms/list.html");
}

const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(loadGeolocation, geolocationError);
    } else {
        setToastarAndRedirect("error", "Browser não possui a funcionalidade de geolocalização.", "/pages/forms/list.html");
    }
}

const loadGeolocation = (position) => {
    const latitude = $("input[placeholder^='latitude']");
    latitude.val(position.coords.latitude);
    latitude.prop('disabled', true);

    const longitude = $("input[placeholder^='longitude']")
    longitude.val(position.coords.longitude);
    longitude.prop('disabled', true);

    hidePageLoading();
} 

$(document).ready(() => {
    const urlParams = new URLSearchParams(window.location.search);
    userData = verifyLoggedUser();
    attachLogOut(userData);

    if (urlParams.has("formId")) {
        formId = urlParams.get("formId");
        showPageLoading();
        const promises = [];
        promises.push(loadForm(formId));
        if (urlParams.has("answerId")) {
            answerId = urlParams.get("answerId");
            promises.push(loadAnswer(answerId));
        }
        Promise.all(promises).then(handleFormData).catch((error) => {
            setToastarAndRedirect("error", error.message, `/pages/forms/list.html`);
        });
    } else {
        setToastarAndRedirect("error", "Questionário não identificado", "/pages/forms/list.html");
    }

    $("#questionsForm").submit(saveAnswer);
    $("#goBackButton").click(() => {
        if (formId) {
            window.location.replace(`/pages/forms/builder/builder.html?formId=${formId}`);
        } else {
            window.location.replace(`/pages/forms/list.html`);
        }
    });
});