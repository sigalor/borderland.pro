# The Global Burn

Hosting a burn for everybody.

## Setup instructions

1. Run `npm run supabase:start`
2. Run `npm run dev`
3. Go to http://localhost:3000
4. Click on "Click to login", enter any email address and click on "Send magic link"
5. Go to http://localhost:54324/monitor and click on the first entry
6. Copy the 6-digit code from that email into your login tab and submit it
7. Go to http://localhost:54323/project/default/editor and click on "profiles" on the left
8. Set "is_admin" to TRUE for your user
9. Reload your tab with http://localhost:3000/
10. Click on the gear icon titled "Administration" in the top left
11. Click on "Projects" to reach http://localhost:3000/admin/projects
12. Click on "Add project" and enter the following
    - Name: `The Borderland 2025`
    - Type: `burn`
    - Slug: `the-borderland-2025` (determined automatically)
13. Click on "Submit"
14. Click on "The Borderland 2025" in the left bar to reach http://localhost:3000/burn/the-borderland-2025
15. Click on "Configuration" and scroll to the bottom to reach http://localhost:3000/burn/the-borderland-2025/admin/config
16. Go to https://dashboard.stripe.com/test/apikeys, copy out the secret key (starting with `sk_test_`) and copy it into the `stripe_secret_api_key` field of the burn config
17. Run `npm run stripe:listen` in a separate console, copy out the webhook signing secret (starting with `whsec_`) and copy it into the `stripe_webhook_secret` of the burn config
18. Click on "Save configuration"

## TODO

### Questionnaires

- low-income questionnaire
- burner questionnaire

### Features

- adding children
- email notifications (via existing Mailgun)
  - transactional emails (lottery sign-up, etc.)
  - emails when lottery is drawn
- membership scanner

### Fixes

- make fully mobile-ready

## Dreams platform

## Co-creation

Please contact synergies@hermesloom.org for collaboration and co-creation.

## License

[GNU GPL v3 or later](https://spdx.org/licenses/GPL-3.0-or-later.html)
