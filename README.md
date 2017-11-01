# aws-lambda_ec2-notification-to-slack
AWS Lambda(Node.js)でEC2の起動状況をSlackに投げる（構成をTerraformで作る）

## 使い方
1. 事前準備
	* terraform をインストール
1. lamnda関数を作成
	1. 設定用ファイルを作成  
		`terraform.tfvars.sample` ファイルを `terraform.tfvars` という名前でコピー
		```
		cp terraform.tfvars.sample terraform.tfvars
		```
	1. `terraform.tfvars` に設定を書き込む
		* `aws_access_key`
		* `aws_secret_key`
		* `region` (lambda関数を置く)
		* `target_region` (監視対象のEC2)
		* `slack_webhook_url`
		* [任意] `channel` (投稿先チャンネル名)
		* [任意] `username` (投稿表示名)
		* [任意] `icon_emoji` (アイコン)
	1. デプロイ
		```
		terraform apply
		```
