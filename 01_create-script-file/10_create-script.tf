
resource "null_resource" "create_index_js" {
	triggers = {
		target_region = "${var.target_region}"
		slack_webhook_url = "${var.slack_webhook_url}"
	}
	provisioner "local-exec" {
		command = "node create_index.js.js ${var.target_region} ${var.slack_webhook_url}"
	}
}
