const ArgIndex = {
	first: 2,
	second: 3
};
const target_region = process.argv[ArgIndex.first];
const slack_webhook_url = process.argv[ArgIndex.second];

const template_vars = {target_region, slack_webhook_url};

const fs = require("fs");
const template_file_name = "./templates/lambda_ec2-description-to-slack-using-https.js";
fs.readFile(template_file_name, "utf8", (err, template) => {
	if (!err) {
		const script = Object.keys(template_vars).reduce((text, key) => {
			return text.replace(`%${key}%`, template_vars[key]);
		}, template);

		fs.writeFile("../02_zip-index.js/index.js", script);
	}
});