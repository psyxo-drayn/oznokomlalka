<?php
session_start();

// Проверка на повторную отправку
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_SESSION['last_form_submit'])) {
    if (time() - $_SESSION['last_form_submit'] < 5) {
        die("Пожалуйста, не отправляйте форму слишком часто!");
    }
}
$_SESSION['last_form_submit'] = time();

// Настройки подключения
$host = 'localhost';
$dbname = 'cute_survey';
$username = 'root';
$password = '';

try {
    $db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Получаем данные
    $name = $_POST['name'] ?? '';
    $age = $_POST['age'] ?? '';
    $height = $_POST['height'] ?? '';
    $birthdate = $_POST['birthdate'] ?? '';
    $hobbies = $_POST['hobbies'] ?? '';
    
    // Дополнительные вопросы
    $additional = [];
    foreach ($_POST as $key => $value) {
        if (strpos($key, 'question') === 0 && !empty($value)) {
            $additional[$key] = $value;
        }
    }
    $additionalJson = !empty($additional) ? json_encode($additional, JSON_UNESCAPED_UNICODE) : null;
    
    // Вставка данных
    $stmt = $db->prepare("INSERT INTO survey_responses 
                        (name, age, height, birthdate, hobbies, additional_questions) 
                        VALUES (:name, :age, :height, :birthdate, :hobbies, :additional)");
    
    $stmt->execute([
        ':name' => $name,
        ':age' => $age,
        ':height' => $height,
        ':birthdate' => $birthdate,
        ':hobbies' => $hobbies,
        ':additional' => $additionalJson
    ]);
    
    // Явное завершение с перенаправлением
    header('Location: success.html');
    exit;
    
} catch(PDOException $e) {
    die("Ошибка базы данных: " . $e->getMessage());
}