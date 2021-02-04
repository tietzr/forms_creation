

const buildQuestionList = (fieldList) => {
    const formItem = $("#questionsForm");
    fieldList.forEach(fieldData => {
        $(buildField(fieldData)).insertBefore(formItem.children().last())
    })
}

const getDataTable = () => {
    return $('#questionsList').DataTable();
}

const fillFormEdit = (formData) => {
    Object.keys(formData).forEach(key => {
        $(`[name="${key}"]`).val(formData[key]);
    });
}

const buildField = (fieldData)  => {
    return `
    <div class="form-group">
        <label ${fieldData.value_required ? 'class="required"' : ""}>${fieldData.question}</label>
        <input class="form-control" placeholder="${fieldData.placeholder}" type="text" ${fieldData.value_required ? "required" : ""} maxlength="${fieldData.max_length}">
    </div>`;
}

$(document).ready(() => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("id")) {
        const formId = urlParams.get("id");

        $("#formName").text(`Formulário: ${formData.name}`);
        startupQuestionsDataTable(formData.questions);
    }
   
});