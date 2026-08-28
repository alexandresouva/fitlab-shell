output "s3_bucket_name" {
  value       = aws_s3_bucket.mfe_assets.id
  description = "The name of the S3 bucket hosting MFE assets"
}

output "s3_bucket_arn" {
  value       = aws_s3_bucket.mfe_assets.arn
  description = "The ARN of the S3 bucket hosting MFE assets"
}

output "cloudfront_domain_name" {
  value       = aws_cloudfront_distribution.mfe_cdn.domain_name
  description = "The domain name of the CloudFront distribution"
}

output "cloudfront_distribution_id" {
  value       = aws_cloudfront_distribution.mfe_cdn.id
  description = "The ID of the CloudFront distribution"
}
