/** Mailchimp audience for WC26 alerts — override via MAILCHIMP_AUDIENCE_ID in Vercel. */
export const MAILCHIMP_AUDIENCE_ID =
  process.env.MAILCHIMP_AUDIENCE_ID ?? "1cc5313182";

export const NEWSLETTER_PROVIDER =
  process.env.NEWSLETTER_PROVIDER ?? "mailchimp";
