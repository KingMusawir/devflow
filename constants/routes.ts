const ROUTES = {
  HOME: '/',
  SIGN_UP: '/sign-up',
  SIGN_IN: '/sign-in',
  PROFILE: (id: string) => `/profile/${id}`,
  TAGS: (id: string) => `/tags/${id}`,
  ASK_QUESTION: '/ask-question',
  // FORGOT_PASSWORD: '/forgot-password',
  // RESET_PASSWORD: '/reset-password',
  // VERIFY_EMAIL: '/verify-email',
  // VERIFY_EMAIL_SUCCESS: '/verify-email/success',
};
export default ROUTES;
