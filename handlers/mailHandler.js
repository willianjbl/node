import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
}, {
    from: `${process.env.SMTP_NAME} <${process.env.SMTP_EMAIL}>`,

});

const mailHandler = {
    send: async (options) => {
        await transport.sendMail(options);
    }
};

export default mailHandler;
