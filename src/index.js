const {
    parse: parseUrl,
} = require('url');
const https = require('https');
const AWS = require('aws-sdk');

/**** 設定ここから ****/
const targetRegion = process.env.target_region;
const slackWebhookUrl = process.env.slack_webhook_url;
const channel = process.env.channel || '';
const username = process.env.username || '';
const iconEmoji = process.env.icon_emoji || '';
const textFormat = process.env.text_format;
/**** 設定ここまで ****/

AWS.config.update({
	region: targetRegion,
});

exports.handler = () => {
	const ec2 = new AWS.EC2();

	const params = {};
	ec2.describeInstances(params, (err, data) => {
		if (err) {
			const errorText = `[${err.code}] ${err.message}`;
			console.log(errorText);
			postToSlack(errorText);
		} else {
			const nestedInstances = data.Reservations.map(reservation => {
				const instances = reservation.Instances.map(instance => {
					const id = instance.InstanceId;
					const type = instance.InstanceType;
					const state = instance.State.Name;
					const nameObj = instance.Tags.find(tag => tag.Key === 'Name');
					const name = nameObj ? nameObj.Value : '[不明]';
					return {id, type, state, name};
				});
				return instances;
			});
			const instances = Array.prototype.concat.apply([], nestedInstances);

			const text = instances.sort((a, b) => {
				if (a.state > b.state) return 1;
				if (a.state < b.state) return -1;
				if (a.name > b.name) return 1;
				if (a.name < b.name) return -1;
				return 0;
			}).map(instance => {
				return textFormat.replace(/%{[^}]+}/g, (matchedText) => {
					const key = matchedText.slice(2, -1);
					const value = instance[key];
					return typeof value !== 'undefined' ? value : matchedText;
				});
			}).join('\n');
			console.log(text);
			postToSlack(text);
		}
	});
};

function postToSlack(text) {
	const options = parseUrl(slackWebhookUrl);
	options.method = 'POST';

	const body = JSON.stringify({
		channel,
		username,
		icon_emoji: iconEmoji,
		text,
	});

	https.request(options, res => {
		res.on('data', chunk => {
			console.log(`[OK] ${chunk}`);
		}).on('error', e => {
			console.log(`ERROR: ${e.stack}`);
		});
	})
	.end(body);
}
