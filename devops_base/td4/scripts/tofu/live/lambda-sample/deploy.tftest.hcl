run "deploy" {
  command = apply

  variables {
    endpoint = "https://example.com"
  }
}

run "validate" {
  command = apply

  module {
    source = "../../modules/test-endpoint"
  }

  variables {
    endpoint = "https://example.com"
  }

  assert {
    condition     = output.status_code == 200
    error_message = "Unexpected status: ${output.status_code}"
  }
}

