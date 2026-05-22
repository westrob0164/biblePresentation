<?php
/**
 * Project: Bible Presentation Exhibit PM
 * File:    api/get_signage.php
 * Desc:    Scans the data/signage/ folder for printable description cards
 *          and table signs, serving them dynamically to the frontend client.
 **/

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$dirPath = "../data/signage/";
$signageList = [];

if (is_dir($dirPath)) {
    if ($handle = opendir($dirPath)) {
        while (($file = readdir($handle)) !== false) {
            if ($file != "." && $file != ".." && strtolower(pathinfo($file, PATHINFO_EXTENSION)) === 'pdf') {
                $signageList[] = [
                    "filename" => $file,
                    "title" => ucwords(str_replace(['_', '-'], ' ', pathinfo($file, PATHINFO_FILENAME))),
                    "path" => "data/signage/" . $file,
                    "bytes" => filesize($dirPath . $file)
                ];
            }
        }
        closedir($handle);
    }
}

// Keep documents alphabetized numerically by their filenames
usort($signageList, function($a, $b) {
    return strcmp($a['filename'], $b['filename']);
});

echo json_encode(["success" => true, "files" => $signageList]);
?>
