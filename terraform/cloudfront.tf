resource "aws_cloudfront_origin_access_control" "mfe_assets_oac" {
  name                              = "${var.project_name}-${var.environment}-oac"
  description                       = "OAC for MFE S3 Assets Bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "mfe_cdn" {
  origin {
    domain_name              = aws_s3_bucket.mfe_assets.bucket_regional_domain_name
    origin_id                = "S3-MfeAssets"
    origin_access_control_id = aws_cloudfront_origin_access_control.mfe_assets_oac.id
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-MfeAssets"

    # Managed-CachingOptimized Cache Policy
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"

    # Managed-CORS-S3Origin Origin Request Policy (passes Origin header to S3)
    origin_request_policy_id = "88a5eaf4-2fd4-4709-b370-d4c650ea6fcf"

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
  }

  # SPA Routing: Redirect 403/404 back to index.html with HTTP 200
  custom_error_response {
    error_caching_min_ttl = 10
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
  }

  custom_error_response {
    error_caching_min_ttl = 10
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
