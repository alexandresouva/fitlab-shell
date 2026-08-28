resource "aws_s3_bucket" "mfe_assets" {
  bucket        = "${var.project_name}-${var.environment}-mfe-assets"
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "mfe_assets" {
  bucket = aws_s3_bucket.mfe_assets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_cors_configuration" "mfe_assets" {
  bucket = aws_s3_bucket.mfe_assets.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "mfe_assets" {
  bucket = aws_s3_bucket.mfe_assets.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_policy" "mfe_assets_policy" {
  bucket = aws_s3_bucket.mfe_assets.id
  policy = data.aws_iam_policy_document.s3_mfe_assets_policy.json
}

data "aws_iam_policy_document" "s3_mfe_assets_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.mfe_assets.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.mfe_cdn.arn]
    }
  }
}
