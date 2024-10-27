<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Или другой порт, на котором запущен сервер
header("Access-Control-Allow-Methods: GET, POST, PUT");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "registration_db";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Ошибка подключения: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Сохранение заявки в таблицу registration_requests
    $name = $_POST["name"] ?? '';
    $email = $_POST["email"] ?? '';

    if (filter_var($email, FILTER_VALIDATE_EMAIL) && !empty($name)) {
        $stmt = $conn->prepare("INSERT INTO registration_requests (name, email) VALUES (?, ?)");
        $stmt->bind_param("ss", $name, $email);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Заявка отправлена на рассмотрение."]);
        } else {
            echo json_encode(["message" => "Ошибка при отправке заявки."]);
        }

        $stmt->close();
    } else {
        echo json_encode(["message" => "Неверные данные."]);
    }
} elseif ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Вывод заявок на модерацию
    $sql = "SELECT id, name, email, status FROM registration_requests WHERE status = 'pending'";
    $result = $conn->query($sql);

    $requests = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $requests[] = $row;
        }
    }

    echo json_encode($requests);
} elseif ($_SERVER["REQUEST_METHOD"] == "PUT") {
    // Обработка одобрения/отклонения заявки
    parse_str(file_get_contents("php://input"), $_PUT);
    $requestId = $_PUT["id"] ?? '';
    $action = $_PUT["action"] ?? '';

    if ($requestId && ($action == 'approve' || $action == 'reject')) {
        $newStatus = $action == 'approve' ? 'approved' : 'rejected';

        // Обновление статуса заявки
        $stmt = $conn->prepare("UPDATE registration_requests SET status = ? WHERE id = ?");
        $stmt->bind_param("si", $newStatus, $requestId);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            if ($newStatus == 'approved') {
                // Перенос данных в таблицу users
                $stmt = $conn->prepare("INSERT INTO users (name, email) SELECT name, email FROM registration_requests WHERE id = ?");
                $stmt->bind_param("i", $requestId);
                $stmt->execute();
            }

            // Удаление записи из таблицы registration_requests
            $stmt = $conn->prepare("DELETE FROM registration_requests WHERE id = ?");
            $stmt->bind_param("i", $requestId);
            $stmt->execute();

            echo json_encode(["message" => "Заявка $newStatus и удалена."]);
        } else {
            echo json_encode(["message" => "Ошибка обновления заявки."]);
        }
        $stmt->close();
    } else {
        echo json_encode(["message" => "Неверные параметры."]);
    }
}

$conn->close();
?>