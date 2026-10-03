export const ANALYTICS_EVENTS = {
  PAGE_VIEW: "page_view",
  BLOG_VIEW: "blog_view",
  SESSION_START: "session_start",
  PROJECT_VIEW: "project_view",
  TEMPLATE_VIEW: "template_view",
  TEMPLATE_DEMO_CLICK: "template_demo_click",
  TEMPLATE_CUSTOMIZE_CLICK: "template_customize_click",
  TEMPLATE_INQUIRY_SUBMIT: "template_inquiry_submit",
  START_PROJECT_CLICK: "start_project_click",
  BOOK_NOW_CLICK: "book_now_click",
  WHATSAPP_CLICK: "whatsapp_click",
  EMAIL_CLICK: "email_click",
  PHONE_CLICK: "phone_click",
  CONTACT_FORM_START: "contact_form_start",
  CONTACT_FORM_SUBMIT: "contact_form_submit",
  EXTERNAL_BOOKING_CLICK: "external_booking_click",
  ESTIMATE_COMPLETE: "estimate_complete",
  EXTERNAL_LINK_CLICK: "external_link_click",
  SCROLL_50: "scroll_50",
  SCROLL_90: "scroll_90",
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
