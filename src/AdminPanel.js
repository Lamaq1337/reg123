// src/AdminPanel.js
import React, { useState, useEffect } from 'react';

function AdminPanel() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        const response = await fetch('http://localhost/registration-app/src/submit_registration.php');
        const data = await response.json();
        setRequests(data);
    };

    const handleAction = async (id, action) => {
        try {
            const response = await fetch(`http://localhost/registration-app/src/submit_registration.php`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `id=${id}&action=${action}`,
            });
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            const data = await response.json();
            alert(data.message);
            fetchRequests();
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    return (
        <div>
            <h2>Администрирование заявок</h2>
            <table>
                <thead>
                    <tr>
                        <th>Имя</th>
                        <th>Email</th>
                        <th>Действие</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request) => (
                        <tr key={request.id}>
                            <td>{request.name}</td>
                            <td>{request.email}</td>
                            <td>
                                <button onClick={() => handleAction(request.id, 'approve')}>Одобрить</button>
                                <button onClick={() => handleAction(request.id, 'reject')}>Отклонить</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminPanel;
