<?php
/**
 * Project: [NEW PROJECT NAME]
 * File:    save_to_db.php
 * Desc:    Saves or replaces key-value pairs in SQLite using a fast database transaction.
 **/

header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method Not Allowed"]);
    exit;
}

try {
    $db = new PDO('sqlite:localstorage.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $db->exec("CREATE TABLE IF NOT EXISTS storage_items (
        key TEXT PRIMARY KEY, 
        value TEXT
    )");

    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if ($data && is_array($data)) {
        // Start transaction for high-speed bulk saving
        $db->beginTransaction();

        $stmt = $db->prepare("INSERT OR REPLACE INTO storage_items (key, value) VALUES (:key, :value)");

        foreach ($data as $key => $value) {
            if (is_string($value) || is_array($value) || is_numeric($value)) {
                $stmt->execute([
                    ':key' => $key,
                    ':value' => is_array($value) ? json_encode($value) : $value
                ]);
            }
        }
        
        // Commit all changes to disk at once
        $db->commit();
        echo json_encode(["status" => "success", "message" => "Backup complete!"]);
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid or empty JSON data received"]);
    }
} catch (PDOException $e) {
    // Rollback changes if anything failed during the loop
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database Error: " . $e->getMessage()]);
}
?>
