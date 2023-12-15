const apiUrl = "https://examenesutn.vercel.app/api/PersonaCiudadanoExtranjero";
// agregar funciones chicas para probar porciones de codigos

function GetPersonas() {


    
    var request = new XMLHttpRequest();
request.open('GET', apiUrl, false);  // El tercer parámetro es `false` para indicar una solicitud síncrona
request.send();
if (request.readyState === 4) {
if (request.status === 200) {
    var jsonData = JSON.parse(request.responseText);
    document.getElementById('spinner').style.display = 'none';
    showAbmForm("form-data-container", "form-amb-container");
    
    const data = jsonData;
    people = data.map(function(item) {
        return "dni" in item
            ?  new Ciudadano(
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
    });
    init(people);
} 
    else 
    {
        alert('Error en la respuesta de la API');
    }
}

};

const post = async (person) => {
    document.getElementById('spinner').style.display = 'flex';
    const objetoJson = { ...person };  // Clonar el objeto para no modificar el original

    // Eliminar el campo 'id' del objeto
    delete objetoJson.id;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(objetoJson),
        });

        document.getElementById('spinner').style.display = 'none';

        if (response.ok) {
            // En caso de recibir un código 200
            const respuestaJson = await response.json();

            // Actualizar el ID con el provisto en la respuesta
            person.id = respuestaJson.id;

            addPerson(person);
            showAbmForm("form-data-container", "form-amb-container");
        } else {
            showAbmForm("form-data-container", "form-amb-container");
            const errorMessage = await response.text();
            alert(`Error (${response.status}): ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error:', error);
        // Manejar el error según sea necesario
    }
};

const put = (person) => {
    document.getElementById('spinner').style.display = 'flex';
    
    
    fetch(apiUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(person)
    })
        .then(response => {
            if (response.ok) {
                document.getElementById('spinner').style.display = 'none';
                showAbmForm("form-data-container", "form-amb-container");
                editPerson(person);
            } else {
                throw new Error(`Error de red: ${response.status}`);
            }
        })
        .catch(error => {
            alert(error);
            document.getElementById('spinner').style.display = 'none';
            showAbmForm("form-data-container", "form-amb-container");
        });   

};


function deleteData(id){
    document.getElementById('spinner').style.display = 'flex';
    toggleButtonsDisabled(true);
    let xml = new XMLHttpRequest();
    xml.onreadystatechange = function() {
        if (xml.readyState==4){
            if (xml.status==200){
                document.getElementById('spinner').style.display = 'none';
                toggleButtonsDisabled(false);
                deletePerson(id);
            }else{
                alert(`Error de red: ${xml.status}`);
                document.getElementById('spinner').style.display = 'none';
                toggleButtonsDisabled(false);
            }
        }
    };

    xml.open("DELETE",apiUrl);
    xml.setRequestHeader("Content-Type", "application/json");
    let o = {id: id};
    xml.send(JSON.stringify(o));
    
}