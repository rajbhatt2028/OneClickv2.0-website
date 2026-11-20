<?php
/* Careers form handler — receives careers.html applications with a resume. */
declare(strict_types=1);
require __DIR__ . '/includes/form-helpers.php';

$back = '/careers.html#apply';
guard($back);
$c = cfg();

$data = [
    'Full name'        => field('full_name', 120),
    'Email'            => field('email', 160),
    'Phone'            => field('phone', 30),
    'Location'         => field('location', 120),
    'Position'         => field('position', 80),
    'Experience'       => field('experience', 40),
    'Current company'  => field('current_company', 120),
    'Expected salary'  => field('expected_salary', 60),
    'LinkedIn'         => field('linkedin', 300),
    'Portfolio/GitHub' => field('portfolio', 300),
    'Why OneClicq'     => field('cover_note', 5000),
];

$errors = [];
if ($data['Full name'] === '')                         $errors[] = 'your full name';
if (!filter_var($data['Email'], FILTER_VALIDATE_EMAIL)) $errors[] = 'a valid email address';
if (!preg_match('/^[0-9+()\-\s]{7,20}$/', $data['Phone'])) $errors[] = 'a valid phone number';
if ($data['Location'] === '')                          $errors[] = 'your current location';
if ($data['Position'] === '')                          $errors[] = 'the position you are applying for';
if ($data['Experience'] === '')                        $errors[] = 'your years of experience';
foreach (['LinkedIn', 'Portfolio/GitHub'] as $k) {
    if ($data[$k] !== '' && !filter_var($data[$k], FILTER_VALIDATE_URL)) $errors[] = "a valid $k link";
}
if (field('consent', 5) === '')                        $errors[] = 'your consent for us to store your application';

/* ---- resume ---- */
$f = $_FILES['resume'] ?? null;
$maxBytes = $c['max_upload_mb'] * 1024 * 1024;
if (!$f || ($f['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
    $errors[] = 'your resume (PDF, DOC or DOCX)';
} elseif ($f['error'] === UPLOAD_ERR_INI_SIZE || $f['error'] === UPLOAD_ERR_FORM_SIZE || $f['size'] > $maxBytes) {
    respond(false, 'Your resume is larger than ' . $c['max_upload_mb'] . ' MB. Please upload a smaller file.', $back);
} elseif ($f['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($f['tmp_name'])) {
    respond(false, 'Your resume did not upload correctly. Please try again.', $back);
}

if ($errors) respond(false, 'Please add ' . implode(', ', $errors) . '.', $back);

$ext = strtolower(pathinfo($f['name'], PATHINFO_EXTENSION));
$mimeOk = [
    'pdf'  => ['application/pdf'],
    'doc'  => ['application/msword', 'application/octet-stream', 'application/x-ole-storage', 'application/CDFV2'],
    'docx' => ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/octet-stream'],
];
$mime = function_exists('finfo_open') ? (string)finfo_file(finfo_open(FILEINFO_MIME_TYPE), $f['tmp_name']) : '';
if (!in_array($ext, $c['allowed_ext'], true) || ($mime !== '' && !in_array($mime, $mimeOk[$ext] ?? [], true))) {
    respond(false, 'Please upload your resume as a PDF, DOC or DOCX file.', $back);
}

/* store outside the public web folder */
if (!is_dir($c['upload_dir']) && !@mkdir($c['upload_dir'], 0700, true)) {
    error_log('careers-apply: cannot create ' . $c['upload_dir']);
    respond(false, 'Sorry, we could not save your application right now. Please email your resume to ' . $c['careers_to'] . '.', $back);
}
$safeName = preg_replace('/[^a-z0-9]+/', '-', strtolower($data['Full name'])) ?: 'applicant';
$stored = date('Ymd-His') . '-' . trim($safeName, '-') . '-' . bin2hex(random_bytes(4)) . '.' . $ext;
$dest = rtrim($c['upload_dir'], '/') . '/' . $stored;
if (!move_uploaded_file($f['tmp_name'], $dest)) {
    respond(false, 'Sorry, we could not save your resume. Please email it to ' . $c['careers_to'] . '.', $back);
}
@chmod($dest, 0600);

/* email HR */
$body = "New job application from oneclicq.in\n--------------------------------\n";
foreach ($data as $k => $v) {
    $body .= str_pad($k . ':', 18) . ($k === 'Why OneClicq' ? "\n$v\n" : ($v ?: '-') . "\n");
}
$body .= "--------------------------------\nResume saved on server as: $stored\nSent " . date('Y-m-d H:i:s T') . "\n";

$ok = send_mail(
    $c['careers_to'],
    'Job application: ' . $data['Position'] . ' — ' . $data['Full name'],
    $body,
    $data['Email'],
    ['path' => $dest, 'name' => $safeName . '-resume.' . $ext, 'type' => $mimeOk[$ext][0]]
);

if (!$ok) {
    error_log('careers-apply: mail() failed for ' . $stored);
    respond(false, 'Your resume was saved, but our notification email failed. Please also email ' . $c['careers_to'] . ' so we do not miss you.', $back);
}

respond(true, 'Thank you, ' . $data['Full name'] . ' — your application has been received. Our team reviews every application and will contact you if your profile matches an opening.', $back);
