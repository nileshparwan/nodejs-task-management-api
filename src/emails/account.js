const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    const msg = {
        to: email, // Change to your recipient
        from: 'nileshparwan.utm.bse16b@gmail.com', // Change to your verified sender || acssociate domain to email
        subject: 'Thanks for joining in',
        text: `Welcome to the app ${name}. Let me know how you get along with the app`,
        // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };

    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent');
        })
        .catch((error) => {
            console.error(error);
        });
};

const CancellationEmail = (email, name) => {
    const msg = {
        to: email, // Change to your recipient
        from: 'nileshparwan.utm.bse16b@gmail.com', // Change to your verified sender || acssociate domain to email
        subject: 'Sorry to see you go',
        text: `Goodbye, ${name}. I hope to see you back soon.`,
        // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };

    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent');
        })
        .catch((error) => {
            console.error(error);
        });
};

module.exports = { sendWelcomeEmail, CancellationEmail };

