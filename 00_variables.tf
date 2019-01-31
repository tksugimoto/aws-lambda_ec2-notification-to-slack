# AWS APIキー変数設定
variable "aws_access_key" {
  description = "AWS アクセスキー ID"
}

variable "aws_secret_key" {
  description = "AWS シークレットアクセスキー"
}

# 名前のPrefix
variable "prefix" {
  description = "自動構築されるリソースの名前のprefix"
}

# リージョン
variable "region" {
  description = "リソースを構築するリージョン"
}

# スケジュール設定
variable "schedule_name" {
  description = "スケジュール定義名"
}

variable "schedule_expression" {
  description = "スケジュール式"
}

variable "target_region" {
  description = "EC2インスタンスの起動状況の調査対象リージョン"
}

variable "slack_webhook_url" {
  description = "Slack WebhookのURL"
}

# Slack 投稿先チャンネル
# format: "#channel-name"
# デフォルト（空文字）はWebhookのデフォルト値
variable "channel" {
  description = "Slack 投稿先チャンネル (format: " #channel-name")"
  default     = ""
}

# Slack 通知のユーザー表示
# デフォルト（空文字）はWebhookのデフォルト値
variable "username" {
  description = "Slack 通知のユーザー表示"
  default     = ""
}

# Slack 通知のアイコン
# format: ":icon_name:"
# デフォルト（空文字）はWebhookのデフォルト値
variable "icon_emoji" {
  description = "Slack 通知のアイコン"
  default     = ""
}

variable "ec2_instance_state_text_format" {
  description = "各インスタンスの状態を通知するテキストのフォーマット"
}
