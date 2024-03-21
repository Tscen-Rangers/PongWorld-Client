import { getToken } from '../../tokenManager.js';

document.getElementById('sendEmailButton').addEventListener('click', async function() {
    const accessToken = getToken(); // 액세스 토큰 가져오기
    try {
        // 이메일 발송을 위한 GET 요청
        const response = await fetch('http://localhost:8000/tcen-auth/verify/', {
            method: 'GET',
            //credentials: 'include', // 쿠키를 포함하여 요청
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
        });
        if (response.ok) {
            alert('Authentication email sent successfully.');
        } else {
            console.error('Failed to send email.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

document.getElementById('verifyCodeForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // 폼 기본 제출 방지

    const code = document.getElementById('code').value;
    const accessToken = getToken(); // 액세스 토큰 가져오기

    try {
        // 인증 코드 검증을 위한 POST 요청
        const response = await fetch('http://localhost:8000/tcen-auth/verify/', {
            method: 'POST',
            //credentials: 'include',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code: code }),
        });

        if (response.ok) {
            alert('Authentication successful');
            // 인증 성공 후의 로직 구현, 예: 페이지 리다이렉션
        } else {
            document.getElementById('error').textContent = 'Authentication failed';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('error').textContent = 'An error occurred';
    }
});