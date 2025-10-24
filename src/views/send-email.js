const { Resend } = require('resend');

// Simple sanitizer to escape HTML characters
const sanitize = (str) => {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
};

exports.handler = async function (event, context) {
  // Ensure we're dealing with a POST request
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { name: rawName, email: rawEmail, message: rawMessage } = JSON.parse(event.body);
  const name = sanitize(rawName);
  const email = sanitize(rawEmail);
  const message = sanitize(rawMessage);

  // Basic validation
  if (!name || !email || !message) {
    return { statusCode: 400, body: 'Bad Request: Missing form fields.' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact Form <onboarding@resend.dev>', // Use the default for testing
      to: ['kenneth.irvinb@gmail.com'], // <-- IMPORTANT: Replace with your actual email address
      subject: `New Message from ${name} via Portfolio`,
      reply_to: email,
      html: `
        <p>You have a new contact form submission:</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      return { statusCode: 400, body: JSON.stringify(error) };
    }

    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};