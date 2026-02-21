# Custom Domain Setup Guide (Cloudflare + Cloud Run)

Since you want speed and simplicity, **Cloudflare** is the best choice. It propagates DNS changes instantly (unlike Namecheap which takes hours) and works perfectly with Google Cloud Run.

## Phase 1: Buy the Domain on Cloudflare
1. Go to [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/).
2. Search for `thecookiecounter.app`.
3. Buy it. (It should be ~$14/year).
4. Finish the checkout.

## Phase 2: Tell Google Cloud Run about the Domain
1. Go to the [Google Cloud Console - Cloud Run](https://console.cloud.google.com/run).
2. Click on your service: **cookie-counter-v4**.
3. Click the **"Integrations"** or **"Manage Custom Domains"** button (top bar).
   - If you don't see it, go to the top search bar and type "Cloud Run Domain Mappings".
4. Click **"Add Mapping"**.
5. Select **"Service to map to"**: `cookie-counter-v4`.
6. Select **"Verified domain"**:
   - If `thecookiecounter.app` is not in the list, verify it:
     - Select "Verify a new domain".
     - Enter `thecookiecounter.app`.
     - Google will give you a **TXT record** (e.g., `google-site-verification=...`).
     - **Keep this tab open.**

## Phase 3: Configure Cloudflare DNS
1. In Cloudflare, go to **DNS > Records**.
2. **If verifying ownership**:
   - Add a **TXT** record.
   - **Name**: `@`
   - **Content**: Paste the code from Google.
   - Click Save.
   - *Go back to Google Console and click "Verify". It should work instantly.*

3. **Map the Service**:
   - Once verified, Google Cloud Run will give you:
     - **DNS Record Type**: `A` (or sometimes `CNAME`)
     - **Name/Host**: `@` (or `www`)
     - **Content/Data**: `216.239.32.21` (Example IP address)
   - Go back to Cloudflare.
   - Add an **A record**:
     - **Name**: `@` (means root)
     - **IPv4 Address**: The IP Google gave you.
     - **Proxy Status**: **DNS Only** (Gray Cloud) ☁️.
       - *Note: Cloud Run manages its own SSL certificates. It is easiest to turn off Cloudflare's orange cloud proxy for the initial setup to let Google auto-issue the certificate. Once working, you can turn the orange cloud back on if you want Cloudflare's WAF.*

## Phase 4: Wait for Google SSL
- Google will automatically issue an SSL certificate for `https://thecookiecounter.app`.
- This usually takes **10-15 minutes**.
- Once the green lock appears, you are done!
