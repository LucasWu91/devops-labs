# main.tf in test-endpoint module
data "http" "test_endpoint" {
url = var.endpoint
}
variable "endpoint" {
description = "The endpoint to test"
type = string
}
output "status_code" {
value = data.http.test_endpoint.status_code
}
output "response_body" {
value = data.http.test_endpoint.response_body
}
