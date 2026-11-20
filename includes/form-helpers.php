<?php
/* Shared helpers for sendmail.php and careers-apply.php */

declare(strict_types=1);

function cfg(): array {
    static $c = null;
    if ($c === null) $c = require __DIR__ . '/config.php';
    return $c;
}

function wants_json(): bool {
    return stripos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false;
}

/** Send the result as JSON (fetch) or as a simple HTML page (no-JS fallback). */
function respond(bool $ok, string $message, string $back): void {
    http_response_code($ok ? 200 : 400);
    if (wants_json()) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'message' => $message]);
        exit;
    }
    header('Content-Type: text/html; charset=utf-8');
    $m = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    $b = htmlspecialchars($back, ENT_QUOTES, 'UTF-8');
    echo "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">"
       . "<title>" . ($ok ? 'Thank you' : 'Please try again') . " | OneClicq</title>"
       . "<style>body{font-family:Montserrat,system-ui,sans-serif;max-width:560px;margin:15vh auto;padding:0 20px;color:#011C53}a{color:#073ED6}</style></head>"
       . "<body><h1>" . ($ok ? 'Thank you' : 'Something went wrong') . "</h1><p>$m</p><p><a href=\"$b\">Go back</a></p></body></html>";
    exit;
}

function field(string $name, int $max = 500): string {
    $v = $_POST[$name] ?? '';
    if (!is_string($v)) return '';
    $v = trim(str_replace(["\r", "\0"], '', $v));
    return mb_substr($v, 0, $max);
}

/** Strip anything that could inject extra mail headers. */
function header_safe(string $v): string {
    return trim(preg_replace('/[\r\n]+/', ' ', $v));
}

function client_ip(): string {
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

/** Spam checks: POST only, honeypot empty, not submitted too fast, optional Turnstile. */
function guard(string $back): void {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') respond(false, 'Please use the form to send your message.', $back);

    if (field('website') !== '') respond(true, 'Thank you — your message has been sent.', $back); // bot: pretend success

    $t = (int)($_POST['form_ts'] ?? 0);
    if ($t > 0 && (time() - (int)($t / 1000)) < cfg()['min_fill_secs']) {
        respond(false, 'That was very fast — please check the form and send it again.', $back);
    }

    $secret = cfg()['turnstile_secret'];
    if ($secret !== '') {
        $token = field('cf-turnstile-response', 2048);
        $ctx = stream_context_create(['http' => [
            'method'  => 'POST',
            'header'  => 'Content-Type: application/x-www-form-urlencoded',
            'content' => http_build_query(['secret' => $secret, 'response' => $token, 'remoteip' => client_ip()]),
            'timeout' => 8,
        ]]);
        $res = @file_get_contents('https://challenges.cloudflare.com/turnstile/v0/siteverify', false, $ctx);
        $json = $res ? json_decode($res, true) : null;
        if (empty($json['success'])) respond(false, 'Please complete the security check and try again.', $back);
    }

    rate_limit($back);
}

function rate_limit(string $back): void {
    $dir = cfg()['rate_dir'];
    if (!is_dir($dir) && !@mkdir($dir, 0700, true)) return; // fail open rather than block real people
    $file = $dir . '/' . hash('sha256', client_ip()) . '.json';
    $now = time();
    $win = cfg()['rate_window_secs'];
    $hits = is_file($file) ? (json_decode((string)file_get_contents($file), true) ?: []) : [];
    $hits = array_values(array_filter($hits, fn($ts) => $ts > $now - $win));
    if (count($hits) >= cfg()['rate_limit']) {
        respond(false, 'You have sent several messages in a short time. Please wait a few minutes, or email ' . cfg()['contact_to'] . '.', $back);
    }
    $hits[] = $now;
    @file_put_contents($file, json_encode($hits), LOCK_EX);
}

/**
 * Send a plain-text email, optionally with one attachment.
 * Uses PHP mail(), which Hostinger supports for addresses on your domain.
 */
function send_mail(string $to, string $subject, string $body, string $replyTo = '', ?array $attachment = null): bool {
    $c = cfg();
    $from = header_safe($c['mail_from']);
    $fromName = header_safe($c['mail_from_name']);
    $subject = '=?UTF-8?B?' . base64_encode(header_safe($subject)) . '?=';

    $headers = [];
    $headers[] = 'From: ' . $fromName . ' <' . $from . '>';
    if ($replyTo !== '' && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) $headers[] = 'Reply-To: ' . header_safe($replyTo);
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'X-Mailer: OneClicq-Website';

    if ($attachment) {
        $boundary = 'b' . bin2hex(random_bytes(12));
        $headers[] = 'Content-Type: multipart/mixed; boundary="' . $boundary . '"';
        $msg  = "--$boundary\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n";
        $msg .= chunk_split(base64_encode($body)) . "\r\n";
        $msg .= "--$boundary\r\nContent-Type: " . $attachment['type'] . '; name="' . $attachment['name'] . "\"\r\n";
        $msg .= "Content-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=\"" . $attachment['name'] . "\"\r\n\r\n";
        $msg .= chunk_split(base64_encode((string)file_get_contents($attachment['path']))) . "\r\n";
        $msg .= "--$boundary--";
    } else {
        $headers[] = 'Content-Type: text/plain; charset=UTF-8';
        $headers[] = 'Content-Transfer-Encoding: base64';
        $msg = chunk_split(base64_encode($body));
    }

    return @mail($to, $subject, $msg, implode("\r\n", $headers), '-f' . $from);
}
