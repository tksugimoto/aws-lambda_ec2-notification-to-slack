
resource "null_resource" "create_index_js" {
	triggers = {
		target_region = "${var.target_region}"
		slack_webhook_url = "${var.slack_webhook_url}"
		templates_file = "${base64sha256(file("./templates/lambda_ec2-description-to-slack-using-https.js"))}"
	}
	provisioner "local-exec" {
		command = "node create_index.js.js ${var.target_region} ${var.slack_webhook_url}"
	}
}
