import {ResourceManager} from '../database'
import async from "async";


export function sendEmail(email, subject, template) {
	const mailOptions = {
		from: ResourceManager.senderEmail,
		to: email,
		subject: subject,
		html: template
	};

	async.retry(3, (callback) => { ResourceManager.emailTransporter.sendMail(mailOptions, callback)}, function (err, result) {
		if (err) {
			console.error('email failed, check');
			return;
		}
		console.log(`send email to ${email} success`)
	});
}