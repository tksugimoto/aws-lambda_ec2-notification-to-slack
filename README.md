# aws-lambda_ec2-notification-to-slack
AWS Lambda(Node.js)でEC2の起動状況をSlackに投げる（構成をTerraformで作る）

## 使い方
1. 事前準備
	* node をインストール
	* terraform をインストール
1. lambda用scriptを作成
	1. `cd 01_create-script-file`
	1. `cp terraform.tfvars.sample terraform.tfvars`
	1. `terraform.tfvars` に設定を書き込む
		* target_region (監視対象のEC2)
		* slack_webhook_url
	1. `terraform apply`
1. 作成されたscriptをzip
	1. `cd 02_zip-index.js`
	1. `index.js` ファイルをzip圧縮して `index.zip` にする
1. lamnda関数を作成
	1. `cd 03_create-lambda-function`
	1. `cp terraform.tfvars.sample terraform.tfvars`
	1. `terraform.tfvars` に設定を書き込む
		* aws_access_key
		* aws_secret_key
		* region (lambda関数を置く)
	1. `terraform apply`
