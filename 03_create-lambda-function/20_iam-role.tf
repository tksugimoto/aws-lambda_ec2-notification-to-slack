
resource "aws_iam_role" "iam_for_lambda" {
	name = "${var.prefix}-iam_for_lambda"
	assume_role_policy = "${file("./iam-role/assume_role_policy-trust_lambda.json")}"
}

resource "aws_iam_role_policy" "allow_access_ec2_description" {
	name = "${var.prefix}-allow_access_ec2_description"
	role = "${aws_iam_role.iam_for_lambda.id}"
	policy = "${file("./iam-role/policy-allow_access_ec2_description.json")}"
}
