const https = require("https");
const AWS = require("aws-sdk");

/**** 設定ここから ****/
const target_region = "%target_region%";
const slack_webhook_url = "%slack_webhook_url%"
const username = "aws-lambda";
const icon_emoji = ":ghost:";
/**** 設定ここまで ****/

AWS.config.update({
	region: target_region
});

exports.handler = () => {
	var ec2 = new AWS.EC2();

	const params = {};
	ec2.describeInstances(params, (err, data) => {
		if (err) {
			const message = `[${err.code}] ${err.message}`;
			console.log(message);
			postToSlack(message);
		} else {
			const nested_instances = data.Reservations.map(reservation => {
				const instances = reservation.Instances.map(instance => {
					const id = instance.InstanceId;
					const type = instance.InstanceType;
					const state = instance.State.Name;
					const nameObj = instance.Tags.find(tag => tag.Key === "Name");
					const name = nameObj ? nameObj.Value : "[不明]";
					return {id, type, state, name};
				});
				return instances;
			});
			const instances = Array.prototype.concat.apply([], nested_instances);

			const message = instances.sort((a, b) => {
				if (a.state > b.state) return 1;
				if (a.state < b.state) return -1;
				return 0;
			}).map(_ => {
				return `[${_.state}] ${_.type}, ${_.name}: ${_.id}`;
			}).join("\n");
			console.log(message);
			postToSlack(message);
		}
	});
};

function postToSlack(text) {
	if (slack_webhook_url.match(/^https:[/][/]([^/]+)(.*)$/)) {
		const host = RegExp.$1;
		const path = RegExp.$2;
		const options = {
			host: host,
			path: path,
			method: "POST"
		};
		const req = https.request(options, res => {
			res.on("data", chunk => {
				console.log("[OK] " + chunk.toString());
			}).on('error', e => {
				console.log("ERROR:" + e.stack);
			});
		});

		const body = JSON.stringify({
			username: username,
			icon_emoji: icon_emoji,
			text: text
		});

		req.write(body);

		req.end();
	}
}
