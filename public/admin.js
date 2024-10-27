document.addEventListener("DOMContentLoaded", () => {
    const requestsTableBody = document.querySelector("#requestsTable tbody");

    // Функция загрузки заявок
    async function loadRequests() {
        try {
            const response = await fetch('http://localhost/registration-app/src/submit_registration.php');
            const requests = await response.json();

            requestsTableBody.innerHTML = ""; // Очищаем таблицу перед добавлением заявок
            requests.forEach(request => {
                const row = document.createElement("tr");

                const nameCell = document.createElement("td");
                nameCell.textContent = request.name;
                row.appendChild(nameCell);

                const emailCell = document.createElement("td");
                emailCell.textContent = request.email;
                row.appendChild(emailCell);

                const actionsCell = document.createElement("td");
                const approveButton = document.createElement("button");
                approveButton.textContent = "Одобрить";
                approveButton.addEventListener("click", () => handleAction(request.id, 'approve'));

                const rejectButton = document.createElement("button");
                rejectButton.textContent = "Отклонить";
                rejectButton.addEventListener("click", () => handleAction(request.id, 'reject'));

                actionsCell.appendChild(approveButton);
                actionsCell.appendChild(rejectButton);
                row.appendChild(actionsCell);

                requestsTableBody.appendChild(row);
            });
        } catch (error) {
            console.error("Ошибка загрузки заявок:", error);
        }
    }

    // Функция для одобрения или отклонения заявки
    async function handleAction(id, action) {
        try {
            const response = await fetch(`http://localhost/registration-app/src/submit_registration.php`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `id=${id}&action=${action}`
            });

            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }

            const data = await response.json();
            alert(data.message);
            loadRequests(); // Обновляем список после действия
        } catch (error) {
            console.error("Ошибка при обработке действия:", error);
        }
    }

    loadRequests(); // Загружаем заявки при загрузке страницы
});
