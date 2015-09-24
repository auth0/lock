# Error codes

## POST /passwordless/start

Updated at 9/24/2015.

### HTTP 400

#### Invalid tenant
`{"error":"bad.tenant","error_description":"error in tenant - tenant validation failed: invalid_tenant"}`

#### Missing client_id
`{"error":"bad.client_id","error_description":"Missing required property: client_id"}`

#### Missing connection
`{"error":"bad.connection","error_description":"Missing required property: connection"}`

#### Connection does not exist
`{"error":"bad.connection","error_description":"Connection does not exist"}`

#### Disabled connection
`{"error":"bad.connection","error_description":"Connection is disabled"}`

#### Invalid connection
`{"error":"bad.connection","error_description":"The connection does not support user creation through this API. It must either be a passwordless connection"}`

#### Invalid send parameter
`{"error":"bad.send","error_description":"error in send - No enum match for: <invalid send>"}`

#### Invalid authParams
`{"error":"bad.authParams","error_description":"error in authParams - invalid type: string (expected object)"}`

#### Invalid paramaters
`{"error":"bad.request","error_description":"the following properties are not allowed: <invalid parameter name>"}`

#### Missing email
`{"error":"bad.email","error_description":"Missing required property: email"}`

#### Invalid email
`{"error":"bad.email","error_description":"error in email - email format validation failed: <invalid email>"}`

#### Missing phone_number
`{"error":"bad.phone_number","error_description":"Missing required property: phone_number"}`

#### Invalid phone_number format
`{"error":"bad.phone_number","error_description":"String does not match pattern: ^\\+[0-9]{1,15}$"}`

#### Twilio errors
`{"error":"sms_provider_error","error_description":"<SPECIFIC PROVIDER MESSAGE> (Code: <SPECIFIC PROVIDER CODE>)"}`
