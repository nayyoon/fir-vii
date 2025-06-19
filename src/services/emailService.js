import emailjs from "@emailjs/browser";

export const sendRegistrationEmail = async (formData) => {
  return emailjs.send(
    "service_tw50ch6",
    "template_5e78h7s",
    {
      to_email: formData.email,
      name: `${formData.firstName}`, //
      user_email: formData.email,
      message: "Your account has been successfully registered!",
    },
    "uqX1fKTUdh-EshuyM"
  );
};
