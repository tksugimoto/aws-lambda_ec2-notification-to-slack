# aws-lambda_ec2-notification-to-slack
AWS Lambda(Node.js)でEC2の起動状況をSlackに投げる（構成を [Terraform](https://www.terraform.io/ "https://www.terraform.io/") で作る）

## 使い方
1. 事前準備
	* [Terraform](https://www.terraform.io/ "https://www.terraform.io/") をインストール
1. lamnda関数を作成
	1. 設定用ファイルを作成  
		[terraform.tfvars.example](./terraform.tfvars.example) ファイルを `terraform.tfvars` という名前でコピー
		```
		cp terraform.tfvars.example terraform.tfvars
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
		* `ec2_instance_state_text_format` (通知テキストのフォーマット)
			* `state`, `type`, `name`, `id` の変数を使用可能
			* 変数は `%{変数名}` の形で書くと変換される
			* 例
				* `"[%{state}] %{type}, %{name}: %{id}"`
				* `"[:amazon-ec2-%{state}:] %{type}, %{name}: %{id}"`
					* Slackにアイコンを登録しておけば状態をアイコンで表示することも可能
	1. デプロイ
		```
		terraform apply
		```
