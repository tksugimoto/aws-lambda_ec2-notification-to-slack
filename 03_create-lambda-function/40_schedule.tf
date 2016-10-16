
resource "aws_cloudwatch_event_rule" "every_hour" {
	name = "every-1-hour"
	schedule_expression = "rate(1 hour)"
}

resource "aws_cloudwatch_event_target" "notification_every_hour" {
	rule = "${aws_cloudwatch_event_rule.every_hour.name}"
	arn = "${aws_lambda_function.notification.arn}"
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_notification" {
	statement_id = "AllowExecutionFromCloudWatch"
	action = "lambda:InvokeFunction"
	function_name = "${aws_lambda_function.notification.function_name}"
	principal = "events.amazonaws.com"
	source_arn = "${aws_cloudwatch_event_rule.every_hour.arn}"
}
