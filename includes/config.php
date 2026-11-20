<?php
/* ============================================================
   OneClicq form settings — edit these before going live.
   This folder is blocked from the web by includes/.htaccess.
   ============================================================ */

return [
    // Where enquiries and applications are delivered
    'contact_to'   => 'hello@oneclicq.in',
    'careers_to'   => 'hello@oneclicq.in',   // e.g. hr@oneclicq.in once that mailbox exists

    // Sender address: must be a mailbox on your own domain (Hostinger rejects others)
    'mail_from'      => 'no-reply@oneclicq.in',
    'mail_from_name' => 'OneClicq Website',

    // Resumes are stored OUTSIDE public_html. On Hostinger the site lives in
    // /home/<user>/domains/oneclicq.in/public_html, so this resolves to
    // /home/<user>/domains/oneclicq.in/private_uploads/resumes
    'upload_dir'   => dirname(__DIR__, 2) . '/private_uploads/resumes',
    'max_upload_mb' => 5,
    'allowed_ext'  => ['pdf', 'doc', 'docx'],

    // Rate limit: max submissions per IP within the window
    'rate_limit'        => 3,
    'rate_window_secs'  => 600,
    'rate_dir'          => dirname(__DIR__, 2) . '/private_uploads/ratelimit',

    // Optional Cloudflare Turnstile CAPTCHA. Leave blank to rely on the
    // honeypot + timing checks. Add both keys, and the site key in the forms.
    'turnstile_secret' => '',

    // Minimum seconds between page load and submit (bots submit instantly)
    'min_fill_secs' => 3,
];
