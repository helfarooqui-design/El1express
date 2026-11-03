/* EL1Express tag configuration
   --------------------------------------------------------------
   Paste the real IDs here, then commit and push to main.

   Google Analytics 4 measurement ID
   Google Analytics → Admin → Data streams → your web stream → Measurement ID
   Looks like G-1A2B3C4D5E. Leave G-XXXXXXXXXX until you have it.

   Google Ads conversion / tag ID
   Google Ads → Tools → Data manager → Google tag → Tag ID
   Looks like AW-1234567890. Leave AW-XXXXXXXXXX until you have it.

   While either value is still the X placeholder, js/tags.js does not
   load that tag.
*/
window.EL1_TAGS = {
  ga4: "G-XXXXXXXXXX",
  ads: "AW-XXXXXXXXXX"
};
