<?php
/**
 * Project: Bible Presentation Exhibit PM
 * File:    api/get_blueprints.php
 * Desc:    Scans the data/blueprints/ directory and returns an array 
 *          of file names to the frontend framework.
 **/

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

// Point directly to your blueprint directory relative to this API script
$dirPath = "../data/blueprints/";
$pdfList = [];

if (is_dir($dirPath)) {
    // Open the folder and iterate through its files
    if ($handle = opendir($dirPath)) {
        while (($file = readdir($handle)) !== false) {
            // Strip out directory navigation strings and hidden system files
            if ($file != "." && $file != ".." && strtolower(pathinfo($file, PATHINFO_EXTENSION)) === 'pdf') {
                $pdfList[] = [
                    "filename" => $file,
                    // Create a clean display title by removing extensions and underscores
                    "title" => ucwords(str_replace(['_', '-'], ' ', pathinfo($file, PATHINFO_FILENAME))),
                    "path" => "data/blueprints/" . $file,
                    "bytes" => filesize($dirPath . $file)
                ];
            }
        }
        closedir($handle);
    }
}

// Alphabetically sort the files so your blueprint items stay organized
usort($pdfList, function($a, $b) {
    return strcmp($a['filename'], $b['filename']);
});

echo json_encode(["success" => true, "files" => $pdfList]);
?>
