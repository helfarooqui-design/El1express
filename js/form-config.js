/* EL1Express website inquiry forms
   --------------------------------------------------------------
   Provider: Web3Forms (https://web3forms.com)
   Endpoint: https://api.web3forms.com/submit
   Destination inbox: hamzah@elexpresss.org

   Web3Forms delivers each submission to the email address that
   created the access key. This file does not contain that key yet.

   OWNER SETUP (required before the form can deliver mail):
   1. Open https://web3forms.com
   2. Enter hamzah@elexpresss.org and create a free access key.
   3. Open the confirmation message Web3Forms sends to that inbox
      and confirm the address.
   4. Replace YOUR_WEB3FORMS_ACCESS_KEY below with the key they give
      you. Do not add quotes around a different placeholder.
   5. Commit this file and push it to the GitHub Pages branch (main).

   Until the placeholder is replaced, the site will not show a
   success message. Visitors are asked to call or text instead.

   The email subject is set by js/inquiry.js, for example:
   "Driver inquiry - EL1Express website"
*/
window.EL1_FORM_CONFIG = {
  provider: "web3forms",
  endpoint: "https://api.web3forms.com/submit",
  accessKey: "YOUR_WEB3FORMS_ACCESS_KEY",
  to: "hamzah@elexpresss.org"
};
