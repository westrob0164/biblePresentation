<?php
/**
 * Project: [NEW PROJECT NAME]
 * File:    read_db.php
 * Desc:    Retrieves all data from SQLite and sends it as a structured JSON object.
 **/

header('Content-Type: application/json');

try {
    $db = new PDO('sqlite:localstorage.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verify if table exists
    $tableCheck = $db->query("SELECT name FROM sqlite_master WHERE type='table' AND name='storage_items'");

    if ($tableCheck->fetch()) {
        $stmt = $db->query("SELECT key, value FROM storage_items");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $data = [];
        foreach ($rows as $row) {
            $value = $row['value'];
            
            // Safe JSON decoding: checks if string looks like JSON before decoding
            if (is_string($value) && (str_starts_with($value, '{') || str_starts_with($value, '['))) {
                $decoded = json_decode($value, true);
                $data[$row['key']] = (json_last_error() === JSON_ERROR_NONE) ? $decoded : $value;
            } else {
                $data[$row['key']] = $value;
            }
        }
        
        echo json_encode($data, JSON_FORCE_OBJECT);
    } else {
        echo json_encode(new stdClass());
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database Error: " . $e->getMessage()
    ]);
}
?>
