// Base URL used for every call to the Backend API.
//
// - Local dev (whole repo served as one docroot, e.g. `php -S localhost:8000`):
//   defaults to "/Backend/api", which works out of the box.
// - Production with Frontend and Backend deployed as two separate services
//   (e.g. on Railway): set `window.API_BASE_URL` to the Backend service's
//   public URL + "/api" in a small inline <script> placed before this module
//   is loaded, for example in index.html / map.html:
//
//     <script>
//       window.API_BASE_URL = "https://<backend-service>.up.railway.app/api";
//     </script>
//
export const API_BASE_URL =
  (typeof window !== 'undefined' && window.API_BASE_URL) || '/Backend/api';
