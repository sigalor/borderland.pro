# The Global Burn

Hosting a burn for everybody.

Initially for [The Borderland](https://theborderland.se), but designed to be as general, configurable and parameterizable as possible.

## TODO

- add all questions for burner questionnaire (to be provided by Wanda)
- allow adding children (just as membership metadata, i.e. not a "real" membership, children don't need QR codes)
- allow changing name and birthday (admin can change always, participants only before transfer deadline)
- allow search for memberships (both email and name)
- when transfers are closed, also say that instead of hiding the section
- when refunding a membership, deduct Stripe fees
- allow simply giving back membership (deadline equals transfer deadline)
- add warning for membership transfer ("WARNING: it will be gone!")
- mention that we don't use emails for the lottery
- email notifications (via existing Mailgun), only for successful payment (generate and send out membership QR PDF)
- link list (both on theborderland.se and in another section besides the timeline overview)
- membership scanner
- adjust privacy policy according to low-income and burner questionnaire
- get approval for Alversjö membership integration from Caroline
- make fully mobile-ready
- load testing
- deployment on Vercel (members.theborderland.se) and own BL Supabase instance
- host what was previously on borderland.pro on theborderland.se
  - set up Cloudflare redirect from borderland.pro to theborderland.se
- set up dry run with Wanda and other interested testers (if you want to be a tester, let me know!)

## Long-term goals

- consolidating existing tools
  - add the entire dreams system (including receipt submission), i.e. everything what Cobudget and Open Collective currently do
  - add a single interface for all shift signups (clowns, sanctuary, threshold, toilets, etc.)
    - issue so far: realities leads didn't have proper contact details from everyone!
  - add a single interface for rideshares
  - integrate the map and the JOMO guide, i.e. everything what the [Dust app](https://dust.events/) currently does
  - integrate everything Talk currently does
  - add LLM-based AP writing assistance (based on the AP "How to run an AP", which will be published by Rosa soon)
  - add all the functionality for [BurnerBox](https://burnerbox.glide.page/dl/search)
- technical
  - set up as a Progressive Web App (PWA) to allow seamless use on mobile
  - allow "one-click deployment" onto own server, e.g. using [Fly](https://fly.io/)
  - i18n

## Setup instructions

1. Make sure that you have recent versions of Node.js and Docker installed
2. Clone this repository
3. Run `npm install`
4. Run `npm run supabase:start`
5. Run `npm run dev`
6. Go to http://localhost:3000
7. Click on "Click to login", enter any email address and click on "Send magic link"
8. Go to http://localhost:54324/monitor and click on the first entry
9. Copy the 6-digit code from that email into your login tab and submit it
10. Go to http://localhost:54323/project/default/editor and click on "profiles" on the left
11. Set "is_admin" to TRUE for your user
12. Reload your tab with http://localhost:3000/
13. Click on the gear icon titled "Administration" in the top left
14. Click on "Projects" to reach http://localhost:3000/admin/projects
15. Click on "Add project" and enter the following
    - Name: `The Borderland 2025`
    - Type: `burn`
    - Slug: `the-borderland-2025` (determined automatically)
16. Click on "Submit"
17. Click on "The Borderland 2025" in the left bar to reach http://localhost:3000/burn/the-borderland-2025
18. Click on "Configuration" and scroll to the bottom to reach http://localhost:3000/burn/the-borderland-2025/admin/config
19. Go to https://dashboard.stripe.com/test/apikeys, copy out the secret key (starting with `sk_test_`) and copy it into the `stripe_secret_api_key` field of the burn config
20. Run `npm run stripe:listen` in a separate console, copy out the webhook signing secret (starting with `whsec_`) and copy it into the `stripe_webhook_secret` of the burn config
21. Click on "Save configuration"

## Co-creation

Please contact synergies@hermesloom.org for collaboration and co-creation.

## License

[GNU GPL v3 or later](https://spdx.org/licenses/GPL-3.0-or-later.html)
