window.onload = function() {
    if (document.cookie.includes('user')) {
        // TODO JWT 유효성 검사
        alert('이미 로그인되어 있습니다.');
        location.href='/';
    }
};

function login() {
    const id = document.querySelector('.id').value;
    const pw = document.querySelector('.pw').value;
    const data = {
        user_id: id,
        user_pw: pw,
    };

    const request = new XMLHttpRequest();
    request.open('POST', '/api/auth/login', true);
    request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    request.send(JSON.stringify(data));

    request.onload = function() {
        const response = JSON.parse(request.response);
        console.log(response);

        if (response.hasOwnProperty('error')) {
            const message = response.error.message;
            alert(message);
        } else {
            alert('로그인에 성공했습니다!');
            location.href = '/';
        }
    };
}