const API_URL = 'http://localhost:5000/api';
const SENSOR_API = 'http://localhost:5001/api/sensorDatagt'
$.get(`${API_URL}/light`)
    .then(response => {
        response.forEach(lights => {
            $('#lightdata tbody').append(`
				<tr>
				    <td>${lights.light}</td>
					<td>${lights.state}</td>
				</tr>`
            );
        });
    })


    .catch(error => {
        console.error(`Error: ${error}`);
    });
$.get(`${API_URL}/devices`)
    .then(response => {
        response.forEach(device => {
            $('#data tbody').append(`
				<tr>
				    <td>${device.user}</td>
					<td>${device.name}</td>
				</tr>`
            );
        });
    })


    .catch(error => {
        console.error(`Error: ${error}`);
    });

$.get(`${API_URL}/ac`)
    .then(response => {
        response.forEach(acs => {
            $('#acdata tbody').append(`
				<tr>
				    <td>${acs.id}</td>
				    <td>${acs.state}</td>
					<td>${acs.temperature}</td>
					<td>${acs.mode}</td>
					<td>${acs.speed}</td>
				</tr>`
            );
        });
    })


    .catch(error => {
        console.error(`Error: ${error}`);
    });

$.get(`${API_URL}/security`)
    .then(response => {
        response.forEach(sec => {
            $('#secdata tbody').append(`
				<tr>
				    <td>${sec.id}</td>
				    <td>${sec.name}</td>
					<td>${sec.access}</td>
					<td>${sec.camera}</td>
				</tr>`
            );
        });
    })


    .catch(error => {
        console.error(`Error: ${error}`);
    });

$.get(`${SENSOR_API}`)
    .then(response => {
        // Add data to table
        response.forEach(sdata => {
            $('#sdata tbody').append(`
                <tr>
                <td>${sdata.data}</td>
                <td>${sdata.timestamp}</td>
                </tr>
            `)
        });
    });

// Update table with new data when it arrives
function updateTable() {
    $.get(`${SENSOR_API}`)
        .then(response => {
            // Remove existing data from table
            $('#sdata tbody').empty();

            // Add new data to table
            response.forEach(sdata => {
                $('#sdata tbody').append(`
                    <tr>
                    <td>${sdata.data}</td>
                    <td>${sdata.timestamp}</td>
                    </tr>
                `)
            });
        });
}

// Call updateTable function every 5 seconds
setInterval(updateTable, 5000);

$('#add-device').on('click', () => {
    const name = $('#name').val();
    const user = $('#user').val();

    const body = {
        name,
        user
    };

    $.post(`${API_URL}/devices`, body)
        .then(response => {
            location.href = '/web/devices-list';
        })
        .catch(error => {
            console.error(`Error: ${error}`);
        });
});

$('#lightbtn').on('click', () => {

    const light = $('#selectLight option:selected').val();
    const state = $('#lightState option:selected').val();

    const lightbody = {
        light,
        state
    }
    $.post(`${API_URL}/light`, lightbody)
        .then(response => {
            location.href = '/activities/lighting';
        })
        .catch(error => {
            console.error(`Error:${error}`);
        });
});


$('#acform').on('click', () => {
    const id = $('#ac-id option:selected').val();
    const state = $('#ac-state option:selected').val();
    const temperature = $('#ac-temperature').val();
    const mode = $('#ac-mode option:selected').val();
    const speed = $('#ac-speed option:selected').val();

    const acbody = {
        id,
        state,
        temperature,
        mode,
        speed
    }

    $.post(`${API_URL}/ac`, acbody)
        .then(response => {
            location.href = '/activities/air-conditioning';
        })
        .catch(error => {
            console.error(`Error:${error}`);
        });
});

$('#secform').on('click', () => {
    const name = $('#secname').val();
    const camera = $('#seccam option:selected').val();
    const access = $('#access option:selected').val();

    const secbody = {
        name,
        access,
        camera
    }

    $.post(`${API_URL}/security`, secbody)
        .then(response => {
            location.href = '/activities/security';
        })
        .catch(error => {
            console.error(`Error:${error}`);
        });
});

