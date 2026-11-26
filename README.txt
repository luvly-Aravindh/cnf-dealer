CNF DEALERSHIP LANDING PAGE: HOW TO PUBLISH
===========================================

WHAT'S IN THIS FOLDER
  index.html              The landing page (CSS + JS inside, no frameworks, no outside scripts)
  thank-you.html          Confirmation page shown after the form (not indexed by Google)
  google-apps-script.gs   Code that saves every lead into a Google Sheet
  img/                    Optimised photos (WebP + JPG fallback)
  fonts/                  Quicksand + Lato (same fonts as cnfindia.com), self-hosted
  brochures/              4 product brochures, 0.4 to 1 MB each

1. CONNECT THE LEAD SHEET FIRST (5 minutes, required)
  Follow the steps at the top of google-apps-script.gs, then paste the web-app
  URL into index.html (top of the <script>):
        leadUrl: "https://script.google.com/macros/s/XXXX/exec",
  Until this is filled in, form entries go to WhatsApp only and are NOT saved.
  Your CRM or email tool can pick up new rows from the sheet (Zapier, Make,
  Pabbly, or a CSV export) for the email nurture.

2. UPLOAD
  Upload the whole folder so the page opens at https://cnfindia.com/dealership/
  (index.html, thank-you.html, img/, fonts/ and brochures/ must stay together).
  If the address is different, update the og:image URL in <head> of index.html.

3. HOW THE FORM WORKS
  Every "Become a CNF Dealer", "Get Price", "Get Dealer Price", "Ask for today's
  rate" and "Get a bulk quote" button opens the same 2-step pop-up.

  Step 1: Name, mobile, pin code
    -> saved to the sheet straight away (Stage = step1), so a visitor who stops
       here is not lost.
  Step 2: Dealer type, existing fertiliser business, brands sold now (only if
          they run a business), monthly purchase in 50 kg bags, shop name, email
    -> the SAME row is updated (Stage = complete), matched by a reference
       number like CNF-PKZNJ9I.

  Saving before WhatsApp:
    The page waits for the sheet to receive the lead before moving on (up to
    3.5 seconds). If the network is slow it sends a backup copy as the page
    leaves. If the phone is offline, the lead is kept on the phone and sent
    automatically the next time the page opens.

  Then: thank-you.html shows "Your enquiry is received", the reference number
    and what happens next. On phones, WhatsApp opens by itself after 4 seconds
    with all the details typed in, starting with the original API text:

         Hello CNF... I want to know about the dealership. My pin code is 585102
         Name: Ravi Kumar
         Mobile: +919845012345
         Shop: Sri Sai Agro Centre
         I want to be: Retail dealer
         Fertiliser business: Yes, fertiliser shop
         Brands I sell: Brand A, Brand B
         Monthly purchase: 100 to 500 bags
         Interested in: CNF PDM 14.5% Potash
         Ref: CNF-PKZNJ9I

  Settings at the top of the <script> in index.html:
    leadUrl        where leads are saved (see step 1)
    thankYouUrl    "thank-you.html", or "" to show the confirmation inside the pop-up
    emailRequired  false = email optional (default), true = email must be filled in

  Spam: a hidden field catches simple bots. Their entries are not saved.

4. TRACKING (optional)
  If Google Tag Manager / GA4 / Meta Pixel is on the site, the page sends:
    dealer_form_open, dealer_form_step1, dealer_form_submit,
    dealer_thank_you_view, whatsapp_click, brochure_download
  Meta Pixel: dealer_form_submit also fires "Lead"; WhatsApp clicks fire "Contact".
  For Google Ads you can also count a conversion on visits to thank-you.html.

PDM vs MOP CLAIMS ON THE PAGE
  Kept to facts that can be checked: K2O content (14.5% vs about 60%), chloride-free
  vs contains chloride, molasses vs mined source, adds organic matter, made in India
  vs mostly imported. The page says PDM is not a bag-for-bag swap for MOP and that
  dose follows crop need and soil test. No yield or "better than MOP" claims.

PAGE WEIGHT
  Roughly 300 KB to show the first screen on a phone (HTML, hero photo, logo,
  fonts). Images further down load as the visitor scrolls.
