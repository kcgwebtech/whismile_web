function register() {
    const id = document.querySelector('.id').value;
    const pw = document.querySelector('.pw').value;
    const data = {
        user_id: id,
        user_pw: pw,
    };

    const request = new XMLHttpRequest();
    request.open('POST', '/api/auth/register', true);
    request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    request.send(JSON.stringify(data));

    request.onload = function() {
        const response = JSON.parse(request.response);
        console.log(response);

        if (response.hasOwnProperty('error')) {
            const message = response.error.message;
            alert(message);
        } else {
            const message = response.data.message;
            alert(message);
            location.href = '/login';
        }
    };
}