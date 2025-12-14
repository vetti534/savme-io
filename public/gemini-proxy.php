<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------
// IMPORTANT: Replace this with your actual Gemini API Key
$API_KEY = 'YOUR_GEMINI_API_KEY_HERE'; 
// ------------------------------------------------------------------

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON input']);
    exit;
}

$toolName = $input['toolName'] ?? 'Unknown Tool';
$inputData = $input['inputData'] ?? [];
$resultData = $input['resultData'] ?? [];
$promptType = $input['promptType'] ?? 'advice';

// Construct Prompt (Matching the Node.js logic)
$promptText = "";

if ($promptType === 'advice') {
    $promptText = "
        You are an expert consultant for the tool: {$toolName}.
        The user has input the following data: " . json_encode($inputData) . ".
        The calculated result is: " . json_encode($resultData) . ".
        
        Please provide:
        1. A brief analysis of this result (is it good, bad, average?).
        2. 3-4 actionable tips or recommendations based specifically on these numbers.
        3. Keep the tone professional, helpful, and concise.
        4. Do not use markdown headers (#), just use bullet points and bold text.
    ";
} else if ($promptType === 'summary') {
    $promptText = "
        Summarize the following content or result for {$toolName}:
        " . json_encode($resultData) . "
        Keep it under 100 words.
    ";
} else {
    $promptText = "Analyze this data for {$toolName}: Result: " . json_encode($resultData);
}

// Call Gemini API
$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" . $API_KEY;

$data = [
    "contents" => [
        [
            "parts" => [
                ["text" => $promptText]
            ]
        ]
    ]
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    http_response_code(500);
    echo json_encode(['error' => 'Curl Error: ' . $error]);
    exit;
}

$decodedResponse = json_decode($response, true);

if ($httpCode !== 200) {
    http_response_code(500);
    echo json_encode(['error' => 'Gemini API Error', 'details' => $decodedResponse]);
    exit;
}

// Extract text from Gemini response structure
$generatedText = $decodedResponse['candidates'][0]['content']['parts'][0]['text'] ?? 'No text generated.';

echo json_encode(['insight' => $generatedText]);
?>
