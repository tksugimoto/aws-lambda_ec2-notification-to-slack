data "archive_file" "source_code" {
  type        = "zip"
  source_file = "./src/index.js"
  output_path = "./dist/index.zip"
}

resource "aws_lambda_function" "notification" {
  function_name    = "${var.prefix}"
  role             = "${aws_iam_role.iam_for_lambda.arn}"
  runtime          = "nodejs8.10"
  handler          = "index.handler"
  timeout          = 10
  filename         = "${data.archive_file.source_code.output_path}"
  source_code_hash = "${data.archive_file.source_code.output_base64sha256}"

  environment {
    variables = {
      target_region     = "${var.target_region}"
      slack_webhook_url = "${var.slack_webhook_url}"
      channel           = "${var.channel}"
      username          = "${var.username}"
      icon_emoji        = "${var.icon_emoji}"
      text_format       = "${var.ec2_instance_state_text_format}"
    }
  }
}
