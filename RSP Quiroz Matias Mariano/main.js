const $ = (id) => document.getElementById(id);

let people = new Array();

const addTable = () => {
  const headers = $("header");
  headers.innerHTML = "";

  const selectedInputs = [...inputsDefault,  ...inputsExtranjero, ...inputsCiudadano, ...inputsActions];
  selectedInputs.forEach((hearder) => {
    const th = document.createElement("th");
    th.id = `header-${hearder.id}`;
    th.textContent = hearder.name;
    headers.appendChild(th);
  });
};

const createRow = (item) => {
  const tr = document.createElement("tr");
  const selectedInputs = [...inputsDefault, ...inputsExtranjero, ...inputsCiudadano, ...inputsActions];
  const actions = ["edit", "delete"]

  selectedInputs.forEach((header) => {
    const td = document.createElement("td");
    td.id = `cell-${header.id}`;
    if(actions.includes(header.id)){
      const btn = document.createElement("button");
      btn.id = `btn-${header.id}`;
      btn.textContent = header.name;
      td.appendChild(btn);
    } else {
      td.textContent = item[header.id];
    }
    tr.appendChild(td);
  });
  return tr;
};

const uploadDataTable = (data) => {
  const tbody = $("table-body");
  tbody.innerHTML = "";
  data.forEach((item) => {
    tbody.appendChild(createRow(item));
  });
};

const hideForm = (tohide, toShow) => {
  const formToHide = $(tohide);
  const formToShow = $(toShow);

  formToHide.style.display = "none";
  formToShow.style.display = "flex";
};

const showAbmForm = (toShow, tohide) => {
  const formsToShow = $(toShow);
  const formToShow = $(tohide);
  formsToShow.style.display = "flex";
  formToShow.style.display = "none";
  const btnCancel = $("btn-cancel");
  const btnAccept = $("btn-accept");
  btnCancel.disabled = false;
  btnAccept.disabled = false;
};

const handleDataFormSubmit = (e) => {
  e.preventDefault();
  showAbmForm("form-amb-container", "form-data-container");
  createFormAbm();
};

const createFormAbm = (initialValues) => {
  addInputByDefault(initialValues);
  addInputByTypePerson(initialValues);
};

const createInputField = (name, type) => {
  const inputField = document.createElement("div");
  inputField.id = "input-field";

  const label = document.createElement("label");
  label.textContent = `${name}:`;
  label.setAttribute("for", `input-${name}`);

  const input = document.createElement("input");
  input.placeholder = `Ingrese ${name}`;
  input.type = type;
  input.id = `input-${name}`;
  input.required = true;

  inputField.appendChild(label);
  inputField.appendChild(input);

  return inputField;
};

const addInputByDefault = (initialValues) => {
  const inputsContainer = $("default-inputs-container");
  inputsContainer.innerHTML = "";

  inputsDefault.forEach((input) => {
    const inputContainer = createInputField(input.name, input.type);
    const inputElement = inputContainer.querySelector("input");
    inputElement.id = `input-${input.id}`;
    inputElement.value = initialValues ? initialValues[input.id] : "";

    if (input.id === "id") {
      inputElement.disabled = true;
    }

    if (input.type === "number") {
      inputElement.setAttribute("min", input.min);
    }

    inputsContainer.appendChild(inputContainer);
  });
  const selectTypeOfPerson = $("dll-type-person");

  if (initialValues !== undefined) {
    selectTypeOfPerson.value = initialValues instanceof Extranjero ? "extranjero" : "ciudadano";
    selectTypeOfPerson.disabled = true;
  } else {
    selectTypeOfPerson.disabled = false;
  }
};

const addInputByTypePerson = (initialValues) => {
  const inputsContainer = $("dynamic-inputs-container");
  inputsContainer.innerHTML = "";

  const typeField = $("dll-type-person");
  const selectedInputs = typeField.value === "ciudadano" ? inputsCiudadano : inputsExtranjero;

  selectedInputs.map((input) => {
    const inputContainer = createInputField(input.name, input.type);
    const inputElement = inputContainer.querySelector("input");
    inputElement.id = `input-${input.id}`;
    inputElement.value = initialValues ? initialValues[input.id] : "";
    if (input.type === "number") {
      inputElement.setAttribute("min", input.min);
    }
    inputsContainer.appendChild(inputContainer);
  });
};


const addPerson = (item) => {

  const personObject =
  "dni" in item
      ? new Ciudadano(
        item.id,
        item.nombre,
        item.apellido,
        item.fechaNacimiento,
        item.dni
      )
      : new Extranjero(
        item.id,
        item.nombre,
        item.apellido,
        item.fechaNacimiento,
        item.paisOrigen
      );

        people.push(personObject);
  uploadDataTable(people);
};

const editPerson = (personEdited) => {
  const personId = parseInt(personEdited.id);
  const personToUpdate = people.find(
    (person) => person.id.toString() === personId.toString()
  );

  if (personToUpdate) {
    personToUpdate.update(personEdited);
    uploadDataTable(people);
  }
};

const deletePerson = (id) => {
  const personId = parseInt(id);
  people = people.filter((person) => person.id.toString() !== personId.toString());

  if (people) {
    uploadDataTable(people);
  }
};

const getFormDataAsObject = (formData) => {
  const data = formData.querySelectorAll("input");
  const dataArray = Array.from(data).map((value) => ({
    [value.id.replace("input-", "")]: value.value,
  }));

  return dataArray.reduce((acc, value) => ({ ...acc, ...value }), {});
};

const handleAbmFormSubmit = (e) => {
  e.preventDefault();
  const person = getFormDataAsObject(e.target);
  const btnCancel = $("btn-cancel");
  const btnAccept = $("btn-accept");
  btnCancel.disabled = true;
  btnAccept.disabled = true;
  
  if(person.id){
    put(person);
  } else {
    post(person);
  }
  e.stopPropagation();
};



toggleButtonsDisabled = (disabled) => {
  const dataForm = document.getElementById("form-data-container");
  const buttons = dataForm.querySelectorAll("button");

  buttons.forEach((button) => {
    button.disabled = disabled;
  });
}

const handleEdit = (e) => {
  const row = e.target.closest("tr");
  e.preventDefault();

    if (row) {
      const cellIdElement = row.querySelector("td[id='cell-id']");

      if (cellIdElement) {
        const id = cellIdElement.textContent;
        const personToEdit = people.find(
          (person) => person.id.toString() === id
        );
        showAbmForm("form-amb-container", "form-data-container");
        createFormAbm(personToEdit);
      }
    }
  e.stopPropagation();
}

const handleDelete = (e) => {
  const row = e.target.closest("tr");
  e.preventDefault();

    if (row) {
      const cellIdElement = row.querySelector("td[id='cell-id']");

      if (cellIdElement) {
        const id = cellIdElement.textContent;
        deleteData(id);
      }
    }
  e.stopPropagation();
}

const onClickOnAction = () => {

  const table = $("data-table");

  table.addEventListener("click", (e) => {
  e.preventDefault();

    const clickedButton = document.querySelector('button:focus');
    const buttonId = clickedButton.id; 

    switch (buttonId) {
      case "btn-edit":
        handleEdit(e);
        break;
      case "btn-delete":
        handleDelete(e);
        break;
    }
  e.stopPropagation();

  });
};


const init = (people)=>
{
        console.table(people)
        document.getElementById('spinner').style.display = 'none';
        showAbmForm("form-data-container", "form-amb-container");
        addTable();
        uploadDataTable(people);

        const btnAdd = $("btn_add");
        btnAdd.addEventListener("click", (e) => handleDataFormSubmit(e));

        onClickOnAction();

        const abmForm = $("form-amb-container");
        abmForm.addEventListener("submit", (e) => handleAbmFormSubmit(e));

        $("dll-type-person").addEventListener("click", () => {
        addInputByTypePerson();
        })
    
        const btnCancel = $("btn-cancel");
        btnCancel.addEventListener("click", () => showAbmForm("form-data-container", "form-amb-container"));

}






GetPersonas();