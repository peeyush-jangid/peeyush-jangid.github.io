/* Peeyush Tools Hub – Auth settings. Fill these once. */
window.PJ_AUTH = {
  /* Firebase web config (Firebase console > Project settings > Your apps).
     Agar aapki firebase-config.js already window.firebaseConfig set karti hai to ise khaali chhod sakte hain. */
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    appId: ""
  },
  /* EmailJS (emailjs.com): Account > Public Key, Email Services > Service ID, Email Templates > Template ID.
     Template variables: {{to_email}}, {{to_name}}, {{otp}} */
  emailjs: {
    publicKey: "",
    serviceId: "",
    templateId: ""
  },
  /* Jab tak EmailJS keys nahi bharte, OTP screen par dikhega (sirf testing ke liye). */
  demoOtpWhenNoEmailJs: true,
  usersCollection: "toolUsers"
};
