const {
    parse: parseUrl,
} = require('url');
const https = require('https');
const AWS = require('aws-sdk');

/**** 設定ここから ****/
const target_region = process.env.target_region;
const slack_webhook_url = process.env.slack_webhook_url;
const channel = process.env.channel || '';
const username = process.env.username || '';
const icon_emoji = process.env.icon_emoji || '';
/**** 設定ここまで ****/

AWS.config.update({
	region: target_region,
});

exports.handler = () => {
	const ec2 = new AWS.EC2();

	const params = {};
	ec2.describeInstances(params, (err, data) => {
		if (err) {
			const error_text = `[${err.code}] ${err.message}`;
			console.log(error_text);
			postToSlack(error_text);
		} else {
			const nested_instances = data.Reservations.map(reservation => {
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
			const instances = Array.prototype.concat.apply([], nested_instances);

			const text = instances.sort((a, b) => {
				if (a.state > b.state) return 1;
				if (a.state < b.state) return -1;
				return 0;
			}).map(_ => {
				return `[${_.state}] ${_.type}, ${_.name}: ${_.id}`;
			}).join('\n');
			console.log(text);
			postToSlack(text);
		}
	});
};

function postToSlack(text) {
	const options = parseUrl(slack_webhook_url);
	options.method = 'POST';
	const req = https.request(options, res => {
		res.on('data', chunk => {
			console.log('[OK] ' + chunk.toString());
		}).on('error', e => {
			console.log('ERROR:' + e.stack);
		});
	});

	const body = JSON.stringify({
		channel,
		username,
		icon_emoji,
		text,
	});

	req.write(body);

	req.end();
}
