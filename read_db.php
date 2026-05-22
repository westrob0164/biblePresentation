<?php
/**
 * Project: Bible Presentation Exhibit PM
 * File:    read_db.php
 * Desc:    Retrieves all data from SQLite and sends it as a structured JSON object.
 **/

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

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
            
            // 🚀 CORRECTION: Fixed the spelling of str_starts_with
            if (is_string($value) && (str_starts_with($value, '{') || str_starts_with($value, '['))) {
                $decoded = json_decode($value, true);
                $data[$row['key']] = (json_last_error() === JSON_ERROR_NONE) ? $decoded : $value;
            } else {
                $data[$row['key']] = $value;
            }
        }
        
        // 🚀 CORRECTION: Removed JSON_FORCE_OBJECT to protect your tasks/resources array timelines
        echo json_encode($data);
    } else {
        // Return a clean empty object representation if table is missing
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
