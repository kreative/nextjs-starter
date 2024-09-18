export const AIDN = process.env.NEXT_PUBLIC_AIDN!;
export const SEGMENT_WRITE_KEY = process.env.SEGMENT_WRITE_KEY!;

export const BASE_PAGE_TITLE = "Kreative DocuVet";
export const HOMEPAGE_URL = "https://kreativedocuvet.com";
export const APP_INDEX = "/";
export const KREATIVE_SUPPROT_URL = "https://support.kreativeusa.com";
export const APP_SUPPORT_URL = KREATIVE_SUPPROT_URL + "/docuvet";
export const LOGOUT_CONFIRMATION_PAGE = HOMEPAGE_URL;
export const UNAUTHORIZED_PAGE = "/unauthorized";
export const UNKNOWN_ERROR_REDIRECT_URL = `https://kreativedocuvet.com/500?cause=unknown&aidn=${AIDN}`;
export const LOGIN_URL = APP_INDEX;
export const SETTINGS_URL = "/settings"
export const PROFILE_URL = "/settings";

export const BASE_ROLE = "DOCUVET_BASE";