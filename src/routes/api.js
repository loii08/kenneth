const express = require('express');
const { Resend } = require('resend');
const router = express.Router();

const sanitize = (str) => {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
};

router.post('/send-email', async (req, res) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { name: rawName, email: rawEmail, message: rawMessage } = req.body;

  const name = sanitize(rawName);
  const email = sanitize(rawEmail);
  const message = sanitize(rawMessage);

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing form fields.' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact Form <onboarding@resend.dev>',
      to: ['kenneth.irvinb@gmail.com'],
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
      return res.status(400).json(error);
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;