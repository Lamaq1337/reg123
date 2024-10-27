// src/RegistrationForm.js
import React, { useState } from 'react';

function RegistrationForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);

        try {
            const response = await fetch('http://localhost/registration-app/src/submit_registration.php', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setStatus(data.message);
        } catch (error) {
            setStatus('Ошибка при отправке данных.');
        }
    };

    return (
        <div>
            <h2>Форма регистрации</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Имя:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <button type="submit">Зарегистрироваться</button>
            </form>
            {status && <p>{status}</p>}
        </div>
    );
}

export default RegistrationForm;
