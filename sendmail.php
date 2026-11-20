<?php
/* Contact form handler — receives contact.html submissions. */
declare(strict_types=1);
require __DIR__ . '/includes/form-helpers.php';

$back = '/contact.html';
guard($back);

$first   = field('fn', 80);
$last    = field('ln', 80);
$email   = field('em', 160);
$phone   = field('ph', 30);
$company = field('co', 120);
$industry= field('in', 60);
$budget  = field('bu', 60);
$message = field('ms', 5000);
$consent = field('consent', 5);

$errors = [];
if ($first === '')                                 $errors[] = 'first name';
if (!filter_var($email, FILTER_VALIDATE_EMAIL))    $errors[] = 'a valid email address';
if ($phone !== '' && !preg_match('/^[0-9+()\-\s]{7,20}$/', $phone)) $errors[] = 'a valid phone number';
if (mb_strlen($message) < 10)                      $errors[] = 'a short message (at least 10 characters)';
if ($consent === '')                               $errors[] = 'your consent to be contacted';
if (preg_match_all('#https?://#i', $message) > 3)  $errors[] = 'a message with fewer links';

if ($errors) respond(false, 'Please add ' . implode(', ', $errors) . '.', $back);

$body = "New enquiry from oneclicq.in\n"
      . "--------------------------------\n"
      . "Name:     $first $last\n"
      . "Email:    $email\n"
      . "Phone:    " . ($phone ?: '-') . "\n"
      . "Company:  " . ($company ?: '-') . "\n"
      . "Industry: " . ($industry ?: '-') . "\n"
      . "Budget:   " . ($budget ?: '-') . "\n\n"
      . "Message:\n$message\n\n"
      . "--------------------------------\n"
      . "Sent " . date('Y-m-d H:i:s T') . " from IP " . client_ip() . "\n";

$ok = send_mail(cfg()['contact_to'], "Website enquiry: $first $last" . ($company ? " ($company)" : ''), $body, $email);

if (!$ok) respond(false, 'Sorry, we could not send your message right now. Please email ' . cfg()['contact_to'] . ' or call +91 96675 55188.', $back);

respond(true, "Thanks, $first — your message has reached our team. We reply to every enquiry within one business day.", $back);
